const Joi = require('@hapi/joi');

const createResolveTransactionSchema = Joi.object().keys({
    payload: Joi.array().items(
        Joi.object().keys({
            new_account_number: Joi.string().required(),
            new_bank_name: Joi.string().required(),
            // account_name: Joi.string(),
            account_number: Joi.string(),
            bank_name: Joi.string(),
            created_at: Joi.string(),
            id: Joi.string(),
            message_content: Joi.string(),
            new_account_number: Joi.string(),
            over_all_count: Joi.string(),
            phone_number: Joi.string(),
            status: Joi.string(),
        })
    ).required()
});

module.exports = createResolveTransactionSchema;
