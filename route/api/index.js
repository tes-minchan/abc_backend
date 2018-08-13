var express = require('express');
var router = express.Router();
var auth = require('./auth');
var market = require('./market');

router.use('/auth', auth);
router.use('/market', market);

module.exports = router;
