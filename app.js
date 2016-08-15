var express = require('express');
var app = express();
var sampleController = require('./controllers/sampleController');
var apiController = require('./controllers/apiController');
var port = process.env.PORT || 3000;

app.use('/scripts', express.static(__dirname + '/client/scripts'));
app.use('/src', express.static(__dirname + '/client/src'));  

app.set('view engine', 'ejs');
sampleController(app);

apiController(app);

app.get('/voz', function(req,res){
 res.sendFile(__dirname + '/client/index.html');
});

app.listen(port);