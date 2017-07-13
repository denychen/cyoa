var express = require('express');
var router = express.Router();

var usersController = require('../controllers/users');

/* POST users */
router.post('/signup', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;

  usersController.signup(email, password, username).then(result => {
    res.json(result);
  });
});

router.post('/signin', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  usersController.signin(email, password).then(result => {
    res.json(result);
  });
});

router.delete('/signout', function(req, res, next) {
  let userId = req.body.userId;

  usersController.signout(userId);
  
  res.status(200).json({});
});

module.exports = router;
