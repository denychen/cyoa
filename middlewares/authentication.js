'use strict'
let config = require('../config/config.json');
let jwt = require('jwt-simple');
let moment = require('moment');
const User = require('../models').User;
const StoryUser = require('../models').StoryUser;
const Page = require('../models').Page;
var NotFoundError = require('../errors/notFoundError');
var AuthError = require('../errors/authError');
var AppError = require('../errors/appError');

module.exports = {
  isAuthenticated(req, res, next) {
    let header = req.header('authorization'); 
    let token = null;
    
    if (header) {
      token = header.split(' ')[1];
    }

    if (!header || !token) {
      return next(new AuthError('Missing token'), 401);
    }

    let decodedToken = jwt.decode(token, config.jwtTokenSecret);

    if (moment().isAfter(decodedToken.exp)) {
      return next(new AuthError('Token expired'), 401);
    }

    User.findOne({
      where: {
        token: token
      }
    }).then(user => {
      if (!user) {
        return next(new NotFoundError('Unable to find user'));
      }

      req.user = user;

      return next();
    }).catch(error => {
      console.log(error);
      return next(new AppError());
    });
  },

  isAuthor(req, res, next) {
    let storyIdPromise;
    let storyId = req.params.storyId || (req.body.page ? req.body.page.story : null);
    let pageId = req.params.pageId;
    let userId = req.user.id;

    if (!storyId) {
      storyIdPromise = Page.findOne({
        where: {
          id: pageId
        }
      }).then(page => {
        if (!page) {
          return next(new NotFoundError('Unable to find page'));
        }

        return page.storyId;
      }).catch(error => {
        console.log(error);
        return next(new AppError());
      });
    } else {
      storyIdPromise = Promise.resolve(storyId);
    }

    storyIdPromise.then(storyId => {
      StoryUser.findAll({
        where: {
          storyId: storyId
        }
      }).then(storyUsers => {
        let isAuthor = storyUsers.some(storyUser => storyUser.userId === userId);
        
        if (!isAuthor) {
          return next(new AuthError('User not authorized'), 403);
        }

        next();
      }).catch(error => {
        console.log(error);
        return next(new AppError());
      });
    }).catch(error => {
      console.log(error);
      return next(new AppError());
    });
  },

  conditionalIsAuthenticated(req, res, next) {
    let hasUser = req.query.user;

    if (hasUser) {
      return module.exports.isAuthenticated(req, res, next);
    } else {
      return next();
    }
  },
};