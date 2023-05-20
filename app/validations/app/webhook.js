const Joi = require('@hapi/joi');

const WebhookSchema = Joi.object().keys({
    type: Joi.string().required(),
    phone_number: Joi.string().required(),
    status: Joi.string().required(),

    //Beneficiary Schema
    first_name: Joi.when('type', {
        is: 'beneficiary',
        then: Joi.string().min(3).required(),
        otherwise: Joi.string().allow('')
    }),
    last_name: Joi.when('type', {
        is: 'beneficiary',
        then: Joi.string().min(3).required(),
        otherwise: Joi.string().allow('')
    }),
    amount_credited: Joi.when('type', {
        is: 'beneficiary',
        then: Joi.number().required(),
        otherwise: Joi.string().allow('')
    }),
    date_of_transaction: Joi.when('type', {
        is: 'beneficiary',
        then: Joi.string().pattern(new RegExp('[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]')).required(),
        otherwise: Joi.string().allow('')
    }),
    account_number: Joi.when('type', {
        is: 'beneficiary',
        then: Joi.string().min(10).max(10).required(),
        otherwise: Joi.string().allow('')
    }), 
    bank_name: Joi.when('type', {
        is: 'beneficiary',
        then: Joi.string().required(),
        otherwise: Joi.string().allow('')
    }),
    bank_code: Joi.when('type', {
        is: 'beneficiary',
        then: Joi.string().min(3).max(3).required(),
        otherwise: Joi.string().allow('')
    }),
    
    //USSD Schema
    service_code: Joi.when('type', {
        is: 'ussd',
        then: Joi.string().required(),
        otherwise: Joi.string().allow('')
    }),
    duration: Joi.when('type', {
        is: 'ussd',
        then: Joi.string().required(),
        otherwise: Joi.string().allow('')
    }),
    transaction_date: Joi.when('type', {
        is: 'ussd',
        then: Joi.string().pattern(new RegExp('[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]')).required(),
        otherwise: Joi.string().allow('')
    }),

    //SMS Schema
    sms_content: Joi.when('type', {
        is: 'sms',
        then: Joi.string().required(),
        otherwise: Joi.string().allow('')
    }),
    sms_sent_at: Joi.when('type', {
        is: 'sms',
        then: Joi.string().pattern(new RegExp('[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]')).required(),
        otherwise: Joi.string().allow('')
    }),
    sms_type: Joi.when('type', {
        is: 'sms',
        then: Joi.string().valid('inbox', 'outbox').required(),
        otherwise: Joi.string().allow('')
    })
});

module.exports = WebhookSchema;
