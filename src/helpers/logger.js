const winston = require('winston');
const WinstonRotator = require('winston-daily-rotate-file');
const config = require('../config');

const logger = {};

winston.emitErrs = false;

function getTransports(type) {
  const transports = [new WinstonRotator(config.log[type].file)];
  if (process.env.NODE_ENV !== 'production') transports.push(new winston.transports.Console(config.log[type].console));
  return transports;
}

function getLogger(type) {
  return new winston.Logger({
    transports: getTransports(type),
    exitOnError: config.log.exitOnError,
  });
}

logger.server = getLogger('server');
logger.client = getLogger('client');

module.exports = logger;
