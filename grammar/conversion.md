---
title: 数据类型转换
layout: page
category: grammar
date: 2013-04-13
modifiedOn: 2013-06-13
---

## 强制转换

各种类型的值可以都可以转换成数字或字符串。

### 强制转换成数值

使用Number方法，可以将任意类型的值转化成数字。规则如下：

- 数值转化后还是原来的值
- 字符串如果可以被解析为数值，则转化为相应的数值，否则得到NaN
- 布尔值true转化成1，false转化成0
- undefined转化成NaN
- null转化成0

{% highlight javascript %}

Number("324")
// 324

Number("324abc")
// NaN

Number("")
// 0

Number(null)
// 0

{% endhighlight %}

对于对象，则是先调用valueOf方法，如果该方法返回的不是数值，则再调用toString方法。如果toString方法返回的不是字符串，则报错。

{% highlight javascript %}

    var obj = {
        valueOf: function () {
            console.log("valueOf");
            return {}; // not a primitive
        },
        toString: function () {
            console.log("toString");
            return {}; // not a primitive
        }
    }


Number(obj)
// valueOf
// toString
// TypeError: Cannot convert object to primitive value

Number({a:1})
// 等同于Number(({a:1}).valueOf().toString())
// NaN

Number({valueOf:function (){return 2;}})
// 2

Number({valueOf:function (){return 2;},toString:function(){return 3;}})
// 2

Number({toString:function(){return 3;}})
// 3

{% endhighlight %}

### 强制转换成字符串

使用String方法，可以将任意类型的值转化成字符串。规则如下：

- 数值转化为相应的字符串
- 字符串转化后还是原来的值
- 布尔值true转化为“true”，false转化为“false”
- undefined转化为“undefined”
- null转化为“null”

{% highlight javascript %}

String(123)
// "123"

String(true)
// "true"

String(null)
// "null"

{% endhighlight %}

对于对象，则是调用toString方法；如果toString方法返回的不是对象，再调用valueOf方法；如果返回的还不是对象，则报错。

{% highlight javascript %}

    var obj = {
        valueOf: function () {
            console.log("valueOf");
            return {}; // not a primitive
        },
        toString: function () {
            console.log("toString");
            return {}; // not a primitive
        }
    }

String(obj)
// toString
// valueOf
// TypeError: Cannot convert object to primitive value

String({a:1})
// "[object Object]"

String({toString:function(){return 3;}})
// "3"

{% endhighlight %}

### 强制转换成布尔值

使用Boolean方法，可以将任意类型的变量转为布尔值。它的转换规则与下面的“自动转换为布尔值”的规则相同。

{% highlight javascript %}

Boolean(undefined)
// false

Boolean(0)
// false

Boolean(3)
// true

{% endhighlight %}

## 自动转换

当遇到以下几种情况，JavaScript会自动转换数据类型：

- 不同类型的数据进行互相运算；
- 对非布尔值类型的数据求布尔值;
- 对非数值类型的数据使用一元运算符（即“+”和“-”）。

### 自动转换为布尔值

当JavaScript遇到预期为布尔值的地方（比如if语句的条件部分），就会将非布尔值的参数自动转换为布尔值。

除了布尔值false，以下几种值会自动转为false：

- undefined
- null
- -0
- +0
- NaN
- ''（空字符串）

其他的值都会被转化成true。需要注意的是，空对象{}和空数组[]都会被转化成true。

### 自动转换为字符串

当JavaScript遇到预期为字符串的地方，就会将非字符串的数据自动转为字符串。

字符串的自动转换，主要发生在加法运算时。当一个值为字符串，另一个值为非字符串，则后者转为字符串。

{% highlight javascript %}

'5' + 1 // '51'
'5' + true // "5true"
'5' + false // "5false"
'5' + {} // "5[object Object]"
'5' + [] // "5"
'5' + function (){} // "5function (){}"
'5' + undefined // "5undefined"
'5' + null // "5null"

{% endhighlight %}

当对象转换成字符串时，转换规则与“强制转换为字符串”相同。

### 自动转换为数值

当JavaScript遇到预期为数值的地方，就会将参数值自动转换为数值。

数值的自动转换，主要发生在除了加法以外的其他运算中。这些运算符两侧的参数，都会被自动转成数值，转换规则与“强制转换为数值”相同。

{% highlight javascript %}

'5' - '2' // 3
'5' * '2' // 10
true - 1  // 0
false - 1 // -1
'1' - 1   // 0
'5'*[]    // 0
false/'5' // 0
'abc'-1   // NaN

{% endhighlight %}

当对象转换成数值时，转换规则与“强制转换成数值”相同。

{% highlight javascript %}

3 * { valueOf: function () { return 5 } }
// 15

{% endhighlight %}

### 小结

由于自动转换有很大的不确定性，而且不易除错，建议在预期为布尔值、数值、字符串的地方，全部使用Boolean()、Number()和String()进行显式转换。

## 加法运算中的类型转化

加法运算符（+）可以用于两个数字的相加，也可以用于两个字符串的连接。除了数值和字符串，其他类型的值必须先转化成这两种类型，然后才能进行计算。

转化规则分成三种情况：

1. 同类型的原始类型值相加
2. 不同类型的原始类型值相加
3. 运算子中存在对象

### 同类型的原始类型值相加

所谓“原始类型”，指的就是数值、字符串和布尔值这三种类型。

{% highlight javascript %}

1 + 1 // 2

"1" + "1" // "11"

true + true // 2

false + false  // 0

false + true // 1

{% endhighlight %}

如果两个运算子都是数值，则返回它们的和；如果两个运算子都是字符，则返回连接后的字符串；如果两个运算子都是布尔值，则true转为数值1，false转为数值0，再进行相加。

### 不同类型的原始类型值相加

如果两个运算子之中有一个是字符串，则将另一个也转成字符串，返回两者连接的结果；否则就将两个运算子都转为数值，返回两者的和。

{% highlight javascript %}

true + 1
// 2

true + "1"
// "true1"

{% endhighlight %}

布尔值转为字符串时，就是它们的字面值，true转为”true“，false转为”false“。

### 运算子中存在对象

先调用该对象的valueOf方法，如果结果为原始类型的值，则运用上面两条规则；如果结果不是原始类型的值，则继续调用该对象的toString方法，再运用上面两条规则。

{% highlight javascript %}

1 + [1,2]
// "11,2"

{% endhighlight %}

[1,2].valueOf()的结果为字符串“1,2”，所以最终结果为字符串“11,2”。

{% highlight javascript %}

1 + {a:1}
// "1[object Object]"

{% endhighlight %}

对象{a:1}的valueOf方法，返回的就是这个对象的本身，因此接着对它调用toString方法。({a:1}).toString()默认返回字符串"[object Object]"，所以最终结果就是字符串“1[object Object]”

{% highlight javascript %}

{a:1} + 1
// 1

{% endhighlight %}

为什么更换前后次序，就会得到与上一段代码不同的值？原来此时，JavaScript引擎不将{a:1}视为对象，而是视为一个代码块，这个代码块没有返回值，所以被忽略。因此上面的代码，实际上等同于 {a:1};+1 ，所以最终结果就是1。

{% highlight javascript %}

({a:1})+1
"[object Object]1"

{% endhighlight %}

将{a:1}放置在括号之中，由于JavaScript引擎预期括号之中是一个值，所以不把它当作代码块处理，而是当作对象处理，所以最终结果为“[object Object]1”。

{% highlight javascript %}

1 + {valueOf:function(){return 2;}}
// 3

{% endhighlight %}

我们自定义一个对象的valueOf方法，返回数值2，所以最终结果为3。

{% highlight javascript %}

1 + {valueOf:function(){return {};}}
// "1[object Object]"

{% endhighlight %}

如果自定义的valueOf方法返回一个空对象，则继续调用toString方法，所以最终结果是“1[object Object]”。

{% highlight javascript %}

1 + {valueOf:function(){return {};}, toString:function(){return 2;}}
// 3

{% endhighlight %}

如果自定义的toString方法返回数值2（注意返回的不是字符串），则最终结果就是数值3。

{% highlight javascript %}

1 + {valueOf:function(){return {};}, toString:function(){return {};}}
// TypeError: Cannot convert object to primitive value

{% endhighlight %}

如果自定义的toString方法返回一个空对象，JavaScript就会报错，表示无法将对象转为原始类型的值。

### 四个特殊的实例

有了上面这些例子，我们再进一步来看四个特殊的实例。

（1）空数组 + 空数组

{% highlight javascript %}

[] + []
// ""

{% endhighlight %}

首先，对空数组调用valueOf方法，返回的是数组本身；因此再对空数组调用toString方法，生成空字符串；所以，最终结果就是空字符串。

（2）空数组 + 空对象

{% highlight javascript %}

[] + {}
// "[object Object]"

{% endhighlight %}

这等同于空字符串与字符串“[object Object]”相加。因此，结果就是“[object Object]”。

（3）空对象 + 空数组

{% highlight javascript %}

{} + []
// 0

{% endhighlight %}

JavaScript引擎将空对象视为一个空的代码块，加以忽略。因此，整个表达式就变成“+ []”，等于对空数组求正值，因此结果就是0。转化过程如下：

{% highlight javascript %}

+ []
// Number([])
// Number([].toString())
// Number("")
// 0

{% endhighlight %}

对空字符串使用Number方法，则结果为0。

如果JavaScript不把前面的空对象视为代码块，则结果为字符串“[object Object]”。

{% highlight javascript %}

({}) + []
// "[object Object]"

{% endhighlight %}

（4）空对象 + 空对象

{% highlight javascript %}

{} + {}
// NaN

{% endhighlight %}

JavaScript同样将第一个空对象视为一个空代码块，整个表达式就变成“+ {}”。这时，后一个空对象的ValueOf方法得到本身，再调用toSting方法，得到字符串“[object Object]”，然后再将这个字符串转成数值，得到NaN。所以，最后的结果就是NaN。转化过程如下：

{% highlight javascript %}

+ {}
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

var a = {} + {};
a
// "[object Object][object Object]"	

{% endhighlight %}

有意思的是，对于上面第三和第四个例子，Node.js环境的运行结果不同于浏览器环境。

{% highlight javascript %}

{} + {}
// "[object Object][object Object]"

{} + []
// "[object Object]"

{% endhighlight %}

可以看到，Node.js没有把第一个空对象视为代码块。原因是Node.js的命令行环境，内部执行机制大概是下面的样子：

{% highlight javascript %}

eval.call(this,"(function(){return {} + {}}).call(this)")

{% endhighlight %}

## 参考链接

- Dr. Axel Rauschmayer, [JavaScript quirk 1: implicit conversion of values](http://www.2ality.com/2013/04/quirk-implicit-conversion.html)
- Benjie Gillam, [Quantum JavaScript?](http://www.benjiegillam.com/2013/06/quantum-javascript/)
