const Joi = require('@hapi/joi');

const createFailedTransactionSchema = Joi.object().keys({
    phone_number: Joi.string().required().min(11),
    message_content: Joi.string().required().min(2),
    account_number: Joi.string().required(),
    bank_name: Joi.string().required(),
    account_name: Joi.string().allow('')
});

module.exports = createFailedTransactionSchema;
