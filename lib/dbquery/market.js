var db = require('../db')
var pbkdf2_pwd = require('pbkdf2-password');
var hasher = pbkdf2_pwd();
var jwt = require('jsonwebtoken');
var config = require('../../config');
var uuidv1 = require('uuid/v1');

var ERR_MSG = {
  title : null,
  description : null
}


module.exports = {

  getApiKeys : (userinfo, connection, callback) => {
    var sql_query = "SELECT * FROM apikeys WHERE uuid=?";
    var params = [userinfo.uuid];

    db.doQuery(
      connection
      , sql_query
      , params
      , function(err, connection, results) {
        if (err) {

          ERR_MSG.title = "[DB][ERROR][getApiKeys]";
          ERR_MSG.description = "Interanal Error";

          callback(ERR_MSG, connection);
        }
        else {
          let key = Object.keys(results[0]);
          let values = Object.values(results[0]);
          userinfo.apikeys = {}

          values.map((item, index) => {
            if(index > 0 && item != null) {
              userinfo.apikeys[key[index]] = item;
            }
          })

          callback(null, connection, userinfo);

        }

    });

  },

}