---
title: 数值
layout: page
category: grammar
date: 2013-02-13
modifiedOn: 2013-02-13
---

## 概述

JavaScript内部，所有数字都是以64位浮点数形式储存。由于浮点数不是精确的值，所以涉及浮点数的比较和运算要特别小心。

```javascript

	0.1 + 0.2 === 0.3
	// false

	0.3 / 0.1
	// 2.9999999999999996
```


根据国际标准IEEE 754，储存数值的64个二进制位中，第0位到第51位储存有效数字部分，第52到第62位储存指数部分，第63位是符号位，0表示整数，1表示负数。

因此，JavaScript提供的有效数字的精度为53个二进制位（IEEE 754规定有效数字第一位默认为1，再加上后面的52位），也就是说，小于2的53次方的整数都可以精确表示。

```javascript

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

```

大于等于2的53次方的数值，都无法保持精度。


```javascript
	Math.pow(2, 53) 
	// 9007199254740992

	9007199254740992111
	// 9007199254740992000
```


另一方面，指数部分的长度是11，意味着指数部分的最大值是2047（2的11次方减1）。所以，JavaScript能够表示的数值范围为(-2^2048, 2^2048)，超出这个范围的数无法表示。

## 数值的表示法

数值可以字面形式直接表示，也可以采用科学计数法表示。


```javascript
	123e3
	// 123000

	123e-3
	// 0.123
```


除了以下两种情况，所有数值都采用直接表示。

（1）小数点前的数字多于21位。

```javascript

	1234567890123456789012
	// 1.2345678901234568e+21

	123456789012345678901
	// 123456789012345680000

```

（2）小数点后的零多于5个。

```javascript

	0.0000003
	// 3e-7

	0.000003
	// 0.000003
```


## NaN

NaN表示“非数字”（not a number），主要用于将字符串解析成数字出错的场合。


```javascript
	Number("xyz")
	// NaN
```


它数据类型属于Number。


```javascript
typeof NaN
// 'number'
```


它不等于任何值，包括它本身。


```javascript
NaN === NaN
// false
```


0除以0会得到NaN。


```javascript
0 / 0
// NaN
```


isNaN方法可以用来判断一个值是否为NaN。


```javascript
isNaN(NaN)
// true
```


但是，这个方法只对数值有效，如果传入其他值，会被先转成数值。传入字符串的时候，字符串会被先转成NaN，所以最后返回true，这一点要特别引起注意。


```javascript
isNaN("Hello")
// true

// 相当于
isNaN(Number("Hello"))
// true
```


出于同样的原因，对于数组和对象，isNaN也会返回true。


```javascript
isNaN({}) // true
isNaN(["xzy"]) // true
```


由于NaN是唯一不等于自身的值，可以利用这一点判断一个值是否为NaN。


```javascript
function myIsNaN(value) {
        return value !== value;
}

// or

function myIsNaN2(value) {
	return typeof value === 'number' && isNaN(value);
}
```


## Infinity

Infinity表示“无穷”。任意数除以0（0本身除外），会得到Infinity。它有正负之分。


```javascript
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
```


超出JavaScript表示范围的数值，也会得到无穷。


```javascript
Math.pow(2, 2048)
// Infinity

-Math.pow(2, 2048)
// -Infinity
```


Infinity的四则运算，符合无穷的数学计算规则。


```javascript
Infinity + Infinity // Infinity
5 * Infinity // Infinity
5 - Infinity // -Infinity
Infinity / 5 // Infinity
5 / Infinity // 0
```


Infinity减去或除以Infinity，得到NaN。

```javascript

Infinity - Infinity // NaN
Infinity / Infinity // NaN
```


## parseInt方法

该方法可以将字符串或小数转化为整数。


```javascript
parseInt("123")
// 123

parseInt(1.23)
// 1
```


如果字符串的第一个字符不能转化为数字，返回NaN。

```javascript

parseInt("abc")
// NaN

parseInt(".3")
// NaN
```


如果被解析的值是以0开头的整数，表示该数字为八进制；如果以0x或0X开头，表示该数字为十六进制。


```javascript
parseInt(010)
// 8

parseInt(0x10)
// 16
```


该方法还可以接受第二个参数（2到36之间），表示被解析的值的进制。


```javascript
parseInt(1000, 2)
// 8

parseInt(1000, 6)
// 216

parseInt(1000, 8)
// 512

```

## 参考链接

- Dr. Axel Rauschmayer, [How numbers are encoded in JavaScript](http://www.2ality.com/2012/04/number-encoding.html)
