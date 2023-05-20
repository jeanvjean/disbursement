const path = require('path')
const ejs = require('ejs')
const ClientHttp = require('../utils/Client')

class PaymentService {
    constructor ({ config, errors }) {
        this.baseUrl = config.get('payment.base_uri');
        this.headers = {
            'public-key': config.get('payment.public_key')
        },
        this.errors = errors;
        this.config = config;
        this.client = new ClientHttp(this.baseUrl, this.headers)
    }

    async resolveAccountNumber({ account_number, bank_code }) {
        try {
            console.log({ account_number, bank_code });
            const data = await this.client.post('banks/resolve-account-number', {
                bank_account_number: account_number, bank_code
            });

            console.log({paystackData: data})

            return data;
        } catch (error) {
            console.log({paystackError: error})
            throw new Error(error.message);
        }
    }
}

module.exports = PaymentService;
