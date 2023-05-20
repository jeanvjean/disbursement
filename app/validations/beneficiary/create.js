const Joi = require('@hapi/joi');

const createBeneficiarySchema = Joi.object().keys({
    phone_number: Joi.string().required().min(11),
    bvn: Joi.string().required().min(11),
    first_name: Joi.string().required().min(1),
    last_name: Joi.string().required().min(1),
    amount: Joi.number().required(),
    paid_at: Joi.string().required(),
    programme_id: Joi.string().required(),
});

module.exports = createBeneficiarySchema;