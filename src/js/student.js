import utils from '@js/utils';

console.log(utils);

// es6
class Student {
  constructor(name) {
    this.name = name;
  }
}

function *gen() {
  yield 1;
}
const g = gen();
console.log(g.next());

// es7 
const str = 'webpack';
console.log(str.includes('p'));