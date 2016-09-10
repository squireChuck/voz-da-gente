var express = require('express');
var app = express();
var sampleController = require('./controllers/sampleController');
var apiController = require('./controllers/apiController');
var port = process.env.PORT || 3000;

app.use('/scripts', express.static(__dirname + '/client/scripts'));
app.use('/src', express.static(__dirname + '/client/src'));  

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
 res.sendFile(__dirname + '/client/index.html');
});

var listener = app.listen(port, function(){
    console.log('Listening on port ' + listener.address().port + '...'); 
});