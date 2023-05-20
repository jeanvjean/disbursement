let url;

switch (process.env.APP_ENV.toLowerCase()) {
        case 'development':
            url = process.env.DATABASE_DEVELOPMENT_URL;
            break;
        case 'test':
            url = process.env.DATABASE_TEST_URL;
            break;
        case 'production':
            url = process.env.DATABASE_PRODUCTION_URL;
            break;
        default:
            url = process.env.DATABASE_DEVELOPMENT_URL;
            break;
}

exports.database = {
    url
};
