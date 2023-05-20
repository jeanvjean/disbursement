const Joi = require('@hapi/joi');

const createConfirmPasswordSchema = Joi.object().keys({
    password: Joi.string().required()
});

module.exports = createConfirmPasswordSchema;