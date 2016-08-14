var http = require('http');
var asyncHttp = require('async');

// Return the words/lang/etc from Forvo.
function getForvoObjects(listOfForvoHttpOptions, res) {
    if (!listOfForvoHttpOptions || listOfForvoHttpOptions.size === 0) {
        res.send('No results!!!');
    }
        
    asyncHttp.map(listOfForvoHttpOptions, 
            function(forvoHttpOption, callback) {
                var thisWord = forvoHttpOption.word;
                var httpOptions = forvoHttpOption.getHttpOptions();

                
                var entry;
                var jsonRes = '';
                var x = http.request(httpOptions, function(resX){
                    resX.on('data', function(data){
                        jsonRes += data;
                    });

                    resX.on('end', function() {
                        var forvoRes = JSON.parse(jsonRes);
                        var mp3Links = forvoRes.items.map(function(forvoObj) {
                            return forvoObj.pathmp3;
                        });
     
                        callback(null, {'word': thisWord, 'links': mp3Links});
                    });
                });
                
                x.end();   
            }, 
        
            function(err, results) {
                if (err) {
                    console.error(err);
                    return;
                }

                console.log('asyncHttp finished requests!!!');

                // TODO Can this service be decoupled from the response?
                //return results;
                res.send(results);
            }
        );
}

module.exports = { 'getForvoObjects': getForvoObjects };