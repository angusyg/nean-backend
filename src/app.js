const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const pino = require('express-pino-logger');
const uuidv4 = require('uuid/v4');
const helmet = require('helmet');
const cors = require('cors');
const createNamespace = require('continuation-local-storage').createNamespace;
const errorHandler = require('./helpers/errorhandler');
const apiController = require('./controllers/api');
const apiConfig = require('./config/api');
const appConfig = require('./config/app');
const db = require('./config/db');
const { logger } = require('./helpers/logger')();

const app = express();

createNamespace('requestSession');

// Connection to db
db();

app.use(pino({
  logger,
  genReqId: () => uuidv4(),
}));
app.use(helmet());
app.use(cors(appConfig.crossOrigin));
// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Static files
app.use(compression());

// map modules routes
app.use('/api', apiController);

app.use(errorHandler.errorNoRouteMapped);
app.use(errorHandler.errorHandler);

app.listen(apiConfig.server.port);
