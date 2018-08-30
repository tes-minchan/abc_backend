const crypto    = require('crypto');
const request   = require('request');
const BASE_URL  = 'https://api.gopax.co.kr';
const ErrorCode = require('./errorCode').GopaxErrorCode;


module.exports = {

  getBalance : function (ACCESS_TOKEN, SECRET_KEY, cb) {
    
    // nonce값 생성
    let nonce = Date.now() * 1000;
    var method = 'GET';
    var requestPath = '/balances';

    // 필수 정보를 연결하여 prehash 문자열을 생성함
    var what = nonce + method + requestPath;
    // base64로 secret을 디코딩함
    var key = Buffer(SECRET_KEY, 'base64');
    // secret으로 sha512 hmac을 생성함
    var hmac = crypto.createHmac('sha512', key);
    var sign = hmac.update(what).digest('base64');

    var options = {
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

    var body = JSON.stringify(json_body, Object.keys(json_body).sort());

    // 필수 정보를 연결하여 prehash 문자열을 생성함
    let what = nonce + method + requestPath + body;
    // base64로 secret을 디코딩함
    let key = Buffer(_SECRET_KEY, 'base64');
    // secret으로 sha512 hmac을 생성함
    let hmac = crypto.createHmac('sha512', key);
    let sign = hmac.update(what).digest('base64');

    var options = {
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

