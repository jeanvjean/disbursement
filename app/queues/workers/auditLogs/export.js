const publishToRabitmq = require('../../publishers');

module.exports = class AuditLogsWorker {
  static async export({ dbQuery, dbValues, user }) {
    try {
      await publishToRabitmq({
        worker: 'exports_audit_logs_queue',
        message: {
          action: 'exports_audit_logs',
          type: 'fire',
          data: {
            dbQuery,
            dbValues,
            user,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
  static async sendExportedAuditLogs({ file, user }) {
    try {
      await publishToRabitmq({
        worker: 'send_exported_audit_logs_queue',
        message: {
          action: 'send_exported_audit_logs',
          type: 'fire',
          data: {
            file,
            user,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
};
