import expressJoi from 'express-joi-validation';
import AppRoute from './app';
import ClientRoute from './client';
import AuthRoute from './auth';
import UserRoute from './user';
import TransactionRoute from './transactions';
import DashboardRoute from './dashboard';
import DisbursementRoute from './disbursement';
import FundRoute from './fund';
import BandRoute from './band';
import BeneficiaryRoute from './beneficiary';
import ProgrammeRoute from './programme';

import checkErrors from '../middlewares/check_errors';
import { MethodNotAllowed } from '../tools/errors';

const { makeInvoker } = require('awilix-express');

const express = require('express');

const Validator = expressJoi.createValidator({
  passError: true,
});

module.exports = () => {
  const router = express.Router();

  const routers = [].concat([
    AppRoute,
    ClientRoute,
    AuthRoute,
    UserRoute,
    TransactionRoute,
    DashboardRoute,
    DisbursementRoute,
    FundRoute,
    BandRoute,
    BeneficiaryRoute,
    ProgrammeRoute,
  ]);

  for (let i = 0; i <= routers.length - 1; i++) {
    routers[i](router, Validator, checkErrors, makeInvoker, MethodNotAllowed);
  }

  return router;
};
