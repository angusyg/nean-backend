const ApiError = require('../models/apierror');

const errorhandler = {};

/**
 * Callback function to pass control to the next matching middleware
 *
 * @callback nextMiddleware
 * @param {string} [route] - Next route to activate
 */

/**
 * Catch all non mapped request for error
 * @param  {Object}         req  - Request received
 * @param  {Object}         res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
errorhandler.errorNoRouteMapped = (req, res, next) => next(new ApiError('API_NO_ENDPOINT'));

/**
 * Default Error handler
 * @param  {Object}         err  - Unhandled error to process
 * @param  {Object}         req  - Request received
 * @param  {Object}         res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
errorhandler.errorHandler = (err, req, res, next) => {
  if (res.headersSent) next(err);
  else ApiError.handle(req, res, err);
};

module.exports = errorhandler;
