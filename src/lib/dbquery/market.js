const db = require("lib/db");
let ERR_MSG = {
  title: null,
  description: null
};

module.exports = {
  getApiKeys: (userinfo, connection, callback) => {
    var sql_query = "SELECT * FROM apikeys WHERE uuid=?";
    var params = [userinfo.uuid];

    db.doQuery(connection, sql_query, params, function(
      err,
      connection,
      results
    ) {
      if (err) {
        ERR_MSG.title = "[DB][ERROR][getApiKeys]";
        ERR_MSG.description = "Interanal Error";

        callback(ERR_MSG, connection);
      } else {
        let key = Object.keys(results[0]);
        let values = Object.values(results[0]);
        userinfo.apikeys = {};

        values.map((item, index) => {
          if (index > 0 && item != null) {
            userinfo.apikeys[key[index]] = item;
          }
        });

        callback(null, connection, userinfo);
      }
    });
  },

  getMarketApiKeys: (userinfo, connection, callback) => {
    var sql_query = `SELECT ${userinfo.market.toLowerCase()}_apikey, ${userinfo.market.toLowerCase()}_apisecret FROM apikeys WHERE uuid=?`;
    var params = [userinfo.uuid];

    db.doQuery(connection, sql_query, params, function(
      err,
      connection,
      results
    ) {
      if (err) {
        ERR_MSG.title = "[DB][ERROR][getApiKeys]";
        ERR_MSG.description = "Interanal Error";

        callback(ERR_MSG, connection);
      } else {
        if(err) {
          ERR_MSG.title = "[DB][ERROR][getApiKeys]";
          ERR_MSG.description = "Interanal Error";
  
          callback(ERR_MSG, connection);
        }
        else {
          const keys = Object.values(results[0]);
          
          userinfo['apikey']    = keys[0];
          userinfo['apisecret'] = keys[1];
  
          callback(null, connection);
        }
      }
    });
  },

  setUpbitORderinfo: (orderinfo, connection, callback) => {
    let sql_query = "INSERT INTO upbit_orderinfo(reg_date, uuid, coin, side, price, avg_price, volume, fee, status) VALUES( NOW(), ?, ?, ?, ?, ?, ?, ?)"
    let params    = [...orderinfo];



    console.log(params);
  }
};
