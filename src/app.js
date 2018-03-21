const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const pino = require('express-pino-logger');
const uuidv4 = require('uuid/v4');
const appMiddleware = require('./helpers/middlewares');
const apiController = require('./controllers/api');
const config = require('./config');
const { logger } = require('./helpers/logger')();


const app = express();

// configuration: DB connection
config.connectDb();

app.use(pino({
  logger,
  genReqId: () => uuidv4(),
}));
// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(appMiddleware.generateRequestUUID);

// Static files
app.use(compression());

// map modules routes
app.use('/api', apiController);

app.use(appMiddleware.errorMapper);
app.use(appMiddleware.errorHandler);

app.listen(config.api.server.port);
