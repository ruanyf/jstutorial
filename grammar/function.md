---
title: 函数
layout: page
category: grammar
date: 2012-12-15
modifiedOn: 2013-06-14
---

## 概述

### 函数的定义

函数就是有名字的区块，便于反复调用。

函数使用function关键字进行命名。

{% highlight javascript %}

function print(){
	// some code here
}

{% endhighlight %}

上面的代码命名了一个print函数。这叫做函数的声明（Function Declaration）。除此之外，还可以采用另一种写法。

{% highlight javascript %}

var print = function (){
	// some code here
};

{% endhighlight %}

这种方法将一个变量定义为函数，称为函数的表达式（Function Expression），因为函数是赋值表达式的一部分。这时，function关键字的后面不带有函数名。如果加上函数名，由于作用域的原因（参阅后文《函数的作用域》一节），该函数名只在函数体内部有效，在函数体外部无效。

{% highlight javascript %}

var print = function x(){
	console.log(typeof x);
};

x
// ReferenceError: x is not defined

print()
// function

{% endhighlight %}

除了调用自身，在函数表达式中加上函数名，还可以方便除错（否则调用栈将“函数表达式”显示匿名函数）。因此，推荐在函数表达式中加上函数名，写成下面的形式。

{% highlight javascript %}

var f = function f(){};

{% endhighlight %}

还有一个地方需要注意，函数的表达式需要在语句的结尾加上分号，表示语句结束。而函数的声明在结尾的大括号后面不用加分号。

总的来说，这两种定义函数的方式，差别很细微（参阅后文《变量提升》一节），这里可以近似认为是等价的。

除此之外，函数还可以通过Function对象定义，但是几乎很少有人使用。

{% highlight javascript %}

var add = new Function("x","y","return (x+y)");

{% endhighlight %}

Function对象接受若干个参数，除了最后一个参数是add函数的“函数体”，其他都是add函数的参数。

### 第一等公民

在JavaScript语言中，函数与其他数据类型处于同等地位，可以被赋值给一个变量、或者赋值给对象的属性，也可以当作参数传入其他函数，或者作为函数的结果返回。

{% highlight javascript %}

function add(x,y){
	return x+y;
}

// 将函数赋值给一个变量
var a = add;
a(1,1)
// 2

// 将函数赋值给对象的属性
var o = new Object();
o.a = add;
o.a(1,1)
// 2

// 将函数作为另一个函数的参数
function a(op){
	return op(1,1);
}
a(add)
// 2

// 将函数作为另一个函数的返回值
function a(op){
	return op;
}
a(add)(1,1)
// 2

{% endhighlight %}

由于函数的使用与其他数据类型处于同等地位，不是第二等公民。所以我们说，函数在JavaScript中属于“第一等公民”。

### 函数名的提升

JavaScript引擎将function声明，视作var命令，因此函数声明也会被提升到代码头部。所以，下面的代码不会报错。

{% highlight javascript %}

f();

function f(){}

{% endhighlight %}

表面上，好像在声明之前就调用了函数f。但是实际上，由于“变量提升”，函数f的定义被提升到了代码头部。

但是，如果采用赋值语句定义函数，JavaScript就会报错。

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

当调用f的时候，f只是被声明，还没有被赋值，等于undefined，所以会报错。因为这个原因，如果同时采用function关键字和赋值语句声明一个函数，最后总是采用赋值语句的定义。

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

### 函数的重复定义

由于函数的声明会被提升到头部，如果重复定义同一个函数名，则后一个定义会覆盖前一个定义。

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

同样由于函数声明的提升，所以在条件语句中声明函数是无效的。

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
	f = function (){};
}

f
// ReferenceError: f is not defined

{% endhighlight %}

### 函数内部的变量提升

与全局作用域一样，函数作用域内部也会产生“变量提升”现象。var命令声明的变量，不管在什么位置，变量都会被提升到函数开始处声明。

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

### 参数的省略

但是，参数不是必需的，Javascript语言允许省略函数。

{% highlight javascript %}

function f(a,b){
	return a;
}

{% endhighlight %}

上面的函数定义了两个参数，但是运行时无论提供多少个参数，JavaScript都不会报错。被省略的参数的值就变为undefined。

{% highlight javascript %}

function f(a,b){
	return a;
}

f(1,2,3)
// 1

f(1)
// 1

f()
// undefined

{% endhighlight %}

但是没有办法只省略靠前的参数，而保留靠后的参数。

{% highlight javascript %}

function f(a,b){
	return a;
}

f(,1)
// error

{% endhighlight %}

### 默认值

可以通过下面的方法，为参数设置默认值。

{% highlight javascript %}

function f(a){
	a = a || 1;
	return a;
}

{% endhighlight %}

上面代码的||表示“或运算”。如果a有值，则返回a，否则返回事先设定的值（此例为1），因此达到设置默认值的目的。

但是，这种写法有一个问题。就是只有a的布尔值为true，才会返回a。也就是说，会先对a进行布尔运算，如果a明明是有值的，但是布尔运算的结果为false，就会返回a后面的那个值。以下几个表达式的布尔运算都为false，会使得a取到后一个值。

- undefined, null
- false
- +0, -0, NaN
- ""

因此，上面的函数中，你不能让a等于0或空字符串。

{% highlight javascript %}

function f(a){
	a = a || 1;
	return a;
}

f('')
// 1

f(0)
// 1

{% endhighlight %}

为了避免这个问题，可以采用下面更精确的写法。

{% highlight javascript %}

function f(a){
	(a !== undefined && a != null)?(a = a):(a = 1);
	return a;
}

f('')
// ""

f(0)
// 0

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

需要注意的是，虽然arguments很像数组，但它是一个对象。如果对arguments对象调用数组方法会出错，比如，arguments.sort() 会报出TypeError。解决方法是将arguments转为数组。

{% highlight javascript %}

var args = Array.prototype.slice.call(arguments);

// or 

var args = [];
for(var i = 0; i < arguments.length; i++) {
	  args.push(arguments[i]);
}

{% endhighlight %}

arguments对象带有一个callee属性，返回它对应的原函数。

{% highlight javascript %}

var f = function(one) {
  console.log(arguments.callee === f);
}

f()
// true

{% endhighlight %}

## 函数作用域

### 定义

作用域（scope）指的是变量存在的范围。Javascript只有两种作用域：一种是全局作用域，变量在整个程序中一直存在；另一种是函数作用域，变量只在函数内部存在。

在函数外部声明的变量就是全局变量，它可以在函数内部读取。

{% highlight javascript %}

   var v = 1;

   function f(){
	   console.log(v);
   }

   f()
   // 1

{% endhighlight %}

上面的代码表明，函数f内部可以读取全局变量v。

在函数内部定义的变量，外部无法读取。

{% highlight javascript %}

   function f(){

	   var v = 1;	   
   }

   console.log(v);
   // 显示错误，v未定义

{% endhighlight %}

函数内部定义的变量，会在该作用域内覆盖同名全局变量。

{% highlight javascript %}

   var v = 1; 

   function f(){

	   var v = 2;

	   console.log(v);

   }

   f();
   // 2

   console.log(v);
   // 1

{% endhighlight %}

### call方法

call方法用来指定函数运行的上下文。

{% highlight javascript %}

func.call(context, [arg1], [arg2], ...)

{% endhighlight %}

context参数就是func函数运行的上下文，它可以是全局环境，也可以是一个具体的对象。跟在它后面的参数，就是func运行所需的参数。

{% highlight javascript %}

var x = 1 ;

var o = { x: 2 };

function f(){ console.log(this.x);}

f.call(window)
// 1

f.call(o)
// 2

{% endhighlight %}

上面代码的f函数，如果上下文环境绑定全局环境，x的值就是1；如果绑定对象o，x的值就是2。

如果绑定的上下文环境是undefined或null，JavaScript引擎当作绑定全局环境处理。

{% highlight javascript %}

var x = 1 ;

function f(){ console.log(this.x);}

f.call(null)
// 1

f.call()
// 1

{% endhighlight %}

### apply方法

apply方法与call方法类似，唯一的区别就是除了context参数，它还接受一个数组参数。

{% highlight javascript %}

func.apply(context, [arg1, arg2, ...])

{% endhighlight %}

后面的数组参数，就是func函数运行所需的参数。在call方法中，这些参数必须一个个添加，但是在apply方法中，必须以数组形式添加。下面的例子是一个参数数组的例子。

{% highlight javascript %}

function f(x,y){ console.log(x+y);}

f.call(null,1,1)
// 2

// 改写为apply方法

f.apply(null,[1,1])
// 2

{% endhighlight %}

f函数本来接受两个参数，使用apply方法以后，就变成可以接受一个数组作为参数。利用这一点，可以做一些有趣的应用。比如，JavaScript不提供找出数组最大元素的函数，Math.max方法只能返回它的所有参数的最大值，使用apply方法，就可以返回数组的最大元素。

{% highlight javascript %}

Math.max.apply(null, [10, 2, 4, 15, 9])
// 15

{% endhighlight %}

apply还有一个特点，可以把数组的空元素变成undefined。

{% highlight javascript %}

Array.apply(null, ["a",,"b"])
// [ 'a', undefined, 'b' ]

{% endhighlight %}

这里的差别就是，数组的foreach方法会逃过空元素，但是不会跳过undefined。因此，遍历内部元素的时候，会体现出差别。

使用apply方法的另一个场合是，展开双层数组（即数组的成员也是数组），使用数组对象的concat方法。

{% highlight javascript %}

Array.prototype.concat.apply([], [[1], [2]])
// [1, 2]

Array.prototype.concat.apply([], [[1], 2])
// [1, 2]

{% endhighlight %}

concat方法是定义数组对象上的，所以apply方法的第一个参数必须是数组，而第二个参数就是需要被展开的双层数组。不过，这个方法只能展开双层数组，对于更多层的数组，只能展开最外面的一层。

{% highlight javascript %}

Array.prototype.concat.apply([], [[[1]], [2]])
// [[1], 2]

{% endhighlight %}

最后，前面已经说过，利用slice方法，可以将一个类似数组的对象转为真正的数组。

{% highlight javascript %}

Array.prototype.slice.apply({0:1,length:1})
// [1]

Array.prototype.slice.apply({0:1})
// []

Array.prototype.slice.apply({0:1,length:2})
// [1, undefined]

Array.prototype.slice.apply({length:1})
// [undefined]

{% endhighlight %}

从上面的代码可以看到，这个方法起作用的前提是，被处理的对象必须有length属性，以及相对应的数字键。

### bind方法

该方法将一个函数绑定运行时的上下文和参数，然后作为新函数返回。

{% highlight javascript %}

func.bind(thisValue, [arg1], [arg2], ...)

{% endhighlight %}

请看下面的例子。

{% highlight javascript %}

var o1 = {
	p: 123,
	m: function(){ console.log(this.p);}
};

// 不绑定上下文
var o2 = { p: 246};
o2.m = o1.m;
o2.m()
// 246

// 绑定上下文
o2.m = o1.m.bind(o1);
o2.m()
// 123

{% endhighlight %}

当上下文绑定之后，o1对象的m方法就不再读取o2对象的属性了。

如果第一个参数是null或undefined，则函数运行时绑定全局环境的上下文。

{% highlight javascript %}

function add(x,y) { return x+y;}

var plus5 = add.bind(null, 5);

plus5(10)
// 15

{% endhighlight %}

bind方法每运行一次，就返回一个新函数，这会产生一些问题。比如，监听事件的时候，不能写成下面这样：

{% highlight javascript %}

domElement.addEventListener(
        'click', myWidget.handleClick.bind(myWidget));

{% endhighlight %}

因为每点击一次，就绑定一个新函数，导致无法取消这些绑定。

{% highlight javascript %}

domElement.removeEventListener(
        myWidget.handleClick.bind(myWidget));

{% endhighlight %}

正确的方法是写成下面这样：

{% highlight javascript %}

    var listener = myWidget.handleClick.bind(myWidget);
    domElement.addEventListener('click', listener);
    ...
    domElement.removeEventListener(listener);

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
