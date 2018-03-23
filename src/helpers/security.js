const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const getNamespace = require('continuation-local-storage').getNamespace;
const config = require('../config/api');
const ApiError = require('../models/apierror');

const jwtVerify = util.promisify(jsonwebtoken.verify);

const security = {};

/**
 * Callback function to pass control to the next matching middleware
 * @callback nextMiddleware
 * @param {string} [route] - Next route to activate
 */

/**
 * Extract user from JWT Token sent in header
 * @param  {Object}         req  - Request received
 * @param  {Object}         res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
security.requiresLogin = async (req, res, next) => {
  if (req.headers && req.headers[config.api.accessTokenHeader] && req.headers[config.api.accessTokenHeader].split(' ')[0] === 'Bearer') {
    try {
      const decode = await jwtVerify(req.headers[config.api.accessTokenHeader].split(' ')[1], config.tokenSecretKey);
      req.user = decode;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const endpoint = getNamespace('requestSession').get('endpoint');
        if (endpoint === undefined) next(new ApiError());
        else if (endpoint.name === 'refresh') {
          req.user = jsonwebtoken.decode(req.headers[config.api.accessTokenHeader].split(' ')[1]);
          req.refresh = req.headers[config.api.refreshTokenHeader];
          next();
        } else next(new ApiError('API_AUTHENTICATION_EXPIRED'));
      } else next(new ApiError('API_NOT_AUTHORIZED_ACCESS'));
    }
  } else next(new ApiError('API_NOT_AUTHORIZED_ACCESS'));
};

/**
 * Check user's permissions to grant endpoint access
 * @param  {string[]} permissions - Array of permissions of the endpoint
 * @return {function} middleware to check if user has permission to call endpoint
 */
security.requiresPermission = permissions => (req, res, next) => {
  if (permissions.length === 0) next();
  else if (req.user && permissions.some(permission => req.user.permissions.includes(permission))) next();
  else next(new ApiError(req, res, 'API_NOT_AUTHORIZED_OPERATION'));
};

module.exports = security;
