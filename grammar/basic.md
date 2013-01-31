---
title: 语法概述
layout: page
category: grammar
date: 2012-12-14
modifiedOn: 2013-01-31
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

## 数据类型

Javascript的值的类型分成两大类：原始类型（primitive types）和复合类型（object types）。

原始类型分成三种。

- 数值（number）
- 字符串（string）
- 布尔值（boolean）

复合类型也分成三种。

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

这里需要明确的是，Javascript中的所有数据，都可以视为对象，数组和函数只不过是特殊的对象而已，就连数值、字符串、布尔值都可以用对象方式调用。

## typeof 运算符

该运算符用来确定一个值的数据类型，可能有以下结果：

- 如果值的类型是undefined: 返回undefined。

{% highlight javascript %}

> typeof undefined
  "undefined"

{% endhighlight %}

typeof可以用来检查一个没有声明的变量，而不报错。其他语法结构都没有这个功能。

{% highlight javascript %}

v
// ReferenceError: v is not defined

typeof v
// undefined

{% endhighlight %}

- 如果值的类型是null，返回object。

{% highlight javascript %}

typeof null
// object

{% endhighlight %}

- 如果值的类型是布尔值，返回boolean。

{% highlight javascript %}

typeof false
// boolean

{% endhighlight %}

- 如果值的类型是数值，返回number。

{% highlight javascript %}

typeof 123
// number

{% endhighlight %}

- 如果值的类型是字符串，返回string。

{% highlight javascript %}

typeof "123"
// string

{% endhighlight %}

- 如果值的类型是函数，返回function。

{% highlight javascript %}

typeof print
// function

{% endhighlight %}

- 如果值的类型不属于上面任何一种情况，返回object。

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

## 数值

JavaScript内部，所有数字都是以浮点数形式储存。由于浮点数不是精确的值，所以涉及浮点数的比较和运算要特别小心。

{% highlight javascript %}

0.1 + 0.2 === 0.3
// false

0.3 / 0.1
// 2.9999999999999996

{% endhighlight %}

## 布尔值

Javascript将下面的值，都视为false。

- undefined
- null
- false
- 0
- ""

{% highlight javascript %}

if (""){ console.info(true);}
// 没有任何输出

{% endhighlight %}

需要特别注意的是，空数组（[]）和空对象（{}）对应的布尔值，都是true。

{% highlight javascript %}

if ([]){ console.info(true);}
// true

if ({}){ console.info(true);}
// true

{% endhighlight %}

## 运算符

### void运算符

void运算符的作用是执行一个表达式，然后返回undefined。

它可以写成

{% highlight javascript %}

void  expr

{% endhighlight %}

或者

{% highlight javascript %}

void(expr)

{% endhighlight %}

建议采用后一种形式，即总是使用括号。因为void运算符的优先性很高，如果不使用括号，容易造成错误的结果。比如，void 4+7 实际上等同于 (void 4) +7 。

这个运算符号主要是用于书签工具（bookmarklet）或者用于在超级链接中插入代码，目的是返回undefined可以防止网页跳转。以书签工具为例，下面的代码会导致直接在当前窗口打开新链接。

{% highlight javascript %}

javascript:window.open("http://www.whitehouse.gov/");

{% endhighlight %}

使用void运算符后，就会跳出一个新窗口打开链接。

{% highlight javascript %}

javascript:void(window.open("http://www.whitehouse.gov/"));

{% endhighlight %}

写入超级链接，就是下面这样：

{% highlight html %}

 <a href="javascript:void(doSomething());">Compute</a>

{% endhighlight %}

### 比较运算符

- == 相等
- === 严格相等
- != 不相等
- !== 严格不相等
- < 小于
- <= 小于或等于
- \> 大于
- \>= 大于或等于

### 相等运算符与严格相等运算符

相等运算符（==）比较两个“值”是否相等，严格相等运算符（===）比较它们是否为“同一个值”。

如果两个值不是同一个类型，严格相等运算符（===）直接返回false，而相等运算符（==）会将它们转化成同一个类型，再用严格相等运算符进行比较。

#### 相等运算符的比较规则

（1） undefined和null两者，与自身或互相比较时，结果为true，与其他类型的值比较时，结果都为false。

（2）字符串与数值比较时，字符串转化成数值。

（3）布尔值与非布尔值比较时，布尔值转化成数值，再进行比较。

（4）对象与字符串或数值比较时，对象转化成原始类型的值，再进行比较。

由于这种转化会返回一些违反直觉的结果，因此不推荐使用==，建议只使用===。

{% highlight javascript %}

1 == true
// true

"2" == true
// false

2 == true
// false

2 == false
// false

"true" == true
// false

null == null
// true

undefined == null
// true

false == null
// false

0 == null
// false

{% endhighlight %}

#### 严格相等运算符的比较规则

比较不同类型的值时，严格相等运算符遵守以下规则：

（1）字符串与字符串比较时，看它们的值是否相同。

（2）布尔值与布尔值比较时，看它们的值是否相同。

（3）数字与数字比较时，看它们的值是否相同。同时，NaN与任何值都不相等（包括其自身），以及正0等于负0。

{% highlight javascript %}

	NaN !== _  // 任何值包括其自身
    
    +0 === -0

{% endhighlight %}

（4）两个复合类型的量比较时（包括对象、数组、函数），不是比较它们的值是否相等，而是比较它们是否指向同一个对象。

{% highlight javascript %}

{} === {}
// false

[] === []
// false

(function (){}) === (function (){})
// false

{% endhighlight %}

如果两个变量指向同一个复合类型的值，则它们相等。

{% highlight javascript %}

var v1 = {};
var v2 = v1;

v1 === v2
// true

{% endhighlight %}

（5）如果两个变量的值都是undefined或null，它们是相等的。

{% highlight javascript %}

var v1 = undefined;
var v2 = undefined;

v1 === v2
// true

var v1 = null;
var v2 = null;

v1 === v2
// true

{% endhighlight %}

因为变量声明后默认类型是undefined，因此两个只声明未赋值的变量是相等的。

{% highlight javascript %}

var v1;
var v2;

v1 === v2
// true

{% endhighlight %}

### 布尔运算符

(1) ! 取反运算

以下五个值取反后为true，其他都为false。

- undefined
- null
- false
- 0
- ""

(2) && 且运算

(3) OR 或运算

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

## Object对象

Object对象的原型的toString方法，会返回对象的详细类型，比typeof运算符更详细。

{% highlight javascript %}

Object.prototype.toString.call([1,2,3])
// '[object Array]'
    
Object.prototype.toString.call(/xyz/)
// '[object RegExp]'

{% endhighlight %}

利用这一点，我们可以写一个更准确的toType函数。

{% highlight javascript %}

 var toType = function(obj) {
      return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }

toType({a: 4}) // "object"
toType([1, 2, 3]) // "array"
(function() { return toType(arguments) }()) // "arguments"
toType(new ReferenceError()) // "error"
toType(new Date()) // "date"
toType(/a-z/) // "regexp"
toType(Math) // "math"
toType(JSON) // "json"
toType(new Number(4)) // "number"
toType(new String("abc")) // "string"
toType(new Boolean(true)) // "boolean"

{% endhighlight %}

不过，对于原始类型的变量，这个方法不能识别。

{% highlight javascript %}

Object.prototype.toString.call(123)
// '[object Number]'

{% endhighlight %}

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

{% endhighlight %}

只有下一行的开始与本行的结尾，无法放在一起解释，解释器才会自动添加分号。

{% highlight javascript %}

if (a < 0) a = 0
console.log(a)

// 等同于下面的代码，因为0console没有意义

if (a < 0) a = 0;
console.log(a)

{% endhighlight %}

由于解释器自动添加分号的行为难以预测，因此编写代码的时候不应该省略行尾的分号。

## 参考链接

- Dr. Axel Rauschmayer, [A quick overview of JavaScript](http://www.2ality.com/2011/10/javascript-overview.html)
- Dr. Axel Rauschmayer, [Improving the JavaScript typeof operator](http://www.2ality.com/2011/11/improving-typeof.html)
- Dr. Axel Rauschmayer, [Automatic semicolon insertion in JavaScript](http://www.2ality.com/2011/05/semicolon-insertion.html)
