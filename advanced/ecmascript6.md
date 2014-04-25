---
title: ECMAScript 6 介绍
layout: page
category: advanced
date: 2013-05-09
modifiedOn: 2014-02-27
---

> **[公告] 本节不再更新，变为一个独立项目，请访问[《ECMAScript 6入门》](http://es6.ruanyifeng.com/)。（2014年4月25日）**

## 概述

ECMAScript 6 是JavaScript的下一代标准，正处在快速开发之中，大部分已经完成了，预计将在2014年正式发布。Mozilla将在这个标准的基础上，推出JavaScript 2.0。

ECMAScript 6的目标，是使得JavaScript可以用来编写复杂的应用程序、函数库和代码的自动生成器（code generator）。

最新的浏览器已经部分支持ECMAScript 6 的语法，可以通过[《ECMAScript 6 浏览器兼容表》](http://kangax.github.io/es5-compat-table/es6/)查看浏览器支持情况。

下面对ECMAScript 6新增的语法特性逐一介绍。由于ECMAScript 6的正式标准还未出台，所以以下内容随时可能发生变化，不一定是最后的版本。

## 使用ECMAScript 6的方法

目前，V8引擎已经部署了ECMAScript 6的部分特性。使用node.js 0.11版，就可以体验这些特性。

node.js 0.11版的一种比较方便的使用方法，是使用版本管理工具[nvm](https://github.com/creationix/nvm)。下载nvm以后，进入项目目录，运行下面的命令，激活nvm。

{% highlight bash %}

source nvm.sh

{% endhighlight %}

然后，指定node运行版本。

{% highlight bash %}

nvm use 0.11

{% endhighlight %}

最后，用--harmony参数进入node运行环境，就可以在命令行下体验ECMAScript 6了。

{% highlight bash %}

node --harmony

{% endhighlight %}

另外，可以使用Google的[Traceur](https://github.com/google/traceur-compiler)（[在线转换工具](http://google.github.io/traceur-compiler/demo/repl.html)），将ES6代码编译为ES5。

{% highlight bash %}

# 安装
npm install -g traceur

# 运行ES6文件
traceur /path/to/es6

# 将ES6文件转为ES5文件
traceur --script /path/to/es6 --out /path/to/es5

{% endhighlight %}

## 数据类型

### let命令

**（1）概述**

ECMAScript 6新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。

{% highlight javascript %}

{
    let a = 10;
    var b = 1;
}

a // ReferenceError: a is not defined. 
b //1

{% endhighlight %}

上面代码在代码块之中，分别用let和var声明了两个变量。然后在代码块之外调用这两个变量，结果let声明的变量报错，var声明的变量返回了正确的值。这表明，let声明的变量只在它所在的代码块有效。

下面的代码如果使用var，最后输出的是9。

{% highlight javascript %}

var a = [];
for (var i = 0; i < 10; i++) {
  var c = i;
  a[i] = function () {
    console.log(c);
  };
}
a[6](); // 9

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
a[6](); // 6

{% endhighlight %}

注意，let不允许在相同作用域内，重复声明同一个变量。

{% highlight javascript %}

// 报错
{
    let a = 10;
    var a = 1;
}

// 报错
{
    let a = 10;
    let a = 1;
}

{% endhighlight %}

**（2）块级作用域**

let实际上为JavaScript新增了块级作用域。

{% highlight javascript %}

function f1() {
  let n = 5;
  if (true) {
	  let n = 10;
  }
  console.log(n); // 5
}

{% endhighlight %}

上面的函数有两个代码块，都声明了变量n，运行后输出5。这表示外层代码块不受内层代码块的影响。如果使用var定义变量n，最后输出的值就是10。

块级作用域的出现，实际上使得获得广泛应用的立即执行函数（IIFE）不再必要了。

{% highlight javascript %}

// IIFE写法
(function () { 
	var tmp = ...;
	...
}()); 

// 块级作用域写法
{
	let tmp = ...;
	...
}

{% endhighlight %}

**（3）不存在变量提升**

需要注意的是，let声明的变量不存在“变量提升”现象。

{% highlight javascript %}

console.log(x);
let x = 10;

{% endhighlight %}

上面代码运行后会报错，表示x没有定义。如果用var声明x，就不会报错，输出结果为undefined。

### const命令

const也用来声明变量，但是声明的是常量。一旦声明，常量的值就不能改变。

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

上面代码表明改变常量的值是不起作用的。需要注意的是，对常量重新赋值不会报错，只会默默地失败。

> const的作用域与var命令相同：如果在全局环境声明，常量就在全局环境有效；如果在函数内声明，常量就在函数体内有效。

### Set数据结构

ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

Set本身是一个构造函数，用来生成Set数据结构。

{% highlight javascript %}

var s = new Set();

[2,3,5,4,5,2,2].map(x => s.add(x))
for (i of s) {console.log(i)}
// 2 3 4 5

{% endhighlight %}

上面代码表示，set数据结构不会添加重复的值。

set数据结构有以下属性和方法：

- size：返回成员总数。
- add(value)：添加某个值。
- delete(value)：删除某个值。
- has(value)：返回一个布尔值，表示该值是否为set的成员。
- clear()：清除所有成员。

{% highlight javascript %}

s.add("1").add("2").add("2"); 
// 注意“2”被加入了两次

s.size // 2

s.has("1")    // true
s.has("2")    // true
s.has("3")   // false

s.delete("2");
s.has("2")    // false

{% endhighlight %}

### Map数据结构

ES6还提供了map数据结构。它类似于对象，就是一个键值对的集合，但是“键”的范围不限于字符串，甚至对象也可以当作键。

{% highlight javascript %}

var m = new Map();

o = {p: "Hello World"};
m.set(o, "content")
console.log(m.get(o))
// "content"

{% endhighlight %}

上面代码将一个对象当作m的一个键。

Map数据结构有以下属性和方法。

- size：返回成员总数。
- set(key, value)：设置一个键值对。
- get(key)：读取一个键。
- has(key)：返回一个布尔值，表示某个键是否在Map数据结构中。
- delete(key)：删除某个键。
- clear()：清除所有成员。

{% highlight javascript %}

var m = new Map(); 

m.set("edition", 6)        // 键是字符串
m.set(262, "standard")     // 键是数值
m.set(undefined, "nah")    // 键是undefined

var hello = function() {console.log("hello");}
m.set(hello, "Hello ES6!") // 键是函数

m.has("edition")     // true
m.has("years")       // false
m.has(262)           // true
m.has(undefined)     // true
m.has(hello)         // true

m.delete(undefined)
m.has(undefined)       // false

m.get(hello)  // Hello ES6!
m.get("edition")  // 6

{% endhighlight %}

### rest（...）运算符

**（1）基本用法**

ES6引入rest运算符（...），用于获取函数的多余参数，这样就不需要使用arguments.length了。rest运算符后面是一个数组变量，该变量将多余的参数放入数组中。

{% highlight javascript %}

function add(...values) {
   let sum = 0;

   for (var val of values) {
      sum += val;
   }

   return sum;
}

add(2, 5, 3) // 10

{% endhighlight %}

上面代码的add函数是一个求和函数，利用rest运算符，可以向该函数传入任意数目的参数。

下面是一个利用rest运算符改写数组push方法的例子。

{% highlight javascript %}

function push(array, ...items) { 
  items.forEach(function(item) {
    array.push(item);
    console.log(item);
  });
}
 
var a = [];
push(a, "a1", "a2", "a3", "a4"); 

{% endhighlight %}

**（2）将数组转为参数序列**

rest运算符不仅可以用于函数定义，还可以用于函数调用。

{% highlight javascript %}

function f(s1, s2, s3, s4, s5) {
 	console.log(s1 + s2 + s3 + s4 +s5);
}

var a = ["a2", "a3", "a4", "a5"];

f("a1", ...a)
// a1a2a3a4a5

{% endhighlight %}

从上面的例子可以看出，rest运算符的另一个重要作用是，可以将数组转变成正常的参数序列。利用这一点，可以简化求出一个数组最大元素的写法。

{% highlight javascript %}

// ES5
Math.max.apply(null, [14, 3, 77])

// ES6
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);

{% endhighlight %}

上面代码表示，由于JavaScript不提供求数组最大元素的函数，所以只能套用Math.max函数，将数组转为一个参数序列，然后求最大值。有了rest运算符以后，就可以直接用Math.max了。

### 遍历器（Iterator）

遍历器（Iterator）是一种协议，任何对象都可以部署遍历器协议，从而使得for...of循环可以遍历这个对象。

遍历器协议规定，任意对象只要部署了next方法，就可以作为遍历器，但是next方法必须返回一个包含value和done两个属性的对象。其中，value属性当前遍历位置的值，done属性是一个布尔值，表示遍历是否结束。

{% highlight javascript %}

function makeIterator(array){
    var nextIndex = 0;
    
    return {
       next: function(){
           return nextIndex < array.length ?
               {value: array[nextIndex++], done: false} :
               {done: true};
       }
    }
}

var it = makeIterator(['a', 'b']);

it.next().value // 'a'
it.next().value // 'b'
it.next().done  // true

{% endhighlight %}

下面是一个无限运行的遍历器的例子。

{% highlight javascript %}

function idMaker(){
    var index = 0;
    
    return {
       next: function(){
           return {value: index++, done: false};
       }
    }
}

var it = idMaker();

it.next().value // '0'
it.next().value // '1'
it.next().value // '2'
// ...

{% endhighlight %}

### generator 函数

上一部分的遍历器，用来依次取出集合中的每一个成员，但是某些情况下，我们需要的是一个内部状态的遍历器。也就是说，每调用一次遍历器，对象的内部状态发生一次改变（可以理解成发生某些事件）。ECMAScript 6 引入了generator函数，作用就是返回一个内部状态的遍历器，主要特征是函数内部使用了yield语句。

当调用generator函数的时候，该函数并不执行，而是返回一个遍历器（可以理解成暂停执行）。以后，每次调用这个遍历器的next方法，就从函数体的头部或者上一次停下来的地方开始执行（可以理解成恢复执行），直到遇到下一个yield语句为止，并返回该yield语句的值。

ECMAScript 6草案定义的generator函数，需要在function关键字后面，加一个星号。然后，函数内部使用yield语句，定义遍历器的每个成员。

{% highlight javascript %}

function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
}

{% endhighlight %}

yield有点类似于return语句，都能返回一个值。区别在于每次遇到yield，函数返回紧跟在yield后面的那个表达式的值，然后暂停执行，下一次从该位置继续向后执行，而return语句不具备位置记忆的功能。

上面代码定义了一个generator函数helloWorldGenerator，它的遍历器有两个成员“hello”和“world”。调用这个函数，就会得到遍历器。

{% highlight javascript %}

var hw = helloWorldGenerator();

{% endhighlight %}

执行遍历器的next方法，则会依次遍历每个成员。

{% highlight javascript %}

hw.next() 
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: undefined, done: true }

hw.next()
// Error: Generator has already finished
//	at GeneratorFunctionPrototype.next (native)
//	at repl:1:3
//  at REPLServer.defaultEval (repl.js:129:27)
//  ... 

{% endhighlight %}

上面代码一共调用了四次next方法。

- 第一次调用：函数开始执行，直到遇到第一句yield语句为止。next方法返回一个对象，它的value属性就是当前yield语句的值hello，done属性的值false，表示遍历还没有结束。

- 第二次调用：函数从上次yield语句停下的地方，一直执行到下一个yield语句。next方法返回一个对象，它的value属性就是当前yield语句的值world，done属性的值false，表示遍历还没有结束。

- 第三次调用：函数从上次yield语句停下的地方，一直执行到函数结束。next方法返回一个对象，它的value属性就是函数最后的返回值，由于上例的函数没有return语句（即没有返回值），所以value属性的值为undefined，done属性的值true，表示遍历已经结束。

- 第四次调用：由于此时函数已经运行完毕，next方法直接抛出一个错误。

遍历器的本质，其实是使用yield语句暂停执行它后面的操作，当调用next方法时，再继续往下执行，直到遇到下一个yield语句，并返回该语句的值，如果直到运行结束。

如果next方法带一个参数，该参数就会被当作上一个yield语句的返回值。

{% highlight javascript %}

function* f() {
  for(var i=0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }

{% endhighlight %}

上面代码先定义了一个可以无限运行的generator函数f，如果next方法没有参数，正常情况下返回一个递增的i；如果next方法有参数，则上一次yield语句的返回值将会等于该参数。如果该参数为true，则会重置i的值。

generator函数的这种暂停执行的效果，意味着可以把异步操作写在yield语句里面，等到调用next方法时再往后执行。这实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在yield语句下面，反正要等到调用next方法时再执行。所以，generator函数的一个重要实际意义就是用来处理异步操作，改写回调函数。

{% highlight javascript %}

function* loadUI() { 
	showLoadingScreen(); 
	yield loadUIDataAsynchronously(); 
	hideLoadingScreen(); 
} 

{% endhighlight %}

上面代码表示，第一次调用loadUI函数时，该函数不会执行，仅返回一个遍历器。下一次对该遍历器调用next方法，则会显示登录窗口，并且异步加载数据。再一次使用next方法，则会隐藏登录窗口。可以看到，这种写法的好处是所有登录窗口的逻辑，都被封装在一个函数，按部就班非常清晰。

下面是一个利用generator函数，实现斐波那契数列的例子。

{% highlight javascript %}

function* fibonacci() {
	var previous = 0, current = 1; 
	while (true) { 
		var temp = previous; 
		previous = current; 
		current = temp + current; 
		yield current; 
	} 
} 

for (var i of fibonacci()) { 
	console.log(i); 
} 
// 1, 2, 3, 5, 8, 13, ..., 

{% endhighlight %}

下面是利用for...of语句，对斐波那契数列的另一种实现。

{% highlight javascript %}

function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

for (n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
}

{% endhighlight %}

从上面代码可见，使用for...of语句时不需要使用next方法。

这里需要注意的是，yield语句运行的时候是同步运行，而不是异步运行（否则就失去了取代回调函数的设计目的了）。实际操作中，一般让yield语句返回Promises对象。

{% highlight javascript %}

var Q = require('q');
 
function delay(milliseconds) {
    var deferred = Q.defer();
    setTimeout(deferred.resolve, milliseconds);
    return deferred.promise;
}

function *f(){
    yield delay(100);
};

{% endhighlight %}

上面代码yield语句返回的就是一个Promises对象。

如果有一系列任务需要全部完成后，才能进行下一步操作，yield语句后面可以跟一个数组。下面就是一个例子。

{% highlight javascript %}

function *f() {
    var urls = [
        'http://example.com/',
        'http://twitter.com/',
        'http://bbc.co.uk/news/'
    ];
    var arrayOfPromises = urls.map(someOperation);

    var arrayOfResponses = yield arrayOfPromises;
 
    this.body = "Results";
    for (var i = 0; i < urls.length; i++) {
        this.body += '\n' + urls[i] + ' response length is '
              + arrayOfResponses[i].body.length;
    }
};

{% endhighlight %}

### 原生对象的扩展

ES6对JavaScript的原生对象，进行了扩展，提供了一系列新的属性和方法。

{% highlight javascript %}

Number.EPSILON
Number.isInteger(Infinity) // false
Number.isNaN("NaN") // false

Math.acosh(3) // 1.762747174039086
Math.hypot(3, 4) // 5
Math.imul(Math.pow(2, 32) - 1, Math.pow(2, 32) - 2) // 2

"abcde".contains("cd") // true
"abc".repeat(3) // "abcabcabc"

Array.from(document.querySelectorAll('*')) // Returns a real Array
Array.of(1, 2, 3) // Similar to new Array(...), but without special one-arg behavior
[0, 0, 0].fill(7, 1) // [0,7,7]
[1,2,3].findIndex(x => x == 2) // 1
["a", "b", "c"].entries() // iterator [0, "a"], [1,"b"], [2,"c"]
["a", "b", "c"].keys() // iterator 0, 1, 2
["a", "b", "c"].values() // iterator "a", "b", "c"

Object.assign(Point, { origin: new Point(0,0) })

{% endhighlight %}

## 语法糖

ECMAScript 6提供了很多JavaScript语法的便捷写法。

### 二进制和八进制表示法

ES6提供了二进制和八进制数值的新的写法，分别用前缀0b和0o表示。

{% highlight javascript %}

0b111110111 === 503 // true
0o767 === 503 // true

{% endhighlight %}

### 增强的对象写法

ES6允许直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。

{% highlight javascript %}

var Person = {
  name: '张三',
  //等同于birth: birth
  birth,
  // 等同于hello: function ()...
  hello() { console.log('我的名字是', this.name); }
};

{% endhighlight %}

### 箭头函数（arrow）

**（1）定义**

ES6允许使用“箭头”（=>）定义函数。

{% highlight javascript %}

var f = v => v;

{% endhighlight %}

上面的箭头函数等同于：

{% highlight javascript %}

var f = function(v) {
    return v;
};

{% endhighlight %}

如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。

{% highlight javascript %}

var f = () => 5; 
// 等同于
var f = function (){ return 5 };

var sum = (num1, num2) => num1 + num2;
// 等同于
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

**（2）实例：回调函数的简化**

箭头函数的一个用处是简化回调函数。

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

**（3）注意点**

箭头函数有几个使用注意点。

- 函数体内的this对象，绑定定义时所在的对象，而不是使用时所在的对象。
- 不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
- 不可以使用arguments对象，该对象在函数体内不存在。 

关于this对象，下面的代码将它绑定定义时的对象。

{% highlight javascript %}

var handler = {

    id: "123456",

    init: function() {
        document.addEventListener("click",
                event => this.doSomething(event.type), false);
    },

    doSomething: function(type) {
        console.log("Handling " + type  + " for " + this.id);
    }
};

{% endhighlight %}

上面代码的init和doSomething方法中，都使用了箭头函数，它们中的this都绑定handler对象。否则，doSomething方法内部的this对象就指向全局对象，运行时会报错。

### 函数参数的默认值

ECMAScript 6 允许为函数的参数设置默认值。

{% highlight javascript %}

function Point(x = 0, y = 0) {
   this.x = x;
   this.y = y;
}

var p = new Point(); 
// p = { x:0, y:0 }

{% endhighlight %}

### 模板字符串

模板字符串（template string）是增强版的字符串，即可以当作普通字符串使用，也可以在字符串中嵌入变量。它用反引号（`）标识。

{% highlight javascript %}

// 普通字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
 not legal.`

// 字符串中嵌入变量
var name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`

var x = 1;
var y = 2;
console.log(`${ x } + ${ y } = ${ x + y}`) 
// "1 + 2 = 3"

{% endhighlight %}

### for...of循环

JavaScript原有的for...in循环，只能获得对象的键名，不能直接获取键值。ES6提供for...of循环，允许遍历获得键值。

{% highlight javascript %}

var arr = ["a", "b", "c", "d"];
for (a in arr) {
  console.log(a);
}
// 0
// 1
// 2
// 3

for (a of arr) {
  console.log(a); 
}
// a
// b
// c
// d

{% endhighlight %}

上面代码表明，for...in循环读取键名，for...of循环读取键值。

for...of循环还可以遍历对象。

{% highlight javascript %}

var es6 = {
  edition: 6,
  committee: "TC39",
  standard: "ECMA-262"
};

for (e in es6) {
  console.log(e);
}
// edition
// committee
// standard

var engines = Set(["Gecko", "Trident", "Webkit", "Webkit"]);
for (var e of engines) {
    console.log(e);
}
// Gecko
// Trident
// Webkit

var es6 = new Map();
es6.set("edition", 6);
es6.set("committee", "TC39");
es6.set("standard", "ECMA-262");
for (var [name, value] of es6) {
  console.log(name + ": " + value);
}
// edition: 6
// committee: TC39
// standard: ECMA-262

{% endhighlight %}

上面代码一共包含三个例子，第一个是for...in循环的例子，后两个是for...of循环的例子。最后一个例子是同时遍历对象的键名和键值。

### 数组推导

**（1）基本用法**

ES6提供简洁写法，允许直接通过现有数组生成新数组，这被称为数组推导（array comprehension）。

{% highlight javascript %}

var a1 = [1, 2, 3, 4];
var a2 = [i * 2 for (i of a1)];

a2 // [2, 4, 6, 8]

{% endhighlight %}

上面代码表示，通过for...of结构，数组a2直接在a1的基础上生成。

数组推导可以替代map和filter方法。

{% highlight javascript %}

[for (i of [1, 2, 3]) i * i];
// 等价于
[1, 2, 3].map(function (i) { return i * i });

[i for (i of [1,4,2,3,-8]) if (i < 3)];
// 等价于
[1,4,2,3,-8].filter(function(i) { return i < 3 });

{% endhighlight %}

上面代码说明，模拟map功能只要单纯的for...of循环就行了，模拟filter功能除了for...of循环，还必须加上if语句。

**（2）多重推导**

新引入的for...of结构，可以直接跟在表达式的前面或后面，甚至可以在一个数组推导中，使用多个for...of结构。

{% highlight javascript %}

var a1 = ["x1", "y1"];
var a2 = ["x2", "y2"];
var a3 = ["x3", "y3"];

[(console.log(s + w + r)) for (s of a1) for (w of a2) for (r of a3)];
// x1x2x3
// x1x2y3
// x1y2x3
// x1y2y3
// y1x2x3
// y1x2y3
// y1y2x3
// y1y2y3

{% endhighlight %}

上面代码在一个数组推导之中，使用了三个for...of结构。

需要注意的是，数组推导的方括号构成了一个单独的作用域，在这个方括号中声明的变量类似于使用let语句声明的变量。

**（3）字符串推导**

由于字符串可以视为数组，因此字符串也可以直接用于数组推导。

{% highlight javascript %}

[c for (c of 'abcde') if (/[aeiou]/.test(c))].join('') // 'ae'

[c+'0' for (c of 'abcde')].join('') // 'a0b0c0d0e0'

{% endhighlight %}

上面代码使用了数组推导，对字符串进行处理。

上一部分的数组推导有一个缺点，就是新数组会立即在内存中生成。这时，如果原数组是一个很大的数组，将会非常耗费内存。

### 多变量赋值

ES6允许简洁地对多变量赋值。正常情况下，将数组元素赋值给多个变量，只能一次次分开赋值。

{% highlight javascript %}

var a = 1;
var b = 2;
var c = 3;

{% endhighlight %}

ES6允许写成下面这样。

{% highlight javascript %}

var [a, b, c] = [1, 2, 3];

{% endhighlight %}

本质上，这种写法属于模式匹配，只要等号两边的模式相同，左边的变量就会被赋予对应的值。下面是一些嵌套数组的例子。

{% highlight javascript %}

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

foo // "lorem"
bar // "ipsum"

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

这种写法的用途很多。

**（1）交换变量的值。**

{% highlight javascript %}

[x, y] = [y, x]; 

{% endhighlight %}

**（2）从函数返回多个值。**

{% highlight javascript %}

function example() {
    return [1, 2, 3];
}

var [a, b, c] = example();

{% endhighlight %}

**（3）函数参数的定义。**

{% highlight javascript %}

function f({p1, p2, p3}) {
  // ...
}

{% endhighlight %}

**（4）函数参数的默认值。**

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

## 数据结构

### class结构

**（1）基本用法**

ES6提供了“类”（class）。此前，一般用构造函数模拟“类”。

{% highlight javascript %}

// ES5
var Language = function(config) {
  this.name = config.name;
  this.founder = config.founder;
  this.year = config.year;
};

Language.prototype.summary = function() {
  return this.name+"由"+this.founder+"在"+this.year+"创造";
};

// ES6
class Language {
  constructor(name, founder, year) {
    this.name = name;
    this.founder = founder;
    this.year = year;
  }

  summary() {
    return this.name+"由"+this.founder+"在"+this.year+"创造";
  }
}

{% endhighlight %}

在上面代码中，ES6用constructor方法，代替ES5的构造函数。

**（2）继承**

ES6的class结构还允许使用extends关键字，表示继承。

{% highlight javascript %}

class MetaLanguage extends Language {
  constructor(x, y, z, version) {
    super(x, y, z);
    this.version = version;
  }
  summary() {
    //...
    super.summary();
  }
}

{% endhighlight %}

上面代码的super方法，表示调用父类的构造函数。

### module定义

**（1）基本用法**

ES6允许定义模块。也就是说，允许一个JavaScript脚本文件调用另一个脚本文件。

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

另一种写法是整体加载circle.js。

{% highlight javascript %}

// main.js

module circle from 'circle';

console.log("圆面积：" + circle.area(4));
console.log("圆周长：" + circle.circumference(14));

{% endhighlight %}

**（2）模块的继承**

一个模块也可以继承另一个模块。

{% highlight javascript %}

// circleplus.js

export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
    return Math.exp(x);
}

{% endhighlight %}

加载上面的模块。

{% highlight javascript %}

// main.js

module math from "circleplus";
import exp from "circleplus";
console.log(exp(math.pi);

{% endhighlight %}

**（3）模块的默认方法**

还可以为模块定义默认方法。

{% highlight javascript %}

// circleplus.js

export default function(x) {
    return Math.exp(x);
}

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
- Dale Schouten, [10 Ecmascript-6 tricks you can perform right now](http://html5hub.com/10-ecmascript-6-tricks-you-can-perform-right-now/)
- Mozilla Developer Network, [Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
- Steven Sanderson, [Experiments with Koa and JavaScript Generators](http://blog.stevensanderson.com/2013/12/21/experiments-with-koa-and-javascript-generators/)
- Matt Baker, [Replacing callbacks with ES6 Generators](http://flippinawesome.org/2014/02/10/replacing-callbacks-with-es6-generators/)
- Domenic Denicola, [ES6: The Awesome Parts](http://www.slideshare.net/domenicdenicola/es6-the-awesome-parts)
- Casper Beyer, [ECMAScript 6 Features and Tools](http://caspervonb.github.io/2014/03/05/ecmascript6-features-and-tools.html)
- Luke Hoban, [ES6 features](https://github.com/lukehoban/es6features)
