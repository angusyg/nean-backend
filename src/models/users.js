const Document = require('camo').Document;
const bcrypt = require('bcrypt');
const config = require('../config');

const User = class User extends Document {
  constructor() {
    super();
    this.login = {
      type: String,
      unique: true,
      required: true,
    };
    this.password = {
      type: String,
      required: true,
    };
    this.roles = [String];
    this.refreshToken = {
      type: String,
      default: '',
    };
  }

  preSave() {
    this.password = bcrypt.hashSync(this.password, config.saltFactor);
  }

  comparePassword(candidatePassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, this.password)
        .catch(err => reject(err))
        .then(match => resolve(match));
    });
  }
};

module.exports = User;
