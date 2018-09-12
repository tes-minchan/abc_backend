const { bithumbAPI } = require('lib/API');
const { schemaCheck, ctrlOrderinfo } = require('./common');

const async = require("async");
const dbQuery = require("lib/dbquery/market");
const db = require("lib/db");

module.exports = {

  getBalance : function(userinfo, tosend, callback) {

    const keyCheck = schemaCheck.apiKeyValidate(userinfo.apikeys.bithumb_apikey, userinfo.apikeys.bithumb_apisecret);

    if(!keyCheck.validated) {
      callback(keyCheck.message);
    }
    else {
      const apiKey    = keyCheck.message.apikey;
      const secretKey = keyCheck.message.apisecret;

      bithumbAPI.getBalance(apiKey, secretKey, (err, result) => {
        let toSendList = {};
        let checkDiffCoin = null;

        const jsonParse = JSON.parse(result).data;
        const keys = Object.keys(jsonParse);

        keys.forEach(element => {
          const splitElement = element.split('_');
          const coinName = splitElement[splitElement.length -1].toUpperCase();

          if(coinName !== 'LAST') {
            if(checkDiffCoin !== coinName) {
              toSendList[coinName] = {};
              checkDiffCoin = coinName;
            }

            if(splitElement[0] === 'total') {
              toSendList[coinName]['balance'] = Number(jsonParse[`total_${coinName.toLowerCase()}`]);
            }
            else if(splitElement[0] === 'in') {
              toSendList[coinName]['locked'] = Number(jsonParse[`in_use_${splitElement[2]}`]);
            }
            else if(splitElement[0] === 'available') {
              toSendList[coinName]['available'] = Number(jsonParse[`available_${splitElement[1]}`]);
            }
          }

        })

        tosend.BITHUMB = toSendList;

        callback(null);
      })
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
          async.apply(bithumbAPI.setOrders, userinfo)
        ], (error, result) => {
          if (error) {
            callback(error);
          } 
          else {

            const saveOrderinfo = {
              market   : 'BITHUMB',
              uuid     : userinfo.uuid,
              order_id : result.order_id,
              side     : userinfo.side,
              currency : userinfo.coin,
              price    : userinfo.price,
              volume   : userinfo.volume
            }

            ctrlOrderinfo.updateOrderID(saveOrderinfo);
            callback(null, result.data);
          }
        }
      );
    }

  },

}