const multer  = require('multer')
const path = require('path')
const BeneficiaryController = require('../controllers/BeneficiaryController');
const AuthMiddleware = require('../middlewares/auth');
const UserTypeACLMiddleware = require('../middlewares/usertype_acl');
const CreateBeneficiarySchema = require('../validations/beneficiary/create')
const RouteNameMiddleware = require('../middlewares/name_route');
const { accountStorage, beneficiaryStorage } = require('../utils/multer')

// const storage = multer.diskStorage({
//   destination: './temp',
//   filename: function(req, file, cb) {
//     cb(null, )
//   }
// })

// const beneficiaryUpload = multer({ storage: beneficiarySstorage })

// const beneficiaryAccountUpload = multer({ storage: accountStorage });
// const accountUpload = multer({ dest: 'uploads/accounts/' })

const storage = multer.diskStorage({
  destination: './temp',
  filename: function(req, file, cb) {
    cb(null,'beneficiaries'+'_' + Date.now()+'_'+ path.extname(file.originalname));
  }
});

const benUpload = multer({
  storage
})

module.exports = (
  router,
  Validator,
  check_errors,
  makeInvoker,
  MethodNotAllowed
) => {
  const controller = makeInvoker(BeneficiaryController);

  router
    .post(
      '/beneficiary',
      RouteNameMiddleware('add beneficiary'),
      Validator.body(CreateBeneficiarySchema),
      AuthMiddleware,
      check_errors(controller('add'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/upload-beneficiary',
      RouteNameMiddleware('upload beneficiary'),
      AuthMiddleware,
      // beneficiaryStorage.single('applicant'),
      benUpload.single('applicant'),
      check_errors(controller('upload'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/beneficiary-account-upload',
      RouteNameMiddleware('upload beneficiary account number'),
      AuthMiddleware,
      accountStorage.single('beneficiary'),
      check_errors(controller('beneficiaryAccountUpload'))
    )
    .all(MethodNotAllowed);

  router
    .post(
      '/beneficiary-acc-upload',
      RouteNameMiddleware('upload beneficiary'),
      AuthMiddleware,
      benUpload.single('ben'),
      check_errors(controller('beneficiaryAccountUploadNow'))
    )
    .all(MethodNotAllowed);

  router
    .get(
      '/beneficiary-upload-logs',
      RouteNameMiddleware('get beneficiary upload logs'),
      AuthMiddleware,
      check_errors(controller('getUploadLogs'))
    )
    .all(MethodNotAllowed);

  return router;
};
