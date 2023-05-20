const Joi = require('@hapi/joi');

const createUserSchema = Joi.object().keys({
    first_name: Joi.string().required().min(2),
    last_name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    phone_number: Joi.string().required().min(11),
    user_type: Joi.string().required().valid('administrator', 'representative', 'partner'),
//   gender: Joi.string().valid('Male', 'Female'),
});

module.exports = createUserSchema;
