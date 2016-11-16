---
title: 对象
layout: page
category: grammar
date: 2012-12-12
modifiedOn: 2014-01-17
---

## 概述

### 生成方法

对象（object）是JavaScript的核心概念，也是最重要的数据类型。JavaScript的所有数据都可以被视为对象。

简单说，所谓对象，就是一种无序的数据集合，由若干个“键值对”（key-value）构成。

```javascript
var o = {
  p: 'Hello World'
};
```

上面代码中，大括号就定义了一个对象，它被赋值给变量`o`。这个对象内部包含一个键值对（又称为“成员”），`p`是“键名”（成员的名称），字符串`Hello World`是“键值”（成员的值）。键名与键值之间用冒号分隔。如果对象内部包含多个键值对，每个键值对之间用逗号分隔。

```javascript
var o = {
  p1: 'Hello',
  p2: 'World'
};
```

对象的生成方法，通常有三种方法。除了像上面那样直接使用大括号生成（`{}`），还可以用`new`命令生成一个Object对象的实例，或者使用`Object.create`方法生成。

```javascript
var o1 = {};
var o2 = new Object();
var o3 = Object.create(null);
```

上面三行语句是等价的。一般来说，第一种采用大括号的写法比较简洁，第二种采用构造函数的写法清晰地表示了意图，第三种写法一般用在需要对象继承的场合。关于第二种写法，详见《标准库》一章的Object对象一节，第三种写法详见《面向对象编程》一章。

### 键名

对象的所有键名都是字符串，所以加不加引号都可以。上面的代码也可以写成下面这样。

```javascript
var o = {
  'p': 'Hello World'
};
```

如果键名是数值，会被自动转为字符串。

```javascript
var o ={
  1: 'a',
  3.2: 'b',
  1e2: true,
  1e-2: true,
  .234: true,
  0xFF: true
};

o
// Object {
//   1: "a",
//   3.2: "b",
//   100: true,
//   0.01: true,
//   0.234: true,
//   255: true
// }
```

但是，如果键名不符合标识名的条件（比如第一个字符为数字，或者含有空格或运算符），也不是数字，则必须加上引号，否则会报错。

```javascript
var o = {
  '1p': "Hello World",
  'h w': "Hello World",
  'p+q': "Hello World"
};
```

上面对象的三个键名，都不符合标识名的条件，所以必须加上引号。

注意，JavaScript的保留字可以不加引号当作键名。

```javascript
var obj = {
  for: 1,
  class: 2
};
```

### 属性

对象的每一个“键名”又称为“属性”（property），它的“键值”可以是任何数据类型。如果一个属性的值为函数，通常把这个属性称为“方法”，它可以像函数那样调用。

```javascript
var o = {
  p: function (x) {
    return 2 * x;
  }
};

o.p(1)
// 2
```

上面的对象就有一个方法`p`，它就是一个函数。

对象的属性之间用逗号分隔，最后一个属性后面可以加逗号（trailing comma），也可以不加。

```javascript
var o = {
  p: 123,
  m: function () { ... },
}
```

上面的代码中`m`属性后面的那个逗号，有或没有都不算错。

属性可以动态创建，不必在对象声明时就指定。

```javascript
var obj = {};
obj.foo = 123;
obj.foo // 123
```

上面代码中，直接对`obj`对象的`foo`属性赋值，结果就在运行时创建了`foo`属性。

### 对象的引用

如果不同的变量名指向同一个对象，那么它们都是这个对象的引用，也就是说指向同一个内存地址。修改其中一个变量，会影响到其他所有变量。

```javascript
var o1 = {};
var o2 = o1;

o1.a = 1;
o2.a // 1

o2.b = 2;
o1.b // 2
```

上面代码中，`o1`和`o2`指向同一个对象，因此为其中任何一个变量添加属性，另一个变量都可以读写该属性。

此时，如果取消某一个变量对于原对象的引用，不会影响到另一个变量。

```javascript
var o1 = {};
var o2 = o1;

o1 = 1;
o2 // {}
```

上面代码中，`o1`和`o2`指向同一个对象，然后`o1`的值变为1，这时不会对`o2`产生影响，`o2`还是指向原来的那个对象。

但是，这种引用只局限于对象，对于原始类型的数据则是传值引用，也就是说，都是值的拷贝。

```javascript
var x = 1;
var y = x;

x = 2;
y // 1
```

上面的代码中，当`x`的值发生变化后，`y`的值并不变，这就表示`y`和`x`并不是指向同一个内存地址。

### 表达式还是语句？

对象采用大括号表示，这导致了一个问题：如果行首是一个大括号，它到底是表达式还是语句？

```javascript
{ foo: 123 }
```

JavaScript引擎读到上面这行代码，会发现可能有两种含义。第一种可能是，这是一个表达式，表示一个包含`foo`属性的对象；第二种可能是，这是一个语句，表示一个代码区块，里面有一个标签`foo`，指向表达式`123`。

为了避免这种歧义，JavaScript规定，如果行首是大括号，一律解释为语句（即代码块）。如果要解释为表达式（即对象），必须在大括号前加上圆括号。

```javascript
({ foo: 123})
```

这种差异在`eval`语句中反映得最明显。

```javascript
eval('{foo: 123}') // 123
eval('({foo: 123})') // {foo: 123}
```

上面代码中，如果没有圆括号，`eval`将其理解为一个代码块；加上圆括号以后，就理解成一个对象。

## 属性的操作

### 读取属性

读取对象的属性，有两种方法，一种是使用点运算符，还有一种是使用方括号运算符。

```javascript
var o = {
  p: 'Hello World'
};

o.p // "Hello World"
o['p'] // "Hello World"
```

上面代码分别采用点运算符和方括号运算符，读取属性`p`。

请注意，如果使用方括号运算符，键名必须放在引号里面，否则会被当作变量处理。但是，数字键可以不加引号，因为会被当作字符串处理。

```javascript
var o = {
  0.7: 'Hello World'
};

o['0.7'] // "Hello World"
o[0.7] // "Hello World"
```

方括号运算符内部可以使用表达式。

```javascript
o['hello' + ' world']
o[3 + 3]
```

数值键名不能使用点运算符（因为会被当成小数点），只能使用方括号运算符。

```javascript
obj.0xFF
// SyntaxError: Unexpected token
obj[0xFF]
// true
```

上面代码的第一个表达式，对数值键名`0xFF`使用点运算符，结果报错。第二个表达式使用方括号运算符，结果就是正确的。

### 检查变量是否声明

如果读取一个不存在的键，会返回`undefined`，而不是报错。可以利用这一点，来检查一个全局变量是否被声明。

```javascript
// 检查a变量是否被声明
if (a) {...} // 报错

if (window.a) {...} // 不报错
if (window['a']) {...} // 不报错
```

上面的后二种写法之所以不报错，是因为在浏览器环境，所有全局变量都是`window`对象的属性。`window.a`的含义就是读取`window`对象的`a`属性，如果该属性不存在，就返回`undefined`，并不会报错。

需要注意的是，后二种写法有漏洞，如果`a`属性是一个空字符串（或其他对应的布尔值为`false`的情况），则无法起到检查变量是否声明的作用。正确的做法是可以采用下面的写法。

```javascript
if ('a' in window) {
  // 变量 a 声明过
} else {
  // 变量 a 未声明
}
```

### 属性的赋值

点运算符和方括号运算符，不仅可以用来读取值，还可以用来赋值。

```javascript
o.p = 'abc';
o['p'] = 'abc';
```

上面代码分别使用点运算符和方括号运算符，对属性p赋值。

JavaScript允许属性的“后绑定”，也就是说，你可以在任意时刻新增属性，没必要在定义对象的时候，就定义好属性。

```javascript
var o = { p: 1 };

// 等价于

var o = {};
o.p = 1;
```

### 查看所有属性

查看一个对象本身的所有属性，可以使用`Object.keys`方法。

```javascript
var o = {
  key1: 1,
  key2: 2
};

Object.keys(o);
// ['key1', 'key2']
```

### delete命令

`delete`命令用于删除对象的属性，删除成功后返回`true`。

```javascript
var o = {p: 1};
Object.keys(o) // ["p"]

delete o.p // true
o.p // undefined
Object.keys(o) // []
```

上面代码中，`delete`命令删除`o`对象的`p`属性。删除后，再读取`p`属性就会返回`undefined`，而且`Object.keys`方法的返回值中，`o`对象也不再包括该属性。

注意，删除一个不存在的属性，`delete`不报错，而且返回`true`。

```javascript
var o = {};
delete o.p // true
```

上面代码中，`o`对象并没有`p`属性，但是`delete`命令照样返回`true`。因此，不能根据`delete`命令的结果，认定某个属性是存在的，只能保证读取这个属性肯定得到`undefined`。

只有一种情况，`delete`命令会返回`false`，那就是该属性存在，且不得删除。

```javascript
var o = Object.defineProperty({}, 'p', {
  value: 123,
  configurable: false
});

o.p // 123
delete o.p // false
```

上面代码之中，`o`对象的`p`属性是不能删除的，所以`delete`命令返回`false`（关于`Object.defineProperty`方法的介绍，请看《标准库》一章的`Object`对象章节）。

另外，需要注意的是，`delete`命令只能删除对象本身的属性，无法删除继承的属性（关于继承参见《面向对象编程》一节）。

```javascript
var o = {};
delete o.toString // true
o.toString // function toString() { [native code] }
```

上面代码中，`toString`是对象`o`继承的属性，虽然`delete`命令返回`true`，但该属性并没有被删除，依然存在。

最后，`delete`命令不能删除`var`命令声明的变量，只能用来删除属性。

```javascript
var p = 1;
delete p // false
delete window.p // false
```

上面命令中，`p`是`var`命令声明的变量，`delete`命令无法删除它，返回`false`。因为`var`声明的全局变量都是顶层对象的属性，而且默认不得删除。

### in运算符

`in`运算符用于检查对象是否包含某个属性（注意，检查的是键名，不是键值），如果包含就返回`true`，否则返回`false`。

```javascript
var o = { p: 1 };
'p' in o // true
```

在JavaScript语言中，所有全局变量都是顶层对象（浏览器的顶层对象就是`window`对象）的属性，因此可以用`in`运算符判断，一个全局变量是否存在。

```javascript
// 假设变量x未定义

// 写法一：报错
if (x) { return 1; }

// 写法二：不正确
if (window.x) { return 1; }

// 写法三：正确
if ('x' in window) { return 1; }
```

上面三种写法之中，如果`x`不存在，第一种写法会报错；如果`x`的值对应布尔值`false`（比如`x`等于空字符串），第二种写法无法得到正确结果；只有第三种写法，才能正确判断变量`x`是否存在。

`in`运算符的一个问题是，它不能识别对象继承的属性。

```javascript
var o = new Object();
o.hasOwnProperty('toString') // false

'toString' in o // true
```

上面代码中，`toString`方法不是对象`o`自身的属性，而是继承的属性，`hasOwnProperty`方法可以说明这一点。但是，`in`运算符不能识别，对继承的属性也返回`true`。

### for...in循环

`for...in`循环用来遍历一个对象的全部属性。

```javascript
var o = {a: 1, b: 2, c: 3};

for (var i in o) {
  console.log(o[i]);
}
// 1
// 2
// 3
```

下面是一个使用`for...in`循环，提取对象属性的例子。

```javascript
var obj = {
  x: 1,
  y: 2
};
var props = [];
var i = 0;

for (props[i++] in obj);

props // ['x', 'y']
```

`for...in`循环有两个使用注意点。

- 它遍历的是对象所有可遍历（enumerable）的属性，会跳过不可遍历的属性
- 它不仅遍历对象自身的属性，还遍历继承的属性。

请看下面的例子。

```javascript
// name 是 Person 本身的属性
function Person(name) {
  this.name = name;
}

// describe是Person.prototype的属性
Person.prototype.describe = function () {
  return 'Name: '+this.name;
};

var person = new Person('Jane');

// for...in循环会遍历实例自身的属性（name），
// 以及继承的属性（describe）
for (var key in person) {
  console.log(key);
}
// name
// describe
```

上面代码中，`name`是对象本身的属性，`describe`是对象继承的属性，`for...in`循环的遍历会包括这两者。

如果只想遍历对象本身的属性，可以使用`hasOwnProperty`方法，在循环内部判断一下是不是自身的属性。

```javascript
for (var key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(key);
  }
}
// name
```

对象`person`其实还有其他继承的属性，比如`toString`。

```javascript
person.toString()
// "[object Object]"
```

这个`toString`属性不会被`for...in`循环遍历到，因为它默认设置为“不可遍历”，详见《标准库》一章的`Object`对象部分。

一般情况下，都是只想遍历对象自身的属性，所以不推荐使用`for...in`循环。

## with语句

`with`语句的格式如下：

```javascript
with (object) {
  statements;
}
```

它的作用是操作同一个对象的多个属性时，提供一些书写的方便。

```javascript
// 例一
with (o) {
  p1 = 1;
  p2 = 2;
}
// 等同于
o.p1 = 1;
o.p2 = 2;

// 例二
with (document.links[0]){
  console.log(href);
  console.log(title);
  console.log(style);
}
// 等同于
console.log(document.links[0].href);
console.log(document.links[0].title);
console.log(document.links[0].style);
```

注意，`with`区块内部的变量，必须是当前对象已经存在的属性，否则会创造一个当前作用域的全局变量。这是因为`with`区块没有改变作用域，它的内部依然是当前作用域。

```javascript
var o = {};

with (o) {
  x = "abc";
}

o.x // undefined
x // "abc"
```

上面代码中，对象`o`没有属性`x`，所以`with`区块内部对`x`的操作，等于创造了一个全局变量`x`。正确的写法应该是，先定义对象`o`的属性`x`，然后在`with`区块内操作它。

```javascript
var o = {};
o.x = 1;

with (o) {
  x = 2;
}

o.x // 2
```

这是`with`语句的一个很大的弊病，就是绑定对象不明确。

```javascript
with (o) {
  console.log(x);
}
```

单纯从上面的代码块，根本无法判断`x`到底是全局变量，还是`o`对象的一个属性。这非常不利于代码的除错和模块化，编译器也无法对这段代码进行优化，只能留到运行时判断，这就拖慢了运行速度。因此，建议不要使用`with`语句，可以考虑用一个临时变量代替`with`。

```javascript
with(o1.o2.o3) {
  console.log(p1 + p2);
}

// 可以写成

var temp = o1.o2.o3;
console.log(temp.p1 + temp.p2);
```

`with`语句少数有用场合之一，就是替换模板变量。

```javascript
var str = 'Hello <%= name %>!';
```

上面代码是一个模板字符串。假定有一个`parser`函数，可以将这个字符串解析成下面的样子。

```javascript
parser(str)
// '"Hello ", name, "!"'
```

那么，就可以利用`with`语句，进行模板变量替换。

```javascript
var str = 'Hello <%= name %>!';

var o = {
  name: 'Alice'
};

function tmpl(str, obj) {
  str = 'var p = [];' +
    'with (obj) {p.push(' + parser(str) + ')};' +
    'return p;'
  var r = (new Function('obj', str))(obj);
  return r.join('');
}

tmpl(str, o)
// "Hello Alice!"
```

上面代码的核心逻辑是下面的部分。

```javascript
var o = {
  name: 'Alice'
};

var p = [];

with (o) {
  p.push('Hello ', name, '!');
};

p.join('') // "Hello Alice!"
```

上面代码中，`with`区块内部，模板变量`name`可以被对象`o`的属性替换，而`p`依然是全局变量。这就是很多模板引擎的实现原理。

## 参考链接

- Dr. Axel Rauschmayer，[Object properties in JavaScript](http://www.2ality.com/2012/10/javascript-properties.html)
- Lakshan Perera, [Revisiting JavaScript Objects](http://www.laktek.com/2012/12/29/revisiting-javascript-objects/)
- Angus Croll, [The Secret Life of JavaScript Primitives](http://javascriptweblog.wordpress.com/2010/09/27/the-secret-life-of-javascript-primitives/)i
- Dr. Axel Rauschmayer, [JavaScript’s with statement and why it’s deprecated](http://www.2ality.com/2011/06/with-statement.html)
