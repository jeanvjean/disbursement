const ClientController = require('../controllers/ClientController');
const CreateClientValidationSchema = require('../validations/client/create')
const AuthMiddleware = require('../middlewares/auth')
const RouteNameMiddleware = require('../middlewares/name_route');

module.exports = (router, Validator, check_errors, makeInvoker, MethodNotAllowed) => {
    const controller = makeInvoker(ClientController);

    router.get('/clients', RouteNameMiddleware('get all clients'),check_errors(controller('all'))).all(MethodNotAllowed);
    router.get('/clients/:id', RouteNameMiddleware('get a client'),check_errors(controller('get'))).all(MethodNotAllowed);
    router.post('/clients', RouteNameMiddleware('create a client'), AuthMiddleware, Validator.body(CreateClientValidationSchema), check_errors(controller('create'))).all(MethodNotAllowed);
    router.delete('/clients/:id', RouteNameMiddleware('delete a client'), AuthMiddleware, check_errors(controller('delete'))).all(MethodNotAllowed);

    return router;
};
