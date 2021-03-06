'use strict';

var express = require('express');
var router = express.Router();

var storiesController = require('../controllers/stories');
var authentication = require('../middlewares/authentication');
var storyValidation = require('../middlewares/storyValidation');

/* POST stories */
router.post('/', authentication.isAuthenticated, storyValidation.titlePremiseLengths, storyValidation.genreCount, function(req, res, next) {
  let story = req.body.story;

  let title = story.title;
  let author = req.user;
  let description = story.description;
  let genres = story.genres;
  
  storiesController.create(title, author, description, genres).then(result => {
    return res.json(result);
  });
});

/* PUT stories */
router.put('/:storyId', authentication.isAuthenticated, authentication.isAuthor, storyValidation.genreCount, storyValidation.titlePremiseLengths, function(req, res, next) {
  let story = req.body.story;

  let storyId = req.params.storyId;
  let title = story.title;
  let description = story.description;
  let genres = story.genres;
  let published = story.published;
  let firstPublishedAt = story.firstPublishedAt;
  let firstPageId = story.firstPageId;

  storiesController.update(storyId, title, description, genres, published, firstPublishedAt, firstPageId).then(promises => {
    Promise.all(promises).then(results => {
      if (results.every(result => result === true)) {
        return res.sendStatus(204);
      } else {
        return res.sendStatus(400);
      }
    }).catch(error => {
      return res.sendStatus(500);
    });
  }).catch(error => {
    return res.sendStatus(500);
  });
}), 

/* GET all story listings */
router.get('/', authentication.conditionalIsAuthenticated, function(req, res, next) {
  let hasUser = req.query.user;
  let user = req.user;
  let lastStoryId = req.query.id;
  let type = req.query.type;

  storiesController.findAll(hasUser, user, lastStoryId, type).then(result => {
    return res.json(result);
  });
});

/* GET story listing */
router.get('/:storyId', authentication.conditionalIsAuthor, function(req, res, next) {
  let storyId = req.params.storyId;
  let includePages = req.query.include === 'pages';
  
  storiesController.findById(storyId, includePages).then(result => {
    return res.json(result);
  });
});

/* DELETE story listing */
router.delete('/:storyId', authentication.isAuthenticated, authentication.isAuthor, function(req, res, next) {
  let storyId = req.params.storyId;

  storiesController.delete(storyId).then(result => {
    return res.sendStatus(204);
  });
});

module.exports = router;
