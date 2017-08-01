'use strict';

const User = require('../models').User;

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

  signout(user) {
    user.token = null;
    return user.save();
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
  },

  update(userId, email, username, password, oldPassword) {
    return User.findOne({
      where: {
        id: userId
      }
    }).then(user => {
      if (user) {
        return user.validatePassword(oldPassword).then(valid => {
          if (valid) {
            if (email) {
              user.email = email;
            }

            if (username) {
              user.username = username;
            }

            if (password) {
              user.password = password;
            }
            user.token = user.generateToken();

            return user.save().then(user => {
              return {
                id: user.id,
                email: user.email,
                username: user.username,
                token: user.token
              };
            });
          }
        });
      }
    });
  }
};