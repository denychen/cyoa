'use strict'
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

    let decodedToken = jwt.decode(token, process.env.JWT_TOKEN_SECRET);

    if (moment().isAfter(decodedToken.exp)) {
      return next(new AuthError('Token expired'), 401);
    }

    return User.findOne({
      where: { token: token }
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
        where: { id: pageId }
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

    return storyIdPromise.then(storyId => {
      return StoryUser.findAll({
        where: { storyId: storyId }
      }).then(storyUsers => {
        let isAuthor = storyUsers.some(storyUser => storyUser.userId === userId);
        
        if (!isAuthor) {
          return next(new AuthError('User not authorized'), 403);
        }

        return next();
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

  conditionalIsAuthor(req, res, next) {
    let includePages = req.query.include === 'pages';
    
    if (includePages) {
      return module.exports.isAuthenticated(req, res, error => {
        if (!error) {
          return module.exports.isAuthor(req, res, next);
        } else {
          return next(error);
        }
      });
    } else {
      return next();
    }
  }
};