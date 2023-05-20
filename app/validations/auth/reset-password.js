const Joi = require('@hapi/joi');

const resetPasswordSchema = Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().min(6).max(15).required(),
    password_confirmation: Joi.any().valid(Joi.ref('password')).required()
});

module.exports = resetPasswordSchema;
