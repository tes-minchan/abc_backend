const express = require('express');
const router = express.Router();

const auth   = require('./auth');
const market = require('./market');

router.use('/auth', auth);
router.use('/market', market);

module.exports = router;
