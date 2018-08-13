const KorbitAPI = require('../marketAPI/korbit');
const config = require('../../config');
const _ = require('underscore');

module.exports = {

  getBalance : function(userinfo, result, cb) {
    if(userinfo.apikeys.korbit_apikey == null || userinfo.apikeys.korbit_apisecret == null) {
      cb("Need to apikey or secretkey");
    }
    else {
      let currencylist = config.currencylist;
      let apiKey    = userinfo.apikeys.korbit_apikey;
      let secretKey = userinfo.apikeys.korbit_apisecret;

      KorbitAPI.getBalance(apiKey, secretKey, (err,res) => {
        if(err) return cb(err);
        
        let toSendList = [];



        currencylist.map(currency => {
          let marketInfo = {
            currency : currency,
            balance  : 0,
            locked   : 0,
            available : 0
          }

          _.map(res, (value, coin ) => {
            if(coin === currency) {
              marketInfo.balance = Number(value.avail) + Number(value.trade_in_use);
              marketInfo.locked  = value.trade_in_use;
              marketInfo.available = value.available;
              return;
            }
          });

          toSendList.push(marketInfo);
        });

        result.korbit = toSendList;

        cb(null);
      });

    }

  },

  setOrders : function(userinfo, cb) {
    if(userinfo.apikeys.korbit_apikey == null || userinfo.apikeys.korbit_apisecret == null) {
      cb("Need to apikey or secretkey");
    }
    else {

      let orderinfo = {
        currency   : userinfo.currency,
        price      : userinfo.price,
        volume       : userinfo.volume,
        side       : userinfo.side,
        type       : userinfo.ord_type
      };

      let apiKey    = userinfo.apikeys.korbit_apikey;
      let secretKey = userinfo.apikeys.korbit_apisecret;

      KorbitAPI.setOrders(apiKey, secretKey, orderinfo, (error,result) => {
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