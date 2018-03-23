const kindOf = require('kindof');
const getNamespace = require('continuation-local-storage').getNamespace;
const config = require('../config/api');

const ns = 'models:apierror';
const { logger, debug } = require('../helpers/logger')(ns);

const ApiError = class ApiError extends Error {
  constructor(arg) {
    super('An unknown server error occured while processing request');
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.code = 'INTERNAL_ERROR';
    this.statusCode = config.httpStatus.serverError;

    const type = kindOf(arg);
    if (type === 'error') this.message = arg.message;
    else if (type === 'string') {
      // Check if API general error
      let error = config.api.errors.find(err => err.code === arg);
      if (error === undefined) {
        // Get current request endpoint if it exists
        const endpoint = getNamespace('requestSession').get('endpoint');
        if (endpoint === undefined) logger.warn(`${ns}:new: no endpoint found in request session`);
        else {
          // Get error from endpoint errors
          error = endpoint.getErrorByCode(arg);
          if (error === undefined) logger.warn(`${ns}:new: no error found for api or endpoint '${endpoint.name}' with code '${arg}'`);
          else {
            this.code = error.code;
            this.message = error.message;
            this.statusCode = error.httpStatusCode;
          }
        }
      } else {
        this.code = error.code;
        this.message = error.message;
        this.statusCode = error.httpStatusCode;
      }
    }
    debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }

  static handle(req, res, err) {
    if (err instanceof ApiError) err.send(req, res);
    else new ApiError(err).send(req, res);
  }

  send(req, res) {
    const err = {
      code: this.code,
      message: this.message,
      reqId: req.id,
    };
    res.status(this.statusCode).json(err);
    logger.error(`${ns}:send: sending error : ${JSON.stringify(err)}`);
  }
};

module.exports = ApiError;
