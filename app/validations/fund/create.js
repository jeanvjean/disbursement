const Joi = require('@hapi/joi');

const createFundSchema = Joi.object().keys({
    amount: Joi.string().required(),
    funded_at: Joi.string().required(),
    programme_id: Joi.string().required(),
});

module.exports = createFundSchema;
