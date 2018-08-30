const crypto  = require('crypto');
const request = require('request');

const BASE_URL  = 'https://api.gopax.co.kr';

function gopaxAPI (_ACCESS_TOKEN, _SECRET_KEY) {

  this.ACCESS_TOKEN = _ACCESS_TOKEN;
  this.SECRET_KEY   = _SECRET_KEY;

  this.callPersonalAPI = (url, payload) => {
    return new Promise((resolve, reject)=> {
      // nonce값 생성
      let nonce = Date.now() * 1000;
      let method = payload ? 'POST' :'GET';
      let requestPath = url;
      let body = payload ? JSON.stringify(payload, Object.keys(payload).sort()) : null;

      // 필수 정보를 연결하여 prehash 문자열을 생성함
      let what = payload ? nonce + method + requestPath + body : nonce + method + requestPath ;
      // base64로 secret을 디코딩함
      let key = Buffer(this.SECRET_KEY, 'base64');
      // secret으로 sha512 hmac을 생성함
      let hmac = crypto.createHmac('sha512', key);
      let sign = hmac.update(what).digest('base64');

      resolve({
        method,
        body: payload,
        json: true,
        url: `${BASE_URL}${requestPath}`,
        headers: {
          'API-KEY': this.ACCESS_TOKEN,
          Signature: sign,
          Nonce: nonce,
        },
        strictSSL: false,
      });    
    });

  }
}

gopaxAPI.prototype.getBalance = function() {
  return new Promise(async (resolve, reject)=> {
    const options = await this.callPersonalAPI('/balances');

    request(options, (err, response, result) => {
      if(err) {
        reject(err);
      }
      else {
        resolve(result);
      }
    });
  });

}


gopaxAPI.prototype.sendOrder = function(payload) {
  return new Promise(async (resolve, reject)=> {
    const options = await this.callPersonalAPI('/orders', payload);

    request(options, (err, response, result) => {
      if(err) {
        reject(err);
      }
      else {
        resolve(result);
      }
    });
  });
}

gopaxAPI.prototype.getOrderinfoByID = function(orderID) {
  return new Promise(async (resolve, reject)=> {
    const options = await this.callPersonalAPI(`/orders/${orderID}`);

    request(options, (err, response, result) => {
      if(err) {
        reject(err);
      }
      else {
        resolve(result);
      }
    });
  });

}


module.exports = gopaxAPI

