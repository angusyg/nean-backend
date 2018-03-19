const userService = require('../services/users');
const ApiError = require('../helpers/apierror');

const controller = {};

controller.login = (req, res) => {
  userService.login(req.body)
    .catch(err => ApiError.handle(err, req, res))
    .then(tokens => res.status(req.endpoint.httpStatusCodeOK).json(tokens));
};

controller.refreshToken = (req, res) => {
  userService.refreshToken(req.user, req.refresh)
    .catch(err => ApiError.handle(err, req, res))
    .then(token => res.status(req.endpoint.httpStatusCodeOK).json(token));
};

module.exports = controller;
