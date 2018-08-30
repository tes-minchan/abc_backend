const { coinoneAPI } = require('lib/API');
const { schemaCheck, ctrlOrderinfo } = require('./common');

const _ = require('underscore');
const db = require("lib/db");
const async = require("async");
const dbQuery = require("lib/dbquery/market");

module.exports = {

  getBalance : function(userinfo, result, callback) {
    const keyCheck = schemaCheck.apiKeyValidate(userinfo.apikeys.coinone_apikey, userinfo.apikeys.coinone_apisecret);

    if(!keyCheck.validated) {
      callback(keyCheck.message);
    }
    else {
      const apiKey    = keyCheck.message.apikey;
      const secretKey = keyCheck.message.apisecret;

      coinoneAPI.getBalance(apiKey, secretKey, (err, res) => {
        if(err) 
        {
          return callback(err);
        }
        else {
          let toSendList = {};
          if(res.result === 'success') {
            _.map(res, (values, coin) => {
              if(coin === 'normalWallets' || coin === 'errorCode' || coin === 'result') {
                return;
              }
              else {
                toSendList[coin.toUpperCase()] = {
                  balance   : Number(values.balance),
                  locked    : Number(values.balance) - Number(values.avail),
                  available : Number(values.avail)
                }
              }
  
            });
          }

          result.COINONE = toSendList;
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
          async.apply(coinoneAPI.setOrders, userinfo)
        ], (error, result) => {
          if (error) {
            callback(error);
          } 
          else {
            const saveOrderinfo = {
              market   : 'COINONE',
              uuid     : userinfo.uuid,
              order_id : result.orderId,
              side     : userinfo.side,
              currency : userinfo.coin,
              price    : userinfo.price,
              volume   : userinfo.volume
            }

            ctrlOrderinfo.updateOrderID(saveOrderinfo);
            callback(null, result);
          }
        }
      );
    }

  },


  

}