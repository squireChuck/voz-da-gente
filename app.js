var express = require('express');
var app = express();
var sampleController = require('./controllers/sampleController');
var apiController = require('./controllers/apiController');
var port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/public')); 

app.set('view engine', 'ejs');
sampleController(app);

apiController(app);

app.listen(port);