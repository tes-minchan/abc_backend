const CoinoneAPI = require('../marketAPI/coinone');
const config = require('../../config');
const _ = require('underscore');

module.exports = {

  getBalance : function(userinfo, result, cb) {
    if(userinfo.apikeys.coinone_apikey == null || userinfo.apikeys.coinone_apisecret == null) {
      cb("Need to apikey or secretkey");
    }
    else {
      let currencylist = config.currencylist;
      let apiKey    = userinfo.apikeys.coinone_apikey;
      let secretKey = userinfo.apikeys.coinone_apisecret;

      CoinoneAPI.getBalance(apiKey, secretKey, (err,res) => {
        if(err) return cb(err);
        
        let toSendList = [];

        currencylist.map(currency => {
          let marketInfo = {
            currency : currency,
            balance  : 0,
            available : 0
          }

          _.map(res, (values, coin) => {
            if(coin === currency) {
              marketInfo.balance = values.balance;
              marketInfo.available = values.avail;
              return;
            }
          })

          toSendList.push(marketInfo);
        });

        result.coinone = toSendList;
        cb(null);
      });

    }
  },

  setOrders : function(userinfo, cb) {
    if(userinfo.apikeys.coinone_apikey == null || userinfo.apikeys.coinone_apisecret == null) {
      cb("Need to apikey or secretkey");
    }
    else {
      let orderinfo = {
        currency   : userinfo.currency,
        price      : userinfo.price,
        qty        : userinfo.volume,
        side       : userinfo.side,
        ord_type   : userinfo.ord_type
      };

      
      let apiKey    = userinfo.apikeys.coinone_apikey;
      let secretKey = userinfo.apikeys.coinone_apisecret;

      CoinoneAPI.setOrders(apiKey, secretKey, orderinfo, (error,result) => {
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