---
title: Regex对象
layout: page
category: stdlib
date: 2013-01-17
modifiedOn: 2013-08-21
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

RegExp方法还可以接受第二个参数，表示修饰符（详细解释见下文）。

{% highlight javascript %}

var regex = new RegExp("xyz", i);

{% endhighlight %}

这两种方法的区别在于，使用第一种方法时，正则对象在代码载入时（即编译时）生成，第二种方法正则对象在运行时生成。考虑到书写的便利和直观，实际应用基本上都采用第一种方法。

使用正则表达式也有两种方式，一种是使用正则对象RegExp的方法，另一种是使用字符串对象String的方法。

## 正则对象的使用方法

- test 测试字符串是否匹配给定模式
- exec 对字符串进行匹配
- compile 编译正则表达式

### 正则对象的属性

- ignoreCase	返回一个布尔值，表示是否设置了i修饰符，该属性只读。
- global	返回一个布尔值，表示是否设置了g修饰符，该属性只读。
- lastIndex 返回下一次开始搜索的位置。该属性可读写，但是只在设置了g修饰符时有意义。
- source	返回正则表达式的字符串形式（不包括反斜杠），该属性只读。
- multiline	返回一个布尔值，表示是否设置了m修饰符，该属性只读。

### test方法

test()方法用来验证字符串是否符合某个模式，返回true或false。

{% highlight javascript %}

/cat/.test('The cat sat on the mat.')
// true

{% endhighlight %}

### exec方法

exec()方法返回一个字符串中所有匹配结果。

如果没有匹配，该方法返回null，否则返回一个数组。该数组的长度是匹配成功的组数+1，其中数组的第一个元素是整个被匹配的字符串。此外，该数组还包含以下两个属性：

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

{% highlight javascript %}

"aaa".replace("a", "b")
// "baa"

"aaa".replace(/a/, "b")
// "baa"

"aaa".replace(/a/g, "b")
// "bbb"

{% endhighlight %}

replace方法接受两个参数，第一个是搜索模式，第二个是替换的内容。

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

"abc".replace("b", "[$`-$&-$']")
// "a[a-b-c]c"

{% endhighlight %}

第二个参数可以是一个函数，将匹配内容替换为函数返回值。

{% highlight javascript %}

"3 and 5".replace(/[0-9]+/g, function(match){
			return 2 * match; })
// "6 and 10"

{% endhighlight %}

replace方法还可以使用组匹配。

{% highlight javascript %}

"hello world".replace(/(\w+)\s(\w+)/,"$2 $1")
// "world hello"

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

如果不使用任何匹配规则，正则对象就是单纯的字面量匹配，比如/dog/就表示匹配dog。

- [xyz] 表示x、y、z之中任选一个匹配。

{% highlight javascript %}

/[abc]/.test("hello world")
// false

{% endhighlight %}

- [&#94;xyz] 表示除了x、y、z之外都可以匹配。

{% highlight javascript %}

/[^abc]/.test("hello world")
// true

{% endhighlight %}

- x|y 表示匹配x或y。

{% highlight javascript %}

/11|22/.test("911")
// true

{% endhighlight %}

- {} 表示模式的重复次数。{n}表示重复n次，{n,}表示至少重复n次，{n,m}表示重复不少于n次，不多于m次。

{% highlight javascript %}

/lo{2}k/.test("look")
// true

/lo{2,5}k/.test("looook")
// true

{% endhighlight %}

### 元字符和转义符

元字符表示在正则表达式中具有特殊涵义的字符，主要有以下这些：

- \- 出现在方括号（[]）之中时，表示范围，比如[a-z]，[0-9]，[A-Z]。

{% highlight javascript %}

/a-z/.test("b")
// false

/[a-z]/.test("b")
// true

{% endhighlight %}

- ^ 不在[]内时，表示一行的起首；在[]内时，表示其中的字符一个都不出现。
- $ 表示一行的行尾。
- . 表示除换行符以外的所有字符。
- ? 表示某个模式出现1次或0次，等同于{0, 1}。
- \* 表示某个模式出现0次或多次，等同于 {0,}。
- \+ 表示某个模式出现1次或多次，等同于 {1,}。

如果要匹配元字符本身，元字符前面要加上斜杠。比如要匹配加号，就要写成\\+。

{% highlight javascript %}

/1+1/.test("1+1")
// false

/1\+1/.test("1+1")
// true

{% endhighlight %}

正则模式中，需要用斜杠转义的，一共有12个字符：&#94;、.、[、$、(、)、|、*、+、?、{和 \。需要特别注意的是，如果使用RegExp方法生成正则对象，转义需要使用两个斜杠，因为字符串内部会先转义一次。

{% highlight javascript %}

(new RegExp("1\+1")).test("1+1")
// false

(new RegExp("1\\+1")).test("1+1")
// true

{% endhighlight %}

### 修饰符

修饰符（modifier）表示模式的附加规则，放在最尾部。

（1）修饰符g表示全局匹配，正则表达式将匹配全部符合条件的结果，主要用于搜索和替换。

匹配规则如果不加g，每次匹配时都是从头开始匹配。

{% highlight javascript %}

var regex = /b/;

var str = 'abba';

regex.test(str); // true
regex.test(str); // true
regex.test(str); // true

{% endhighlight %}

上面代码连续做了三次匹配，都返回true。

匹配规则如果加上g，每次匹配都是从上一次匹配成功处开始往后匹配。

{% highlight javascript %}

var regex = /b/g;

var str = 'abba';

regex.test(str); // true
regex.test(str); // true
regex.test(str); // false

{% endhighlight %}

因为字符串“abba”只有两个“b”，所以前两次匹配结果为true，第三次匹配结果为false。

（2）修饰符i表示忽略大小写。

{% highlight javascript %}

/abc/.test("ABC")
// false
 
/abc/i.test("ABC")
// true

{% endhighlight %}

(3) 修饰符m表示多行模式，&#94;和$会忽略换行符。

{% highlight javascript %}

/world$/.test("hello world\n")
// false
 
/world$/m.test("hello world\n")
// true

{% endhighlight %}

上面的代码中，字符串结尾处有一个换行符。如果不加修饰符m，匹配不成功；加上以后，换行符被省略，匹配成功。

### 预定义模式

预定义模式指的是某些常见模式的简写方式。

- \w 匹配任意的字母、数字和下划线，相当于[A-Za-z0-9_]。
- \W 除所有字幕、数字和下划线以外的字符，相当于/[&#94;A-Za-z0-9_]/ 。
- \s 匹配制表符、空格符、断行符、以及其他对应为空白的unicode字符。
- \S 匹配所有除了制表符、空格符、断行符、以及其他对应为空白的unicode字符以外的字符。

{% highlight javascript %}

/\s\w*/.exec("hello world")
// [" world"]

{% endhighlight %}

- \d 匹配0-9之间的任一数字。
- \D 匹配所有0-9以外的字符。
- \b 匹配词的边界。

{% highlight javascript %}

/\bworld/.test("hello-world")
// true

/\bworld/.test("hello world")
// true

/\bworld/.test("helloworld")
// false

{% endhighlight %}

- \B 匹配非词边界。

{% highlight javascript %}

/\Bworld/.test("hello-world")
// false

/\Bworld/.test("helloworld")
// true

{% endhighlight %}

### 特殊字符

- \cX 表示 Ctrl-X
- [\b] 匹配退格键(U+0008)，不要与\b混淆。
- \n 匹配换行键。
- \r 匹配回车键。
- \t 匹配制表符tab（U+0009）。
- \v 匹配垂直制表符（U+000B）。
- \f 匹配换页符（U+000C）。
- \0 匹配null字符（U+0000）。
- \xhh 匹配一个以两位十六进制数表示的字符。
- \uhhhh 匹配一个以四位十六进制数表示的unicode字符。

### 组匹配

正则表达式的括号表示分组匹配，括号中的模式可以用来捕获分组的内容。

{% highlight javascript %}

/(.)b(.)/.test("abc")

{% endhighlight %}

正则表达式/(.)b(.)/一共使用两个括号，第一个括号捕获a，第二个括号捕获c。

{% highlight javascript %}

var m = "abc".match(/(.)b(.)/);

m[1]
// "a"

m[2]
// "c"

{% endhighlight %}

在正则表达式内部，可以用\n引用括号匹配的内容，n是从1开始的自然数，表示对应顺序的括号。

{% highlight javascript %}

/(.)b(.)\1b\2/.test("abcabc")
// true

{% endhighlight %}

上面的代码中，\1表示前一个括号匹配的内容“a”，\2表示第二个括号匹配的内容“b”。

组匹配非常有用，下面是一个匹配网页标签的例子。

{% highlight javascript %}

var tagName = /<([^>]+)>[^<]*<\/\1>/;
tagName.exec("<b>bold</b>")[1]
// 'b'

{% endhighlight %}

- (?:x)称为非捕获组（Non-capturing group），表示不返回该组匹配的内容，即匹配的结果中不计入这个括号。

{% highlight javascript %}

var m = "abc".match(/(?:.)b(.)/);

m[1]
// "c"

{% endhighlight %}

上面代码中的模式，一共使用了两个括号。其中第一个括号是非捕获组，所以返回的第一个被捕获的组是第二个括号所匹配的“c”。

下面是用来分解网址的正则表达式。

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

{% highlight javascript %}

var m = "abc".match(/b(?=c)/);

m[0]
// "b"

m[1]
// undefined

{% endhighlight %}

上面的代码使用了先行断言，b在c前面所以被匹配，但是括号对应的c不会被返回。

- x(?!y)称为后行断言（Negative look-ahead），x只有不在y前面才匹配，y不会被计入返回结果。

{% highlight javascript %}

var m = "abd".match(/b(?!c)/);

m[0]
// "b"

m[1]
// undefined

{% endhighlight %}

上面的代码使用了后行断言，b不在c前面所以被匹配，而且括号对应的d不会被返回。

## 参考链接
- Dr. Axel Rauschmayer, [JavaScript: an overview of the regular expression API](http://www.2ality.com/2011/04/javascript-overview-of-regular.html)
- Mozilla Developer Network, [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
