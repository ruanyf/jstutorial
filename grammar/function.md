---
title: 函数
layout: page
category: grammar
date: 2012-12-15
modifiedOn: 2013-12-19
---

## 概述

函数就是一段预先设置的代码块，可以反复调用，根据输入参数的不同，返回不同的值。

JavaScript有三种方法，可以声明一个函数。

### 函数的声明

**（1）function命令**

`function`命令声明的代码区块，就是一个函数。`function`命令后面是函数名，函数名后面是一对圆括号，里面是传入函数的参数。函数体放在大括号里面。

```javascript
function print(s) {
  console.log(s);
}
```

上面的代码命名了一个`print`函数，以后使用`print()`这种形式，就可以调用相应的代码。这叫做函数的声明（Function Declaration）。

**（2）函数表达式**

除了用`function`命令声明函数，还可以采用变量赋值的写法。

```javascript
var print = function(s) {
  console.log(s);
};
```

这种写法将一个匿名函数赋值给变量。这时，这个匿名函数又称函数表达式（Function Expression），因为赋值语句的等号右侧只能放表达式。

采用函数表达式声明函数时，`function`命令后面不带有函数名。如果加上函数名，该函数名只在函数体内部有效，在函数体外部无效。

```javascript
var print = function x(){
  console.log(typeof x);
};

x
// ReferenceError: x is not defined

print()
// function
```

上面代码在函数表达式中，加入了函数名`x`。这个`x`只在函数体内部可用，指代函数表达式本身，其他地方都不可用。这种写法的用处有两个，一是可以在函数体内部调用自身，二是方便除错（除错工具显示函数调用栈时，将显示函数名，而不再显示这里是一个匿名函数）。因此，下面的形式声明函数也非常常见。

```javascript
var f = function f() {};
```

需要注意的是，函数的表达式需要在语句的结尾加上分号，表示语句结束。而函数的声明在结尾的大括号后面不用加分号。总的来说，这两种声明函数的方式，差别很细微（参阅后文《变量提升》一节），这里可以近似认为是等价的。

**（3）Function构造函数**

还有第三种声明函数的方式：`Function`构造函数。

```javascript
var add = new Function(
  'x',
  'y',
  'return (x + y)'
);

// 等同于

function add(x, y) {
  return (x + y);
}
```

在上面代码中，`Function`构造函数接受三个参数，除了最后一个参数是`add`函数的“函数体”，其他参数都是`add`函数的参数。如果只有一个参数，该参数就是函数体。

```javascript
var foo = new Function(
  'return "hello world"'
);

// 等同于

function foo() {
  return "hello world";
}
```

`Function`构造函数可以不使用`new`命令，返回结果完全一样。

总的来说，这种声明函数的方式非常不直观，几乎无人使用。

### 函数的重复声明

如果同一个函数被多次声明，后面的声明就会覆盖前面的声明。

```javascript
function f() {
  console.log(1);
}
f() // 2

function f() {
  console.log(2);
}
f() // 2
```

上面代码中，后一次的函数声明覆盖了前面一次。而且，由于函数名的提升（参见下文），前一次声明在任何时候都是无效的，这一点要特别注意。

### 圆括号运算符，return语句和递归

调用函数时，要使用圆括号运算符。圆括号之中，可以加入函数的参数。

```javascript
function add(x, y) {
  return x + y;
}

add(1, 1) // 2
```

上面代码中，函数名后面紧跟一对圆括号，就会调用这个函数。

函数体内部的`return`语句，表示返回。JavaScript引擎遇到`return`语句，就直接返回`return`后面的那个表达式的值，后面即使还有语句，也不会得到执行。也就是说，`return`语句所带的那个表达式，就是函数的返回值。`return`语句不是必需的，如果没有的话，该函数就不返回任何值，或者说返回`undefined`。

函数可以调用自身，这就是递归（recursion）。下面就是通过递归，计算斐波那契数列的代码。

```javascript
function fib(num) {
  if (num > 2) {
    return fib(num - 2) + fib(num - 1);
  } else {
    return 1;
  }
}

fib(6) // 8
```

上面代码中，`fib`函数内部又调用了`fib`，计算得到斐波那契数列的第6个元素是8。

### 第一等公民

JavaScript的函数与其他数据类型（数值、字符串、布尔值等等）处于同等地位，可以使用其他数据类型的地方，就能使用函数。比如，可以把函数赋值给变量和对象的属性，也可以当作参数传入其他函数，或者作为函数的结果返回。

这表明，函数与其他数据类型完全是平等的，所以又称函数为第一等公民。

```javascript
function add(x, y) {
  return x + y;
}

// 将函数赋值给一个变量
var operator = add;

// 将函数作为参数和返回值
function a(op){
  return op;
}
a(add)(1, 1)
// 2
```

### 函数名的提升

JavaScript引擎将函数名视同变量名，所以采用`function`命令声明函数时，整个函数会像变量声明一样，被提升到代码头部。所以，下面的代码不会报错。

```javascript
f();

function f() {}
```

表面上，上面代码好像在声明之前就调用了函数`f`。但是实际上，由于“变量提升”，函数`f`被提升到了代码头部，也就是在调用之前已经声明了。但是，如果采用赋值语句定义函数，JavaScript就会报错。

```javascript
f();
var f = function (){};
// TypeError: undefined is not a function
```

上面的代码等同于下面的形式。

```javascript
var f;
f();
f = function () {};
```

上面代码第二行，调用`f`的时候，`f`只是被声明了，还没有被赋值，等于`undefined`，所以会报错。因此，如果同时采用`function`命令和赋值语句声明同一个函数，最后总是采用赋值语句的定义。

```javascript
var f = function() {
  console.log('1');
}

function f() {
  console.log('2');
}

f() // 1
```

### 不能在条件语句中声明函数

根据ECMAScript的规范，不得在非函数的代码块中声明函数，最常见的情况就是if和try语句。

```javascript
if (foo) {
  function x() {}
}

try {
  function x() {}
} catch(e) {
  console.log(e);
}
```

上面代码分别在`if`代码块和`try`代码块中声明了两个函数，按照语言规范，这是不合法的。但是，实际情况是各家浏览器往往并不报错，能够运行。

但是由于存在函数名的提升，所以在条件语句中声明函数，可能是无效的，这是非常容易出错的地方。

```javascript
if (false){
  function f() {}
}

f() // 不报错
```

上面代码的原始意图是不声明函数`f`，但是由于`f`的提升，导致`if`语句无效，所以上面的代码不会报错。要达到在条件语句中定义函数的目的，只有使用函数表达式。

```javascript
if (false) {
  var f = function () {};
}

f() // undefined
```

## 函数的属性和方法

### name属性

name属性返回紧跟在function关键字之后的那个函数名。

```javascript
function f1() {}
f1.name // 'f1'

var f2 = function () {};
f2.name // ''

var f3 = function myName() {};
f3.name // 'myName'
```

上面代码中，函数的name属性总是返回紧跟在function关键字之后的那个函数名。对于f2来说，返回空字符串，匿名函数的name属性总是为空字符串；对于f3来说，返回函数表达式的名字（真正的函数名还是f3，myName这个名字只在函数体内部可用）。

### length属性

`length`属性返回函数预期传入的参数个数，即函数定义之中的参数个数。

```javascript
function f(a, b) {}
f.length // 2
```

上面代码定义了空函数`f`，它的`length`属性就是定义时的参数个数。不管调用时输入了多少个参数，`length`属性始终等于2。

`length`属性提供了一种机制，判断定义时和调用时参数的差异，以便实现面向对象编程的”方法重载“（overload）。

### toString()

函数的toString方法返回函数的源码。

```javascript
function f() {
  a();
  b();
  c();
}

f.toString()
// function f() {
//  a();
//  b();
//  c();
// }
```

函数内部的注释也可以返回。

```javascript
function f() {/*
  这是一个
  多行注释
*/}

f.toString()
// "function f(){/*
//   这是一个
//   多行注释
// */}"
```

利用这一点，可以变相实现多行字符串。

```javascript
var multiline = function (fn) {
  var arr = fn.toString().split('\n');
  return arr.slice(1, arr.length - 1).join('\n');
};

function f() {/*
  这是一个
  多行注释
*/}

multiline(f.toString())
// " 这是一个
//   多行注释"
```

## 函数作用域

### 定义

作用域（scope）指的是变量存在的范围。Javascript只有两种作用域：一种是全局作用域，变量在整个程序中一直存在，所有地方都可以读取；另一种是函数作用域，变量只在函数内部存在。

在函数外部声明的变量就是全局变量（global variable），它可以在函数内部读取。

```javascript
var v = 1;

function f(){
  console.log(v);
}

f()
// 1
```

上面的代码表明，函数`f`内部可以读取全局变量`v`。

在函数内部定义的变量，外部无法读取，称为“局部变量”（local variable）。

```javascript
function f(){
  var v = 1;
}

v // ReferenceError: v is not defined
```

上面代码中，变量`v`在函数内部定义，所以是一个局部变量，函数之外就无法读取。

函数内部定义的变量，会在该作用域内覆盖同名全局变量。

```javascript
var v = 1;

function f(){
  var v = 2;
  console.log(v);
}

f() // 2
v // 1
```

上面代码中，变量`v`同时在函数的外部和内部有定义。结果，在函数内部定义，局部变量`v`覆盖了全局变量`v`。

注意，对于`var`命令来说，局部变量只能在函数内部声明，在其他区块中声明，一律都是全局变量。

```javascript
if (true) {
  var x = 5;
}
console.log(x);  // 5
```

上面代码中，变量`x`在条件判断区块之中声明，结果就是一个全局变量，可以在区块之外读取。

### 函数内部的变量提升

与全局作用域一样，函数作用域内部也会产生“变量提升”现象。var命令声明的变量，不管在什么位置，变量声明都会被提升到函数体的头部。

```javascript
function foo(x) {
  if (x > 100) {
    var tmp = x - 100;
  }
}
```

上面的代码等同于

```javascript
function foo(x) {
  var tmp;
  if (x > 100) {
    tmp = x - 100;
  };
}
```

### 函数本身的作用域

函数本身也是一个值，也有自己的作用域。它的作用域绑定其声明时所在的作用域。

```javascript
var a = 1;
var x = function (){
  console.log(a);
};

function f(){
  var a = 2;
  x();
}

f() // 1
```

上面代码中，函数x是在函数f的外部声明的，所以它的作用域绑定外层，内部变量a不会到函数f体内取值，所以输出1，而不是2。

很容易犯错的一点是，如果函数A调用函数B，却没考虑到函数B不会引用函数A的内部变量。

```javascript
var x = function (){
  console.log(a);
};

function y(f){
  var a = 2;
  f();
}

y(x)
// ReferenceError: a is not defined
```

上面代码将函数x作为参数，传入函数y。但是，函数x是在函数y体外声明的，作用域绑定外层，因此找不到函数y的内部变量a，导致报错。

## 参数

### 概述

函数运行的时候，有时需要提供外部数据，不同的外部数据会得到不同的结果，这种外部数据就叫参数。

```javascript
function square(x) {
  return x * x;
}

square(2) // 4
square(3) // 9
```

上式的`x`就是`square`函数的参数。每次运行的时候，需要提供这个值，否则得不到结果。

### 参数的省略

函数参数不是必需的，Javascript允许省略参数。

```javascript
function f(a, b) {
  return a;
}

f(1, 2, 3) // 1
f(1) // 1
f() // undefined

f.length // 2
```

上面代码的函数`f`定义了两个参数，但是运行时无论提供多少个参数（或者不提供参数），JavaScript都不会报错。

被省略的参数的值就变为`undefined`。需要注意的是，函数的`length`属性与实际传入的参数个数无关，只反映函数预期传入的参数个数。

但是，没有办法只省略靠前的参数，而保留靠后的参数。如果一定要省略靠前的参数，只有显式传入`undefined`。

```javascript
function f(a, b) {
  return a;
}

f( , 1) // SyntaxError: Unexpected token ,(…)
f(undefined, 1) // undefined
```

上面代码中，如果省略第一个参数，就会报错。

### 默认值

通过下面的方法，可以为函数的参数设置默认值。

```javascript
function f(a){
  a = a || 1;
  return a;
}

f('') // 1
f(0) // 1
```

上面代码的`||`表示“或运算”，即如果`a`有值，则返回`a`，否则返回事先设定的默认值（上例为1）。

这种写法会对`a`进行一次布尔运算，只有为`true`时，才会返回`a`。可是，除了`undefined`以外，`0`、空字符、`null`等的布尔值也是`false`。也就是说，在上面的函数中，不能让`a`等于`0`或空字符串，否则在明明有参数的情况下，也会返回默认值。

为了避免这个问题，可以采用下面更精确的写法。

```javascript
function f(a) {
  (a !== undefined && a !== null) ? a = a : a = 1;
  return a;
}

f() // 1
f('') // ""
f(0) // 0
```

上面代码中，函数`f`的参数是空字符或`0`，都不会触发参数的默认值。

### 传递方式

函数参数如果是原始类型的值（数值、字符串、布尔值），传递方式是传值传递（passes by value）。这意味着，在函数体内修改参数值，不会影响到函数外部。

```javascript
var p = 2;

function f(p) {
  p = 3;
}
f(p);

p // 2
```

上面代码中，变量`p`是一个原始类型的值，传入函数`f`的方式是传值传递。因此，在函数内部，`p`的值是原始值的拷贝，无论怎么修改，都不会影响到原始值。

但是，如果函数参数是复合类型的值（数组、对象、其他函数），传递方式是传址传递（pass by reference）。也就是说，传入函数的原始值的地址，因此在函数内部修改参数，将会影响到原始值。

```javascript
var obj = {p: 1};

function f(o) {
  o.p = 2;
}
f(obj);

obj.p // 2
```

上面代码中，传入函数`f`的是参数对象`obj`的地址。因此，在函数内部修改`obj`的属性`p`，会影响到原始值。

注意，如果函数内部修改的，不是参数对象的某个属性，而是替换掉整个参数，这时不会影响到原始值。

```javascript
var obj = [1, 2, 3];

function f(o){
  o = [2, 3, 4];
}
f(obj);

obj // [1, 2, 3]
```

上面代码中，在函数`f`内部，参数对象`obj`被整个替换成另一个值。这时不会影响到原始值。这是因为，形式参数（`o`）与实际参数`obj`存在一个赋值关系。

```javascript
// 函数f内部
o = obj;
```

上面代码中，对`o`的修改都会反映在`obj`身上。但是，如果对`o`赋予一个新的值，就等于切断了`o`与`obj`的联系，导致此后的修改都不会影响到`obj`了。

某些情况下，如果需要对某个原始类型的变量，获取传址传递的效果，可以将它写成全局对象的属性。

```javascript
var a = 1;

function f(p) {
  window[p] = 2;
}
f('a');

a // 2
```

上面代码中，变量`a`本来是传值传递，但是写成`window`对象的属性，就达到了传址传递的效果。

### 同名参数

如果有同名的参数，则取最后出现的那个值。

```javascript
function f(a, a) {
  console.log(a);
}

f(1, 2) // 2
```

上面的函数`f`有两个参数，且参数名都是`a`。取值的时候，以后面的`a`为准。即使后面的`a`没有值或被省略，也是以其为准。

```javascript
function f(a, a){
  console.log(a);
}

f(1) // undefined
```

调用函数`f`的时候，没有提供第二个参数，`a`的取值就变成了`undefined`。这时，如果要获得第一个`a`的值，可以使用`arguments`对象。

```javascript
function f(a, a){
  console.log(arguments[0]);
}

f(1) // 1
```

### arguments对象

**（1）定义**

由于JavaScript允许函数有不定数目的参数，所以我们需要一种机制，可以在函数体内部读取所有参数。这就是`arguments`对象的由来。

`arguments`对象包含了函数运行时的所有参数，`arguments[0]`就是第一个参数，`arguments[1]`就是第二个参数，以此类推。这个对象只有在函数体内部，才可以使用。

```javascript
var f = function(one) {
  console.log(arguments[0]);
  console.log(arguments[1]);
  console.log(arguments[2]);
}

f(1, 2, 3)
// 1
// 2
// 3
```

`arguments`对象除了可以读取参数，还可以为参数赋值（严格模式不允许这种用法）。

```javascript
var f = function(a, b) {
  arguments[0] = 3;
  arguments[1] = 2;
  return a + b;
}

f(1, 1)
// 5
```

可以通过`arguments`对象的`length`属性，判断函数调用时到底带几个参数。

```javascript
function f() {
  return arguments.length;
}

f(1, 2, 3) // 3
f(1) // 1
f() // 0
```

**（2）与数组的关系**

需要注意的是，虽然`arguments`很像数组，但它是一个对象。数组专有的方法（比如`slice`和`forEach`），不能在`arguments`对象上直接使用。

但是，可以通过`apply`方法，把`arguments`作为参数传进去，这样就可以让`arguments`使用数组方法了。

```javascript
// 用于apply方法
myfunction.apply(obj, arguments).

// 使用与另一个数组合并
Array.prototype.concat.apply([1,2,3], arguments)
```

要让arguments对象使用数组方法，真正的解决方法是将arguments转为真正的数组。下面是两种常用的转换方法：slice方法和逐一填入新数组。

```javascript
var args = Array.prototype.slice.call(arguments);

// or

var args = [];
for (var i = 0; i < arguments.length; i++) {
  args.push(arguments[i]);
}
```

**（3）callee属性**

`arguments`对象带有一个`callee`属性，返回它所对应的原函数。

```javascript
var f = function(one) {
  console.log(arguments.callee === f);
}

f() // true
```

可以通过`arguments.callee`，达到调用函数自身的目的。

## 函数的其他知识点

### 闭包

函数的内部，还可以定义另一个函数，这就是闭包（closure），即定义在函数体内部的函数。闭包只在声明它的函数内部有效。

```javascript
function f() {
  var c = function() {};
}
```

上面的代码中，`c`是定义在函数`f`内部的函数，因此`c`就是`f`的闭包。

一旦外层函数返回闭包，我们就可以通过闭包，从外部读取函数的内部变量。

```javascript
function f() {
  var v = 1;
  var c = function (){
    return v;
  };
  return c;
}

var o = f();
o() // 1
```

上面代码中，函数`f`返回了闭包`c`，借助`c`就可以读取`f`的内部变量`v`。如果不通过闭包，就没有其他办法，可以读到`v`。（注意，反之不成立，`f`无法读取`c`的内部变量。）

闭包不仅可以读取函数内部变量，还可以使得内部变量记住上一次调用时的运算结果。

```javascript
function createIncrementor(start) {
  return function () {
    return start++;
  };
}

var inc = createIncrementor(5);

inc() // 5
inc() // 6
inc() // 7
```

上面代码中，`start`是函数`createIncrementor`的内部变量。通过闭包，`start`的状态被保留了，每一次调用都是在上一次调用的基础上进行计算。

通过这个例子可以看到，闭包的实质就是保留并获取到函数内部的作用域。闭包就是函数内部作用域的一个接口。

外层函数每次运行，都会生成一个新的闭包。而这个闭包又会保留外层的作用域，这导致闭包非常耗费内存。这是使用时需要注意的。

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

上面代码中，eval命令修改了外部变量a的值。由于这个原因，所以eval有安全风险，无法做到作用域隔离，最好不要使用。此外，eval的命令字符串不会得到JavaScript引擎的优化，运行速度较慢，也是另一个不应该使用它的理由。通常情况下，eval最常见的场合是解析JSON数据字符串，正确的做法是这时应该使用浏览器提供的JSON.parse方法。

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

与eval作用类似的还有Function构造函数。利用它生成一个函数，然后调用该函数，也能将字符串当作命令执行。

{% highlight javascript %}

var jsonp = 'foo({"id":42})';

var f = new Function( "foo", jsonp );
// 相当于定义了如下函数
// function f(foo) {
//   foo({"id":42});
// }

f(function(json){
  console.log( json.id ); // 42
})

{% endhighlight %}

上面代码中，jsonp是一个字符串，Function构造函数将这个字符串，变成了函数体。调用该函数的时候，jsonp就会执行。这种写法的实质是将代码放到函数作用域执行，避免对全局作用域造成影响。

## 参考链接

- Ben Alman, [Immediately-Invoked Function Expression (IIFE)](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)
- Mark Daggett, [Functions Explained](http://markdaggett.com/blog/2013/02/15/functions-explained/)
- Juriy Zaytsev, [Named function expressions demystified](http://kangax.github.com/nfe/)
- Marco Rogers polotek, [What is the arguments object?](http://docs.nodejitsu.com/articles/javascript-conventions/what-is-the-arguments-object)
- Juriy Zaytsev, [Global eval. What are the options?](http://perfectionkills.com/global-eval-what-are-the-options/)
- Axel Rauschmayer, [Evaluating JavaScript code via eval() and new Function()](http://www.2ality.com/2014/01/eval.html)
