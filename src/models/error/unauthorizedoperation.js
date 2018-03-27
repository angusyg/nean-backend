/**
 * Unauthorized operation error class module to create and convert error to json response
 * @module models/error/unauthorizedoperation
 */

const ApiError = require('./api');
const config = require('../../config/api');

const ns = 'models:error:unauthorizedoperation';
const { debug } = require('../../helpers/logger')(ns);

/**
 * Creates an UnauthorizedOperationError
 * @class
 * @extends {ApiError}
 */
class UnauthorizedOperationError extends ApiError {
  constructor() {
    super();

    /**
     * Description of the error
     * @default Not authorized to perform operation on this endpoint
     * @member {string}
     */
    this.message = 'Not authorized to perform operation on this endpoint';

    /**
     * Name of the error
     * @default UnauthorizedOperationError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * Code of the error
     * @default NOT_AUTHORIZED_OPERATION
     * @member {string}
     */
    this.code = 'NOT_AUTHORIZED_OPERATION';

    /**
     * HTTP status code of the response to be send
     * @default 401
     * @member {number}
     */
    this.statusCode = config.httpStatus.unauthorizedAccess;
    debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }
}

module.exports = UnauthorizedOperationError;
