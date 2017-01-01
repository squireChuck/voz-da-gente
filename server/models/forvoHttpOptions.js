var envConfig = require('../config/config');
var qs = require('querystring');

// Construct the http options needed to hit the Forvo web API.
// The args specify which parts of the api we can currently vary in our app, 
//  e.g. we can easily hit the Forvo api with different words or langs.
function ForvoHttpOptions(word, lang) {
    this.word = word;
    this.host = 'apifree.forvo.com';
    // min-pronounciations over 5000 arbitrarily chosen - didn't want the list overwhelmingly long
    this.langListPath = '/key/' + envConfig.FORVO_API_KEY + '/format/json/action/language-list/order/name/language/en/min-pronunciations/5000';
    this.wordPath = '/key/' + envConfig.FORVO_API_KEY + '/format/json/action/word-pronunciations/word/' + qs.escape(this.word) + '/language/' + lang;
    this.method = 'GET';
    
    
    this.getWordHttpOptions = function() {
        return {
            'host': this.host,
            'path': this.wordPath,
            'method': this.method 
        };
    };

    this.getLangListHttpOptions = function() {
        return {
            'host': this.host,
            'path': this.langListPath,
            'method': this.method 
        };
    };
}  

module.exports = ForvoHttpOptions;