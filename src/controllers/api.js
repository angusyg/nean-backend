const express = require('express');
const config = require('../config/api');
const Endpoint = require('../models/endpoint');
const userService = require('../services/users');
const { logger } = require('../helpers/logger')();

const router = express.Router();

const discover = new Endpoint('discover', '/discover', 'GET', false, false, config.httpStatus.ok);
discover.register(router, (req, res) => res.status(discover.httpStatusCodeOK).json(config.api));

const logging = new Endpoint('logging', '/log/:level', 'POST', false, true, config.httpStatus.noContent);
logging.register(router, (req, res) => {
  logger[req.params.level](JSON.stringify(req.body));
  res.status(logging.httpStatusCodeOK).end();
});

const login = new Endpoint('login', '/login', 'POST', false, true, config.httpStatus.ok);
login.addError('BAD_LOGIN', 'Bad login', config.httpStatus.unauthorizedAccess);
login.addError('BAD_PASSWORD', 'Bad password', config.httpStatus.unauthorizedAccess);
login.register(router, (req, res, next) => {
  userService.login(req.body)
    .catch(err => next(err))
    .then(tokens => res.status(login.httpStatusCodeOK).json(tokens));
});

const logout = new Endpoint('logout', '/logout', 'GET', true, false, config.httpStatus.ok);
logout.register(router, (req, res) => res.status(logout.httpStatusCodeOK).end());

const refresh = new Endpoint('refresh', '/refresh', 'GET', true, false, config.httpStatus.ok);
refresh.addError('BAD_LOGIN', 'Bad login', config.httpStatus.unauthorizedAccess);
refresh.addError('NOT_ALLOWED', 'Refresh not allowed for user', config.httpStatus.unauthorizedAccess);
refresh.register(router, (req, res, next) => {
  userService.refreshToken(req.user, req.refresh)
    .catch(err => next(err))
    .then(token => res.status(refresh.httpStatusCodeOK).json(token));
});

module.exports = router;
