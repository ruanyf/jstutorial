---
title: ECMAScript 6 介绍
layout: page
category: oop
date: 2013-05-09
modifiedOn: 2013-09-22
---

## 概述

ECMAScript 6 是JavaScript的下一个标准，正处在快速开发之中，大部分已经完成了。预计Mozilla将在这个标准的基础上，推出JavaScript的 2.0。

ECMAScript 6 的目标，是使得JavaScript可以用来编写复杂的应用程序、函数库和代码的自动生成器（code generator）。

最新的浏览器已经部分支持ECMAScript 6 的语法，可以通过[《ECMAScript 6 浏览器兼容表》](http://kangax.github.io/es5-compat-table/es6/)查看浏览器支持情况。

## 数据类型

### let关键字

let关键字类似于var，用来声明变量，但是该变量只在声明所在的块级作用域有效。

{% highlight javascript %}

{
    let a = 10;
    var b = 1;
}

a
// ReferenceError: a is not defined. 

b
//1

{% endhighlight %}

上面代码在代码块之中，分别用let和var声明了两个变量。然后在代码块之外调用这两个变量，结果let声明的变量报错，var声明的变量返回了正确的值。这标明，let声明的变量只在它所在的代码块有效。

下面的代码如果使用var，最后输出的是10。

{% highlight javascript %}

var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6]();

{% endhighlight %}

如果使用let，声明的变量仅在块级作用域内有效，最后输出的是6。

{% highlight javascript %}

var a = [];
for (var i = 0; i < 10; i++) {
  let c = i;
  a[i] = function () {
    console.log(c);
  };
}
a[6]();

{% endhighlight %}

let实际上为JavaScript新增了块级作用域。

{% highlight javascript %}

function doSomething() {
  let N = 5;
  if (someCondition) {
     let N = 10;
     doSomethingElse(N);
  }
  console.log(N); // 5
}

{% endhighlight %}

上面的代码有两个代码块，都声明了变量N。可以看到，外层代码块不受内层代码块的影响。如果使用var定义变量，最后输出的值就是10。

### const关键字

const与let的作用相似，也用来在块级作用域声明变量。但是，它声明的是常量，一旦声明，它的值就不能改变。

{% highlight javascript %}

const PI = 3.1415;


PI
// 3.1415

PI = 3;

PI
// 3.1415

const PI = 3.1;

PI
// 3.1415

{% endhighlight %}

### Set数据结构

ECMAScript 6 提供了新的数据结构Set。它类似于数组，但是所有值都是唯一的。

{% highlight javascript %}

var e = new Set(); // 新建集合
 
e.add("1") // 加入集合
e.add("2")
e.add("3")
e.add("4")
e.add("4") // 注意“4”被加入了两次
 
e.has("1")    // true
e.has("4")    // true
e.has("5")   // false
 
e.delete("4"); // delete item
e.has("4")    // false

{% endhighlight %}

### Map数据结构

ECMAScript 6 还提供了map数据结构。它就是一个键值对的数据结构，类似于对象，但是“键”的范围不限于字符串。

{% highlight javascript %}

var es6 = new Map(); // 新建Map
 
es6.set("edition", 6)        // 键是字符串
es6.set(262, "standard")     // 键是数值
es6.set(undefined, "nah")    // 键是undefined
 
var hello = function() {console.log("hello");}
es6.set(hello, "Hello ES6!") // 键是函数
 
es6.has("edition")     // true
es6.has("years")       // false
es6.has(262)           // true
es6.has(undefined)     // true
es6.has(hello)         // true
 
es6.delete(undefined) // delete map
es6.has(undefined)       // false
 
es6.get(hello)  // Hello ES6!
es6.get("edition")  // 6

{% endhighlight %}

### 函数的多余参数

ECMAScript 6引入扩展运算符（...），允许获取函数的多余参数。

{% highlight javascript %}

function push(array, ...items) { 
  items.forEach(function(item) {
    array.push(item);
    console.log( item );
  });
}
 
var planets = [];
console.log("太阳系的内层行星是：" );
// 1个固定参数 + 4个可变参数
push(planets, "Mercury", "Venus", "Earth", "Mars"); 

{% endhighlight %}

这种表示法不仅可以用于函数定义，还可以用于函数调用。

{% highlight javascript %}

function createURL (comment, path, protocol, subdomain, domain, tld) {
      var url = comment
        + ": "
        + protocol
        + "://"
        + subdomain
        + "."
        + domain
        + "."
        + tld
        + "/"
        + path;
 
  console.log(url);
}
 
var weblink = ["hypertext/WWW/TheProject.html", "http", "info", "cern", "ch"],
  comment = "世界上第一个网站";
 
createURL(comment, ...weblink ); // spread operator

{% endhighlight %}

从上面的例子可以看出，扩展运算符可以将数组转变成正常的参数序列。

{% highlight javascript %}

var max = Math.max(...[14, 3, 77]);

{% endhighlight %}

### generator 函数

ECMAScript 6 引入了generator 函数，作用是生成一个遍历器（iterator）。所谓“遍历器”，就是指能够依次遍历某些值。

定义generator函数，需要在function关键字后面，加一个星号。然后，函数内部使用yield关键字，定义遍历器的每个成员。

{% highlight javascript %}

function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
}

{% endhighlight %}

上面代码定义了一个generator函数helloWorldGenerator，它的遍历器有两个成员“hello”和“world”。调用这个函数，就会得到遍历器。

{% highlight javascript %}

var hw = helloWorldGenerator();

{% endhighlight %}

执行遍历器的next方法，则会依次遍历每个成员。

{% highlight javascript %}

console.log(hw.next()); // { value: 'hello', done: false }
console.log(hw.next()); // { value: 'world', done: false }
console.log(hw.next()); // { value: undefined, done: true }

{% endhighlight %}

上面代码每次调用遍历器的next方法，就会返回一个对象。它的value属性就是遍历器当前成员的值，done属性表示遍历是否结束。直到遍历完最后一个成员，done属性才会从false变为true，这时value属性为undefined，表示此处没有遍历器的成员。

遍历器的本质，其实是使用yield语句暂停执行它后面的操作，当调用next方法时，返回yield语句的值，然后再继续往下执行，直到遇到下一个yield语句。如果直到运行结束，也没有发现其他yield语句，则返回的对象的value属性为undefined，done变为true。某种程序上，yield语句很像return语句，只不过记得返回时位置，下次从该位置继续执行。

{% highlight javascript %}

function* powersOfTwo(maxExponent) {
    var exponent = 0;
    while (exponent <= maxExponent) {
        yield Math.pow(2, exponent);
        exponent++;
    }
}

var it = powersOfTwo(10),
    result = it.next();

while (!result.done) {
    console.log(result.value);
    result = it.next();
}

{% endhighlight %}

上面代码定义的powerOfTwo函数，第一次执行的时候，只会执行到yield语句为止，然后调用next方法时，再执行下去。通过判断遍历器的done属性，完成遍历器的循环。

这种暂停执行的效果，意味着可以把异步操作写在yield语句里面，等到调用next方法时再往后执行。这实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在yield语句下面，反正要等到next方法时再执行。所以，generator函数的一个重要实际意义就是用来处理异步操作，改写回调函数。

另外一种遍历器循环的方法是使用for...of语句。

{% highlight javascript %}

function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

{% endhighlight %}

上面代码定义了斐波那契数列，然后使用for..of语句完成循环。

{% highlight javascript %}

for (n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
}

{% endhighlight %}

从上面代码可见，使用for...of语句时不需要使用next方法。

## 语法糖

### 简洁的方法定义

ECMAScript 6 允许直接写入函数，作为对象的方法。这样的书写更加简洁。

{% highlight javascript %}

// ES 6
var Person = {
  name: 'Joe',
  hello() { console.log('Hello, my name is', this.name); }
};

{% endhighlight %}

### 箭头函数

ECMAScript 6允许使用“箭头”（=>）定义函数。

{% highlight javascript %}

var f = v => v;

{% endhighlight %}

上面的箭头函数等同于：

{% highlight javascript %}

var f = function(v) {
    return v;
};

{% endhighlight %}

如果箭头函数有多个参数，就要在它们外面加上括号。

{% highlight javascript %}

var sum = (num1, num2) => num1 + num2;

{% endhighlight %}

上面的箭头函数等同于

{% highlight javascript %}

var sum = function(num1, num2) {
    return num1 + num2;
};

{% endhighlight %}

如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。

{% highlight javascript %}

var sum = (num1, num2) => { return num1 + num2; }

{% endhighlight %}

由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号。

{% highlight javascript %}

var getTempItem = id => ({ id: id, name: "Temp" });

{% endhighlight %}

箭头函数有几个特点。

- 函数体内的this对象，绑定定义时所在的对象，而不是使用时所在的对象。
- 不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
- 不可以使用arguments对象，该对象在函数体内不存在。 

关于this对象，下面的代码将它绑定定义时的对象。

{% highlight javascript %}

var handler = {

    id: "123456",

    init: function() {
		// 使用箭头函数，绑定this对象
        document.addEventListener("click",
                event => this.doSomething(event.type), false);
    },

    doSomething: function(type) {
        console.log("Handling " + type  + " for " + this.id);
    }
};

{% endhighlight %}

上面代码如果没有箭头函数，doSomething方法内部的this对象指向全局对象，运行时会报错。

箭头函数的另一个用处是简化回调函数。

{% highlight javascript %}

// 正常函数写法
[1,2,3].map(function (x) {
  return x * x;
});

// 箭头函数写法
[1,2,3].map(x => x * x);

{% endhighlight %}

另一个例子是

{% highlight javascript %}

// 正常函数写法
var result = values.sort(function(a, b) {
    return a - b;
});

// 箭头函数写法
var result = values.sort((a, b) => a - b);

{% endhighlight %}

### 函数参数的默认值

ECMAScript 6 允许为函数的参数设置默认值。

{% highlight javascript %}

function history(lang = "C", year = 1972) {
  return lang + " was created around the year " + year;
}

{% endhighlight %}

### 数组处理的简洁写法

ECMAScript 6 提供简洁写法，对数组进行处理。

{% highlight javascript %}

// ES 5
[1, 2, 3].map(function (i) { return i * i });

// ES 6
[for (i of [1, 2, 3]) i * i];

// ES 5
[1,4,2,3,-8].filter(function(i) { return i < 3 });
 
// ES 6
[for (i of [1,4,2,3,-8]) if (i < 3) i];

{% endhighlight %}

新引入的for...of运算符，可以直接跟在表达式的前面或后面。

{% highlight javascript %}

// 一重循环
var temperature = [0, 37, 100];
[t + 273 for (t of temperature)]; // [273, 310, 373]
 
// 三重循环
var a1 = ["x1", "y1"],
  a2 = ["x2", "y2"],
  a3 = ["x3", "y3"];
 
[(console.log(s + w + r)) for (s of a1) for (w of a2) for (r of a3)];

{% endhighlight %}

### 多变量赋值

ECMAScript 6 允许简洁地对多变量赋值。

正常情况下，将数组元素赋值给多个变量，只能一次次分开赋值。

{% highlight javascript %}

var first = someArray[0];
var second = someArray[1];
var third = someArray[2];

{% endhighlight %}

在ECMAScript 6 中可以写成

{% highlight javascript %}

var [first, second, third] = someArray;

{% endhighlight %}

这种赋值写法在语法上非常灵活。

{% highlight javascript %}

var [ start, end ] = ["earth", "moon"] 

[start, end] = [end, start] // 变量互换

var [foo, [[bar], baz]] = [1, [[2], 3]]

var [,,third] = ["foo", "bar", "baz"]

var [head, ...tail] = [1, 2, 3, 4]

{% endhighlight %}

它还可以接受默认值。

{% highlight javascript %}

var [missing = true] = [];
console.log(missing)
// true

var { x = 3 } = {};
console.log(x)
// 3

{% endhighlight %}

它不仅可以用于数组，还可以用于对象。

{% highlight javascript %}

var { foo, bar } = { foo: "lorem", bar: "ipsum" };

console.log(foo)
// "lorem"

console.log(bar)
// "ipsum"

var o = {
  p1: [
    "Hello",
    { p2: "World" }
  ]
};

var { a: [p1, { p2 }] } = o;

console.log(p1)
// "Hello"

console.log(p2)
// "World"

{% endhighlight %}

有了这种用法，函数定义和调用时，使用参数就很方便。

{% highlight javascript %}

function f({p1, p2, p3}) {
  // ...
}

{% endhighlight %}

赋给函数参数默认值，也容易多了。

{% highlight javascript %}

jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
}) {
  // ... do stuff
};

{% endhighlight %}

### for...of结构

JavaScript的for...in结构，只能获得键，不能直接获取值。

{% highlight javascript %}

var planets = ["Mercury", "Venus", "Earth", "Mars"];
for (p in planets) {
  console.log(p); // 0,1,2,3
}
 
var es6 = {
  edition: 6,
  committee: "TC39",
  standard: "ECMA-262"
};
for (e in es6) {
  console.log(e); // edition, committee, standard
}

{% endhighlight %}

ECMAScript 6 提供for...of结构，允许获得值。

{% highlight javascript %}

var planets = ["Mercury", "Venus", "Earth", "Mars"];
for (p of planets) {
  console.log(p); // Mercury, Venus, Earth, Mars
}
 
var engines = Set(["Gecko", "Trident", "Webkit", "Webkit"]);
for (var e of engines) {
    console.log(e);
    // Set only has unique values, hence Webkit shows only once
}
 
var es6 = new Map();
es6.set("edition", 6);
es6.set("committee", "TC39");
es6.set("standard", "ECMA-262");
for (var [name, value] of es6) {
  console.log(name + ": " + value);
}

{% endhighlight %}

## 数据结构

### class结构

ECMAScript 6 提供了“类”。在此之前，一般用构造函数模拟“类”。

{% highlight javascript %}

// ES5

var Language = function(config) {
  this.name = config.name;
  this.founder = config.founder;
  this.year = config.year;
};
 
Language.prototype.summary = function() {
  return this.name + " was created by " + this.founder + " in " + this.year;
};

{% endhighlight %}

ECMAScript 6 允许使用class结构，达到同样的效果。

{% highlight javascript %}

// ES6

class Language {
  constructor(name, founder, year) {
    this.name = name;
    this.founder = founder;
    this.year = year;
  }
  summary() {
    return this.name + " was created by " + this.founder + " in " + this.year;
  }
}

// 生成实例
var js = new Language；

{% endhighlight %}

上面代码的constructor方法，就是类的构造函数。

class结构还允许使用extends关键字，表示继承。

{% highlight javascript %}

class MetaLanguage extends Language {
  constructor(x, y, z, version) {
    super(x, y, z);
    this.version = version;
  }
}

{% endhighlight %}

上面代码的super方法，表示调用父类的构造函数。

### module定义

ECMAScript 6 允许定义模块。也就是说，允许一个JavaScript脚本文件调用另一个脚本文件。

假设有一个circle.js，它是一个单独模块。

{% highlight javascript %}

// circle.js

export function area(radius) {
  return Math.PI * radius * radius;
}
 
export function circumference(radius) {
  return 2 * Math.PI * radius;
}

{% endhighlight %}

然后，main.js引用这个模块。

{% highlight javascript %}

// main.js

import { area, circumference } from 'circle';
 
console.log("圆面积：" + area(4));
console.log("圆周长：" + circumference(14));

{% endhighlight %}

## ECMAScript 7

2013年3月，ECMAScript 6的草案封闭，不再接受新功能了。新的功能将被加入ECMAScript 7。根据JavaScript创造者Brendan Eich的[设想](http://wiki.ecmascript.org/doku.php?id=harmony:harmony)，ECMAScript 7将使得JavaScript更适于开发复杂的应用程序和函数库。

ECMAScript 7可能包括的功能有：

- **Object.observe**：对象与网页元素的双向绑定，只要其中之一发生变化，就会自动反映在另一者上。

- **Multi-Threading**：多线程支持。目前，Intel和Mozilla有一个共同的研究项目RiverTrail，致力于让JavaScript多线程运行。预计这个项目的研究成果会被纳入ECMAScript标准。

- **Traits**：它将是“类”功能（class）的一个替代。通过它，不同的对象可以分享同样的特性。

其他可能包括的功能还有：更精确的数值计算、改善的内存回收、增强的跨站点安全、类型化的更贴近硬件的（Typed, Low-level）操作、国际化支持（Internationalization Support）、更多的数据结构等等。

## 参考链接

- Sayanee Basu, [Use ECMAScript 6 Today](http://net.tutsplus.com/articles/news/ecmascript-6-today/)
- Ariya Hidayat, [Toward Modern Web Apps with ECMAScript 6](http://www.sencha.com/blog/toward-modern-web-apps-with-ecmascript-6/)
- Nick Fitzgerald, [Destructuring Assignment in ECMAScript 6](http://fitzgeraldnick.com/weblog/50/)
- jmar777, [What's the Big Deal with Generators?](http://devsmash.com/blog/whats-the-big-deal-with-generators)
- Nicholas C. Zakas, [Understanding ECMAScript 6 arrow functions](http://www.nczonline.net/blog/2013/09/10/understanding-ecmascript-6-arrow-functions/)
