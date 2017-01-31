import {HttpClient} from '../scripts/aurelia-http-client.js';

export class App {
  constructor() {
    console.log('constructing app...');
    this.heading = "Voz da gente";
    this.phrase = '';
    this.userPhrase = '';
    this.foundWords = '';
    this.listOfForvoObjs = [];
    this.langList = [];
    this.selectedLang = 'pt'; // Set default lang in dropdown.
    this.filterableCountries = [];
    this.userImages = null;
    
    this.isFetchRecordingsEnabled = true;

    // Enable/disable buttons if the external api's are config'd correctly. 
    this.isExternalServiceEnabled('forvo')
      .then(data => {
        this.isForvoEnabled = JSON.parse(data.response).isEnabled;
      });

    this.isExternalServiceEnabled('googleVision')
      .then(data => {
        this.isGoogleVisionEnabled = JSON.parse(data.response).isEnabled;
      });

    this.getLangList();
  }

  /*
   * Return set of countries from a list of forvoObjs
   */
  getCountryListFromForvoObj(forvoObjs, currentListOfCountries) {

    // Find the forvo objects that have properties, which are the only ones
    // we could get countries from.
    var forvoObjsWithCountries = forvoObjs.filter(function(forvoObjToFilter) {
      return forvoObjToFilter.props && (forvoObjToFilter.props.length > 0); 
    });

    // Collect the countries from the forvo objects.
    var returnList = forvoObjsWithCountries.map(
      function (forvoObj) {    
          return forvoObj.props;
    }).reduce(function(a, b) {
        return a.concat(b);
    }, []).map(
      function(forvoProp) {
        return forvoProp.country;
    });

    // Sort the return list, making it easy to use in the drop down.
    returnList.sort(
      function (country1, country2) {
        return country1.localeCompare(country2); 
    });

    // Set ensures we only have 1 of each country.
    return new Set([...returnList, ...currentListOfCountries]);
  }

  /*
   * Make a request to parse the entered phrase for the selected language.
   */
  getForvos() {
    if (this.phrase && this.selectedLang) {
      let client = new HttpClient();
      client.get('http://localhost:3000/voz/api/phrase?phrase=' + 
        encodeURI(this.phrase) + 
        '&lang=' + this.selectedLang + 
        '&isFetchRecordingsEnabled=' + this.isFetchRecordingsEnabled)
        .then(data => {
          this.listOfForvoObjs = JSON.parse(data.response); 

          // Let the user filter by the countries found for the words returned. 
          this.filterableCountries = this.getCountryListFromForvoObj(this.listOfForvoObjs, this.filterableCountries);
        });
      this.userPhrase = this.phrase;
      this.phrase = '';
    }
  }

  /*
   * The list of languages a user can use to process their language.
   */ 
  getLangList() {
    let client = new HttpClient();
    client.get('http://localhost:3000/voz/api/langs')
      .then(data => {
        this.langList = JSON.parse(data.response).langs;
        this.langList.sort(
          function (lang1, lang2) {
            return lang1.langName.localeCompare(lang2.langName); 
          });
      });
  }

  /*
   * Get the properties for a single word. 
   */
  getPropsForWord(forvoObj) {
    var word = forvoObj.word;

    if (word && this.selectedLang) {
      let client = new HttpClient();
      client.get('http://localhost:3000/voz/api/word?word=' + encodeURI(word) + 
          '&lang=' + this.selectedLang)
        .then(data => {
          var forvoObjectResponse = JSON.parse(data.response)[0]; 
          forvoObj.props = forvoObjectResponse.props;

          // Let the user filter by the countries found for the words returned. 
          this.filterableCountries = this.getCountryListFromForvoObj(this.listOfForvoObjs, this.filterableCountries);
        });
    }
  }

  /*
   * Let the user get a sample phrase for a quick demo of what the app will do.
   */
  getSamplePhrase() {
    let client = new HttpClient();
    client.get('http://localhost:3000/voz/api/samplePhrase')
      .then(data => {
        this.phrase = JSON.parse(data.response).phrase;
        this.selectedLang = JSON.parse(data.response).lang;
      });
  }  

  /* 
   * Let user upload image to process its text into something we can hit Forvo with.
   */
  getTextFromImage() {
    if (this.userImages) {
      // Possible solution to this problem
      // http://stackoverflow.com/questions/34495796/javascript-promises-with-filereader
      this.makeFileRequest('http://localhost:3000/voz/api/imageText', this.userImages[0])
        .then(
          (result) => { 
            console.log("returned a result!!!"); 
            this.phrase = result;},
          (error) => { 
            console.log("nooooo everything's broken and the sky's falliiiiiing!!1!!"); 
        });
    }
  }

  /*
   * Check if features provided by external services are enabled.
   */ 
  isExternalServiceEnabled(serviceToCheck) {
    let client = new HttpClient();
    return client.get('http://localhost:3000/voz/api/external/' + serviceToCheck + '/isEnabled');
  }

  /*
   * Helper functions for app.
   */

  /*
   * Send a single file to the specified url.
   */
  makeFileRequest(url, fileToUpload) {

    var arrayBufferToBase64Func = this.arrayBufferToBase64;

    return new Promise((resolve, reject) => {
      var imgArrBuff;
      var fileReader = new FileReader();
      let client = new HttpClient();

      fileReader.onload = function () {

        // Read in file    
        imgArrBuff = fileReader.result;

        // Convert to base64 string for Google Vision.
        var base64String = arrayBufferToBase64Func(imgArrBuff);
        
        // Request to get text from image.
        client.post(url, {'userImage' : base64String})
          .then(data => {
            var phrase = JSON.parse(data.response).text;
            console.log('phrase is...');
            console.log(phrase.substring(0,100));

            resolve(phrase);
          }).catch(function() { 
            console.log("Messed up in the file upload... :( ");
            reject("Messed up in the file upload... :( ");
          });
        };

        fileReader.readAsArrayBuffer(fileToUpload);
      });
  }

  /*
   * Encode an array buffer as base 64 string.
   * http://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
   */
  arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }
}
