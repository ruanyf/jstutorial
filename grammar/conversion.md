---
title: 数据类型的转换
layout: page
category: grammar
date: 2013-04-13
modifiedOn: 2013-04-13
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

### 自动转换为布尔值

当JavaScript遇到预期为布尔值的地方（比如if语句），就会将参数值自动转换为布尔值。

以下几种值，会被自动转化为false。

- undefined, null
- 布尔值： false
- 数值： -0, +0, NaN
- 字符串： ''

其他的值都会被转化成true。需要注意的是，空对象{}和空数组[]都会被转化成true。

### 自动转换为字符串

当JavaScript遇到预期为字符串的地方（比如网页中的文本框），就会将参数值自动转换为字符串。

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

## 结论

由于自动转换有很大的不确定性，而且不易除错，建议在预期为布尔值、数值、字符串的地方，全部使用Boolean()、Number()和String()进行显式转换。

## 参考链接

- Dr. Axel Rauschmayer, [JavaScript quirk 1: implicit conversion of values](http://www.2ality.com/2013/04/quirk-implicit-conversion.html)
