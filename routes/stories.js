'use strict';

var express = require('express');
var router = express.Router();

var storiesController = require('../controllers/stories');

/* POST stories. */
router.post('/', function(req, res, next) {
  storiesController.create(req.body.title, req.body.authors, req.body.description, req.body.genres).then(result => {
    res.json(result);
  });
});

/* GET all story listings */
router.get('/', function(req, res, next) {
  storiesController.findAll().then(result => {
    res.json(result);
  });
});

/* GET story listing */
router.get('/:storyId', function(req, res, next) {
  storiesController.findById(req.params.storyId).then(result => {
    res.json(result);
  });
});

module.exports = router;
