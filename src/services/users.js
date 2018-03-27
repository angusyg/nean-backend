const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const config = require('../config/api');
const User = require('../models/users');
const ApiError = require('../models/error/api');

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
    User.findOneAndUpdate({ _id: user._id }, { refreshToken })
      .catch(err => reject(err))
      .then(() => resolve(refreshToken));
  });
}

service.login = infos => new Promise((resolve, reject) => {
  User.findOne({ login: infos.login })
    .catch(err => reject(err))
    .then((user) => {
      if (!user) reject(new ApiError('BAD_LOGIN'));
      else {
        user.comparePassword(infos.password)
          .catch(err => reject(err))
          .then((match) => {
            if (!match) reject(new ApiError('BAD_PASSWORD'));
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
  User.findOne({ login: infos.login, refreshToken })
    .catch(err => reject(err))
    .then(user => resolve({ accessToken: generateAccessToken(user) }));
});

module.exports = service;
