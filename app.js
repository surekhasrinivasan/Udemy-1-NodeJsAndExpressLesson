require('./instantHello');
var goodbye = require('./talk/goodbye');
var talk = require('./talk');

var question = require('./talk/question');

talk.intro();
talk.hello('Surekha');

var answer = question.ask("What is the meaning of Life?");
console.log(answer);

goodbye();