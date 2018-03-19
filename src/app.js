const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const appMiddleware = require('./helpers/middlewares');
const loggerRoute = require('./routes/logger');
const apiRoute = require('./routes/api');
const config = require('./config');

const app = express();

// configuration: DB connection
config.connectDb();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(appMiddleware.generateRequestUUID);

// Static files
app.use(compression());

// map modules routes
app.use('/logger', loggerRoute);
app.use('/api', apiRoute);

app.use(appMiddleware.errorMapper);
app.use(appMiddleware.errorHandler);

module.exports = app;
