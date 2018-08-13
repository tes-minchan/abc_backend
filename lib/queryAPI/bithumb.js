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
        let jsonParse = JSON.parse(result).data;
        let toSendList = [];
        
        currencylist.map(currency => {
          let marketInfo = {
            currency  : currency,
            balance   : (jsonParse[`total_${currency.toLowerCase()}`]) ? jsonParse[`total_${currency.toLowerCase()}`] : 0,
            locked    : (jsonParse[`in_use_${currency.toLowerCase()}`]) ? jsonParse[`in_use_${currency.toLowerCase()}`] : 0,
            available : (jsonParse[`available_${currency.toLowerCase()}`]) ? jsonParse[`available_${currency.toLowerCase()}`] : 0,
          }

          toSendList.push(marketInfo);
        })

        tosend.bithumb = toSendList;

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