'use strict'
let config = require('../config/config.json');
let jwt = require('jwt-simple');
let moment = require('moment');
const User = require('../models').User;

module.exports = {
  isAuthenticated(req, res, next) {
    let token = req.header('authorization').split(' ')[1];
    
    if (!token) {
      return res.sendStatus(401);
    }

    let decodedToken = jwt.decode(token, config.jwtTokenSecret);

    if (moment().isAfter(decodedToken.exp)) {
      return res.sendStatus(401);
    }

    User.findOne({
      where: {
        token: token
      }
    }).then(user => {
      if (!user) {
        return res.sendStatus(401);
      }

      req.user = user;

      return next();
    });
  }
};