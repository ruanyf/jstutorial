---
title: 数值
layout: page
category: grammar
date: 2013-02-13
modifiedOn: 2013-10-22
---

## 概述

### 整数和浮点数

JavaScript内部，所有数字都是以64位浮点数形式储存，即使整数也是如此。所以，`1`与`1.0`是相等的，而且`1`加上`1.0`得到的还是一个整数，不会像有些语言那样变成小数。

```javascript
1 === 1.0 // true
1 + 1.0 // 2
```

也就是说，在JavaScript语言的底层，根本没有整数，所有数字都是小数（64位浮点数）。容易造成混淆的是，某些运算只有整数才能完成，此时JavaScript会自动把64位浮点数，转成32位整数，然后再进行运算，参见《运算符》一节的”位运算“部分。

由于浮点数不是精确的值，所以涉及小数的比较和运算要特别小心。

```javascript
0.1 + 0.2 === 0.3
// false

0.3 / 0.1
// 2.9999999999999996

(0.3 - 0.2) === (0.2 - 0.1)
// false
```

### 数值精度

根据国际标准IEEE 754，64位浮点数格式的64个二进制位中，第0位到第51位储存有效数字部分，第52到第62位储存指数部分，第63位是符号位，0表示正数，1表示负数。

因此，JavaScript提供的有效数字的精度为53个二进制位（IEEE 754规定有效数字第一位默认为1，再加上后面的52位），也就是说，绝对值小于等于2的53次方的整数都可以精确表示。

```javascript
Math.pow(2, 53)
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

从上面示例可以看到，大于2的53次方以后，整数运算的结果开始出现错误。所以，大于等于2的53次方的数值，都无法保持精度。

```javascript
Math.pow(2, 53)
// 9007199254740992

9007199254740992111
// 9007199254740992000
```

上面示例表明，大于2的53次方以后，多出来的有效数字（最后三位的`111`）都会无法保存，变成0。

### 数值范围

另一方面，64位浮点数的指数部分的长度是11个二进制位，意味着指数部分的最大值是2047（2的11次方减1）。也就是说，64位浮点数的指数部分的值最大为2047，分出一半表示负数，则JavaScript能够表示的数值范围为2<sup>1024</sup>到2<sup>-1023</sup>（开区间），超出这个范围的数无法表示。

如果指数部分等于或超过最大正值1024，JavaScript会返回`Infinity`（关于Infinity的介绍参见下文），这称为“正向溢出”；如果等于或超过最小负值-1023（即非常接近0），JavaScript会直接把这个数转为0，这称为“负向溢出”。事实上，JavaScript对指数部分的两个极端值（`11111111111`和`00000000000`）做了定义，`11111111111`表示`NaN`和`Infinity`，`00000000000`表示0。

```javascript
var x = 0.5;

for(var i = 0; i < 25; i++) {
  x = x * x;
}

x // 0
```

上面代码对0.5连续做25次平方，由于最后结果太接近0，超出了可表示的范围，JavaScript就直接将其转为0。

至于具体的最大值和最小值，JavaScript提供Number对象的`MAX_VALUE`和`MIN_VALUE`属性表示（参见《Number对象》一节）。

```javascript
Number.MAX_VALUE // 1.7976931348623157e+308
Number.MIN_VALUE // 5e-324
```

## 数值的表示法

JavaScript的数值有多种表示方法，可以用字面形式直接表示，也可以采用科学计数法表示，下面是几个科学计数法的例子。

```javascript
123e3 // 123000
123e-3 // 0.123
-3.1E+12
.1e-23
```

科学计数法允许字母`e`或`E`的后面，跟着一个整数，表示这个数值的指数部分。

以下两种情况，JavaScript会自动将数值转为科学计数法表示，其他情况都采用字面形式直接表示。

**（1）小数点前的数字多于21位。**

```javascript
1234567890123456789012
// 1.2345678901234568e+21

123456789012345678901
// 123456789012345680000
```

**（2）小数点后的零多于5个。**

{% highlight javascript %}

0.0000003 // 3e-7
0.000003 // 0.000003

{% endhighlight %}

## 数值的进制

使用字面量（literal）时，JavaScript对整数提供四种进制的表示方法：十进制、十六进制、八进制、2进制。

- 十进制：没有前导0的数值。
- 八进制：有前缀`0o`或`0O`的数值，或者有前导0、且只用到0-7的七个阿拉伯数字的数值。
- 十六进制：有前缀`0x`或`0X`的数值。
- 二进制：有前缀`0b`或`0B`的数值。

默认情况下，JavaScript内部会自动将八进制、十六进制、二进制转为十进制。下面是一些例子。

```javascript
0xff // 255
0o377 // 255
0b11 // 3
```

如果八进制、十六进制、二进制的数值里面，出现不属于该进制的数字，就会报错。

```javascript
0xzz // 报错
0o88 // 报错
0b22 // 报错
```

上面代码中，十六进制出现了字母`z`、八进制出现数字`8`、二进制出现数字`2`，因此报错。

通常来说，有前导0的数值会被视为八进制，但是如果前导0后面有数字`8`和`9`，则该数值被视为十进制。

```javascript
0888 // 888
0777 // 511
```

用前导0表示八进制，处理时很容易造成混乱。ES5的严格模式和ES6，已经废除了这种表示法，但是浏览器目前还支持。

## 特殊数值

JavaScript提供几个特殊的数值。

### 正零和负零

严格来说，JavaScript提供零的三种写法：0、+0、-0。它们是等价的。

{% highlight javascript %}

-0 === +0 // true
0 === -0 // true
0 === +0 // true

{% endhighlight %}

但是，如果正零和负零分别当作分母，它们返回的值是不相等的。

{% highlight javascript %}

(1/+0) === (1/-0) // false

{% endhighlight %}

上面代码之所以出现这样结果，是因为除以正零得到+Infinity，除以负零得到-Infinity，这两者是不相等的（关于Infinity详见后文）。

### NaN

**（1）含义**

NaN是JavaScript的特殊值，表示“非数字”（Not a Number），主要出现在将字符串解析成数字出错的场合。

{% highlight javascript %}

5 - 'x'
// NaN

{% endhighlight %}

上面代码运行时，会自动将字符串“x”转为数值，但是由于x不是数字，所以最后得到结果为NaN，表示它是“非数字”（NaN）。

另外，一些数学函数的运算结果会出现NaN。

{% highlight javascript %}

Math.acos(2) // NaN
Math.log(-1) // NaN
Math.sqrt(-1) // NaN

{% endhighlight %}

0除以0也会得到NaN。

{% highlight javascript %}

0 / 0 // NaN

{% endhighlight %}

需要注意的是，NaN不是一种独立的数据类型，而是一种特殊数值，它的数据类型依然属于Number，使用typeof运算符可以看得很清楚。

{% highlight javascript %}

typeof NaN // 'number'

{% endhighlight %}

**（2）运算规则**

NaN不等于任何值，包括它本身。

{% highlight javascript %}

NaN === NaN // false

{% endhighlight %}

由于数组的indexOf方法，内部使用的是严格相等运算符，所以该方法对NaN不成立。

```javascript
[NaN].indexOf(NaN) // -1
```

NaN在布尔运算时被当作false。

```javascript
Boolean(NaN) // false
```

NaN与任何数（包括它自己）的运算，得到的都是NaN。

{% highlight javascript %}

NaN + 32 // NaN
NaN - 32 // NaN
NaN * 32 // NaN
NaN / 32 // NaN

{% endhighlight %}

**（3）判断NaN的方法**

`isNaN`方法可以用来判断一个值是否为`NaN`。

```javascript
isNaN(NaN) // true
isNaN(123) // false
```

但是，`isNaN`只对数值有效，如果传入其他值，会被先转成数值。比如，传入字符串的时候，字符串会被先转成`NaN`，所以最后返回`true`，这一点要特别引起注意。也就是说，`isNaN`为`true`的值，有可能不是`NaN`，而是一个字符串。

```javascript
isNaN('Hello') // true
// 相当于
isNaN(Number('Hello')) // true
```

出于同样的原因，对于对象和数组，`isNaN`也返回`true`。

```javascript
isNaN({}) // true
// 等同于
isNaN(Number({})) // true

isNaN(['xzy']) // true
// 等同于
isNaN(Number(['xzy'])) // true
```

但是，对于空数组和只有一个数值成员的数组，`isNaN`返回`false`。

```javascript
isNaN([]) // false
isNaN([123]) // false
isNaN(['123']) // false
```

上面代码之所以返回`false`，原因是这些数组能被`Number`函数转成数值，请参见《数据类型转换》一节。

因此，使用`isNaN`之前，最好判断一下数据类型。

```javascript
function myIsNaN(value) {
  return typeof value === 'number' && isNaN(value);
}
```

判断NaN更可靠的方法是，利用`NaN`是JavaScript之中唯一不等于自身的值这个特点，进行判断。

```javascript
function myIsNaN(value) {
  return value !== value;
}
```

### Infinity

**（1）定义**

Infinity表示“无穷”。除了0除以0得到NaN，其他任意数除以0，得到Infinity。

{% highlight javascript %}

1 / -0 // -Infinity
1 / +0 // Infinity

{% endhighlight %}

上面代码表示，非0值除以0，JavaScript不报错，而是返回Infinity。这是需要特别注意的地方。

Infinity有正负之分。

{% highlight javascript %}

Infinity === -Infinity // false
Math.pow(+0, -1) // Infinity
Math.pow(-0, -1) // -Infinity

{% endhighlight %}

运算结果超出JavaScript可接受范围，也会返回无穷。

{% highlight javascript %}

Math.pow(2, 2048) // Infinity
-Math.pow(2, 2048) // -Infinity

{% endhighlight %}

由于数值正向溢出（overflow）、负向溢出（underflow）和被0除，JavaScript都不报错，所以单纯的数学运算几乎没有可能抛出错误。

**（2）运算规则**

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

Infinity可以用于布尔运算。可以记住，Infinity是JavaScript中最大的值（NaN除外），-Infinity是最小的值（NaN除外）。

{% highlight javascript %}

5 > -Infinity // true
5 > Infinity // false

{% endhighlight %}

**（3）isFinite函数**

isFinite函数返回一个布尔值，检查某个值是否为正常值，而不是Infinity。

{% highlight javascript %}

isFinite(Infinity) // false
isFinite(-1) // true
isFinite(true) // true
isFinite(NaN) // false

{% endhighlight %}

上面代码表示，如果对NaN使用isFinite函数，也返回false，表示NaN不是一个正常值。

## 与数值相关的全局方法

### parseInt()

**（1）基本用法**

`parseInt`方法可以将字符串或小数转化为整数。如果字符串头部有空格，空格会被自动去除。

```javascript
parseInt('123') // 123
parseInt(1.23) // 1
parseInt('   81') // 81
```

字符串转为整数的时候，是一个个字符依次转换，如果遇到不能转为数字的字符，就不再进行下去，返回已经转好的部分。

```javascript
parseInt('8a') // 8
parseInt('12**') // 12
parseInt('12.34') // 12
parseInt('0xf00') // 3840
```

上面代码中，`parseInt`的参数都是字符串，结果只返回字符串头部可以转为数字的部分。最后一行的`0xf00`之所以可以转为数字，因为如果开头两个字符是`0x`或`0X`，`parseInt`将其视为十六进制数（下文有进一步解释）。

如果字符串的第一个字符不能转化为数字（后面跟着数字的正负号除外），返回`NaN`。

```javascript
parseInt('abc') // NaN
parseInt('.3') // NaN
parseInt('') // NaN
parseInt('+') // NaN
```

**（2）进制转换**

`parseInt`方法还可以接受第二个参数（2到36之间），表示被解析的值的进制，返回该值对应的十进制数。

```javascript
parseInt(1000, 2) // 8
parseInt(1000, 6) // 216
parseInt(1000, 8) // 512
```

上面代码中，二进制、六进制、八进制的1000，分别等于十进制的8、216和512。这意味着，可以用`parseInt`方法进行进制的转换。

如果第二个参数不是数值，会被自动转为一个整数。这个整数只有在2到36之间，才能得到有意义的结果，超出这个范围，则返回`NaN`。如果第二个参数是`0`、`undefined`和`null`，则直接忽略。

```javascript
parseInt(10, 37) // NaN
parseInt(10, 1) // NaN
parseInt(10, 0) // 10
parseInt(10, null) // 10
parseInt(10, undefined) // 10
```

需要注意的是，进制转换的时候，参数是字符串或数值，`parseInt`的行为不一致。如果第一个参数是数值，会将这个数值先转为十进制，然后再应用第二个参数。

```javascript
parseInt(0x11, 36) // 43
parseInt(17, 36) // 43
```

上面代码中，`0x11`会被先转为十进制的17，然后再用36进制解读这个17，最后返回结果43。

如果第一个参数是字符串，则会直接用指定进制解读这个字符串。

```javascript
parseInt('0x11', 36) // 42805
parseInt('x', 36) // 33
```

上面代码中，字符串`0x11`会被直接当作一个36进制的数。由于字符`x`在36进制中代表33，导致`0x11`被解读为42805。

下面是更多的例子。

```javascript
parseInt(010, 10) // 8
parseInt('010', 10) // 10

parseInt(010, 2) // NaN
parseInt('010', 2) // 2

parseInt(010, 8) // NaN
parseInt('010', 8) // 8

parseInt(020, 10) // 16
parseInt('020', 10) // 20

parseInt(020, 8) // 14
parseInt('020', 8) // 16
```

上面代码中，`010`会被先转为十进制8，然后再应用第二个参数，由于二进制和八进制中没有8这个数字，所以`parseInt(010, 2)`和`parseInt(010, 8)`返回`NaN`。同理，数值`020`会被先转为十进制的16，然后再应用第二个参数。

如果第一个参数是以`0x`或`0X`开头的字符串，而第二个参数省略或为0，则`parseInt`自动将第二个参数设为16。

```javascript
parseInt('0xFF') // 255
parseInt('0xFF', 0) // 255
parseInt('0xFF', 16) // 255
parseInt('0xFF', 10) // 0
parseInt('0xFF', 17) // 0
```

上面代码中，第二个参数除了0、16和省略，其他情况都会依次解析第一个参数，直到遇到第一个不可解析字符。

**（3）八进制的前缀0**

`parseInt`的很多复杂行为，都是由八进制的前缀0引发的。

```javascript
parseInt(010, 8) // NaN
parseInt('010', 8) // 8
```

上面代码中，数值形式和字符串形式的`010`会得到不一样的处理结果。这增加编程处理的复杂性。

因此，ECMAScript 5不再允许parseInt将带有前缀0的数字，视为八进制数，而是要求忽略这个`0`。但是，为了保证兼容性，大部分浏览器并没有部署这一条规定。

**（4）科学计数法**

对于那些会自动转为科学计数法的数字，`parseInt`会将科学计数法的表示方法视为字符串，因此导致一些奇怪的结果。

```javascript
parseInt(1000000000000000000000.5, 10) // 1
// 等同于
parseInt('1e+21', 10) // 1

parseInt(0.0000008, 10) // 8
// 等同于
parseInt('8e-7', 10) // 8
```

### parseFloat()

`parseFloat`方法用于将一个字符串转为浮点数。

```javascript
parseFloat('3.14') // 3.14
```

如果字符串符合科学计数法，则会进行相应的转换。

```javascript
parseFloat('314e-2') // 3.14
parseFloat('0.0314E+2') // 3.14
```

如果字符串包含不能转为浮点数的字符，则不再进行往后转换，返回已经转好的部分。

```javascript
parseFloat('3.14more non-digit characters') // 3.14
```

`parseFloat`方法会自动过滤字符串前导的空格。

```javascript
parseFloat('\t\v\r12.34\n ') // 12.34
```

如果参数不是字符串，或者字符串的第一个字符不能转化为浮点数，则返回`NaN`。

```javascript
parseFloat([]) // NaN
parseFloat('FF2') // NaN
parseFloat('') // NaN
```

上面代码说明，`parseFloat`会将空字符串转为`NaN`。

这些特点使得`parseFloat`的转换结果不同于`Number`函数。

```javascript
parseFloat(true)  // NaN
Number(true) // 1

parseFloat(null) // NaN
Number(null) // 0

parseFloat('') // NaN
Number('') // 0

parseFloat('123.45#') // 123.45
Number('123.45#') // NaN
```

## 参考链接

- Dr. Axel Rauschmayer, [How numbers are encoded in JavaScript](http://www.2ality.com/2012/04/number-encoding.html)
- Humphry, [JavaScript中Number的一些表示上/下限](http://blog.segmentfault.com/humphry/1190000000407658)
