var http = require('http');
var asyncHttp = require('async');
var ForvoHttpOptions = require('../models/forvoHttpOptions');

// Return the words/lang/etc given to the service and 
// (if isFetchRecordingsEnabled is true) the voice clips from Forvo.
function getForvoObjects(listOfWords, lang, isFetchRecordingsEnabled) {
    var listOfForvoHttpOptions = listOfWords.map(function(word) {
            return new ForvoHttpOptions(word, lang);
    });

    return new Promise((resolve, reject) => {
        if (!listOfForvoHttpOptions || listOfForvoHttpOptions.size === 0) {
            resolve('No results!!!');
        }

        asyncHttp.map(listOfForvoHttpOptions, 
                function(forvoHttpOption, callback) {
                    var thisWord = forvoHttpOption.word;
                    var httpOptions = forvoHttpOption.getWordHttpOptions();

                    var forvoObject = {'word': thisWord};
                    if (isFetchRecordingsEnabled) {
                        var entry;
                        var jsonRes = '';
                        var x = http.request(httpOptions, function(resX){
                            resX.on('data', function(data){
                                jsonRes += data;
                            });

                            resX.on('end', function() {
                                var forvoRes = JSON.parse(jsonRes);
                                var props = forvoRes.items.map(function(forvoObj) {
                                    // Get attributes from Forvo's response.
                                    return {
                                        'gender': forvoObj.sex,
                                        'country': forvoObj.country,
                                        'audioLink' : forvoObj.pathmp3};
                                });
            
                                // This obj makes it back into the view.
                                forvoObject.props = props;
                                callback(null, forvoObject);
                            });
                        });
                        
                        x.end(); 
                    } else { 
                        callback(null, forvoObject); 
                    }
                    return;
                }, 
            
                function(err, results) {
                    if (err) {
                        console.error(err);
                        reject("Broken in asyncHttp");
                    }
                    console.log('asyncHttp finished requests!!!');

                    resolve(results);
                }
            );
        });
}

module.exports = { 'getForvoObjects': getForvoObjects };