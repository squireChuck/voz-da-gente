//var bodyParser = require('body-parser');
var ForvoHttpOptions = require('../models/forvoHttpOptions');
var forvoService = require('../services/forvoService');

module.exports = function(app) {
    // TODO Use body-parser once we add POST features.
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({extended: true}));

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