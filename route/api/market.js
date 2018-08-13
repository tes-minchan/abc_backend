var express = require('express');
var router = express.Router();

var authController = require('../../controller/auth');
var upbitController = require('../../controller/upbit');
var coinoneController = require('../../controller/coinone');
var gopaxController = require('../../controller/gopax');
var bithumbController = require('../../controller/bithumb');
var korbitController = require('../../controller/korbit');

var marketController = require('../../controller/market');

var utils = require('../../lib/utils');

router
.get ('/all-balance', authController.isLogin, marketController.getAllBalance)
.get ('/upbit/balance', authController.isLogin, upbitController.getBalance)
.post ('/upbit/order', authController.isLogin, upbitController.checkOrderInfo, upbitController.setOrders)
.post ('/coinone/order', authController.isLogin, coinoneController.setOrders)
.post ('/gopax/order', authController.isLogin, gopaxController.setOrders)
.post ('/bithumb/order', authController.isLogin, bithumbController.setOrders)
.post ('/korbit/order', authController.isLogin, korbitController.setOrders)


module.exports = router;
