var express = require('express');
var router = express.Router();

var usersController = require('../controllers/users');
var authentication = require('../middlewares/authentication');

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

router.post('/signout', authentication.isAuthenticated, function(req, res, next) {
  let user = req.user;

  usersController.signout(user).then(() => {
    res.sendStatus(200);
  }).catch(() => {
    res.sendStatus(401);
  });
});

router.get('/:userId', function(req, res, next) {
  let userId = req.params.userId;

  usersController.findById(userId).then(result => {
    return res.json({ user: result });
  })
});

module.exports = router;
