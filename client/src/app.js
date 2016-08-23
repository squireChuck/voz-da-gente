import {HttpClient} from '../scripts/aurelia-http-client.js';

export class App {
  constructor() {
    console.log('constructing app...');
    this.heading = "Voz da gente";
    this.phrase = 'comer dizer';
    this.userPhrase = '';
    this.listOfForvoObjs = [];
    this.langList = [];
    this.selectedLang = 'pt'; // easy for my learning. :)
    this.filterableCountries = [];

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
}
