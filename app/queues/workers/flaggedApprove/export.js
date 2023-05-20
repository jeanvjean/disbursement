const publishToRabitmq = require('../../publishers');

module.exports = class PendingResolveWorker {
  static async export({ dbQuery, user }) {
    try {
      await publishToRabitmq({
        worker: 'exports_flagged_approve_queue',
        message: {
          action: 'exports_flagged_approve',
          type: 'fire',
          data: {
            dbQuery,
            user,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
  static async sendExportedFlaggedApprove({ file, user }) {
    try {
      await publishToRabitmq({
        worker: 'send_exported_flagged_approve_queue',
        message: {
          action: 'send_exported_flagged_approve',
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
