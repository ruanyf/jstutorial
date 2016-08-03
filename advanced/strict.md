---
title: 严格模式
layout: page
category: advanced
date: 2013-01-11
modifiedOn: 2013-01-25
---

除了正常的运行模式，JavaScript还有第二种运行模式：“严格模式”（strict mode）。顾名思义，这种模式采用更加严格的JavaScript语法。

同样的代码，在”正常模式“和”严格模式“中，可能会有不一样的运行结果。一些在"正常模式"下可以运行的语句，在"严格模式"下将不能运行。掌握这些内容，有助于更细致深入地理解JavaScript，让你变成一个更好的程序员。

## 设计目的

设立”严格模式“的目的，主要有以下几个。

- 明确禁止一些不合理、不严谨的语法，减少JavaScript的一些怪异行为。
- 增加更多报错的场合，消除代码运行的一些不安全之处，保证代码运行的安全。
- 提高编译器效率，增加运行速度。
- 为未来新版本的JavaScript做好铺垫。

“严格模式”体现了JavaScript更合理、更安全、更严谨的发展方向。

## 启用方法

进入“严格模式”的标志，是一行字符串`use strict`。

```javascript
'use strict';
```

老版本的浏览器会把它当作一行普通字符串，加以忽略。新版本的浏览器就会进入严格模式。

“严格模式”可以用于整个脚本，也可以只用于单个函数。

**（1） 针对整个脚本文件**

将`use strict`放在脚本文件的第一行，则整个脚本都将以“严格模式”运行。如果这行语句不在第一行就无效，整个脚本会以“正常模式”运行。(严格地说，只要前面不是产生实际运行结果的语句，`use strict`可以不在第一行，比如直接跟在一个空的分号后面，或者跟在注释后面。)

```html
<script>
  'use strict';
  console.log('这是严格模式');
</script>

<script>
  console.log('这是正常模式');
</script>
```

上面的代码表示，一个网页文件中依次有两段JavaScript代码。前一个`<script>`标签是严格模式，后一个不是。

如果字符串`use strict`出现在代码中间，则不起作用，即严格模式必须从代码一开始就生效。

**（2）针对单个函数**

`use strict`放在函数体的第一行，则整个函数以“严格模式”运行。

```javascript
function strict() {
  'use strict';
  return '这是严格模式';
}

function strict2() {
  'use strict';
  function f() {
    return '这也是严格模式';
  }
  return f();
}

function notStrict() {
  return '这是正常模式';
}
```

**（3）脚本文件的变通写法**

两个不同模式的脚本合并成一个文件，如果严格模式的脚本在前，则合并后的脚本都是”严格模式“；如果正常模式的脚本在前，则合并后的脚本都是”正常模式“。总之，这两种情况下，合并后的结果都是不正确的。

正确的做法是，使用前面第二种方法，将整个脚本文件放在一个立即执行的匿名函数之中。

```javascript
(function () {
  'use strict';
  // some code here
})();
```

## 显式报错

严格模式使得JavaScript的语法变得更严格，更多的操作会显式报错。其中有些操作，在正常模式下只会默默地失败，不会报错。

### 只读属性不可写

严格模式下，设置字符串的`length`属性，会报错。

```javascript
'use strict';
'abc'.length = 5;
// TypeError: Cannot assign to read only property 'length' of string 'abc'
```

这是因为`length`是只读属性。

```javascript
var str = Object('abc');
Object.getOwnPropertyDescriptor(str, 'length')
// Object {
//   value: 3,
//   writable: false,
//   enumerable: false,
//   configurable: false
// }
```

严格模式下，对只读属性赋值，或者删除不可配置（nonconfigurable）属性都会报错。

```javascript
// 对只读属性赋值会报错
'use strict';
var o = {};

Object.defineProperty(o, 'a', {
  value: 37,
  writable: false
});

o.a = 123;
// TypeError: Cannot assign to read only property 'a' of object #<Object>

// 删除不可配置的属性会报错
'use strict';
var o = Object.defineProperty({}, 'p', {
  value: 1,
  configurable: false
});

delete o.p
// TypeError: Cannot delete property 'p' of #<Object>
```

### 只设置了赋值器的属性不可写

严格模式下，对一个只设置了赋值器（getter）的属性赋值，会报错。

```javascript
'use strict';

var o = {
  get v() { return 1; }
};

o.v = 2; // 报错
```

### 禁止扩展的对象不可扩展

严格模式下，对禁止扩展的对象添加新属性，会报错。

```javascript
'use strict';

var o = {};
Object.preventExtensions(o);
o.v = 1; // 报错
```

### eval、arguments不可用作标识名

严格模式下，使用`eval`或者`arguments`作为标识名，将会报错。

下面的语句都会报错。

```javascript
'use strict';
var eval = 17;
var arguments = 17;
var obj = { set p(arguments) { } };
try { } catch (arguments) { }
function x(eval) { }
function arguments() { }
var y = function eval() { };
var f = new Function('arguments', "'use strict'; return 17;");
// SyntaxError: Unexpected eval or arguments in strict mode
```

### 函数不能有重名的参数

正常模式下，如果函数有多个重名的参数，可以用`arguments[i]`读取。严格模式下，这属于语法错误。

```javascript
function f(a, a, b) { // 语法错误
  'use strict';
  return a + b;
}
```

### 禁止八进制的前缀0表示法

正常模式下，整数的第一位如果是`0`，表示这是八进制数，比如`0100`等于十进制的64。严格模式禁止这种表示法，整数第一位为`0`，将报错。

```javascript
"use strict";
var n = 0100; // SyntaxError
```

## 增强的安全措施

严格模式增强了安全保护，从语法上防止了一些不小心会出现的错误。

### 全局变量显式声明

在正常模式中，如果一个变量没有声明就赋值，默认是全局变量。严格模式禁止这种用法，全局变量必须显式声明。

```javascript
'use strict';

v = 1; // 报错，v未声明

for (i = 0; i < 2; i++) { // 报错，i未声明
  // ...
}

function f() {
  x = 123;
}
f() // 报错，未声明就创建一个全局变量
```

因此，严格模式下，变量都必须先用`var`命令声明，然后再使用。

### 禁止this关键字指向全局对象

正常模式下，函数内部的`this`可能会指向全局对象，严格模式禁止这种用法，避免无意间创造全局变量。

```javascript
// 正常模式
function f() {
  console.log(this === window);
}
f() // true

// 严格模式
function f() {
  'use strict';
  console.log(this === undefined);
}
f() // true
```

这种限制对于构造函数尤其有用。使用构造函数时，有时忘了加`new`，这时`this`不再指向全局对象，而是报错。

```javascript
function f() {
  'use strict';
  this.a = 1;
};

f();// 报错，this未定义
```

严格模式下，函数直接调用时（不使用`new`调用），函数内部的`this`表示`undefined`，因此可以用`call`、`apply`和`bind`方法，将任意值绑定在`this`上面。

```javascript
'use strict';

function fun() {
  return this;
}

fun() //undefined
fun.call(2) // 2
fun.apply(null) // null
fun.call(undefined) // undefined
fun.bind(true)() // true
```

### 禁止使用fn.callee、fn.caller

函数内部不得使用`fn.caller`、`fn.arguments`，否则会报错。这意味着不能在函数内部得到调用栈了。

```javascript
function f1() {
  'use strict';
  f1.caller;    // 报错
  f1.arguments; // 报错
}

f1();
```

### 禁止使用arguments.callee、arguments.caller

`arguments.callee`和`arguments.caller`是两个历史遗留的变量，从来没有标准化过，现在已经取消了。正常模式下调用它们没有什么作用，但是不会报错。严格模式明确规定，函数内部使用`arguments.callee`、`arguments.caller`将会报错。

```javascript
'use strict';
var f = function() {
  return arguments.callee;
};

f(); // 报错
```

### 禁止删除变量

严格模式下无法删除变量，如果使用`delete`命令删除一个变量，会报错。只有对象的属性，且属性的描述对象的`configurable`属性设置为`true`，才能被`delete`命令删除。

```javascript
'use strict';
var x;
delete x; // 语法错误

var o = Object.create(null, {
  x: {
    value: 1,
    configurable: true
  }
});
delete o.x; // 删除成功
```

## 静态绑定

JavaScript语言的一个特点，就是允许“动态绑定”，即某些属性和方法到底属于哪一个对象，不是在编译时确定的，而是在运行时（runtime）确定的。

严格模式对动态绑定做了一些限制。某些情况下，只允许静态绑定。也就是说，属性和方法到底归属哪个对象，必须在编译阶段就确定。这样做有利于编译效率的提高，也使得代码更容易阅读，更少出现意外。

具体来说，涉及以下几个方面。

### 禁止使用with语句

严格模式下，使用`with`语句将报错。因为`with`语句无法在编译时就确定，某个属性到底归属哪个对象，从而影响了编译效果。

```javascript
'use strict';
var v  = 1;

with (o) { // SyntaxError
  v = 2;
}
```

### 创设eval作用域

正常模式下，JavaScript语言有两种变量作用域（scope）：全局作用域和函数作用域。严格模式创设了第三种作用域：`eval`作用域。

正常模式下，`eval`语句的作用域，取决于它处于全局作用域，还是函数作用域。严格模式下，`eval`语句本身就是一个作用域，不再能够在其所运行的作用域创设新的变量了，也就是说，`eval`所生成的变量只能用于`eval`内部。

```javascript
(function () {
  'use strict';
  var x = 2;
  console.log(eval('var x = 5; x')) // 5
  console.log(x) // 2
})()
```

上面代码中，由于`eval`语句内部是一个独立作用域，所以内部的变量`x`不会泄露到外部。

注意，如果希望`eval`语句也使用严格模式，有两种方式。

```javascript
// 方式一
function f1(str){
  'use strict';
  return eval(str);
}
f1('undeclared_variable = 1'); // 报错


// 方式二
function f2(str){
  return eval(str);
}
f2('"use strict";undeclared_variable = 1')  // 报错
```

上面两种写法，`eval`内部使用的都是严格模式。

### arguments不再追踪参数的变化

变量`arguments`代表函数的参数。严格模式下，函数内部改变参数与`arguments`的联系被切断了，两者不再存在联动关系。

```javascript
function f(a) {
  a = 2;
  return [a, arguments[0]];
}

f(1); // 正常模式为[2, 2]

function f(a) {
  "use strict";	
  a = 2;
  return [a, arguments[0]];
}

f(1); // 严格模式为[2, 1]
```

上面代码中，改变函数的参数，不会反应到`arguments`对象上来。

## 向下一个版本的JavaScript过渡

JavaScript语言的下一个版本是ECMAScript 6，为了平稳过渡，严格模式引入了一些ES6语法。

### 非函数代码块不得声明函数

JavaScript的新版本ES6会引入“块级作用域”。为了与新版本接轨，严格模式只允许在全局作用域或函数作用域声明函数。也就是说，不允许在非函数的代码块内声明函数。

```javascript
'use strict';
if (true) {
  function f1() { } // 语法错误
}

for (var i = 0; i < 5; i++) {
  function f2() { } // 语法错误
}
```

上面代码在`if`代码块和`for`代码块中声明了函数，在严格模式下都会报错。

### 保留字

为了向将来JavaScript的新版本过渡，严格模式新增了一些保留字：implements, interface, let, package, private, protected, public, static, yield。

使用这些词作为变量名将会报错。

```javascript
function package(protected) { // 语法错误
  'use strict';
  var implements; // 语法错误
}
```

此外，ECMAscript第五版本身还规定了另一些保留字（`class`, `enum`, `export`, `extends`, `import`, `super`），以及各大浏览器自行增加的`const`保留字，也是不能作为变量名的。

## 参考链接

- MDN, [Strict mode](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode)
- Dr. Axel Rauschmayer, [JavaScript: Why the hatred for strict mode?](http://www.2ality.com/2011/10/strict-mode-hatred.html)
- Dr. Axel Rauschmayer，[JavaScript’s strict mode: a summary](http://www.2ality.com/2011/01/javascripts-strict-mode-summary.html)
- Douglas Crockford, [Strict Mode Is Coming To Town](http://www.yuiblog.com/blog/2010/12/14/strict-mode-is-coming-to-town/)
- [JavaScript Strict Mode Support](http://java-script.limewebs.com/strictMode/test_hosted.html)
