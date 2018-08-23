const BithumbAPI = require('../marketAPI/bithumb');
const _ = require('underscore');
const config = require('../../config');

module.exports = {

  getBalance : function(userinfo, tosend, cb) {
    if(userinfo.apikeys.bithumb_apikey == null || userinfo.apikeys.bithumb_apisecret == null) {
      cb("Need to apikey or secretkey");
    }
    else {
      let currencylist = config.currencylist;

      let apiKey    = userinfo.apikeys.bithumb_apikey;
      let secretKey = userinfo.apikeys.bithumb_apisecret;

      BithumbAPI.getBalance(apiKey, secretKey, (err, result) => {
        let toSendList = {};
        let checkDiffCoin = null;

        const jsonParse = JSON.parse(result).data;
        const keys = Object.keys(jsonParse);

        keys.forEach(element => {
          const splitElement = element.split('_');
          const coinName = splitElement[splitElement.length -1].toUpperCase();

          if(coinName !== 'last') {
            if(checkDiffCoin !== coinName) {
              toSendList[coinName] = {};
              checkDiffCoin = coinName;
            }
  
            if(splitElement[0] === 'total') {
              toSendList[coinName]['balance'] = Number(jsonParse[`total_${coinName}`]);
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

        cb(null);
      })

    }
  
  },
  setOrders : function(userinfo, cb) {
    if(userinfo.apikeys.bithumb_apikey == null || userinfo.apikeys.bithumb_apisecret == null) {
      cb("Need to apikey or secretkey");
    }
    else {
      
      let orderinfo = {
        order_currency   : userinfo.currency,
        price      : userinfo.price,
        units      : userinfo.volume,
        ord_type   : userinfo.ord_type
      };

      
      let apiKey    = userinfo.apikeys.bithumb_apikey;
      let secretKey = userinfo.apikeys.bithumb_apisecret;

      BithumbAPI.setOrders(apiKey, secretKey, orderinfo, (error,result) => {
        if(error) {
          cb(error);
        }
        else {
          cb(null, result);
        }
      });

    }
  }

}