const sign     = require("jsonwebtoken").sign;
const queryEncode = require("querystring").encode
const axios    = require('axios');
const REQUEST  = require('request');

const BASE_URL = 'https://api.upbit.com/v1';


const upbitAPI = require('./upbitAPI');





module.exports = {

  getBalance : function (ACCESS_TOKEN, SECRET_KEY, callback) {
    const UpbitAPI = new upbitAPI(ACCESS_TOKEN, SECRET_KEY);

    UpbitAPI.getBalances()
      .then(res => {
        callback(null, JSON.parse(res))
      })
      .catch(error => {
        callback(error);
      });


  },

  setOrders : function(getOrderInfo, callback) {

    const UpbitAPI = new upbitAPI(getOrderInfo.apikey, getOrderInfo.apisecret);

    const payload = {
      market : `KRW-${getOrderInfo.coin.toUpperCase()}`,
      side   : getOrderInfo.side.toUpperCase() === 'BUY' ? 'bid' : 'ask',
      volume : getOrderInfo.volume,
      price  : getOrderInfo.price,
      ord_type : "limit"
    }

    UpbitAPI.sendOrder(payload)
      .then(res => {
        callback(null, res)
      })
      .catch(error => {
        callback(error);
      });


  },

  getOrderInfo : function(getOrderInfo, callback) {

    const UpbitAPI = new upbitAPI(getOrderInfo.apikey, getOrderInfo.apisecret);

    UpbitAPI.getOrderinfoByID(getOrderInfo.order_id)
      .then(res => {
        callback(null, res)
      })
      .catch(error => {
        callback(error);
      });
  }
}



