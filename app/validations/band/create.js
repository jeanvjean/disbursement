const Joi = require('@hapi/joi');

const createBandSchema = Joi.object().keys({
    amount: Joi.number().integer().min(0),
    programme_id: Joi.string().required(),
});

module.exports = createBandSchema;
