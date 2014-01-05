---
title: 语法概述
layout: page
category: grammar
date: 2012-12-14
modifiedOn: 2013-12-08
---

## 基本句法和变量

### 语句

JavaScript程序的执行单位为行（line），也就是一行一行地执行。一般情况下，每一行就是一个语句。

语句（statement）是为了完成某种任务而进行的操作，比如下面就是一行赋值语句：

{% highlight javascript %}

var a = 1 + 3 ;

{% endhighlight %}

这条语句先用var命令，声明了变量a，然后将 1+3 的运算结果赋值给变量a。

“1+3”叫做表达式（expression），指一个为了得到返回值的计算式。语句和表达式的区别在于，前者主要为了进行某种操作，后者则是为了得到返回值。凡是JavaScript语言中预期为值的地方，都可以使用表达式。比如，赋值语句的等号右边，预期是一个值，因此可以放置各种表达式。

语句以分号结尾，一个分号就表示一个语句结束。多个语句可以写在一行内。

{% highlight javascript %}

var a = 1 + 3 ; var b = "abc";

{% endhighlight %}

分号前面可以没有任何内容，JavaScript引擎将其视为空语句。

{% highlight javascript %}

;;;

{% endhighlight %}

上面的代码就表示3个空语句。（关于分号的更多介绍，请看后文《结尾的分号》一节。）

表达式不需要分号结尾。一旦在表达式后面添加分号，则JavaScript引擎就将表达式视为语句，这样会产生一些没有任何意义的语句。

{% highlight javascript %}

1 + 3;

"abc";

{% endhighlight %}

上面两行语句有返回值，但是没有任何意义，因为只是返回一个单纯的值，没有任何其他操作。

### 变量

变量是对“值”的引用，使用变量等同于引用一个值。每一个变量都有一个变量名。

{% highlight javascript %}

var a = 1;

{% endhighlight %}

上面的代码先声明变量a，然后在变量a与数值1之间建立引用关系，也称将数值1“赋值”给变量a。以后，引用变量a就会得到数值1。最前面的var，是变量声明命令。它表示通知解释引擎，要创建一个变量a。

变量的声明和赋值，是分开的两个步骤，上面的代码将它们合在了一起，实际的步骤是下面这样。

{% highlight javascript %}

var a;

a = 1;

{% endhighlight %}

如果只是声明变量而没有赋值，则该变量的值为undefined。

{% highlight javascript %}

var a;
a
// undefined

{% endhighlight %}

JavaScript允许省略var，直接对未声明的变量赋值。也就是说，var a = 1 与 a = 1，这两条语句的效果相同。但是由于这样的做法很容易不知不觉地创建全局变量（尤其是在函数内部），所以建议总是使用var命令声明变量。

> 严格地说，var a = 1 与 a = 1，这两条语句的效果不完全一样，主要体现在delete命令无法删除前者。不过，绝大多数情况下，这种差异是可以忽略的。

如果一个变量没有声明就直接使用，JavaScript会报错，告诉你变量未定义。

{% highlight javascript %}

x
// ReferenceError: x is not defined 

{% endhighlight %}

上面代码直接使用变量x，系统就报错，告诉你变量x没有声明。

可以在同一条var命令中声明多个变量。

{% highlight javascript %}

var a,b;

{% endhighlight %}

JavaScirpt是一种动态类型语言，也就是说，变量的类型没有限制，可以赋予各种类型的值。

{% highlight javascript %}

var a = 1;

a = "hello";

{% endhighlight %}

上面代码中，变量a起先被赋值为一个数值，后来又被重新赋值为一个字符串。第二次赋值的时候，因为变量a已经存在，所以不需要使用var命令。如果用了，就等于重新声明一个变量a，会覆盖掉前面的同名变量。

### 变量提升

JavaScript引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。这造成的结果，就是所有的变量的声明语句，都会被提升到代码的头部，这就叫做变量提升。

{% highlight javascript %}

console.log(a);
var a = 1;

{% endhighlight %}

上面的代码首先使用console.log方法，在控制台（console）显示变量a的值。这时变量a还没有声明和赋值，所以这是一种错误的做法，但是实际上不会报错。因为存在变量提升，真正运行的是下面的代码：

{% highlight javascript %}

var a;
console.log(a);
a = 1;

{% endhighlight %}

最后的结果是显示undefined，表示变量a已声明，但还未赋值。

请注意，变量提升只对var命令声明的变量有效，如果一个变量不是用var命令声明的，就不会发生变量提升。

{% highlight javascript %}

console.log(b);
b = 1;

{% endhighlight %}

上面的语句将会报错，提示“ReferenceError: b is not defined”，即变量b未声明，这是因为b不是用var命令声明的，JavaScript引擎不会将其提升，而只是视为对顶层对象的b属性的赋值。

### 标识符

标识符（identifier）是用来识别具体对象的一个名称。最常见的标识符就是变量名，以及后面要提到的函数名。JavaScript语言的标识符对大小写敏感，所以a和A是两个不同的标识符。

标识符有一套命名规则，不符合规则的就是非法标识符。JavaScript引擎遇到非法标识符，就会报错。

简单说，标识符命名规则如下：

- 第一个字符可以是任意Unicode字母，以及美元符号（$）和下划线（_）。
- 第二个字符及后面的字符，还可以用数字。

下面这些都是合法的标识符。

{% highlight javascript %}

arg0
_tmp
$elem
π

{% endhighlight %}

下面这些则是不合法的标识符。

{% highlight javascript %}

1a
23
***
a+b
-d

{% endhighlight %}

中文是合法的标识符，可以用作变量名。

{% highlight javascript %}

var 临时变量 = 1;

{% endhighlight %}

> JavaScript有一些保留字，不能用作标识符：arguments、break、case、catch、class、const、continue、debugger、default、delete、do、else、enum、eval、export、extends、false、finally、for、function、if、implements、import、in、instanceof、interface、let、new、null、package、private、protected、public、return、static、super、switch、this、throw、true、try、typeof、var、void、while、with、yield。

另外，还有三个词虽然不是保留字，但是因为具有特别含义，也不应该用作标识符：Infinity、NaN、undefined。

### 注释

源码中被JavaScript引擎忽略的部分就叫做注释，它的作用是对代码进行解释。Javascript提供两种注释：一种是单行注释，用//起头；另一种是多行注释，放在/\* 和 \*/之间。

{% highlight javascript %}

// 这是单行注释

/*
 这是  
 多行
 注释
*/

{% endhighlight %}

本教程后面的代码部分，会采用这两种形式说明代码的运行结果，以及需要注意的地方。

### 区块

JavaScript使用大括号，将相关的语句组合在一起，称为“区块”（block）。

与大多数编程语言不一样，JavaScript的区块不构成单独的作用域（scope）。也就是说，区块中的变量就是全局变量。

{% highlight javascript %}

{ 
	var a = 1;
}

a
// 1

{% endhighlight %}

上面代码在区块内部，声明并赋值了变量a，然后在区块外部变量a依然有效，这说明区块不构成单独的作用域。

JavaScript允许对区块加上标签（label）。

{% highlight javascript %}

function test(printTwo) {
    printing: {
        console.log("One");
        if (!printTwo) break printing;
        console.log("Two");
    }
    console.log("Three");
}

test(false)
// One
// Three

{% endhighlight %}

上面代码有一个标签为printing的区块，当不满足条件时，可以使用break命令跳出该区块。所以，运行结果为One和Three，没有输出Two。

### 条件语句

**（1）if 结构**

if结构先判断一个表达式的布尔值，如果为true，则执行后面代码块中的代码，如果为false，则跳过代码块中的代码。

{% highlight javascript %}

if (m === 3) {
     // then
}

{% endhighlight %}

上面代码表示，代码块只有在m等于3时，才会得到执行。

if代码块后面，还可以跟一个else代码块，表示括号中的表示式为false时，所要执行的代码。

{% highlight javascript %}

 if (m === 3) {
    // then
 } else {
   // else
 }

{% endhighlight %}

上面代码判断变量m是否等于3，如果等于就执行if代码块，否则执行else代码块。

对同一个变量进行多次判断时，多个if...else语句可以连写在一起。

{% highlight javascript %}

if (m === 0) {
    // ...
} else if (m === 1) {
   // ...
} else if (m === 2) {
   // ...
} else {
   // ...
}

{% endhighlight %}

**（2）switch结构**

多个if...else连在一起使用的时候，可以转为使用更方便的switch结构。

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

上面代码根据变量fruit的值，选择执行相应的case。如果所有case都不符合，则执行最后的default部分。需要注意的是，每个case代码块内部的break语句不能少，否则会接下去执行下一个case代码块，而不是跳出switch结构。

switch结构不利于代码重用，往往可以用对象形式重写。

{% highlight javascript %}

var o = {
	banana: function (){ return },
	apple: function (){ return },
	default: function (){ return }
};

if (o[fruit]){
	o[fruit]();
} else {
	o['default']();
}

{% endhighlight %}

### 循环语句

循环语句用于重复执行某个操作，它有多种形式。

**（1）while循环**

While语句包括一个循环条件，只要该条件为真，就不断循环。

{% highlight javascript %}

var i = 0;

while (i<100){
	console.log('i当前为：' + i);
	i++;
}	

{% endhighlight %}

上面的代码将循环100次，直到i等于100为止。

**（2）for循环**

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

**（3）do...while循环**

do...while循环与while循环类似，唯一的区别就是先运行一次循环体，然后判断循环条件。

{% highlight javascript %}

do {
	// ...
} while(condition);

{% endhighlight %}

不管条件是否为真，do..while循环至少运行一次，这是这种结构最大的特点。另外，while语句后面的分号不能省略。

**（4）break语句和continue语句**

如果在循环的中途，想要跳出循环，可以使用break语句。如果想不再进行本次循环的后续操作，直接进入下一轮循环，可以使用continue语句。

{% highlight javascript %}

var i = 0;

while (i<100){
	console.log('i当前为：' + i);
	i++;
	if (i === 10) break;
}

{% endhighlight %}

上面代码只会执行10次循环，一旦i等于10，就会跳出循环。

{% highlight javascript %}

var i = 0;

while (i<100){
	i++;
	if (i%2===0) continue;
	console.log('i当前为：' + i);
}

{% endhighlight %}

上面代码只有在i为奇数时，才会输出i的值。如果i为偶数，则直接进入下一轮循环。

## 数据类型

### 原始类型和合成类型

JavaScript的值的类型分成两大类：原始类型（primitive type）和合成类型（complex type）。

原始类型又分成三种。

- 数值（number）
- 字符串（string）
- 布尔值（boolean）

“数值”就是整数和小数(比如3.14)，“字符串”就是由多个字符组成的文本（比如"Hello World"），“布尔值”则是true（真）和false（假）两个特定值。

合成类型也分成三种。

- 对象（object）
- 数组（array）
- 函数（function）

对象和数组是两种不同的数据组合方式，而函数其实是处理数据的方法。JavaScript把它当成一种数据类型，可以像其他类型的数据一样，进行赋值和传递，这为编程带来了很大的灵活性，体现了JavaScript作为“函数式语言”的本质。

除了上面这六种数据类型，JavaScript还定义一个特殊的数据类型undefined和一个特殊的值null。

undefined表示“未定义”，即还没有确定数据类型。如果一个变量只是被声明，没有被赋值，那么它的值默认就是undefined。

{% highlight javascript %}

var v;
v
// undefined

{% endhighlight %}

以下是三种常见的得到undefined的情况。

- 变量声明但没有赋值。
- 读取对象不存在的属性。
- 运行没有返回语句的函数。

第一种情况已经举过例了，第二和第三种情况请看下面的代码。

{% highlight javascript %}

this.foo // undefined

(function f(){})() // undefined

{% endhighlight %}

null表示非对象（no object），即一个没有具体值的对象。它不是一种单独的数据类型，而是包含在对象类型（object）之中的一种特殊值。

{% highlight javascript %}

var v = null;
v
// null

{% endhighlight %}

上面代码表示，v的类型设定为对象，但是目前还没有具体的值，所以赋值为null。

关于null和undefined的区别，可以理解成null表示什么也没有（nothing），undefined表示缺少一个值，所以，变量已经声明但没有赋值时，就等于undefined。

需要注意的是，JavaScript的标识名区分大小写，所以undefined和null不同于Undefined和Null（或者其他仅仅大小写不同的词形），后者只是普通的变量名。

这里需要明确的是，JavaScript的所有数据，都可以视为对象。不仅合成类型的数据（对象、数组、函数）是对象，就连原始类型的数据（数值、字符串、布尔值）也可以用对象方式调用。

### 布尔值

布尔值包含true和false两个值。下列运算符会返回布尔值：

- 两元逻辑运算符： && (And)，|| (Or)
- 前置逻辑运算符： ! (Not)
- 相等运算符：===，!==，==，!=
- 比较运算符：>，>=，<，<=

如果JavaScript预期某个位置应该是布尔值，会将该位置上现有的值自动转为布尔值。转换规则是除了下面五个值被转为false，其他值都视为true。

- undefined
- null
- false
- 0
- ""

下面是一个例子。

{% highlight javascript %}

if (""){ console.log(true);}
// 没有任何输出

{% endhighlight %}

上面代码的if命令后面是一个空字符串，被转为false，因此不会进入代码块，所以没有任何输出。

需要特别注意的是，空数组（[]）和空对象（{}）对应的布尔值，都是true。

{% highlight javascript %}

if ([]){ console.log(true);}
// true

if ({}){ console.log(true);}
// true

{% endhighlight %}

更多关于数据类型转换的介绍，参见《数据类型转换》一节。

### typeof运算符

JavaScript有三种方法，可以确定一个值到底是什么类型。

- typeof运算符
- instanceof运算符
- Object.prototype.toString方法

instanceof运算符放在《面向对象编程》一章介绍，Object.prototype.toString方法放在《标准库》的Object 一节介绍。下面介绍typeof 运算符。

typeof运算符可以返回一个值的数据类型，可能有以下结果：

**（1）数值、字符串、布尔值分别返回number、string、boolean。**

{% highlight javascript %}

typeof 123 // "number"
typeof "123" // "string"
typeof false // "boolean"

{% endhighlight %}

**（2）函数返回function。**

{% highlight javascript %}

// 定义一个空函数
function f(){}

typeof f
// "function"

{% endhighlight %}

**（3）undefined返回undefined。**

{% highlight javascript %}

typeof undefined
// "undefined"

{% endhighlight %}

利用这一点，typeof可以用来检查一个没有声明的变量，而不报错。

{% highlight javascript %}

v
// ReferenceError: v is not defined

typeof v
// "undefined"

{% endhighlight %}

实际编程中，这个特点通常用在判断语句。

{% highlight javascript %}

// 错误的写法
if (v){
	// ...
}
// ReferenceError: v is not defined

// 正确的写法
if (typeof v === "undefined"){
	// ...
}

{% endhighlight %}

**（4）除此以外，都返回object。**

{% highlight javascript %}

typeof window // "object"
typeof {} // "object"
typeof [] // "object"
typeof null // "object"

{% endhighlight %}

从上面代码可以看到，空数组（[]）的类型也是object，这表示在JavaScript内部，数组本质上只是一种特殊的对象。另外，null的类型也是object，说明它不是一种的数据类型。

既然typeof对数组（array）和对象（object）的显示结果都是object，那么怎么区分它们呢？instanceof运算符可以做到。

{% highlight javascript %}

var o = {};
var a = [];

o instanceof Array // false
a instanceof Array // true

{% endhighlight %}

instanceof运算符的详细解释，请见《面向对象编程》一章。

## 结尾的分号

### 不使用分号结尾的语句 

分号表示一条语句的结尾。但是，有一些语法结构不需要在语句的结尾添加分号，主要是以下三种情况。

**（1）for和while循环**

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

**（2）分支语句：if， switch， try**

{% highlight javascript %}

if (true) {} // 没有分号

switch () {} // 没有分号

try {} catch {} // 没有分号

{% endhighlight %}

**（3）函数的声明语句**

{% highlight javascript %}

function f() {} // 没有分号

{% endhighlight %}

但是函数表达式仍然要使用分号。

{% highlight javascript %}

var f = function f() {};

{% endhighlight %}

以上三种情况，如果使用了分号，并不会出错。因为，解释引擎会把这个分号解释为空语句。

### 分号的自动添加

除了本来就不写分号的情况，JavaScript引擎还有一个特点，就是在应该写分号却没写的情况下，它会自动添加。

{% highlight javascript %}

var a = b + c

// 等同于

var a = b + c;

{% endhighlight %}

但是，这种自动添加不是绝对的。如果下一行的开始可以与本行的结尾连在一起解释，就不会自动添加分号。

{% highlight javascript %}

var
a
=
3

// 等同于

var a = 3;

"abc"
.length

// 等同于

"abc".length

{% endhighlight %}

上面代码举了两个例子，每行的尾部都没有分号，JavaScript并不会自动添加分号，因为每行的结尾与下一行的开头可以放在一起解释。下面这个例子也不会自动添加分号。

{% highlight javascript %}

3 * (2 * (4 + (3 - 5))) 
+ 
(10 * (27 / 6))

// 等同于

3 * (2 * (4 + (3 - 5))) + (10 * (27 / 6))

{% endhighlight %}

这些例子还是比较容易看出来的，但是下面的例子就不那么容易发现了。它们都不会自动添加分号。

{% highlight javascript %}

var a = b + c
(d+e).toString();
/* 解释为c(d+e)，
   即先进行乘法运算 */

a = b
/hi/g.exec(c).map(d);
/* 解释为 a = b / hi / g.exec(c).map(d)，
   即把正则表达式的斜杠当作除法运算符 */ 

var a = "b"
[ "red", "green" ].forEach(function(c) { console.log(c) })
/* 结果报错，因为两行连在一起，
 解释为"b"["red", "green"]，
 即把字符串当作一个数组，按索引取值 */ 

var a = 0;
var f = function(x) { return x }
(a++)
/* f等于0，
   因为(a++)被视为匿名函数的调用 */

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

// 等同于下面的代码，
// 因为0console没有意义

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

由于解释引擎自动添加分号的行为难以预测，因此编写代码的时候不应该省略行尾的分号。

## 参考链接

- Axel Rauschmayer, [A quick overview of JavaScript](http://www.2ality.com/2011/10/javascript-overview.html)
- Axel Rauschmayer, [Improving the JavaScript typeof operator](http://www.2ality.com/2011/11/improving-typeof.html)
- Axel Rauschmayer, [Automatic semicolon insertion in JavaScript](http://www.2ality.com/2011/05/semicolon-insertion.html)
- Axel Rauschmayer, [Categorizing values in JavaScript](http://www.2ality.com/2013/01/categorizing-values.html)
- Rod Vagg, [JavaScript and Semicolons](http://dailyjs.com/2012/04/19/semicolons/)
