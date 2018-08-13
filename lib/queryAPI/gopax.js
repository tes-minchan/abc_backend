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
        
        let toSendList = [];

        currencylist.map(currency => {
          let marketInfo = {
            currency : currency,
            balance  : 0,
            locked   : 0,
            available : 0
          }

          res.map(item => {
            if(item.asset === currency) {
              marketInfo.balance = Number(item.avail) + Number(item.hold);
              marketInfo.locked  = item.hold;
              marketInfo.available = item.avail;
              return;
            }
          })

          toSendList.push(marketInfo);
        });

        result.gopax = toSendList;

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