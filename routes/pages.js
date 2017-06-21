var express = require('express');
var router = express.Router();

var models = require('../models');

/* GET stories listing. */
router.get('/:pageId', function(req, res, next) {
  models.Page.findAll({
    include: [{
      model: models.Page,
      as: 'destinations',
      where: { id: req.params.pageId }
    }]
  }).then(function(page) {
    res.json({
      id: page.id,
      content: page.content
    });
  });
});

module.exports = router;
