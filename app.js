var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

var route = require('./route')(app);

// IDEA: WebServer Listen From 3000 Port.
app.listen(3100, function(){
  console.log("Connected , 3100 port !!!");
});




