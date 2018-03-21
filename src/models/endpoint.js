const getNamespace = require('continuation-local-storage').getNamespace;
const config = require('../config/api');
const { debug } = require('../helpers/logger')('models:endpoint');

const Endpoint = class Endpoint {
  constructor(name, path, method, secure, data, okCode) {
    this.name = name;
    this.path = path;
    this.method = method;
    this.secure = secure;
    this.data = data;
    this.httpStatusCodeOK = okCode;
    this.errors = [{
      code: 'INTERNAL_ERROR',
      message: 'An error occured while processing request.',
      statusCode: config.httpStatus.serverError,
    }];
    config.api.endpoints.push(this);
    debug(`New endpoint created : ${JSON.stringify(this)}`);
  }

  static getByName(name) {
    return config.api.endpoints.find(endpoint => endpoint.name === name);
  }

  addError(code, message, statusCode) {
    const error = {
      code,
      message,
      statusCode,
    };
    this.errors.push(error);
    debug(`New error added to endpoint '${this.name}' : ${JSON.stringify(error)}`);
  }

  bindToRequest() {
    return (req, res, next) => {
      const nameSpace = getNamespace('requestSession');
      nameSpace.bindEmitter(req);
      nameSpace.bindEmitter(res);
      nameSpace.run(() => {
        nameSpace.set('endpoint', this);
        next();
      });
    };
  }

  getErrorByCode(code) {
    return this.errors.find(error => error.code === code);
  }

  register(router, callback) {
    router[this.method.toLowerCase()](this.path, this.bindToRequest(), callback);
    debug(`Endpoint '${this.name}' registered`);
  }
};

module.exports = Endpoint;
