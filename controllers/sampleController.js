var gVisionService = require('../services/gVisionService');

module.exports = function(app) {

    app.get('/voz/api/sampleImage', function(req, res) {
        // Sample image on server...
        var sampleImage = 'sampleImages/nicolau1.jpg';

        gVisionService.detectText(sampleImage, 
            function (err, text) {
                if (err) {
                    console.log('Call to goog failed');
                    console.log(err);
                    res.send({'msg' : 'No luck!!!'});
                    return;
                }

                //console.log('Found text: ' + text[0].desc + ' for ' + sampleImage);
                console.log('Found some text for ' + sampleImage);
                console.log(text[0].desc.substring(0, 100));
                res.send({'text' : text[0].desc}); // Send found labels.

                return;
            });
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
        ]

        // Return random sample phrase.
        res.send(samplePhrases[Math.floor(Math.random() * samplePhrases.length)]);
    });
}