/**
 * App logger configuration
 * @module config/logger
 * @requires path
 */

const path = require('path');

module.exports = {
  logFile: path.join(__dirname, '..', '..', 'logs', 'server.log'),
  logLevel: process.env.LEVEL || 'info',
  debugFile: path.join(__dirname, '..', '..', 'logs', 'debug.log'),
  debugLevel: 'debug',
  debugBaseNs: 'nean:',
  debugMapNs: {
    'nean:*': 'debug',
  },
};
