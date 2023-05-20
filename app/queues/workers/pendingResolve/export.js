const publishToRabitmq = require('../../publishers');

module.exports = class PendingResolveWorker {
  static async export({ dbQuery, dbValues, user }) {
    try {
      await publishToRabitmq({
        worker: 'exports_pending_resolve_queue',
        message: {
          action: 'exports_pending_resolve',
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
  static async sendExportedPendingResolve({ file, user }) {
    try {
      await publishToRabitmq({
        worker: 'send_exported_pending_resolve_queue',
        message: {
          action: 'send_exported_pending_resolve',
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
