---
title: 运算符
layout: page
category: grammar
date: 2013-02-04
modifiedOn: 2013-11-10
---

## 算术运算符

JavaScript提供9个算术运算符。

- **加法运算符**（Addition）：x + y

- **减法运算符**（Subtraction）： x - y

- **乘法运算符**（Multiplication）： x * y

- **除法运算符**（Division）：x / y

- **余数运算符**（Remainder）：x % y

- **自增运算符**（Increment）：++x 或者 x++

- **自减运算符**（Decrement）：--x 或者 x--

- **求负运算符**（Negate）：-x

- **数值运算符**（Convert to number）： +x

加法运算符（+）除了用于数值的相加，还能用于字符串的连接。两个运算子之中只要有一个是字符串，加法运算符号就会变为字符串连接运算符，返回连接后的字符串，其他情况则是返回数值相加的和。加法运算符行为的详细讨论，可以参见《数据类型转换》一节。

{% highlight javascript %}

1 + "1" // "11"

{% endhighlight %}

上面代码表示，两个运算子之中有一个是字符串，另一个运算子就会被自动转为字符串。

加法运算符以外的其他算术运算符都不是这样，它们的规则是：所有运算子一律转为数值。

{% highlight javascript %}

1 - "1" // 0
+"3" // 3 
-true // -1

{% endhighlight %}

上面代码表示，减法运算符将字符串“1”自动转为数值1，数值运算符（+）将字符串“3”转为数值3，求负运算符（-）将布尔值true转为-1。

## 赋值运算符

赋值运算符（Assignment Operators）用于给变量赋值。

JavaScript提供6个赋值运算符。

- **=**：表达式 x=y 表示将y赋值给x
- **+=**：表达式 x+=y 等同于 x=x+y
- **-=**：表达式 x-=y 等同于 x=x-y
- **\*=**：表达式 x\*=y 等同于 x=x\*y
- **/=**：表达式 x/=y 等同于 x=x/y
- **%=**：表达式 x%=y 等同于x=x%y

## 比较运算符

比较运算符比较两个值，然后返回一个布尔值，表示是否满足比较条件。JavaScript提供了8个比较运算符。

- **==** 相等
- **===** 严格相等
- **!=** 不相等
- **!==** 严格不相等
- **<** 小于
- **<=** 小于或等于
- **\>** 大于
- **\>=** 大于或等于

比较两个值是否相等的运算符有两个：一个是相等运算符（==），另一个是严格相等运算符（===）。

相等运算符（==）比较两个“值”是否相等，严格相等运算符（===）比较它们是否为“同一个值”。两者的一个重要区别是，如果两个值不是同一类型，严格相等运算符（===）直接返回false，而相等运算符（==）会将它们转化成同一个类型，再用严格相等运算符进行比较。

### 严格相等运算符

严格相等运算符的运算规则如下：

（1）如果两个值的类型不同，直接返回false。

{% highlight javascript %}

1 === "1" // false

true === "true" // false

{% endhighlight %}

上面代码比较数值的1与字符串的“1”、布尔值的true与字符串“true”，因为类型不同，结果都是false。

（2）同一类的原始类型的值（数值、字符串、布尔值）比较时，值相同就返回true，值不同就返回false。

{% highlight javascript %}

1 === 0x1 // true

{% endhighlight %}

上面代码比较十进制的1与十六进制的1，因为类型和值都相同，返回true。

需要注意的是，NaN与任何值都不相等（包括自身）。另外，正0等于负0。

{% highlight javascript %}

NaN === NaN  // false

+0 === -0 // true

{% endhighlight %}

（3）两个复合类型（对象、数组、函数）的数据比较时，不是比较它们的值是否相等，而是比较它们是否指向同一个对象。

{% highlight javascript %}

({}) === {} // false

[] === [] // false

(function (){}) === function (){} // false

{% endhighlight %}

上面代码分别比较两个空对象、两个空数组、两个空函数，结果都是不相等。原因是对于复合类型的值，严格相等运算比较的是它们的内存地址是否一样，而上面代码中空对象、空数组、空函数的值，都存放在不同的内存地址，结果当然是false。另外，之所以要把第一个空对象放在括号内，是为了避免JavaScript引擎把这一行解释成代码块，从而报错；把第一个空函数放在括号内，是为了避免这一行被解释成函数的定义。

如果两个变量指向同一个复合类型的数据，则它们相等。

{% highlight javascript %}

var v1 = {};
var v2 = v1;

v1 === v2 // true

{% endhighlight %}

（4）undefined 和 null 与自身严格相等。

{% highlight javascript %}

undefined === undefined // true

null === null // true

{% endhighlight %}

由于变量声明后默认值是undefined，因此两个只声明未赋值的变量是相等的。

{% highlight javascript %}

var v1;
var v2;

v1 === v2 // true

{% endhighlight %}

最后，严格相等运算符有一个对应的“严格不相等运算符”（!==），两者的运算结果正好相反。

{% highlight javascript %}

1 !== "1" // true

{% endhighlight %}

### 相等运算符

相等运算符在比较相同类型的数据时，与严格相等运算符完全一样。

在比较不同类型的数据时，相等运算符会先将数据进行类型转换，然后再用严格相等运算符比较。类型转换规则如下：

（1）原始类型的数据会转换成数值类型再进行比较。

{% highlight javascript %}

1 == true // true
0 == false // true

"true" == true // false

'' == 0 // true

'' == false  // true
'1' == true  // true

"2" == true // false
2 == true // false
2 == false // false

'\n  123  \t' == 123 // true
// 因为字符串转为数字时，省略前置和后置的空格

{% endhighlight %}

上面代码将字符串和布尔值都转为数值，然后再进行比较。字符串与布尔值的类型转换规则，参见《数据类型转换》一节。

（2）对象与原始类型的值比较时，对象转化成原始类型的值，再进行比较。

{% highlight javascript %}

[1] == 1 // true
[1] == "1" // true
[1] == true // true

{% endhighlight %}

上面代码将只含有数值1的数组与原始类型的值进行比较，数组[1]会被自动转换成数值1，因此结果都是true。数组的类型转换规则，参见《数据类型转换》一节。

（3）undefined和null与其他类型的值比较时，结果都为false，它们互相比较时结果为true。

{% highlight javascript %}

false == null // false
0 == null // false

undefined == null // true

{% endhighlight %}

相等运算符隐藏的类型转换，会带来一些违反直觉的结果。

{% highlight javascript %}

'' == '0'           // false
0 == ''             // true
0 == '0'            // true

false == 'false'    // false
false == '0'        // true

false == undefined  // false
false == null       // false
null == undefined   // true

' \t\r\n ' == 0     // true

{% endhighlight %}

上面这些表达式都很容易出错，因此不要使用相等运算符（==），最好只使用严格相等运算符（===）。

最后，相等运算符有一个对应的“不相等运算符”（!=），两者的运算结果正好相反。

{% highlight javascript %}

1 != "1" // false

{% endhighlight %}

## 布尔运算符

布尔运算符专门用于将表达式转为布尔值。

**（1）取反运算符（!）**

取反运算符用于将一个布尔值变为相反值。

{% highlight javascript %}

!true // false

!false // true

{% endhighlight %}

对于非布尔值的数据，布尔运算会自动将其转为布尔值。以下六个值取反后为true，其他取反后都为false。

- undefined
- null
- false
- 0（包括+0和-0）
- NaN
- ""

{% highlight javascript %}

!undefined // true
!null // true
!0 // true
!NaN // true
!"" // true

{% endhighlight %}

这种自动转为布尔值的规则，对下面几种布尔运算符都成立。

**（2） 且运算符（AND或&&）**

且运算符的运算规则是：如果第一个运算子的布尔值为true，则返回第二个运算子的值（注意是值，不是布尔值）；如果第一个运算子的布尔值为false，则直接返回第一个运算子的值，且不再对第二个运算子求值。

{% highlight javascript %}

"t" && "" // ""
"t" && "f" // "f"
"t" && (1+2) // 3
"" && "f" // ""
"" && "" // ""

var x = 1;
(1-1) && (x+=1) // 0
x // 1

{% endhighlight %}

上面代码的最后一部分表示，由于且运算符的第一个运算子的布尔值为false，则直接返回它的值0，而不再对第二个运算子求值，所以变量x的值没变。

这种跳过第二个运算子的机制，被称为“短路”。有些程序员喜欢用它取代if结构，比如下面是一段if结构的代码，就可以用且运算符改写。

{% highlight javascript %}

if (i !== 0 ){
	doSomething();
}

// 等价于

i && doSomething();

{% endhighlight %}

上面代码的两种写法是等价的，但是后一种不容易看出目的，也不容易除错，建议谨慎使用。

**（3）或运算符（OR或||）**

或运算符的运算规则是：如果第一个运算子的布尔值为true，则返回第一个运算子的值，且不再对第二个运算子求值；如果第一个运算子的布尔值为false，则返回第二个运算子的值。

{% highlight javascript %}

"t" || "" // "t"
"t" || "f" // "t"
"" || "f" // "f"
"" || "" // ""

{% endhighlight %}

短路规则对这个运算符也适用。

**（4）三元条件运算符（ ? :）**

三元条件运算符用问号（？）和冒号（：），分隔三个表达式。如果第一个表达式的布尔值为true，则返回第二个表达式的值，否则返回第三个表达式的值。

{% highlight javascript %}

"t" ? true : false // true

0 ? true : false // false

{% endhighlight %}

上面代码的“t”和0的布尔值分别为true和false，所以分别返回第二个和第三个表达式的值。

## 位运算符

### 简介

位运算符用于直接对二进制位进行计算，一共有7个。

- **或运算**（or）：符号为|，表示两个二进制位中有一个为1，则结果为1，否则为0。

- **与运算**（and）：符号为&，表示两个二进制位都为1，则结果为1，否则为0。

- **否运算**（not）：符号为～，表示将一个二进制位变成相反值。

- **异或运算**（xor）：符号为&#710;，表示两个二进制位中有且仅有一个为1时，结果为1，否则为0。

- **左移运算**（left shift）：符号为<<，详见下文解释。

- **右移运算**（right shift）：符号为>>，详见下文解释。

- **带符号位的右移运算**（zero filled right shift）：符号为>>>，详见下文解释。

**（1）“或运算”与“与运算”**

这两种运算比较容易理解，就是逐位比较两个运算子。

“或运算”的规则是，如果两个二进制位之中至少有一个位为1，则返回1，否则返回0。“与运算”的规则是，如果两个二进制位之中至少有一个位1为0，则返回0，否则返回1。

{% highlight javascript %}

0 | 3 // 3
0 & 3 // 0

{% endhighlight %}

上面两个表达式，0和3的二进制形式分别是00和11，所以进行“或运算”会得到11（即3），进行”与运算“会得到00（即0）。

**（2）“否运算”**

“否运算”将每个二进制位都变为相反值（0变为1，1变为0）。它的返回结果有时比较难理解，因为涉及到计算机内部的数值表示机制。

{% highlight javascript %}

~ 3 // -4

{% endhighlight %}

上面表达式对3进行“否运算”，得到-4。之所以会有这样的结果，是因为位运算时，JavaScirpt内部将所有的运算子都转为32位的二进制整数再进行运算。3在JavaScript内部是00000000000000000000000000000011，否运算以后得到11111111111111111111111111111100，由于第一位是1，所以这个数是一个负数。JavaScript内部采用2的补码形式表示负数，即需要将这个数减去1，再取一次反，然后加上负号，才能得到这个负数对应的10进制值。这个数减去1等于11111111111111111111111111111011，再取一次反得到00000000000000000000000000000100，再加上负号就是-4。考虑到这样过程比较麻烦，可以简单记忆成，一个数的取反值相加，等于-1减去自身。

{% highlight javascript %}

~ -3 // 2

{% endhighlight %}

上面表达式可以这样算，-3的取反值等于-1减去-3，结果为2。

对一个整数连续两次“否运算”，得到它自身。

{% highlight javascript %}

~~3 // 3

{% endhighlight %}

**（3）“异或运算”**

“异或运算”在两个二进制位不同时返回1，相同时返回0。

{% highlight javascript %}

0^3 // 3

{% endhighlight %}

上面表达式0和3的每个二进制位都不同，所以得到11（即3）。

“异或运算”有一个特殊运用，连续对两个数a和b进行三次异或运算，`a&#710;=b, b&#710;=a, a&#710;=b`，可以互换它们的值（详见[维基百科](http://en.wikipedia.org/wiki/XOR_swap_algorithm)）。这意味着，使用“异或运算”可以在不引入临时变量的前提下，互换两个变量的值。

{% highlight javascript %}

var a = 10;
var b = 99;

a^=b, b^=a, a^=b;

a // 99
b // 10

{% endhighlight %}

这是互换两个变量的值的最快方法。

**（4）位运算的取整效果**

位运算可以用来取整。因为位运算只对整数有效，遇到小数时，会将小数转成整数。所以，将一个小数与0进行或运算，等同于对该数调用Math.floor方法，即取整数位。

{% highlight javascript %}

2.9 | 0
// 2

{% endhighlight %}

连续进行两次否运算，也能达到取整效果。

{% highlight javascript %}

~~2.9
// 2

{% endhighlight %}

需要注意的是，这种取整方法不适用超过32位整数最大值2147483647的数。

{% highlight javascript %}

2147483649.4 | 0;
// -2147483647

{% endhighlight %}

### 左移运算符（<<）

左移运算符表示将一个数的二进制形式向前移动，尾部补0。

{% highlight javascript %}

4 << 1
// 8
// 因为4的二进制形式为100，左移一位为1000（即十进制的8）

-4 << 1
// -8

{% endhighlight %}

左移运算符用于二进制数值非常方便。

{% highlight javascript %}

var color = {r: 186, g: 218, b: 85};

// RGB to HEX
var rgb2hex = function(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).substr(1);
}

{% endhighlight %}

上面代码使用左移运算符，将颜色的RGB值转为HEX值。

### 右移运算符（>>）

右移运算符表示将一个数的二进制形式向后移动，头部补0。

{% highlight javascript %}

4 >> 1
// 2
// 因为4的二进制形式为100，右移一位得到10（即十进制的2）

-4 >> 1
// -2

{% endhighlight %}

右移运算符移动时不包括符号位，所以-4右移1位，得到的还是负值。

### 带符号位的右移运算符（>>>）

该运算符表示将一个数的二进制形式向后移动(连同头部的符号位)，头部补0。它对正数的运算结果与右移运算符（>>）完全一致，区别主要在于负数的运算结果。

{% highlight javascript %}

4 >>> 1
// 2

-4 >>> 1
// 2147483646

{% endhighlight %}

-4带符号位右移一位，得到2147483646。这主要是因为在JavaScipt内部，-4以10000000000000000000000000000100的32位形式保存，最前面的1表示负值。带符号位右移一位时，这个值变成01000000000000000000000000000010，等于十进制的2147483646。

### 开关作用

位运算符可以用作设置对象属性的开关。

假定某个对象有四个开关，每个开关都是一个变量，取值为2的整数次幂。

{% highlight javascript %}

var FLAG_A = 1; // 0001
var FLAG_B = 2; // 0010
var FLAG_C = 4; // 0100
var FLAG_D = 8; // 1000

{% endhighlight %}

上面代码设置A、B、C、D四个开关，每个开关分别占有1个二进制位。

现在假设需要打开ABD三个开关，我们可以构造一个掩码变量。

{% highlight javascript %}

var mask = FLAG_A | FLAG_B | FLAG_D; // 0001 | 0010 | 1000 => 1011

{% endhighlight %}

上面代码对ABD三个变量进行“或运算”，得到掩码值为二进制的1011。

有了掩码，就可以用“与运算”检验当前设置是否与开关设置一致。

{% highlight javascript %}

if (flags & FLAG_C) { // 0101 & 0100 => 0100 => true
   // ...
}

{% endhighlight %}

上面代码表示，如果当前设置与掩码一致，则返回true，否则返回false。

“或运算”可以将当前设置改成开关设置。

{% highlight javascript %}

flags |= mask; 

{% endhighlight %}

“与运算”可以将当前设置中凡是与开关设置不一样的项，全部关闭。

{% highlight javascript %}

flags &= mask; 

{% endhighlight %}

“异或运算”可以切换（toggle）当前设置。

{% highlight javascript %}

flags = flags ^ mask; 

{% endhighlight %}

“否运算”可以翻转当前设置。

{% highlight javascript %}

flags = ~flags;

{% endhighlight %}

## 其他运算符

### 圆括号运算符

在JavaScript中，圆括号是一种运算符，作用是求值。

对表达式使用圆括号，返回表达式的值。

{% highlight javascript %}

(1) // 1
('a') // a
(1+2) // 3

{% endhighlight %}

如果对某个对象使用圆括号，则等同于调用该对象的valueOf方法。

{% highlight javascript %}

var o = {p:1};

(o)
// 等同于o.valueof()

{% endhighlight %}

调用函数的时候，在尾部添加一对圆括号，就表示对函数求值。如果将函数放在圆括号中，则会返回整个函数，因为这相当于调用函数对象的valueOf方法。

{% highlight javascript %}

function f(){return 1;}

f()
// 1

(f)
// function f(){return 1;}

{% endhighlight %}

由于圆括号的作用是求值，如果对语句使用圆括号，就会报错，因为语句没有返回值。

{% highlight javascript %}

(var a =1)
// SyntaxError: Unexpected token var

{% endhighlight %}

### void运算符

void运算符的作用是执行一个表达式，然后返回undefined。

它可以写成

{% highlight javascript %}

void expr

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

将void写入链接，就是下面这样：

{% highlight html %}

 <a href="javascript:void(doSomething());">Compute</a>

{% endhighlight %}

### 逗号运算符

逗号运算符用于对两个表达式求值，并返回后一个表达式的值。

{% highlight javascript %}

"a", "b"
// "b"

var x = ("a", "b")
x
// "b"

console.log(("a", "b"))
// b

{% endhighlight %}

## 参考链接

- Michal Budzynski, [JavaScript: The less known parts. Bitwise Operators](http://michalbe.blogspot.co.uk/2013/03/javascript-less-known-parts-bitwise.html)
- Axel Rauschmayer, [Basic JavaScript for the impatient programmer](http://www.2ality.com/2013/06/basic-javascript.html)
- Mozilla Developer Network, [Bitwise Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators)
