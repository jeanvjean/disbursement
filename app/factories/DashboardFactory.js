const axios = require('axios');

class DashboardFactory {
  constructor({ config, errors, database, helper, queries, akupayDisbursementService, currentUser }) {
    this.config = config;
    this.errors = errors;
    this.database = database;
    this.helper = helper;
    this.queries = queries;
    this.akupayDisbursementService = akupayDisbursementService;
    this.currentUser = currentUser;
  }

  async dashboardSummary({ query }) {
    try {
      if(this.currentUser.user_type.toLowerCase() === 'partner') {
        query.programmes = this.currentUser.programmes.map(item => item.id);
      } else {
        const result = await this.akupayDisbursementService.allProgramme()
        query.programmes = result.map(item => item.id);
      }

      let { period = 28  } = query;

      if(period === '') {
        period = 2000;
      }
      
      const [sms] = await this.database.query.tx(async (t) => {
        const query1 = t.oneOrNone(this.queries.app.getAll, {
          period: parseInt(period),
          programmes: query.programmes
        });

        return t.batch([query1]);
      });

      query.programmes = query.programmes.toString();

      const response = await this.akupayDisbursementService.getDisbursementReportsSummary({ params: query });

      return { ...sms, ...response };
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async dashboardChart({ query }) {
    try {
      const { period = '7' } = query;

      return 'done';
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }
}

module.exports = DashboardFactory;
