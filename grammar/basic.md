---
title: 语法概述
layout: page
category: grammar
date: 2012-12-14
modifiedOn: 2013-04-15
---

## 表达式和语句

JavaScript程序的执行单位为行（line），也就是一行一行地执行。每行由表达式或语句组成。

表达式（expression）是一种以返回值为目的的操作，比如 1+3 就是一个表达式，它的目的就是得到返回值4。

语句（statement）则是以完成某种任务为主要目的的操作，不一定有返回值。比如下面就是一个赋值语句：

{% highlight javascript %}

var a = 1 + 3 ;

{% endhighlight %}

这条语句将 1+3 的运算结果赋值给变量a。它是没有返回值的，因为主要目的不是为了得到返回值。

语句以分号结尾，一个分号就表示一个语句结束。多个语句可以写在一行内。

{% highlight javascript %}

var a = 1 + 3 ; var b = "abc";

{% endhighlight %}

分号前面可以没有任何内容，解释器将其视为空语句。

{% highlight javascript %}

;;;

{% endhighlight %}

上面的代码就表示3个空语句。（关于分号的更多介绍，请看后文《结尾的分号》一节。）

表达式不需要分号结尾。一旦在表达式后面添加分号，则解释器就将表达式视为语句，这样会产生一些没有任何意义的语句。

{% highlight javascript %}

1 + 3;

"abc";

{% endhighlight %}

上面两行语句有返回值，但是没有任何意义，因为没有使用这个返回值，也没有任何其他操作。

## 注释

Javascript提供两种注释：一种是单行注释，用//起头；另一种是多行注释，放在/* 和 */之间。

{% highlight javascript %}

// 单行注释

/*
 多
 行
 注
 释
*/

{% endhighlight %}

## 变量

变量是对“值”的引用，使用变量等同于引用一个值。每一个变量都有一个变量名。

{% highlight javascript %}

var a = 1;

{% endhighlight %}

上面的代码先声明a，然后在变量a与数值1之间建立引用关系，也称将数值1“赋值”给变量a。以后，引用a就会得到数值1。最前面var，是变量声明命令。它表示通知解释器，要创建一个变量a。

变量的声明和赋值，是分开的两个步骤，上面的代码将它们合在了一起，实际的步骤是下面这样。

{% highlight javascript %}

var a;

a = 1;

{% endhighlight %}

JavaScript允许省略var，也就是说，省略上面的第一行命令，直接对未声明的变量赋值，效果完全相同。由于这样的做法很容易不知不觉地创建全局变量（尤其是在函数内部），所以建议总是使用var命令声明变量。

但是，如果一个变量也没有声明和赋值就使用，JavaScript会报错，告诉你变量未定义。

{% highlight javascript %}

console.log(x)
// ReferenceError: x is not defined 

{% endhighlight %}

可以在同一条var命令中声明多个变量。

{% highlight javascript %}

var a,b;

{% endhighlight %}

### 变量提升

JavaScript解释器的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。这造成的结果，就是所有的变量的声明语句，都会被提升到代码的头部，这就叫做变量提升。

{% highlight javascript %}

alert(a);
var a = 1;

{% endhighlight %}

上面的代码等同于下面的写法，所以解释器不会报错，但是结果不会得到1，而是undefined。

{% highlight javascript %}

var a;
alert(a);
a = 1;

{% endhighlight %}

## 区块

JavaScript使用大括号，将相关的语句组合在一起，称为“区块”（block）。

与大多数编程语言不一样，JavaScript的区块不构成单独的作用域（scope）。也就是说，区块中的变量就是全局变量。

{% highlight javascript %}

{ 
	var a;
	a = 1;

}

a
// 1

{% endhighlight %}

## 数据类型

Javascript的值的类型分成两大类：原始类型（primitive type）和合成类型（complex type）。

原始类型又分成三种。

- 数值（number）
- 字符串（string）
- 布尔值（boolean）

合成类型也分成三种。

- 对象（object）
- 数组（array）
- 函数（function）

除了上面这六种数据类型，Javascript还定义一个特殊的数据类型undefined和一个特殊的值null。

undefined表示“未定义”，即还没有确定数据类型。如果一个变量只是被声明，没有被赋值，那么它的值默认就是undefined。

{% highlight javascript %}

var v;

v
// undefined

{% endhighlight %}

null表示空对象。它不是一种单独的数据类型，而是包含在对象类型（object）之中的一种特殊值。

{% highlight javascript %}

var v = null;

v
// null

{% endhighlight %}

这里需要明确的是，Javascript的所有数据，都可以视为对象，数组和函数只不过是特殊的对象而已，就连数值、字符串、布尔值都可以用对象方式调用。

## typeof 运算符

该运算符用来确定一个值的数据类型，可能有以下结果：

（1）如果值的类型是布尔值，返回boolean。

{% highlight javascript %}

typeof false
// boolean

{% endhighlight %}

（2）如果值的类型是数值，返回number。

{% highlight javascript %}

typeof 123
// number

{% endhighlight %}

（3）如果值的类型是字符串，返回string。

{% highlight javascript %}

typeof "123"
// string

{% endhighlight %}

（4）如果值的类型是函数，返回function。

{% highlight javascript %}

typeof print
// function

{% endhighlight %}

（5） 如果值的类型是undefined: 返回undefined。

{% highlight javascript %}

> typeof undefined
  "undefined"

{% endhighlight %}

利用这一点，typeof可以用来检查一个没有声明的变量，而不报错。其他语法结构都没有这个功能。

{% highlight javascript %}

v
// ReferenceError: v is not defined

typeof v
// undefined

{% endhighlight %}

（6）如果值的类型是null，返回object。

{% highlight javascript %}

typeof null
// object

{% endhighlight %}

（7）如果值的类型不属于上面任何一种情况，返回object。

{% highlight javascript %}

typeof window 
// object

typeof {}; 
// object

typeof []; 
// object

typeof null;
// object

{% endhighlight %}

考虑到typeof对数组（array）和对象（object）的显示结果，都是object。因此，可以使用instanceof运算符进一步区分。

{% highlight javascript %}

var o = {};

var a = [];

o instanceof Array
// false

a instanceof Array
// true

{% endhighlight %}

## 字符串

字符串就是若干个排在一起的字符。每个字符在JavaScript内部都是以16位的UTF-16格式储存，可以用"\uxxxx"的内码形式表示，xxxx代表该字符的Unicode编码。

### 字符串连接

字符串的连接，可以使用加号（+）运算符。

{% highlight javascript %}

"a" + "b"
// "ab"

{% endhighlight %}

在一个字符串的结尾添加一个字符串，可以使用+=运算符。

{% highlight javascript %}

a += b;

// 等同于

a = a + b;

{% endhighlight %}

另一种方法是使用数组的连接方法。

{% highlight javascript %}

var arr = [];

arr.push("Hello");

arr.push(" ");

arr.push("World");

arr.join("")
// "Hello World"

{% endhighlight %}

JavaScript引擎对“+”运算做过优化，所以上面两种方法，在速度方面没有太大区别。

### Base64转码

在浏览器环境中，JavaScript原生提供btoa方法，将字符串或二进制值转化为Base64编码；以及atob方法，将Base64编码转化为原来的编码。

{% highlight javascript %}

window.btoa("Hello World")
// "SGVsbG8gV29ybGQ="

window.atob("SGVsbG8gV29ybGQ=")
// "Hello World"

{% endhighlight %}

这两个方法不适合Unicode字符串，浏览器会报错。必须中间插入一个浏览器转码的环节，再使用这两个方法。

{% highlight javascript %}

function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}
 
function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}

// 使用方法
utf8_to_b64('你好'); // "5L2g5aW9"
b64_to_utf8('4pyTIMOgIGxhIG1vZGU='); // "你好"

{% endhighlight %}

## 布尔值

Javascript将下面的值，都视为false。

- undefined
- null
- false
- 0
- ""

{% highlight javascript %}

if (""){ console.log(true);}
// 没有任何输出

{% endhighlight %}

需要特别注意的是，空数组（[]）和空对象（{}）对应的布尔值，都是true。

{% highlight javascript %}

if ([]){ console.log(true);}
// true

if ({}){ console.log(true);}
// true

{% endhighlight %}

## 条件语句

### if 结构

{% highlight javascript %}

 if (myvar === 3) {
    // then
 } else {
   // else
 }

{% endhighlight %}

### switch结构

{% highlight javascript %}

    switch (fruit) {
        case "banana":
            // ...
            break;
        case "apple":
            // ...
            break;
        default:
            // ...
    }

{% endhighlight %}

## 循环语句

### while循环

While语句包括一个循环条件，只要该条件为真，就不断循环。

{% highlight javascript %}

while (condition){
	// some code here
}	

{% endhighlight %}

### for循环

for语句分成三步：

- 确定初始值;
- 检查循环条件，只要为真就进行后续操作;
- 后续操作完成，返回上一步，检查循环条件。

它的格式如下：

{% highlight javascript %}

for(初值; 循环条件; 下一步)

{% endhighlight %}

用法：

{% highlight javascript %}

    for (var i=0; i < arr.length; i++) {
        console.log(arr[i]);
    }

{% endhighlight %}

所有for循环，都可以改写成while循环。

{% highlight javascript %}

    var i = 0;

	while (i < arr.length) {
        console.log(arr[i]);
        i++;
    }

{% endhighlight %}

### do...while循环

do...while循环与while循环类似，唯一的区别就是先运行一次循环体，然后判断循环条件。

{% highlight javascript %}

    do {
        // ...
    } while(condition);

{% endhighlight %}

### break语句和continue语句

break用于在循环体中跳出循环，continue用于不再进行本次循环的后续操作，直接进入下一次循环。

## 结尾的分号

分号表示一条语句的结尾。

### 不使用分号结尾的语句 

以下三种情况的语句，不使用分号结尾。

（1）for和while循环。

{% highlight javascript %}

for(;;){} // 没有分号

while(true){} // 没有分号

{% endhighlight %}

需要注意的是do...while循环是有分号的。

{% highlight javascript %}

do {
        a--;
    } while(a > 0); // 分号不能省略

{% endhighlight %}

（2）分支语句：if， switch， try。

{% highlight javascript %}

if (true) {} // 没有分号

switch () {} // 没有分号

try {} catch {} // 没有分号

{% endhighlight %}

（3）函数的声明语句

{% highlight javascript %}

function f() {} // 没有分号

{% endhighlight %}

但是函数表达式仍然要使用分号。

{% highlight javascript %}

var f = function f() {};

{% endhighlight %}

在以上三种不使用分号结尾的情况下，如果使用了分号，并不会出错。因为，解释器会把这个分号解释为空语句。

### 分号的自动添加

在一行的结尾，有时没有写分号，解释器会自动添加。

{% highlight javascript %}

var a = b + c

{% endhighlight %}

解释器会自动在 b+c的后面添加分号。

但是，如果下一行的开始可以与本行的结尾连在一起解释，解释器就不会自动添加分号。

{% highlight javascript %}

"abc"
.length

{% endhighlight %}

解释器会把上面两行解释为

{% highlight javascript %}

"abc".length

{% endhighlight %}

以下例子都不会自动添加分号。

{% highlight javascript %}

var a = b + c
(d+e).toString();
// 解释为c(d+e)，即先进行乘法运算

a = b
/hi/g.exec(c).map(d);
// 解释为 a = b / hi / g.exec(c).map(d)，即把正则表达式的斜杠当作除法运算符   

var  = "b"
[ "red", "green" ].foreach(function(c) { console.log(c) })
// 解释为"b"["red", "green"]，即把字符串当作一个数组，按索引取值 

var a = 0;
var f = function(x) { return x }
(a++)
// f等于0，因为(a++)被视为匿名函数的调用

return a +
b;

return (a
+ b)
 
obj.foo(arg1,
arg2)

{% endhighlight %}

一般来说，在没有分号结尾的情况下，如果下一行起首的是(、 [ 、+、-、/这五个字符中的一个，分号不会被自动添加。只有下一行的开始与本行的结尾，无法放在一起解释，JavaScript引擎才会自动添加分号。

{% highlight javascript %}

if (a < 0) a = 0
console.log(a)

// 等同于下面的代码，因为0console没有意义

if (a < 0) a = 0;
console.log(a)

{% endhighlight %}

另外，如果一行的起首是“自增”（++）或“自减”（--）运算符，则它们的前面会自动添加分号。

{% highlight javascript %}

a = b = c = 1
a
++
b
--
c

console.log(a, b, c)
// 1 2 0

{% endhighlight %}

之所以会得到“1 2 0”的结果，原因是自增和自减运算符前，自动被加上了分号。上面的代码实际上等同于下面的形式：

{% highlight javascript %}

a = b = c = 1;
a;
++b;
--c;

{% endhighlight %}

如果continue、break、return和throw这四个语句后面，直接跟换行符，则会自动添加分号。这意味着，如果return语句返回的是一个对象的字面量，起首的大括号一定要写在同一行，否则得不到预期结果。

{% highlight javascript %}

    return
    { first: "Jane" };
    
    // 解释成
    return;
    { first: "Jane" };

{% endhighlight %}

由于解释器自动添加分号的行为难以预测，因此编写代码的时候不应该省略行尾的分号。

## 参考链接

- Dr. Axel Rauschmayer, [A quick overview of JavaScript](http://www.2ality.com/2011/10/javascript-overview.html)
- Dr. Axel Rauschmayer, [Improving the JavaScript typeof operator](http://www.2ality.com/2011/11/improving-typeof.html)
- Dr. Axel Rauschmayer, [Automatic semicolon insertion in JavaScript](http://www.2ality.com/2011/05/semicolon-insertion.html)
- MDN, [window.btoa](https://developer.mozilla.org/en-US/docs/DOM/window.btoa)
- Rod Vagg, [JavaScript and Semicolons](http://dailyjs.com/2012/04/19/semicolons/)
