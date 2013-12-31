---
title: 字符串
layout: page
category: grammar
date: 2013-12-31
modifiedOn: 2013-12-31
---

## 概述

### 表示方法

字符串就是若干个排在一起的字符，放在单引号或双引号之中。

{% highlight javascript %}

'abc'
"abc"

{% endhighlight %}

反斜杠可以将一行字符串拆成多行。

{% highlight javascript %}

var longString = "Long \
long \
long \
string";

longString
// "Long long long string"

{% endhighlight %}

上面代码表示，加了反斜杠以后，原来写在一行的字符串，可以分成多行，效果与写在同一行完全一样。但是，这种写法有两个注意点，首先，它是ECMAScript 5新添加的，浏览器IE 8不支持，其次，反斜杠的后面必须是换行符，而不能有其他字符（比如空格），否则会报错。

### 转义

如果字符串内部有单引号或双引号，必须在它的前面加上反斜杠，用来转义。

{% highlight javascript %}

'Did she say "Hello"?'
"Did she say \"Hello\"?"

'That\'s nice!'
"That's nice!"

{% endhighlight %}

从上面的代码可以看到，单引号标识的字符串内部，允许直接使用双引号；双引号标识的字符串内部，允许直接使用单引号。否则，就必须使用反斜杠对单引号和双引号进行转义。

如果字符串的内容包含反斜杠，则反斜杠前面需要再加一个反斜杠，用来转义。

{% highlight javascript %}

'Prev \\ Next'
// "Prev \ Next"

{% endhighlight %}

反斜杠还可以用来表示一些特殊含义字符，比如换行符用\n表示。

{% highlight javascript %}

'行1\n行2'
// "行1
// 行2"

{% endhighlight %}

需要用反斜杠转义的字符串，主要有下面这些：

- \b	后退键
- \f	换页符
- \n	换行符
- \r	回车键
- \t	制表符
- \v	垂直制表符
- \'	单引号
- \"	双引号
- \\\\	反斜杠
- \XXX	用三位八进制数（0到377）代表一些特殊符号，比如\251表示版权符号。
- \xXX	用两位十六进制数（00到FF）代表一些特殊符号，比如\xA9表示版权符号。
- \uXXXX	用四位十六进制的Unicode编号代表某个字符，比如\u00A9表示版权符号。

{% highlight javascript %}

"\251"
// "©"

"\xA9"
// "©"

"\u00A9"
// "©"

{% endhighlight %}

### 字符串与数组

在JavaScript内部，字符串可以被视为字符数组，因此接受数组的方括号运算符，表示返回某个位置的字符（从0开始）。

{% highlight javascript %}

var s = 'hello';

s[0] // "h"
s[1] // "e"
s[4] // "o"

'hello'[1] // "e"

{% endhighlight %}

如果方括号中的数字超过字符串的范围，或者方括号中根本不是数字，则返回undefined。

{% highlight javascript %}

'abc'[3] // undefined
'abc'[-1] // undefined
'abc'["x"] // undefined

{% endhighlight %}

但是，字符串与数组的相似性仅此而已，JavaScript事实上是把字符串当作类似数组的对象，而且无法改变字符串之中某个字符的值。

{% highlight javascript %}

var s = 'hello';

delete s[0];
s // "hello"

s[1] = 'a';
s // "hello"

s[5] = '!';
s // "hello"

{% endhighlight %}

上面代码表示，字符串内部的单个字符无法改变和增删，这些操作会默默的失败。

{% highlight javascript %}

var s = 'hello';
s.length // 5

s.length = 3;
s.length // 5

s.length = 7;
s.length // 5

{% endhighlight %}

上面代码表示字符串的length属性也是无法改变的。

## 字符集

JavaScript使用Unicode字符集，也就是说在JavaScript内部，所有字符都用Unicode表示。ECMAScript 3要求使用Unicode 2.1或以上版本，ECMAScript 5则要求使用Unicode 3及以上版本。

在JavaScript中，所有字符都可以用Unicode形式表示，写成"\uxxxx"的内码形式，其中xxxx代表该字符的Unicode编码。比如，\u00A9代表版权符号。

{% highlight javascript %}

var s = '\u00A9';

s // "©"

{% endhighlight %}

具体来说，每个字符在JavaScript内部都是以16位的UTF-16格式储存。需要注意的是，UTF-16有两种长度：对于U+0000到U+FFFF之间的字符，长度为16位（即2个字节）；对于U+10000到U+10FFFF之间的字符，长度为32位（即4个字节），而且前两个字节在0xD800到0xDBFF之间，后两个字节在0xDC00到0xDFFF之间。举例来说，U+1D306对应的字符为𝌆，它写成UTF-16就是0xD834和0xDF06。浏览器会正确将这两个字节识别为一个字符，但是JavaScript内部的字符长度总是固定为16位，会把这两个字节视为两个字符。

{% highlight javascript %}

var s = "\uD834\uDF06"

s // "𝌆"
s.length // 2

{% endhighlight %}

上面代码说明，对于于U+10000到U+10FFFF之间的字符，JavaScript总是视为两个字符（字符串长度为2）,所以处理的时候，必须把这一点考虑在内。假定C是字符的Unicode编号，H是对应的UTF-16的前两个字节，L是对应的UTF-16的后两个字节，则它们之间的换算关系如下：

{% highlight javascript %}

// 将大于U+FFFF的字符，从Unicode转为UTF-16
H = Math.floor((C - 0x10000) / 0x400) + 0xD800
L = (C - 0x10000) % 0x400 + 0xDC00

// 将大于U+FFFF的字符，从UTF-16转为Unicode
C = (H - 0xD800) * 0x400 + L - 0xDC00 + 0x10000

{% endhighlight %}

下面的正则表达式可以识别所有UTF-16字符。

{% highlight javascript %}

([\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])

{% endhighlight %}
