const async = require("async");
const db = require("lib/db");
const dbQuery = require("lib/dbquery/market");
const utils = require("lib/utils");
const {ctrlOrderinfo} = require("lib/ctrlAPI/common");

const { ctrlBithumb, ctrlCoinone, ctrlUpbit, ctrlGopax } = require('lib/ctrlAPI');

module.exports = {

  getAllBalance: function(req, res) {
    const userinfo = {
      uuid: req.decoded.uuid
    };

    async.waterfall(
      [
        db.getConnection, 
        async.apply(dbQuery.getApiKeys, userinfo)
      ],
      function(err, connection, result) {
        connection.release();

        if (err) {
          res.status(403).json(utils.resFail(err.description));
        } else {
          let market_balance = {};
          async.waterfall(
            [
              async.apply(ctrlBithumb.getBalance, userinfo, market_balance),
              async.apply(ctrlUpbit.getBalance, userinfo, market_balance),
              async.apply(ctrlCoinone.getBalance, userinfo, market_balance),
              async.apply(ctrlGopax.getBalance, userinfo, market_balance)
            ],
            error => {
              if (error) {
                res.status(403).json(utils.resFail(error));
              } else {
                res.status(200).json(utils.resSuccess(market_balance));
              }
            }
          );
        }
      }
    );
  },

  sendOrder: function(req, res, next) {
    const orderInfo = {
      uuid: req.decoded.uuid,
      ...req.body
    };

    if (orderInfo.market === "UPBIT") {
      ctrlUpbit.sendOrder(orderInfo, (error, result) => {
        if(error) {
          res.status(403).json(utils.resFail(error));
        }
        else {
          res.status(200).json(utils.resSuccess(result));
        }
      });
    } 
    else if (orderInfo.market === "COINONE") {
      ctrlCoinone.sendOrder(orderInfo, (error, result) => {
        if(error) {
          res.status(403).json(utils.resFail(error));
        }
        else {
          res.status(200).json(utils.resSuccess(result));
        }
      });
    }
    else if (orderInfo.market === "GOPAX") {
      ctrlGopax.sendOrder(orderInfo, (error, result) => {
        if(error) {
          res.status(403).json(utils.resFail(error));

        }
        else {
          res.status(200).json(utils.resSuccess(result));

        }
      });
    }
    else if (orderInfo.market === "BITHUMB"){
      ctrlBithumb.sendOrder(orderInfo, (error, result) => {
        if(error) {
          res.status(403).json(utils.resFail(error));
        }
        else {
          res.status(200).json(utils.resSuccess(result));
        }
      });

    }
  },

    
  updateOrderinfo: function(req, res, next) {

    const userinfo = {
      uuid: req.decoded.uuid
    };

    async.waterfall(
      [
        db.getConnection, 
        async.apply(dbQuery.getApiKeys, userinfo),
        async.apply(dbQuery.getOrderinfo, userinfo),
        async.apply(ctrlOrderinfo.updateOrder, userinfo)
      ], (error, connection, result) =>  {
        connection.release();
        if(error) {
          res.status(403).json(utils.resFail(error));
        }
        else {
          res.status(200).json(utils.resSuccess("success"));
        }
    });

  },

  getOrderstatus: function(req, res, next) {
    const userinfo = {
      uuid: req.decoded.uuid
    };

    async.waterfall(
      [
        db.getConnection, 
        async.apply(dbQuery.getApiKeys, userinfo),
        async.apply(dbQuery.getOrderStatus, userinfo),
      ], (error, connection, result) =>  {
        connection.release();
        if(error) {
          res.status(403).json(utils.resFail(error));
        }
        else {
          console.log(userinfo.orderstatus);
          res.status(200).json(utils.resSuccess(userinfo.orderstatus));
        }
    });
  },

  getOrderdetail: function(req, res, next) {
    const userinfo = {
      uuid: req.decoded.uuid
    };

    async.waterfall(
      [
        db.getConnection, 
        async.apply(dbQuery.getApiKeys, userinfo),
        async.apply(dbQuery.getOrderDetail, userinfo),
      ], (error, connection, result) =>  {
        connection.release();
        if(error) {
          res.status(403).json(utils.resFail(error));
        }
        else {
          res.status(200).json(utils.resSuccess(userinfo.orderdetail));
        }
    });
  }

};
