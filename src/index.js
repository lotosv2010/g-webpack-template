import '@/index.css';
import '@/index.less';
import '@/index.scss';
import '@js/student';
import '@js/jq';
import '@js/lodash';
import '@ts/index.ts';
import '@js/img';
import '@js/fetch';

export const data = {
  "key": "webpack",
  "path": "/",
  "title": "Home",
  "lang": "en-US",
};

console.log('data:', data);

// 箭头函数
const fn = (a,b) => {
  console.log('this is function');
  return a + b;
};
const sum = fn(1, 2);
console.log('sum', sum);
console.log(fn(3, 4));

// 类
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}

const person = new Person('John', 30);
person.sayHello();
console.log(person.name);

// 装饰器
function log(target){
  console.log(target);
}
@log
class Animal {
  constructor(name) {
    this.name = name;
  }
}
const a = new Animal('cat');
console.log(a);

// DefinePlugin
console.log('IS_PRODUCTION', IS_PRODUCTION);

// 懒加载
import(
  /* webpackChunkName: "lazy-load" */ // 魔法注释
  './js/lazy-load'
).then(({ name, getName}) => {
  console.log('Lazy loaded module', name, getName());
});
