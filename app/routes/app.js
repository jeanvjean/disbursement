const AppController = require('../controllers/AppController');
const failedTransactionValidationSchema = require('../validations/services/failed-transaction');
const WebhookValidationSchema = require('../validations/app/webhook');
const ClientAuthMiddleware = require('../middlewares/client_auth');
const AuthMiddleware = require('../middlewares/auth');
const RouteNameMiddleware = require('../middlewares/name_route');

const UserTypeACLMiddleware = require('../middlewares/usertype_acl');

module.exports = (
  router,
  Validator,
  check_errors,
  makeInvoker,
  MethodNotAllowed
) => {
  const controller = makeInvoker(AppController);

  router
    .route('/')
    .get(RouteNameMiddleware('home'), check_errors(controller('index')))
    .all(MethodNotAllowed);
  router
    .get('/services/send-sms', RouteNameMiddleware('send sms'), check_errors(controller('sendSms')))
    .all(MethodNotAllowed);
  router
    .post('/services/webhook', RouteNameMiddleware('sms webhook'), Validator.body(WebhookValidationSchema), check_errors(controller('smsWebhook')))
    .all(MethodNotAllowed);
  router
    .post(
      '/services/failed-transactions',
      RouteNameMiddleware('incoming failed transaction'),
      ClientAuthMiddleware,
      Validator.body(failedTransactionValidationSchema),
      check_errors(controller('failedTransactions'))
    )
    .all(MethodNotAllowed);
  router
    .post(
      '/services/resolve-transactions/webhook',
      RouteNameMiddleware('resolve sms webhook'),
      ClientAuthMiddleware,
      Validator.body(failedTransactionValidationSchema),
      check_errors(controller('resolveTransactionWebhook'))
    )
    .all(MethodNotAllowed);
  router
    .get(
      '/audit-logs',
      RouteNameMiddleware('get-audit-logs'),
      AuthMiddleware,
      UserTypeACLMiddleware('administrator'),
      check_errors(controller('getAuditLogs'))
    )
    .all(MethodNotAllowed);

    router
    .post(
      '/audit-logs/export',
      RouteNameMiddleware('export-audit-logs'),
      AuthMiddleware,
      UserTypeACLMiddleware('administrator'),
      check_errors(controller('exportAuditLogs'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/services/upload-response/webhook',
      RouteNameMiddleware('upload response webhook'),
      check_errors(controller('uploadWebhookResponse'))
    )
    .all(MethodNotAllowed);

  return router;
};
