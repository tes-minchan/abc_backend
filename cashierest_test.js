const REQUEST  = require('request');
const BASE_URL = 'https://rest.cashierest.com/info/orders';

// let req_data = {
//   "grant_type" : "password",
//   "serviceKey" : "81ABA79D-6FF0-4364-AFFE-388E4482DD77",
//   "secretKey" : "F16D1705-DCB5-4030-BAFB-C9937D66E93D",
//   "username" : "clrch4n@gmail.com"
// }

let req_data = {
  ordercurrency : "BTC"
}


var options = {
  method: "POST",
  url: `${BASE_URL}`,
  headers: {'Authorization': `bearer pj4IaqM6rpNcv79YHcuN1ovbkcE7MLxU9tt2Mm6MAbTqYssMLJ3eOio72KyF`},
  body : req_data,
  json: true,

};

REQUEST(options, function (error, response, body) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(body);
  }
});

