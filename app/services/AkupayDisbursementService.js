const fs = require('fs');
const FormData = require('form-data');
const { s3 } = require('../utils/multer');
const ClientHttp = require('../utils/Client');
const axios = require('axios');

class AkupayDisbursmentService {
  constructor({ config, errors }) {
    this.baseUrl = config.get('credentials.disbursement.base_uri');
    (this.headers = {
      'Authorization': `Bearer ${config.get('credentials.disbursement.public_key')}`,
    }),
      (this.errors = errors);
    this.config = config;
    this.client = new ClientHttp(this.baseUrl, this.headers);
  }

  async getAllTransactions({ params }) {
    try {
      const data = await this.client.get('transactions', { params });

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getATransactions({ id }) {
    try {
      const data = await this.client.get(`transactions/${id}`);

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getDisbursementReportsSummary({ params }) {
    try {
      const data = await this.client.get('applicants/reports/cards', { params });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

    async createFund({ body }) {
        try {
            const data = await this.client.post('funds', body);

            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllFunds({ id, params }) {
        try {
            const data = await this.client.get(`funds`, { params });

            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createBand({ body }) {
      try {
          const data = await this.client.post('cash-bands', body);

          return data;
      } catch (error) {
          throw new Error(error.message);
      }
  }

  async getAllBands({ params }) {
      try {
          const data = await this.client.get(`cash-bands`, { params });

          return data;
      } catch (error) {
          throw new Error(error.message);
      }
  }

  async transactionDisbursement({ params }) {
        try {
            const data = await this.client.get('transactions/disbursement', { params });

            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

  async disursementTransactions({ params }) {
      try {
          const data = await this.client.get('transactions', { params });

          return data;
      } catch (error) {
          throw new Error(error.message);
      }
  }

    

    async disbursementRetracted({ params }) {
        try {
            const data = await this.client.get('transactions/retracted', { params });

            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async disbursementCashout({ params }) {
      try {
          const data = await this.client.get('transactions/cashout', { params });

          return data;
      } catch (error) {
          throw new Error(error.message);
      }
    }

    async createBeneficiary(payload) {
      try {
          const data = await this.client.post('applicants/add', payload);

          return data;
      } catch (error) {
          throw new Error(error.message);
      }
  }

  async uploadBeneficiary({ file, metadata }) {
    try {
      const { fieldname, path } = file;

      const csv = require('csvtojson');
      const applicants= await csv().fromFile(path);
      const payload = {
        user_id: metadata.user_id,
        programme_id: metadata.programme_id,
        key:path,
        bucket:fieldname,
        applicants
      }
      let resp =  await this.client.post('applicants/uploads',payload);
      return resp;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async updateTransactions(payload) {
    try {
      // let resp =  await this.client.post('transactions/approval-pay',payload);
      const resp = await axios.post(`${process.env.AKUPAY_DISBURSEMENT_SERVICE_BASE_URI}transactions/approval-pay`, 
      payload, {
        headers: {
          'Authorization': `Bearer ${process.env.AKUPAY_DISBURSEMENT_SERVICE_PUBLIC_KEY}`
        }
      })
      return resp;
     
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async beneficiaryAccountUpload({ file, metadata }) {
    try {
      const { bucket, key } = file;

      const payload = {
        user_id: metadata.id,
        email: metadata.email,
        first_name: metadata.first_name,
        last_name: metadata.last_name,
        programme_id: metadata.programme_id,
        key,
        bucket,
      }
      return await this.client.post('transactions/upload-beneficiary', payload);
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async uploadError({ params }) {
    try {
        const data = await this.client.get('logs/upload-errors', { params });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async webhookResponse({ params }) {
    try {
        const data = await this.client.get('logs/webhook-response', { params });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async allProgramme() {
    try {
        const data = await this.client.get('programmes');

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getProgramme(id) {
    try {
        const data = await this.client.get(`programmes/${id}`);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async createProgramme(payload) {
    try {
        const data = await this.client.post('programmes', payload);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async deleteProgramme(id) {
    try {
        const data = await this.client.delete(`programmes/${id}`);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async createMessage(id, payload) {
    try {
        const data = await this.client.post(`programmes/${id}/sms`, payload);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getMessage(id) {
    try {
        const data = await this.client.get(`programmes/sms/${id}`);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async allMessage() {
    try {
        const data = await this.client.get(`programmes/sms/`);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async updateMessage(id, payload) {
    try {
        const data = await this.client.put(`programmes/sms/${id}`, payload);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async deleteMessage() {
    try {
        const data = await this.client.delete(`programmes/sms/${id}`);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getProgrammeMessage(id, params) {
    try {
        const data = await this.client.get(`programmes/${id}/sms`, { params });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async approveFlagged({ body }) {
    try {
        const data = await this.client.post(`transactions/pay`, body);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async requery({ body }) {
    try {
        const data = await this.client.post(`transactions/requery`, body);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async retry({ body }) {
    try {
        const data = await this.client.post(`transactions/retry`, body);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async exportTransaction({ query, user }) {
    try {
      const data = await this.client.post('transactions/export', { query, user });

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async exportFunds({ params, query, user }) {
    try {
        const data = await this.client.post(`funds/export`, {params, query, user});
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

  async updateProgrammme(id, body) {
    try {
        const data = await this.client.put(`programmes/${id}`, body);

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getApplicantReplies({params}) {
    try {
   
        const data = await this.client.get(`sms/applicant-replies`, { params });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getApplicantRepliesExport({ params, query, user }) {
    try {
        const data = await this.client.post(`sms/applicant-replies/export`, {params, query, user});
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async exportAllBands({ params, user}) {
    try {
        const data = await this.client.post(`cash-bands/export`, {params, user});
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async exportDisbursementCashout({ params, query, user }) {
    try {
        const data = await this.client.post('transactions/cashout/export', { params, query, user });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getAllSMSLogs({query}) {
    try {
  
        const data = await this.client.get(`sms/logs`, { params: query });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }
  async exportWebhookResponse({params, query, user}) {
    try {
        const data = await this.client.post(`logs/webhook-response/export`, { params, query, user });
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }
  async exportDisbursementRetracted({ params, query, user }) {
    try {
        const data = await this.client.post('transactions/retracted/export', { params, query, user });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }
  async exportTransactionDisbursement({ params, query, user }) {
    try {
        const data = await this.client.post('transactions/disbursement/export', { params, query, user });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }
  async exportUploadError({ params, query, user }) {
    try {
        const data = await this.client.post('logs/upload-errors/export', { params, query, user });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }
  async exportSMSLogs({params, query, user}) {
    try {
        const data = await this.client.post(`sms/logs/export`, { params, query, user });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
  }
}

module.exports = AkupayDisbursmentService;
