const db = require('lib/db')
const pbkdf2_pwd = require('pbkdf2-password');
const hasher = pbkdf2_pwd();
const jwt = require('jsonwebtoken');
const config = require('config');
const uuidv1 = require('uuid/v1');
const _ = require('lodash');

var ERR_MSG = {
  title : null,
  description : null
}


module.exports = {

  /*
  *** Register New User ***
  */
  registerUser : (userinfo, connection, callback) => {
    var sql_query = "SELECT id FROM members WHERE id=?";
    var params = [userinfo.id];

    db.doQuery(
      connection
      , sql_query
      , params
      , function(err, connection, results) {
        if (err) {

          ERR_MSG.title = "[DB][ERROR][registerUser]";
          ERR_MSG.description = "Interanal Error";

          callback(ERR_MSG, connection);
        }
        else {
          if (results.length) {
            ERR_MSG.title = "[USER_REGISTER][FAIL]";
            ERR_MSG.description = "ID is already exist !!!";

            callback(ERR_MSG, connection);
          } else {
            hasher({ password : userinfo.password }, function(err, pass, salt, hash){
              userinfo.uuid = uuidv1();

              var sql_query = "INSERT INTO members (reg_date, uuid, id, name, password, password_salt) VALUES(NOW(),?,?,?,?,?)";
              var params = [userinfo.uuid, userinfo.id, userinfo.name, hash, salt];

              db.doQuery(
                connection
                , sql_query
                , params
                , function(err, connection, results) {
                  if (err) {
                    ERR_MSG.title = "[DB][ERROR]";
                    ERR_MSG.description = "Interanal Error";

                    callback(ERR_MSG, connection);
                  }
                  else {
                    callback(null, connection);
                  }
                });
            });
          }
        }
    });
  },

  registerUserApikeys: function(userinfo, connection, callback) {

    var sql_query = "INSERT INTO apikeys (uuid) VALUES(?)";
    var params = [userinfo.uuid];

    db.doQuery(
      connection
      , sql_query
      , params
      , function(err, connection, results) {
        if (err) {
          ERR_MSG.title = "[DB][ERROR]";
          ERR_MSG.description = "Interanal Error";

          callback(ERR_MSG, connection);
        }
        else {
          callback(null, connection);
        }
      });

  },
  
  getLogin: function(userinfo, connection, callback){

    var sql_query = "SELECT * FROM members WHERE id = ?";
    var params = [userinfo.id];

    db.doQuery(
      connection
      , sql_query
      , params
      , function(err, connection, results) {
          if (err) {
            ERR_MSG.title = "[DB][ERROR]";
            ERR_MSG.description = "Interanal Error";

            callback(ERR_MSG, connection);
          } else {
            if(!results.length) {
              ERR_MSG.title = "[USER_REGISTER][FAIL]";
              ERR_MSG.description = "ID is not registered !!!";

              callback(ERR_MSG, connection);
            }
            else {
              hasher({ password : userinfo.password , salt :results[0].password_salt }, function(err, pass, salt, hash){
                if(hash === results[0].password) {

                  var data = {
                    uuid        : results[0].uuid,
                    id          : results[0].id,
                    name        : results[0].name
                  }
                  
                  var newToken = jwt.sign(
                    data,
                    config.jwtSecretKey,
                    config.jwtoption
                  );

                  callback(null, connection, newToken);
                }
                else {
                  ERR_MSG.title = "[USER_REGISTER][FAIL]";
                  ERR_MSG.description = "Wrong Password !!!";

                  callback(ERR_MSG, connection);
                }
              });
            }
        }
    });
  },

  queryMarketSubs : function(userinfo, connection, callback) {
    const marketList = ['BITHUMB', 'COINONE', 'GOPAX', 'UPBIT'];
    let sql_query = "";

    marketList.forEach(item => {
      sql_query += `SELECT * FROM subs_${item.toLowerCase()} WHERE uuid = '${userinfo.uuid}';`;
    })
    
    db.doMultiQuery(connection, sql_query, (err, connection, results) => {
      if(err) {
        console.log("queryMarketSubs Error", err);
        callback(err);
      }
      else {
        const returnData = results.map((item, index) => {
          delete item[0].uuid;

          return {
            market : marketList[index],
            subscribe : item[0]
            // subscribe : _.map(item[0], (status, coin) => {
            //   return {
            //     name : coin,
            //     status : status
            //   };
            // })
          }
        })
        callback(null, connection, returnData);
      }
    });

  }
}