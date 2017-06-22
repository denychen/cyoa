'use strict';

var express = require('express');
var router = express.Router();

var pagesController = require('../controllers/pages');

/* GET page listing. */
router.get('/:pageId', function(req, res, next) {
  pagesController.findPageAndNextPagesById(req.params.pageId).then(function(page) {
    let destinationIds = page.destinations.map(page => {
      return {
        id: page.id
      }
    });
    
    res.json({
      content: page.content,
      destinations: destinationIds
    });
  });
});

module.exports = router;
