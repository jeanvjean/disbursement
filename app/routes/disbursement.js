const AkupayDisbursementController = require('../controllers/AkupayDisbursementController');
const AuthMiddleware = require('../middlewares/auth');
const UserTypeACLMiddleware = require('../middlewares/usertype_acl');
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
    .get('/disbursements', RouteNameMiddleware('get disbursement') ,AuthMiddleware, check_errors(controller('all')))
    .all(MethodNotAllowed);

    router
    .post('/disbursements/export', RouteNameMiddleware('export disbursement') ,AuthMiddleware, check_errors(controller('exportTransaction')))
    .all(MethodNotAllowed);

  router
    .get(
      '/transactions/disbursement',
      RouteNameMiddleware('get transactions disbursed'),
      AuthMiddleware,
      check_errors(controller('transactionDisbursement'))
    )
    .all(MethodNotAllowed);

    router
    .post(
      '/transactions/disbursement/export',
      RouteNameMiddleware('export transactions disbursed'),
      AuthMiddleware,
      check_errors(controller('exportTransactionDisbursement'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/disbursements/transactions',
      RouteNameMiddleware('get disbursement transactions'),
      AuthMiddleware,
      check_errors(controller('disursementTransactions'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/disbursements/reports/summary',
      RouteNameMiddleware('get disbursements report summary'),
      AuthMiddleware,
      check_errors(controller('disbursementReportsSummary'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/transactions/retracted',
      RouteNameMiddleware('get retracted transactions'),
      AuthMiddleware,
      check_errors(controller('disbursementRetracted'))
    )
    .all(MethodNotAllowed);

    router
    .post(
      '/transactions/retracted/export',
      RouteNameMiddleware('export retracted transactions'),
      AuthMiddleware,
      check_errors(controller('exportDisbursementRetracted'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/transactions/cashout',
      RouteNameMiddleware('get cashout transactions'),
      AuthMiddleware,
      check_errors(controller('disbursementCashout'))
    )
    .all(MethodNotAllowed);

    router
    .post(
      '/transactions/cashout/export',
      RouteNameMiddleware('export cashout transactions'),
      AuthMiddleware,
      check_errors(controller('exportDisbursementCashout'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/logs/upload-errors',
      RouteNameMiddleware('get error uploads'),
      AuthMiddleware,
      check_errors(controller('uploadError'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/logs/upload-errors/export',
      RouteNameMiddleware('export error uploads'),
      AuthMiddleware,
      check_errors(controller('exportUploadError'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/logs/webhook-response',
      AuthMiddleware,
      check_errors(controller('webhookResponse'))
    )
    .all(MethodNotAllowed);
  router
    .get(
      '/logs/webhook-response/export',
      AuthMiddleware,
      check_errors(controller('exportWebhookResponse'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/logs/webhook-response/export',
      AuthMiddleware,
      check_errors(controller('exportWebhookResponse'))
    )
    .all(MethodNotAllowed);


  router
    .get('/disbursements/:id', RouteNameMiddleware('get a disbursement details'), AuthMiddleware, check_errors(controller('get')))
    .all(MethodNotAllowed);

  router
    .post('/disbursements/flagged/approve', RouteNameMiddleware('approve flagged transaction'), AuthMiddleware, check_errors(controller('approveFlagged')))
    .all(MethodNotAllowed); 
    
  router
    .post('/disbursements/transactions/retry', RouteNameMiddleware('retry transaction'), AuthMiddleware, check_errors(controller('retry')))
    .all(MethodNotAllowed); 

  router
    .post('/disbursements/transactions/requery', RouteNameMiddleware('requery transaction'), AuthMiddleware, check_errors(controller('requery')))
    .all(MethodNotAllowed); 

  router
    .get('/disbursements/flagged/approve', RouteNameMiddleware('get all approved flagged transaction'), AuthMiddleware, check_errors(controller('getAllApprovedFlagged')))
    .all(MethodNotAllowed);  

    router
    .post('/disbursements/flagged/approve/export', RouteNameMiddleware('export all approved flagged transaction'), AuthMiddleware, check_errors(controller('exportAllApprovedFlagged')))
    .all(MethodNotAllowed);

  router
    .get('/disbursements/flagged/approve/:id', RouteNameMiddleware('get approved flagged transaction'), AuthMiddleware, check_errors(controller('getApprovedFlagged')))
    .all(MethodNotAllowed); 

  router
    .get('/disbursements/sms/applicant-replies', RouteNameMiddleware('get applicant sms sent'),AuthMiddleware, check_errors(controller('getApplicantReplies')))
    .all(MethodNotAllowed); 
    
  router
    .get('/disbursements/sms/applicant-replies/export', RouteNameMiddleware('export applicant sms sent'),AuthMiddleware, check_errors(controller('getApplicantRepliesExport')))
    .all(MethodNotAllowed); 

    router
    .get('/disbursements/sms/logs', RouteNameMiddleware('get all sms logs'), AuthMiddleware, check_errors(controller('getAllSMSLogs')))
    .all(MethodNotAllowed); 

    router
    .post('/disbursements/sms/logs/export', RouteNameMiddleware('export sms logs'), AuthMiddleware, check_errors(controller('exportSMSLogs')))
    .all(MethodNotAllowed); 

  return router;
};
