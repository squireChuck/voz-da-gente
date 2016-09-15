var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var sampleController = require('./controllers/sampleController');
var apiController = require('./controllers/apiController');
var port = process.env.PORT || 3000;

app.use('/scripts', express.static(path.resolve(__dirname + '/../client/scripts')));
app.use('/src', express.static(path.resolve(__dirname + '/../client/src')));  
app.use(bodyParser.json({'limit':'5mb'}));
app.use(bodyParser.urlencoded({extended: true}));

// Redirect url's with trailing slashes to the same URL but sans the slash. 
app.use(function(req, res, next) {
   if(req.url.substr(-1) == '/' && req.url.length > 1)
       res.redirect(301, req.url.slice(0, -1));
   else
       next();
});

app.set('view engine', 'ejs');
sampleController(app);

apiController(app);

app.get('/voz', function(req,res){
 res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

var listener = app.listen(port, function(){
    console.log('Listening on ' + JSON.stringify(listener.address()));
    console.log('Listening on port ' + listener.address().port + '...'); 
});