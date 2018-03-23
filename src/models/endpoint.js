const getNamespace = require('continuation-local-storage').getNamespace;
const config = require('../config/api');
const security = require('../helpers/security');

const ns = 'models:endpoint';
const { debug } = require('../helpers/logger')(ns);

const Endpoint = class Endpoint {
  constructor(name, path, method, secure, data, okCode) {
    this.name = name;
    this.path = path;
    this.method = method;
    this.secure = secure;
    this.data = data;
    this.httpStatusCodeOK = okCode;
    this.errors = [];
    this.permissions = [];
    config.api.endpoints.push(this);
    debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }

  addError(code, message, statusCode) {
    const error = {
      code,
      message,
      statusCode,
    };
    this.errors.push(error);
    debug(`${ns}:addError: new error added to endpoint '${this.name}' : ${JSON.stringify(error)}`);
  }

  addPermission(perm) {
    this.permissions.push(perm);
    debug(`${ns}:addPermission: new permission(s) added to endpoint '${this.name}' : '${perm.toString()}'`);
  }

  bindToRequest() {
    return (req, res, next) => {
      const nameSpace = getNamespace('requestSession');
      nameSpace.bindEmitter(req);
      nameSpace.bindEmitter(res);
      nameSpace.run(() => {
        nameSpace.set('endpoint', this);
        debug(`${ns}:bindToRequest: endpoint '${this.name}' binded to request '${req.id}'`);
        next();
      });
    };
  }

  getErrorByCode(code) {
    return this.errors.find(error => error.code === code);
  }

  register(router, callback) {
    if (this.secure) router[this.method.toLowerCase()](this.path, this.bindToRequest(), security.requiresLogin, security.requiresPermission(this.permissions), callback);
    else router[this.method.toLowerCase()](this.path, this.bindToRequest(), callback);
    debug(`${ns}:register: endpoint '${this.name}' registered`);
  }
};

module.exports = Endpoint;
