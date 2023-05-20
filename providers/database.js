

module.exports = {
  boot({ config, options }) {
    const pg = require('pg-promise')(options);
    // console.log({ pg });
    if (config.get('server.app.environment') === 'production') {
      // pg.pg.defaults.ssl = false;
      // pg.pg.defaults.rejectUnauthorized = false;
    }

    //  pass database connection string
    const database = pg(config.get('database.url'));

    return { database, pg };
  },
};
