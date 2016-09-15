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
                var httpOptions = forvoHttpOption.getWordHttpOptions();

                
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
                        callback(null, {'word': thisWord, 'props': props});
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