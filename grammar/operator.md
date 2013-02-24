---
title: 运算符
layout: page
category: grammar
date: 2013-02-04
modifiedOn: 2013-02-25
---

## 算术运算符

### 加法运算

加法运算符（+）只能用于数值或字符串，其他类型的值必须先转化成数值或字符串，然后才能进行计算。

转化规则如下：

（1）两个运算子都是原始类型

如果两个运算子之中有一个是字符串，则将另一个也转成字符串，返回两者连接的结果；否则就将两者都转成数字，返回两者的和。

{% highlight javascript %}

true + 1
// 2

true + "1"
// "true1"

{% endhighlight %}

（2）运算子是对象

先调用该对象的valueOf方法，如果结果还不是原始类型的值，则继续调用toString方法。

{% highlight javascript %}

1 + [1,2]
// "11,2"

1 + {a:1}
// "1[object Object]"

{a:1} + 1
// JavaScript引擎将前面的对象视为代码块，加以忽略
// 1

1 + {valueOf:function(){return 2;}}
// 3

1 + {valueOf:function(){return {};}}
// "1[object Object]"

{% endhighlight %}

（3）实例一：两个空数组相加

首先调用valueOf方法。数组的valueOf方法返回的依然是本身，因此再调用toString方法，生成空字符串。因此，最后的结果是空字符串。

{% highlight javascript %}

[] + []
// ""

{% endhighlight %}

（4）实例二：空数组+空对象

这等同于空字符串与字符串“[object Object]”相加。因此，结果就是“[object Object]”。

{% highlight javascript %}

[] + {}
// "[object Object]"

{% endhighlight %}

（5）实例三：空对象+空数组

JavaScript引擎将空对象视为一个空代码加以忽略。因此，整个表达式就变成“+ []”，等于对空数组求正值，因此结果就是0。

{% highlight javascript %}

{} + []
// 0
// 转化过程如下
// + []
// Number([])
// Number([].toString())
// Number("")


{% endhighlight %}

（6）实例四：空对象与空对象相加

JavaScript同样将第一个空对象视为一个空代码块，整个表达式就变成“+ {}”。这时，后一个空对象的ValueOf方法得到本身，再调用toSting方法，得到字符串“[object Object]”，然后再将这个字符串转成数值，得到NaN。所以，最后的结果就是NaN。

{% highlight javascript %}

{} + {}
// NaN
// 转化过程如下
// + {}
// Number({})
// Number({}.toString())
// Number("[object Object]")


{% endhighlight %}

如果，第一个空对象不被JavaScript视为空代码块，就会得到“[object Object][object Object]”的结果。

{% highlight javascript %}

({}) + {}
// "[object Object][object Object]"

({} + {})
// "[object Object][object Object]"	

console.log({} + {})
// "[object Object][object Object]"

{% endhighlight %}

有意思的是，Node.js的运行结果不同于浏览器环境。

{% highlight javascript %}

{} + {}
// "[object Object][object Object]"

{} + []
// "[object Object]"

{% endhighlight %}

## 括号运算符

在JavaScript中，括号是一种运算符，作用是求值。

对表达式使用括号，返回表达式的值。

{% highlight javascript %}

(1)
// 1

('a')
// a

(1+2)
// 3

{% endhighlight %}

如果对某个对象使用括号，则等同于调用该对象的valueOf方法。

{% highlight javascript %}

var o = {p:1};

(o)
// 等同于o.valueof()

{% endhighlight %}

调用函数的时候，在尾部添加一对括号，就表示对函数求值。如果将函数放在括号中，则会返回整个函数，因为这相当于调用函数对象的valueOf方法。

{% highlight javascript %}

function f(){return 1;}

f()
// 1

(f)
// function f(){return 1;}

{% endhighlight %}

由于括号的作用是求值，如果对语句使用括号，就会报错，因为语句没有返回值。

{% highlight javascript %}

(var a =1)
// SyntaxError: Unexpected token var

{% endhighlight %}

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

以下六个值取反后为true，其他都为false。

- undefined
- null
- false
- 0（包括+0和-0）
- NaN
- ""

(2) && 且运算

(3) OR 或运算

## 位运算符

### 带符号位的左移<<

该运算符表示将一个数的二进制形式向前移动，尾部补0。

{% highlight javascript %}

4 << 1
// 8

-4 << 1
// -8

{% endhighlight %}

### 带符号位的右移>>

该运算符表示将一个数的二进制形式向后移动，头部补0。

{% highlight javascript %}

4 >> 1
// 2

-4 >> 1
// -2

{% endhighlight %}

### 不带符号位的右移>>>

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
