const express = require('express');
const config = require('../config/api');
const ApiError = require('../models/apierror');
const Endpoint = require('../models/endpoint');
const middlewares = require('../helpers/middlewares');
const userService = require('../services/users');
const { logger } = require('../helpers/logger')('controller:api');

const router = express.Router();

// unsecured endpoints

const discover = new Endpoint('discover', '/discover', 'GET', false, false, config.httpStatus.ok);
discover.register(router, (req, res) => res.status(discover.httpStatusCodeOK).json(config.api));

const logging = new Endpoint('logging', '/log/:level', 'POST', false, true, config.httpStatus.noContent);
logging.register(router, (req, res) => {
  logger[req.params.level](JSON.stringify(req.body));
  res.status(logging.httpStatusCodeOK).end();
});

const loginEndpoint = new Endpoint('login', '/login', 'POST', false, true, config.httpStatus.ok);
loginEndpoint.addError('BAD_LOGIN', 'Bad login', config.httpStatus.unauthorizedAccess);
loginEndpoint.addError('BAD_PASSWORD', 'Bad password', config.httpStatus.unauthorizedAccess);
loginEndpoint.register(router, (req, res) => {
  userService.login(req.body)
    .catch(err => ApiError.handle(err, req, res))
    .then(tokens => res.status(loginEndpoint.httpStatusCodeOK).json(tokens));
});

// secured endpoints

router.use(middlewares.loginRequired);

const logoutEndpoint = new Endpoint('logout', '/logout', 'GET', true, false, config.httpStatus.ok);
logoutEndpoint.register(router, (req, res) => res.status(logoutEndpoint.httpStatusCodeOK).end());

const refreshToken = new Endpoint('refresh', '/refresh', 'GET', true, false, config.httpStatus.ok);
refreshToken.addError('BAD_LOGIN', 'Bad login', config.httpStatus.unauthorizedAccess);
refreshToken.addError('NOT_ALLOWED', 'Refresh not allowed for user', config.httpStatus.unauthorizedAccess);
refreshToken.register(router, (req, res) => {
  userService.refreshToken(req.user, req.refresh)
    .catch(err => ApiError.handle(err, req, res))
    .then(token => res.status(req.endpoint.httpStatusCodeOK).json(token));
});

module.exports = router;
