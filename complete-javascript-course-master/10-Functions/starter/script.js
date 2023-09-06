'use strict';

// const greet = greeting => name => console.log(`${greeting} ${name}`);

// greet('Hey Mr.')('Vamshi');

// const addTax = rate => val => val + val * rate;

// console.log(addTax(0.23)(100));

const poll = {
  question: 'What is your favourite programming language?',
  options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
  // This generates [0, 0, 0, 0]. More in the next section 😃
  answers: new Array(4).fill(0),
  registerNewAnswer() {
    let input =
      prompt(
        this.question + '\n' + this.options.join('\n') + '(Write option number)'
      ) || null;

    if (input === null) {
      return;
    } else {
      input = Number(input);
    }
    if (typeof input === 'number' && input >= 0 && input <= 3)
      this.answers[input]++;
    else alert('Enter numbers between 0 and 3 inclusive');
    this.displayResults('string');
  },
  displayResults(type = 'array') {
    if (type === 'array') {
      console.log(this.answers);
    } else if (type === 'string') {
      console.log(`Poll results are ${this.answers.join(', ')}`);
    } else {
      alert('Unsupported type');
    }
  },
};

document
  .querySelector('.poll')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));

const test1 = {
  answers: [5, 2, 3],
};
const test2 = {
  answers: [1, 5, 3, 9, 6, 1],
};
const results = poll.displayResults;

const t1 = results.bind(test1);
const t2 = results.bind(test2);

t1('string');
t2('string');

(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';

  document.body.addEventListener('click', function () {
    header.style.color = 'blue'; // Header will be present in closure, so that whenever we click on body of the page, its color is changed to blue.
  });
})();
