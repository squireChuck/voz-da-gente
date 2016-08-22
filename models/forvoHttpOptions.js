var envConfig = require('../config/config');
var qs = require('querystring');

// Construct the http options needed to hit the Forvo web API.
// The args specify which parts of the api we can currently vary in our app, 
//  e.g. we can easily hit the Forvo api with different words or langs.
function ForvoHttpOptions(word, lang) {
    this.word = word;
    this.host = 'apifree.forvo.com',
    this.path = '/key/' + envConfig.FORVO_API_KEY + '/format/json/action/word-pronunciations/word/' + qs.escape(this.word) + '/language/' + lang,
    this.method = 'GET'  
    
    this.getHttpOptions = function() {
        return {
            'host': this.host,
            'path': this.path,
            'method': this.method 
        };
    }
}  

module.exports = ForvoHttpOptions;