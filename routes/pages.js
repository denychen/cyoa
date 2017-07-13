'use strict';

var express = require('express');
var router = express.Router();

var pagesController = require('../controllers/pages');

/* GET page listing. */
router.get('/:pageId', function(req, res, next) {
  let pageId = req.params.pageId;

  pagesController.findPageAndNextPagesById(pageId).then(result => {
    res.json(result);
  });
});

/* POST page */
router.post('/', function(req, res, next) {
  let storyId = req.body.storyId;
  let content = req.body.content;

  pagesController.createPage(storyId, content).then(result => {
    res.json(result);
  });
});

/* POST page route */
router.post('/:pageId', function(req, res, next) {
  let pageId = req.params.pageId;
  let options = req.body.options;

  pagesController.createPageRoute(pageId, options).then(result => {
    res.json(result);
  });
});

module.exports = router;
