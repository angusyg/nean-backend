/**
 * Unauthorized access error class module to create and convert error to json response
 * @module models/error/unauthorizedaccess
 */

const ApiError = require('./api');
const config = require('../../config/api');

const ns = 'models:error:unauthorizedaccess';
const { debug } = require('../../helpers/logger')(ns);

/**
 * Creates an UnauthorizedAccessError
 * @class
 * @extends {ApiError}
 */
class UnauthorizedAccessError extends ApiError {
  constructor() {
    super();

    /**
     * Description of the error
     * @default Not authorized to access to this endpoint
     * @member {string}
     */
    this.message = 'Not authorized to access to this endpoint';

    /**
     * Name of the error
     * @default UnauthorizedAccessError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * Code of the error
     * @default NOT_AUTHORIZED_ACCESS
     * @member {string}
     */
    this.code = 'NOT_AUTHORIZED_ACCESS';

    /**
     * HTTP status code of the response to be send
     * @default 401
     * @member {number}
     */
    this.statusCode = config.httpStatus.unauthorizedAccess;
    debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }
}

module.exports = UnauthorizedAccessError;
