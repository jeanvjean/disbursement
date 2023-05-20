const Joi = require('@hapi/joi');

const createSendSmsSchema = Joi.object().keys({
    transaction_id: Joi.array().required()
});

module.exports = createSendSmsSchema;
