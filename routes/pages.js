'use strict';

var express = require('express');
var router = express.Router();

var pagesController = require('../controllers/pages');

/* GET page listing. */
router.get('/:pageId', function(req, res, next) {
  pagesController.findPageAndNextPagesById(req.params.pageId).then(function(page) {
    let destinations = page.destinations.map(page => {
      return {
        id: page.id,
        option: page.PageRoute.option,
        order: page.PageRoute.order
      }
    });
    
    res.json({
      id: page.id,
      content: page.content,
      destinations: destinations
    });
  });
});

module.exports = router;
