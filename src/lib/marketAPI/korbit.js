// const Korbit = require('korbit-node-client').user;
// const korbitAPI = new Korbit();

// module.exports = {

//   getBalance : function (ACCESS_TOKEN, SECRET_KEY, cb) {

//     let  AccessToken = {
//       token : { 
//          access_token: ACCESS_TOKEN,
//          refresh_token: SECRET_KEY,
//       }  
//     }

//     korbitAPI.getUserBalances(AccessToken).then(result => {
//       cb(null, result);

//     })
//     .catch(error => {
//       console.log(error);
//       cb(error);
//     })


//   },

//   setOrders : function(ACCESS_TOKEN, SECRET_KEY, orderinfo, cb) {

//     let  AccessToken = {
//       token : { 
//          access_token: ACCESS_TOKEN,
//          refresh_token: SECRET_KEY,
//       }  
//     }

//     let option = {
//       type   : orderinfo.type,
//       price  : orderinfo.price,
//       coin_amount : orderinfo.volume,
//     }

//     if(orderinfo.side === 'BUY') {
//       korbitAPI.getUserOrdersBuy(AccessToken, orderinfo.currency , option).then(result => {
//         cb(null, result);
//       })
//       .catch(error => {
//         cb(error);

//       })
//     }
//     else {
//       korbitAPI.getUserOrdersSell(AccessToken, orderinfo.currency , option).then(result => {
//         cb(null, result);
//       })
//       .catch(error => {
//         cb(error);
//       })
//     }


//   },

// }



