var express = require('express');
var router = express.Router();

var usersController = require('../controllers/users');

/* POST users */
router.post('/', function(req, res, next) {
  usersController.signup(req.body.email, req.body.password, req.body.username).then(user => {
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      token: user.token
    });
  }).catch(error => {
    res.status(400).json({
      message: 'Failed signup'
    });
  });
});

router.post('/signin', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  usersController.signin(email, password).then(user => {
    if (!user) {
      return null;
    }

    user.validatePassword(password).then(result => {
      if (result) {
        res.json({
          id: user.id,
          email: user.email,
          username: user.username,
          token: user.token
        });
      } else {
        res.status(400).json({
          message: 'Failed signin'
        });
      }
    });
  });
});

module.exports = router;
