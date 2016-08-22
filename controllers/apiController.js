//var bodyParser = require('body-parser');
var ForvoHttpOptions = require('../models/forvoHttpOptions');
var forvoService = require('../services/forvoService');
var http = require('http');

module.exports = function(app) {
    // TODO Use body-parser once we add POST features.
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({extended: true}));

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
        // TODO how can this method work w/o sending in response? Promises???
        forvoService.getForvoObjects(listOfHttpOptions, res);
    });

    // Use the word as is and return info if found.
    app.get('/voz/api/word/', function(req, res) {
        var word = req.query.word;
        var lang = req.query.lang;

        var httpOptions = new ForvoHttpOptions(word, lang);
        var listOfOptions = [];
        listOfOptions.push(httpOptions);

        console.log('Starting requests for: ' + word);
        // TODO how can this method work w/o sending in response? Promises???
        forvoService.getForvoObjects(listOfOptions, res);
    });
}