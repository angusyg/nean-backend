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
  httpStatus,
  server,
  base: '/api',
  accessTokenHeader: 'Authorization',
  accessTokenExpirationTime: 60 * 10,
  refreshTokenHeader: 'Refresh',
  refreshTokenExpirationTime: 60 * 60 * 24,
  discover: '/discover',
  endpoints: {
    logger: {
      path: '/logger/:level',
      secure: false,
      data: true,
      method: 'POST',
    },
    login: {
      path: '/login',
      secure: false,
      data: true,
      method: 'POST',
      httpStatusCodeOK: httpStatus.ok,
      errors: [{
        code: 0,
        message: 'Server error',
        httpStatusCode: httpStatus.serverError,
      }, {
        code: 1,
        message: 'Bad login',
        httpStatusCode: httpStatus.unauthorizedAccess,
      }, {
        code: 2,
        message: 'Bad password',
        httpStatusCode: httpStatus.unauthorizedAccess,
      }],
    },
    logout: {
      path: '/logout',
      secure: true,
      data: false,
      method: 'GET',
    },
    refreshToken: {
      path: '/refresh',
      secure: true,
      data: false,
      method: 'GET',
      httpStatusCodeOK: httpStatus.ok,
      errors: [{
        code: 0,
        message: 'Server error',
        httpStatusCode: httpStatus.serverError,
      }, {
        code: 1,
        message: 'Bad login',
        httpStatusCode: httpStatus.unauthorizedAccess,
      }, {
        code: 2,
        message: 'Refresh not allowed for user',
        httpStatusCode: httpStatus.unauthorizedAccess,
      }],
    },
    resources: {},
  },
};
