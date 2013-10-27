---
title: 函数
layout: page
category: grammar
date: 2012-12-15
modifiedOn: 2013-10-01
---

## 概述

### 函数的声明

函数就是使用function命令进行命名的、有名称的代码区块，便于反复调用。

{% highlight javascript %}

function print(){
	// ...
}

{% endhighlight %}

上面的代码命名了一个print函数，以后使用print()这种形式，就可以调用相应的代码。这叫做函数的声明（Function Declaration）。除了用function命令声明函数，还可以采用变量赋值的写法。

{% highlight javascript %}

var print = function (){
	// ...
};

{% endhighlight %}

这种写法将一个匿名函数赋值给变量。这时，这个匿名函数又称函数表达式（Function Expression），因为赋值语句的等号右侧只能放表达式。

采用函数表达式声明函数时，function命令后面不带有函数名。如果加上函数名，该函数名只在函数体内部有效，在函数体外部无效。

{% highlight javascript %}

var print = function x(){
	console.log(typeof x);
};

x
// ReferenceError: x is not defined

print()
// function

{% endhighlight %}

上面代码在函数表达式中，加入了函数名x。这个x只在函数体内部可用，指代函数表达式本身，其他地方都不可用。这种写法的用处有两个，一是可以在函数体内部调用自身，二是方便除错（除错工具显示函数调用栈时，将显示函数名，而不再显示这里是一个匿名函数）。因此，需要时，可以采用下面的形式声明函数。

{% highlight javascript %}

var f = function f(){};

{% endhighlight %}

需要注意的是，函数的表达式需要在语句的结尾加上分号，表示语句结束。而函数的声明在结尾的大括号后面不用加分号。总的来说，这两种声明函数的方式，差别很细微（参阅后文《变量提升》一节），这里可以近似认为是等价的。

除此之外，还有第三种声明函数的方式：通过Function构造函数声明。

{% highlight javascript %}

var add = new Function("x","y","return (x+y)");

{% endhighlight %}

在上面代码中，Function对象接受若干个参数，除了最后一个参数是add函数的“函数体”，其他参数都是add函数的参数。这种声明函数的方式非常不直观，几乎无人使用。

### 圆括号运算符和return语句

调用函数时，要使用圆括号运算符。圆括号之中，可以加入函数的参数。

{% highlight javascript %}

function add(x,y) {
	return x+y;
}

add(1,1)
// 2

{% endhighlight %}

函数体内部的return语句，表示返回。JavaScript引擎遇到return语句，就直接返回return后面的那个表达式的值，下面即使还有语句，也不会得到执行。

函数可以调用自身，这就是递归（recursion）。下面就是使用递归，计算斐波那契数列的代码。

{% highlight javascript %}

function fib(num) {
        if (num > 2) {
            return fib(num - 2) + fib(num - 1);
        } else {
            return 1;
        }
}

{% endhighlight %}

### 第一等公民

JavaScript的函数与其他数据类型处于同等地位，可以使用其他数据类型的地方就能使用函数。比如，可以把函数赋值给变量和对象的属性，也可以当作参数传入其他函数，或者作为函数的结果返回。这表示函数与其他数据类型的地方是平等，所以又称函数为第一等公民。

{% highlight javascript %}

function add(x,y){
	return x+y;
}

// 将函数赋值给一个变量
var a = add;

// 将函数作为参数和返回值
function a(op){
	return op;
}
a(add)(1,1)
// 2

{% endhighlight %}

### 函数名的提升

JavaScript引擎将函数名视同变量名，所以采用function命令声明函数时，整个函数会被提升到代码头部。所以，下面的代码不会报错。

{% highlight javascript %}

f();

function f(){}

{% endhighlight %}

表面上，上面代码好像在声明之前就调用了函数f。但是实际上，由于“变量提升”，函数f被提升到了代码头部，也就是在调用之前已经声明了。但是，如果采用赋值语句定义函数，JavaScript就会报错。

{% highlight javascript %}

f();

var f = function (){};

// TypeError: undefined is not a function

{% endhighlight %}

上面的代码等同于

{% highlight javascript %}

var f;

f();

f = function (){};

{% endhighlight %}

当调用f的时候，f只是被声明，还没有被赋值，等于undefined，所以会报错。因此，如果同时采用function命令和赋值语句声明同一个函数，最后总是采用赋值语句的定义。

{% highlight javascript %}

var f = function() {
  console.log ('1');
}
 
function f() {
  console.log('2');
}
 
f()
// 1

{% endhighlight %}

### 函数的重复声明

如果多次采用function命令，重复声明同一个函数，则后面的声明会覆盖前面的声明。

{% highlight javascript %}

function f(){ 
	console.log(1);
}

function f(){
	console.log(2);
}

f()
// 2

{% endhighlight %}

### 不能在条件语句中声明函数

同样由于函数名的提升，所以在条件语句中声明函数是无效的。

{% highlight javascript %}

if (false){
	function f(){}
}

f
// 不报错

{% endhighlight %}

由于函数f的声明被提升到了if语句的前面，导致if语句无效，所以上面的代码不会报错。要达到在条件语句中定义函数的目的，只有使用函数表达式。

{% highlight javascript %}

if (false){
	var f = function (){};
}

f
// undefined

{% endhighlight %}

## 函数作用域

### 定义

作用域（scope）指的是变量存在的范围。Javascript只有两种作用域：一种是全局作用域，变量在整个程序中一直存在；另一种是函数作用域，变量只在函数内部存在。

在函数外部声明的变量就是全局变量（global variable），它可以在函数内部读取。

{% highlight javascript %}

var v = 1;

function f(){
   console.log(v);
}

f()
// 1

{% endhighlight %}

上面的代码表明，函数f内部可以读取全局变量v。

在函数内部定义的变量，外部无法读取，称为“局部变量”（local variable）。

{% highlight javascript %}

function f(){
   var v = 1;
}

v
// ReferenceError: v is not defined

{% endhighlight %}

函数内部定义的变量，会在该作用域内覆盖同名全局变量。

{% highlight javascript %}

var v = 1; 

function f(){
   var v = 2;
   console.log(v);
}

f()
// 2

v
// 1

{% endhighlight %}

### 函数内部的变量提升

与全局作用域一样，函数作用域内部也会产生“变量提升”现象。var命令声明的变量，不管在什么位置，变量声明都会被提升到函数体的头部。

{% highlight javascript %}

function foo(x) {
    if (x > 100) {
         var tmp = x - 100;
    }
}

{% endhighlight %}

上面的代码等同于

{% highlight javascript %}

function foo(x) {
	var tmp;
    if (x > 100) {
        tmp = x - 100;
    }
}

{% endhighlight %}

## 参数

函数运行的时候，有时需要提供外部数据，不同的外部数据会得到不同的结果，这种外部数据就叫参数。

{% highlight javascript %}

function square(x){
	return x*x;
}

{% endhighlight %}

上式的x就是square函数的参数。每次运行的时候，需要提供这个值，否则得不到结果。

函数对象的length属性，返回函数定义中参数的个数。

{% highlight javascript %}

function f(a,b) {}

f.length
// 2

{% endhighlight %}

上面代码定义了空函数f，它的length属性就表示参数的个数。

### 参数的省略

参数不是必需的，Javascript语言允许省略参数。

{% highlight javascript %}

function f(a,b){
	return a;
}

f(1,2,3) // 1
f(1) // 1
f() // undefined

{% endhighlight %}

上面代码的函数f定义了两个参数，但是运行时无论提供多少个参数（或者不提供参数），JavaScript都不会报错。被省略的参数的值就变为undefined。

但是，没有办法只省略靠前的参数，而保留靠后的参数。如果一定要省略靠前的参数，只有显式传入undefined。

{% highlight javascript %}

function f(a,b){
	return a;
}

f(,1) // error
f(undefined,1) // undefined

{% endhighlight %}

### 默认值

通过下面的方法，可以为函数的参数设置默认值。 

{% highlight javascript %}

function f(a){
	a = a || 1;
	return a;
}

f('') // 1
f(0) // 1

{% endhighlight %}

上面代码的||表示“或运算”，即如果a有值，则返回a，否则返回事先设定的默认值（上例为1）。

这种写法会对a进行一次布尔运算，只有为true时，才会返回a。可是，除了undefined以外，0、空字符、null等的布尔值也是false。也就是说，在上面的函数中，不能让a等于0或空字符串，否则在明明有参数的情况下，也会返回默认值。

为了避免这个问题，可以采用下面更精确的写法。

{% highlight javascript %}

function f(a){
	(a !== undefined && a != null)?(a = a):(a = 1);
	return a;
}

f('') // ""
f(0) // 0

{% endhighlight %}

### 传递方式

原始类型的参数以传值（passes by value）的方式传递，复合类型的参数以传址（passes by reference）的方式传递。因此，在函数的内部修改复合类型的参数值，会影响到函数的外部。

{% highlight javascript %}

var o = {
	p:1
};

function f(obj){
	obj.p = 2;
}

f(o);

o.p
// 2

{% endhighlight %}

### 同名参数

如果有同名的参数，则取最后出现的那个值。

{% highlight javascript %}

function f(a, a){
	console.log(a);
}

f(1,2)
// 2

{% endhighlight %}

上面的函数f有两个参数，且参数名都是a。取值的时候，以后面的a为准。即使后面的a没有值或被省略，也是以其为准。

{% highlight javascript %}

function f(a, a){
	console.log(a);
}

f(1)
// undefined

{% endhighlight %}

调用函数f的时候，没有提供第二个参数，a的取值就变成了undefined。这时，如果要获得第一个a的值，可以使用arguments对象。

{% highlight javascript %}

function f(a, a){
	console.log(arguments[0]);
}

f(1)
// 1

{% endhighlight %}

### arguments对象

由于JavaScript允许函数有不定数目的参数，所以我们需要一种机制，可以在函数体内部读取所有参数。这就是arguments对象的由来。

arguments对象包含了函数运行时的所有参数，arguments[0]就是第一个参数，arguments[1]就是第二个参数，依次类推。这个对象只有在函数体内部，才可以使用。

{% highlight javascript %}

var f = function(one) {
  console.log(arguments[0]);
  console.log(arguments[1]);
  console.log(arguments[2]);
}

f(1, 2, 3)
// 1
// 2
// 3

{% endhighlight %}

arguments对象除了可以读取参数，还可以为参数赋值。

{% highlight javascript %}

var f = function(a,b) {
  arguments[0] = 3;
  arguments[1] = 2;
  return a+b;
}

f(1, 1)
// 5

{% endhighlight %}

可以通过arguments对象的length属性，判断函数调用时到底带几个参数。

{% highlight javascript %}

function f(){
	return arguments.length;
}

f(1,2,3)
// 3

f(1)
// 1

f()
// 0

{% endhighlight %}

需要注意的是，虽然arguments很像数组，但它是一个对象。某些用于数组的方法，可以直接用于arguments对象，比如函数的apply方法，或者数组合并的concat方法。

{% highlight javascript %}

// 用于函数的apply方法
myfunction.apply(obj, arguments).

// 与另一个数组合并
Array.prototype.concat.apply([1,2,3], arguments).

{% endhighlight %}

不过，大多数的数组方法，不能直接用于arguments对象，比如arguments.sort() 会报出TypeError。解决方法是将arguments转为真正的数组。下面是两种常用的转换方法：slice方法和逐一填入新数组。

{% highlight javascript %}

var args = Array.prototype.slice.call(arguments);

// or 

var args = [];
for(var i = 0; i < arguments.length; i++) {
	  args.push(arguments[i]);
}

{% endhighlight %}

arguments对象带有一个callee属性，返回它所对应的原函数。

{% highlight javascript %}

var f = function(one) {
  console.log(arguments.callee === f);
}

f()
// true

{% endhighlight %}

## 函数的其他知识点

### 闭包

闭包（closure）就是定义在函数体内部的函数。

{% highlight javascript %}

function f() {
    var c = function (){}; 
}

{% endhighlight %}

上面的代码中，c是定义在函数f内部的函数，就是闭包。

闭包的特点在于，c可以读取函数f的内部变量。

{% highlight javascript %}

function f() {
    var v = 1;

	var c = function (){
        return v;
    };

    return c;
}

var o = f();

o();
// 1

{% endhighlight %}

原来，在函数f外部，我们是没有办法读取内部变量v的。但是，借助闭包c，可以读到这个变量。

### 立即调用的函数表达式（IIFE）

在Javascript中，一对圆括号“()”是一种运算符，跟在函数名之后，表示调用该函数。比如，print()就表示调用print函数。

有时，我们需要在定义函数之后，立即调用该函数。这时，你不能在函数的定义之后加上圆括号，这会产生语法错误。

{% highlight javascript %}

function(){ /* code */ }();
// SyntaxError: Unexpected token (

{% endhighlight %}

产生这个错误的原因是，Javascript解释器看到function关键字之后，认为后面跟的是函数定义，不应该以圆括号结尾。

解决方法就是让解释器知道，圆括号前面的部分不是函数定义，而是一个表达式，可以对此进行运算。你可以这样写：

{% highlight javascript %}

(function(){ /* code */ }()); 

{% endhighlight %}

也可以这样写：

{% highlight javascript %}

(function(){ /* code */ })(); 

{% endhighlight %}

这两种写法都是以圆括号开头，解释器就会认为后面跟的是一个表示式，而不是函数定义，所以就避免了错误。这就叫做“立即调用的函数表达式”（Immediately-Invoked Function Expression），简称IIFE。

推而广之，任何让解释器以表达式来处理函数定义的方法，都能产生同样的效果，比如下面三种写法。

{% highlight javascript %}

var i = function(){ return 10; }();

true && function(){ /* code */ }();

0, function(){ /* code */ }();

{% endhighlight %}

甚至像这样写

{% highlight javascript %}

!function(){ /* code */ }();

~function(){ /* code */ }();

-function(){ /* code */ }();

+function(){ /* code */ }();

{% endhighlight %}

new关键字也能达到这个效果。

{% highlight javascript %}

new function(){ /* code */ }

new function(){ /* code */ }() // 只有传递参数时，才需要最后那个圆括号。

{% endhighlight %}

通常情况下，只对匿名函数使用这种“立即执行的函数表达式”。它的好处在于，因为调用的时候不必指定函数名，所以避免了污染全局变量。

## 参考链接

- [Immediately-Invoked Function Expression (IIFE)](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)
- Mark Daggett, [Functions Explained](http://markdaggett.com/blog/2013/02/15/functions-explained/)
- Juriy "kangax" Zaytsev, [Named function expressions demystified](http://kangax.github.com/nfe/)
- Marco Rogers polotek, [What is the arguments object?](http://docs.nodejitsu.com/articles/javascript-conventions/what-is-the-arguments-object)
