const getNamespace = require('continuation-local-storage').getNamespace;
const config = require('../config/api');
const { logger } = require('../helpers/logger')();

const ApiError = class ApiError extends Error {
  constructor(code, message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.statusCode = statusCode;
  }

  static handle(err, req, res) {
    logger.error(err);
    if (err instanceof ApiError) err.send(req, res);
    else {
      res.status(config.httpStatus.serverError).json({
        code: 'INTERNAL_ERROR',
        message: err.message,
        reqId: req.uuid,
      });
    }
  }

  static getByCode(code) {
    const endpoint = getNamespace('requestSession').get('endpoint');
    const error = endpoint.getErrorByCode(code);
    return new ApiError(error.code, error.message, error.statusCode);
  }

  send(req, res) {
    res.status(this.statusCode).json({
      code: this.code,
      message: this.message,
      reqId: req.id,
    });
  }
};

module.exports = ApiError;
