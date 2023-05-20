const DashboardController = require('../controllers/DashboardController');
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
  const controller = makeInvoker(DashboardController);

  router
    .get(
      '/services/dashboard/summary',
      RouteNameMiddleware('dashboard summary'),
      AuthMiddleware,
      check_errors(controller('dashboardSummary'))
    )
    .all(MethodNotAllowed);
  router
    .get(
      '/services/dashboard/charts',
      RouteNameMiddleware('get dashboard charts'),
      AuthMiddleware,
      check_errors(controller('dashboardChart'))
    )
    .all(MethodNotAllowed);

  return router;
};
