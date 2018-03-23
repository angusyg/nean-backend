const server = {
  protocol: 'http://',
  host: 'localhost',
  port: 8080,
};
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
      code: 'API_NO_ENDPOINT',
      message: 'No endpoint mapped for requested url',
      httpStatusCode: httpStatus.notFound,
    }, {
      code: 'API_NOT_AUTHORIZED_OPERATION',
      message: 'User not authorized to perform operation on this endpoint',
      httpStatusCode: httpStatus.unauthorizedOperation,
    }, {
      code: 'API_NOT_AUTHORIZED_ACCESS',
      message: 'User not authorized to access to this endpoint',
      httpStatusCode: httpStatus.unauthorizedAccess,
    }, {
      code: 'API_AUTHENTICATION_EXPIRED',
      message: 'Access token has expired',
      httpStatusCode: httpStatus.authenticationExpired,
    }],
    endpoints: [],
  },
};
