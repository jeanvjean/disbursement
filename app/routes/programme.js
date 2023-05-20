const ProgrammeController = require('../controllers/ProgrammeController');
const CreateProgrammeValidationSchema = require('../validations/programme/create')
const createProgrammeSmsSchema = require('../validations/programme/create-sms')
const RouteNameMiddleware = require('../middlewares/name_route');

module.exports = (router, Validator, check_errors, makeInvoker, MethodNotAllowed) => {
    const controller = makeInvoker(ProgrammeController);

    router.get('/programmes', RouteNameMiddleware('get all programmes'),check_errors(controller('all'))).all(MethodNotAllowed);
    router.get('/programmes/:id', RouteNameMiddleware('get a programme'),check_errors(controller('get'))).all(MethodNotAllowed);
    router.put('/programmes/:id', RouteNameMiddleware('update a programme'),check_errors(controller('updateProgrammme'))).all(MethodNotAllowed);
    router.post('/programmes', RouteNameMiddleware('create programme'),Validator.body(CreateProgrammeValidationSchema), check_errors(controller('create'))).all(MethodNotAllowed);
    router.delete('/programmes/:id', RouteNameMiddleware('delete a programmes'),check_errors(controller('delete'))).all(MethodNotAllowed);
    router.post('/programmes/:id/sms', RouteNameMiddleware('create a programme sms'),Validator.body(createProgrammeSmsSchema),check_errors(controller('createMessage'))).all(MethodNotAllowed);
    router.get('/programmes/sms/:id', RouteNameMiddleware('get a programme sms'), check_errors(controller('getMessage'))).all(MethodNotAllowed);
    router.put('/programmes/sms/:id',RouteNameMiddleware('update a programme sms'), check_errors(controller('updateMessage'))).all(MethodNotAllowed);
    router.delete('/programmes/sms/:id', RouteNameMiddleware('delete a programme sms'),check_errors(controller('deleteMessage'))).all(MethodNotAllowed);
    router.get('/programmes/sms', RouteNameMiddleware('get programmes sms'),check_errors(controller('allMessage'))).all(MethodNotAllowed);
    router.get('/programmes/:id/sms', RouteNameMiddleware('get a programme sms'),check_errors(controller('getProgrammeMessage'))).all(MethodNotAllowed);

    return router;
};
