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

  setOrders : function(ACCESS_TOKEN, SECRET_KEY, orderinfo, cb) {

    const query = queryEncode(orderinfo);
    const payload = {
      access_key: ACCESS_TOKEN, 
      nonce : (new Date).getTime(),
      query : query
    };

    const token = sign(payload, SECRET_KEY);

    var options = {
      method: "POST",
      url: `${BASE_URL}/orders`,
      headers: {Authorization: `Bearer ${token}`},
      json: orderinfo
    };

    REQUEST(options, function (error, response, body) {
      if (error) {
        cb(error);
      }
      else {
        cb(null, body);
      }
    });

  },

}



