var Tesseract = require('tesseract.js')

function getTextFromImage(myImage) {
    return new Promise((resolve, reject) => {
        console.log(myImage);
        Tesseract.recognize(myImage, 'por')
            .progress(function(message){console.log('progress is: ', message)})
            .then(function(result) {
                console.log(result.text);
                resolve(result);
            });
    });
}

module.exports = { 'getTextFromImage' : getTextFromImage };