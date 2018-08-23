const GopaxAPI = require('../marketAPI/gopax');
const config = require('../../config');

module.exports = {

  getBalance : function(userinfo, result, cb) {
    if(userinfo.apikeys.gopax_apikey == null || userinfo.apikeys.gopax_apisecret == null) {
      cb("Need to apikey or secretkey");
    }
    else {
      let currencylist = config.currencylist;
      let apiKey    = userinfo.apikeys.gopax_apikey;
      let secretKey = userinfo.apikeys.gopax_apisecret;

      GopaxAPI.getBalance(apiKey, secretKey, (err,res) => {
        if(err) return cb(err);
        
        let toSendList = {};


        res.forEach(coin => {
          toSendList[coin.asset] = {
            balance  : Number(coin.avail),
            locked   : Number(coin.hold),
            available : Number(coin.avail) - Number(coin.hold)
          }
        });

        result.GOPAX = toSendList;

        cb(null);
      });

    }

  },

  setOrders : function(userinfo, cb) {
    if(userinfo.apikeys.gopax_apikey == null || userinfo.apikeys.gopax_apisecret == null) {
      cb("Need to apikey or secretkey");
    }
    else {
      let orderinfo = {
        currency   : userinfo.currency,
        price      : userinfo.price,
        size       : userinfo.volume,
        side       : userinfo.side,
        type       : userinfo.ord_type
      };

      let apiKey    = userinfo.apikeys.gopax_apikey;
      let secretKey = userinfo.apikeys.gopax_apisecret;

      GopaxAPI.setOrders(apiKey, secretKey, orderinfo, (error,result) => {
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