const UserController = require('../controllers/UserController');
const userCreationSchema = require('../validations/user/create');
const inviteUserCreationSchema = require('../validations/user/invite-user');
const changePasswordSchema = require('../validations/user/change-password');
const AuthMiddleware = require('../middlewares/auth');
const CreateUserProgrammeValidationSchema = require('../validations/user/attach-programme');
const RouteNameMiddleware = require('../middlewares/name_route');

const UserTypeACLMiddleware = require('../middlewares/usertype_acl');

module.exports = (
  router,
  Validator,
  check_errors,
  makeInvoker,
  MethodNotAllowed
) => {
  const controller = makeInvoker(UserController);

  router
    .get(
      '/users',
      RouteNameMiddleware('get all users'),
      AuthMiddleware,
      UserTypeACLMiddleware('administrator'),
      check_errors(controller('getAllUsers'))
    )
    .all(MethodNotAllowed);
  router
    .get(
      '/users/programmes',
      RouteNameMiddleware('get user programmes'),
      AuthMiddleware,
      check_errors(controller('getUserProgrammes'))
    )
    .all(MethodNotAllowed);
  router
    .get('/users/:id', RouteNameMiddleware('get a user'), AuthMiddleware, check_errors(controller('getUser')))
    .all(MethodNotAllowed);
  router
    .patch(
      '/users/change-password',
      RouteNameMiddleware('change password'),
      AuthMiddleware,
      Validator.body(changePasswordSchema),
      check_errors(controller('changePassword'))
    )
    .all(MethodNotAllowed);
  router
    .put('/users/:id',RouteNameMiddleware('update user profile'), AuthMiddleware, check_errors(controller('updateUser')))
    .all(MethodNotAllowed);
  router
    .post(
      '/users',
      RouteNameMiddleware('create user'),
      AuthMiddleware,
      UserTypeACLMiddleware('administrator'),
      Validator.body(userCreationSchema),
      check_errors(controller('create'))
    )
    .all(MethodNotAllowed);
  router
    .post(
      '/users/invite',
      RouteNameMiddleware('invite user'),
      AuthMiddleware,
      UserTypeACLMiddleware('administrator'),
      Validator.body(inviteUserCreationSchema),
      check_errors(controller('inviteUser'))
    )
    .all(MethodNotAllowed);
  router
    .post(
      '/users/programmes',
      RouteNameMiddleware('create user programme'),
      AuthMiddleware,
      UserTypeACLMiddleware('administrator'),
      Validator.body(CreateUserProgrammeValidationSchema),
      check_errors(controller('attachProgramme'))
    )
    .all(MethodNotAllowed);
  router
    .delete(
      '/users/programmes/:id',
      RouteNameMiddleware('delete user programme'),
      AuthMiddleware,
      UserTypeACLMiddleware('administrator'),
      check_errors(controller('detachProgramme'))
    )
    .all(MethodNotAllowed);
  router
    .get('/profile',RouteNameMiddleware('get user profile'), AuthMiddleware, check_errors(controller('getProfile')))
    .all(MethodNotAllowed);
  router
    .get(
      '/profile/activity',
      RouteNameMiddleware('get user profile activity'),
      AuthMiddleware,
      check_errors(controller('getUserActivity'))
    )
    .all(MethodNotAllowed);
  router
    .put('/profile', RouteNameMiddleware('update profile'), AuthMiddleware, check_errors(controller('updateProfile')))
    .all(MethodNotAllowed);
  
  router
    .post('/users/:id/deactivate', RouteNameMiddleware('deactivate user'),check_errors(controller('deactivateUser')))
    .all(MethodNotAllowed);

  router
    .post('/users/:id/activate', RouteNameMiddleware('activate user'), AuthMiddleware,UserTypeACLMiddleware('administrator'),check_errors(controller('activateUser')))
    .all(MethodNotAllowed);

  return router;
};
