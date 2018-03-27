/**
 * Url not found error class module to create and convert error to json response
 * @module models/error/notfound
 */

const ApiError = require('./api');
const config = require('../../config/api');

const ns = 'models:error:notfound';
const { debug } = require('../../helpers/logger')(ns);

/**
 * @class
 * @classdesc Url not found error class module to create and convert error to json response
 * @extends {ApiError}
 */
class NotFoundError extends ApiError {
  constructor() {
    super();

    /**
     * Description of the error
     * @default No endpoint mapped for requested url
     * @member {string}
     */
    this.message = 'No endpoint mapped for requested url';

    /**
     * Name of the error
     * @default NotFoundError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * Code of the error
     * @default NOT_FOUND
     * @member {string}
     */
    this.code = 'NOT_FOUND';

    /**
     * HTTP status code of the response to be send
     * @default 404
     * @member {number}
     */
    this.statusCode = config.httpStatus.notFound;
    debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }
}

module.exports = NotFoundError;
