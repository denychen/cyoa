var express = require('express');
var router = express.Router();

var models = require('../models');

/* GET page listing. */
router.get('/:pageId', function(req, res, next) {
  models.Page.find({
    include: [{
      model: models.Page,
      as: 'destinations'
    }],
    where: { id: req.params.pageId }
  }).then(function(page) {
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
