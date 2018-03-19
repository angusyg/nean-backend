const path = require('path');
const fs = require('fs');
const camo = require('camo');

const server = {
  protocol: 'http://',
  host: 'localhost',
  port: 8080,
};
const dbFolder = path.join(__dirname, '..', '..', 'data');

function logFolder() {
  const folder = path.join(__dirname, '..', '..', 'logs');
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
  return folder;
}

function timestamp() {
  return (new Date()).toLocaleString();
}

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
  saltFactor: 10,
  tokenSecretKey: 'NEANBACKEND-JWTSecret2018',
  api: {
    server,
    base: '/api',
    accessTokenHeader: 'Authorization',
    accessTokenExpirationTime: 60 * 10,
    refreshTokenHeader: 'Refresh',
    refreshTokenExpirationTime: 60 * 60 * 24,
    discover: '/discover',
    endpoints: {
      logger: {
        path: '/logger',
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
  },
  crossOrigin: {
    origin(origin, callback) {
      const whitelistOrigins = [`${server.protocol + server.host}:${server.port}`];
      if (whitelistOrigins.indexOf(origin) !== -1) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    maxAge: 600,
  },
  log: {
    server: {
      file: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        filename: `${logFolder()}/-server.log`,
        datePattern: 'dd-MM-yyyy',
        prepend: true,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
        maxDays: 7,
        timestamp,
      },
      console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp,
      },
      exitOnError: false,
    },
    client: {
      file: {
        level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
        filename: `${logFolder()}/-client.log`,
        datePattern: 'dd-MM-yyyy',
        prepend: true,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
        maxDays: 7,
        timestamp,
      },
      console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp,
      },
      exitOnError: false,
    },
  },
  connectDb: () => {
    if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder);
    camo.connect(`nedb://${dbFolder}`).catch((err) => {
      console.error(`Server internal error: ${err.message} => exit`);
      process.exit(0);
    });
  },
};
