var bodyParser = require('body-parser');
var ForvoHttpOptions = require('../models/forvoHttpOptions');
var forvoService = require('../services/forvoService');
// var googleVisionService = require('../services/googleVisionService');
var http = require('http');

function isExternalServiceEnabled(configFile, isEnabledCheck) {
    try {
        if (configFile && isEnabledCheck(configFile)) {
            return true;
        }
    } catch (ex) {
        
    }

    return false;
}

module.exports = function(app) {
    
    app.post('/voz/api/imageText', function(req, res) {
        // Sample image on server...
        console.log('POST endpoint for image...');
        var sampleImage = req.body.userImage;
        googleVisionService.getTextFromImage(sampleImage, 
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
        var forvoHttpOptions = new ForvoHttpOptions('a', 'a');
        var jsonRes = '';

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
        var isFetchRecordingsEnabled = (req.query.isFetchRecordingsEnabled === 'true');
        
        // Getting words by delimiting on whitespaces and non-letter chars.
        var phraseParsingPattern = /[\n\r\s]+|[^a-zA-Z'\u00C0-\u017F]+/;
        var wordsInPhrase = Array.from(new Set(phrase.split(phraseParsingPattern)))
            .filter(function(word) {
                // Removing blanks from results.
                return word !== "";
             })
            .sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });

        console.log('Starting requests for: ' + wordsInPhrase.join(', '));
        forvoService.getForvoObjects(wordsInPhrase, lang, isFetchRecordingsEnabled)
            .then(data => {
                console.log("In the phrase endpoint, I'm a promise now! :D");
                res.send(data);
            }, error => {
                console.log("I'm broken in the phrase endpoint... :( ");
                res.send("Unable to parse phrase request...");
            });

        return;
    });

    // Use the word as is and return info if found.
    app.get('/voz/api/word', function(req, res) {
        var word = req.query.word;
        var lang = req.query.lang;

        var listOfWords = [];
        listOfWords.push(word);

        console.log('Starting requests for: ' + word);
        
        forvoService.getForvoObjects(listOfWords, lang, true)
            .then(results => {
                console.log("In the word endpoint, I'm a promise now! :D");
                res.send(results);
            }, error => {
                console.log("I'm broken in the word endpoint... :( ");
                res.send("Unable to parse word request...");
            });
    });

    /*
     * Determine if an external service (e.g. Forvo, Google Vision) has 
     * been configured correctly/enabled.
     */
    app.get('/voz/api/external/:service/isEnabled', function(req, res) {
        var serviceToCheck = req.params.service;
        var isEnabled;

        if (serviceToCheck === 'forvo') {
            isEnabled = isExternalServiceEnabled(require('../config/config'), 
                function(fileToCheck) {
                    // Need the forvo api key in order to use the app!
                    if(fileToCheck.FORVO_API_KEY) {
                        return true;
                    }

                    return false;
                });
        } else if (serviceToCheck === 'googleVision') {
            isEnabled = isExternalServiceEnabled(require('../config/googleVisionKeyfile'), 
                function(fileToCheck) {
                    // If the google keyfile has these two fields, chances are the file was set up correctly.
                    if(fileToCheck.private_key && fileToCheck.private_key_id) {
                        return true;
                    }
                    
                    return false;
                });
        } else {
            isEnabled = false;
        }
        
        res.send({"isEnabled": isEnabled});
        return;
    });
};