---
title: 函数
layout: page
category: grammar
date: 2012-12-15
modifiedOn: 2013-12-19
---

## 概述

### 函数的声明

**（1）function命令**

函数就是使用function命令命名的代码区块，便于反复调用。

{% highlight javascript %}

function print(){
	// ...
}

{% endhighlight %}

上面的代码命名了一个print函数，以后使用print()这种形式，就可以调用相应的代码。这叫做函数的声明（Function Declaration）。

**（2）函数表达式**

除了用function命令声明函数，还可以采用变量赋值的写法。

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

**（3）Function构造函数**

还有第三种声明函数的方式：通过Function构造函数声明。

{% highlight javascript %}

var add = new Function("x","y","return (x+y)");

{% endhighlight %}

在上面代码中，Function对象接受若干个参数，除了最后一个参数是add函数的“函数体”，其他参数都是add函数的参数。这种声明函数的方式非常不直观，几乎无人使用。

**（4）函数的重复声明**

如果多次采用function命令，重复声明同一个函数，则后面的声明会覆盖前面的声明。

{% highlight javascript %}

function f(){ 
	console.log(1);
}

f() // 2

function f(){
	console.log(2);
}

f() // 2

{% endhighlight %}

上面代码说明，由于存在函数名的提升，前面的声明在任何时候都是无效的，这一点要特别注意。

### 圆括号运算符和return语句

调用函数时，要使用圆括号运算符。圆括号之中，可以加入函数的参数。

{% highlight javascript %}

function add(x,y) {
	return x+y;
}

add(1,1) // 2

{% endhighlight %}

函数体内部的return语句，表示返回。JavaScript引擎遇到return语句，就直接返回return后面的那个表达式的值，后面即使还有语句，也不会得到执行。也就是说，return语句所带的那个表达式，就是函数的返回值。return语句不是必需的，如果没有的话，该函数就不返回任何值，或者说返回undefined。

函数可以调用自身，这就是递归（recursion）。下面就是使用递归，计算斐波那契数列的代码。

{% highlight javascript %}

function fib(num) {
  if (num > 2) {
    return fib(num - 2) + fib(num - 1);
  } else {
    return 1;
  }
}

fib(6)
// 8

{% endhighlight %}

### 第一等公民

JavaScript的函数与其他数据类型处于同等地位，可以使用其他数据类型的地方就能使用函数。比如，可以把函数赋值给变量和对象的属性，也可以当作参数传入其他函数，或者作为函数的结果返回。这表示函数与其他数据类型的地方是平等，所以又称函数为第一等公民。

{% highlight javascript %}

function add(x,y){
	return x+y;
}

// 将函数赋值给一个变量
var operator = add;

// 将函数作为参数和返回值
function a(op){
	return op;
}
a(add)(1,1)
// 2

{% endhighlight %}

### 函数名的提升

JavaScript引擎将函数名视同变量名，所以采用function命令声明函数时，整个函数会被提升到代码头部。所以，下面的代码不会报错。

```javascript

f();
function f(){}

```

表面上，上面代码好像在声明之前就调用了函数f。但是实际上，由于“变量提升”，函数f被提升到了代码头部，也就是在调用之前已经声明了。但是，如果采用赋值语句定义函数，JavaScript就会报错。

```javascript

f();
var f = function (){};
// TypeError: undefined is not a function

```

上面的代码等同于

```javascript

var f;
f();
f = function (){};

```

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

### 不能在条件语句中声明函数

根据ECMAScript的规范，不得在非函数的代码块中声明函数，最常见的情况就是if和try语句。

```javascript

if (foo) {
  function x() { return; }
}

try {
  function x() {return; }
} catch(e) { 
  console.log(e) 
}

```

上面代码分别在if代码块和try代码块中声明了两个函数，按照语言规范，这是不合法的。但是，实际情况是各家浏览器往往并不报错，能够运行。

但是由于存在函数名的提升，所以在条件语句中声明函数是无效的，这是非常容易出错的地方。

{% highlight javascript %}

if (false){
	function f(){}
}

f()
// 不报错

{% endhighlight %}

由于函数f的声明被提升到了if语句的前面，导致if语句无效，所以上面的代码不会报错。要达到在条件语句中定义函数的目的，只有使用函数表达式。

{% highlight javascript %}

if (false){
	var f = function (){};
}

f()
// undefined

{% endhighlight %}

### name属性

大多数JavaScript引擎，支持函数的非标准的name属性。该属性返回函数名。

{% highlight javascript %}

function f1() {}
f1.name // 'f1'

var f2 = function () {};
f2.name // ''

var f3 = function myName() {};
f3.name // 'myName'

{% endhighlight %}

上面代码说明，对于函数语句，name属性返回函数名；对于函数表达式，返回表达式中的函数名（对于匿名函数，就是返回空字符串）。 

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

### 概述

函数运行的时候，有时需要提供外部数据，不同的外部数据会得到不同的结果，这种外部数据就叫参数。

{% highlight javascript %}

function square(x){
	return x*x;
}

square(2) // 4
square(3) // 9

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

f.length // 2

{% endhighlight %}

上面代码的函数f定义了两个参数，但是运行时无论提供多少个参数（或者不提供参数），JavaScript都不会报错。被省略的参数的值就变为undefined。需要注意的是，函数的length属性与实际传入的参数个数无关，只反映定义时的参数个数。

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

JavaScript的函数参数传递方式是传值传递（passes by value），这意味着，在函数体内修改参数值，不会影响到函数外部。

{% highlight javascript %}

// 修改原始类型的参数值
var p = 2; 

function f(p){
	p = 3;
}

f(p);
p // 2

// 修改复合类型的参数值
var o = [1,2,3];

function f(o){
	o = [2,3,4];
}

f(o);
o // [1, 2, 3]

{% endhighlight %}

上面代码分成两段，分别修改原始类型的参数值和复合类型的参数值。两种情况下，函数内部修改参数值，都不会影响到函数外部。

需要十分注意的是，虽然参数本身是传值传递，但是对于复合类型的变量来说，属性值是传址传递（pass by reference），也就是说，属性值是通过地址读取的。所以在函数体内修改复合类型变量的属性值，会影响到函数外部。

{% highlight javascript %}

// 修改对象的属性值
var o = { p:1 };

function f(obj){
	obj.p = 2;
}

f(o);
o.p // 2

// 修改数组的属性值
var a = [1,2,3];

function f(a){
	a[0]=4;
}

f(a);
a // [4,2,3]

{% endhighlight %}

上面代码在函数体内，分别修改对象和数组的属性值，结果都影响到了函数外部，这证明复合类型变量的属性值是传址传递。

某些情况下，如果需要对某个变量达到传址传递的效果，可以将它写成全局对象的属性。

{% highlight javascript %}

var a = 1;

function f(p){
	window[p]=2;
}

f('a');

a // 2

{% endhighlight %}

上面代码中，变量a本来是传值传递，但是写成window对象的属性，就达到了传址传递的效果。

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

**（1）定义**

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

arguments对象除了可以读取参数，还可以为参数赋值（严格模式不允许这种用法）。

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

f(1,2,3) // 3
f(1) // 1
f() // 0

{% endhighlight %}

**（2）与数组的关系**

需要注意的是，虽然arguments很像数组，但它是一个对象。某些用于数组的方法（比如slice和forEach方法），不能在arguments对象上使用。

但是，有时arguments可以像数组一样，用在某些只用于数组的方法。比如，用在apply方法中，或使用concat方法完成数组合并。

{% highlight javascript %}

// 用于apply方法
myfunction.apply(obj, arguments).

// 使用与另一个数组合并
Array.prototype.concat.apply([1,2,3], arguments)

{% endhighlight %}

要让arguments对象使用数组方法，真正的解决方法是将arguments转为真正的数组。下面是两种常用的转换方法：slice方法和逐一填入新数组。

{% highlight javascript %}

var args = Array.prototype.slice.call(arguments);

// or 

var args = [];
for(var i = 0; i < arguments.length; i++) {
	  args.push(arguments[i]);
}

{% endhighlight %}

**（3）callee属性**

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

闭包（closure）就是定义在函数体内部的函数。更理论性的表达是，闭包是函数与其生成时所在的作用域对象（scope object）的一种结合。

{% highlight javascript %}

function f() {
    var c = function (){}; 
}

{% endhighlight %}

上面的代码中，c是定义在函数f内部的函数，就是闭包。

闭包的特点在于，在函数外部可以读取函数的内部变量。

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

上面代码表示，原先在函数f外部，我们是没有办法读取内部变量v的。但是，借助闭包c，可以读到这个变量。

闭包不仅可以读取函数内部变量，还可以使得内部变量记住上一次调用时的运算结果。

{% highlight javascript %}

function createIncrementor(start) {
        return function () { 
            return start++;
        }
}

var inc = createIncrementor(5);

inc() // 5
inc() // 6
inc() // 7

{% endhighlight %}

上面代码表示，函数内部的start变量，每一次调用时都是在上一次调用时的值的基础上进行计算的。 

### 立即调用的函数表达式（IIFE）

在Javascript中，一对圆括号“()”是一种运算符，跟在函数名之后，表示调用该函数。比如，print()就表示调用print函数。

有时，我们需要在定义函数之后，立即调用该函数。这时，你不能在函数的定义之后加上圆括号，这会产生语法错误。

{% highlight javascript %}

function(){ /* code */ }();
// SyntaxError: Unexpected token (

{% endhighlight %}

产生这个错误的原因是，Javascript引擎看到function关键字之后，认为后面跟的是函数定义语句，不应该以圆括号结尾。

解决方法就是让引擎知道，圆括号前面的部分不是函数定义语句，而是一个表达式，可以对此进行运算。你可以这样写：

{% highlight javascript %}

(function(){ /* code */ }()); 

// 或者

(function(){ /* code */ })(); 

{% endhighlight %}

这两种写法都是以圆括号开头，引擎就会认为后面跟的是一个表示式，而不是函数定义，所以就避免了错误。这就叫做“立即调用的函数表达式”（Immediately-Invoked Function Expression），简称IIFE。

> 注意，上面的两种写法的结尾，都必须加上分号。

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

通常情况下，只对匿名函数使用这种“立即执行的函数表达式”。它的目的有两个：一是不必为函数命名，避免了污染全局变量；二是IIFE内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量。

{% highlight javascript %}

// 写法一
var tmp = newData;
processData(tmp);
storeData(tmp);

// 写法二
(function (){
  var tmp = newData;
  processData(tmp);
  storeData(tmp);
}()); 

{% endhighlight %}

上面代码中，写法二比写法一更好，因为完全避免了污染全局变量。

## eval命令

eval命令的作用是，将字符串当作语句执行。

{% highlight javascript %}

eval('var a = 1;');

a // 1

{% endhighlight %}

上面代码将字符串当作语句运行，生成了变量a。

放在eval中的字符串，应该有独自存在的意义，不能用来与eval以外的命令配合使用。举例来说，下面的代码将会报错。

{% highlight javascript %}

eval('return;');

{% endhighlight %}

由于eval没有自己的作用域，都在当前作用域内执行，因此可能会修改其他外部变量的值，造成安全问题。

{% highlight javascript %}

var a = 1;
eval('a = 2');

a // 2

{% endhighlight %}

上面代码中，eval命令修改了外部变量a的值。由于这个原因，所以eval有安全风险，无法做到作用域隔离，最好不要使用。此外，eval的命令字符串不会得到JavaScript引擎的优化，运行速度较慢，也是另一个不应该使用它的理由。通常情况下，eval最常见的场合是解析JSON数据字符串，这时应该使用浏览器提供的JSON.parse方法。

ECMAScript 5将eval的使用分成两种情况，像上面这样的调用，就叫做“直接使用”，这种情况下eval的作用域就是当前作用域（即全局作用域或函数作用域）。另一种情况是，eval不是直接调用，而是“间接调用”，此时eval的作用域总是全局作用域。

{% highlight javascript %}

var a = 1;

function f(){
	var a = 2;
	var e = eval;
	e('console.log(a)');
}

f() // 1

{% endhighlight %}

上面代码中，eval是间接调用，所以即使它是在函数中，它的作用域还是全局作用域，因此输出的a为全局变量。

eval的间接调用的形式五花八门，只要不是直接调用，几乎都属于间接调用。

{% highlight javascript %}

eval.call(null, '...')
window.eval('...')
(1, eval)('...')
(eval, eval)('...')
(1 ? eval : 0)('...')
(__ = eval)('...')
var e = eval; e('...')
(function(e) { e('...') })(eval)
(function(e) { return e })(eval)('...')
(function() { arguments[0]('...') })(eval)
this.eval('...')
this['eval']('...')
[eval][0]('...')
eval.call(this, '...')
eval('eval')('...')

{% endhighlight %}

上面这些形式都是eval的间接调用，因此它们的作用域都是全局作用域。

与eval作用类似的还有Function构造函数。利用它生成一个匿名函数，然后立即调用该函数，也能将字符串当作命令执行。

{% highlight javascript %}

var a = 1;

Function("a=2")() 

a // 2

{% endhighlight %}

## 参考链接

- Ben Alman, [Immediately-Invoked Function Expression (IIFE)](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)
- Mark Daggett, [Functions Explained](http://markdaggett.com/blog/2013/02/15/functions-explained/)
- Juriy Zaytsev, [Named function expressions demystified](http://kangax.github.com/nfe/)
- Marco Rogers polotek, [What is the arguments object?](http://docs.nodejitsu.com/articles/javascript-conventions/what-is-the-arguments-object)
- Juriy Zaytsev, [Global eval. What are the options?](http://perfectionkills.com/global-eval-what-are-the-options/)
- Axel Rauschmayer, [Evaluating JavaScript code via eval() and new Function()](http://www.2ality.com/2014/01/eval.html)
