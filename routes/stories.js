'use strict';

var express = require('express');
var router = express.Router();

var storiesController = require('../controllers/stories');

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
