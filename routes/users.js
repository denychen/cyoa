var express = require('express');
var router = express.Router();

var usersController = require('../controllers/users');

/* GET users listing. */
router.post('/', function(req, res, next) {
  usersController.signup(req.body.email, req.body.password, req.body.username).then(user => {
    res.json({
      id: user.id,
      email: user.email,
      username: user.username
    });
  }).catch(error => {
    res.status(400).json({
      message: 'Failed signup'
    });
  });
});

module.exports = router;
