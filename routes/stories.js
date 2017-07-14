'use strict';

var express = require('express');
var router = express.Router();

var storiesController = require('../controllers/stories');

/* POST stories. */
router.post('/', function(req, res, next) {
  let title = req.body.title;
  let authors = req.body.authors;
  let description = req.body.description;
  let genres = req.body.genres;
  
  storiesController.create(title, authors, description, genres).then(result => {
    res.json({ story: result });
  });
});

/* GET all story listings */
router.get('/', function(req, res, next) {
  storiesController.findAll().then(result => {
    res.json({ stories: result });
  });
});

/* GET story listing */
router.get('/:storyId', function(req, res, next) {
  let storyId = req.params.storyId;
  
  storiesController.findById(storyId, true).then(result => {
    res.json({ story: result});
  });
});

module.exports = router;
