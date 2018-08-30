// const CoinoneAPI = require('coinone-api');
const ErrorCode  = require('./errorCode');
const CoinoneAPI = require('./coinoneAPI');

module.exports = {

  getBalance : (ACCESS_TOKEN, SECRET_KEY, callback) => {
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

  setOrders : (getOrderInfo, callback) => {

    const coinoneAPI = new CoinoneAPI(getOrderInfo.apikey, getOrderInfo.apisecret);
    const currency = getOrderInfo.coin.toLowerCase();
    const price    = Number(getOrderInfo.price);
    const qty      = Number(getOrderInfo.volume);

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

  getOrderInfo : (getOrderInfo, callback) => {

    const coinoneAPI = new CoinoneAPI(getOrderInfo.apikey, getOrderInfo.apisecret);
    const currency   = getOrderInfo.currency.toLowerCase();
    const order_id   = getOrderInfo.order_id;

    coinoneAPI.myOrderInformation(currency, order_id)
      .then(res => {
        if(res.data.errorCode === '0' || res.data.errorCode === '104') {
          callback(null, res.data);
        }
        else {
          callback(ErrorCode[res.data.errorCode]);
        }
      });

  }

}
