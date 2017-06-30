'use strict';

const User = require('../models').User;
const Passport = require('passport');

module.exports = {
  signup(email, password, username) {
    let newUser = new User({
      email: email,
      password: password,
      username: username
    });

    return newUser.save();
  }
};