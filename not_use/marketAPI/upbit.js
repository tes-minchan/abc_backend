const sign     = require("jsonwebtoken").sign;
const queryEncode = require("querystring").encode
const axios    = require('axios');
const REQUEST  = require('request');


const BASE_URL = 'https://api.upbit.com/v1';




module.exports = {

  getBalance : function (ACCESS_TOKEN, SECRET_KEY) {

    const payload = {access_key: ACCESS_TOKEN , nonce: (new Date).getTime()};
    const token = sign(payload, SECRET_KEY);

    return axios.get(
      `${BASE_URL}/accounts`,
      {
        headers: {'Authorization': `Bearer ${token}`}
      }
    ).then(res => res.data)
    .catch(error => {
      throw error
    });

  },

  setOrders : function(getOrderInfo, callback) {
    const _ACCESS_TOKEN = getOrderInfo.apikey;
    const _SECRET_KEY   = getOrderInfo.apisecret;

    const orderinfo = {
      market : `KRW-${getOrderInfo.coin.toUpperCase()}`,
      side   : getOrderInfo.side.toUpperCase() === 'BUY' ? 'ask' : 'bid',
      volume : getOrderInfo.volume,
      price  : getOrderInfo.price,
      ord_type : "limit"
    }

    const query = queryEncode(orderinfo);
    const payload = {
      access_key: _ACCESS_TOKEN, 
      nonce : (new Date).getTime(),
      query : query
    };

    const token = sign(payload, _SECRET_KEY);

    var options = {
      method: "POST",
      url: `${BASE_URL}/orders`,
      headers: {Authorization: `Bearer ${token}`},
      json: orderinfo
    };

    REQUEST(options, function (error, response, body) {
      if (error) {
        callback(error);
      }
      else {
        if(body.error) {
          callback(body.error.message);
        }
        else {
          callback(null, body);
        }

      }
    });

  },

}



