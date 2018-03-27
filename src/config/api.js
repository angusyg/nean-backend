/**
 * API configuration
 * @module config/api
 */

/**
 * API Server domain
 * @namespace server
 * @property {string} protocol  - Server protocol (http or https)
 * @property {string} host      - Server domain name
 * @property {number|''} port   - Server port
 */
const server = {
  protocol: 'http://',
  host: 'localhost',
  port: 8080,
};

/**
 * HTTP Status code for API response
 * @namespace httpStatus
 * @property {number} serverError           - Internal server error 500
 * @property {number} unauthorizedAccess    - Unauthorized access to API endpoint 401
 * @property {number} unauthorizedOperation - Unauthorized operation on API endpoint 403
 * @property {number} notFound              - API endpoint not found on URL 404
 * @property {number} authenticationExpired - Access token expired 419
 * @property {number} ok                    - Response OK 200
 * @property {number} accepted              - Request accepted, processing 202
 * @property {number} noContent             - Response with no content 204
 */
const httpStatus = {
  serverError: 500,
  unauthorizedAccess: 401,
  unauthorizedOperation: 403,
  notFound: 404,
  authenticationExpired: 419,
  ok: 200,
  accepted: 202,
  noContent: 204,
};

module.exports = {
  server,
  httpStatus,
  tokenSecretKey: 'NEANBACKEND-JWTSecret2018',
  api: {
    serverUrl: `${server.protocol}${server.host}${(server.port ? `:${server.port}` : '')}`,
    base: '/api',
    accessTokenHeader: 'authorization',
    accessTokenExpirationTime: 60 * 10,
    refreshTokenHeader: 'refresh',
    refreshTokenExpirationTime: 60 * 60 * 24,
    errors: [{
      code: 'NO_ENDPOINT',
      message: 'No endpoint mapped for requested url',
      statusCode: httpStatus.notFound,
    }, {
      code: 'NOT_AUTHORIZED_OPERATION',
      message: 'User not authorized to perform operation on this endpoint',
      statusCode: httpStatus.unauthorizedOperation,
    }, {
      code: 'NOT_AUTHORIZED_ACCESS',
      message: 'User not authorized to access to this endpoint',
      statusCode: httpStatus.unauthorizedAccess,
    }, {
      code: 'AUTHENTICATION_EXPIRED',
      message: 'Access token has expired',
      statusCode: httpStatus.authenticationExpired,
    }],
    endpoints: [],
  },
};
