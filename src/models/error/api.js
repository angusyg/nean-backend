/**
 * Api error class module to create and convert error to json response
 * @module models/error/api
 */

const kindOf = require('kindof');
const getNamespace = require('continuation-local-storage').getNamespace;
const config = require('../../config/api');

const ns = 'models:error:api';
const { logger, debug } = require('../../helpers/logger')(ns);

/**
 * The built-in class for creating error object
 * @external Error
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */

/**
 * Creates a new ApiError
 * @class
 * @extends external:Error
 * @name ApiError
 * @param {Error|string} [arg] Error to convert or string key of endpoint error
 */
class ApiError extends Error {
  constructor(arg) {
    super('An unknown server error occured while processing request');
    /**
     * Name of the error
     * @default ApiError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * Code of the error
     * @default INTERNAL_ERROR
     * @member {string}
     */
    this.code = 'INTERNAL_ERROR';

    /**
     * HTTP status code of the response to be send
     * @default 500
     * @member {number}
     */
    this.statusCode = config.httpStatus.serverError;

    const type = kindOf(arg);
    if (type === 'error') this.message = arg.message;
    else if (type === 'string') {
      // Get current request endpoint if it exists
      const endpoint = getNamespace('requestSession').get('endpoint');
      if (endpoint === undefined) logger.warn(`${ns}:new: no endpoint found in request session`);
      else {
        // Get error from endpoint errors
        const error = endpoint.getErrorByCode(arg);
        if (error === undefined) logger.warn(`${ns}:new: no error found for api or endpoint '${endpoint.name}' with code '${arg}'`);
        else {
          this.code = error.code;
          this.message = error.message;
          this.statusCode = error.statusCode;
        }
      }
    }
    if (type !== 'undefined') debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }

  /**
   * Check error type and if needed convert it to ApiError before sending it in response
   * @function handle
   * @static
   * @param  {Request}  req - Request received
   * @param  {Response} res - Response to be send
   * @param  {Error}    err - Error to handle
   */
  static handle(req, res, err) {
    if (err instanceof ApiError) err.send(req, res);
    else new ApiError(err).send(req, res);
  }

  /**
   * Creates response depending on ApiError configuration
   * @function send
   * @param  {Request}  req - Request received
   * @param  {Response} res - Response to be send
   */
  send(req, res) {
    const err = {
      code: this.code,
      message: this.message,
      reqId: req.id,
    };
    res.status(this.statusCode).json(err);
    logger.error(`${ns}:send: sending error : ${JSON.stringify(err)}`);
  }
}

module.exports = ApiError;
