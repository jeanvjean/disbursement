const Joi = require('@hapi/joi');

const createProgrammeUserSchema = Joi.object().keys({
    user_id: Joi.string().required(),
    programmes: Joi.array().items({
        id: Joi.string().required(),
        name: Joi.string().required()
    })
});

module.exports = createProgrammeUserSchema;
