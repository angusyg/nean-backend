/**
 * App API router
 * @module controllers/api
 * @requires express
 * @requires config/api
 * @requires models/endpoint
 * @requires services/users
 * @requires helpers/logger
 */

const express = require('express');
const { api, httpStatus } = require('../config/api');
const Endpoint = require('../models/endpoint');
const userService = require('../services/users');
const { logger } = require('../helpers/logger')();

const router = express.Router();

const discover = new Endpoint('discover', '/discover', 'GET', false, false, httpStatus.ok);
discover.register(router, (req, res) => res.status(discover.httpStatusCodeOK).json(api));

const logging = new Endpoint('logging', '/log/:level', 'POST', false, true, httpStatus.noContent);
logging.register(router, (req, res) => {
  logger[req.params.level](JSON.stringify(req.body));
  res.status(logging.httpStatusCodeOK).end();
});

const login = new Endpoint('login', '/login', 'POST', false, true, httpStatus.ok);
login.addError('BAD_LOGIN', 'Bad login', httpStatus.unauthorizedAccess);
login.addError('BAD_PASSWORD', 'Bad password', httpStatus.unauthorizedAccess);
login.register(router, (req, res, next) => {
  userService.login(req.body)
    .catch(err => next(err))
    .then(tokens => res.status(login.httpStatusCodeOK).json(tokens));
});

const logout = new Endpoint('logout', '/logout', 'GET', true, false, httpStatus.ok);
logout.register(router, (req, res) => res.status(logout.httpStatusCodeOK).end());

const refresh = new Endpoint('refresh', '/refresh', 'GET', true, false, httpStatus.ok);
refresh.addError('BAD_LOGIN', 'Bad login', httpStatus.unauthorizedAccess);
refresh.addError('NOT_ALLOWED', 'Refresh not allowed for user', httpStatus.unauthorizedAccess);
refresh.register(router, (req, res, next) => {
  userService.refreshToken(req.user, req.refresh)
    .catch(err => next(err))
    .then(token => res.status(refresh.httpStatusCodeOK).json(token));
});

module.exports = router;
