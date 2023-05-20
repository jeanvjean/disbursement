const AuditLogsWorker = require('../queues/workers/auditLogs/export');

class AppFactory {
  constructor({
    config,
    errors,
    database,
    queries,
    helper,
    paymentService,
    notificationService,
    currentClient,
    currentUser
  }) {
    this.config = config;
    this.errors = errors;
    this.database = database;
    this.queries = queries;
    this.helper = helper;
    this.paymentService = paymentService;
    this.notificationService = notificationService;
    this.currentClient = currentClient;
    this.currentUser = currentUser;
  }
  getApp() {
    return { domain: this.config.get('server.app.domain') };
  }

  async sendSms({ body }) {
    try {
    } catch (err) {
      throw new this.errors.InternalServer(
        'Something went wrong while sending sms'
      );
    }
  }

  async smsWebhook({ body }) {
    let response;
    switch(body.type.toLowerCase()) {
      case 'beneficiary':
        response = await this.saveBeneficiaryLog(body);
      break;
      case 'sms':
        response = await this.saveSmsLog(body);
      break;
      case 'ussd':
        response = await this.saveUssdLog(body);
      break;
    }

    return response;
  }

  async saveBeneficiaryLog(payload) {
    delete payload.type;
    payload.status = payload.status.toLowerCase();

    const result =  await this.database.query.oneOrNone(this.queries.beneficiary.create, payload);
    return result;
  }

  async saveSmsLog(payload) {
    payload.type = payload.sms_type;
    delete payload.sms_type;
    payload.status = payload.status.toLowerCase();
    
    const result =  await this.database.query.oneOrNone(this.queries.sms.create, payload);
    return result;
  }

  async saveUssdLog(payload) {
    delete payload.type;
    payload.status = payload.status.toLowerCase();
    
    const result =  await this.database.query.oneOrNone(this.queries.ussd.create, payload);
    return result;
  }

  async failedTransactions({ body, client }) {
    try {
      body.source = client.name.toLowerCase() || 'akupay';
      body.client_id = client.id
      const res = await this.database.query.tx(async (t) => {
        return t
          .oneOrNone(this.queries.app.saveTransaction, body)
          .then(async (transaction) => {
            body.transaction_id = transaction.id;
            const {
              account_number,
              account_number_accuracy,
            } = this.helper.parseAccountNumber(body.account_number);

            body.account_number = account_number;
            body.resolved_account_number_accuracy = account_number_accuracy;
            const {
              correctDifference = '',
              bankCode,
              bankName,
            } = await this.helper.formatBankName(body.bank_name);
            
            body.resolved_bank_name_accuracy = correctDifference;
            body.bank_name = bankName;
            body.resolve_source = 'system';

            const resolveData = await this.resolveAccountNumber({
              account_number,
              bank_code: bankCode,
            });
            
            body.status = resolveData.success ? 'resolved' : 'not_resolved';
            body.error_message = resolveData.success ? null : resolveData.data;
            body.account_name = resolveData.data.account_name || null;
            if (resolveData.success) {
              t.oneOrNone(this.queries.app.updateTransactionStatus, {
                status: body.status,
                id: transaction.id,
                bank_code: bankCode,
                // account_name: resolveData.account_name,
              }).then((history) => {
                return history;
              });

              const webhookPayload = {
                mobile: body.phone_number,
                bankCode,
                accountNumber: account_number,
              };

              await this.helper.makeRequestToWebhookUrl(
                this.currentClient,
                webhookPayload
              );
            }
            return t
              .oneOrNone(this.queries.app.saveTransactionHistory, body)
              .then((history) => {
                return history;
              });
          });
      });
      
      return 'Successfully Saved';
    } catch (err) {
      throw new this.errors.InternalServer(
        'Something went wrong processing failed transaction'
      );
    }
  }

  async resolveTransactionWebhook({ body, client }) {
    try {
      body.source = client.name.toLowerCase() || 'akupay';
      body.client_id = client.id;
      const [ trans ] = await this.database.query.any(this.queries.app.saveTransaction, {
        ...body
      });
      const binfo = await this.helper.getBankName(body.bank_name);
      const rData = await this.resolveAccountNumber({
        account_number: body.account_number,
        bank_code: binfo.bankCode,
      });
      body.status = rData.success ? 'approved' : 'not_resolved';
      body.error_message = rData.success ? null : rData.data;
      body.account_name = rData.data.account_name || null;
      body.account_number = rData.data.account_number || account_number;
      if(rData.success) {
        const [ updateT ] = await this.database.query.any(this.queries.app.updateTransactionStatusAndAccountName, {
          status: body.status,
          id: trans.id,
          bank_code: binfo.bankCode,
          account_name: body.account_name,
        });
        updateT.success = true
        // const [ history ] = await this.database.query.any(this.queries.app.saveTransactionHistory, body);
        // history.success = true
        // updateT.account_number = body.account_number
        // updateT.account_name = body.account_name
        // updateT.bank_code = binfo.bankCode
        return { success: true, data: updateT, message: 'Resolved Successfully' };
      }

      // const res = await this.database.query.tx(async (t) => {
      //   return t
      //     .any(this.queries.app.saveTransaction, body)
      //     .then(async (transaction) => {
      //       body.transaction_id = transaction.id;
      //       const {
      //         account_number,
      //         account_number_accuracy,
      //       } = this.helper.parseAccountNumber(body.account_number);

      //       body.account_number = account_number;
      //       body.resolved_account_number_accuracy = account_number_accuracy;
      //       const {
      //         correctDifference = '',
      //         bankCode,
      //         bankName,
      //       } = await this.helper.formatBankName(body.bank_name);

      //       body.resolved_bank_name_accuracy = correctDifference;
      //       body.bank_name = bankName;
      //       body.resolve_source = 'system';
      //       const resolveData = await this.resolveAccountNumber({
      //         account_number,
      //         bank_code: bankCode,
      //       });
      //       body.status = resolveData.success ? 'approved' : 'not_resolved';
      //       body.error_message = resolveData.success ? null : resolveData.data;
      //       body.account_name = resolveData.data.account_name || null;
      //       body.account_number = resolveData.data.account_number || account_number;

      //       if (resolveData.success) {
      //         return t.oneOrNone(this.queries.app.updateTransactionStatusAndAccountName, {
      //           status: body.status,
      //           id: transaction.id,
      //           bank_code: bankCode,
      //           account_name: body.account_name,
      //         }).then((updatedTransaction) => {
      //           updatedTransaction.success = true
      //           return t.oneOrNone(this.queries.app.saveTransactionHistory, body)
      //           .then((history) => {
      //             history.success = true
      //             updatedTransaction.account_number = body.account_number
      //             updatedTransaction.account_name = body.account_name
      //             updatedTransaction.bank_code = bankCode
      //             return updatedTransaction;
      //           });
                
      //           // return updatedTransaction;
      //         });
      //       }
      //       return t
      //         .oneOrNone(this.queries.app.saveTransactionHistory, body)
      //         .then((history) => {
      //           history.success = false
      //           return transaction;
      //         });
      //     });
      // });
      // return { success: true, data: res, message: 'Resolved Successfully' };
    } catch (err) {
      return { success: false, data: null, message: err };
    }
  }

  async resolveAccountNumber({ account_number, bank_code }) {
    try {
      const data = await this.paymentService.resolveAccountNumber({
        account_number,
        bank_code,
      });

      return { success: true, data };
    } catch (err) {
      return { success: false, data: err.message };
    }
  }

  async getAuditLogs(query) {
    try {
      const { page = 1, limit = 20, period = '', s = '' } = query;
      const { offset } = this.helper.getLimitOffset({ page, limit });

      let dbValues = { period: parseInt(period) };

      let dbQuery = this.queries.app.getAllAuditLogs;

      if (s && s !== '') {
        dbQuery += this.queries.app.searchAuditLogPatchQuery;
        dbValues.s = s;
      }

      if (period && period !== '') {
        dbQuery += this.queries.base.interval(period);
      }

      dbQuery += ' ORDER BY created_at DESC';

      dbQuery += this.queries.base.paginate({ limit, offset });

      const data = await this.database.query.any(dbQuery, dbValues);

      return data;
    } catch (err) {
      return { success: false, data: err.message };
    }
  }

  async uploadWebhookResponse({ body }) {
    try {
      const { successBucketUrl, errorBucketUrl } = body;
      const user = await this.database.query.oneOrNone(
        this.queries.user.getUserEmailByID,
        [ body.metadata.user_id ]
      );
      
      if (!user) {
        return  'No user with ID was found'
      }

      await this.notificationService.sendUploadMail({ successBucketUrl, errorBucketUrl, user });

      return 'Successfully';
    } catch (err) {
      return { success: false, data: err.message };
    }
  }

  async exportAuditLogs(query) {
    try {
      const { period = '', s = '' } = query;

      let dbValues = { period: parseInt(period) };

      let dbQuery = this.queries.app.getAllAuditLogs;

      if (s && s !== '') {
        dbQuery += this.queries.app.searchAuditLogPatchQuery;
        dbValues.s = s;
      }

      if (period && period !== '') {
        dbQuery += this.queries.base.interval(period);
      }

      dbQuery += ' ORDER BY created_at DESC';

      await AuditLogsWorker.export({
        dbQuery,
        dbValues,
        user: this.currentUser
      });
      return true;
    } catch (err) {
      return { success: false, data: err.message };
    }
  }
  
}

module.exports = AppFactory;
