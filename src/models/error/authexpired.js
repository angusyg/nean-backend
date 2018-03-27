/**
 * Creates an authentication expired error
 * @module models/error/authexpired
 */

const ApiError = require('./api');
const config = require('../../config/api');

const ns = 'models:error:authexpired';
const { debug } = require('../../helpers/logger')(ns);

/**
 * Creates an AuthenticationExpiredError
 * @class
 * @extends {ApiError}
 */
class AuthenticationExpiredError extends ApiError {
  constructor() {
    super();

    /**
     * Description of the error
     * @default Access token has expired
     * @member {string}
     */
    this.message = 'Access token has expired';

    /**
     * Name of the error
     * @default AuthenticationExpiredError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * Code of the error
     * @default AUTHENTICATION_EXPIRED
     * @member {string}
     */
    this.code = 'AUTHENTICATION_EXPIRED';

    /**
     * HTTP status code of the response to be send
     * @default 419
     * @member {number}
     */
    this.statusCode = config.httpStatus.authenticationExpired;
    debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }
}

module.exports = AuthenticationExpiredError;
