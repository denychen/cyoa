'use strict';

var express = require('express');
var router = express.Router();

var storiesController = require('../controllers/stories');
var authentication = require('../middlewares/authentication');

/* POST stories */
router.post('/', authentication.isAuthenticated, function(req, res, next) {
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
router.put('/:storyId', authentication.isAuthenticated, authentication.isAuthor, function(req, res, next) {
  let story = req.body.story;

  let storyId = req.params.storyId;
  let title = story.title;
  let description = story.description;

  storiesController.update(storyId, title, description).then(result => {
    return res.json(result);
  }).catch(error => {
    return res.sendStatus(401);
  });
}), 

/* GET all story listings */
router.get('/', function(req, res, next) {
  storiesController.findAll().then(result => {
    return res.json(result);
  });
});

/* GET story listing */
router.get('/:storyId', function(req, res, next) {
  let storyId = req.params.storyId;
  
  storiesController.findById(storyId, true).then(result => {
    return res.json(result);
  });
});

module.exports = router;
