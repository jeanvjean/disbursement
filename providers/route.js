module.exports = {
    boot(app, { config, routes }) {
        app.use('/api/v1/', routes());
    }
};
