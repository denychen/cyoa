'use strict'
let config = require('../config/config.json');
let jwt = require('jwt-simple');
let moment = require('moment');
const User = require('../models').User;

module.exports = {
  isAuthenticated(req, res, next) {
    let token = req.header('authorization').split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'Missing token'
      });
    }

    let decodedToken = jwt.decode(token, config.jwtTokenSecret);

    if (moment().isAfter(decodedToken.exp)) {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }

    User.findOne({
      where: {
        token: token
      }
    }).then(user => {
      if (!user) {
        return res.status(401).json({
          error: 'Invalid token'
        });
      }

      req.user = user;

      return next();
    });
  }
};