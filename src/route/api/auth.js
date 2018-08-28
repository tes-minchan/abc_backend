var express = require('express');
var router = express.Router();
var authController = require('../../controller/auth');
var utils = require('../../lib/utils');

router
// .get  ('/:id', authController.isLogin, authController.getUserInformation)
.post ('/register', authController.register)
.post ('/login', authController.login)

module.exports = router;
