---
title: Regex对象
layout: page
category: stdlib
date: 2013-01-17
modifiedOn: 2013-08-07
---

## 概述

正则表达式是按照给定模式匹配文本的工具，比如确定一个字符串是否为email地址。JavaScript的正则体系是参照Perl 5建立的。

新建正则表达式有两种方法。

一种是使用字面量，以两个反斜杠表示开始和结束。

{% highlight javascript %}

var regex = /xyz/;

{% endhighlight %}

另一种是使用正则对象的构造函数。

{% highlight javascript %}

var regex = new RegExp("xyz");

{% endhighlight %}

这两种方法的区别在于，第一种方法正则对象在代码载入时生成，第二种方法正则对象在运行时生成。

使用正则表达式也有两种方式，一种是使用正则对象，另一种是使用字符串对象。

## 正则对象的使用方法

- test 测试字符串是否匹配给定模式
- exec 对字符串进行匹配
- compile 编译正则表达式

### test方法

Regex.test(Sting)用来验证字符串是否符合某个模式，返回true或false。

{% highlight javascript %}

var s = 'The cat sat on the mat.';

if(/cat/.test(s)){
    alert('We found a cat!');
} 

{% endhighlight %}

### exec方法

该方法返回一个字符串中所有匹配结果。

该方法有以下属性：

- global： g修饰符是否设置。
- ignoreCase： i修饰符是否设置。
- multiline: m修饰符是否设置。
- source： 被匹配的字符串原文。
- lastIndex： 下一次搜索的起始位置。

如果没有匹配，该方法返回null，否则返回一个数组。该数组的长度是匹配的组数+1，其中数组的第一个元素是整个被匹配的字符串。此外，该数组还包含以下两个属性：

- input：被匹配的字符串。
- index：匹配成功的位置。

{% highlight javascript %}

var regex = /a(b+)a/;

regex.exec("_abbba_aba_")
// [ 'abbba'
//    , 'bbb'
//    , index: 1
//    , input: '_abbba_aba_'
// ]

regex.lastIndex
// 0

{% endhighlight %}

如果加上g修饰符，则下一次搜索的位置从上一次匹配成功结束的位置开始。

{% highlight javascript %}

var regex = /a(b+)a/g;

regex.exec("_abbba_aba_")
// [ 'abbba'
//    , 'bbb'
//    , index: 1
//    , input: '_abbba_aba_'
// ]

regex.lastIndex
// 6

regex.exec("_abbba_aba_")
//    [ 'aba'
//    , 'b'
//    , index: 7
//    , input: '_abbba_aba_'
//    ]

regex.lastIndex
// 10

regex.exec("_abbba_aba_")
// null

{% endhighlight %}

利用g修饰符允许多次匹配的特点，可以用一个循环完成全部匹配。

{% highlight javascript %}

var regex = /a(b+)a/g;

var str = "_abbba_aba_";

while(true) {
        var match = regex.exec(str);
        if (!match) break;
        console.log(match[1]);
}

// bbb
// b

{% endhighlight %}

## 字符串对象的使用方法

### match

match 方法对字符串进行正则匹配，返回匹配结果。

如果正则表达式没有g修饰符，则该方法返回结果与正则对象的exec方法相同；如果有g修饰符，则返回一个数组，包含所有匹配成功的子字符串。

{% highlight javascript %}

'abba'.match(/a/)
// [ 'a', index: 0, input: 'abba' ]

'abba'.match(/a/g)
// [ 'a', 'a' ]

{% endhighlight %}

### search

search 方法返回第一个满足匹配条件的字符在整个字符串中的位置。如果没有任何匹配，则返回-1。该方法会忽略g参数。

### replace

replace 方法可以替换匹配的值。如果不加g修饰符，就替换第一个匹配成功的值，否则替换所有匹配成功的值。

它接受两个参数，第一个是搜索模式，第二个是替换的内容。

{% highlight javascript %}

str.replace(search, replacement)

{% endhighlight %}

第二个参数可以使用美元符号$，用来指代所替换的内容。

- $& 替换为整个匹配。
- $` 替换为匹配前的文本。
- $' 替换为匹配后的文本。
- $n 替换为匹配成功的第n组内容，n从1开始计数。
- $$ 替换为美元符号$。

{% highlight javascript %}

"a1b_c1d".replace("1", "[$`-$&-$']")
// 'a[a-1-b_c1d]b_c1d'

"a1b_c1d".replace(/1/, "[$`-$&-$']")
// 'a[a-1-b_c1d]b_c1d'

"a1b_c1d".replace(/1/g, "[$`-$&-$']")
// 'a[a-1-b_c1d]b_c[a1b_c-1-d]d'

{% endhighlight %}

第二个参数可以是一个函数，将匹配内容替换为函数返回值。

{% highlight javascript %}

"3 and 5".replace(/[0-9]+/g, function(match){
			return 2 * match; })
// "6 and 10"

{% endhighlight %}

### split

按照匹配规则，将字符串分成数组。

它接受两个参数。

{% highlight javascript %}

str.split(separator, [limit])

{% endhighlight %}

上式的separator表示分隔符的规则（不一定为正则表示式），limit表示返回数组的成员数量，不是必需的。

{% highlight javascript %}

"aaa*a*".split("a*")
// [ 'aa', '', '' ]
"aaa*a*".split(/a*/)
// [ '', '*', '*' ]
"aaa*a*".split(/(a*)/)
// [ '', 'aaa', '*', 'a', '*' ]

{% endhighlight %}

## 匹配规则

- [...] 表示任选其中一个字符
- [&#94;...] 表示选择不在其中的任一个字符
- (...) 表示模式的分组
- | 表示任选一个模式

{% highlight javascript %}

/(cat|sat|mat)/

{% endhighlight %}

- {} 表示模式的重复次数。{n}表示重复n次，{n,}表示至少重复n次，{n,m}表示重复不少于n次，不多于m次。

{% highlight javascript %}

/lo{2}k/

/lo{2,5}k/

{% endhighlight %}

- \- 表示范围，比如a-z，0-9，A-Z。
- ^ 不在[]内时，表示一行的起首；在[]内时，表示其中的字符一个都不出现。
- $ 表示一行的行尾。
- . 表示除换行符以外的所有字符。
- ? 表示出现1次或0次，等同于{0, 1}。
- \* 表示出现0次或多次，等同于 {0,}。
- \+ 表示出现1次或多次，等同于 {1,}。

### 修饰符

修饰符（modifier）表示模式的附加规则，放在最尾部。

- g 表示全局匹配，正则表达式将匹配全部符合条件的结果，主要用于搜索和替换。

{% highlight javascript %}

var regex = /b/;

var str = 'abba';

regex.test(str)
// true

regex.test(str)
// true

regex.test(str)
// true

{% endhighlight %}

如果不加g，每次匹配时都是从头开始匹配。

{% highlight javascript %}

var regex = /b/g;

var str = 'abba';

regex.test(str)
// true

regex.test(str)
// true

regex.test(str)
// false

{% endhighlight %}

如果加上g，则是从上一次匹配成功处开始往后匹配，所以“abba”只能匹配成功两次b。

- i 表示忽略大小写。

{% highlight javascript %}

 /abc/.test("ABC")
 // false
 
 /abc/i.test("ABC")
 // true

{% endhighlight %}

- m 表示多行模式，^和$会忽略换行符。
- s 表示单行模式，.匹配任意字符，包括换行符在内。

### 预定义模式

预定义模式指的是某些常见模式的简写方式。

- \w 匹配任意的字母、数字和下划线。
- \W 除所有字幕、数字和下划线以外的字符。
- \s 匹配制表符、空格符和断行符。
- \S 匹配所有制表符、空格符和断行符以外的字符。
- \d 匹配任意数字0-9。
- \D 匹配所有0-9以外的字符。
- \b 匹配退格符。

### 特殊字符和转义符

- \cX 表示 Ctrl-X
- \n 表示换行
- \r 表示回车
- \t 制表符
- \f 换页符
- \x# 匹配十六进制数

转义符（/）表示后面的字符不具有特殊含义。

{% highlight javascript %}

/\$([a-z]+)/

{% endhighlight %}

### 组匹配

括号中的模式表示分组匹配，可以用\n来引用括号匹配的内容，其中n是从1开始的自然数，表示第几个括号。

{% highlight javascript %}

/(a+)b\1/.test("aaba")
//  true

/^(a+)b\1/.test("aaba")
// false

var tagName = /<([^>]+)>[^<]*<\/\1>/;
tagName.exec("<b>bold</b>")[1]
// 'b'

{% endhighlight %}

- (?:x)称为非捕获组（Non-capturing group），表示不返回该组匹配的内容，即匹配的结果中不计入这个括号。

{% highlight javascript %}

var url = /(http|ftp):\/\/([^/\r\n]+)(\/[^\r\n]*)?/;

url.exec("http://google.com/");
// ["http://google.com/", "http", "google.com", "/"]

var url = /(?:http|ftp):\/\/([^/\r\n]+)(\/[^\r\n]*)?/;

url.exec("http://google.com/");
// ["http://google.com/", "google.com", "/"]

{% endhighlight %}

上面的代码中，前一个正则表达式是正常匹配，第一个括号返回网络协议；后一个正则表达式是非捕获匹配，返回结果中不包括网络协议。

- x(?=y)称为先行断言（Positive look-ahead），x只有在y前面才匹配，y不会被计入返回结果。
- x(?!y)称为后行断言（Negative look-ahead），x只有不在y前面才匹配，y不会被计入返回结果。

## 参考链接
- Dr. Axel Rauschmayer, [JavaScript: an overview of the regular expression API](http://www.2ality.com/2011/04/javascript-overview-of-regular.html)
