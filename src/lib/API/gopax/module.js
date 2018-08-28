const crypto    = require('crypto');
const request   = require('request');
const ErrorCode = require('./errorCode');


const BASE_URL  = 'https://api.gopax.co.kr';

module.exports = {

  getBalance : function (ACCESS_TOKEN, SECRET_KEY, cb) {
    
    // nonce값 생성
    let nonce = Date.now() * 1000;
    let method = 'GET';
    let requestPath = '/balances';

    // 필수 정보를 연결하여 prehash 문자열을 생성함
    let what = nonce + method + requestPath;
    // base64로 secret을 디코딩함
    let key = Buffer(SECRET_KEY, 'base64');
    // secret으로 sha512 hmac을 생성함
    let hmac = crypto.createHmac('sha512', key);
    let sign = hmac.update(what).digest('base64');

    let options = {
      method,
      json: true,
      url: `${BASE_URL}${requestPath}`,
      headers: {
        'API-KEY': ACCESS_TOKEN,
        Signature: sign,
        Nonce: nonce,
      },
      strictSSL: false,
    };

    request(options, (err, response, result) => {
      if (err) {
        cb(err);
      }
      else {
        cb(null, result);
      }
    });

  },

  setOrders : function(getOrderInfo, callback) {

    const _ACCESS_TOKEN = getOrderInfo.apikey;
    const _SECRET_KEY   = getOrderInfo.apisecret;

    // nonce값 생성
    let nonce = Date.now() * 1000;
    let method = 'POST';
    let requestPath = '/orders';
    let json_body = {
      amount : getOrderInfo.volume,
      price  : getOrderInfo.price,
      side   : getOrderInfo.side.toLowerCase(),
      tradingPairName: `${getOrderInfo.coin.toUpperCase()}-KRW`,
      type   : 'limit'
    }

    let body = JSON.stringify(json_body, Object.keys(json_body).sort());

    // 필수 정보를 연결하여 prehash 문자열을 생성함
    let what = nonce + method + requestPath + body;
    // base64로 secret을 디코딩함
    let key = Buffer(_SECRET_KEY, 'base64');
    // secret으로 sha512 hmac을 생성함
    let hmac = crypto.createHmac('sha512', key);
    let sign = hmac.update(what).digest('base64');

    let options = {
      method,
      body: json_body,
      json: true,
      url: `${BASE_URL}${requestPath}`,
      headers: {
        'API-KEY': _ACCESS_TOKEN,
        Signature: sign,
        Nonce: nonce
      },
      strictSSL: false,
    };

    request(options, (err, response, result) => {
      if (err) {
        callback(err);
      }
      else {
        if(result.errorCode) {
          callback(ErrorCode[result.errorCode])
        }
        else {
          callback(null, result);
        }
      }
    });


  },

}

