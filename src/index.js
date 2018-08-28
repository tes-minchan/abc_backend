const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
var logger = require('morgan');


app.use(logger(function (tokens, req, res) {
  var body = req.body;
  delete body.password;
  delete body.verify;
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms /',
    new Date().toLocaleString(), ' / ',
    JSON.stringify(body)
  ].join(' ')
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

require('./route')(app);

// IDEA: WebServer Listen From 3000 Port.
app.listen(3100, function(){
  console.log("Connected , 3100 port !!!");
});




