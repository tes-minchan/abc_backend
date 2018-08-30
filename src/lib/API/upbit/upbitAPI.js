const sign     = require("jsonwebtoken").sign;
const queryEncode = require("querystring").encode
const request  = require('request');

const BASE_URL = 'https://api.upbit.com/v1';


function upbitAPI (_ACCESS_TOKEN, _SECRET_KEY) {

  this.ACCESS_TOKEN = _ACCESS_TOKEN;
  this.SECRET_KEY   = _SECRET_KEY;

  this.callPersonalAPI = (url, data) => {

    const query = queryEncode(data);
    const payload = {
      access_key: _ACCESS_TOKEN, 
      nonce : (new Date).getTime(),
      query : query
    };

    const token = sign(payload, _SECRET_KEY);

    return {
      method: data ? "POST" : "GET",
      url: `${BASE_URL}${url}`,
      headers: {Authorization: `Bearer ${token}`},
      json: data ? data : null
    };

  }
}

upbitAPI.prototype.getBalances = function () {

  return new Promise(async (resolve, reject)=> {

    const options = this.callPersonalAPI('/accounts');
  
    request(options, (error, response, result) => {
      if(error) reject(error);
      else {
        resolve(result);
      }
    });

  });

}


upbitAPI.prototype.sendOrder = function (orderinfo) {
  return new Promise(async (resolve, reject)=> {

    const options = this.callPersonalAPI('/orders', orderinfo);
    
    request(options, (error, response, result) => {
      if(error) reject(error);
      else {
        resolve(result);
      }
    });
  });
}

upbitAPI.prototype.getOrderinfoByID = function (orderID) {

  return new Promise(async (resolve, reject)=> {

    
    const query = queryEncode({uuid: orderID});

    const payload = {
      access_key: this.ACCESS_TOKEN, 
      nonce : (new Date).getTime(),
      query : query
    };

    
    const token = sign(payload, this.SECRET_KEY);

    const options = {
      method: "GET",
      url: `${BASE_URL}/order?${query}`,
      headers: {Authorization: `Bearer ${token}`},
    };

    request(options, (error, response, result) => {
      if(error) {
        reject(error)
      }
      else {
        resolve(JSON.parse(result));
      }
    });

  });
}


module.exports = upbitAPI

