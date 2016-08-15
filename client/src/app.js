import {HttpClient} from '../scripts/aurelia-http-client.js';

export class App {
  constructor() {
    this.heading = "Voz da gente";
    this.phrase = '';
    this.listOfForvoObjs = [];

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
    if (this.phrase) {
      let client = new HttpClient();
      client.get('http://localhost:3000/voz/api/phrase?phrase=' + this.phrase + '&lang=pt')
        .then(data => {
          console.log(JSON.parse(data.response));
          this.listOfForvoObjs = JSON.parse(data.response);
        });
      this.phrase = '';
    }
  }
}
