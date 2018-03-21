const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const pino = require('express-pino-logger');
const uuidv4 = require('uuid/v4');
const createNamespace = require('continuation-local-storage').createNamespace;
const appMiddleware = require('./helpers/middlewares');
const apiController = require('./controllers/api');
const config = require('./config');
const { logger } = require('./helpers/logger')();


const app = express();

createNamespace('requestSession');

// configuration: DB connection
config.connectDb();

app.use(pino({
  logger,
  genReqId: () => uuidv4(),
}));
// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Static files
app.use(compression());

// map modules routes
app.use('/api', apiController);

app.use(appMiddleware.errorMapper);
app.use(appMiddleware.errorHandler);

app.listen(config.api.server.port);
