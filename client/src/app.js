import {HttpClient} from '../scripts/aurelia-http-client.js';

export class App {
  constructor() {
    console.log('constructing app...');
    this.heading = "Voz da gente";
    this.phrase = '';
    this.userPhrase = '';
    this.listOfForvoObjs = [];
    this.langList = [];
    this.selectedLang = 'pt'; // easy for my learning. :)
    this.filterableCountries = [];
    this.userImages;

    this.getLangList();
  }

  /*
   * Return set of countries from a list of forvoObjs
   */
  getCountryListFromForvoObj(forvoObjs) {
    var returnList = forvoObjs.map(
      function (forvoObj) {
        return forvoObj.props;
    }).reduce(function(a, b) {
        return a.concat(b);
    }, []).map(
      function(forvoProp) {
        return forvoProp.country;
    });

    returnList.sort(
      function (country1, country2) {
        return country1.localeCompare(country2); 
    });

    return new Set(returnList);
  }

  /*
   * Make a request to parse the entered phrase for the selected language.
   */
  getForvos() {
    if (this.phrase && this.selectedLang) {
      let client = new HttpClient();
      client.get('http://localhost:3000/voz/api/phrase?phrase=' + this.phrase 
          + '&lang=' + this.selectedLang)
        .then(data => {
          this.listOfForvoObjs = JSON.parse(data.response);
          
          // Let the user filter by the countries found for the words returned. 
          this.filterableCountries = this.getCountryListFromForvoObj(this.listOfForvoObjs);
        });
      this.userPhrase = this.phrase;
      this.phrase = '';
    }
  }

  /*
   * The list of languages user can process their phrase for.
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
