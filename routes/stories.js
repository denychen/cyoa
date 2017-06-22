'use strict';

var express = require('express');
var router = express.Router();

var storiesController = require('../controllers/stories');

/* GET stories listing. */
router.get('/', function(req, res, next) {
  storiesController.findAll().then(stories => {
    res.json(stories);
  });
});

module.exports = router;
