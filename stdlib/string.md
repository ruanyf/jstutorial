---
title: String对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2014-01-01
---

## 概述

String对象用来生成字符串的包装对象实例。

{% highlight javascript %}

var s = new String("abc");

typeof s // "object"
s.valueOf() // "abc"

{% endhighlight %}

上面代码生成的变量s，类型为对象，值就是原来的字符串。

通过String构造函数生成的字符串对象，是一个类似数组的对象。

{% highlight javascript %}

new String("abc")
// String {0: "a", 1: "b", 2: "c"}

{% endhighlight %}

String还可以当作工具方法使用，作用是将任意类型的值转为字符串。

{% highlight javascript %}

String(true) // "true"
String(5) // "5"

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

charAt方法返回一个字符串的给定位置的字符，位置从0开始编号。

{% highlight javascript %}

var s = new String("abc");

s.charAt(1) // "b"
s.charAt(s.length-1) // "c"

{% endhighlight %}

这个方法完全可以用数组下标替代。

{% highlight javascript %}

"abc"[1] // "b"

{% endhighlight %}

charCodeAt方法返回给定位置字符的Unicode编码（十进制表示）。

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

这三个方法都用来返回一个字符串的子串，而不会改变原字符串。它们都可以接受一个或两个参数，区别只是参数含义的不同。

**（1）第一个参数的含义**

第一个参数是子字符串的开始位置，如果省略第二个参数，则表示子字符串一直持续到原字符串结束。

{% highlight javascript %}

"Hello World".slice(3)
// "lo World"

"Hello World".substr(3)
// "lo World"

"Hello World".substring(3)
// "lo World"

{% endhighlight %}

**（2）第二个参数的含义**

如果提供第二个参数，对于slice和substring方法，表示子字符串的结束位置；对于substr，表示子字符串的长度。

{% highlight javascript %}

"Hello World".slice(3,7)
// "lo W"

"Hello World".substring(3,7)
// "lo W"

"Hello World".substr(3,7)
// "lo Worl"

{% endhighlight %}

**（3）负的参数**

如果参数为负，对于slice方法，表示字符位置从尾部开始计算。

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

对于substr方法，负数出现在第一个参数，表示从尾部开始计算的字符位置；负数出现在第二个参数，将被转为0。

{% highlight javascript %}

"Hello World".substr(-3)
// "rld"

"Hello World".substr(4,-3)
// ""

{% endhighlight %}

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

与搜索和替换相关的有4个方法，它们都允许使用正则表达式。

- **match**：用于确定原字符串是否匹配某个子字符串，返回匹配的子字符串数组。
- **search**：等同于match，但是返回值不一样。
- **replace**：用于替换匹配的字符串。
- **split**：将字符串按照给定规则分割，返回一个由分割出来的各部分组成的新数组。

下面是这4个方法的简单介绍。它们都可以使用正则对象，涉及正则对象的部分见《Regex对象》一节。

**（1）match方法**

该方法返回一个匹配数组，成员为匹配的第一个字符串，等同于正则对象的exec方法。如果没有找到匹配，则返回null。

{% highlight javascript %}

var matches = "cat, bat, sat, fat".match(".at");

matches
// ["cat"]

matches.index;
// 0

{% endhighlight %}

**（2）search方法**

该方法的用法等同于match，但是返回值为匹配的第一个位置。如果没有找到匹配，则返回-1。

{% highlight javascript %}

"cat, bat, sat, fat".search(".at")
// 0

{% endhighlight %}

**（3）replace方法**

该方法用于替换匹配的子字符串，一般情况下只替换第一个匹配的值（除非使用带有g修饰符的正则表达式）。

{% highlight javascript %}

"aaa".replace("a", "b")
// "baa"

{% endhighlight %}

**（4）split方法**

该方法按照给定规则分割字符串，返回一个由分割出来的各部分组成的新数组。

{% highlight javascript %}

"a|b|c".split("|")
// ["a", "b", "c"]

{% endhighlight %}

如果分割规则为空字符串，则返回数组的成员是原字符串的每一个字符。

{% highlight javascript %}

"a|b|c".split("")
// ["a", "|", "b", "|", "c"]

{% endhighlight %}

如果省略分割规则，则返回数组的唯一成员就是原字符串。

{% highlight javascript %}

"a|b|c".split()
// ["a|b|c"]

{% endhighlight %}

如果满足分割规则的两个部分紧邻着（即中间没有其他字符），则返回数组之中会有一个空字符串。

{% highlight javascript %}

"a||c".split("|")
// ["a", "", "c"]

{% endhighlight %}

如果满足分割规则的部分处于字符串的开头或结尾（即它的前面或后面没有其他字符），则返回数组的第一个或最后一个成员是一个空字符串。

{% highlight javascript %}

"|b|c".split("|")
// ["", "b", "c"]

"a|b|".split("|")
// ["a", "b", ""]

{% endhighlight %}

split方法还可以接受第二个参数，限定返回数组的最大成员数。

{% highlight javascript %}

"a|b|c".split("|", 0) // []
"a|b|c".split("|", 1) // ["a"]
"a|b|c".split("|", 2) // ["a", "b"]
"a|b|c".split("|", 3) // ["a", "b", "c"]
"a|b|c".split("|", 4) // ["a", "b", "c"]

{% endhighlight %}

## Base64转码

在浏览器环境中，JavaScript原生提供btoa方法，将字符串或二进制值转化为Base64编码；以及atob方法，将Base64编码转化为原来的编码。

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
