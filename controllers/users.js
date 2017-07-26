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

    return newUser.save().then(user => {
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        token: user.token
      }
    });
  },

  signin(email, password) {
    return User.findOne({
      where: {
        email: email
      }
    }).then(user => {
      if (user) {
        return user.validatePassword(password).then(valid => {
          if (valid) {
            user.token = user.generateToken();
            user.save();

            return {
              id: user.id,
              email: user.email,
              username: user.username,
              token: user.token
            }
          }
        });
      }
    });
  },

  signout(userId) {
    return User.findOne({
      where: {
        id: userId
      }
    }).then(user => {
      user.token = null;
      user.save();
    });
  },

  findById(userId) {
    return User.findOne({
      where: {
        id: userId
      }
    }).then(user => {
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        token: user.token
      };
    });
  }
};