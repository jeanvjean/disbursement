const FlaggedApprovedWorker = require('../queues/workers/flaggedApprove/export');

class DisbursmentFactory {
  constructor({
    config,
    errors,
    database,
    helper,
    queries,
    akupayDisbursementService,
    currentUser,
  }) {
    this.config = config;
    this.errors = errors;
    this.database = database;
    this.helper = helper;
    this.queries = queries;
    this.currentUser = currentUser;
    this.akupayDisbursementService = akupayDisbursementService;
  }

  async all({ query }) {
    if(this.currentUser.user_type.toLowerCase() === 'partner') {
      query.programmes = this.currentUser.programmes.map(item => item.id).toString();
    } else {
      const result = await this.akupayDisbursementService.allProgramme()
      query.programmes = result.map(item => item.id).toString();
    }
    query.programmes = query.programmes.toString();

    const response = await this.akupayDisbursementService.getAllTransactions({
      params: query,
    });

    return response;
  }

  async get({ params }) {
    const response = await this.akupayDisbursementService.getATransactions({
      id: params.id,
    });

    return response;
  }

  async disbursementReportsSummary({ query }) {
    if(this.currentUser.user_type.toLowerCase() === 'partner') {
      query.programmes = this.currentUser.programmes.map(item => item.id).toString();
    } else {
      const result = await this.akupayDisbursementService.allProgramme()
      query.programmes = result.map(item => item.id).toString();
    }

    query.programmes = query.programmes.toString();
    
    const response = await this.akupayDisbursementService.getDisbursementReportsSummary({ params: query });

    return response;
  }

  async createFund({ body }) {
    const response = await this.akupayDisbursementService.createFund({ body });
    
    await this.database.query.oneOrNone(this.queries.fundingLog.create, {
      fund_id: response.id, 
      user_id: this.currentUser.id, 
      status: 'success', 
      amount: response.amount, 
      programme_name: response.programme_name, 
      programme_id: response.programme_id
    });

    return response;
  }

  async getAllFunds({ params, query }) {
    const response = await this.akupayDisbursementService.getAllFunds({ id: params.id, params: query })

    return response;
  }

  async createBand({ body }) {
    const response = await this.akupayDisbursementService.createBand({ body })

    return response;
  }

  async getAllBands() {
    const programmes = this.currentUser.programmes.map(item => item.id).toString();

    const response = await this.akupayDisbursementService.getAllBands({ params: programmes })

    return response;
  }

  async transactionDisbursement({ query }) {
    if(this.currentUser.user_type.toLowerCase() === 'partner') {
      query.programmes = this.currentUser.programmes.map(item => item.id).toString();
    } else {
      const result = await this.akupayDisbursementService.allProgramme()
      query.programmes = result.map(item => item.id).toString();
    }

    const response = await this.akupayDisbursementService.transactionDisbursement({ params: query })

    return response;
  }

  async disursementTransactions({ query }) {
    const response = await this.akupayDisbursementService.disursementTransactions({ params: query })

    return response;
  }

  async disbursementRetracted({ query }) {
    if(this.currentUser.user_type.toLowerCase() === 'partner') {
      query.programmes = this.currentUser.programmes.map(item => item.id);
    } else {
      const result = await this.akupayDisbursementService.allProgramme()
      query.programmes = result.map(item => item.id);
    }
    query.programmes = query.programmes.toString();
    
    const response = await this.akupayDisbursementService.disbursementRetracted({ params: query })

    return response;
  }

  async disbursementCashout({ query }) {
    if(this.currentUser.user_type.toLowerCase() === 'partner') {
      query.programmes = this.currentUser.programmes.map(item => item.id);
    } else {
      const result = await this.akupayDisbursementService.allProgramme()
      query.programmes = result.map(item => item.id);
    }
    query.programmes = query.programmes.toString();

    const response = await this.akupayDisbursementService.disbursementCashout({ params: query })

    return response;
  }

  async uploadError({ query }) {
    const response = await this.akupayDisbursementService.uploadError({ params: query })

    return response;
  }

  async webhookResponse({ query }) {
    const response = await this.akupayDisbursementService.webhookResponse({ params: query })

    return response;
  }

  async approveFlagged({ body, user }) {
    let { transaction_id } = body;
    const response = await this.akupayDisbursementService.approveFlagged({ body })
    
    const { amount, account_number, account_name, status, bank_name, id, programme_name, programme_id } = response;
    await this.database.query.oneOrNone(
      this.queries.flaggedApproved.create,
      { transaction_id:id, user_id: user.id, transaction_status: status, amount, account_name, account_number, bank_name, programme_name, programme_id }
    );
    return response;
  }

  async requery({ body, user }) {
    const response = await this.akupayDisbursementService.requery({ body })
    
    // const { amount, account_number, account_name, status, bank_name, id, programme_name, programme_id } = response;
    // await this.database.query.oneOrNone(
    //   this.queries.flaggedApproved.create,
    //   { transaction_id:id, user_id: user.id, transaction_status: status, amount, account_name, account_number, bank_name, programme_name, programme_id }
    // );
    return response;
  }

  async retry({ body, user }) {
    const response = await this.akupayDisbursementService.retry({ body });
    
    // const { amount, account_number, account_name, status, bank_name, id, programme_name, programme_id } = response;
    // await this.database.query.oneOrNone(
    //   this.queries.flaggedApproved.create,
    //   { transaction_id:id, user_id: user.id, transaction_status: status, amount, account_name, account_number, bank_name, programme_name, programme_id }
    // );
    return response;
  }

  async getAllApprovedFlagged({ query }) {
    const { page = 1, limit = 20, userType, s = '' } = query;
    let dbValues = {};

    const { offset } = this.helper.getLimitOffset({ page, limit });
    let dbQuery = this.queries.flaggedApproved.all
    if(s && s !== '' && s !== 'undefined') {
      dbQuery += this.queries.flaggedApproved.search;
      dbValues.s = `${s}:*`;
    }
    dbQuery = dbQuery + this.queries.base.order('created_at', 'DESC', 'f.');
    dbQuery = dbQuery + this.queries.base.paginate({ limit, offset });
    const response =  await this.database.query.any(dbQuery, dbValues);

    return response;
  }

  async getApprovedFlagged({params}) {
    const response =  await this.database.query.oneOrNone(this.queries.flaggedApproved.get, {id: params.id});

    return response;
  }

  async getApplicantReplies({query}) {
    const response = await this.akupayDisbursementService.getApplicantReplies({
      params: query
    });

    return response;
  }
  async exportTransaction({ query }) {
    query.programmes = this.currentUser.programmes.map(item => item.id).toString();

    const response = await this.akupayDisbursementService.exportTransaction({
      query,
      user: this.currentUser
    });

    return response;
  }

  async exportFunds({ params, query }) {
      const response = await this.akupayDisbursementService.exportFunds({ params, query, user: this.currentUser })
    return response;
  }

  async exportAllBands({ params }) {
    const response = await this.akupayDisbursementService.exportAllBands({ params, user: this.currentUser })

    return response;
  }
  
  async getApplicantRepliesExport({ params, query }) {
    const response = await this.akupayDisbursementService.getApplicantRepliesExport({ params, query, user: this.currentUser })
    return response;
  }

  async exportAllApprovedFlagged({ query }) {
    const { page = 1, limit = 20, userType, s = '' } = query;
    let dbQuery = this.queries.flaggedApproved.all
    dbQuery = dbQuery + this.queries.base.order('created_at', 'DESC', 'f.');

    await FlaggedApprovedWorker.export({
      dbQuery,
      user: this.currentUser
    });
    return true
  }
  async exportDisbursementCashout({ query, params }) {
      const response = await this.akupayDisbursementService.exportDisbursementCashout({ query, params, user: this.currentUser })

    return response;
  }
  async getAllSMSLogs({ params, query }) {
    const response = await this.akupayDisbursementService.getAllSMSLogs({ params, query, user: this.currentUser })
    return response;
  }

  async exportWebhookResponse({ params, query }) {
    const response = await this.akupayDisbursementService.exportWebhookResponse({ params, query, user: this.currentUser })
    return response;
  }
  async exportUploadError({ query, params }) {
    const response = await this.akupayDisbursementService.exportUploadError({ query, params, user: this.currentUser})

    return response;
  }
  
  async exportDisbursementRetracted({ query, params }) {
    
    const response = await this.akupayDisbursementService.exportDisbursementRetracted({query, params, user: this.currentUser })

    return response;
  }

  async exportTransactionDisbursement({ query, params  }) {
    const response = await this.akupayDisbursementService.exportTransactionDisbursement({ query, params, user: this.currentUser })

    return response;
  }
  async exportSMSLogs({ params, query }) {
    const response = await this.akupayDisbursementService.exportSMSLogs({ params, query, user: this.currentUser })

    return response;
  }

  async getFundingLogs({ query }) {
    const { page = 1, limit = 20, status = '', s = '' } = query;
    let dbValues = {};

    const { offset } = this.helper.getLimitOffset({ page, limit });
    let dbQuery = this.queries.fundingLog.all
    let dbQuery2 = this.queries.fundingLog.getLogsTotal;

    if(s && s !== '' && s !== 'undefined') {
      dbQuery += this.queries.fundingLog.search;
      dbQuery2 += this.queries.fundingLog.search;
      dbValues.s = `${s}:*`;
    }
    if(status && status !== '' && status !== 'undefined') {
      dbQuery += this.queries.fundingLog.filterByStatus
      dbQuery2 += this.queries.fundingLog.filterByStatus;
      dbValues.status = status
    }
    dbQuery = dbQuery + this.queries.base.order('created_at', 'DESC', 'f.');
    dbQuery = dbQuery + this.queries.base.paginate({ limit, offset });

    const [ data, total ] = await this.database.query.tx(t => {
      const q1 = t.any(dbQuery, dbValues);
      const q2 = t.oneOrNone(dbQuery2, dbValues);
      return t.batch([ q1, q2 ])
    });

    data.length ? data[0].over_all_count = total.over_all_count : data

    return data
  }
  
}

module.exports = DisbursmentFactory;
