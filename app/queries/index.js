const AppQueries = require('./app');
const ClientQueries = require('./client');
const UserQueries = require('./user');
const BaseQueries = require('./base');
const TransactionQueries = require('./transaction');
const DashboardQueries = require('./dashboard');
const BeneficiaryQueries = require('./beneficiary');
const USSDQueries = require('./ussd');
const SMSQueries = require('./sms');
const FlaggedApprovedQueries = require('./flagged_approved');
const FundingLogQueries = require('./funding_logs');
const BeneficiaryUploadLogQueries = require('./beneficiary_upload_logs');

module.exports = {
  get app() {
    return AppQueries;
  },

  get client() {
    return ClientQueries;
  },
  get user() {
    return UserQueries;
  },
  get base() {
    return BaseQueries;
  },
  get transaction() {
    return TransactionQueries;
  },
  get dashboard() {
    return DashboardQueries;
  },
  get beneficiary() {
    return BeneficiaryQueries;
  },
  get ussd() {
    return USSDQueries;
  },
  get sms() {
    return SMSQueries;
  },
  get flaggedApproved() {
    return FlaggedApprovedQueries;
  },
  get fundingLog() {
    return FundingLogQueries;
  },
  get beneficiaryUploadLog() {
    return BeneficiaryUploadLogQueries;
  }
};
