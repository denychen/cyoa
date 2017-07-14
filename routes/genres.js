'use strict';

var express = require('express');
var router = express.Router();

var genresController = require('../controllers/genres');

/* GET page listing. */
router.get('/', function(req, res, next) {
  genresController.findAll().then(genres => {
    res.json({ genres: genres });
  });
});


module.exports = router;
