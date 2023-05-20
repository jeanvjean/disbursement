class AuthFactory {
  constructor({
    config,
    errors,
    database,
    queries,
    helper,
    constants,
    notificationService,
    currentUser
  }) {
    this.config = config;
    this.errors = errors;
    this.database = database;
    this.queries = queries;
    this.helper = helper;
    this.constants = constants;
    this.notificationService = notificationService;
    this.currentUser = currentUser;
  }

  async login({ body }) {
    try {
      const { email, password } = body;
      const user = await this.database.query.oneOrNone(
        this.queries.user.getUserByEmail,
        { email }
      );
      if (!user) {
        throw new this.errors.BadRequest('Invalid Account Details');
      }

      if(user.deactivate_at) {
        throw new this.errors.BadRequest('Your account has been deactivated');
      }

      const comparePassword = await this.helper.comparePassword(
        password,
        user.password
      );

      if (!comparePassword) {
        throw new this.errors.BadRequest('Invalid Account Details');
      }

      const token = await this.helper.generateToken({
        id: user.id,
        user_type: user.user_type,
      });

      const lastLogin = await this.database.query.oneOrNone(this.queries.user.getUserLastLoginActivity, {
        user_id: user.id,
        activity: this.constants.activities.login,
      });

      const response = {
        id: user.id,
        userType: user.user_type,
        user_type: user.user_type,
        role: user.user_type,
        token,
        last_login: lastLogin ? lastLogin.created_at : new Date()
      };

      await this.database.query.oneOrNone(this.queries.user.createActivity, [
        user.id,
        this.constants.activities.login,
      ]);
      
      return response;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async forgotPassword({ body }) {
    try {
      const { email } = body;
      const user = await this.database.query.oneOrNone(
        this.queries.user.getUserByEmail,
        { email }
      );

      if (!user) {
        throw new this.errors.BadRequest(
          'User with that email does not exist'
        );
      }

      const { url, tokenId } = await this.helper.formResetPasswordLink();

      await this.notificationService.sendForgotPasswordMail({ user, url });

      const data = await this.database.query.oneOrNone(
        this.queries.user.updateForgotPasswordToken,
        { forgot_password_token: tokenId, id: user.id }
      );

      return 'A password reset has been sent to your registered email address';
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async resetPassword({ body }) {
    try {
      const { token, password } = body;
      const user = await this.database.query.oneOrNone(
        this.queries.user.selectUserByForgotPasswordToken,
        { token }
      );

      if (!user) {
        throw new this.errors.BadRequest('Invalid token provided');
      }

      const hashPassword = await this.helper.hashPassword(password);

      await this.database.query.oneOrNone(this.queries.user.updatePassword, {
        password: hashPassword,
        id: user.id,
      });

      return 'Password Reset Successfully';
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async confirmUserPassword({ body }) {
    try {
      const { password } = body;

      const user = await this.database.query.oneOrNone(
        this.queries.user.getAllUserDetailByID,
        {id: this.currentUser.id }
      );
      
      const comparePassword = await this.helper.comparePassword(
        password,
        user.password
      );

      if (!comparePassword) {
        throw new this.errors.BadRequest('Invalid Password Details');
      }

      return 'Password Validated Successfully';
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }
}

module.exports = AuthFactory;
