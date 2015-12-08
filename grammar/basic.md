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

```javascript
var a = 1 + 3;
```

这条语句先用var命令，声明了变量`a`，然后将`1 + 3`的运算结果赋值给变量`a`。

`1 + 3`叫做表达式（expression），指一个为了得到返回值的计算式。语句和表达式的区别在于，前者主要为了进行某种操作，一般情况下不需要返回值；后者则是为了得到返回值，一定会返回一个值。

凡是JavaScript语言中预期为值的地方，都可以使用表达式。比如，赋值语句的等号右边，预期是一个值，因此可以放置各种表达式。一条语句可以包含多个表达式。

语句以分号结尾，一个分号就表示一个语句结束。多个语句可以写在一行内。

```javascript
var a = 1 + 3 ; var b = 'abc';
```

分号前面可以没有任何内容，JavaScript引擎将其视为空语句。

```javascript
;;;
```

上面的代码就表示3个空语句。（关于分号的更多介绍，请看后文《结尾的分号》一节。）

表达式不需要分号结尾。一旦在表达式后面添加分号，则JavaScript引擎就将表达式视为语句，这样会产生一些没有任何意义的语句。

```javascript
1 + 3;
'abc';
```

上面两行语句有返回值，但是没有任何意义，因为只是返回一个单纯的值，没有任何其他操作。

### 变量

变量是对“值”的引用，使用变量等同于引用一个值。每一个变量都有一个变量名。

```javascript
var a = 1;
```

上面的代码先声明变量`a`，然后在变量`a`与数值1之间建立引用关系，也称为将数值1“赋值”给变量`a`。以后，引用变量`a`就会得到数值1。最前面的`var`，是变量声明命令。它表示通知解释引擎，要创建一个变量`a`。

变量的声明和赋值，是分开的两个步骤，上面的代码将它们合在了一起，实际的步骤是下面这样。

```javascript
var a;
a = 1;
```

如果只是声明变量而没有赋值，则该变量的值是不存在的，JavaScript使用`undefined`表示这种情况。

```javascript
var a;
a // undefined
```

JavaScript允许省略`var`，直接对未声明的变量赋值。也就是说，`var a = 1`与`a = 1`，这两条语句的效果相同。但是由于这样的做法很容易不知不觉地创建全局变量（尤其是在函数内部），所以建议总是使用`var`命令声明变量。

> 严格地说，`var a = 1` 与 `a = 1`，这两条语句的效果不完全一样，主要体现在`delete`命令无法删除前者。不过，绝大多数情况下，这种差异是可以忽略的。

如果一个变量没有声明就直接使用，JavaScript会报错，告诉你变量未定义。

```javascript
x
// ReferenceError: x is not defined
```

上面代码直接使用变量`x`，系统就报错，告诉你变量`x`没有声明。

可以在同一条`var`命令中声明多个变量。

```javascript
var a, b;
```

JavaScirpt是一种动态类型语言，也就是说，变量的类型没有限制，可以赋予各种类型的值。

```javascript
var a = 1;
a = 'hello';
```

上面代码中，变量`a`起先被赋值为一个数值，后来又被重新赋值为一个字符串。第二次赋值的时候，因为变量`a`已经存在，所以不需要使用`var`命令。

如果使用`var`重新声明一个已经存在的变量，是无效的。

```javascript
var x = 1;
var x;
x // 1
```

上面代码中，变量`x`声明了两次，第二次声明是无效的。

但是，如果第二次声明的同时还赋值了，则会覆盖掉前面的值。

```javascript
var x = 1;
var x = 2;

// 等同于

var x = 1;
var x;
x = 2;
```

### 变量提升

JavaScript引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。这造成的结果，就是所有的变量的声明语句，都会被提升到代码的头部，这就叫做变量提升（hoisting）。

```javascript
console.log(a);
var a = 1;
```

上面代码首先使用`console.log`方法，在控制台（console）显示变量a的值。这时变量`a`还没有声明和赋值，所以这是一种错误的做法，但是实际上不会报错。因为存在变量提升，真正运行的是下面的代码。

```javascript
var a;
console.log(a);
a = 1;
```

最后的结果是显示`undefined`，表示变量`a`已声明，但还未赋值。

请注意，变量提升只对`var`命令声明的变量有效，如果一个变量不是用`var`命令声明的，就不会发生变量提升。

```javascript
console.log(b);
b = 1;
```

上面的语句将会报错，提示“ReferenceError: b is not defined”，即变量`b`未声明，这是因为`b`不是用`var`命令声明的，JavaScript引擎不会将其提升，而只是视为对顶层对象的`b`属性的赋值。

### 标识符

标识符（identifier）是用来识别具体对象的一个名称。最常见的标识符就是变量名，以及后面要提到的函数名。JavaScript语言的标识符对大小写敏感，所以`a`和`A`是两个不同的标识符。

标识符有一套命名规则，不符合规则的就是非法标识符。JavaScript引擎遇到非法标识符，就会报错。

简单说，标识符命名规则如下：

- 第一个字符，可以是任意Unicode字母，以及美元符号（`$`）和下划线（`_`）。
- 第二个字符及后面的字符，除了Unicode字母、美元符号和下划线，还可以用数字`0-9`。

下面这些都是合法的标识符。

```javascript
arg0
_tmp
$elem
π
```

下面这些则是不合法的标识符。

```javascript
1a  // 第一个字符不能是数字
23  // 同上
***  // 标识符不能包含星号
a+b  // 标识符不能包含加号
-d  // 标识符不能包含减号或连词线
```

中文是合法的标识符，可以用作变量名。

```javascript
var 临时变量 = 1;
```

> JavaScript有一些保留字，不能用作标识符：arguments、break、case、catch、class、const、continue、debugger、default、delete、do、else、enum、eval、export、extends、false、finally、for、function、if、implements、import、in、instanceof、interface、let、new、null、package、private、protected、public、return、static、super、switch、this、throw、true、try、typeof、var、void、while、with、yield。

另外，还有三个词虽然不是保留字，但是因为具有特别含义，也不应该用作标识符：`Infinity`、`NaN`、`undefined`。

### 注释

源码中被JavaScript引擎忽略的部分就叫做注释，它的作用是对代码进行解释。Javascript提供两种注释：一种是单行注释，用//起头；另一种是多行注释，放在/\* 和 \*/之间。

```javascript
// 这是单行注释

/*
 这是
 多行
 注释
*/
```

此外，由于历史上JavaScript兼容HTML代码的注释，所以&lt;!--和--&gt;也被视为单行注释。

```javascript
x = 1; <!-- x = 2;
--> x = 3;
```

上面代码中，只有`x = 1`会执行，其他的部分都被注释掉了。

需要注意的是，--&gt;只有在行首，才会被当成单行注释，否则就是一个运算符。

```javascript
function countdown(n) {
  while (n --> 0) console.log(n);
}
countdown(3)
// 2
// 1
// 0
```

上面代码中，`n --> 0`实际上会当作`n-- > 0`，因为输出2、1、0。

### 区块

JavaScript使用大括号，将多个相关的语句组合在一起，称为“区块”（block）。

与大多数编程语言不一样，JavaScript的区块不构成单独的作用域（scope）。也就是说，区块中的变量与区块外的变量，属于同一个作用域。

```javascript
{
  var a = 1;
}

a // 1
```

上面代码在区块内部，声明并赋值了变量`a`，然后在区块外部，变量`a`依然有效，这说明区块不构成单独的作用域，与不使用区块的情况没有任何区别。所以，单独使用的区块在JavaScript中意义不大，很少出现。区块往往用来构成其他更复杂的语法结构，比如`for`、`if`、`while`、`function`等。

## 条件语句

条件语句提供一种语法构造，只有满足某个条件，才会执行相应的语句。JavaScript提供`if`结构和`switch`结构，完成条件判断。

### if 结构

if结构先判断一个表达式的布尔值，然后根据布尔值的真伪，执行不同的语句。

```javascript
if (expression)
  statement
```

上面是if结构的基本形式。需要注意的是，expression（表达式）必须放在圆括号中，表示对表达式求值。如果结果为`true`，就执行紧跟在后面的语句（statement）；如果结果为`false`，则跳过statement的部分。

```javascript
if (m === 3)
  m += 1;	
```

上面代码表示，只有在`m`等于3时，才会将其值加上1。

这种写法要求条件表达式后面只能有一个语句。如果想执行多个语句，必须在`if`的条件判断之后，加上大括号。

```javascript
if (m === 3) {
  m += 1;	
}
```

建议总是在`if`语句中使用大括号，因为这样方便插入语句。

注意，`if`后面的表达式，不要混淆“赋值表达式”（`=`）与“严格相等运算符”（`===`）或“相等运算符”（`==`）。因为，“赋值表达式”不具有比较作用。

```javascript
var x = 1;
var y = 2;
if (x = y) {
  console.log(x);
}
// "2"
```

上面代码的原意是，当`x`等于`y`的时候，才执行相关语句。但是，不小心将“严格相等运算符”写成“赋值表达式”，结果变成了将`y`赋值给`x`，然后条件就变成了，判断变量`x`的值（等于2）是否为`true`。

至于为什么优先采用“严格相等运算符”，而不是“相等运算符”（`==`），请参考《运算符》一节。

### if...else结构

`if`代码块后面，还可以跟一个`else`代码块，表示不满足条件时，所要执行的代码。

```javascript
if (m === 3) {
  // then
} else {
  // else
}
```

上面代码判断变量`m`是否等于3，如果等于就执行`if`代码块，否则执行`else`代码块。

对同一个变量进行多次判断时，多个`if...else`语句可以连写在一起。

```javascript
if (m === 0) {
    // ...
} else if (m === 1) {
   // ...
} else if (m === 2) {
   // ...
} else {
   // ...
}
```

`else`代码块总是跟随离自己最近的那个`if`语句。

```javascript
var m = 1;
var n = 2;

if (m !== 1)
if (n === 2) console.log('hello');
else console.log('world');
```

上面代码不会有任何输出，`else`代码块不会得到执行，因为它跟着的是最近的那个`if`语句，相当于下面这样。

```javascript
if (m !== 1) {
  if (n === 2) {
    console.log('hello');	
  } else {
    console.log('world');
  }
}
```

如果想让`else`代码块跟随最上面的那个`if`语句，就要改变大括号的位置。

```javascript
if (m !== 1) {
  if (n === 2) {
    console.log('hello');	
  }
} else {
  console.log('world');
}
// world
```

### switch结构

多个`if...else`连在一起使用的时候，可以转为使用更方便的`switch`结构。

```javascript
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
```

上面代码根据变量`fruit`的值，选择执行相应的`case`。如果所有`case`都不符合，则执行最后的`default`部分。需要注意的是，每个`case`代码块内部的`break`语句不能少，否则会接下去执行下一个`case`代码块，而不是跳出`switch`结构。

```javascript
var x = 1;

switch (x) {
  case 1:
    console.log('x等于1');
  case 2:
    console.log('x等于2');
  default:
    console.log('x等于其他值');
}
// x等于1
// x等于2
// x等于其他值
```

上面代码中，`case`代码块之中没有`break`语句，导致不会跳出`switch`结构，而会一直执行下去。

`switch`语句部分和`case`语句部分，都可以使用表达式。

```javascript
switch(1 + 3) {
  case 2 + 2:
    f();
    break;
  default:
    neverhappens();
}
```

上面代码的`default`部分，是永远不会执行到的。

需要注意的是，`switch`语句后面的表达式与`case`语句后面的表示式，在比较运行结果时，采用的是严格相等运算符（`===`），而不是相等运算符（`==`），这意味着比较时不会发生类型转换。

```javascript
var x = 1;

switch (x) {
  case true:
    console.log('x发生类型转换');
  default:
    console.log('x没有发生类型转换');
}
// x没有发生类型转换
```

上面代码中，由于变量`x`没有发生类型转换，所以不会执行`case true`的情况。这表明，`switch`语句内部采用的是“严格相等运算符”，详细解释请参考《运算符》一节。

`switch`结构不利于代码重用，往往可以用对象形式重写。

```javascript
var o = {
  banana: function () {},
  apple: function () {},
  default: function () {}
};

if (o[fruit]){
  o[fruit]();
} else {
  o['default']();
}
```

## 循环语句

循环语句用于重复执行某个操作，它有多种形式。

### while循环

`While`语句包括一个循环条件和一段代码块，只要条件为真，就不断循环执行代码块。

```javascript
while (expression)
  statement
```

`while`语句的循环条件是一个表达式（express），必须放在圆括号中。代码块部分，如果只有一条语句（statement），可以省略大括号，否则就必须加上大括号。

```javascript
while (expression) {
  statement
}
```

下面是`while`语句的一个例子。

```javascript
var i = 0;

while (i < 100){
  console.log('i当前为：' + i);
  i++;
}
```

上面的代码将循环100次，直到`i`等于100为止。

下面的例子是一个无限循环，因为条件总是为真。

```javascript
while (true) {
  console.log("Hello, world");
}
```

### for循环

`for`语句是循环命令的另一种形式。

```javascript
for(initialize; test; increment)
  statement

// 或者

for(initialize; test; increment) {
  statement
}
```

`for`语句后面的括号里面，有三个表达式。

- 初始化表达式（initialize）：确定循环的初始值，只在循环开始时执行一次。
- 测试表达式（test）：检查循环条件，只要为真就进行后续操作。
- 递增表达式（increment）：完成后续操作，然后返回上一步，再一次检查循环条件。

下面是一个例子。

```javascript
var x = 3;
for (var i = 0; i < x; i++) {
  console.log(i);
}
// 0
// 1
// 2
```

上面代码中，初始化表达式是`var i = 0`，即初始化一个变量`i`；测试表达式是`i < x`，即只要`i`小于`x`，就会执行循环；递增表达式是`i++`，即每次循环结束后，`i`增大1。

所有`for`循环，都可以改写成`while`循环。上面的例子改为`while`循环，代码如下。

```javascript
var x = 3;
var i = 0;

while (i < x) {
  console.log(i);
  i++;
}
```

`for`语句的三个部分（initialize，test，increment），可以省略任何一个，也可以全部省略。

```javascript
for ( ; ; ){
  console.log('Hello World');
}
```

上面代码省略了`for`语句表达式的三个部分，结果就导致了一个无限循环。

### do...while循环

`do...while`循环与`while`循环类似，唯一的区别就是先运行一次循环体，然后判断循环条件。

```javascript
do
  statement
while(expression);

// 或者

do {
  statement
} while(expression);
```

不管条件是否为真，`do..while`循环至少运行一次，这是这种结构最大的特点。另外，`while`语句后面的分号不能省略。

下面是一个例子。

```javascript
var x = 3;
var i = 0;

do {
  console.log(i);
  i++;
} while(i < x);
```

### break语句和continue语句

`break`语句和`continue`语句都具有跳转作用，可以让代码不按既有的顺序执行。

`break`语句用于跳出代码块或循环。

```javascript
var i = 0;

while(i < 100) {
  console.log('i当前为：' + i);
  i++;
  if (i === 10) break;
}
```

上面代码只会执行10次循环，一旦`i`等于10，就会跳出循环。

continue语句用于立即终止本轮循环，返回循环结构的头部，开始下一轮循环。

```javascript
var i = 0;

while (i < 100){
  i++;
  if (i%2 === 0) continue;
  console.log('i当前为：' + i);
}
```

上面代码只有在`i`为奇数时，才会输出`i`的值。如果`i`为偶数，则直接进入下一轮循环。

如果存在多重循环，不带参数的`break`语句和`continue`语句都只针对最内层循环。

### 标签（label）

JavaScript语言允许，语句的前面有标签（label），相当于定位符，用于跳转到程序的任意位置，标签的格式如下。

```javascript
label:
  statement
```

标签可以是任意的标识符，但是不能是保留字，语句部分可以是任意语句。

标签通常与`break`语句和`continue`语句配合使用，跳出特定的循环。

```javascript
top:
  for (var i = 0; i < 3; i++){
    for (var j = 0; j < 3; j++){
      if (i === 1 && j === 1) break top;
      console.log('i=' + i + ', j=' + j);
  }
}
// i=0, j=0
// i=0, j=1
// i=0, j=2
// i=1, j=0
```

上面代码为一个双重循环区块，`break`命令后面加上了`top`标签（注意，`top`不用加引号），满足条件时，直接跳出双层循环。如果`break`语句后面不使用标签，则只能跳出内层循环，进入下一次的外层循环。

`continue`语句也可以与标签配合使用。

```javascript
top:
  for (var i = 0; i < 3; i++){
    for (var j = 0; j < 3; j++){
      if (i === 1 && j === 1) continue top;
      console.log('i=' + i + ', j=' + j);
  }
}
// i=0, j=0
// i=0, j=1
// i=0, j=2
// i=1, j=0
// i=2, j=0
// i=2, j=1
// i=2, j=2
```

上面代码中，`continue`命令后面有一个标签名，满足条件时，会跳过当前循环，直接进入下一轮外层循环。如果`continue`语句后面不使用标签，则只能进入下一轮的内层循环。

## 数据类型

### 概述

JavaScript语言的每一个值，都属于某一种数据类型。JavaScript的数据类型，共有六种。（ES6又新增了第七种Symbol类型的值，本教程不涉及。）

- 数值（number）：整数和小数（比如1和3.14）
- 字符串（string）：字符组成的文本（比如"Hello World"）
- 布尔值（boolean）：`true`（真）和`false`（假）两个特定值
- undefined：表示“未定义”或不存在，即此处目前没有任何值
- null：表示空缺，即此处应该有一个值，但目前为空
- 对象（object）：各种值组成的集合

通常，我们将数值、字符串、布尔值称为原始类型（primitive type）的值，即它们是最基本的数据类型，不能再细分了。而将对象称为合成类型（complex type）的值，因为一个对象往往是多个原始类型的值的合成，可以看作是一个存放各种值的容器。至于`undefined`和`null`，一般将它们看成两个特殊值。

对象又可以分成三个子类型。

- 狭义的对象（object）
- 数组（array）
- 函数（function）

狭义的对象和数组是两种不同的数据组合方式，而函数其实是处理数据的方法。JavaScript把函数当成一种数据类型，可以像其他类型的数据一样，进行赋值和传递，这为编程带来了很大的灵活性，体现了JavaScript作为“函数式语言”的本质。

这里需要明确的是，JavaScript的所有数据，都可以视为广义的对象。不仅数组和函数属于对象，就连原始类型的数据（数值、字符串、布尔值）也可以用对象方式调用。为了避免混淆，此后除非特别声明，本教程的”对象“都特指狭义的对象。

本教程将详细介绍所有的数据类型。`undefined`和`null`两个特殊值和布尔类型Boolean比较简单，将在本节介绍，其他类型将各自有单独的一节。

### typeof运算符

JavaScript有三种方法，可以确定一个值到底是什么类型。

- `typeof`运算符
- `instanceof`运算符
- `Object.prototype.toString`方法

`instanceof`运算符和`Object.prototype.toString`方法，将在后文相关章节介绍。这里着重介绍`typeof`运算符。

`typeof`运算符可以返回一个值的数据类型，可能有以下结果。

**（1）原始类型**

数值、字符串、布尔值分别返回`number`、`string`、`boolean`。

```javascript
typeof 123 // "number"
typeof '123' // "string"
typeof false // "boolean"
```

**（2）函数**

函数返回`function`。

```javascript
function f() {}
typeof f
// "function"
```

**（3）undefined**

`undefined`返回`undefined`。

```javascript
typeof undefined
// "undefined"
```

利用这一点，typeof可以用来检查一个没有声明的变量，而不报错。

```javascript
v
// ReferenceError: v is not defined

typeof v
// "undefined"
```

实际编程中，这个特点通常用在判断语句。

```javascript
// 错误的写法
if (v) {
  // ...
}
// ReferenceError: v is not defined

// 正确的写法
if (typeof v === "undefined") {
  // ...
}
```

**（4）其他**

除此以外，其他情况都返回`object`。

```javascript
typeof window // "object"
typeof {} // "object"
typeof [] // "object"
typeof null // "object"
```

从上面代码可以看到，空数组（`[]`）的类型也是`object`，这表示在JavaScript内部，数组本质上只是一种特殊的对象。另外，`null`的类型也是`object`，这是由于历史原因造成的，为了兼容以前的代码，后来就没法修改了，并不是说`null`就属于对象，本质上`null`是一个类似于`undefined`的特殊值。

既然`typeof`对数组（array）和对象（object）的显示结果都是`object`，那么怎么区分它们呢？instanceof运算符可以做到。

```javascript
var o = {};
var a = [];

o instanceof Array // false
a instanceof Array // true
```

`instanceof`运算符的详细解释，请见《面向对象编程》一章。

## null和undefined

### 概述

`null`与`undefined`都可以表示“没有”，含义非常相似。将一个变量赋值为`undefined`或`null`，老实说，语法效果几乎没区别。

```javascript
var a = undefined;
// 或者
var a = null;
```

上面代码中，a变量分别被赋值为`undefined`和`null`，这两种写法的效果几乎等价。

在`if`语句中，它们都会被自动转为false，相等运算符（`==`）甚至直接报告两者相等。

```javascript
if (!undefined) {
  console.log('undefined is false');
}
// undefined is false

if (!null) {
  console.log('null is false');
}
// null is false

undefined == null
// true
```

上面代码说明，两者的行为是何等相似！Google公司开发的JavaScript语言的替代品Dart语言，就明确规定只有`null`，没有`undefined`！

既然含义与用法都差不多，为什么要同时设置两个这样的值，这不是无端增加复杂度，令初学者困扰吗？这与历史原因有关。

1995年JavaScript诞生时，最初像Java一样，只设置了`null`作为表示"无"的值。根据C语言的传统，`null`被设计成可以自动转为0。

```javascript
Number(null) // 0
5 + null // 5
```

但是，JavaScript的设计者Brendan Eich，觉得这样做还不够，有两个原因。

首先，null像在Java里一样，被当成一个对象。但是，JavaScript的数据类型分成原始类型和合成类型两大类，Brendan Eich觉得表示"无"的值最好不是对象。

其次，JavaScript的最初版本没有包括错误处理机制，发生数据类型不匹配时，往往是自动转换类型或者默默地失败。Brendan Eich觉得，如果`null`自动转为0，很不容易发现错误。

因此，Brendan Eich又设计了一个`undefined`。他是这样区分的：`null`是一个表示"无"的对象，转为数值时为0；`undefined`是一个表示"无"的原始值，转为数值时为`NaN`。

```javascript
Number(undefined) // NaN
5 + undefined // NaN
```

但是，这样的区分在实践中很快就被证明不可行。目前`null`和`undefined`基本是同义的，只有一些细微的差别。

`null`的特殊之处在于，JavaScript把它包含在对象类型（object）之中。

```javascript
typeof null // "object"
```

上面代码表示，查询`null`的类型，JavaScript返回`object`（对象）。

这并不是说null的数据类型就是对象，而是JavaScript早期部署中的一个约定俗成，其实不完全正确，后来再想改已经太晚了，会破坏现存代码，所以一直保留至今。

注意，JavaScript的标识名区分大小写，所以`undefined`和`null`不同于`Undefined`和`Null`（或者其他仅仅大小写不同的词形），后者只是普通的变量名。

### 用法和含义

对于`null`和`undefined`，可以大致可以像下面这样理解。

`null`表示空值，即该处的值现在为空。典型用法是：

- 作为函数的参数，表示该函数的参数是一个没有任何内容的对象。
- 作为对象原型链的终点。

`undefined`表示不存在值，就是此处目前不存在任何值。典型用法是：

- 变量被声明了，但没有赋值时，就等于undefined。
- 调用函数时，应该提供的参数没有提供，该参数等于undefined。
- 对象没有赋值的属性，该属性的值为undefined。
- 函数没有返回值时，默认返回undefined。

```javascript
var i;
i // undefined

function f(x){console.log(x)}
f() // undefined

var  o = new Object();
o.p // undefined

var x = f();
x // undefined
```

## 布尔值

布尔值代表“真”和“假”两个状态。“真”用关键字true表示，“假”用关键字false表示。布尔值只有这两个值。

下列运算符会返回布尔值：

- 两元逻辑运算符： `&&` (And)，`||` (Or)
- 前置逻辑运算符： `!` (Not)
- 相等运算符：`===`，`!==`，`==`，`!=`
- 比较运算符：`>`，`>=`，`<`，`<=`

如果JavaScript预期某个位置应该是布尔值，会将该位置上现有的值自动转为布尔值。转换规则是除了下面六个值被转为`false`，其他值都视为`true`。

- `undefined`
- `null`
- `false`
- `0`
- `NaN`
- `""`（空字符串）

布尔值往往用于程序流程的控制，请看一个例子。

```javascript
if ('') {
  console.log(true);
}
// 没有任何输出
```

上面代码的`if`命令后面的判断条件，预期应该是一个布尔值，所以JavaScript自动将空字符串，转为布尔值`false`，导致程序不会进入代码块，所以没有任何输出。

需要特别注意的是，空数组（`[]`）和空对象（`{}`）对应的布尔值，都是`true`。

```javascript
if ([]) {
  console.log(true);
}
// true

if ({}) {
  console.log(true);
}
// true
```

更多关于数据类型转换的介绍，参见《数据类型转换》一节。

## 参考链接

- Axel Rauschmayer, [A quick overview of JavaScript](http://www.2ality.com/2011/10/javascript-overview.html)
- Axel Rauschmayer, [Improving the JavaScript typeof operator](http://www.2ality.com/2011/11/improving-typeof.html)
- Axel Rauschmayer, [Automatic semicolon insertion in JavaScript](http://www.2ality.com/2011/05/semicolon-insertion.html)
- Axel Rauschmayer, [Categorizing values in JavaScript](http://www.2ality.com/2013/01/categorizing-values.html)
- Rod Vagg, [JavaScript and Semicolons](http://dailyjs.com/2012/04/19/semicolons/)
