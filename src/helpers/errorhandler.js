/**
 * Middlewares for error handling
 * @module helpers/errorhandler
 * @requires models/error/api
 * @requires models/error/notfound
 */

const ApiError = require('../models/error/api');
const NotFoundError = require('../models/error/notfound');

const errorhandler = {};

/**
 * Callback function to pass control to the next matching middleware
 * @callback nextMiddleware
 * @global
 * @param {string} [route] - Next route to activate
 */

/**
 * Catch all non mapped request for error
 * @function errorNoRouteMapped
 * @param  {Error}          req  - Request received
 * @param  {Response}       res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
errorhandler.errorNoRouteMapped = (req, res, next) => next(new NotFoundError());

/**
 * Default Error handler
 * @function errorHandler
 * @param  {Error}          err  - Unhandled error to process
 * @param  {Request}        req  - Request received
 * @param  {Response}       res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
errorhandler.errorHandler = (err, req, res, next) => {
  if (res.headersSent) next(err);
  else ApiError.handle(req, res, err);
};

module.exports = errorhandler;
