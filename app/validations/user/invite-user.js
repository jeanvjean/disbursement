const Joi = require('@hapi/joi');

const createInviteUserSchema = Joi.object().keys({
    first_name: Joi.string().required().min(2),
    last_name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required().min(11),
    programmes: Joi.array().items(
        Joi.object().keys({ 
            id: Joi.string().required(),
            name: Joi.string().required(),
        })
    ),
    user_type: Joi.string().required().valid('administrator', 'representative', 'partner'),
});

module.exports = createInviteUserSchema;
