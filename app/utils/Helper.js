const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const { addMonths, endOfToday, format, addMinutes } = require('date-fns');
const uuidAPIKey = require('uuid-apikey');
const ClientHttp = require('../utils/Client');
const axios = require('axios');

const { bankNameMatchers } = require('../storage/bankNameMatchers');
const accountNumberArray = require('../storage/accountNumberMatcher');

class Helper {
  constructor({ config, errors }) {
    this.config = config;
    this.errors = errors;
    this.accountNumberMapper = accountNumberArray;
  }

  async hashPassword(text) {
    try {
      const salt = parseInt(this.config.get('server.app.round_salt'));

      const hash = bcrypt.hashSync(text, salt);

      return hash;
    } catch (err) {
      throw new Error(err);
    }
  }

  async generateUserPassword() {
    try {
      const password = generator.generate({
        length: 12,
        numbers: true,
      });

      const hashPassword = bcrypt.hashSync(
        password,
        this.config.get('server.app.round_salt')
      );

      return { raw: password, hash: hashPassword };
    } catch (err) {
      throw new Error(err);
    }
  }

  async generateResetPasswordLink() {
    try {
      const { uuid } = uuidAPIKey.create();
      const expiredAt = addMinutes(new Date(), 15);

      return { tokenId: uuid, uuid, expiredAt };
    } catch (err) {
      throw new Error(err);
    }
  }

  async formResetPasswordLink() {
    try {
      const {
        tokenId,
        uuid,
        expiredAt,
      } = await this.generateResetPasswordLink();

      const link = `${this.config.get(
        'server.app.frontend_uri'
      )}?token=${tokenId}`;

      return { tokenId: uuid, expiredAt, url: link };
    } catch (err) {
      throw new Error(err);
    }
  }

  async comparePassword(plain, encrypted) {
    try {
      const valid = bcrypt.compareSync(plain, encrypted);

      return valid;
    } catch (err) {
      throw new this.errors.InternalServer(err);
    }
  }

  async generateToken(payload) {
    try {
      const token = jwt.sign(
        {
          data: payload,
        },
        this.config.get('server.jwt.secret'),
        { expiresIn: this.config.get('server.jwt.expires') }
      );

      return token;
    } catch (err) {
      throw new this.errors.InternalServer(err);
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.config.get('server.jwt.secret'));

      return decoded;
    } catch (err) {
      throw new this.errors.InternalServer(err);
    }
  }

  generateKey() {
    try {
      const generatedKey = uuidAPIKey.create();

      const publicKey = `PUBLIC-${generatedKey.uuid.toUpperCase()}`;
      const secretKey = `SECRET-${generatedKey.apiKey}`;

      return { public_key: publicKey, secret_key: secretKey };
    } catch (err) {
      throw new this.errors.InternalServer(err);
    }
  }

  async formatBankName(bankName) {
    try {
      let correctBankName;
      const matchers = [
        { reg: /1/, replace: 'i' },
        { reg: /0/, replace: 'o' },
        { reg: /9/, replace: 'g' },
      ];
      matchers.forEach((match) => {
        correctBankName = bankName.replace(match.reg, match.replace);
      });

      const bankDetails = bankNameMatchers.find((bankNameExpression) =>
        bankNameExpression.expressions.find((exp) => exp.test(correctBankName))
      );
      if (!bankDetails) {
        return {
          bankName: 'Invalid',
          bankCode: 'invalid',
          correctDifference: 0,
        };
      }

      return {
        bankName: bankDetails.name,
        bankCode: bankDetails.code,
        correctDifference: this.detailResolveAccuracy(
          bankName,
          bankDetails.name
        ),
      };
    } catch (error) {
      throw new this.errors.InternalServer(error.message);
    }
  }

  async matchBankCodes(code) {
    const bank = bankNameMatchers.filter(bank=> bank.code === code);
    return bank[0];
  }

  async getBankName(bankName) {
    const [ bank ] = bankNameMatchers.filter(bank=> bank.slug.toLowerCase().trim() === bankName.toLowerCase().trim());
    return {
      bankName: bank.name,
      bankCode: bank.code,
      correctDifference: this.detailResolveAccuracy(
        bankName,
        bank.name
      ),
    };
  }

  detailResolveAccuracy(initialValue, newValue) {
    initialValue = initialValue.toString();
    newValue = newValue.toString();

    var equivalency = 0;
    var minLength =
      initialValue.length > newValue.length
        ? newValue.length
        : initialValue.length;
    var maxLength =
      initialValue.length < newValue.length
        ? newValue.length
        : initialValue.length;
    for (var i = 0; i < minLength; i++) {
      if (initialValue[i] == newValue[i]) {
        equivalency++;
      }
    }

    var weight = equivalency / maxLength;
    return Number((weight * 100).toFixed());
  }

  parseAccountNumber(accountNumber) {
    try {
      let newAccountNumber = '';
      let splitAccountNumber = accountNumber.split('');
      let totalAccuracy = 0;

      for (let i = 0; i <= splitAccountNumber.length - 1; i++) {
        let mappedValue = this.accountNumberMapper.find(({ texts }) => {
          if (texts.includes(splitAccountNumber[i])) {
            if (Number.isInteger(parseInt(splitAccountNumber[i]))) {
              totalAccuracy += 1;
            }
            return texts.includes(splitAccountNumber[i]);
          }
        });
        newAccountNumber += mappedValue
          ? mappedValue.value
          : splitAccountNumber[i];
      }

      return {
        account_number: newAccountNumber,
        account_number_accuracy: this.detailResolveAccuracy(
          accountNumber,
          newAccountNumber
        ),
        // account_number_accuracy: (totalAccuracy / accountNumber.length) * 100,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  getLimitOffset({ limit, page }) {
    try {
      const offset = parseInt(
        parseInt(limit) * parseInt(page) - parseInt(limit)
      );

      return { offset, limit, page };
    } catch (err) {
      throw new Error(err);
    }
  }

  async makeRequestToWebhookUrl(currentClient, payload, headers = {}) {
    try {
      if (!currentClient.webhook_url) {
        return 'done';
      }

      headers = {
        [currentClient.api_key_field]: currentClient.api_key_value,
      };
      const client = new ClientHttp('', headers);

      await client.post(currentClient.webhook_url, payload);

      return 'done';
    } catch (err) {
      throw new Error(err);
    }
  }

  async sendSmsToPhoneNumber(payload) {
    try {
      let headers = {
        'x-api-key': this.config.get('credentials.akupay.api_key'),
      };
      const client = new ClientHttp(
        this.config.get('credentials.akupay.base_uri'),
        headers
      );

      const data = await client.post('publish/x.direct/one', payload);

      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = Helper;
