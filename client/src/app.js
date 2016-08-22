import {HttpClient} from '../scripts/aurelia-http-client.js';

export class App {
  constructor() {
    console.log('constructing app...');
    this.heading = "Voz da gente";
    this.phrase = '';
    this.listOfForvoObjs = [];
    this.langList = [];
    this.selectedLang = 'pt'; // easy for my learning. :)
    
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

  getForvos() {
    if (this.phrase && this.selectedLang) {
      let client = new HttpClient();
      client.get('http://localhost:3000/voz/api/phrase?phrase=' + this.phrase 
          + '&lang=' + this.selectedLang)
        .then(data => {
          this.listOfForvoObjs = JSON.parse(data.response);
        });
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
