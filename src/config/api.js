const server = {
  protocol: 'http://',
  host: 'localhost',
  port: 8080,
};

module.exports = {
  server,
  httpStatus: {
    serverError: 500,
    unauthorizedAccess: 401,
    unauthorizedOperation: 403,
    notFound: 404,
    authenticationExpired: 419,
    ok: 200,
    accepted: 202,
    noContent: 204,
  },
  api: {
    serverUrl: `${server.protocol}${server.host}${(server.port ? `:${server.port}` : '')}`,
    base: '/api',
    accessTokenHeader: 'Authorization',
    accessTokenExpirationTime: 60 * 10,
    refreshTokenHeader: 'Refresh',
    refreshTokenExpirationTime: 60 * 60 * 24,
    endpoints: [],
  },
};
