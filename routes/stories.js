var express = require('express');
var router = express.Router();

var models = require('../models');

/* GET stories listing. */
router.get('/', function(req, res, next) {
  models.Story.findAll().then(function(stories) {
    res.json({
      stories: stories
    });
  });
});

module.exports = router;
