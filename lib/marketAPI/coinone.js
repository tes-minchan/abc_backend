const CoinoneAPI = require('coinone-api');

module.exports = {

  getBalance : function (ACCESS_TOKEN, SECRET_KEY, cb) {
    var coinoneAPI = new CoinoneAPI(ACCESS_TOKEN,SECRET_KEY);

    coinoneAPI.balance().then(res => {
      if(res.data.errorCode !== '0') {
        cb(res.data);
      }
      else {
        cb(null, res.data);
      }

    });
    
  },

  setOrders : function(ACCESS_TOKEN, SECRET_KEY, orderinfo, cb) {
    var coinoneAPI = new CoinoneAPI(ACCESS_TOKEN,SECRET_KEY);
    let currency = orderinfo.currency;
    let price    = Number(orderinfo.price);
    let qty      = Number(orderinfo.qty);
    
    if(orderinfo.side === 'BUY') {
      coinoneAPI.limitBuy(currency, price, qty)
      .then(res => {
        if(res.data.errorCode !== '0') {
          console.log(res.data);
          cb(res.data);
        }
        else {
          console.log(res.data);
          cb(null, res.data);
        }
      })
    }
    else {
      coinoneAPI.limitSell(currency, price, qty)
      .then(res => {
        if(res.data.errorCode !== '0') {
          console.log(res.data);
          cb(res.data);
        }
        else {
          console.log(res.data);
          cb(null, res.data);
        }
      })
    }
    


  },

}



