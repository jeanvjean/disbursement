const BaseController = require('./Base');

class UserController extends BaseController {
  constructor({ userFactory }) {
    super();
    this.userFactory = userFactory;
  }
  async create(req, res) {
    const data = await this.userFactory.create(req);

    return UserController.success(data, req, res, 'user created successfully');
  }

  async getAllUsers(req, res) {
    const data = await this.userFactory.getAllUsers(req.query);

    return UserController.pagination(
      data,
      req,
      res,
      'All users fetched successfully'
    );
  }

  async getUser(req, res) {
    const data = await this.userFactory.getUser(req.params.id);

    return UserController.success(data, req, res, 'User fetched successfully');
  }

  async updateUser(req, res) {
    const data = await this.userFactory.updateUser(req);

    return UserController.success(data, req, res);
  }

  async getProfile(req, res) {
    const data = await this.userFactory.getProfile();

    return UserController.success(data, req, res);
  }

  async getUserActivity(req, res) {
    const data = await this.userFactory.getUserActivity(req);

    return UserController.success(data, req, res);
  }

  async updateProfile(req, res) {
    const data = await this.userFactory.updateProfile(req.body);

    return UserController.success(data, req, res);
  }

  async changePassword(req, res) {
    const data = await this.userFactory.changePassword(req);

    return UserController.success(data, req, res);
  }

  async inviteUser(req, res) {
    const data = await this.userFactory.inviteUser(req);

    return UserController.success(data, req, res);
  }

  async attachProgramme(req, res) {
    const data = await this.userFactory.attachProgramme(req);

    return UserController.success(data, req, res);
  }

  async detachProgramme(req, res) {
    const data = await this.userFactory.detachProgramme(req);

    return UserController.success(data, req, res);
  }

  async deactivateUser(req, res) {
    const data = await this.userFactory.deactivateUser(req);

    return UserController.success(data, req, res);
  }

  async activateUser(req, res) {
    const data = await this.userFactory.activateUser(req);

    return UserController.success(data, req, res);
  }

  async getUserProgrammes(req, res) {
    const data = await this.userFactory.getUserProgrammes(req);

    return UserController.success(data, req, res);
  }
}

module.exports = UserController;
