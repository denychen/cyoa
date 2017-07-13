'use strict';

var express = require('express');
var router = express.Router();

var pagesController = require('../controllers/pages');

/* GET page listing. */
router.get('/:pageId', function(req, res, next) {
  pagesController.findPageAndNextPagesById(req.params.pageId).then(result => {
    res.json(result);
  });
});

module.exports = router;
