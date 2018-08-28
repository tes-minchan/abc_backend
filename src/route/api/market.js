var express = require("express");
var router = express.Router();

var authController = require("../../controller/auth");
var marketController = require("../../controller/market");

router
  .get("/all-balance", authController.isLogin, marketController.getAllBalance)
  .post("/ordersend", authController.isLogin, marketController.sendOrder);

module.exports = router;
