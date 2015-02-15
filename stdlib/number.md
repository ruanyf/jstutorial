---
title: Number对象
layout: page
category: stdlib
date: 2013-03-16
modifiedOn: 2014-01-01
---

## 概述

Number对象是数值对应的包装对象，可以作为构造函数使用，也可以作为工具函数使用。

作为构造函数时，它用于生成值为数值的对象。

```javascript

var n = new Number(1);
typeof n // "object"

```

上面代码中，Number对象作为构造函数使用，返回一个值为1的对象。

作为工具函数时，它可以将任何类型的值转为数值。

{% highlight javascript %}

Number(true) // 1

{% endhighlight %}

上面代码将布尔值true转为数值1。Number对象的工具方法，详细介绍参见上一章的《数据类型转换》一节。

## Number对象的属性

Number对象拥有一些特别的属性。

（1）Number.POSITIVE_INFINITY 

表示正的无限，指向关键字Infinity。

（2）Number.NEGATIVE_INFINITY 

表示负的无限，指向-Infinity。

（3）Number.NaN 

表示非数值，指向NaN。

（4）Number.MAX_VALUE 

表示最大的正数，相应的，最小的负数为-Number.MAX_VALUE。

（5）Number.MIN_VALUE 

表示最小的正数（即最接近0的正数，在64位浮点数体系中为5e-324），相应的，最接近0的负数为-Number.MIN_VALUE。

{% highlight javascript %}

Number.POSITIVE_INFINITY // Infinity
Number.NEGATIVE_INFINITY // -Infinity
Number.NaN // NaN
Number.MAX_VALUE // 1.7976931348623157e+308
Number.MIN_VALUE // 5e-324

{% endhighlight %}

## Number对象实例的方法

### Number.prototype.toString()

Number对象部署了单独的toString方法，可以接受一个参数，表示将一个数字转化成某个进制的字符串。

{% highlight javascript %}

(10).toString() // "10"
(10).toString(2) // "1010"
(10).toString(8) // "12"
(10).toString(16) // "a"

{% endhighlight %}

之所以要把10放在括号里，是为了表明10是一个单独的数值，后面的点表示调用对象属性。如果不加括号，这个点会被JavaScript引擎解释成小数点，从而报错。

{% highlight javascript %}

10.toString(2) 
// SyntaxError: Unexpected token ILLEGAL

{% endhighlight %}

但是，在10后面加两个点，JavaScript会把第一个点理解成小数点（即10.0），把第二个点理解成调用对象属性，从而得到正确结果。

{% highlight javascript %}

10..toString(2) 
// "1010"

{% endhighlight %}

这实际上意味着，可以直接对一个小数使用toString方法。

{% highlight javascript %}

10.5.toString() // "10.5"
10.5.toString(2) // "1010.1"
10.5.toString(8) // "12.4"
10.5.toString(16) // "a.8"

{% endhighlight %}

通过方括号运算符也可以调用toString方法。

{% highlight javascript %}

10['toString'](2) // "1010"

{% endhighlight %}

将其他进制的数，转回十进制，需要使用parseInt方法。

### Number.prototype.toFixed()

toFixed方法用于将一个数转为指定位数的小数。

{% highlight javascript %}

(10).toFixed(2)
// "10.00"
// 10必须放在括号里，否则后面的点运算符会被处理小数点，而不是表示调用对象的方法。

(10.005).toFixed(2)
// "10.01" 

{% endhighlight %}

toFixed方法的参数为小数的位数，有效范围为0到20，超出这个范围将抛出RangeError错误。。

### Number.prototype.toExponential()

toExponential方法用于将一个数转为科学计数法形式。

{% highlight javascript %}

(10).toExponential(1)
// "1.0e+1"

(1234).toExponential(1)
// "1.2e+3"

{% endhighlight %}

toExponential方法的参数表示小数点后有效数字的位数，范围为0到20，超出这个范围，会抛出一个RangeError。

### Number.prototype.toPrecision()

toPrecision方法用于将一个数转为指定位数的有效数字。

{% highlight javascript %}

(12.34).toPrecision(1)
// "1e+1"

(12.34).toPrecision(2)
// "12"

(12.34).toPrecision(3)
// "12.3"

(12.34).toPrecision(4)
// "12.34"

(12.34).toPrecision(5)
// "12.340"

{% endhighlight %}

toPrecision方法的参数为有效数字的位数，范围是1到21，超出这个范围会抛出RangeError错误。

toPrecision方法用于四舍五入时不太可靠，可能跟浮点数不是精确储存有关。

{% highlight javascript %}

(12.35).toPrecision(3)
// "12.3"

(12.25).toPrecision(3)
// "12.3"

(12.15).toPrecision(3)
// "12.2"

(12.45).toPrecision(3)
// "12.4"

{% endhighlight %}

## 自定义方法

与其他对象一样，Number.prototype对象上面可以自定义方法，被Number的实例继承。

```javascript

Number.prototype.add = function (x) {
  return this + x;
};

```

上面代码为Number对象实例定义了一个add方法。

由于Number对象的实例就是数值，在数值上调用某个方法，数值会自动转为对象，所以就得到了下面的结果。

```javascript

8['add'](2)
// 10

```

上面代码中，调用方法之所以写成`8['add']`，而不是`8.add`，是因为数值后面的点，会被解释为小数点，而不是点运算符。将数值放在圆括号中，就可以使用点运算符调用方法了。

```javascript

(8).add(2)
// 10

```

由于add方法返回的还是数值，所以可以链式运算。

```javascript

Number.prototype.subtract = function (x) {
  return this - x;
};

(8).add(2).subtract(4)
// 6

```

上面代码在Number对象的实例上部署了subtract方法，它可以与add方法链式调用。

我们还可以部署更复杂的方法。

```javascript

Number.prototype.iterate = function () {
  var result = [];
  for (var i = 0; i <= this; i++) {
    result.push(i);
  }
  return result;
};

(8).iterate()
// [0, 1, 2, 3, 4, 5, 6, 7, 8]

```

上面代码在Number对象的原型上部署了iterate方法，可以将一个数值自动遍历为一个数组。

需要注意的是，数值的自定义方法，只能定义在它的原型对象Number.prototype上面，数值本身是无法自定义属性的。

```javascript

var n = 1;
n.x = 1;
n.x // undefined

```

上面代码中，n是一个原始类型的数值。直接在它上面新增一个属性x，不会报错，但毫无作用，总是返回undefined。这是因为一旦被调用属性，n就自动转为Number的实例对象，调用结束后，该对象自动销毁。所以，下一次调用n的属性时，实际取到的是另一个对象，属性x当然就读不出来。
