exports.credentials = {
  akupay: {
    base_uri: process.env.AKUPAY_BASE_URL,
    api_key: process.env.AKUPAY_API_KEY,
  },
  disbursement: {
    base_uri: process.env.AKUPAY_DISBURSEMENT_SERVICE_BASE_URI,
    public_key: process.env.AKUPAY_DISBURSEMENT_SERVICE_PUBLIC_KEY,
    secret_key: process.env.AKUPAY_DISBURSEMENT_SERVICE_SECRET_KEY,
  }
};
