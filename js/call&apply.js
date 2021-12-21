/*
 * @Description: 模拟实现call和apply函数
 * @Version: 0.1.0
 * @Author: LiarCoder
 * @Date: 2021-12-21 10:48:37
 * @LastEditors: LiarCoder
 * @LastEditTime: 2021-12-21 12:36:51
 */

/*
更新：2021年12月21日10:54:42
> 参考：[【微信公众号：三分钟学前端 2021-11-30 08:30】解析 call/apply 原理，并手写 call/apply 实现](https://mp.weixin.qq.com/s/sDMq5Fa_kHDa1-W2EREdSw)
> 参考：[Function.prototype.apply() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
> 参考：[Function.prototype.call() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
> 参考：[剩余参数 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)
*/

/**
 * @description: 模拟call函数
 * @param {*} context 需要被绑定的上下文 this 对象
 * @param {Array} args 传入原函数的参数
 * @return {*} 原函数运行之后的结果
 */

Function.prototype._call = function (context, ...args) {
  // 如果传入的上下文对象是 null 或 undefined，则在默认绑定的 this 对象就是 global（Node环境下）
  // 或 window（浏览器环境下），如果是基本数据类型，那么就会被自动转换为对应的包装对象。
  // 也就是说，要保证后续使用的 context 是一个对象类型
  context = context ? Object(context) : global;

  // 将原函数设置为 context 的一个属性 func（这个属性名可以随意取，但是尽量不要和某些特定的属性重复）
  context.func = this;

  // 通过 context 调用原函数，这样就能保证原函数中的 this 是我们指定的 context，
  // 同时，将传入原函数的参数原样传给 func
  let result = context.func(...args);

  // 因为 func 是我们特意加在 context 对象身上的，所以用完之后需要删除
  delete context.func;

  // 最后将原函数运行的结果作为返回值返回
  return result;
};

/**
 * @description: 模拟call函数
 * @param {*} context 需要被绑定的上下文 this 对象
 * @param {Array} args 传入原函数的参数
 * @return {*} 原函数运行之后的结果
 */

Function.prototype._apply = function (context, args) {
  // apply 的原理和 call 差不多，唯一的区别就是，apply传入参数的方式是通过一个数组传递
  context = context ? Object(context) : global;
  context.func = this;

  // 注意，我们不能保证调用 apply 时一定传入了某个数组参数，所以需要做一下判断
  let result = args ? context.func(...args) : context.func();
  delete context.func;
  return result;
};

global.name = "global";
let liar = {
  name: "liar",
  age: 21,
};

function sayName() {
  console.log(`my name is ${this.name}, my args are ${[...arguments]}`);
}

sayName._call();
sayName._call(1, 2, 3, 4);
sayName._call(liar, 2, 3, 4);

sayName._apply();
sayName._apply(1, [2, 3, 4]);
sayName._apply(liar, [2, 3, 4]);

/*
$ node call\&apply.js
my name is global, my args are
my name is undefined, my args are 2,3,4
my name is liar, my args are 2,3,4
my name is global, my args are
my name is undefined, my args are 2,3,4
my name is liar, my args are 2,3,4
*/
