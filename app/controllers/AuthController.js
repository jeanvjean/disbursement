const BaseController = require('./Base');

class AuthController extends BaseController {
  constructor({ authFactory }) {
    super();
    this.authFactory = authFactory;
  }
  async login(req, res) {
    const data = await this.authFactory.login(req);

    return AuthController.success(data, req, res);
  }

  async forgotPassword(req, res) {
    const data = await this.authFactory.forgotPassword(req);

    return AuthController.success(data, req, res);
  }

  async resetPassword(req, res) {
    const data = await this.authFactory.resetPassword(req);

    return AuthController.success(data, req, res);
  }

  async confirmUserPassword(req, res) {
    const data = await this.authFactory.confirmUserPassword(req);

    return AuthController.success(data, req, res);
  }
}

module.exports = AuthController;
