const { scopePerRequest } = require('awilix-express');
const errors = require('../app/tools/errors');
const constants = require('../app/constants');
const config = require('../config');
const Helper = require('../app/utils/Helper.js');
const database = require('../app/utils/database');
const ClientHttp = require('../app/utils/Client');
const NotificationService = require('../app/services/NotificationService');
const PaymentService = require('../app/services/PaymentService');
const AkupayDisbursementService = require('../app/services/AkupayDisbursementService');
const queries = require('../app/queries');

module.exports = {
  boot(app, { awilix }) {
    const { asValue, createContainer, asClass } = awilix;
    const container = createContainer();

    container.loadModules(
      [
        // Globs!
        'app/factories/**/*.js',
        'app/controllers/**/*.js',
        'app/repositories/**/*.js',
      ],
      {
        formatName: 'camelCase',
        registrationOptions: {
          // lifetime: awilix.Lifetime.SINGLETON
        },
      }
    );

    container.register({
      queries: asValue(queries),
      config: asValue(config),
      errors: asValue(errors),
      constants: asValue(constants),
      helper: asClass(Helper),
      database: asValue(database),
      notificationService: asClass(NotificationService, {
        injector: () => ({ config, errors })
      }).singleton(),
      paymentService: asClass(PaymentService, {
        injector: () => ({ config, errors })
      }).singleton(),
      akupayDisbursementService: asClass(AkupayDisbursementService, {
        injector: () => ({ config, errors })
      }).singleton()
    });

    app.use(scopePerRequest(container));

    container.register({
      currentClient: asValue({}),
      currentUser: asValue({}),
    });

    app.use((req, res, next) => {
      const client = req.client || {};
      const user = req.user || {};
      req.container.register({
        currentClient: asValue(client),
      });

      req.container.register({
        currentUser: asValue(user),
      });

      return next();
    });

    return container;
  },
};
