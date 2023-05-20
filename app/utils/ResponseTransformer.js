const config = require('./../../config');

class Response {
  constructor(domain) {
    this.domain = domain || config.get('server.app.domain');
  }

  success(path, response, status = 'success') {
    const current_url = `${this.domain}${path}`;
    // const messages = err.message || err.error.message;

    if (response.length <= 0) {
      return new Error('Error: Object (data) is required!');
    }

    const { message, data } = response;

    return {
      current_url,
      message,
      data,
      status: 'Success',
    };
  }

  error(req, res, err) {
    const current_url = `${this.domain}${req.originalUrl}`;
    const message = err.message || 'Bad Request';
    const code = err.statusCode || err.code || 400;
    if (!message) {
      return new Error('Error: Object (message) is required!');
    }

    return res.status(code).json({
      current_url,
      message,
      // name: err.name || err.error.name,
      status_code: code,
    });
  }

  validation_error(req, res, err) {
    const current_url = `${this.domain}${req.originalUrl}`;
    const message = err.message || err.error.message;
    const code = err.statusCode || 422;

    if (!message) {
      return new Error('Error: Object (message) is required!');
    }

    return res.status(422).json({
      current_url,
      message,
      name: err.name || err.error.name,
      errors: err.errors || err.error.details,
      code,
    });
  }

  pagination(path, response, status = 'success') {
    const current_url = `${this.domain}${path}`;
    // const messages = err.message || err.error.message;

    if (response.length <= 0) {
      return new Error('Error: Object (data) is required!');
    }

    const { message, data, params, query } = response;
    
    let total = query.total || data.length ? parseInt(data[0].over_all_count) : 0;

    let page =
      parseInt(params.page || query.page || 1) >= total
        ? total
        : parseInt(params.page || query.page || 1);
    let limit = parseInt(
      params.limit || query.limit || config.get('server.app.pagination_size')
    );
    let last_page = Math.ceil(total / limit) > 0 ? Math.ceil(total / limit) : 1;
    let next_page = page > last_page ? page : data.length ? page + 1 : 1 ;
    let previous_page = page - 1 < 0 ? 0 : data.length ? page - 1 : 1;
    const meta = {
      page,
      next_page,
      limit,
      total,
      last_page,
      previous_page,
    };

    if (!data.length) {
      return {
        current_url,
        message,
        data,
        meta,
        status: 'Success',
      };
    }

    if (data.length && !data[0].over_all_count) {
      throw new Error(
        'Over All Count (over_all_count) is expected in the query'
      );
    }

    if (!data[0].over_all_count) {
      throw new Error(
        'Over All Count (over_all_count) is expected in the query'
      );
    }

    // let total = data.parseInt()
    // let total = parseInt(query.total);
   

    return {
      current_url,
      message,
      data,
      meta,
      status: 'Success',
    };
  }

  external_pagination(path, response, status = 'success') {
    const current_url = `${this.domain}${path}`;
    
    return {
      current_url,
      message: 'Successfully Retrieved',
      data: response.data.data,
      meta: response.data.meta,
      status: 'Success',
    };
  }
}

module.exports = new Response();
