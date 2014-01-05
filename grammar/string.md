---
title: 字符串
layout: page
category: grammar
date: 2013-12-31
modifiedOn: 2014-01-05
---

## 概述

### 表示方法

字符串就是若干个排在一起的字符，放在单引号或双引号之中。

{% highlight javascript %}

'abc'
"abc"

{% endhighlight %}

用单引号表示的字符串，内部可以使用双引号；用双引号表示的字符串，内部可以使用单引号。

{% highlight javascript %}

'key="value"'
"It's a long journey"

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

如果单引号表示字符串内需要出现单引号（或双引号表示的字符串内需要出现双引号），必须在它的前面加上反斜杠，用来转义。

{% highlight javascript %}

'Did she say "Hello"?'
"Did she say \"Hello\"?"

{% endhighlight %}

这就说明，反斜杠在字符串内有特殊含义，用来表示一些特殊字符。如果字符串的内容包含需要出现反斜杠，则它前面需要再加一个反斜杠，用来对自身转义。

{% highlight javascript %}

'Prev \\ Next'
// "Prev \ Next"

{% endhighlight %}

需要用反斜杠转义的字符串，主要有下面这些：

- \0	代表没有内容的字符（\u0000）
- \b	后退键（\u0008）
- \f	换页符（\u000C）
- \n	换行符（\u000A）
- \r	回车键（\u000D）
- \t	制表符（\u0009）
- \v	垂直制表符（\u000B）
- \'	单引号（\u0027）
- \"	双引号（\u0022）
- \\\\	反斜杠（\u005C）
- \XXX	用三位八进制数（0到377）代表一些特殊符号，比如\251表示版权符号。
- \xXX	用两位十六进制数（00到FF）代表一些特殊符号，比如\xA9表示版权符号。
- \uXXXX	用四位十六进制的Unicode编号代表某个字符，比如\u00A9表示版权符号。

下面是最后三种字符的特殊写法的例子。

{% highlight javascript %}

"\a251" // "©"
"\xA9" // "©"
"\u00A9" // "©"

{% endhighlight %}

如果非特殊字符前面使用反斜杠，则反斜杠会被省略。

{% highlight javascript %}

"\a" // "a"

{% endhighlight %}

上面代码表示a是一个正常字符，前面加反斜杠没有特殊含义，则反斜杠会被自动省略。

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

不仅JavaScript内部使用Unicode储存字符，而且还可以直接在程序中使用Unicode，所有字符都可以写成"\uxxxx"的形式，其中xxxx代表该字符的Unicode编码。比如，\u00A9代表版权符号。

{% highlight javascript %}

var s = '\u00A9';
s // "©"

{% endhighlight %}

具体来说，每个字符在JavaScript内部都是以16位的UTF-16格式储存。需要注意的是，UTF-16有两种长度：对于U+0000到U+FFFF之间的字符，长度为16位（即2个字节）；对于U+10000到U+10FFFF之间的字符，长度为32位（即4个字节），而且前两个字节在0xD800到0xDBFF之间，后两个字节在0xDC00到0xDFFF之间。举例来说，U+1D306对应的字符为𝌆，它写成UTF-16就是0xD834和0xDF06。浏览器会正确将这四个字节识别为一个字符，但是JavaScript内部的字符长度总是固定为16位，会把这四个字节视为两个字符。

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

## Base64转码

Base64是一种将二进制数据转为可打印字符的编码方法。在浏览器环境中，JavaScript原生提供两个方法，用来处理Base64转码：btoa方法将字符串或二进制值转化为Base64编码，atob方法将Base64编码转化为原来的编码。

{% highlight javascript %}

window.btoa("Hello World")
// "SGVsbG8gV29ybGQ="

window.atob("SGVsbG8gV29ybGQ=")
// "Hello World"

{% endhighlight %}

这两个方法不适合非ASCII码的字符，浏览器会报错。

{% highlight javascript %}

window.btoa('你好')
// InvalidCharacterError: An invalid or illegal character was specified, such as in an XML name.

{% endhighlight %}

要将非ASCII码字符转为Base64编码，必须中间插入一个浏览器转码的环节，再使用这两个方法。

{% highlight javascript %}

function b64Encode( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}
 
function b64Decode( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}

// 使用方法
b64Encode('你好') // "5L2g5aW9"
b64Decode('5L2g5aW9') // "你好"

{% endhighlight %}

## 参考链接

- Mathias Bynens, [JavaScript’s internal character encoding: UCS-2 or UTF-16?](http://mathiasbynens.be/notes/javascript-encoding)
- Mathias Bynens, [JavaScript has a Unicode problem](http://mathiasbynens.be/notes/javascript-unicode)
- Mozilla Developer Network, [Window.btoa](https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa)
