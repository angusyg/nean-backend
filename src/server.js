const http = require('http');
const debug = require('debug')('#APP_NAME#:server');
const app = require('./app');
const logger = require('./helpers/logger').server;
const config = require('./config');

/**
 * Check if port is number or named pipe
 *
 * @param  {Object} val - Value to inspect
 * @return {Object}       normalized server port
 */
function normalizePort(val) {
  const port = parseInt(val, 10);
  // named pipe ?
  if (Number.isNaN(port)) return val;
  // port number ?
  if (port >= 0) return port;
  return false;
}

const port = normalizePort(config.api.server.port);
const server = http.createServer(app); // http server

/**
 * Error handler on server startup
 *
 * @param  {Object} error - Startup error
 */
function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ?
    `Pipe ${port}` :
    `Port ${port}`;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// listening event
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    `pipe ${addr}` :
    `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

// startup server to listen request, error
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

process.on('uncaughtException', (err) => {
  logger.error(`Server internal error: "${err.stack}"`);
  process.exit(1);
});
