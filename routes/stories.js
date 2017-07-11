'use strict';

var express = require('express');
var router = express.Router();

var storiesController = require('../controllers/stories');

/* POST stories. */
router.post('/', function(req, res, next) {
  storiesController.create(req.body.title, req.body.description, req.body.genres).then(stories => {
    res.json({
      id: stories[0].storyId
    });
  }).catch(error => {
    res.status(400).json({
      message: 'Failed creation'
    });
  });
});

/* GET all story listings */
router.get('/', function(req, res, next) {
  storiesController.findAll().then(stories => {
    res.json(stories);
  });
});

/* GET story listing */
router.get('/:storyId', function(req, res, next) {
  storiesController.findById(req.params.storyId).then(stories => {
    res.json(stories);
  });
});

module.exports = router;
