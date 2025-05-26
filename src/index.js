import '@/index.css';
import '@/index.less';
import '@/index.scss';
import '@js/student';
import '@js/teacher';
import '@js/jq';
import '@js/lodash';
import '@ts/index.ts';
import '@js/img';
import '@js/fetch';
import '@js/hot';
import utils from '@js/utils';

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
  /* webpackPreload: true */
  /* webpackChunkName: "lazy-load" */ // 魔法注释
  './js/lazy-load'
).then(({ name, getName}) => {
  console.log('Lazy loaded module', name, getName());
});

// common.js
console.log(utils);

// 模块热替换
if (import.meta.webpackHot) {
  console.log('Hot Module Replacement Enabled.', import.meta.webpackHot);
  import.meta.webpackHot.accept('./js/hot.js', () => {
    console.log('Accepting the updated utils module!');
  });
}