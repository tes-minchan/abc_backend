const axios = require('axios');
const CryptoJS = require("crypto-js");
const request = require('request');
const CoinoneAPI = require('coinone-api');
const crypto = require('crypto');

const UpbitAPI   = require('./marketAPI/upbit');
const BithumbAPI = require('./marketAPI/bithumb');



module.exports = {

  // UPBIT APIs

  getUpbitBalance : function(userinfo, cb) {
    if(userinfo.apikeys.upbit_apikey == null || userinfo.apikeys.upbit_apisecret == null) {
      cb(null);
    }
    else {
      let apiKey    = userinfo.apikeys.upbit_apikey;
      let secretKey = userinfo.apikeys.upbit_apisecret;

      UpbitAPI.getBalance(apiKey, secretKey)
        .then(res => console.log(res))
        .catch(error => console.log(error));

    }
  
  },

  getBithumbBalance : function(userinfo, cb) {
    if(userinfo.apikeys.bithumb_apikey == null || userinfo.apikeys.bithumb_apisecret == null) {
      cb(null);
    }
    else {
      let apiKey    = userinfo.apikeys.bithumb_apikey;
      let secretKey = userinfo.apikeys.bithumb_apisecret;

      BithumbAPI.getBalance(apiKey, secretKey)

    }
  },

  getCoinoneBalance : function(userinfo, cb) {
    if(userinfo.apikeys.coinone_apikey == null || userinfo.apikeys.coinone_apisecret == null) {
      cb(null);
    }
    else {
      var coinoneAPI = new CoinoneAPI(userinfo.apikeys.coinone_apikey,userinfo.apikeys.coinone_apisecret);
      coinoneAPI.balance().then(res => {
        console.log(res.data);
      })

    }

  },

  getGopaxBalance : function(userinfo, cb) {
    if(userinfo.apikeys.gopax_apikey == null || userinfo.apikeys.gopax_apisecret == null) {
      cb(null);
    }
    else {

      // nonce값 생성
      var nonce = Date.now() * 1000;
      var method = 'GET';
      var requestPath = '/balances';

      // 필수 정보를 연결하여 prehash 문자열을 생성함
      var what = nonce + method + requestPath;
      // base64로 secret을 디코딩함
      var key = Buffer(secret, 'base64');
      // secret으로 sha512 hmac을 생성함
      var hmac = CryptoJS.HmacSHA512(key);
      var sign = hmac.update(what).digest('base64');
      var host = 'api.gopax.co.kr';
      var options = {
        method,
        json: true,
        url: `https://${host}${requestPath}`,
        headers: {
          'API-KEY': apikey,
          Signature: sign,
          Nonce: nonce,
        },
        strictSSL: false,
      };

      request(options, (err, response, result) => {
        if (err) {
          console.log('err:', err);
          return;
        }
        console.log(result);
      });
    }

  },

  // getBithumbBalance : function(userinfo, cb) {
  //   if(userinfo.apikeys.bithumb_apikey == null || userinfo.apikeys.bithumb_apisecret == null) {
  //     cb(null);
  //   }
  //   else {
  //     const api_base = 'https://api.bithumb.com';

  //     const api_private_info = {
  //       apiKey : userinfo.apikeys.bithumb_apikey,
  //       secretKey : userinfo.apikeys.bithumb_apisecret
  //     }

  //     const req_query = {
  //       endpoint : '/info/balance',
  //       order_currency : 'BTC',
  //       payment_currency: 'KRW'
  //     }
      
  //     const make_header = (obj) => {
  //       let output_string = [];
  //       Object.keys(obj).forEach(val => {

  //         let key = val;
  //         key = encodeURIComponent(key.replace(/[!'()*]/g, escape));

  //         let value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape));
  //         output_string.push(key + '=' + value);
  //       });

  //       // return output_string.join('&');
  //       return api_sign(output_string.join('&'), obj.endpoint);

  //     }

  //     const base64_encode = (data) => {
      
  //       var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  //       var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
  //       ac = 0,
  //       enc = '',
  //       tmp_arr = [];
      
  //       if (!data) {
  //         return data;
  //       }
      
  //       do { // pack three octets into four hexets
  //         o1 = data.charCodeAt(i++);
  //         o2 = data.charCodeAt(i++);
  //         o3 = data.charCodeAt(i++);
      
  //         bits = o1 << 16 | o2 << 8 | o3;
      
  //         h1 = bits >> 18 & 0x3f;
  //         h2 = bits >> 12 & 0x3f;
  //         h3 = bits >> 6 & 0x3f;
  //         h4 = bits & 0x3f;
      
  //         // use hexets to index into b64, and append result to encoded string
  //         tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  //       } while (i < data.length);
      
  //       enc = tmp_arr.join('');
      
  //       var r = data.length % 3;
      
  //       return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
  //     }

  //     const api_sign = (str_q, endPoint) => {
  //       let nNonce = new Date().getTime();
  //       let spliter = String.fromCharCode(0);

  //       return {
  //         'Api-Key' : api_private_info.apiKey,
  //         'Api-Sign' : (base64_encode(CryptoJS.HmacSHA512(endPoint + spliter + str_q + spliter + nNonce, api_private_info.secretKey).toString())),
  //         'Api-Nonce' : nNonce,
  //         'Content-Type': 'multipart/form-data'
  //       };

  //     }    

  //     request({
  //       method : 'POST',
  //       uri : `${api_base}${req_query.endpoint}`,
  //       headers : make_header(req_query),
  //       formData : req_query
  //     }, (err, res, result) => {
  //       if(err) {
  //         console.log(err);
  //       }
  //       console.log(res);
  //       userinfo.bithumb = JSON.parse(result).data;
  //       cb(null);
        
  //     });

  //   }
  // }



}