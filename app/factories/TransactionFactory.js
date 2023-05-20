const axios = require('axios');
const PendingResolveWorker = require('../queues/workers/pendingResolve/export');

class TransactionService {
  constructor({
    config,
    errors,
    database,
    helper,
    queries,
    paymentService,
    akupayDisbursementService,
    currentUser,
    constants
  }) {
    this.config = config;
    this.errors = errors;
    this.database = database;
    this.helper = helper;
    this.queries = queries;
    this.paymentService = paymentService;
    this.currentUser = currentUser;
    this.constants = constants;
    this.akupayDisbursementService = akupayDisbursementService;
    // this.currentClient = currentClient;
  }

  async getAllSMSTransactionsByPeriod(query) {
    try {
      const { page = 1, limit = 20, s = '', status = '' } = query;
      let { period = '30' } = query;
      const { offset } = this.helper.getLimitOffset({ page, limit });

      if(period == '') {
        period = '30';
      }
      let dbValues = { period: parseInt(period) }

      let dbQuery = this.queries.transaction.getAllSMSTransactionsByPeriod

      if(s && s !== '') {
        dbQuery += this.queries.transaction.searchPatchQuery
        dbValues.s = s
      }

      if(status && status !== '') {
        dbQuery += this.queries.transaction.filterByStatus
        dbValues.status = status
      }

      dbQuery += ' ORDER BY created_at DESC'

      dbQuery += this.queries.base.paginate({ limit, offset })
      

      const data = await this.database.query.tx((t) => {
        return t
          .any(dbQuery, dbValues)
          .then((transactions) => {
            transactions.map((item) => {
              return t
                .oneOrNone(
                  this.queries.transaction
                    .getLastTransactionHistoryByTransactionId,
                  [item.id]
                )
                .then((history) => {
                  item.last_history = history;
                });
            });
            return transactions;
          });
      });

      return data;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async getAllPendingResolveSMSTransactions(query) {
    try {
      const { page = 1, limit = 20, s = '', status = '' } = query;
      let { period = '30' } = query;
      const { offset } = this.helper.getLimitOffset({ page, limit });

      if(period == '') {
        period = '30';
      }
      let dbValues = { period: parseInt(period) }

      let dbQuery = this.queries.transaction.getAllPendingResolveSMSTransactions

      if(s && s !== '') {
        dbQuery += this.queries.transaction.searchPatchQuery
        dbValues.s = `${s}:*`
      }

      if(status && status !== '') {
        dbQuery += this.queries.transaction.filterByStatus
        dbValues.status = status
      }

      dbQuery += ' ORDER BY created_at DESC'

      dbQuery += this.queries.base.paginate({ limit, offset })
      

      const data = await this.database.query.tx((t) => {
        return t
          .any(dbQuery, dbValues)
          .then((transactions) => {
            transactions.map((item) => {
              return t
                .oneOrNone(
                  this.queries.transaction
                    .getLastTransactionHistoryByTransactionId,
                  [item.id]
                )
                .then((history) => {
                  item.last_history = history;
                });
            });
            return transactions;
          });
      });

      return data;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async getAllPendingApprovalSMSTransactions(query) {
    try {
      const { page = 1, limit = 20, s = '', status = '' } = query;
      let { period = '30' } = query;
      const { offset } = this.helper.getLimitOffset({ page, limit });

      if(period == '') {
        period = '30';
      }
      let dbValues = { period: parseInt(period) }

      let dbQuery = this.queries.transaction.getAllPendingApprovalSMSTransactions

      if(s && s !== '') {
        dbQuery += this.queries.transaction.searchPatchQuery
        dbValues.s = `${s}:*`
      }

      if(status && status !== '') {
        dbQuery += this.queries.transaction.filterByStatus
        dbValues.status = status
      }

      dbQuery += ' ORDER BY created_at DESC'

      dbQuery += this.queries.base.paginate({ limit, offset })
      

      const data = await this.database.query.tx((t) => {
        return t
          .any(dbQuery, dbValues)
          .then((transactions) => {
            transactions.map((item) => {
              return t
                .oneOrNone(
                  this.queries.transaction
                    .getLastTransactionHistoryByTransactionId,
                  [item.id]
                )
                .then((history) => {
                  item.last_history = history;
                });
            });
            return transactions;
          });
      });

      return data;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async getAllChartData(query) {
    try {
      const { year = '2020' } = query;

      let years = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
      years = years.map(item => {
        return {
          month: item,
          total_sms_request: 0,
          total_sms_resolved: 0,
          total_sms_resent: 0
        }
      })


      let dbValues = { year }

      let dbQuery = this.queries.transaction.selectChartData
    
      const data =  await this.database.query.any(dbQuery, dbValues)

      let response = [];

      for (let i = 0; i <= years.length - 1; i++ ) {
        for (let j = 0; j <= data.length - 1; j++) {
          if(years[i].month === data[j].month) {
            years[i] = data[j]
            continue;
          }
        }
      }

      return years;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async prepareInsertResolveData(payload) {
    try {
      const response = {
        phone_number: payload.phone_number,
        message_content: payload.message_content,
        account_number: payload.new_account_number,
        bank_name: payload.new_bank_name || payload.bank_name,
        account_name: payload.data.account_name,
        status: payload.resolve_status,
        account_resolved_by: this.currentUser.id,
        resolved_account_number_accuracy: this.helper.detailResolveAccuracy(
          payload.account_number,
          payload.account_number
        ),
        resolved_bank_name_accuracy: this.helper.detailResolveAccuracy(
          payload.bank_name,
          payload.bank_name
        ),
        resolve_source: 'user',
        source: 'sos',
        error_message: payload.error_message,
        transaction_id: payload.id,
      };

      return response;
    } catch (err) {
      this.errors.InternalServer(err);
    }
  }

  async resolveSMSTransaction(payload, userId) {
    try {
      let status;
      let dbValues;
      let data;
      let response_object = {};

      const res = await this.database.query.tx((t) => {
        const query = payload.map((item) => {
          return t
            .oneOrNone(this.queries.transaction.getTransactionById, [item.id])
            .then(async (transaction) => {
              if (!transaction) {
                response_object = {
                  success: false,
                  transaction_id: item.id,
                  message: 'This transaction does not exist',
                };
                return response_object;
              }

              const bankDetails = await this.helper.getBankName(
                item.new_bank_name
              );
              data = await this.resolveAccountNumber({
                account_number: item.new_account_number,
                bank_code: item.new_bank_name,
              });

              if (data.success) {
                response_object = {
                  success: true,
                  transaction_id: item.id,
                  message: 'resolve successfully',
                };
                status = 'resolved';
              } else {
                response_object = {
                  success: false,
                  transaction_id: item.id,
                  message:
                    'This account details for this transaction could not be resolved',
                };
                status = 'not_resolved';
              }

              const resolve_status = status;

              const error_message = !data.success ? data.data : null;

              const dbValues = await this.prepareInsertResolveData({
                ...transaction,
                ...item,
                ...data,
                error_message,
                resolve_status,
              });

              return t
                .oneOrNone(
                  this.queries.transaction.addTransactionHistory,
                  dbValues
                )
                .then((history) => {
                  return t
                    .oneOrNone(this.queries.user.selectAdminUserRandomly)
                    .then((randomApprover) => {
                      t.any(
                        this.queries.transaction
                          .updateTransactionStatusByIdAndResolver,
                        [
                          item.id,
                          status,
                          this.currentUser.id,
                          bankDetails.bankCode,
                          randomApprover.id,
                          data.data.account_number,
                          data.data.account_name,
                          bankDetails.bankName,
                        ]
                      );

                      return response_object;
                    });
                });

              return response_object;
            });

          return response_object;
        });

        return t.batch(query);
      });

      await this.database.query.oneOrNone(this.queries.user.createActivity, [
        this.currentUser.id,
        this.constants.activities.transactionResolve,
      ]);

      return res;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async processSMSTransactionForApproval(transactionIds) {
    try {
      let response_object = {};
      const res = await this.database.query.tx(async (transaction) => {
        const query = transactionIds.map((item) => {
          return transaction
            .oneOrNone(this.queries.transaction.getTransactionById, [item])
            .then((getSingletransaction) => {
              if (!getSingletransaction) {
                response_object = {
                  success: false,
                  transaction_id: item,
                  message: 'This transaction does not exist',
                };
                return response_object;
              }
              if (getSingletransaction.status !== 'resolved') {
                response_object = {
                  success: false,
                  transaction_id: item,
                  message:
                    'This transaction needs to be approved before processing',
                };
              } else {
                transaction.none(
                  this.queries.transaction.updateTransactionStatusById,
                  [item, 'process_for_approval']
                );

                response_object = {
                  success: true,
                  transaction_id: item,
                  message: 'This transaction is awaiting approval',
                };
              }
              return response_object;
            });

          return response_object;
        });

        return transaction.batch(query);
      });

      await this.database.query.oneOrNone(this.queries.user.createActivity, [
        this.currentUser.id,
        this.constants.activities.processForApprover,
      ]);

      return res;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
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
      // throw new this.errors.InternalServer(err.message);
    }
  }

  async approveSMSTransaction(transactionIds) {
    try {
      // let response_object = {};
      // for(let item of transactionIds) {
      //   const trans = await this.database.query.any(this.queries.transaction.getTransactionById, [item]);
      // }
      // return;
      const res = await this.database.query.tx(async (transaction) => {
        const query = transactionIds.map((item) => {
          return transaction
            .any(this.queries.transaction.getTransactionById, [item])
            .then(async (getSingletransaction) => {
              if (!getSingletransaction) {
                response_object = {
                  success: false,
                  transaction_id: item,
                  message: 'This transaction is awaiting approval',
                };
                return response_object;
              }
              if (getSingletransaction.status !== 'process_for_approval') {
                response_object = {
                  success: false,
                  transaction_id: item,
                  message:
                    'This transaction needs to be processed before approval',
                };
              } else {
                // here we would send an API request to the AKU pay to add this for payment
                transaction.none(
                  this.queries.transaction.updateTransactionStatusById,
                  [item, 'approved', this.currentUser.id]
                );

                response_object = {
                  success: true,
                  transaction_id: item,
                  message: 'This transaction has been approved',
                };
                await this.makeWebhookRequest(getSingletransaction);
              }

              return response_object;
            });

          return response_object;
        });

        return transaction.batch(query);
      });

      await this.database.query.oneOrNone(this.queries.user.createActivity, [
        this.currentUser.id,
        this.constants.activities.transactionApprove,
      ]);

      return res;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async makeWebhookRequest(transaction) {
    try {
      const { resolved_account_number, resolved_account_name, resolved_bank_name, id, bank_code } = transaction;
      await this.akupayDisbursementService.updateTransactions({
        transaction_id: id,
        account_number: resolved_account_number,
        account_name: resolved_account_name,
        bank_name: resolved_bank_name,
        bank_code,
      });
      
      const client = await this.database.query.oneOrNone(this.queries.client.get, { id: transaction.client_id });
      // return;
      if(!client) {
        return 'done'
      }

      this.helper.makeRequestToWebhookUrl(client, {
        transaction_id: id,
        account_number: resolved_account_number,
        account_name: resolved_account_name,
        bank_name: resolved_bank_name,
        bank_code,
      })

      return 'done';
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async sendSms({ body }) {
    try {
      let successfulSms = [];
      let failedSms = [];

      const data = await this.database.query.tx(t => {

        const query = body.transaction_id.map(item => {
            return t.oneOrNone(this.queries.transaction.getTransactionByIdByLastSms, item).then(async transaction => {
                if(!transaction) {
                  failedSms.push(item);
                  return;
                }

                return t.any(this.queries.transaction.getTransactionHistoriesByValidation, { transaction_id: item }).then(histories => {
                  if (histories.length < 2) {
                    failedSms.push(item);
                    return;
                  }

                  const currentTrSource = histories.map((item) => item.resolve_source);

                  if (!currentTrSource.includes('system') || !currentTrSource.includes('user') ) {
                    failedSms.push(item);
                    return;
                  }

                  let phone_number = transaction.phone_number;

                  if (phone_number.length == 11) {
                    phone_number = `+234${phone_number.substring(1)}`;
                  }

                  // await this.helper.sendSmsToPhoneNumber({
                  //   mobile: phone_number,
                  //   message: `
                  //     Hello ${phone_number}, We can't resolve the Bank Account Details you. Please send valid bank account details e.g Pay Access Bank, 0098773418 to 33466
                  //   `,
                  // });

                  successfulSms.push(item);
                  return t.oneOrNone(this.queries.transaction.updateTransactionSmsSent, { id: item }) 
                })
            })
        });

        return t.batch(query);

      })

      return { success: successfulSms, failed: failedSms };
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

  async resolveAccountDetails({ body: { account_number, bank_code } }) {
    try {
        const data = await this.paymentService.resolveAccountNumber({ account_number, bank_code });

        return data;
    } catch (err) {
      throw new this.errors.InternalServer(err);
    }
  }

  async updateTransactionProgramme({ body: payload }) {
    const { id, programme_id } = payload
    const response =  await this.database.query.oneOrNone(this.queries.transaction.updateTransactionProgramme, { id, programme_id });

    return response;
  }

  async exportAllPendingResolveSMSTransactions(query) {
    try {
      const { page = 1, limit = 20, s = '', status = '' } = query;
      let { period = '30' } = query;
      const { offset } = this.helper.getLimitOffset({ page, limit });

      if(period == '') {
        period = '30';
      }
      let dbValues = { period: parseInt(period) }

      let dbQuery = this.queries.transaction.getAllPendingResolveSMSTransactions

      if(s && s !== '') {
        dbQuery += this.queries.transaction.searchPatchQuery
        dbValues.s = `${s}:*`
      }

      if(status && status !== '') {
        dbQuery += this.queries.transaction.filterByStatus
        dbValues.status = status
      }

      dbQuery += ' ORDER BY created_at DESC'

      await PendingResolveWorker.export({
        dbQuery,
        dbValues,
        user: this.currentUser
      });

      return true;
    } catch (err) {
      throw new this.errors.InternalServer(err.message);
    }
  }

}

module.exports = TransactionService;
