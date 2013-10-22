---
title: 数值
layout: page
category: grammar
date: 2013-02-13
modifiedOn: 2013-10-22
---

## 概述

JavaScript内部，所有数字都是以64位浮点数形式储存，即使整数也是如此。由于浮点数不是精确的值，所以涉及小数的比较和运算要特别小心。

{% highlight javascript %}

0.1 + 0.2 === 0.3
// false

0.3 / 0.1
// 2.9999999999999996

{% endhighlight %}

根据国际标准IEEE 754，64位浮点数格式的64个二进制位中，第0位到第51位储存有效数字部分，第52到第62位储存指数部分，第63位是符号位，0表示正数，1表示负数。

因此，JavaScript提供的有效数字的精度为53个二进制位（IEEE 754规定有效数字第一位默认为1，再加上后面的52位），也就是说，小于2的53次方的整数都可以精确表示。

{% highlight javascript %}

Math.pow(2, 53)  // 54个二进制位
// 9007199254740992

Math.pow(2, 53) + 1
// 9007199254740992

Math.pow(2, 53) + 2
// 9007199254740994

Math.pow(2, 53) + 3
// 9007199254740996

Math.pow(2, 53) + 4
// 9007199254740996

{% endhighlight %}

从上面示例可以看到，大于2的53次方以后，整数运算的结果开始出现错误。所以，大于等于2的53次方的数值，都无法保持精度。

{% highlight javascript %}

Math.pow(2, 53) 
// 9007199254740992

9007199254740992111
// 9007199254740992000

{% endhighlight %}

上面示例表明，大于2的53次方以后，多出来的有效数字（最后三位的111）都会无法保存，变成0。

另一方面，64位浮点数的指数部分的长度是11个二进制位，意味着指数部分的最大值是2047（2的11次方减1）。所以，JavaScript能够表示的数值范围为(-2<sup>2048</sup>, 2<sup>2048</sup>)，超出这个范围的数无法表示。

## 数值的表示法

数值可以字面形式直接表示，也可以采用科学计数法表示。

{% highlight javascript %}

123e3
// 123000

123e-3
// 0.123

{% endhighlight %}

以下两种情况，JavaScript会自动将数值转为科学计数法表示，其他情况都采用字面形式直接表示。

（1）小数点前的数字多于21位。

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

NaN是JavaScript的特殊值，表示“非数字”（not a number），主要出现在将字符串解析成数字出错的场合。

{% highlight javascript %}

Number("xyz")
// NaN

{% endhighlight %}

上面代码表示无法将字符串xyz转为数值，因为它是“非数字”（NaN）。

需要注意的是，NaN不是一种独立的数据类型，而是一种特殊数值，它的数据类型依然属于Number，使用typeof运算符可以看得很清楚。

{% highlight javascript %}

typeof NaN
// 'number'

{% endhighlight %}

NaN不等于任何值，包括它本身。NaN在布尔运算时被当作false。

{% highlight javascript %}

NaN === NaN
// false

Boolean(NaN)
// false

{% endhighlight %}

0除以0会得到NaN。

{% highlight javascript %}

0 / 0
// NaN

{% endhighlight %}

NaN与任何数（包括它自己）的运算，得到的都是NaN。

{% highlight javascript %}

NaN + 32 // NaN
NaN - 32 // NaN
NaN * 32 // NaN
NaN / 32 // NaN

{% endhighlight %}

isNaN方法可以用来判断一个值是否为NaN。

{% highlight javascript %}

isNaN(NaN)
// true

{% endhighlight %}

但是，isNaN只对数值有效，如果传入其他值，会被先转成数值。比如，传入字符串的时候，字符串会被先转成NaN，所以最后返回true，这一点要特别引起注意。也就是说，isNaN为true的值，有可能不是NaN，而是一个字符串。

{% highlight javascript %}

isNaN("Hello")
// true

// 相当于
isNaN(Number("Hello"))
// true

{% endhighlight %}

出于同样的原因，对于数组和对象，isNaN也返回true。

{% highlight javascript %}

isNaN({}) // true
isNaN(["xzy"]) // true

{% endhighlight %}

判断NaN更可靠的方法是，利用NaN是JavaScript之中唯一不等于自身的值这个特点，进行判断。

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

Infinity表示“无穷”。除了0除以0得到NaN，其他任意数除以0，得到Infinity。它有正负之分。

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

超出JavaScript表示范围的数值，也会得到无穷。

{% highlight javascript %}

Math.pow(2, 2048)
// Infinity

-Math.pow(2, 2048)
// -Infinity

{% endhighlight %}

Infinity的四则运算，符合无穷的数学计算规则。

{% highlight javascript %}

Infinity + Infinity // Infinity
5 * Infinity // Infinity
5 - Infinity // -Infinity
Infinity / 5 // Infinity
5 / Infinity // 0

{% endhighlight %}

Infinity减去或除以Infinity，得到NaN。

{% highlight javascript %}

Infinity - Infinity // NaN
Infinity / Infinity // NaN

{% endhighlight %}

## parseInt方法

parseInt方法可以将字符串或小数转化为整数。如果字符串头部有空格，空格会被自动去除。

{% highlight javascript %}

parseInt("123") // 123
parseInt(1.23) // 1

{% endhighlight %}

如果字符串包含不能转化为数字的字符，则不再进行转化，返回已经转好的部分。

{% highlight javascript %}

parseInt("8a") // 8

{% endhighlight %}

如果字符串的第一个字符不能转化为数字（正负号除外），返回NaN。

{% highlight javascript %}

parseInt("abc") // NaN
parseInt(".3") // NaN

{% endhighlight %}

parseInt方法还可以接受第二个参数（2到36之间），表示被解析的值的进制。

{% highlight javascript %}

parseInt(1000, 2) // 8
parseInt(1000, 6) // 216
parseInt(1000, 8) // 512

{% endhighlight %}

这意味着，可以用parseInt方法进行进制的转换。

{% highlight javascript %}

parseInt("1011", 2) // 11

{% endhighlight %}

需要注意的是，如果第一个参数是数值，则会将这个数值先转为10进制，然后再应用第二个参数。

{% highlight javascript %}

parseInt(010, 10) // 8
parseInt(010, 8) // NaN
parseInt(020, 10) // 16
parseInt(020, 8) // 14

{% endhighlight %}

上面代码中，010会被先转为十进制8，然后再应用第二个参数，由于八进制中没有8这个数字，所以parseInt(010, 8)会返回NaN。同理，020会被先转为十进制16，然后再应用第二个参数。

如果第一个参数是字符串，则不会将其先转为十进制。

{% highlight javascript %}

parseInt("010") // 10
parseInt("010",10) // 10
parseInt("010",8) // 8

{% endhighlight %}

可以看到，parseInt的很多复杂行为，都是由八进制的前缀0引发的。因此，ECMAScript 5不再允许parseInt将带有前缀0的数字，视为八进制数。但是，为了保证兼容性，大部分浏览器并没有部署这一条规定。

## parseFloat方法

parseFloat方法用于将一个字符串转为浮点数。

如果字符串包含不能转化为浮点数的字符，则不再进行转化，返回已经转好的部分。

{% highlight javascript %}

parseFloat("3.14");
parseFloat("314e-2");
parseFloat("0.0314E+2");
parseFloat("3.14more non-digit characters");

{% endhighlight %}

上面四个表达式都返回3.14。

如果第一个字符不能转化为浮点数，则返回NaN。

{% highlight javascript %}

parseFloat("FF2")
// NaN

{% endhighlight %}

## 参考链接

- Dr. Axel Rauschmayer, [How numbers are encoded in JavaScript](http://www.2ality.com/2012/04/number-encoding.html)
