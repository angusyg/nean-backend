const express = require('express');
const config = require('../config/api');
const ApiError = require('../helpers/apierror');
const middlewares = require('../helpers/middlewares');
const userService = require('../services/users');
const { debug } = require('../helpers/logger')('controller:api');

const router = express.Router();

let serverUrl = `${config.server.protocol}${config.server.host}`;
if (config.server.port) serverUrl += `:${config.server.port}`;
serverUrl += `${config.base}`;

// unsecured endpoints
router.get(
  config.discover,
  (req, res) => res.status(config.httpStatus.ok).json({
    serverUrl,
    endpoints: config.endpoints,
    accessTokenHeader: config.accessTokenHeader,
    refreshTokenHeader: config.refreshTokenHeader,
  }),
);

router.post(
  config.endpoints.logger.path,
  (req, res) => {
    debug(req.body);
    req.log[req.params.level](req.body);
    res.status(config.httpStatus.noContent).end();
  },
);

router.post(
  config.endpoints.login.path,
  middlewares.bindEndpoint(config.endpoints.login),
  (req, res) => {
    userService.login(req.body)
      .catch(err => ApiError.handle(err, req, res))
      .then(tokens => res.status(req.endpoint.httpStatusCodeOK).json(tokens));
  },
);

// secured endpoints
router.use(middlewares.loginRequired);

router.get(
  config.endpoints.refreshToken.path,
  middlewares.bindEndpoint(config.endpoints.refreshToken),
  (req, res) => {
    userService.refreshToken(req.user, req.refresh)
      .catch(err => ApiError.handle(err, req, res))
      .then(token => res.status(req.endpoint.httpStatusCodeOK).json(token));
  },
);

module.exports = router;
