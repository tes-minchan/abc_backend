
const { upbitAPI } = require('lib/API');
const { schemaCheck, ctrlOrderinfo } = require('./common');

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

      upbitAPI.getBalance(apiKey, secretKey, (error, res) => {
        if(error) {
          callback(error);
        }
        else {
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
        }
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
            if(result.error) {
              callback(result.error);

            }
            else {
              const saveOrderinfo = {
                market   : 'UPBIT',
                uuid     : userinfo.uuid,
                order_id : result.uuid,
                side     : userinfo.side,
                currency : userinfo.coin,
                price    : userinfo.price,
                volume   : userinfo.volume
              }
              ctrlOrderinfo.updateOrderID(saveOrderinfo);
              callback(null, result);
            }
          }
        }
      );
    }


    
  }
};
