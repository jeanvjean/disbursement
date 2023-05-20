const BaseController = require('./Base');

class BeneficiaryController extends BaseController {
  constructor({ beneficiaryFactory }) {
    super();
    this.beneficiaryFactory = beneficiaryFactory;
  }
  async add(req, res) {
    const data = await this.beneficiaryFactory.add(req);

    return BeneficiaryController.success(data, req, res);
  }

  async upload(req, res) {
    const data = await this.beneficiaryFactory.upload(req);

    return BeneficiaryController.success(data, req, res);
  }

  async beneficiaryAccountUpload(req, res) {
    const data = await this.beneficiaryFactory.beneficiaryAccountUpload(req);

    return BeneficiaryController.success(data, req, res);
  }

  //curr script
  async beneficiaryAccountUploadNow(req, res) {
    const data = await this.beneficiaryFactory.beneficiaryAccountUploadNow(req);

    return BeneficiaryController.success(data, req, res);
  }

  async getUploadLogs(req, res) {
    const data = await this.beneficiaryFactory.getUploadLogs(req);

    return BeneficiaryController.pagination(data, req, res);
  }
}

module.exports = BeneficiaryController;
