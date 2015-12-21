---
title: 对象
layout: page
category: grammar
date: 2012-12-12
modifiedOn: 2014-01-17
---

## 概述

### 定义方法

对象（object）是JavaScript的核心概念，也是最重要的数据类型。JavaScript的所有数据都可以被视为对象。

简单说，所谓对象，就是一种无序的数据集合，由若干个“键值对”（key-value）构成。

```javascript
var o = {
  p: 'Hello World'
};
```

上面代码中，大括号就定义了一个对象，它被赋值给变量`o`。这个对象内部包含一个键值对（又称为“成员”），`p`是“键名”（成员的名称），字符串“Hello World”是“键值”（成员的值）。键名与键值之间用冒号分隔。如果对象内部包含多个键值对，每个键值对之间用逗号分隔。

### 键名

对象的所有键名都是字符串，所以加不加引号都可以。上面的代码也可以写成下面这样。

```javascript
var o = {
  'p': 'Hello World'
};
```

但是，如果键名不符合标识名的条件（比如第一个字符为数字，或者含有空格或运算符），也不是数字，则必须加上引号。

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

如果键名是数字，则会默认转为对应的字符串。

```javascript
var obj = {
  1e2: true,
  1e-2: true,
  .234: true,
  0xFF: true,
};

Obj
// {
//   100: true,
//   255: true,
//   0.01: true,
//   0.234: true
// }
```

上面代码表示，如果键名为数值，则会先转为标准形式的数值，然后再转为字符串。

### 属性

对象的每一个“键名”又称为“属性”（property），它的“键值”可以是任何数据类型。如果一个属性的值为函数，通常把这个属性称为“方法”，它可以像函数那样调用。

```javascript
var o = {
  p: function(x) {
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

上面的代码中m属性后面的那个逗号，有或没有都不算错。但是，ECMAScript 3不允许添加逗号，所以如果要兼容老式浏览器（比如IE 8），那就不能加这个逗号。

由于对象的方法就是函数，因此也有`name`属性。

```javascript
var obj = {
  m1: function m1() {},
  m2: function () {}
};

obj.m1.name // m1
obj.m2.name // undefined
```

### 生成方法

对象的生成方法，通常有三种方法。除了像上面那样直接使用大括号生成（{}），还可以用new命令生成一个Object对象的实例，或者使用Object.create方法生成。

{% highlight javascript %}

var o1 = {};
var o2 = new Object();
var o3 = Object.create(null);

{% endhighlight %}

上面三行语句是等价的。一般来说，第一种采用大括号的写法比较简洁，第二种采用构造函数的写法清晰地表示了意图，第三种写法一般用在需要对象继承的场合。关于第二种写法，详见《标准库》一章的Object对象一节，第三种写法详见《面向对象编程》一章。

### 读写属性

**（1）读取属性**

读取对象的属性，有两种方法，一种是使用点运算符，还有一种是使用方括号运算符。

```javascript
var o = {
  p: "Hello World"
};

o.p // "Hello World"
o["p"] // "Hello World"
```

上面代码分别采用点运算符和方括号运算符，读取属性p。

请注意，如果使用方括号运算符，键名必须放在引号里面，否则会被当作变量处理。但是，数字键可以不加引号，因为会被当作字符串处理。

```javascript
var o = {
  0.7: "Hello World"
};

o.["0.7"] // "Hello World"
o[0.7] // "Hello World"
```

方括号运算符内部可以使用表达式。

```javascript
o['hello' + ' world']
o[3+3]
```

数值键名不能使用点运算符（因为会被当成小数点），只能使用方括号运算符。

```javascript
obj.0xFF
// SyntaxError: Unexpected token
obj[0xFF]
// true
```

上面代码的第一个表达式，对数值键名0xFF使用点运算符，结果报错。第二个表达式使用方括号运算符，结果就是正确的。

**（2）检查变量是否声明**

如果读取一个不存在的键，会返回undefined，而不是报错。可以利用这一点，来检查一个变量是否被声明。

```javascript
// 检查a变量是否被声明

if(a) {...} // 报错

if(window.a) {...} // 不报错
if(window['a']) {...} // 不报错
```

上面的后二种写法之所以不报错，是因为在浏览器环境，所有全局变量都是window对象的属性。window.a的含义就是读取window对象的a属性，如果该属性不存在，就返回undefined，并不会报错。

需要注意的是，后二种写法有漏洞，如果a属性是一个空字符串（或其他对应的布尔值为false的情况），则无法起到检查变量是否声明的作用。正确的写法是使用in运算符。

{% highlight javascript %}

if('a' in window) {
  ...
}

{% endhighlight %}

**（3）写入属性**

点运算符和方括号运算符，不仅可以用来读取值，还可以用来赋值。

```javascript
o.p = 'abc';
o['p'] = 'abc';
```

上面代码分别使用点运算符和方括号运算符，对属性p赋值。

JavaScript允许属性的“后绑定”，也就是说，你可以在任意时刻新增属性，没必要在定义对象的时候，就定义好属性。

{% highlight javascript %}

var o = { p:1 };

// 等价于

var o = {};
o.p = 1;

{% endhighlight %}

**（4）查看所有属性**

查看一个对象本身的所有属性，可以使用`Object.keys`方法。

```javascript
var o = {
  key1: 1,
  key2: 2
};

Object.keys(o);
// ['key1', 'key2']
```

### 属性的删除

删除一个属性，需要使用`delete`命令。

```javascript
var o = {p: 1};
Object.keys(o) // ["p"]

delete o.p // true
o.p // undefined
Object.keys(o) // []
```

上面代码表示，一旦使用`delete`命令删除某个属性，再读取该属性就会返回`undefined`，而且`Object.keys`方法返回的该对象的所有属性中，也将不再包括该属性。

麻烦的是，如果删除一个不存在的属性，delete不报错，而且返回true。

```
var o = {};
delete o.p // true
```

上面代码表示，delete命令只能用来保证某个属性的值为undefined，而无法保证该属性是否真的存在。

只有一种情况，delete命令会返回false，那就是该属性存在，且不得删除。

{% highlight javascript %}

var o = Object.defineProperty({}, "p", {
        value: 123,
        configurable: false
});

o.p // 123
delete o.p // false

{% endhighlight %}

上面代码之中，o对象的p属性是不能删除的，所以delete命令返回false（关于Object.defineProperty方法的介绍，请看《标准库》一章的Object对象章节）。

另外，需要注意的是，delete命令只能删除对象本身的属性，不能删除继承的属性（关于继承参见《面向对象编程》一节）。delete命令也不能删除var命令声明的变量，只能用来删除属性。

### 对象的引用

如果不同的变量名指向同一个对象，那么它们都是这个对象的引用，也就是说指向同一个内存地址。修改其中一个变量，会影响到其他所有变量。

{% highlight javascript %}

var o1 = {};
var o2 = o1;

o1.a = 1;
o2.a // 1

o2.b = 2;
o1.b // 2

{% endhighlight %}

上面代码之中，o1和o2指向同一个对象，因此为其中任何一个变量添加属性，另一个变量都可以读写该属性。

但是，这种引用只局限于对象，对于原始类型的数据则是传值引用，也就是说，都是值的拷贝。

{% highlight javascript %}

var x = 1;
var y = x;

x = 2;
y // 1

{% endhighlight %}

上面的代码中，当x的值发生变化后，y的值并不变，这就表示y和x并不是指向同一个内存地址。

### in运算符

in运算符用于检查对象是否包含某个属性（注意，检查的是键名，不是键值），如果包含就返回`true`，否则返回`false`。

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

for (i in o){
  console.log(o[i]);
}
// 1
// 2
// 3
```

注意，`for...in`循环遍历的是对象所有可enumberable的属性，其中不仅包括定义在对象本身的属性，还包括对象继承的属性。

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

如果只想遍历对象本身的属性，可以使用hasOwnProperty方法，在循环内部做一个判断。

{% highlight javascript %}

for (var key in person) {
    if (person.hasOwnProperty(key)) {
        console.log(key);
    }
}
// name

{% endhighlight %}

为了避免这一点，可以新建一个继承null的对象。由于null没有任何属性，所以新对象也就不会有继承的属性了。

## with语句

with语句的格式如下：

{% highlight javascript %}

with (object)
  statement

{% endhighlight %}

它的作用是操作同一个对象的多个属性时，提供一些书写的方便。

{% highlight javascript %}

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

{% endhighlight %}

注意，with区块内部的变量，必须是当前对象已经存在的属性，否则会创造一个当前作用域的全局变量。这是因为with区块没有改变作用域，它的内部依然是当前作用域。

{% highlight javascript %}

var o = {};

with (o){
  x = "abc";
}

o.x
// undefined

x
// "abc"

{% endhighlight %}

上面代码中，对象o没有属性x，所以with区块内部对x的操作，等于创造了一个全局变量x。正确的写法应该是，先定义对象o的属性x，然后在with区块内操作它。

{% highlight javascript %}

var o = {};

o.x = 1;

with (o){
  x = 2;
}

o.x
// 2

{% endhighlight %}

这是with语句的一个很大的弊病，就是绑定对象不明确。

{% highlight javascript %}

with (o) {
  console.log(x);
}

{% endhighlight %}

单纯从上面的代码块，根本无法判断x到底是全局变量，还是o对象的一个属性。这非常不利于代码的除错和模块化，编译器也无法对这段代码进行优化，只能留到运行时判断，这就拖慢了运行速度。因此，建议不要使用with语句，可以考虑用一个临时变量代替with。

{% highlight javascript %}

with(o1.o2.o3) {
  console.log(p1 + p2);
}

// 可以写成

var temp = o1.o2.o3;
console.log(temp.p1 + temp.p2);

{% endhighlight %}

with语句少数有用场合之一，就是替换模板变量。

```javascript
var str = 'Hello <%= name %>!';
```

上面代码是一个模板字符串，为了替换其中的变量name，可以先将其分解成三部分`'Hello ', name, '!'`，然后进行模板变量替换。

```javascript

var o = {
  name: 'Alice'
};

var p = [];
var tmpl = '';

with(o){
  p.push('Hello ', name, '!');
};

p.join('') // "Hello Alice!"
```

上面代码中，with区块内部，模板变量name可以被对象o的属性替换，而p依然是全局变量。事实上，这就是很多模板引擎的实现原理。

## 参考链接

- Dr. Axel Rauschmayer，[Object properties in JavaScript](http://www.2ality.com/2012/10/javascript-properties.html)
- Lakshan Perera, [Revisiting JavaScript Objects](http://www.laktek.com/2012/12/29/revisiting-javascript-objects/)
- Angus Croll, [The Secret Life of JavaScript Primitives](http://javascriptweblog.wordpress.com/2010/09/27/the-secret-life-of-javascript-primitives/)i
- Dr. Axel Rauschmayer, [JavaScript’s with statement and why it’s deprecated](http://www.2ality.com/2011/06/with-statement.html)
