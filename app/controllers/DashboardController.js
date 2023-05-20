const BaseController = require('./Base');

class DashboardController extends BaseController {
  constructor({ dashboardFactory }) {
    super();
    this.dashboardFactory = dashboardFactory;
  }

  async dashboardSummary(req, res) {
    const data = await this.dashboardFactory.dashboardSummary(req);

    return DashboardController.success(data, req, res);
  }

  async dashboardChart(req, res) {
    const data = await this.dashboardFactory.dashboardChart(req);

    return DashboardController.success(data, req, res);
  }
}

module.exports = DashboardController;
