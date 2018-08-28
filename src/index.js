const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

require('./route')(app);

// IDEA: WebServer Listen From 3000 Port.
app.listen(3100, function(){
  console.log("Connected , 3100 port !!!");
});




