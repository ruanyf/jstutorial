---
title: String对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-04-30
---

## 概述

String对象用来生成字符串的包装对象实例。

{% highlight javascript %}

var s = new String("abc");

{% endhighlight %}

## String对象的方法

String对象直接提供的方法，主要是fromCharCode。该方法根据Unicode编码，生成一个字符串。

{% highlight javascript %}

String.fromCharCode(104, 101, 108, 108, 111)
// "hello"

{% endhighlight %}

## 实例对象的属性和方法

### length属性

该属性返回字符串的长度。

{% highlight javascript %}

"abc".length
// 3

{% endhighlight %}

### charAt 和 charCodeAt 方法

charAt方法返回一个字符串的给定位置的字符。位置从0开始编号。

{% highlight javascript %}

var s = new String("abc");

s.charAt(1)
// "b"

{% endhighlight %}

其实，这个方法完全可以用数组下标替代。

{% highlight javascript %}

"abc"[1]
// "b"

{% endhighlight %}

charCodeAt方法返回给定位置字符的Unicode编码（十进制）。

{% highlight javascript %}

var s = new String("abc");

s.charCodeAt(1)
// 98

{% endhighlight %}

需要注意的是，charCodeAt方法返回的Unicode编码不大于65536(0xFFFF)，也就是说，只返回两个字节。因此如果遇到Unicode大于65536的字符（根据UTF-16的编码规则，第一个字节在U+D800到U+DBFF之间），就必需连续使用两次charCodeAt，不仅读入charCodeAt(i)，还要读入charCodeAt(i+1)，将两个16字节放在一起，才能得到准确的字符。

如果给定位置为负数，或大于等于字符串的长度，则这两个方法返回NaN。

### concat方法

concat方法用于连接两个字符串。

{% highlight javascript %}

var s1 = "abc";

var s2 = "def";

s1.concat(s2)
// "abcdef"

s1
// "abc"

{% endhighlight %}

使用该方法后，原字符串不受影响，返回一个新字符串。

该方法可以接受多个字符串。

{% highlight javascript %}

"a".concat("b","c")
// "abc"

{% endhighlight %}

但是，一般来说，字符串连接运算还是应该使用加号（+）运算符。

### slice方法，substr方法和substring方法

这三个方法都返回一个字符串的子串。它们都可以接受一个或两个参数，第一个参数是子字符串的开始位置，如果省略第二个参数，则表示子字符串一直持续到原字符串结束。

{% highlight javascript %}

"Hello World".slice(3)
// "lo World"

"Hello World".substr(3)
// "lo World"

"Hello World".substring(3)
// "lo World"

{% endhighlight %}

如果提供第二个参数，对于slice和substring方法，表示子字符串的结束位置；对于substr，表示子字符串的长度。

{% highlight javascript %}

"Hello World".slice(3,7)
// "lo W"

"Hello World".substring(3,7)
// "lo W"

"Hello World".substr(3,7)
// "lo Worl"

{% endhighlight %}

如果参数为负，对于slice方法，表示用字符串长度扣掉负数的值。

{% highlight javascript %}

"Hello World".slice(-3)
// "rld"

"Hello World".slice(4,-3)
// "o Wo"

{% endhighlight %}

对于substring方法，会自动将负数转为0。

{% highlight javascript %}

"Hello World".substring(-3)
// "Hello World"

"Hello World".substring(4,-3)
// "Hell"

{% endhighlight %}

对于substr方法，负数出现在第一个参数，表示字符串长度扣掉负数的值；负数出现在第二个参数，将被转为0。

{% highlight javascript %}

"Hello World".substr(-3)
// "rld"

"Hello World".substr(4,-3)
// ""

{% endhighlight %}

这三个方法返回一个新字符串，而不会改变原字符串的值。

### indexOf 和 lastIndexOf 方法

这两个方法用于确定一个字符串在另一个字符串中的位置，如果返回-1，就表示不匹配。两者的区别在于，indexOf从字符串头部开始匹配，lastIndexOf从尾部开始匹配。

{% highlight javascript %}

"hello world".indexOf("o")
// 4

"hello world".lastIndexOf("o")
// 7

{% endhighlight %}

它们还可以接受第二个参数，对于indexOf，表示从该位置开始向后匹配；对于lastIndexOf，表示从该位置起向前匹配。

{% highlight javascript %}

"hello world".indexOf("o", 6)
// 7

"hello world".lastIndexOf("o", 6)
// 4

{% endhighlight %}

### trim 方法

该方法用于去除字符串两端的空格。

{% highlight javascript %}

"  hello world  ".trim()
// "hello world"

{% endhighlight %}

该方法返回一个新字符串，不改变原字符串。

### toLowerCase 和 toUpperCase 方法

toLowerCase用于将一个字符串转为小写，toUpperCase则是转为大写。

{% highlight javascript %}

"Hello World".toLowerCase()
// "hello world"

"Hello World".toUpperCase()
// "HELLO WORLD"

{% endhighlight %}

### 搜索和替换

与搜索和替换相关的有三个方法，它们都允许使用正则表达式。

- match：用于确定原字符串是否匹配某个子字符串，返回匹配的子字符串数组。
- search：等同于match，但是返回值不一样。
- replace：用于替换匹配的字符串。

下面是这三个方法的简单介绍，详细介绍见正则表达式的章节。

match方法返回一个匹配数组，成员为匹配的第一个字符串，等同于正则对象的exec方法。如果没有找到匹配，则返回null。

{% highlight javascript %}

var matches = "cat, bat, sat, fat".match(".at");

matches
// ["cat"]

matches.index;
// 0

{% endhighlight %}

search方法的用法等同于match，但是返回值为匹配的第一个位置。如果没有找到匹配，则返回-1。

{% highlight javascript %}

"cat, bat, sat, fat".search(".at")
// 0

{% endhighlight %}

replace方法用于替换匹配的子字符串，一般情况下只替换第一个匹配的值，除非搜索模式是带有g修饰符的正则对象。

{% highlight javascript %}

"aaa".replace("a", "b")
// "baa"

{% endhighlight %}

## Base64转码

在浏览器环境中，JavaScript原生提供btoa方法，将字符串或二进制值转化为Base64编码；以及atob方法，将Base64编码转化为原来的编码。

{% highlight javascript %}

window.btoa("Hello World")
// "SGVsbG8gV29ybGQ="

window.atob("SGVsbG8gV29ybGQ=")
// "Hello World"

{% endhighlight %}

这两个方法不适合Unicode字符串，浏览器会报错。必须中间插入一个浏览器转码的环节，再使用这两个方法。

{% highlight javascript %}

function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}
 
function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}

// 使用方法
utf8_to_b64('你好'); // "5L2g5aW9"
b64_to_utf8('4pyTIMOgIGxhIG1vZGU='); // "你好"

{% endhighlight %}
