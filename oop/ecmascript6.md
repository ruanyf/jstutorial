---
title: ECMAScript 6 介绍
layout: page
category: oop
date: 2013-05-09
modifiedOn: 2013-08-15
---

## 概述

ECMAScript 6 是JavaScript的下一个标准，正处在快速开发之中，大部分已经完成了。预计Mozilla将在这个标准的基础上，推出JavaScript的 2.0。

ECMAScript 6 的目标，是使得JavaScript可以用来编写复杂的应用程序、函数库和代码的自动生成器（code generator）。

最新的浏览器已经部分支持ECMAScript 6 的语法，可以通过[《ECMAScript 6 浏览器兼容表》](http://kangax.github.io/es5-compat-table/es6/)查看浏览器支持情况。

## 数据类型

### let关键字

let关键字类似于var，用来声明变量，但是该变量只在声明所在的块级作用域有效。

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

ECMAScript 6 引入了generator 函数，允许函数内部暂停执行某些操作。

{% highlight javascript %}

function* foo() {
  yield 'foo';
  yield 'bar';
  yield 'baz';
}

{% endhighlight %}

上面就是一个generator函数，定义时function关键字后面加上星号。然后，函数内部就可以使用yield关键字，表示暂停执行某个操作，等到外部调用next方法时再执行。

{% highlight javascript %}

var x = foo();

x.next().value // 'foo'
x.next().value // 'bar'
x.next().value // 'baz'

{% endhighlight %}

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

### 回调函数的简洁写法

ECMAScript 6 允许函数的简写形式作为回调函数，不再需要function和return关键，最后一个表达式就是函数的返回值。

{% highlight javascript %}

// ES 5
[1,2,3].map(function (x) {
  return x * x;
});

// ES 6
[1,2,3].map(x => x * x);

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

{% highlight javascript %}

var [ start, end ] = ["earth", "moon"] // initialize
console.log(start + " calling " + end); // earth calling moon
 
[start, end] = [end, start] // variable swapping
console.log(start + " calling " + end); // moon calling earth

function equinox() {
  return [20, "March", 2013, 11, 02];
}
var [date, month, , ,] = equinox();
console.log("This year's equinox was on " + date + month); // This year's equinox was on 20March

{% endhighlight %}

这种简洁写法不仅可以使用数据结构，还可以用于对象结构。

{% highlight javascript %}

function equinox2() {
  return {
    date: 20,
    month: "March",
    year: 2013,
    time: {
      hour: 11, // nested
      minute: 2
    }
  };
}
 
var { date: d, month: m, time : { hour: h} } = equinox2();
// h has the value of the nested property while "year" and "minute" are skipped totally
 
console.log("This year's equinox was on " + d + m + " at " + h); // This year's equinox was on 20March at 11

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

const PI = 3.1415;

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
 
console.log("Area of the circle: " + area(4) + " meter squared");
console.log("Circumference of the circle: " + circumference(14) + " meters");

{% endhighlight %}

## 参考链接

- Sayanee Basu, [Use ECMAScript 6 Today](http://net.tutsplus.com/articles/news/ecmascript-6-today/)
- Ariya Hidayat, [Toward Modern Web Apps with ECMAScript 6](http://www.sencha.com/blog/toward-modern-web-apps-with-ecmascript-6/)
