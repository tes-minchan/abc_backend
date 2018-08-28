const CoinoneAPI = require('coinone-api');
const ErrorCode  = require('./errorCode');

module.exports = {

  getBalance : function (ACCESS_TOKEN, SECRET_KEY, callback) {
    let coinoneAPI = new CoinoneAPI(ACCESS_TOKEN,SECRET_KEY);

    coinoneAPI.balance().then(res => {
      if(res.data.errorCode !== '0') {
        callback(res.data);
      }
      else {
        callback(null, res.data);
      }

    });
    
  },

  setOrders : function(getOrderInfo, callback) {

    const coinoneAPI = new CoinoneAPI(getOrderInfo.apikey, getOrderInfo.apisecret);
    let currency = getOrderInfo.coin.toLowerCase();
    let price    = Number(getOrderInfo.price);
    let qty      = Number(getOrderInfo.volume);

    if(getOrderInfo.side.toUpperCase() === 'BUY') {
      coinoneAPI.limitBuy(currency, price, qty)
      .then(res => {
        if(res.data.errorCode !== '0') {
          callback(ErrorCode[res.data.errorCode]);
        }
        else {
          callback(null, res.data);
        }
      })
    }
    else {
      coinoneAPI.limitSell(currency, price, qty)
      .then(res => {
        if(res.data.errorCode !== '0') {
          callback(ErrorCode[res.data.errorCode]);
        }
        else {
          callback(null, res.data);
        }
      })
    }
    
  },

}



