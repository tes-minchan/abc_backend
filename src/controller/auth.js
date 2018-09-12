const utils = require('../lib/utils');
const config = require('../config');
const jwt = require('jsonwebtoken');
const async = require('async');
const db = require('../lib/db')
const userauth = require('../lib/dbquery/auth');


module.exports = {

  login : (req, res) => {
    var userinfo = {
      ...req.body
    };
    
    async.waterfall([
      db.getConnection,
      async.apply(userauth.getLogin, userinfo)
    ], function(err, connection, result){
      connection.release();

      if(err) {
        res.status(403).json(utils.resFail(err.description));
      }
      else {
        res.status(200).json(utils.resSuccess(result));
      }
    });

  },

  register : function (req, res, next) {
    var user_info = {
      ...req.body
    }

    async.waterfall([
      db.getConnection,
      db.beginTRX,
      async.apply(userauth.registerUser, user_info),
      async.apply(userauth.registerUserApikeys, user_info),      
    ], function(err, connection, result){
      if(err) {
        connection.rollback(function() {
          connection.release();
          return res.status(500).json(utils.resFail(err.description,err.title));
        });
      }
      else {
        connection.commit(function (err) {
          if (err) {
              connection.rollback(function () {
                connection.release();
                return res.status(500).json(utils.resFail("[INTERNAL]","FAIL"));
              });
          }
          else {
            connection.release();
            return res.status(200).json(utils.resSuccess("success"));
          }
        });
      }
    });
  },

  isLogin : function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(403).json(utils.resFail("Need user token"));
    else {
      jwt.verify(token, config.jwtSecretKey, function(err, decoded) {
        if(err) return res.status(403).json(utils.resFail("Token verify error"));
        else{
          req.decoded = decoded;
          next();
        }
      });
    }
  },

  getMarketSubs : function (req, res, next) {
    const userinfo = {
      uuid: req.decoded.uuid
    };

    async.waterfall(
      [
        db.getConnection, 
        async.apply(userauth.queryMarketSubs, userinfo)
      ],
      function(err, connection, result) {
        connection.release();

        if (err) {
          res.status(403).json(utils.resFail(err.description));
        } else {
          res.status(200).json(utils.resSuccess(result));
        }
      }
    );

  }

};
