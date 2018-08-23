const UpbitAPI = require('../marketAPI/upbit');
const config = require('../../config');

module.exports = {

  getBalance : function(userinfo, result, cb) {
    if(userinfo.apikeys.upbit_apikey == null || userinfo.apikeys.upbit_apisecret == null) {
      cb("Need to apikey or secretkey");
    }
    else {
      let currencylist = config.currencylist;
      let apiKey    = userinfo.apikeys.upbit_apikey;
      let secretKey = userinfo.apikeys.upbit_apisecret;

      UpbitAPI.getBalance(apiKey, secretKey)
        .then(res => {

          let toSendList = {};

          res.forEach(coin => {
            toSendList[coin.currency] = {
              balance  : Number(coin.balance),
              locked   : Number(coin.locked),
              available : Number(coin.balance) - Number(coin.locked)
            }
          });

          result.UPBIT = toSendList;
          cb(null)
        })
        .catch(error => {
          cb(error)
        });

    }
  
  },

  setOrders : function(userinfo, cb) {
    if(userinfo.apikeys.upbit_apikey == null || userinfo.apikeys.upbit_apisecret == null) {
      cb("Need to apikey or secretkey");
    }
    else {
      let apiKey    = userinfo.apikeys.upbit_apikey;
      let secretKey = userinfo.apikeys.upbit_apisecret;
      let orderinfo = {
        market : userinfo.market,
        side   : userinfo.side,
        volume : userinfo.volume,
        price  : userinfo.price,
        ord_type : userinfo.ord_type
      }

      UpbitAPI.setOrders(apiKey, secretKey, orderinfo, (error, result) => {
        if(error) {
          cb(error);
        }
        else {
          cb(null, result);
        }
      });

    }
  },


}