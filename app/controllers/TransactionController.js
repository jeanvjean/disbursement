const BaseController = require('./Base');

class TransactionController extends BaseController {
  constructor({ transactionFactory }) {
    super();
    this.transactionFactory = transactionFactory;
  }
  async create(req, res) {
    const data = await this.userFactory.create(req.body);

    return TransactionController.success(
      data,
      req,
      res,
      'user created successfully'
    );
  }

  async getAllSMSTransactionsByPeriod(req, res) {
    const data = await this.transactionFactory.getAllSMSTransactionsByPeriod(
      req.query
    );

    return TransactionController.pagination(
      data,
      req,
      res,
      'All SMS transactions fetched successfully'
    );
  }

  async getAllPendingResolveSMSTransactions(req, res) {
    const data = await this.transactionFactory.getAllPendingResolveSMSTransactions(
      req.query
    );

    return TransactionController.pagination(
      data,
      req,
      res,
      'All transactions fetched successfully'
    );
  }

  async getAllPendingApprovalSMSTransactions(req, res) {
    const data = await this.transactionFactory.getAllPendingApprovalSMSTransactions(
      req.query
    );

    return TransactionController.pagination(
      data,
      req,
      res,
      'All transactions fetched successfully'
    );
  }
  
  async resolveSMSTransaction(req, res) {
    const data = await this.transactionFactory.resolveSMSTransaction(
      req.body.payload,
      req.user
    );

    return TransactionController.success(
      data,
      req,
      res,
      'SMS transaction resolved successfully'
    );
  }

  async approveSMSTransaction(req, res) {
    const data = await this.transactionFactory.approveSMSTransaction(
      req.body.ids
    );

    return TransactionController.success(
      data,
      req,
      res,
      'SMS transaction approved successfully'
    );
  }

  async processSMSTransactionForApproval(req, res) {
    const data = await this.transactionFactory.processSMSTransactionForApproval(
      req.body.ids
    );

    return TransactionController.success(
      data,
      req,
      res,
      'SMS transactions processed successfully'
    );
  }

  async sendSms(req, res) {
    const data = await this.transactionFactory.sendSms(req);

    return TransactionController.success(
      data,
      req,
      res,
      'SMS sent successfully'
    );
  }

  async getAllChartData(req, res) {
    const data = await this.transactionFactory.getAllChartData(req);

    return TransactionController.success(
      data,
      req,
      res,
      'SMS sent successfully'
    );
  }

  async resolveAccountDetails(req, res) {
    const data = await this.transactionFactory.resolveAccountDetails(req);

    return TransactionController.success(
      data,
      req,
      res,
      'SMS sent successfully'
    );
  }

  async updateTransactionProgramme(req, res) {
    const data = await this.transactionFactory.updateTransactionProgramme(req);

    return TransactionController.success(data, req, res);
  }

  async exportAllPendingResolveSMSTransactions(req, res) {
    const data = await this.transactionFactory.exportAllPendingResolveSMSTransactions(
      req.query
    );

    return TransactionController.success(data, req, res);
  }

}

module.exports = TransactionController;
