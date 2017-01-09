var Tesseract = require('tesseract.js')

function getTextFromImage(myImage) {
    return new Promise((resolve, reject) => {
        Tesseract.recognize(myImage, {lang: 'por'})
            .then(function(result) {
                console.log(result);
                resolve(JSON.stringify(result));
            });
    });
}

module.exports = { 'getTextFromImage' : getTextFromImage };