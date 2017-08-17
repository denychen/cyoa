'use strict';

const User = require('../models').User;
var NotFoundError = require('../errors/notFoundError');
var AuthError = require('../errors/authError');
var TokenError = require('../errors/tokenError');
var AppError = require('../errors/appError');
const nodemailer = require('nodemailer');
let config = require('../config/config.json');
let moment = require('moment');
let jwt = require('jwt-simple');

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
        user.resetToken = jwt.encode({
          exp: moment().add(2, 'days').valueOf()
        }, config.jwtTokenSecret);
        return user.save().then(user => {
          let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'deny.chen@gmail.com',
                pass: 'uedxxgmykvmbdhrv'
            }
          });

          let mailOptions = {
            to: user.email,
            subject: 'CYOA password reset instructions',
            text: `Copy and paste the following link in your browser to reset your password: http://denychen.com/reset-password?resetToken=${user.resetToken}`,
            html: `Click <a href='http://denychen.com/reset-password?resetToken=${user.resetToken}'>here</a> to reset your password`
          };

          transporter.sendMail(mailOptions);
        });
      }
    });
  },

  resetPassword(resetToken, password) {
    let decodedToken = null;
    try {
      decodedToken = jwt.decode(resetToken, config.jwtTokenSecret);
    } catch(error) {
      return Promise.reject(new TokenError('This token is invalid, so please request another'));
    }

    if (moment(decodedToken.exp).isBefore(moment())) {
      User.findOne({
        where: { resetToken: resetToken }
      }).then(user => {
        if (user) {
          user.resetToken = null;
          user.save();
        } else {
          return Promise.reject(new TokenError('This token is expired, so please request another'));
        }
      });
    } else {
      return Promise.reject(new TokenError('This token is expired, so please request another'));
    }

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