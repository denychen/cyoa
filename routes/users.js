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
    return res.status(201).json({ user: result });
  }).catch(error => {
    return res.status(error.status).json(JSON.parse(error.message));
  });
});

router.post('/signin', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  usersController.signin(email, password).then(result => {
    return res.json({ user: result });
  }).catch(error => {
    return res.status(error.status).json(JSON.parse(error.message));
  });
});

router.post('/signout', authentication.isAuthenticated, function(req, res, next) {
  let user = req.user;

  usersController.signout(user).then(result => {
    return res.sendStatus(result.status);
  }).catch(error => {
    return res.sendStatus(error.status);
  });
});

router.post('/forgot-password', function(req, res, next) {
  let email = req.body.email;

  usersController.forgotPassword(email);
  return res.sendStatus(204);
});

router.get('/:userId', function(req, res, next) {
  let userId = req.params.userId;

  usersController.findById(userId).then(result => {
    return res.json({ user: result });
  }).catch(error => {
    return res.status(error.status).json(JSON.parse(error.message));
  });
});

router.put('/', authentication.isAuthenticated, function(req, res, next) {
  let user = req.user;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let oldPassword = req.body.oldPassword;

  usersController.update(user.id, email, username, password, oldPassword).then(result => {
    if (result.status) {
      res.status(result.status);
    }
    return res.json({ user: result });
  }).catch(error => {
    return res.status(error.status).json(JSON.parse(error.message));
  });
});

module.exports = router;
