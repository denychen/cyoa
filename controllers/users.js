'use strict';

const User = require('../models').User;
var NotFoundError = require('../errors/notFoundError');
var AuthError = require('../errors/authError');
var AppError = require('../errors/appError');

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
    }).catch(error => {
      return Promise.reject(new AuthError(error.errors[0].message, 422));
    });
  },

  signin(email, password) {
    return User.findOne({
      where: { email: email }
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
          } else {
            return Promise.reject(new AuthError('username and password must be valid', 401));
          }
        }).catch(error => {
          return Promise.reject(new AuthError('username and password must be valid', 401));
        });
      } else {
        return Promise.reject(new AuthError('username and password must be valid', 401)); 
      }
    });
  },

  signout(user) {
    user.token = null;
    return user.save().then(() => {
      return Promise.resolve({ status: 204 });
    }).catch(error => {
      return Promise.reject(new AppError());
    });
  },

  forgotPassword(email) {
    return User.findOne({
      where: { email: email }
    }).then(user => {
      if (user) {
        user.resetToken = user.generateResetToken();
        return user.save().then(user => {
          //send user.resetToken to email
        });
      }
    });
  },

  resetPassword(resetToken, password) {
    return User.findOne({
      where: { resetToken: resetToken }
    }).then(user => {
      if (user) {
        user.resetToken = null;
        user.password = password;

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
  },

  findById(userId) {
    return User.findOne({
      where: { id: userId }
    }).then(user => {
      if (user) {
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          token: user.token
        };
      } else {
        return Promise.reject(new NotFoundError('Unable to find user'));
      }
    }).catch(error => {
      return Promise.reject(new AppError());
    });
  },

  update(userId, email, username, password, oldPassword) {
    return User.findOne({
      where: { id: userId }
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

            if (email || username || password) {
              user.token = user.generateToken();

              return user.save().then(user => {
                return {
                  id: user.id,
                  email: user.email,
                  username: user.username,
                  token: user.token
                };
              }).catch(error => {
                return Promise.reject(new AppError());
              });
            } else {
              return {
                id: user.id,
                email: user.email,
                username: user.username,
                token: user.token
              };
            }
          } else {
            return Promise.reject(new AuthError('Password must be valid', 403)); 
          }
        }).catch(error => {
          return Promise.reject(new AuthError('Password must be valid', 403));
        });
      } else {
        return Promise.reject(new NotFoundError('Unable to find user'));
      }
    }).catch(error => {
      if (error.name === 'AuthError') {
        return Promise.reject(error);
      } else {
        return Promise.reject(new AppError());
      }
    });
  }
};