/**
 * App main and debug logger
 * @module helpers/logger
 * @requires fs
 * @requires pino
 * @requires pino-debug
 * @requires pino-multi-stream
 * @requires debug
 * @requires config/logger
 */

const fs = require('fs');
const pino = require('pino');
const pinoDebug = require('pino-debug');
const multistream = require('pino-multi-stream').multistream;
const debug = require('debug');
const config = require('../config/logger');

/**
 * Creates streams depending current execution environment
 * @function getStreams
 * @private
 * @param  {Error}          req  - Request received
 * @param  {Response}       res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
function getStreams() {
  const streams = [{
    level: config.logLevel,
    stream: fs.createWriteStream(config.logFile, { flag: 'a' }),
  }];
  if (process.env.NODE_ENV !== 'production') {
    streams.push({
      level: config.debugLevel,
      stream: process.stderr,
    });
    streams.push({
      level: config.debugLevel,
      stream: fs.createWriteStream(config.debugFile, { flag: 'a' }),
    });
  }
  return streams;
}

const logger = pino({ level: config.debugLevel }, multistream(getStreams()));
pinoDebug(logger, { auto: false, map: config.debugMapNs });
const get = (name) => {
  if (name) {
    debug(`${config.debugBaseNs}:helpers:logger`)(`${config.debugBaseNs}helpers:logger:get: Creating logger for namespace ${name}`);
    return {
      logger,
      debug: debug(`${config.debugBaseNs}${name}`),
    };
  }
  return { logger };
};

module.exports = get;
