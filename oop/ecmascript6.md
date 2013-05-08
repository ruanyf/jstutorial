---
title: ECMAScript 6 介绍
layout: page
category: oop
date: 2013-05-09
modifiedOn: 2013-05-09
---

## 概述

ECMAScript 6 是JavaScript的下一个标准，正处在快速开发之中，大部分已经完成了。预计Mozilla将在这个标准的基础上，推出JavaScript的 2.0。

ECMAScript 6 的目标，是使得JavaScript可以用来编写复杂的应用程序、函数库和代码的自动生成器（code generator）。

最新的浏览器已经部分支持ECMAScript 6 的语法，可以通过[《ECMAScript 6 浏览器兼容表》](http://kangax.github.io/es5-compat-table/es6/)查看浏览器支持情况。

## let关键字

let关键字类似于var，用来声明变量，但是该变量只在声明所在的块级作用域有效。

下面的代码如果使用var，最后输出的是ES10。

{% highlight javascript %}

var es = [];
for (var i = 0; i < 10; i++) {
  es[i] = function () {
    console.log("Upcoming edition of ECMAScript is ES" + i);
  };
}
es[6]();

{% endhighlight %}

我们可是使用let，声明一个变量仅在块级作用域内有效，最后输出的是ES6。

{% highlight javascript %}

var es = [];
for (var i = 0; i < 10; i++) {
  let c = i;
  es[i] = function () {
    console.log("Upcoming edition of ECMAScript is ES" + c);
  };
}
es[6]();

{% endhighlight %}

## const关键字

const与let的作用相似，也是用来在块级作用域声明变量。但是，它声明的是常量，一旦声明，它的值就不能改变。

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

## class结构

ECMAScript 6 提供了“类”。

在此之前，一般用构造函数模拟“类”。

{% highlight javascript %}

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

class结构还允许使用extends关键字，表示继承。

{% highlight javascript %}

class MetaLanguage extends Language {
  constructor(x, y, z, version) {
    super(x, y, z);
    this.version = version;
  }
}

{% endhighlight %}

## 函数参数的默认值

ECMAScript 6 允许为函数的参数设置默认值。

{% highlight javascript %}

function history(lang = "C", year = 1972) {
  return lang + " was created around the year " + year;
}

{% endhighlight %}

## Set数据结构

ECMAScript 6 提供了新的数据结构Sets。它类似于数组，但是所有值都是唯一的。

{% highlight javascript %}

var engines = new Set(); // create new Set
 
engines.add("Gecko"); // add to Set
engines.add("Trident");
engines.add("Webkit");
engines.add("Hippo");
engines.add("Hippo"); // note that Hippo is added twice
 
console.log("Browser engines include Gecko? " + engines.has("Gecko"));    // true
console.log("Browser engines include Hippo? " + engines.has("Hippo"));    // true
console.log("Browser engines include Indigo? " + engines.has("Indigo"));   // false
 
engines.delete("Hippo"); // delete item
console.log("Hippo is deleted. Browser engines include Hippo? " + engines.has("Hippo"));    // false

{% endhighlight %}

## Map数据结构

ECMAScript 6 还提供了map数据结构。它就是一个键值对的数据结构，类似于对象，但是“键”的范围不限于字符串。

{% highlight javascript %}

var es6 = new Map(); // create new Map
 
es6.set("edition", 6);        // key is string
es6.set(262, "standard");     // key is number
es6.set(undefined, "nah");    // key is undefined
 
var hello = function() {console.log("hello");};
es6.set(hello, "Hello ES6!"); // key is function
 
console.log( "Value of 'edition' exits? " + es6.has("edition") );     // true
console.log( "Value of 'year' exits? " + es6.has("years") );          // false
console.log( "Value of 262 exits? " + es6.has(262) );                 // true
console.log( "Value of undefined exits? " + es6.has(undefined) );     // true
console.log( "Value of hello() exits? " + es6.has(hello) );           // true
 
es6.delete(undefined); // delete map
console.log( "Value of undefined exits? " + es6.has(undefined) );      // false
 
console.log( es6.get(hello) ); // Hello ES6!
console.log( "Work is in progress for ES" + es6.get("edition") ); // Work is in progress for ES6

{% endhighlight %}

## 多变量赋值

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

## 函数的多余参数

ECMAScript 6允许获取函数的多余参数。

{% highlight javascript %}

function push(array, ...items) { // defining rest parameters with 3 dot syntax
  items.forEach(function(item) {
    array.push(item);
    console.log( item );
  });
}
 
// 1 fixed + 4 variable parameters
var planets = [];
console.log("Inner planets of our Solar system are: " );
push(planets, "Mercury", "Venus", "Earth", "Mars"); // rest parameters

{% endhighlight %}

这种表示法不仅可以用于函数定义，还可以用于函数调用。

{% highlight javascript %}

// Spread operator "...weblink"
function createURL (comment, path, protocol, subdomain, domain, tld) {
      var shoutout = comment
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
 
  console.log( shoutout );
}
 
var weblink = ["hypertext/WWW/TheProject.html", "http", "info", "cern", "ch"],
  comment = "World's first Website";
 
createURL(comment, ...weblink ); // spread operator

{% endhighlight %}

## for...of结构

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

## 数组处理的简洁写法

ECMAScript 6 提供简洁写法，对数组进行处理。

{% highlight javascript %}

// Array created with 1 loop
var temperature = [0, 37, 100];
[t + 273 for (t of temperature)]; // [273, 310, 373]
 
// Array created with 3 loops
var suspects = ["Miss Scarlet", "Colonel Mustard"],
  weapons = ["Candlestick", "Dagger"],
  rooms = ["Kitchen", "Ballroom"];
 
[(console.log(s + " with a " + w + " in the " + r)) for (s of suspects) for (w of weapons) for (r of rooms)];


{% endhighlight %}

## module定义

ECMAScript 6 允许定义模块。

假设有一个circle.js，它是一个单独模块。

{% highlight javascript %}

export function area(radius) {
  return Math.PI * radius * radius;
}
 
export function circumference(radius) {
  return 2 * Math.PI * radius;
}

{% endhighlight %}

然后，main.js引用这个模块。

{% highlight javascript %}

import { area, circumference } from 'circle';
 
console.log("Area of the circle: " + area(4) + " meter squared");
console.log("Circumference of the circle: " + circumference(14) + " meters");

{% endhighlight %}

## 参考链接

- Sayanee Basu, [Use ECMAScript 6 Today](http://net.tutsplus.com/articles/news/ecmascript-6-today/)
