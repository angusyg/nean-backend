const uuidv4 = require('uuid/v4');
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const logger = require('./logger').server;
const config = require('../config');

const jwtVerify = util.promisify(jsonwebtoken.verify);
const middlewares = {};

/**
 * Callback function to pass control to the next matching middleware
 *
 * @callback nextMiddleware
 * @param {string} [route] - Next route to activate
 */

/**
 * Catch all non mapped request for error
 *
 * @param  {Object}         req  - Request received
 * @param  {Object}         res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
middlewares.errorMapper = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = config.httpStatus.notFound;
  logger.error(`[Request:${req.uuid}][IP:${req.ip}] - Access to undefined path ${req.method} "${req.originalUrl}"`);
  next(err);
};

/**
 * Default Error handler
 *
 * @param  {Object}         err  - Unhandled error to process
 * @param  {Object}         req  - Request received
 * @param  {Object}         res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
middlewares.errorHandler = (err, req, res, next) => {
  if (res.headersSent) next(err);
  else {
    if (err.status) res.status(err.status);
    else {
      res.status(config.httpStatus.serverError);
      if (req.uuid) logger.error(`[Request:${req.uuid}][IP:${req.ip}] - Internal error: "${err.stack}" => 500 sent`);
      else logger.error(`Internal error: "${err.stack}" => 500 sent`);
    }
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV ? undefined : err.stack,
      reqId: req.uuid,
    });
  }
};

/**
 * Generates an unique ID to identify the request
 *
 * @param  {Object}         req  - Request received
 * @param  {Object}         res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
middlewares.generateRequestUUID = (req, res, next) => {
  req.uuid = uuidv4();
  logger.debug(`[Request:${req.uuid}][IP:${req.ip}] - ${req.method} "${req.originalUrl}"`);
  next();
};

/**
 * Extract user from JWT Token sent in header
 * @param  {Object}         req  - Request received
 * @param  {Object}         res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
middlewares.loginRequired = async (req, res, next) => {
  if (req.headers && req.headers[config.api.accessTokenHeader.toLowerCase()] && req.headers[config.api.accessTokenHeader.toLowerCase()].split(' ')[0] === 'Bearer') {
    try {
      const decode = await jwtVerify(req.headers[config.api.accessTokenHeader.toLowerCase()].split(' ')[1], config.tokenSecretKey);
      req.user = decode;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        if (req.url === config.api.endpoints.refreshToken.path) {
          req.user = jsonwebtoken.decode(req.headers[config.api.accessTokenHeader.toLowerCase()].split(' ')[1]);
          req.refresh = req.headers[config.api.refreshTokenHeader.toLowerCase()];
          next();
        } else {
          res.status(config.httpStatus.authenticationExpired).json({
            error: err.name,
            message: err.message,
            reqId: req.uuid,
          });
        }
      } else {
        res.status(config.httpStatus.unauthorizedAccess).json({
          error: err.name,
          message: err.message,
          reqId: req.uuid,
        });
      }
    }
  } else {
    res.status(config.httpStatus.unauthorizedAccess).json({
      error: 'NoAccessTokenFound',
      message: 'No access token found in headers',
      reqId: req.uuid,
    });
  }
};

/**
 * Bind endpoint to a request
 * @param  {Object} endpoint - Endpoint aim by request
 * @return {function} middleware to bind endpoint to request
 */
middlewares.bindEndpoint = endpoint => (req, res, next) => {
  req.endpoint = endpoint;
  next();
};

/**
 * Check roles from user to grant access
 * @param  {string[]} roles - Array of roles of the user
 * @return {function} middleware to check role
 */
middlewares.requireRole = roles => (req, res, next) => {
  if (req.user && roles.some(role => role === req.user.role)) next();
  else {
    res.status(config.httpStatus.unauthorizedOperation).json({
      error: 'UnauthorizedOperation',
      message: 'User roles unauthorized to perform operation',
      reqId: req.uuid,
    });
  }
};

module.exports = middlewares;
