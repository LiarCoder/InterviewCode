/*
 * @Description: 模拟实现 new 关键字
 * @Version: 0.1.0
 * @Author: LiarCoder
 * @Date: 2021-12-16 22:05:36
 * @LastEditors: LiarCoder
 * @LastEditTime: 2021-12-16 22:49:14
 */

/*
更新：2021年12月16日22:06:50
> 参考：[实例对象与 new 命令 - JavaScript 教程 - 网道](https://wangdoc.com/javascript/oop/new.html#new-命令的原理)
> 参考：[【微信公众号：三分钟学前端 2021-11-29 08:30】字节：模拟实现 new 操作符](https://mp.weixin.qq.com/s/4mzbpYh4Rc_iT498LXPsWA)
> 参考：[New 操作符的原理 | HZFE - 剑指前端 Offer](http://febook.hzfe.org/awesome-interview/book2/js-new)
> 参考：[Arguments 对象 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)
> 参考：[Object.create() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
*/

/**
 * @description: 模拟实现 new 关键字
 * @param {*} 我们通过 arguments 关键字取出参数，我们模拟的 new 关键字的第一个参数就是构造函数本身
 * @return {Object} 返回一个构造之后的实例对象
 */

function _new() {
  // 获取构造函数本身，注意 arguments 对象是类数组对象，不能直接调用 shift()，而要借助 call
  // 注意下面这步并没有将 arguments 对象变为数组对象
  let constructor = Array.prototype.shift.call(arguments);

  // 利用 Object.create() 函数生成一个空对象，且该对象的 __proto__ 指向构造函数的 prototype
  // 注意这里不要直接用 xxx.__proto__ = constructor.prototype 的方式来绑定原型，那样会很耗费性能
  let context = Object.create(constructor.prototype);

  // 调用构造函数，使构造函数里的语句执行，注意 this 的指向是刚才我们创建的那个空对象，
  // 参数则是传入 _new 函数的除去第一个参数外的剩余参数
  let result = constructor.apply(context, arguments);

  // 如果构造函数执行返回的结果 result 是对象类型，那么就直接将该结果返回，否则返回上面生成的实例对象 context
  return result instanceof Object ? result : context;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

let json = new Person("json", 21);
let liar = _new(Person, "liar", 22);

console.log(json);
console.log(liar);

/*
$ node new.js
Person { name: 'json', age: 21 }
Person { name: 'liar', age: 22 }
*/
