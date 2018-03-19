const express = require('express');
const config = require('../config');
const middlewares = require('../helpers/middlewares');
const apiController = require('../controllers/api');
const userController = require('../controllers/users');

const router = express.Router();

// unsecured endpoints
router.get(
  config.api.discover,
  apiController.discover,
);
router.post(
  config.api.endpoints.login.path,
  middlewares.bindEndpoint(config.api.endpoints.login),
  userController.login,
);

// secured endpoints
router.use(middlewares.loginRequired);

router.get(
  config.api.endpoints.refreshToken.path,
  middlewares.bindEndpoint(config.api.endpoints.refreshToken),
  userController.refreshToken,
);

module.exports = router;
