const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middlewares/auth');
const CreateLoginValidationSchema = require('../validations/auth/login')
const CreateConfirmPasswordValidationSchema = require('../validations/auth/confirm-password')
const CreateForgotPasswordValidationSchema = require('../validations/auth/forgot-password')
const CreateResetPasswordValidationSchema = require('../validations/auth/reset-password')
const RouteNameMiddleware = require('../middlewares/name_route');

module.exports = (router, Validator, check_errors, makeInvoker, MethodNotAllowed) => {
    const controller = makeInvoker(AuthController);

    router.post('/auth/login', RouteNameMiddleware('login'), Validator.body(CreateLoginValidationSchema), check_errors(controller('login'))).all(MethodNotAllowed);
    router.post('/auth/confirm-password', RouteNameMiddleware('confirm password'),AuthMiddleware, Validator.body(CreateConfirmPasswordValidationSchema), check_errors(controller('confirmUserPassword'))).all(MethodNotAllowed);
    router.post('/auth/forgot-password', RouteNameMiddleware('forgot password'),Validator.body(CreateForgotPasswordValidationSchema), check_errors(controller('forgotPassword'))).all(MethodNotAllowed);
    router.post('/auth/reset-password', RouteNameMiddleware('password reset'),Validator.body(CreateResetPasswordValidationSchema), check_errors(controller('resetPassword'))).all(MethodNotAllowed);

    return router;
};
