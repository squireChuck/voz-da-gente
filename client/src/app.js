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

    // this.todos = [];
    // this.todoDescription = '';
  }

  // addTodo() {
  //   if (this.todoDescription) {
  //     this.todos.push(new Todo(this.todoDescription));
  //     this.todoDescription = '';
  //   }
  // }

  // removeTodo(todo) {
  //   let index = this.todos.indexOf(todo);
  //   if (index !== -1) {
  //     this.todos.splice(index, 1);
  //   }
  // }

  // Return set of countries from a list of forvoObjs
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
    console.log('In file method...');
    this.testMethod();
    if (this.userImages) {
      var imgArrBuff;
      var fileReader = new FileReader();
      let client = new HttpClient();
      this.phrase = "test3";

      // Possible solution to this problem
      // http://stackoverflow.com/questions/34495796/javascript-promises-with-filereader
      this.makeFileRequest('http://localhost:3000/voz/api/imageText', this.userImages[0])
        .then(
          (result) => { 
            console.log("returned a result!!!"); 
            console.log(result)}, 
          (error) => { 
            console.log("nooooo broke it all"); });

      fileReader.onload = function () {
          this.phrase = "test1";
          // Read in file    
          imgArrBuff = fileReader.result;

          // Encode an array buffer as base 64 string.
          var binary = '';
          var bytes = new Uint8Array( imgArrBuff );
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
              binary += String.fromCharCode( bytes[ i ] );
          }
          var base64String = window.btoa( binary );
          // End - encode an array buffer as base 64 string.
          
          client.post('http://localhost:3000/voz/api/imageText', {'userImage' : base64String})
            .then(data => {
              this.phrase = JSON.parse(data.response).text;
              console.log('phrase is...');
              console.log(this.phrase.substring(0,100));
            });
           this.phrase = "test2"; 

      };
      this.phrase = "test4";
      fileReader.readAsArrayBuffer(this.userImages[0]);
    }
    console.log('Outta file method...');
  }

  makeFileRequest(url, fileToUpload) {
    console.log("i'm in the place!!!!");
  }

  // Encode an array buffer as base 64 string.
  // http://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
  // function _arrayBufferToBase64( buffer ) {
  //   var binary = '';
  //   var bytes = new Uint8Array( buffer );
  //   var len = bytes.byteLength;
  //   for (var i = 0; i < len; i++) {
  //       binary += String.fromCharCode( bytes[ i ] );
  //   }
  //   return window.btoa( binary );
  // }
}
