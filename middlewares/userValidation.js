'use strict'
let config = require('../config/config.js');
var AuthError = require('../errors/authError');

module.exports = {
  passwordRequirement(req, res,next) {
    let user = req.body.user;
    let password = '';

    if (user) {
      password = user.password;
    } else {
      password = req.body.password;
      if (!password) {
        return next();
      }
    }

    if (password.length < config.minimumPasswordLength) {
      return next(new AuthError('The password does not meet requirements'), 422);
    } else {
      return next();
    }
  }
};