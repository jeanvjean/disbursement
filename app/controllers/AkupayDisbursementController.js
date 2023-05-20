const BaseController = require('./Base');

class AkupayDisbursementController extends BaseController {
  constructor({ akupayDisbursementFactory }) {
    super();
    this.akupayDisbursementFactory = akupayDisbursementFactory;
  }

  async all(req, res) {
    const data = await this.akupayDisbursementFactory.all(req);

    return AkupayDisbursementController.external_pagination(data, req, res);
  }

  async get(req, res) {
    const data = await this.akupayDisbursementFactory.get(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async createFund(req, res) {
    const data = await this.akupayDisbursementFactory.createFund(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async getAllFunds(req, res) {
    const data = await this.akupayDisbursementFactory.getAllFunds(req);

    return AkupayDisbursementController.external_pagination(data, req, res);
  }

  async createBand(req, res) {
    const data = await this.akupayDisbursementFactory.createBand(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async getAllBands(req, res) {
    const data = await this.akupayDisbursementFactory.getAllBands(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async transactionDisbursement(req, res) {
    const data = await this.akupayDisbursementFactory.transactionDisbursement(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async disursementTransactions(req, res) {
    const data = await this.akupayDisbursementFactory.disursementTransactions(req);

    return AkupayDisbursementController.external_pagination(data, req, res);
  }

  async disbursementReportsSummary(req, res) {
    const data = await this.akupayDisbursementFactory.disbursementReportsSummary(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async disbursementRetracted(req, res) {
    const data = await this.akupayDisbursementFactory.disbursementRetracted(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async disbursementCashout(req, res) {
    const data = await this.akupayDisbursementFactory.disbursementCashout(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async uploadError(req, res) {
    const data = await this.akupayDisbursementFactory.uploadError(req);

    return AkupayDisbursementController.external_pagination(data, req, res);
  }

  async webhookResponse(req, res) {
    const data = await this.akupayDisbursementFactory.webhookResponse(req);

    return AkupayDisbursementController.external_pagination(data, req, res);
  }

  async approveFlagged(req, res) {
    const data = await this.akupayDisbursementFactory.approveFlagged(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async getAllApprovedFlagged(req, res) {
    const data = await this.akupayDisbursementFactory.getAllApprovedFlagged(req);

    return AkupayDisbursementController.pagination(data, req, res);
  }

  async getApprovedFlagged(req, res) {
    const data = await this.akupayDisbursementFactory.getApprovedFlagged(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async getApplicantReplies(req, res) {
    const data = await this.akupayDisbursementFactory.getApplicantReplies(req);

    return AkupayDisbursementController.external_pagination(data, req, res);
  }
  
  async exportTransaction(req, res) {
    const data = await this.akupayDisbursementFactory.exportTransaction(req);

    return AkupayDisbursementController.success(data, req, res);
  }
  
  async exportFunds(req, res) {
    const data = await this.akupayDisbursementFactory.exportFunds(req);

    return AkupayDisbursementController.success(data, req, res);
  }


  async getApplicantRepliesExport(req, res) {
    const data = await this.akupayDisbursementFactory.getApplicantRepliesExport(req);

    return AkupayDisbursementController.success(data, req, res);
  }
  async exportAllBands(req, res) {
    const data = await this.akupayDisbursementFactory.exportAllBands(req);

    return AkupayDisbursementController.success(data, req, res);
  }
  async exportAllApprovedFlagged(req, res) {
    const data = await this.akupayDisbursementFactory.exportAllApprovedFlagged(req);

    return AkupayDisbursementController.success(data, req, res);
  }
  
  async exportDisbursementCashout(req, res) {
    const data = await this.akupayDisbursementFactory.exportDisbursementCashout(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async getAllSMSLogs(req, res) {
    const data = await this.akupayDisbursementFactory.getAllSMSLogs(req);

    return AkupayDisbursementController.external_pagination(data, req, res);
  }
  async exportWebhookResponse(req, res) {
    const data = await this.akupayDisbursementFactory.exportWebhookResponse(req);

    return AkupayDisbursementController.success(data, req, res);
  }
  async exportUploadError(req, res) {
    const data = await this.akupayDisbursementFactory.exportUploadError(req);

    return AkupayDisbursementController.success(data, req, res);
  }
  
  async exportDisbursementRetracted(req, res) {
    const data = await this.akupayDisbursementFactory.exportDisbursementRetracted(req);

    return AkupayDisbursementController.success(data, req, res);
  }
  
  async exportTransactionDisbursement(req, res) {
    const data = await this.akupayDisbursementFactory.exportTransactionDisbursement(req);

    return AkupayDisbursementController.success(data, req, res);
  }
  async exportSMSLogs(req, res) {
    const data = await this.akupayDisbursementFactory.exportSMSLogs(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async getFundingLogs(req, res) {
    const data = await this.akupayDisbursementFactory.getFundingLogs(req);

    return AkupayDisbursementController.pagination(data, req, res);
  }

  async requery(req, res) {
    const data = await this.akupayDisbursementFactory.requery(req);

    return AkupayDisbursementController.success(data, req, res);
  }

  async retry(req, res) {
    const data = await this.akupayDisbursementFactory.retry(req);

    return AkupayDisbursementController.pagination(data, req, res);
  }

}

module.exports = AkupayDisbursementController;
