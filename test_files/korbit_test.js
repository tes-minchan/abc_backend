const REQUEST  = require('request');
const Korbit = require('korbit-node-client').user;

let option = {
  "client_id" : "x7Ckh4NGeMyJrek0jrSInkSNT8IVj78ZQYNnf11DWgrlQsP1Jw0aQsSVabVuh",
  "client_secret" : "Q6Ap3TEkFRpges31mMeGy6j125dV7oRTkrLYxXJZ2ZQui2NO4DPzFMpYblKfv",
  "username" : "themansjh@naver.com",
  "password" : "Fprcu851212!" 
}

api = new Korbit();
// api.createAccessToken(option).then(result => {
//   console.log(result);

// });

let accesstoken = {
    token:
     { token_type: 'Bearer',
       access_token: 'W5wiNaCqMjNMzVkq78CbEFUNDrDaVMxTHyLKaUPwR6wQQHfbAcdFoffWs9vzN',
       expires_in: 3600,
       refresh_token: 'l7diPx32sVxvZq4fScF6hpwowqqdBv4FuVXpHIPWuSVOmzV8fmZeP8LNpPTwR'
      }
}

// let option = {
//   market : 'btc_krw',
//   type : "limit",
//   price : "10000000",
//   coin_amount : "0.01",

// }

// api.getUserOrdersBuy(AccessToken, 'btc_krw' , option).then(result => {
//   console.log(result);
// })


api.refreshToken(accesstoken).then(result => {
  console.log(result);
});

// })
// api.getUserBalances(AccessToken).then(result => {
//   console.log(result);
// })



// const BASE_URL = 'https://api.korbit.co.kr/v1';

// let req_data = {
//   "client_id" : "x7Ckh4NGeMyJrek0jrSInkSNT8IVj78ZQYNnf11DWgrlQsP1Jw0aQsSVabVuh",
//   "client_secret" : "Q6Ap3TEkFRpges31mMeGy6j125dV7oRTkrLYxXJZ2ZQui2NO4DPzFMpYblKfv",
//   "username" : "themansjh@naver.com",
//   "password" : "Fprcu851212!",
//   "grant_type" : "password"

// }

// var options = {
//   method: "POST",
//   url: `${BASE_URL}/oauth2/access_token`,
//   data : req_data,
//   json: true,
// };

// REQUEST(options, function (error, response, body) {
//   if (error) {
//     console.log(error);
//   }
//   else {
//     console.log(body);
//   }
// });

