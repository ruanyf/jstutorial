---
title: 运算符
layout: page
category: grammar
date: 2013-02-04
modifiedOn: 2013-06-13
---

## 算术运算符

### 加法运算

加法运算符（+）用于数字的相加或者字符串的连接。如果两个运算子都是数值，则返回它们的和；如果两个运算子都是字符，则返回连接后的字符串。

{% highlight javascript %}

1 + 1 // 2

"1" + "1" // "11"

{% endhighlight %}

其他情况下，则需要将运算子转为数值或字符串类型。转化的基本规则是，如果有一个运算子是字符串，则将另一个也转成字符串，返回两者连接的结果；否则就将两个运算子都转为数值，返回两者的和。

{% highlight javascript %}

true + 1
// 2

true + "1"
// "true1"

{% endhighlight %}

更详尽的转化规则参见《数据类型转化》一节。

### 其他算术运算符

如果一个运算子是数值类型，另一个是其他类型，那么除了加法运算符，在其他运算符的情况下，另一个运算子都会被转化成数值类型。

{% highlight javascript %}

// 加法运算符的情况
1 + "1"
// "11"

// 减法运算符的情况
1 - "1"
// 0

{% endhighlight %}

## 圆括号运算符

在JavaScript中，圆括号是一种运算符，作用是求值。

对表达式使用圆括号，返回表达式的值。

{% highlight javascript %}

(1)
// 1

('a')
// a

(1+2)
// 3

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

## 方括号运算符

方括号运算符，用于复合类型变量（数组和对象）的属性的取值。

对于数组，就是按照数组的下标取值。

{% highlight javascript %}

var a = ["a", "b", "c"];

a[1]
// "b"

{% endhighlight %}

对于对象，就是按照对象的属性名取值。

{% highlight javascript %}

var o = { p1:"a", p2:"b"};

o["p1"]
// "a"

{% endhighlight %}

需要注意的是，取值的时候，属性名排p1必须放在引号中，否则会被JavaScript当作变量名解释。

## void运算符

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

## 比较运算符

- == 相等
- === 严格相等
- != 不相等
- !== 严格不相等
- < 小于
- <= 小于或等于
- \> 大于
- \>= 大于或等于

## 相等运算符与严格相等运算符

相等运算符（==）比较两个“值”是否相等，严格相等运算符（===）比较它们是否为“同一个值”。

如果两个值不是同一个类型，严格相等运算符（===）直接返回false，而相等运算符（==）会将它们转化成同一个类型，再用严格相等运算符进行比较。

### 相等运算符的比较规则

不同类型的数据互相比较时，会先进行内部的类型转换。

（1）undefined和null两者，与自身或互相比较时，结果为true，与其他类型的值比较时，结果都为false。

{% highlight javascript %}

null == null // true
undefined == undefined // true

undefined == null // true

false == null // false
0 == null // false

{% endhighlight %}

（2）原始类型的数据会转换成数值类型再进行比较。

{% highlight javascript %}

1 == true // true
0 == false // true

"true" == true // false

'' == 0 // true

'' == false  // OK
'1' == true  // OK

"2" == true // false
2 == true // false
2 == false // false

'\n  123  \t' == 123 // true
// 因为字符串转为数字时，省略前置和后置的空格

{% endhighlight %}

（3）对象与字符串或数值比较时，对象转化成原始类型的值，再进行比较。

由于这种转化会返回一些违反直觉的结果，因此不推荐使用==，建议只使用===。

### 严格相等运算符的比较规则

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

## 布尔运算符

(1) ! 取反运算

取反运算用于将一个布尔值变为相反值。

{% highlight javascript %}

!true // false

!false // true

{% endhighlight %}

对于非布尔值的数据，布尔运算会自动将其转为布尔值。以下六个值取反后为true，其他都为false。

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

这种自动转为布尔值的规则，对下面几种布尔运算都成立。

(2) AND(&&) 且运算

如果第一个运算子为true，则返回第二个运算子；如果第一个运算子为false，则直接返回第一个运算子，且不再对第二个运算子求值。

{% highlight javascript %}

"t" && "" // ""
"t" && "f" // "f"
"" && "f" // ""
"" && "" // ""

{% endhighlight %}

(3) OR(||) 或运算

如果第一个运算子为true，则返回第一个运算子，且不再对第二个运算子求值；如果第一个运算子为false，则返回第二个运算子。

{% highlight javascript %}

"t" || "" // "t"
"t" || "f" // "t"
"" || "f" // "f"
"" || "" // ""

{% endhighlight %}

(4) 三元运算符 ? :

三元运算符用问号（？）和冒号（：），分隔三个表达式。如果第一个表达式为true，则返回第二个表达式，否则返回第三个表达式。

{% highlight javascript %}

"t" ? true : false // true

0 ? true : false // false

{% endhighlight %}

## 位运算符

位运算符用于直接对二进制位进行计算。

- 或运算（or），符号为|，表示两个二进制位中有一个为1，则结果为1，否则为0。
- 与运算（and），符号为&，表示两个二进制位都为1，则结果为1，否则为0。
- 否运算（not），符号为～，表示将一个二进制位变成相反值。
- 异或运算（xor），符号为&#710;，表示两个二进制位中有且仅有一个为1，则结果为1，否则为0。
- 左移运算（left shift），符号为<<，详见下文解释。
- 右移运算（right shift），符号为>>，详见下文解释。
- 不带符号位的右移运算（zero filled right shift），符号为>>>，详见下文解释。

位运算有一些特殊运用。比如，连续对a和b进行三次异或运算，a&#710;=b, b&#710;=a, a&#710;=b，可以互换两个变量的值（详见[维基百科](http://en.wikipedia.org/wiki/XOR_swap_algorithm)），因此使用位运算可以在不引入临时变量的前提下，互换两个变量的值。

{% highlight javascript %}

var a = 10;
var b = 99;

a^=b, b^=a, a^=b;

a // 99
b // 10

{% endhighlight %}

又比如，由于位运算只对整数有效，会将运算子先转成32位整数，所以将一个数与0进行或运算，等同于对该数调用Math.floor方法。

{% highlight javascript %}

2.2352524535 | 0
// 2

{% endhighlight %}

连续进行两次否运算，也能达到同样效果。

{% highlight javascript %}

~~2.2352524535
// 2

{% endhighlight %}

但是，一般来说，这些位运算的例子只对正数有效，且运算子不能超过32位整数的最大值2147483647。

{% highlight javascript %}

Math.floor(2147483647.4); // 2147483647
2147483647.4 | 0; // 2147483647

Math.floor(2147483648.4); // 2147483648
2147483648.4 | 0; // -2147483648

{% endhighlight %}

### 左移运算<<

该运算符表示将一个数的二进制形式向前移动，尾部补0。

{% highlight javascript %}

4 << 1
// 8
// 因为4的二进制形式为100，左移一位为1000（即十进制的8）

-4 << 1
// -8

{% endhighlight %}

### 右移运算>>

该运算符表示将一个数的二进制形式向后移动，头部补0。

{% highlight javascript %}

4 >> 1
// 2
// 因为4的二进制形式为100，右移一位得到10（即十进制的2）

-4 >> 1
// -2

{% endhighlight %}

### 不带符号位的右移运算>>>

该运算符表示将一个数的二进制形式向后移动(连同头部的符号位)，头部补0。

这对正数的运算结果与>>运算符完全一致，区别主要在于负数的符号位。

{% highlight javascript %}

4 >>> 1
// 2

-4 >>> 1
// 2147483646

{% endhighlight %}

-4带符号位右移一位，得到2147483646。这主要是因为在JavaScipt内部，-4以10000000000000000000000000000100的32位形式保存，最前面的1表示负值。带符号位右移一位时，这个值变成01000000000000000000000000000010，等于十进制的2147483646。

## 参考链接

- Dr. Axel Rauschmayer, [What is {} + {} in JavaScript?](http://www.2ality.com/2012/01/object-plus-object.html)
- Michal Budzynski, [JavaScript: The less known parts. Bitwise Operators](http://michalbe.blogspot.co.uk/2013/03/javascript-less-known-parts-bitwise.html)
