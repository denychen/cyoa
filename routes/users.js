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
    return res.json({ user: result });
  }).catch(error => {
    return res.status(error.status).json({ message: error.message });
  });
});

router.post('/signin', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  usersController.signin(email, password).then(result => {
    return res.json({ user: result });
  }).catch(error => {
    return res.status(error.status).json({ message: error.message });
  });
});

router.post('/signout', authentication.isAuthenticated, function(req, res, next) {
  let user = req.user;

  usersController.signout(user).then(() => {
    return res.sendStatus(204);
  }).catch(() => {
    return res.sendStatus(400);
  });
});

router.get('/:userId', function(req, res, next) {
  let userId = req.params.userId;

  usersController.findById(userId).then(result => {
    return res.json({ user: result });
  })
});

router.put('/', authentication.isAuthenticated, function(req, res, next) {
  let user = req.user;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let oldPassword = req.body.oldPassword;

  usersController.update(user.id, email, username, password, oldPassword).then(result => {
    return res.json({ user: result });
  });
});

module.exports = router;
