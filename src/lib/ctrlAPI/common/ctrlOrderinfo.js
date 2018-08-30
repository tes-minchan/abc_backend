
const dbQuery = require("lib/dbquery/market");
const db = require("lib/db");
const async = require("async");
const updateOrderinfo = require('./updateOrderinfo');

module.exports = {

  updateOrderID: (orderinfo) => {
    async.waterfall(
      [
        db.getConnection, 
        async.apply(dbQuery.insertOrderinfo, orderinfo)
      ], (error, result) => {
        if(error) {
          console.log(error);
        }
        
      });
  },

  updateOrder: async (userinfo, connection, callback) => {

    for(const element of userinfo.orderinfo) {
      const _userinfo = {
        uuid      : userinfo.uuid,
        apikey    : userinfo.apikeys[`${element.market.toLowerCase()}_apikey`],
        apisecret : userinfo.apikeys[`${element.market.toLowerCase()}_apisecret`],
        order_id  : element.order_id,
        side      : element.side,
        currency  : element.currency,
        market    : element.market
      }


      if(element.market === 'BITHUMB') {
        try {
          await updateOrderinfo.bithumbUpdate(_userinfo);
        }
        catch (error) {
          console.log(error);
        }
      }
      else if(element.market === 'COINONE') {
        try {
          await updateOrderinfo.coinoneUpdate(_userinfo);
        }
        catch (error) {
          console.log(error);
        }
      }
      else if(element.market === 'GOPAX') {
        try {
          await updateOrderinfo.gopaxUpdate(_userinfo);
        }
        catch (error) {
          console.log(error);
        }
      }
      else if(element.market === 'UPBIT') {
        try {
          await updateOrderinfo.upbitUpdate(_userinfo);

        }
        catch (error) {
          console.log(error);
        }
      }


    }
    callback(null, connection, "updateOrder success");

  }





}