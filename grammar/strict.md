---
title: 严格模式
layout: page
category: grammar
date: 2013-01-11
modifiedOn: 2013-01-11
---

## 概述

除了Javascript正常的运行模式之外，ECMAscript 5添加了一种更严格的运行模式，就叫做“严格模式”。一些在正常模式下可以运行的语句，在“严格模式”下将不能运行。

严格模式的目的，主要有三个：

- 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
- 减少代码运行的一些不安全之处，保证代码运行的安全；
- 提高编译器效率，增加运行速度。

对下文严格模式的具体规定，都应该从这些角度去理解。

## 标识

严格模式的标识如下：

{% highlight javascript %}

 "use strict";

{% endhighlight %}

老版本的Javascript解释器，会把“use strict;”当作一个普通字符串，而忽略它。

## 调用

“严格模式”有两种调用方法，适用于不同的场合。

第一种方法针对整个脚本文件。

将"use strict"放在代码文件的第一行，则整个脚本都将以“严格模式”运行。如果这行语句不在第一行，则无效，整个脚本以“正常模式”运行。所以，如果不同的代码文件合并在一起，这一点是需要特别注意的。

{% highlight javascript %}

"use strict";

console.log("进入严格模式");

{% endhighlight %}

第二种方法针对单个函数。

将“use strict;”放在函数体的第一行，则整个函数以“严格模式”运行。

{% highlight javascript %}

function strict(){

  "use strict";

  return "这是严格模式。";
}

function notStrict() {
	
	return "这是正常模式。";

}

{% endhighlight %}

由于第一种方法不利于文件合并，推荐使用第二种方法，将整个脚本文件放在一个立即执行的匿名函数之中。

{% highlight javascript %}

(function (){
 
"use strict";

// some code here
 
 })();

{% endhighlight %}

## 严格模式下的变化

严格模式对Javascript的语法和运行行为，都做了一些改变。

### 全局变量显式声明

在正常模式中，如果一个变量没有声明就赋值，默认是全局变量。严格模式禁止这种用法，全局变量必须显式声明。

{% highlight javascript %}

"use strict";

v = 1; // 报错，v未声明

{% endhighlight %}

因此，严格模式下，变量都必须先用var命令声明，然后再使用。

### 静态绑定

严格模式只允许属性的静态绑定，不允许动态绑定。也就是说，某个属性到底归属哪个对象，不再留到运行时（runtime）决定了，而是在编译阶段就定下来。这有利于编译效率的提高，也使得代码更容易阅读，更少出现意外。

首先，禁止使用with语句，因为无法在编译时就确定属性到底归属哪个对象。

{% highlight javascript %}

"use strict";

var v  = 1;

with (o){ // 语法错误 

	v = 2;

}

{% endhighlight %}

其次，正常模式下，eval()语句的上下文（context），取决于它处于全局环境，还是函数环境；严格模式下，eval语句不再能够生成全局变量了，它生成的变量只能用于eval内部。

{% highlight javascript %}

"use strict";

var x = 2;

print(eval("var x = 5; x")); // 5

print(x); // 2

{% endhighlight %}

此外，eval不再允许自行赋值。

{% highlight javascript %}

"use strict";

eval = 17; // 语法错误

{% endhighlight %}

最后，严格模式禁止删除变量。

{% highlight javascript %}

"use strict";

var x;

delete x; // 语法错误

{% endhighlight %}

### 增强的安全措施

首先，严格模式禁止this关键字指向对局对象。

{% highlight javascript %}

function f(){
    return !this;
} 
// 返回false，因为“this”指向全局对象，“!this”就是false

function f(){   
    "use strict";
    return !this;
} 
// 返回true，因为严格模式下，this的值为undefined，所以"!this"为true。.

{% endhighlight %}

因此，使用构造函数时，如果忘了加new，this不再指向全局对象，而是报错。

{% highlight javascript %}

function f(){   
    "use strict";
    this.a =1;
};

f();// 报错，this未定义

{% endhighlight %}

其次，严格模式禁止在函数内部遍历调用栈。

{% highlight javascript %}

function f1(){

  "use strict";
  f1.caller;    // 报错
  f1.arguments; // 报错

}

f1();

{% endhighlight %}

### 显式报错

正常模式下，对一个对象的只读属性进行赋值，不会报错，只会默默地失败。严格模式下，将报错。

{% highlight javascript %}

"use strict";
 
var o = {};

Object.defineProperty(o, "v", { value: 1, writable: false });

o.v = 2; // 报错

{% endhighlight %}

严格模式下，对一个使用getter方法读取的属性进行赋值，会报错。

{% highlight javascript %}

"use strict";
 
var o = {
	
	get v() { return 1; } 

};

o.v = 2; // 报错

{% endhighlight %}

严格模式下，对禁止扩展的对象添加新属性，会报错。

{% highlight javascript %}

"use strict";

var o = {};

Object.preventExtensions(o);

o.v = 1; // 报错

{% endhighlight %}

严格模式下，删除一个不可删除的属性，会报错。

{% highlight javascript %}

"use strict";

delete Object.prototype; // 报错

{% endhighlight %}

### 新增的语法错误

严格模式新增了一些语法错误。

首先，对象不能有重名的属性。（正常模式下，最后赋值的属性会覆盖前面的值。）

{% highlight javascript %}

"use strict";

var o = {
	p: 1,
	p: 2
}; // 语法错误

{% endhighlight %}

其次，函数不能有重名的参数。（正常模式下，重名的参数可以用arguments[i]读取。）

{% highlight javascript %}

"use strict";

function f(a, a, b) { // 语法错误  

	return ; 

}

{% endhighlight %}

### 禁止八进制表示法

正常模式下，整数的第一位如果是0，表示这是八进制数，比如0100等于十进制的64。严格模式禁止这种表示法，整数第一位为0，将报错。

{% highlight javascript %}

"use strict";

var n = 0100; // 语法错误

{% endhighlight %}

### 对arguments对象的限制

arguments是函数的参数对象，严格模式对它的使用做了限制。

首先，这个变量不允许自行赋值。

{% highlight javascript %}

"use strict";

arguments++; // 语法错误

var obj = { set p(arguments) { } };  // 语法错误

try { } catch (arguments) { }  // 语法错误

function arguments() { }  // 语法错误

var f = new Function("arguments", "'use strict'; return 17;");  // 语法错误

{% endhighlight %}

其次，arguments对象不再追踪参数的变化。

{% highlight javascript %}

function f(a) {
  a = 2;
  return [a, arguments[0]];
}

f(1); // 正常模式为[2,2]

function f(a) {
  "use strict";	
  a = 2;
  return [a, arguments[0]];
}

f(1); // 严格模式为[2,1]

{% endhighlight %}

再次，禁止使用arguments.callee。

{% highlight javascript %}

"use strict";

var f = function() { return arguments.callee; };

f(); // 报错

{% endhighlight %}

### 保留字

首先，为了向未来版本的Javascript过渡，严格模式新增了一些保留字，使用这些词作为变量名将会报错：implements, interface, let, package, private, protected, public, static, yield。

{% highlight javascript %}

function package(protected) { // 语法错误

  "use strict";

  var implements; // 语法错误

}

{% endhighlight %}

此外，ECMAscript 5本身还规定了一些保留字：class, enum, export, extends, import, super，也是不能使用的。

### 函数必须声明在顶层

为了与以后版本的Javascript接轨，严格模式只允许在全局环境或代码环境的顶层声明函数。也就是说，不允许在非函数的代码块内声明函数。

{% highlight javascript %}

"use strict";

if (true) {

  function f() { } // 语法错误

}

for (var i = 0; i < 5; i++) {

  function f2() { } // 语法错误

}

{% endhighlight %}

## 参考链接

- MDN, [Strict mode](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/Strict_mode)
- Dr. Axel Rauschmayer, [JavaScript: Why the hatred for strict mode?](http://www.2ality.com/2011/10/strict-mode-hatred.html)
- Dr. Axel Rauschmayer，[JavaScript’s strict mode: a summary](http://www.2ality.com/2011/01/javascripts-strict-mode-summary.html)
- Douglas Crockford, [Strict Mode Is Coming To Town](http://www.yuiblog.com/blog/2010/12/14/strict-mode-is-coming-to-town/)
