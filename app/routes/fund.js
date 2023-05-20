const AkupayDisbursementController = require('../controllers/AkupayDisbursementController');
const AuthMiddleware = require('../middlewares/auth');
const UserTypeACLMiddleware = require('../middlewares/usertype_acl');
const CreateFundSchema = require('../validations/fund/create');
const RouteNameMiddleware = require('../middlewares/name_route');

module.exports = (
  router,
  Validator,
  check_errors,
  makeInvoker,
  MethodNotAllowed
) => {
  const controller = makeInvoker(AkupayDisbursementController);

  router
    .post(
      '/funds',
      RouteNameMiddleware('add fund'),
      Validator.body(CreateFundSchema),
      AuthMiddleware,
      check_errors(controller('createFund'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/funds',
      RouteNameMiddleware('get all funds'),
      AuthMiddleware,
      check_errors(controller('getAllFunds'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/funds/logs',
      RouteNameMiddleware('get all funding logs'),
      AuthMiddleware,
      check_errors(controller('getFundingLogs'))
    )
    .all(MethodNotAllowed);

    router
    .post(
      '/funds/export',
      RouteNameMiddleware('export funds'),
      AuthMiddleware,
      check_errors(controller('exportFunds'))
    )
    .all(MethodNotAllowed);

  return router;
};
