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
          let toSendList = [];

          currencylist.map(currency => {
            let marketInfo = {
              currency : currency,
              balance  : 0,
              locked   : 0,
              available : 0
            }

            res.map(item => {
              if(item.currency === currency) {
                marketInfo.balance = item.balance;
                marketInfo.locked  = item.locked;
                marketInfo.available = Number(item.balance) - Number(item.locked);
                return;
              }
            });
            toSendList.push(marketInfo);
          });

          result.upbit = toSendList;
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