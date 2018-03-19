const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const config = require('../config');
const ApiError = require('../helpers/apierror');

const loginEndpoint = config.api.endpoints.login;
const refreshTokenEndpoint = config.api.endpoints.refreshToken;
const service = {};

function generateAccessToken(user) {
  return jwt.sign({
    login: user.login,
    roles: user.roles,
    exp: Math.floor(Date.now() / 1000) + config.api.accessTokenExpirationTime,
  }, config.tokenSecretKey);
}

function registerRefreshToken(user) {
  return new Promise((resolve, reject) => {
    const refreshToken = uuidv4();
    User.findOneAndUpdate({
        _id: user._id
      }, {
        refreshToken
      })
      .catch(err => reject(new ApiError(loginEndpoint.errors[1], err)))
      .then(() => resolve(refreshToken));
  });
}

service.login = infos => new Promise((resolve, reject) => {
  User.findOne({
      login: infos.login
    })
    .catch(err => reject(err))
    .then((user) => {
      if (!user) reject(new ApiError(loginEndpoint.errors[1]));
      else {
        user.comparePassword(infos.password)
          .catch(err => reject(err))
          .then((match) => {
            if (!match) reject(new ApiError(loginEndpoint.errors[2]));
            else {
              registerRefreshToken(user)
                .catch(err => reject(err))
                .then(refreshToken => resolve({
                  refreshToken,
                  accessToken: generateAccessToken(user),
                }));
            }
          });
      }
    });
});

service.refreshToken = (infos, refreshToken) => new Promise((resolve, reject) => {
  User.findOne({
      login: infos.login,
      refreshToken,
    })
    .catch(err => reject(new ApiError(refreshTokenEndpoint.errors[2], err)))
    .then(user => resolve({
      accessToken: generateAccessToken(user)
    }));
});

module.exports = service;
