const db = require("lib/db");
let ERR_MSG = {
  title: null,
  description: null
};

module.exports = {

  getApiKeys: (userinfo, connection, callback) => {
    const sql_query = "SELECT * FROM apikeys WHERE uuid=?";
    const params = [userinfo.uuid];

    db.doQuery(connection, sql_query, params, (err, connection, results ) => {
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

        callback(null, connection);
      }
    });
  },

  getMarketApiKeys: (userinfo, connection, callback) => {
    const sql_query = `SELECT ${userinfo.market.toLowerCase()}_apikey, ${userinfo.market.toLowerCase()}_apisecret FROM apikeys WHERE uuid=?`;
    const params = [userinfo.uuid];

    db.doQuery(connection, sql_query, params, (err, connection, results ) => {
      if (err) {
        ERR_MSG.title = "[DB][ERROR][getApiKeys]";
        ERR_MSG.description = "Interanal Error";
        connection.release();

        callback(ERR_MSG);
      } 
      else {
        const keys = Object.values(results[0]);
          
        userinfo['apikey']    = keys[0];
        userinfo['apisecret'] = keys[1];

        callback(null, connection);
      }
    });
  },

  insertOrderinfo: (userinfo, connection) => {

    const sql_query = "INSERT INTO order_info(reg_date, uuid, market, order_id, currency, side, price, volume, remain_volume, status) VALUES(NOW(), ?, ?, ?, ?, ?, ?, ?, ?, 0)"
    const params    = [userinfo.uuid, userinfo.market, userinfo.order_id, userinfo.currency, userinfo.side, userinfo.price, userinfo.volume, userinfo.volume];

    db.doQuery(connection, sql_query, params, (err, connection, results ) => {
      connection.release();
      if(err) {
        console.log("updateOrderInfo Error", err);
        throw err;
      }
    });

  },

  getOrderinfo: (userinfo, connection, callback) => {

    const sql_query = "SELECT market, order_id, currency, side, price, volume FROM order_info WHERE uuid = ? AND status = 0";
    const params    = [userinfo.uuid];

    db.doQuery(connection, sql_query, params, (err, connection, results) => {
      if(err) {
        console.log("updateOrderInfo Error", err);
        callback("updateOrderInfo Error", connection);
      }
      else {
        userinfo['orderinfo'] = results;
        callback(null, connection);
      }
    });
  },

  getOrderStatus: (userinfo, connection, callback) => {

    const sql_query = "SELECT reg_date, market, order_id, currency, side, price, volume, remain_volume, market_status FROM order_info WHERE uuid = ? AND status = 0 ORDER BY reg_date DESC";
    const params    = [userinfo.uuid];

    db.doQuery(connection, sql_query, params, (err, connection, results) => {
      if(err) {
        console.log("getOrderStatus Error", err);
        callback("getOrderStatus Error", connection);
      }
      else {
        userinfo['orderstatus'] = results;
        callback(null, connection);
      }
    });
  },

  getOrderDetail: (userinfo, connection, callback) => {
    const sql_query = "SELECT trade_date, order_id, market, currency, side, price, volume, fee, trade_funds FROM order_detail WHERE uuid = ? ORDER BY trade_date DESC";
    const params    = [userinfo.uuid];

    db.doQuery(connection, sql_query, params, (err, connection, results) => {
      if(err) {
        console.log("getOrderDetail Error", err);
        callback("getOrderDetail Error", connection);
      }
      else {
        userinfo['orderdetail'] = results;
        callback(null, connection);
      }
    });
  },

  updateOrderinfo: (orderinfo, connection) => {

    const sql_query = "UPDATE order_info SET market = ?, currency = ?, side = ?, price = ?, volume = ?, remain_volume = ?, market_status = ? WHERE order_id = ?";
    const params    = [orderinfo.market, orderinfo.currency, orderinfo.side, orderinfo.price, orderinfo.volume, orderinfo.remain_volume, orderinfo.market_status, orderinfo.order_id];

    db.doQuery(connection, sql_query, params, (err, connection, results) => {
      connection.release();
      if(err) {
        console.log("updateOrderinfo Error", err);
        throw err;
      }
    });

  },

  insertDoneOrder: (orderinfo, connection) => {

    let sql_query  = `UPDATE order_info SET status = 1, remain_volume = 0 WHERE order_id = '${orderinfo.order_id}';`;
        sql_query  += `INSERT INTO order_detail(trade_date, uuid, order_id, market, currency, side, price, volume, fee, trade_funds) `;
        sql_query  += `VALUES(FROM_UNIXTIME(${parseInt(orderinfo.trade_date / 1000)}), '${orderinfo.uuid}', '${orderinfo.order_id}', '${orderinfo.market}', '${orderinfo.currency}', '${orderinfo.side}', '${orderinfo.price}', '${orderinfo.volume}', '${orderinfo.fee}', '${orderinfo.total}');`

    
    db.doMultiQuery(connection, sql_query, (err, connection, results) => {
      connection.release();
      if(err) {
        console.log("insertDoneOrder Error", err);
        throw err;
      }
    });

  },

  updateCancelOrder: (orderinfo, connection) => {
    const sql_query = "UPDATE order_info SET status = 1, market_status = ? WHERE order_id = ?";
    const params = [orderinfo.market_status, orderinfo.order_id];

    db.doQuery(connection, sql_query, params, (err, connection, results) => {
      connection.release();
      if(err) {
        console.log("updateCancelOrder Error", err);
        throw err;
      }
    });
  }
};
