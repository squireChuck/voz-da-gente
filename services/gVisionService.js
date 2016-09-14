// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/gcloud-node/#/docs/google-cloud/latest/guides/authentication

// Instantiate a vision client
var vision = require('@google-cloud/vision')({
  projectId: 'voz-vision',

  // The path to your key file:
  keyFilename: './config/googleVisionKeyfile.json'
});

/**
 * Uses the Vision API to detect labels in the given file.
 */
function detectText (inputFile, callback) {
  // Make a call to the Vision API to detect the labels
  vision.detectText(inputFile, { verbose: true }, function(err, text) {
    if (err) {
      return callback(err);
    }
    //console.log('result:', JSON.stringify(text, null, 2));
    callback(null, text);
  });
}

function getTextFromImage(inputFile, callback) {
  var gVisionRequest = 
    
        {
          "features": [
            {
            "type": "TEXT_DETECTION"
            }
          ],
          "image": {
            "content": inputFile
          }
        }
    ;
  //console.log(JSON.stringify(gVisionRequest));
  vision.annotate(gVisionRequest, function(err, annotations, apiResponse) {
     if (err) {
      return callback(err);
    }

    callback(null, apiResponse.responses);
  });
}

module.exports = { 'detectText' : detectText, 'getTextFromImage' : getTextFromImage };