'use strict'
let config = require('../config/config.json');
let jwt = require('jwt-simple');
let moment = require('moment');
const User = require('../models').User;
const StoryUser = require('../models').StoryUser;
const Page = require('../models').Page;

module.exports = {
  isAuthenticated(req, res, next) {
    let header = req.header('authorization'); 
    let token = null;
    
    if (header) {
      token = header.split(' ')[1];
    }

    if (!header || !token) {
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
          return res.sendStatus(400);
        }

        return page.storyId;
      })
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
          return res.sendStatus(401);
        }

        next();
      });
    });
  }
};