const TransactionController = require('../controllers/TransactionController');
const AuthMiddleware = require('../middlewares/auth');
const sendSmsSchema = require('../validations/services/send-sms');
const resolveTransactionSchema = require('../validations/transaction/resolve');
const RouteNameMiddleware = require('../middlewares/name_route');
const ClientAuthMiddleware = require('../middlewares/client_auth');

const UserTypeACLMiddleware = require('../middlewares/usertype_acl');

module.exports = (
  router,
  Validator,
  check_errors,
  makeInvoker,
  MethodNotAllowed
) => {
  const controller = makeInvoker(TransactionController);

  router
    .get(
      '/sms-transactions',
      RouteNameMiddleware('get all sms transaction'),
      AuthMiddleware,
      check_errors(controller('getAllSMSTransactionsByPeriod'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/pending-resolve',
      RouteNameMiddleware('get all pending resolve sms transactions'),
      AuthMiddleware,
      check_errors(controller('getAllPendingResolveSMSTransactions'))
    )
    .all(MethodNotAllowed);
  
  router
    .post(
      '/pending-resolve/export',
      RouteNameMiddleware('export all pending resolve sms transactions'),
      AuthMiddleware,
      check_errors(controller('exportAllPendingResolveSMSTransactions'))
    )
    .all(MethodNotAllowed);
    
  router
    .get(
      '/pending-approval',
      RouteNameMiddleware('get all pending approved sms transaction'),
      AuthMiddleware,
      check_errors(controller('getAllPendingApprovalSMSTransactions'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/sms-transactions-chart',
      RouteNameMiddleware('get all sms transactions chart'),
      AuthMiddleware,
      check_errors(controller('getAllChartData'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/send-sms',
      RouteNameMiddleware('send sms'),
      Validator.body(sendSmsSchema),
      AuthMiddleware,
      check_errors(controller('sendSms'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/resolve-transactions',
      RouteNameMiddleware('resolve sms transaction'),
      Validator.body(resolveTransactionSchema),
      AuthMiddleware,
      check_errors(controller('resolveSMSTransaction'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/approve-transactions',
      RouteNameMiddleware('approve transaction'),
      AuthMiddleware,
      UserTypeACLMiddleware('administrator'),
      check_errors(controller('approveSMSTransaction'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/process-transactions',
      RouteNameMiddleware('process transaction'),
      AuthMiddleware,
      check_errors(controller('processSMSTransactionForApproval'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/resolve-account-number',
      RouteNameMiddleware('Resolve Account'),
      check_errors(controller('resolveAccountDetails'))
    )
    .all(MethodNotAllowed);
  
  router
    .put('/services/transactions/update-programme', RouteNameMiddleware('Update transaction programme id'), ClientAuthMiddleware, check_errors(controller('updateTransactionProgramme')))
    .all(MethodNotAllowed); 

  return router;
};
