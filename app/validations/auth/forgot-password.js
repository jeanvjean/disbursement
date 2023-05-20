const Joi = require('@hapi/joi');

const createForgotPasswordSchema = Joi.object().keys({
    email: Joi.string().email().required()
});

module.exports = createForgotPasswordSchema;
