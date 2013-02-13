---
title: 数值
layout: page
category: grammar
date: 2013-02-13
modifiedOn: 2013-02-13
---

## 概述

JavaScript内部，所有数字都是以浮点数形式储存。由于浮点数不是精确的值，所以涉及浮点数的比较和运算要特别小心。

{% highlight javascript %}

0.1 + 0.2 === 0.3
// false

0.3 / 0.1
// 2.9999999999999996

{% endhighlight %}

JavaScript提供的有效数字的精度为16位。

{% highlight javascript %}

1234567890123456789
// 1234567890123456800

{% endhighlight %}

## 数值的表示法

数值可以字面形式直接表示，也可以采用科学计数法表示。

{% highlight javascript %}

123e3
// 123000

123e-3
// 0.123

{% endhighlight %}

除了以下两种情况，所有数值都采用直接表示。

（1）小数点前的数字多于16位。

{% highlight javascript %}

1234567890123456789012
// 1.2345678901234568e+21

123456789012345678901
// 123456789012345680000

{% endhighlight %}

（2）小数点后的零多于5个。

{% highlight javascript %}

0.0000003
// 3e-7

0.000003
// 0.000003

{% endhighlight %}

## NaN

NaN表示无法表示的数值。它不等于任何值，包括它本身。

{% highlight javascript %}

NaN === NaN
// false

{% endhighlight %}

0除以0会得到NaN。

{% highlight javascript %}

0 / 0
// NaN

{% endhighlight %}

isNaN方法可以用来判断一个值是否为NaN。

{% highlight javascript %}

isNaN(NaN)
// true

{% endhighlight %}

但是，这个方法只对数值有效，如果传入其他值，会被先转成数值。传入字符串的时候，就会被转成NaN，这一点要特别引起注意。

{% highlight javascript %}

isNaN("Hello")
// true

{% endhighlight %}

由于NaN是唯一不等于自身的值，可以利用这一点判断一个值是否为NaN。

{% highlight javascript %}

function myIsNaN(value) {
        return value !== value;
}

// or

function myIsNaN2(value) {
	return typeof value === 'number' && isNaN(value);
}

{% endhighlight %}

## Infinity

任意数除以0，会得到Infinity。它有正负之分。

{% highlight javascript %}

1 / -0
// -Infinity

1 / +0
// Infinity

Infinity === -Infinity
// false

Math.pow(+0, -1)
// Infinity

Math.pow(-0, -1)
// -Infinity

{% endhighlight %}

## parseInt方法

该方法可以将字符串或小数转化为整数。

{% highlight javascript %}

parseInt("123")
// 123

parseInt(1.23)
// 1

{% endhighlight %}

如果字符串的第一个字符不能转化为数字，返回NaN。

{% highlight javascript %}

parseInt("abc")
// NaN

parseInt(".3")
// NaN

{% endhighlight %}

如果被解析的值是以0开头的整数，表示该数字为八进制；如果以0x或0X开头，表示该数字为十六进制。

{% highlight javascript %}

parseInt(010)
// 8

parseInt(0x10)
// 16

{% endhighlight %}

该方法还可以接受第二个参数（2到36之间），表示被解析的值的进制。

{% highlight javascript %}

parseInt(1000, 2)
// 8

parseInt(1000, 6)
// 216

parseInt(1000, 8)
// 512

{% endhighlight %}
