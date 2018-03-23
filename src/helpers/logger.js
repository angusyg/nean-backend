const fs = require('fs');
const pinoDebug = require('pino-debug');
const pino = require('pino');
const multistream = require('pino-multi-stream').multistream;
const debug = require('debug');
const config = require('../config/logger');

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

pinoDebug(logger, {
  auto: false,
  map: config.debugMapNs,
});

const selfDebug = debug(`${config.debugBaseNs}:helpers:logger`);

const get = (name) => {
  if (name) {
    selfDebug(`${config.debugBaseNs}helpers:logger:get: Creating logger for namespace ${name}`);
    return {
      logger,
      debug: debug(`${config.debugBaseNs}${name}`),
    };
  }
  return { logger };
};

module.exports = get;
