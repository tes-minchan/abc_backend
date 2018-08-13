const utils = require('../lib/utils');
const config = require('../config');
const async = require('async');
const db = require('../lib/db')
const dbMarket = require('../lib/dbquery/market');
const GopaxAPI = require('../lib/queryAPI/gopax');


module.exports = {

  setOrders : function(req, res) {
    
    let userinfo = {
      uuid   : req.decoded.uuid,
      currency : req.body.orderinfo.market,
      side   : req.body.orderinfo.side,
      volume    : req.body.orderinfo.volume,
      price  : req.body.orderinfo.price,
      ord_type : req.body.orderinfo.ord_type
    }

    async.waterfall([
      db.getConnection,
      async.apply(dbMarket.getApiKeys, userinfo)
    ], function(err, connection, result){
      connection.release();

      if(err) {
        res.status(403).json(utils.resFail(err.description));
      }
      else {
        async.waterfall([
          async.apply(GopaxAPI.setOrders, userinfo),

        ], (error, result) => {
          if(error) {
            res.status(403).json(utils.resFail(error));
          }
          else {
            res.status(200).json(utils.resSuccess(result));
          }
        });
      }
    });

  }
}