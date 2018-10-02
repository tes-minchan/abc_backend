const REQUEST  = require('request');
const CryptoJS = require("crypto-js");
const ErrorCode  = require('./errorCode')

const BASE_URL = 'https://api.bithumb.com';


module.exports = {

  getBalance : (ACCESS_TOKEN, SECRET_KEY, callback) => {
    const api_private_info = {
      apiKey : ACCESS_TOKEN,
      secretKey : SECRET_KEY
    }

    const req_query = {
      endpoint : '/info/balance',
      currency : 'ALL'
    }

    REQUEST({
      method : 'POST',
      uri : `${BASE_URL}${req_query.endpoint}`,
      headers : make_header(req_query, api_private_info),
      formData : req_query
      },(err, res, result) => {
        if(err) {
          callback(err);
        }
        else {
          callback(null, result);
        } 

      });
    
  },

  setOrders : function (getOrderInfo, callback) {


    const api_private_info = {
      apiKey : getOrderInfo.apikey,
      secretKey : getOrderInfo.apisecret
    }

    const req_query = {
      endpoint : '/trade/place',
      order_currency : getOrderInfo.coin.toUpperCase(),
      payment_currency: 'KRW',
      units : getOrderInfo.volume,
      type  : getOrderInfo.side.toUpperCase() === 'BUY' ? 'bid' : 'ask',
      price : getOrderInfo.price
    }
    
    REQUEST({
      method : 'POST',
      uri : `${BASE_URL}${req_query.endpoint}`,
      headers : make_header(req_query, api_private_info),
      formData : req_query
      },(err, res, result) => {
        if(err) {
          callback(err);
        }
        else {
          const parseJson = JSON.parse(result);

          if(ErrorCode[parseJson.status]) {
            callback(`${parseJson.message}`)
          }
          else {            
            callback(null, parseJson);
          }

        } 

      });

  },

  getOrderInfo : (getOrderInfo, callback) => {

    const api_private_info = {
      apiKey : getOrderInfo.apikey,
      secretKey : getOrderInfo.apisecret
    }

    const req_query = {
      endpoint : '/info/orders',
      order_id : getOrderInfo.order_id,
      type     : getOrderInfo.side === 'BUY' ? 'bid' : 'ask',
      currency : getOrderInfo.currency
    }


    REQUEST({
      method : 'POST',
      uri : `${BASE_URL}${req_query.endpoint}`,
      headers : make_header(req_query, api_private_info),
      formData : req_query
      },(err, res, result) => {
        if(err) {
          callback(err);
        }
        else {
          const parseJson = JSON.parse(result);

          if(parseJson.status !== '5600' && ErrorCode[parseJson.status]) {
            callback(`${parseJson.message}`)
          }
          else {
            callback(null, parseJson);
          }
        } 

    });
  },

  getOrderDoneInfo : (getOrderInfo, callback) => {

    const api_private_info = {
      apiKey : getOrderInfo.apikey,
      secretKey : getOrderInfo.apisecret
    }

    const req_query = {
      endpoint : '/info/order_detail',
      order_id : getOrderInfo.order_id,
      type     : getOrderInfo.side === 'BUY' ? 'bid' : 'ask',
      currency : getOrderInfo.currency
    }


    REQUEST({
      method : 'POST',
      uri : `${BASE_URL}${req_query.endpoint}`,
      headers : make_header(req_query, api_private_info),
      formData : req_query
      },(err, res, result) => {
        if(err) {
          callback(err);
        }
        else {
          const parseJson = JSON.parse(result);

          if(parseJson.status !== '5600' && ErrorCode[parseJson.status]) {
            callback(`${parseJson.message}`)
          }
          else {
            callback(null, parseJson);
          }
        } 

    });
  }

}

const make_header = (obj, api_private_info) => {
  let output_string = [];
  Object.keys(obj).forEach(val => {

    let key = val;
    key = encodeURIComponent(key.replace(/[!'()*]/g, escape));

    let value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape));
    output_string.push(key + '=' + value);
  });

  // return output_string.join('&');
  return api_sign(output_string.join('&'), obj.endpoint, api_private_info);

}

const base64_encode = (data) => {

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
  ac = 0,
  enc = '',
  tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

const api_sign = (str_q, endPoint, api_private_info) => {
  let nNonce = new Date().getTime();
  let spliter = String.fromCharCode(0);

  return {
    'Api-Key' : api_private_info.apiKey,
    'Api-Sign' : (base64_encode(CryptoJS.HmacSHA512(endPoint + spliter + str_q + spliter + nNonce, api_private_info.secretKey).toString())),
    'Api-Nonce' : nNonce,
    'Content-Type': 'multipart/form-data'
  };

}  

