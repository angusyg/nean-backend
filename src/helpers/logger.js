const fs = require('fs');
const pinoDebug = require('pino-debug');
const pino = require('pino');
const multistream = require('pino-multi-stream').multistream;

const logFile = './logs/server.log';
const streams = [{
  level: process.env.LEVEL || 'info',
  stream: fs.createWriteStream(logFile),
}];
if (process.env.NODE_ENV !== 'production') {
  streams.push({
    level: 'debug',
    stream: process.stderr,
  });
}
const logger = pino({
  level: 'debug',
}, multistream(streams));

pinoDebug(logger, {
  auto: false,
  map: {
    'nean:*': 'debug',
  },
});

module.exports = (name) => {
  if (name) {
    return {
      logger,
      debug: require('debug')(`nean:${name}`)
    };
  }
  return {
    logger,
  };
};
