var ocrService = require('../services/ocrService');

module.exports = function(app) {

    app.get('/voz/api/sampleImage', function(req, res) {
        // Sample image on server...
        var sampleImage = 'sampleImages/nicolau-crop.jpg';

        ocrService.getTextFromImage(sampleImage)
            .then(result => res.send(result.text));
    });

    app.get('/voz/sampleApi/phrase', function(req, res) {

    });
    
    app.get('/voz/api/samplePhrase', function(req, res) {
        // Sample phrases
        var samplePhrases = [
            {
                'phrase': 'Eu vou comer agora mesmo', 
                'lang': 'pt'
            }, 
            {
                'phrase': 'Por que trabalho hoje', 
                'lang': 'pt'
            }, 
            {
                'phrase': 'How are you today', 
                'lang': 'en'
            },
            {
                'phrase': 'Everything is awesome', 
                'lang': 'en'
            }, 
            {
                'phrase': 'You rock', 
                'lang': 'en'
            }
        ];

        // Return random sample phrase.
        res.send(samplePhrases[Math.floor(Math.random() * samplePhrases.length)]);
    });
};