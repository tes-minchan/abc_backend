const { gopaxAPI } = require('lib/API');
const { schemaCheck } = require('./common');

const async = require("async");
const dbMarket = require("lib/dbquery/market");
const db = require("lib/db");

module.exports = {

  getBalance : function(userinfo, result, callback) {

    const keyCheck = schemaCheck.apiKeyValidate(userinfo.apikeys.gopax_apikey, userinfo.apikeys.gopax_apisecret);

    if(!keyCheck.validated) {
      callback(keyCheck.message);
    }
    else {
      const apiKey    = keyCheck.message.apikey;
      const secretKey = keyCheck.message.apisecret;

      gopaxAPI.getBalance(apiKey, secretKey, (err,res) => {
        if(err) return callback(err);
        
        let toSendList = {};
        res.forEach(coin => {
          toSendList[coin.asset] = {
            balance  : Number(coin.avail) + Number(coin.hold),
            locked   : Number(coin.hold),
            available : Number(coin.avail)
          }
        });

        result.GOPAX = toSendList;
        callback(null);
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
          async.apply(dbMarket.getMarketApiKeys, userinfo),
          db.releaseConnection,
          async.apply(gopaxAPI.setOrders, userinfo)
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
    

  },

}