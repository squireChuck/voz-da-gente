var bodyParser = require('body-parser');
var ForvoHttpOptions = require('../models/forvoHttpOptions');
var forvoService = require('../services/forvoService');
var gVisionService = require('../services/gVisionService');
var http = require('http');

module.exports = function(app) {
    
    app.post('/voz/api/imageText', function(req, res) {
        // Sample image on server...
        console.log('POST endpoint for image...');
        var sampleImage = req.body.userImage;
        gVisionService.getTextFromImage(sampleImage, 
            function (err, text) {
                if (err) {
                    console.log('Call to goog failed');
                    console.log(err);
                    res.send({'msg' : 'No luck!!!'});
                    return;
                }

                console.log('Found some text!');
                console.log(JSON.stringify(text).substring(0, 300));
                console.log(text[0].textAnnotations[0].description.substring(0, 100));
                res.send({'text' : text[0].textAnnotations[0].description}); // Send found labels.

                return;
            });
    });

    app.get('/voz/api/langs', function(req, res) {
        // TODO This constructor call is silly looking - needs refactoring.
        var forvoHttpOptions = new ForvoHttpOptions('a', 'a');
        var jsonRes = '';

        // TODO Determine if this should be in forvo service as new method, 
        //      and some of the http request stuff consolidated. 
        var x = http.request(forvoHttpOptions.getLangListHttpOptions(), function(resX){
            resX.on('data', function(data){
                jsonRes += data;
            });

            resX.on('end', function() {
                var forvoRes = JSON.parse(jsonRes);
                var langs = forvoRes.items.map(function(forvoObj) {
                    // Get attributes from Forvo's response.
                    return {
                        'langCode': forvoObj.code,
                        /*
                             This res attr appears to be the same as the language attr 
                             found in forvoHttpOptions.langListPath
                        */
                        'langName': forvoObj.en}; 
                });

                // This obj makes it back into the view.
                res.send({'langs': langs});
            });
        });
        
        x.end();   
    });

    // Parse the phrase and return info for each word we find.
    app.get('/voz/api/phrase', function (req, res) {
        var phrase = req.query.phrase;
        var lang = req.query.lang;
        var wordsInPhrase = phrase.split(/\s\s*/);

        // Build the httpOptions for each word.
        var listOfHttpOptions = wordsInPhrase.map(
            function(word) {
                return new ForvoHttpOptions(word, lang);
            });

        console.log('Starting requests for: ' + wordsInPhrase.join(', '));
        
        forvoService.getForvoObjects(listOfHttpOptions)
            .then(results => {
                console.log("In the phrase endpoint, I'm a promise now! :D");
                res.send(results);
            }, error => {
                console.log("I'm broken in the phrase endpoint... :( ");
                res.send("Unable to parse phrase request...");
            });
    });

    // Use the word as is and return info if found.
    app.get('/voz/api/word/', function(req, res) {
        var word = req.query.word;
        var lang = req.query.lang;

        var httpOptions = new ForvoHttpOptions(word, lang);
        var listOfOptions = [];
        listOfOptions.push(httpOptions);

        console.log('Starting requests for: ' + word);
        
        forvoService.getForvoObjects(listOfOptions)
            .then(results => {
                console.log("In the word endpoint, I'm a promise now! :D");
                res.send(results);
            }, error => {
                console.log("I'm broken in the word endpoint... :( ");
                res.send("Unable to parse word request...");
            });
    });
}