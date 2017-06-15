var express = require('express');
var router = express.Router();

var models = require('../models');

/* GET stories listing. */
router.get('/', function(req, res, next) {
  models.Story.findAll().then(function(stories) {
    let serializedStories = stories.map(function(story) {
      return {
        id: story.id,
        firstPageId: story.firstPageId,
        title: story.title
      };
    });

    res.json(serializedStories);
  });
});

module.exports = router;
