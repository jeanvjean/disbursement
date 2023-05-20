const AkupayDisbursementController = require('../controllers/AkupayDisbursementController');
const AuthMiddleware = require('../middlewares/auth');
const UserTypeACLMiddleware = require('../middlewares/usertype_acl');
const CreateBandSchema = require('../validations/band/create')
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
      '/bands',
      RouteNameMiddleware('create band'),
      Validator.body(CreateBandSchema),
      AuthMiddleware,
      check_errors(controller('createBand'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/bands',
      RouteNameMiddleware('get all bands'),
      AuthMiddleware,
      check_errors(controller('getAllBands'))
    )
    .all(MethodNotAllowed);

    router
    .get(
      '/bands/export',
      RouteNameMiddleware('export all bands'),
      AuthMiddleware,
      check_errors(controller('exportAllBands'))
    )
    .all(MethodNotAllowed);

  return router;
};
