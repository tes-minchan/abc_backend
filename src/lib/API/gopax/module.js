const ErrorCode = require('./errorCode');
const gopaxAPI  = require('./gopaxAPI');


module.exports = {

  getBalance : async function (ACCESS_TOKEN, SECRET_KEY, callback) {

    const GopaxAPI = new gopaxAPI(ACCESS_TOKEN, SECRET_KEY);

    GopaxAPI.getBalance()
      .then(result => {
        callback(null, result);
      })
      .catch(error => {
        callback(error);
      });
  },

  setOrders : function(getOrderInfo, callback) {

    const GopaxAPI = new gopaxAPI(getOrderInfo.apikey, getOrderInfo.apisecret);

    const payload = {
      amount : getOrderInfo.volume,
      price  : getOrderInfo.price,
      side   : getOrderInfo.side.toLowerCase(),
      tradingPairName: `${getOrderInfo.coin.toUpperCase()}-KRW`,
      type   : 'limit'
    }

    GopaxAPI.sendOrder(payload)
      .then(result => {
        if(result.errorCode) {
          callback(ErrorCode[result.errorCode])
        }
        else {
          callback(null, result);
        }
      })
      .catch(error => {
        callback(error);
      });

  },

  getOrderInfo : function(getOrderInfo, callback) {
    const GopaxAPI = new gopaxAPI(getOrderInfo.apikey, getOrderInfo.apisecret);

    GopaxAPI.getOrderinfoByID(getOrderInfo.order_id)
    .then(result => {
      callback(null, result);
    })
    .catch(error => {
      callback(error);
    });
  }

}

