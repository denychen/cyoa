var express = require('express');
var router = express.Router();

var usersController = require('../controllers/users');

/* POST users */
router.post('/', function(req, res, next) {
  let user = req.body.user;

  let email = user.email;
  let password = user.password;
  let username = user.username;

  usersController.signup(email, password, username).then(result => {
    res.json({ user: result });
  });
});

router.post('/signin', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  usersController.signin(email, password).then(result => {
    res.json({ user: result });
  });
});

router.delete('/signout', function(req, res, next) {
  let userId = req.body.userId;

  usersController.signout(userId);
  
  res.status(200).json({});
});

module.exports = router;
