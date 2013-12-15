---
title: ECMAScript 6 介绍
layout: page
category: oop
date: 2013-05-09
modifiedOn: 2013-12-15
---

## 概述

ECMAScript 6 是JavaScript的下一代标准，正处在快速开发之中，大部分已经完成了，预计将在2014年正式发布。Mozilla将在这个标准的基础上，推出JavaScript 2.0。

ECMAScript 6的目标，是使得JavaScript可以用来编写复杂的应用程序、函数库和代码的自动生成器（code generator）。

最新的浏览器已经部分支持ECMAScript 6 的语法，可以通过[《ECMAScript 6 浏览器兼容表》](http://kangax.github.io/es5-compat-table/es6/)查看浏览器支持情况。

下面对ECMAScript 6新增的语法特性逐一介绍。

## 数据类型

### let命令

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

下面的代码如果使用var，最后输出的是10。

{% highlight javascript %}

var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 10

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

> 需要注意的是，let声明的变量不存在“变量提升”现象。

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

ECMAScript 6 提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

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

s.add("1"); 
s.add("2");
e.add("2"); // 注意“2”被加入了两次

e.has("1")    // true
e.has("2")    // true
e.has("3")   // false

e.delete("2");
e.has("2")    // false

{% endhighlight %}

### Map数据结构

ECMAScript 6还提供了map数据结构。它类似于对象，就是一个键值对的集合，但是“键”的范围不限于字符串，甚至对象也可以当作键。。

{% highlight javascript %}

var m = new Map();
o = {p: "Hello World"};
m.set(o, "content")
console.log(m.get(o))
// "content"

{% endhighlight %}

上面代码将一个对象当作m的一个属性名。

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

### rest运算符

ECMAScript 6引入rest运算符（...），用于获取函数的多余参数，这样就不需要通过arguments对象，获取函数的参数个数了。rest运算符后面是一个数组变量，该变量将多余的参数放入数组中。

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

rest运算符不仅可以用于函数定义，还可以用于函数调用。

{% highlight javascript %}

function f(s1, s2, s3, s4, s5) {
 	console.log(s1 + s2 + s3 + s4 +s5);
}

var a = ["a2", "a3", "a4", "a5"];

f("a1", ...a);

{% endhighlight %}

从上面的例子可以看出，rest运算符的另一个重要作用是，可以将数组转变成正常的参数序列。

{% highlight javascript %}

// ES5写法
Math.max.apply(null, [14, 3, 77])

// ES6写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);

{% endhighlight %}

上面代码表示，用于JavaScript不提供求数组最大元素的函数，所以只能套用Math.max函数，将数组转为一个参数序列，然后求最大值。有了rest运算符以后，就可以直接用Math.max了。

### 遍历器（Iterator）

遍历器（Iterator）是一个对象，用于从一个集合中按照某种顺序一次取出一个成员，而且还保持当前位置的记录。遍历器自带的next方法，用于返回当前位置的成员，然后把指针移到下一个成员。

{% highlight javascript %}

var o = { p1: 1, p2: 2 };
var i = Iterator(o);

i.next() // ["p1", 1]
i.next() // ["p2", 2]
i.next() // 抛出一个StopIteration异常

{% endhighlight %}

上面代码表示，next方法返回一个数组，数组成员分别是原对象当前位置的键和值。当原对象所有成员都取出以后，再调用next方法，将抛出一个StopIteration意外。

除了使用next方法，for...in也可以通过遍历器取出所有成员。

{% highlight javascript %}

var i = Iterator(o);
for (var item in i){
  console.log(item);
}

{% endhighlight %}

上面代码通过for...in结构使用遍历器，与前一段使用next方法的代码是等价的。

Iterator方法除了用于对象，还可以用于数组。

{% highlight javascript %}

var a = ['a', 'b', 'c'];
var i = Iterator(a);

for (var item in i){
  console.log(item); 
}
// [0, "a"]
// [1, "b"]
// [2, "c"]

{% endhighlight %}

上面代码表示，通过遍历器取出的每一个数组成员，也是数组形式，包括数字键名和键值。

Iterator构造函数可以接受第二个参数，类型为布尔值，默认为false。如果为true，表示只返回非数组形式的键名，不返回键值。

{% highlight javascript %}

var a = ['a', 'b', 'c'];
var i = Iterator(a, true);

for (var item in i){
  console.log(item); 
}
// 0
// 1
// 2

{% endhighlight %}

上面代码对Iterator构造函数加入了第二个参数，使得遍历器只返回键名。

默认的遍历器逻辑是依次取出集合的每个成员，你也可以自定义遍历器逻辑。

{% highlight javascript %}

function Range(low, high){
  this.low = low;
  this.high = high;
}

{% endhighlight %}

上面代码定义了一个Range构造函数，通过这个构造函数生成的对象实例，都有low和high两个属性。对于自定义遍历器逻辑，这两个属性是必须的。

然后在这个对象的prototype属性上面，加上一个__iterator__（注意前后各两个下划线）方法。

{% highlight javascript %}

Range.prototype.__iterator__ = function(){
  return new RangeIterator(this);
};

{% endhighlight %}

上面代码中的__iterator__方法表示该对象内部调用的遍历器逻辑。

最后，定义对象内部的遍历器对象。

{% highlight javascript %}

function RangeIterator(range){
  this.range = range;
  this.current = this.range.low;
}

RangeIterator.prototype.next = function(){
  if (this.current > this.range.high)
    throw StopIteration;
  else
    return this.current++;
};

{% endhighlight %}

上面代码中的遍历器实例，需要定义range属性、current属性和next方法。

如果使用下一节要讲到的generator函数，__iterator__方法的代码可以大大简化。

如果使用下一部分要讲到的yield语句，上面函数

{% highlight javascript %}

Range.prototype.__iterator__ = function(){
  for (var i = this.low; i <= this.high; i++)
    yield i;
};

{% endhighlight %}

定义完成以后，上面这个Range对象就具备了自定义的遍历器逻辑。

{% highlight javascript %}

var range = new Range(3, 5);
for (var i in range){
  console.log(i); 
}
// 3
// 4
// 5

{% endhighlight %}

### generator 函数

上一部分的遍历器，用来依次取出集合中的每一个成员，但是某些情况下，我们需要的是一个内部状态的遍历器。也就是说，每调用一次遍历器，对象的内部状态发生一次改变（可以理解成发生某些事件）。ECMAScript 6 引入了generator函数，作用就是返回一个内部状态的遍历器，主要特征是内部使用了yield语句。

当调用generator函数的时候，该函数并不执行，而是返回一个遍历器。以后，每次调用这个遍历器的next方法，就从函数体的头部或者上一次停下来的地方开始执行，直到遇到下一个yield语句为止，并返回该yield语句的值。如果遇到函数执行完毕或者return语句，就会抛出一个StopIteration异常。

{% highlight javascript %}

function simpleGenerator(){
  yield "first";
  yield "second";
  yield "third";
}

var g = simpleGenerator();

g.next() // "first"
g.next() // "second"
g.next() // "third"
g.next() // StopIteration异常

{% endhighlight %}

上面代码依次执行了四次next方法，前三次都依次返回一个yield语句的值，最后一次返回一个StopIteration异常。

斐波那契数列使用generator函数的写法如下。

{% highlight javascript %}

function fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

var f = fibonacci();
f.next() // 1
f.next() // 2
f.next() // 3
f.next() // 5
f.next() // 8
f.next() // 13
f.next() // 21

{% endhighlight %}

由于generator函数返回的是一个遍历器，因此除了next方法，还可以使用for...of结构。上面的斐波那契函数，也可以使用for...of结构进行运行。

{% highlight javascript %}

var f = fibonacci();
for (n of f) {
    if (n > 8) break;
    console.log(n);
}
// 1
// 2
// 3
// 5
// 8

{% endhighlight %}

如果generator函数带有参数，该参数只在第一次执行的时候传入函数体。

{% highlight javascript %}

function fibonacci(limit) {
    let [prev, curr] = [0, 1];
    for (;;) {
        [prev, curr] = [curr, prev + curr];
		if (limit && current > limit){
			return;
		}
        yield curr;
    }
}

{% endhighlight %}

上面代码为斐波那契函数设置了一个极限值，如果当前值超过极限值，就不再往下计算了。

generator函数还支持send方法，该方法的参数将作为上一次yield语句的值，然后返回下一个yield语句的值。

{% highlight javascript %}

function simpleGenerator (){
	var a = 1;
	var b = a+1;
	yield a;
	var cond = yield b;
	if (cond){ 
		b = a+2; 
	}
	yield b;
}

var g = simpleGenerator(); 
g.next() // 1
g.next() // 2
g.send(true) // 3

{% endhighlight %}

上面代码使用send方法重置了上一个yield语句的值，所以返回值为3，而不是2。需要注意的是，send方法必须在next方法之后使用，否则会报错。

generator函数还有一个close方法，用于立即终止函数的运行。

yield语句具有分阶段执行函数的效果，这意味着可以把异步操作写在yield语句里面，等到调用next方法时再往后执行。这实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在yield语句下面，反正要等到next方法时再执行。所以，generator函数的一个重要实际意义就是用来处理异步操作，改写回调函数。

## 语法糖

ECMAScript 6提供了很多JavaScript语法的便捷写法。

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

### 数组推导

ECMAScript 6提供简洁写法，允许直接通过现有数组生成新数组，这被称为数组推导（array comprehension）。

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

由于字符串可以视为数组，因此字符串也可以直接用于数组推导。

{% highlight javascript %}

[c for (c of 'abcde') if (/[aeiou]/.test(c))].join('') // 'ae'

[c+'0' for (c of 'abcde')].join('') // 'a0b0c0d0e0'

{% endhighlight %}

上面代码使用了数组推导，对字符串进行处理。

上一部分的数组推导有一个缺点，就是新数组会立即在内存中生成。这时，如果原数组是一个很大的数组，将会非常耗费内存。

### 多变量赋值

ECMAScript 6 允许简洁地对多变量赋值。正常情况下，将数组元素赋值给多个变量，只能一次次分开赋值。

{% highlight javascript %}

var a = 1;
var b = 2;
var c = 3;

{% endhighlight %}

在ECMAScript 6 中可以写成

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
- Dale Schouten, [10 Ecmascript-6 tricks you can perform right now](http://html5hub.com/10-ecmascript-6-tricks-you-can-perform-right-now/)
- Mozilla Developer Network, [Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
