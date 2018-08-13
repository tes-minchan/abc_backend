const async = require('async');
const db = require('../lib/db')
const dbMarket = require('../lib/dbquery/market');
const utils = require('../lib/utils');

const UpbitAPI   = require('../lib/queryAPI/upbit');
const BithumbAPI = require('../lib/queryAPI/bithumb');
const CoinoneAPI = require('../lib/queryAPI/coinone');
const GopaxAPI   = require('../lib/queryAPI/gopax');
const KorbitAPI  = require('../lib/queryAPI/korbit');

module.exports = {

  getAllBalance : function(req, res, next) {
    let userinfo = {
      uuid : req.decoded.uuid
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
        let market_balance = {};

        async.waterfall([
          async.apply(UpbitAPI.getBalance, userinfo, market_balance),
          async.apply(BithumbAPI.getBalance, userinfo, market_balance),
          async.apply(CoinoneAPI.getBalance, userinfo, market_balance),
          async.apply(GopaxAPI.getBalance, userinfo, market_balance),
          // async.apply(KorbitAPI.getBalance, userinfo, market_balance),

        ], (error) => {
          if(error) {
            res.status(403).json(utils.resFail(error));
          }
          else {
            res.status(200).json(utils.resSuccess(market_balance));
          }
        });
      }
    });

  },


}

