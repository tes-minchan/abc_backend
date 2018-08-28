
const { upbitAPI } = require('lib/API');
const { schemaCheck } = require('./common');

const async = require("async");
const db = require("lib/db");
const dbQuery = require("lib/dbquery/market");

module.exports = {
  getBalance: function(userinfo, result, callback) {
    const keyCheck = schemaCheck.apiKeyValidate(userinfo.apikeys.upbit_apikey, userinfo.apikeys.upbit_apisecret);

    if(!keyCheck.validated) {
      callback(keyCheck.message);
    }
    else {
      const apiKey    = keyCheck.message.apikey;
      const secretKey = keyCheck.message.apisecret;

      upbitAPI.getBalance(apiKey, secretKey)
      .then(res => {
        let toSendList = {};

        res.forEach(coin => {
          toSendList[coin.currency] = {
            balance: Number(coin.balance),
            locked: Number(coin.locked),
            available: Number(coin.balance)
          };
        });

        result.UPBIT = toSendList;
        callback(null);
      })
      .catch(error => {
        callback(error);
      });

    }

  },

  sendOrder: function(userinfo, callback) {
    const orderinfoCheck = schemaCheck.orderinfoValidate(userinfo);

    if(!orderinfoCheck) {
      callback(orderinfoCheck.message);
    }
    else {
      async.waterfall(
        [
          db.getConnection, 
          async.apply(dbQuery.getMarketApiKeys, userinfo),
          db.releaseConnection,
          async.apply(upbitAPI.setOrders, userinfo)
        ], (error, result) => {
          if (error) {
            callback(error);
          } 
          else {
            callback(null, result);
          }
        }
      );
    }


    
  }
};
