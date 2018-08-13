const utils = require('../lib/utils');
const config = require('../config');
const async = require('async');
const db = require('../lib/db')
const dbMarket = require('../lib/dbquery/market');
const UpbitAPI = require('../lib/queryAPI/upbit');


module.exports = {

  getBalance : function(req, res, next) {
    let userinfo = {
      uuid : req.decoded.uuid
    }

    async.waterfall([
      db.getConnection,
      async.apply(dbMarket.getApiKeys, userinfo)
    ], function(err, connection, result){
      connection.release();

      if(err) {
        res.status(403).json(utils.resFail(err.description));
      }
      else {
        let market_balance = {};

        async.waterfall([
          async.apply(UpbitAPI.getBalance, userinfo, market_balance),
        ], (error) => {
          if(error) {
            res.status(403).json(utils.resFail(error));
          }
          else {
            res.status(200).json(utils.resSuccess(market_balance));
          }
        });
      }
    });

  },

  checkOrderInfo : function(req, res, next) {
    let orderinfo = {
      ...req.body.orderinfo
    }
    
    if(orderinfo) {
      next();
    }
    else {
      res.status(403).json(utils.resFail("Need to orderinfo"));
    }
  },

  setOrders : function(req, res) {
    let userinfo = {
      uuid : req.decoded.uuid,
      market : req.body.orderinfo.market,
      side   : req.body.orderinfo.side,
      volume : req.body.orderinfo.volume,
      price  : req.body.orderinfo.price,
      ord_type : req.body.orderinfo.ord_type
    }

    async.waterfall([
      db.getConnection,
      async.apply(dbMarket.getApiKeys, userinfo)
    ], function(err, connection, result){
      connection.release();

      if(err) {
        res.status(403).json(utils.resFail(err.description));
      }
      else {
        async.waterfall([
          async.apply(UpbitAPI.setOrders, userinfo),
        ], (error, result) => {
          if(error) {
            res.status(403).json(utils.resFail(error));
          }
          else {
            res.status(200).json(utils.resSuccess(result));
          }
        });
      }
    });

  }



};
