const config = require('../config');

const controller = {};

controller.discover = (req, res) => res.status(config.httpStatus.ok).json({
  serverUrl: config.api.server.protocol + config.api.server.host + (config.api.server.port ? `:${config.api.server.port}` : '') + config.api.base,
  endpoints: config.api.endpoints,
  accessTokenHeader: config.api.accessTokenHeader,
  refreshTokenHeader: config.api.refreshTokenHeader,
});

module.exports = controller;
