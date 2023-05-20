class UserService {
  constructor({
    config,
    errors,
    database,
    helper,
    queries,
    currentUser,
    constants,
    notificationService,
    akupayDisbursementService,
  }) {
    this.config = config;
    this.errors = errors;
    this.database = database;
    this.helper = helper;
    this.queries = queries;
    this.constants = constants;
    this.currentUser = currentUser;
    this.notificationService = notificationService;
    this.akupayDisbursementService = akupayDisbursementService;
  }

  async create({ 
    body: {
    first_name,
    last_name,
    email,
    user_type,
    phone_number,
    password,
    programmes
  }
}) {
    const user = await this.database.query.oneOrNone(
      this.queries.user.getUserEmailAndType,
      { email }
    );

    if (user) {
      throw new this.errors.BadRequest('User email already exists');
    }

    // const { raw, hash } = await this.helper.generateUserPassword();
    password = await this.helper.hashPassword(password);

    const newUser = await this.database.query.oneOrNone(
      this.queries.user.createUser,
      { first_name, last_name, email, user_type, phone_number, password }
    );

    if(programmes && programmes.length > 0) {
      await this.attachMultipleProgrammes(programmes, newUser.id);
    }

    delete newUser.password;
    return newUser;
  }

  async getAllUsers(query) {
    try {
      const { page = 1, limit = 20, userType, s = '' } = query;
      const { offset } = this.helper.getLimitOffset({ page, limit });
      let dataQuery;
      let dbValues = {};

      if (userType === 'all') {
        dataQuery = this.queries.user.getAllUsers;
      } else {
        dataQuery = this.queries.user.getAllUsersByUserType;
        dbValues.user_type = userType;
      }

      if(s && s !== '') {
        dataQuery += this.queries.user.search;
        dbValues.s = `${s}:*`;
      }

      let dbQuery =
        dataQuery + ' ' + this.queries.base.paginate({ limit, offset });

      const data = await this.database.query.any(dbQuery, dbValues);

      return data;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async getUser(id) {
    let data = await this.database.query.oneOrNone(
      this.queries.user.getUserById,
      [id]
    );

    if (!data) {
      throw new this.errors.BadRequest('User with this ID does not exist');
    }

    const lastLogin = await this.database.query.oneOrNone(this.queries.user.getUserLastLoginActivity, {
      user_id: id,
      activity: this.constants.activities.login,
    });

    const programmes = await this.database.query.any(this.queries.user.getUserProgrammes, { user_id: id });

    data.last_login = lastLogin ? lastLogin.created_at : new Date();
    data.programmes = programmes;
    data.role = data.user_type;

    return data;
  }

  async getProfile() {
    try {

      const user = await this.getUser(this.currentUser.id)

      return user;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async updateProfile(body) {
    const { first_name, last_name, phone_number, programmes = [] } = body;
    const user = await this.database.query.oneOrNone(
      this.queries.user.getUserById,
      [this.currentUser.id]
    );
    if (!user) {
      throw new this.errors.BadRequest('User with this ID does not exist');
    }

    if(phone_number.length !== 11) {
      throw new this.errors.BadRequest('Phone Number should be 11 digits');
    }

    const response = await this.database.query.oneOrNone(
      this.queries.user.updateProfile,
      [user.id, first_name, last_name, phone_number]
    );

    if(user.user_type.toLowerCase() === 'partner' && programmes && programmes.length > 0) {
      await this.attachMultipleProgrammes(programmes, user.id)
    }

    await this.database.query.oneOrNone(this.queries.user.createActivity, [
      user.id,
      this.constants.activities.profileUpdate,
    ]);

    return response;
  }

  async updateUser({ params, body }) {
      const { first_name, last_name, phone_number, programmes = [] } = body;
      const user = await this.database.query.oneOrNone(
        this.queries.user.getUserById,
        [params.id]
      );
      if (!user) {
        throw new this.errors.BadRequest('User with this ID does not exist');
      }

      if(phone_number.length !== 11) {
        throw new this.errors.BadRequest('Phone Number should be 11 digits');
      }

      await this.database.query.any(this.queries.user.updateUserById, [
        user.id,
        first_name || user.first_name,
        last_name || user.last_name,
        phone_number || user.phone_number,
      ]);

      if(user.user_type.toLowerCase() === 'partner' && programmes && programmes.length > 0) {
        await this.attachMultipleProgrammes(programmes, user.id)
      }
  
      await this.database.query.oneOrNone(this.queries.user.createActivity, [
        user.id,
        this.constants.activities.profileUpdate,
      ]);

      return 'Updated successfully';
  }

  async getUserActivity(req) {
    try {
      const results = await this.database.query.manyOrNone(
        this.queries.user.getUserActivity,
        [req.user.id]
      );

      return results;
    } catch (error) {
      throw new this.errors.InternalServer(error.message);
    }
  }

  async changePassword({ body }) {
    try {
      const { password, password_confirmation, old_password } = body;

      const user = await this.database.query.oneOrNone(
        this.queries.user.getUserPassword,
        { id: this.currentUser.id }
      );

      if (!user) {
        throw new this.errors.BadRequest('Current User not found');
      }

      const comparePassword = await this.helper.comparePassword(
        old_password,
        user.password
      );

      if (!comparePassword) {
        throw new this.errors.BadRequest('Old Password does not match');
      }

      const hashPassword = await this.helper.hashPassword(password);

      await this.database.query.oneOrNone(this.queries.user.updatePassword, {
        password: hashPassword,
        id: this.currentUser.id,
      });

      return 'Password Updated successfully';
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async inviteUser({ body }) {
    try {
      // const { email } = body;
      // const { tokenId, expiredAt } = await this.helper.generateResetPasswordLink()
      // let url = this.config.get('server.app.sos_base_uri')
      // url += `/?invite_id=&token=tokenId`
      // await this.notificationService.sendUserInviteMail({ email, url });

      const { email, first_name, last_name, user_type, phone_number, programmes } = body;

      const checkUser = await this.database.query.oneOrNone(
        this.queries.user.getUserByEmail,
        { email }
      );

      if (checkUser) {
        throw new this.errors.BadRequest('User with that email already exists');
      }

      const {
        url,
        tokenId,
        expiredAt,
      } = await this.helper.formResetPasswordLink();

      const user = await this.database.query.oneOrNone(
        this.queries.user.createInvitedUser,
        {
          first_name,
          last_name,
          user_type,
          email,
          phone_number,
          forgot_password_token: tokenId,
        }
      );

      await this.attachMultipleProgrammes(programmes, user.id);

      await this.notificationService.sendUserInviteMail({ user, url });

      return 'Invitation sent successfully';
    } catch (err) {
      throw new this.errors.BadRequest(err.message);
    }
  }

  async attachProgramme({ body: payload }) {
    const { programmes, user_id } = payload

    let user = await this.database.query.oneOrNone(
      this.queries.user.getUserById,
      [user_id]
    );

    if (!user) {
      throw new this.errors.BadRequest('User with this ID does not exist');
    }

    await this.attachMultipleProgrammes(programmes, user_id);

    return 'Programme attached successfully';
  }

  async attachMultipleProgrammes(programmes, user_id) {
    if(!Array.isArray(programmes)) {
      programmes = [ programmes ];
    }

    await this.database.query.tx((t) => {
        programmes.map(programme => {
          if(programme.id && programme.name) {
            return t.oneOrNone(this.queries.user.attachProgramme, {
              user_id, programme_id: programme.id, programme_name: programme.name
            })
          }
        })
    })

    return 'Programme attached successfully'
  }

  async detachProgramme({ params: { id } }) {
    await this.database.query.oneOrNone(
      this.queries.user.detachProgramme,
      { id }
    );

    return 'Programme detached successfully';
  }

  async deactivateUser({ params: { id } }) {
    const user = await this.database.query.oneOrNone(
      this.queries.user.deactivateUser,
      { id }
    );

    return user;
  }

  async activateUser({ params: { id } }) {
    const user = await this.database.query.oneOrNone(
      this.queries.user.activateUser,
      { id }
    );

    return user;
  }

  async getUserProgrammes() {
    
    if(this.currentUser.user_type.toLowerCase() === 'administrator') {
        return await this.akupayDisbursementService.allProgramme();
    }

    return this.currentUser.programmes;
  }
}

module.exports = UserService;
