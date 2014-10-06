---
title: RegExp对象
layout: page
category: stdlib
date: 2013-01-17
modifiedOn: 2014-01-06
---

## 概述

正则表达式（regular expression）是一种表达文本模式的方法，常常用作按照“给定模式”匹配文本的工具，比如给定一个Email地址的模式，然后用来确定一个字符串是否为Email地址。JavaScript的正则表达式体系是参照Perl 5建立的。

新建正则表达式有两种方法。一种是使用字面量，以斜杠表示开始和结束。

{% highlight javascript %}

var regex = /xyz/;

{% endhighlight %}

另一种是使用RegExp构造函数。

{% highlight javascript %}

var regex = new RegExp("xyz");

{% endhighlight %}

上面两种写法是等价的，都建立了一个内容为xyz的正则表达式对象。

RegExp构造函数还可以接受第二个参数，表示修饰符（详细解释见下文）。

{% highlight javascript %}

var regex = new RegExp("xyz", "i");
// 等价于
var regex = /xyz/i;

{% endhighlight %}

这两种写法在运行时有一个细微的区别。采用字面量的写法，正则对象在代码载入时（即编译时）生成；采用构造函数的方法，正则对象在代码运行时生成。考虑到书写的便利和直观，实际应用中，基本上都采用字面量的写法。

正则对象生成以后，有两种使用方式：

- 使用正则对象本身的方法，将字符串作为参数，比如regex.test(string)。

- 使用字符串对象的方法，将正则对象作为参数，比如string.match(regex)。

下面逐一介绍这两种使用方式。

## 正则对象的属性和方法

### 属性

正则对象的属性主要如下：

- **ignoreCase**：返回一个布尔值，表示是否设置了i修饰符，该属性只读。

- **global**：返回一个布尔值，表示是否设置了g修饰符，该属性只读。

- **lastIndex**：返回下一次开始搜索的位置。该属性可读写，但是只在设置了g修饰符时有意义。

- **source**：返回正则表达式的字符串形式（不包括反斜杠），该属性只读。

- **multiline**：返回一个布尔值，表示是否设置了m修饰符，该属性只读。

下面是属性应用的实例。

{% highlight javascript %}

var r = /abc/igm;

r.ignoreCase // true
r.global // true
r.multiline // true
r.lastIndex // 0
r.source // "abc"

{% endhighlight %}

### test方法

test方法返回布尔值，用来验证字符串是否符合某个模式。

{% highlight javascript %}

/cat/.test('cats and dogs') // true

{% endhighlight %}

上面代码验证参数字符串之中是否包含cat，结果返回true。

如果正则表达式带有g修饰符，则每一次test方法都从上一次结束的位置开始向后匹配。

{% highlight javascript %}

var r = /x/g;
var s = '_x_x';

r.lastIndex // 0
r.test(s) // true

r.lastIndex // 2
r.test(s) // true

r.lastIndex // 4
r.test(s) // false

{% endhighlight %}

上面代码的正则对象使用了g修饰符，表示要记录搜索位置。接着，三次使用test方法，每一次开始搜索的位置都是上一次匹配的后一个位置。

如果正则模式是一个空字符串，则匹配所有字符串。

{% highlight javascript %}

new RegExp("").test("abc")
// true

{% endhighlight %}

### exec方法

exec方法返回匹配结果。

{% highlight javascript %}

var s = '_x_x';
var r1 = /x/;
var r2 = /y/;

r1.exec(s) // ["x"]
r2.exec(s) // null

{% endhighlight %}

上面代码表示，如果匹配成功，exec方法返回一个数组，里面是匹配结果。如果匹配失败，返回null。

如果正则表示式包含圆括号，则返回的数组会包括多个元素。其中，第一个元素是整个匹配成功的结果，后面的元素就是圆括号对应的匹配成功的组，也就是说第二个元素就对应第一个括号，第三个元素对应第二个括号，以此类推。整个返回数组的length属性等于匹配成功的组数+1。

{% highlight javascript %}

var s = '_x_x';
var r = /_(x)/;

r.exec(s) // ["_x", "x"]

{% endhighlight %}

上面代码的exex方法，返回一个数组。第一个元素是整个匹配的结果，第二个元素是圆括号匹配的结果。

exec方法的返回数组还包含以下两个属性：

- **input**：整个原字符串。
- **index**：整个模式匹配成功的开始位置。

{% highlight javascript %}

var r = /a(b+)a/;

var arr = regex.exec("_abbba_aba_");

arr
// ["abbba", "bbb"]

arr.index
// 1

arr.input
// "_abbba_aba_"

{% endhighlight %}

上面代码中的index属性等于1，是因为从原字符串的第二个位置开始匹配成功。

如果正则表达式加上g修饰符，则可以使用多次exec方法，下一次搜索的位置从上一次匹配成功结束的位置开始。

{% highlight javascript %}

var r = /a(b+)a/g;

var a1 = r.exec("_abbba_aba_");
a1 // ["abbba", "bbb"]
a1.index // 1
r.lastIndex // 6

var a2 = r.exec("_abbba_aba_");
a2 // ["aba", "b"]
a2.index // 7
r.lastIndex // 10

var a3 = r.exec("_abbba_aba_");
a3 // null
a3.index // TypeError: Cannot read property 'index' of null
r.lastIndex // 0

var a4 = r.exec("_abbba_aba_");
a4 // ["abbba", "bbb"]
a4.index // 1
r.lastIndex // 6

{% endhighlight %}

上面代码连续用了四次exec方法，前三次都是从上一次匹配结束的位置向后匹配。当第三次匹配结束以后，整个字符串已经到达尾部，正则对象的lastIndex属性重置为0，意味着第四次匹配将从头开始。

利用g修饰符允许多次匹配的特点，可以用一个循环完成全部匹配。

{% highlight javascript %}

var r = /a(b+)a/g;

var s = "_abbba_aba_";

while(true) {
	var match = r.exec(s);
	if (!match) break;
	console.log(match[1]);
}
// bbb
// b

{% endhighlight %}

如果正则对象是一个空字符串，则exec方法会匹配成功，但返回的也是空字符串。

{% highlight javascript %}

var r1 = new RegExp("");
var a1 = r1.exec("abc");
a1 // [""]
a1.index // 0
r1.lastIndex // 0 

var r2 = new RegExp("()");
var a2 = r2.exec("abc");
a2 // ["", ""]
a2.index // 0
r2.lastIndex // 0

{% endhighlight %}

## 字符串对象的方法

字符串对象的方法之中，有4种与正则对象有关。

- **match**：返回匹配的子字符串。

- **search**：按照给定的正则规则进行搜索。

- **replace**：按照给定的正则规则进行替换。

- **split**：按照给定规则进行字符串分割。

下面逐一介绍。

### match方法

match方法对字符串进行正则匹配，返回匹配结果。

{% highlight javascript %}

var s = '_x_x';
var r1 = /x/;
var r2 = /y/;

s.match(r1) // ["x"]
s.match(r2) // null

{% endhighlight %}

从上面代码可以看到，字符串的match方法与正则对象的exec方法非常类似：匹配成功返回一个数组，匹配失败返回null。

如果正则表达式带有g修饰符，则该方法与正则对象的exec方法行为不同，会返回所有匹配成功的结果。

{% highlight javascript %}

var s = "abba";
var r = /a/g;

s.match(r) // ["a", "a"]
r.exec(s) // ["a"]

{% endhighlight %}

### search方法

search方法返回第一个满足条件的匹配结果在整个字符串中的位置。如果没有任何匹配，则返回-1。该方法会忽略g参数。

{% highlight javascript %}

'_x_x'.search(/x/)
// 1

{% endhighlight %}

### replace方法

replace方法可以替换匹配的值，它接受两个参数，第一个是搜索模式，第二个是替换的内容。

{% highlight javascript %}

str.replace(search, replacement)

{% endhighlight %}

搜索模式如果不加g修饰符，就替换第一个匹配成功的值，否则替换所有匹配成功的值。

{% highlight javascript %}

"aaa".replace("a", "b")
// "baa"

"aaa".replace(/a/, "b")
// "baa"

"aaa".replace(/a/g, "b")
// "bbb"

{% endhighlight %}

replace方法的第二个参数可以使用美元符号$，用来指代所替换的内容。

- $& 指代匹配的子字符串。
- $` 指代匹配结果前面的文本。
- $' 指代匹配结果后面的文本。
- $n 指代匹配成功的第n组内容，n从1开始计数。
- $$ 指代美元符号$。

{% highlight javascript %}

"abc".replace("b", "[$`-$&-$']")
// "a[a-b-c]c"

"hello world".replace(/(\w+)\s(\w+)/,"$2 $1")
// "world hello"

{% endhighlight %}

第二个参数还可以是一个函数，将匹配内容替换为函数返回值。

{% highlight javascript %}

"3 and 5".replace(/[0-9]+/g, function(match){
			return 2 * match; })
// "6 and 10"

var a = "The quick brown fox jumped over the lazy dog.";
var pattern = /quick|brown|lazy/ig;
a.replace( pattern, function replacer(match){
    return match.toUpperCase();
} );
// The QUICK BROWN fox jumped over the LAZY dog.

{% endhighlight %}

作为replace方法第二个参数的替换函数，可以接受多个参数。它的第一个参数是捕捉到的内容，第二个参数是捕捉到的组匹配（有多少个组匹配，就有多少个对应的参数）。此外，最后还可以添加两个参数，倒数第二个参数是捕捉到的内容在整个字符串中的位置（比如从第五个位置开始），最后一个参数是原字符串。下面是一个网页模板替换的例子。

```javascript

var prices = {
    "pr_1": "$1.99",
    "pr_2": "$9.99",
    "pr_3": "$5.00"
};

var template = ".."; // some ecommerce page template

template.replace(
    /(<span id=")(.*?)(">)(<\/span>)/g,
    function(match,$1,$2,$3,$4){
        return $1 + $2 + $3 + prices[$2] + $4;
    }
);

```

上面代码的捕捉模式中，有四个括号，所以会产生四个组匹配，在匹配函数中用$1到$4表示。匹配函数的作用是将价格插入模板中。

### split方法

split方法按照正则规则分割字符串，返回一个由分割后的各个部分组成的数组。

{% highlight javascript %}

str.split(separator, [limit])

{% endhighlight %}

该方法接受两个参数，第一个参数是分隔规则，第二个参数是返回数组的最大成员数。

{% highlight javascript %}

'a,  b,c, d'.split(',') 
// [ 'a', '  b', 'c', ' d' ]

'a,  b,c, d'.split(/, */)
// [ 'a', 'b', 'c', 'd' ]

'a,  b,c, d'.split(/, */, 2)
[ 'a', 'b' ]

{% endhighlight %}

上面代码使用正则表达式，去除了子字符串的逗号前面的空格。

{% highlight javascript %}

"aaa*a*".split(/a*/)
// [ '', '*', '*' ]

"aaa**a*".split(/a*/)
// ["", "*", "*", "*"]

{% endhighlight %}

上面代码的分割规则是出现0次或多次的a，所以第一个分隔符是“aaa”，第二个分割符是“a”，将整个字符串分成三个部分。出现0次的a，意味着只要没有a就可以分割，实际上就是按字符分割。

如果正则表达式带有括号，则括号匹配的部分也会作为数组成员返回。

{% highlight javascript %}

"aaa*a*".split(/(a*)/)
// [ '', 'aaa', '*', 'a', '*' ]

{% endhighlight %}

上面代码的正则表达式使用了括号，第一个组匹配是“aaa”，第二个组匹配是“a”，它们都作为数组成员返回。

下面是另一个组匹配的例子。

{% highlight javascript %}

'a,  b  ,  '.split(/(,)/)
// ["a", ",", "  b  ", ",", "  "]

'a,  b  ,  '.split(/ *(,) */)
// ["a", ",", "b", ",", ""]

{% endhighlight %}

## 匹配规则

正则表达式对字符串的匹配有很复杂的规则。下面一一介绍这些规则。

### 字面量字符和元字符

大部分字符在正则表达式中，就是字面的含义，比如/a/匹配a，/b/匹配b。它们都叫做“字面量字符”（literal characters）。

{% highlight javascript %}

/dog/.test("old dog") // true

{% endhighlight %}

上面代码中正则表达式的dog，就是字面量字符，所以/dog/匹配old dog，因为它就表示d、o、g三个字母连在一起。

除了字面量字符以外，还有一部分字符有特殊含义，不代表字面的意思。它们叫做“元字符”（metacharacters），主要有以下几个。

**（1）点字符（.)**

点字符（.）匹配除回车（\r）、换行(\n) 、行分隔符（\u2028）和段分隔符（\u2029）以外的所有字符。

{% highlight javascript %}

/c.t/

{% endhighlight %}

上面代码中的c.t匹配c和t之间包含任意一个字符的情况，只要这三个字符在同一行，比如cat、c2t、c-t等等，但是不匹配coot。

**（2）位置字符**

位置字符用来提示字符所处的位置，主要有两个字符。

- ^ 表示字符串的起首。
- $ 表示字符串的行尾。

{% highlight javascript %}

/^test/.test("test123") // true
/test$/.test("new test") // true
/^test$/.test("test") // true
/^test$/.test("test test") // false

{% endhighlight %}

**（3）选择符（|）**

竖线符号（|）在正则表达式中表示“或关系”（OR），即 cat|dog 表示匹配cat或dog。

{% highlight javascript %}

/11|22/.test("911") // true

{% endhighlight %}

### 字符类

字符类（class）表示有一系列字符可供选择，只要匹配其中一个就可以了。所有可供选择的字符都放在方括号内，比如[xyz] 表示x、y、z之中任选一个匹配。

{% highlight javascript %}

/[abc]/.test("hello world") // false
/[abc]/.test("apple") // true

{% endhighlight %}

上面代码表示，字符串hello world不包含abc这三个字母中的任一个，而字符串apple包含字母a。

有两个字符在字符类中有特殊含义。

**（1）脱字符（&#94;）**

如果方括号内的第一个字符是[&#94;]，则表示除了字符类之中的字符，其他字符都可以匹配。比如，[&#94;xyz] 表示除了x、y、z之外都可以匹配。

{% highlight javascript %}

/[^abc]/.test("hello world") // true
/[^abc]/.test("bbc") // false

{% endhighlight %}

上面代码表示，字符串hello world不包含字母abc中的任一个，所以返回true；字符串bbc不包含abc以外的字母，所以返回false。

> 注意，脱字符只有在字符类的第一个位置才有特殊含义，否则就是字面含义。

**（2）连字符（-）**

某些情况下，对于连续序列的字符，连字符（-）用来提供简写形式，表示字符的连续范围。比如，[abc]可以写成[a-c]，[0123456789]可以写成[0-9]，同理[A-Z]表示26个大写字母。

{% highlight javascript %}

/a-z/.test("b") // false
/[a-z]/.test("b") // true

{% endhighlight %}

上面代码中，当连字号（dash）不出现在方括号之中，就不具备简写的作用，只代表字面的含义，所以不匹配字符b。只有当连字号用在方括号之中，才表示连续的字符序列。

以下都是合法的字符类简写形式。

{% highlight javascript %}

[0-9.,]
[0-9a-fA-F]
[a-zA-Z0-9-]
[1-31]

{% endhighlight %}

上面代码中最后一个字符类[1-31]，不代表1到31，只代表1到3。

> 注意，字符类的连字符必须在头尾两个字符中间，才有特殊含义，否则就是字面含义。

### 重复类

{} 表示模式的重复次数。{n}表示重复n次，{n,}表示至少重复n次，{n,m}表示重复不少于n次，不多于m次。

{% highlight javascript %}

/lo{2}k/.test("look") // true
/lo{2,5}k/.test("looook") // true

{% endhighlight %}

### 量词符

- ? 表示某个模式出现1次或0次，等同于{0, 1}。
- \* 表示某个模式出现0次或多次，等同于 {0,}。
- \+ 表示某个模式出现1次或多次，等同于 {1,}。

{% highlight javascript %}

/t?est/.test("test") // true
/t?est/.test("est") // true

/t+est/.test("test") // true
/t+est/.test("ttest") // true
/t+est/.test("tttest") // true
/t+est/.test("est") // false

/t*est/.test("test") // true
/t*est/.test("ttest") // true
/t*est/.test("tttest") // true
/t*est/.test("est") // true

{% endhighlight %}

以上三个量词符，默认情况下的匹配规则都是贪婪模式，即最大可能匹配，直到下一个字符不满足匹配规则为止。比如，对于字符串“aaa”来说，/a+/将会匹配“aaa”，而不会匹配“aa”。为了将贪婪模式改为非贪婪模式，可以在量词符后面加一个问号，/a+?/将会只匹配“a”。

### 转义符

正则表达式中那些有特殊含义的字符，如果要匹配它们本身，就需要在它们前面要加上反斜杠。比如要匹配加号，就要写成\\+。

{% highlight javascript %}

/1+1/.test("1+1")
// false

/1\+1/.test("1+1")
// true

{% endhighlight %}

正则模式中，需要用斜杠转义的，一共有12个字符：&#94;、.、[、$、(、)、|、*、+、?、{和 \。需要特别注意的是，如果使用RegExp方法生成正则对象，转义需要使用两个斜杠，因为字符串内部会先转义一次。

{% highlight javascript %}

(new RegExp("1\+1")).test("1+1") // false
(new RegExp("1\\+1")).test("1+1") // true

{% endhighlight %}

### 修饰符

修饰符（modifier）表示模式的附加规则，放在正则模式的最尾部。

**（1）g修饰符**

默认情况下，第一次匹配成功后，正则对象就停止向下匹配了。g修饰符表示全局匹配（global），加上它以后，正则对象将匹配全部符合条件的结果，主要用于搜索和替换。

{% highlight javascript %}

var regex = /b/;

var str = 'abba';

regex.test(str); // true
regex.test(str); // true
regex.test(str); // true

{% endhighlight %}

上面代码连续做了三次匹配，都返回true。它的含义是如果不加g修饰符，每次匹配时都是从字符串头部开始匹配。

{% highlight javascript %}

var regex = /b/g;

var str = 'abba';

regex.test(str); // true
regex.test(str); // true
regex.test(str); // false

{% endhighlight %}

上面代码中，因为字符串“abba”只有两个“b”，所以前两次匹配结果为true，第三次匹配结果为false。它的含义是加上g修饰符以后，每次匹配都是从上一次匹配成功处开始往后匹配。

**（2）i修饰符**

默认情况下，正则对象区分字母的大小写，加上i修饰符以后表示忽略大小写（ignorecase）。

{% highlight javascript %}

/abc/.test("ABC") // false
/abc/i.test("ABC") // true

{% endhighlight %}

上面代码表示，加了i修饰符以后，不考虑大小写，所以模式abc匹配字符串ABC。

**（3）m修饰符**

有时，字符串的头部或尾部可能会有换行符。默认情况下，正则对象会将换行符当作算入字符串的开头或结尾。m修饰符表示多行模式（multiline），加上它以后，正则对象会忽略字符串头部或尾部的换行符，即&#94;和$会忽略换行符。

{% highlight javascript %}

/world$/.test("hello world\n") // false
/world$/m.test("hello world\n") // true

{% endhighlight %}

上面的代码中，字符串结尾处有一个换行符。如果不加m修饰符，匹配不成功，因为字符串的结尾不是world；加上以后，换行符被省略，匹配成功。

修饰符可以多个一起使用。

{% highlight javascript %}

var regex = /test/ig;

{% endhighlight %}

### 预定义模式

预定义模式指的是某些常见模式的简写方式。

- \d 匹配0-9之间的任一数字，相当于[0-9]。
- \D 匹配所有0-9以外的字符，相当于[^0-9]。
- \w 匹配任意的字母、数字和下划线，相当于[A-Za-z0-9_]。
- \W 除所有字母、数字和下划线以外的字符，相当于/[&#94;A-Za-z0-9_]/ 。
- \s 匹配空格（包括制表符、空格符、断行符等），相等于[\t\r\n\v\f]。
- \S 匹配非空格的字符，相当于[&#94;\t\r\n\v\f]。
- \b 匹配词的边界。
- \B 匹配非词边界，即在词的内部。

{% highlight javascript %}

/\s\w*/.exec("hello world") // [" world"]

/\bworld/.test("hello world") // true
/\bworld/.test("hello-world") // true
/\bworld/.test("helloworld") // false

/\Bworld/.test("hello-world") // false
/\Bworld/.test("helloworld") // true

{% endhighlight %}

### 特殊字符

正则对象对一些不能打印的特殊字符，提供了表达形式。

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

**（1）概述**

正则表达式的括号表示分组匹配，括号中的模式可以用来捕获分组的内容。

{% highlight javascript %}

var m = "abcabc".match(/(.)b(.)/);
m 
// ["abc", "a", "c"]

{% endhighlight %}

上面代码中，正则表达式/(.)b(.)/一共使用两个括号，第一个括号捕获a，第二个括号捕获c。

注意，使用组匹配时，不宜同时使用g修饰符，否则match方法不会捕获分组的内容。

{% highlight javascript %}

var m = "abcabc".match(/(.)b(.)/g);
m
// ["abc", "abc"]

{% endhighlight %}

上面代码使用带g修饰符的正则表达式，结果match方法只捕获了匹配整个表达式的部分。

在正则表达式内部，可以用\n引用括号匹配的内容，n是从1开始的自然数，表示对应顺序的括号。

{% highlight javascript %}

/(.)b(.)\1b\2/.test("abcabc")
// true

{% endhighlight %}

上面的代码中，\1表示前一个括号匹配的内容（即“a”），\2表示第二个括号匹配的内容（即“b”）。

组匹配非常有用，下面是一个匹配网页标签的例子。

{% highlight javascript %}

var tagName = /<([^>]+)>[^<]*<\/\1>/;
tagName.exec("<b>bold</b>")[1]
// 'b'

{% endhighlight %}

**（2）非捕获组**

(?:x)称为非捕获组（Non-capturing group），表示不返回该组匹配的内容，即匹配的结果中不计入这个括号。

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

**（3）先行断言**

x(?=y)称为先行断言（Positive look-ahead），x只有在y前面才匹配，y不会被计入返回结果。

{% highlight javascript %}

var m = "abc".match(/b(?=c)/);
m 
// "b"

{% endhighlight %}

上面的代码使用了先行断言，b在c前面所以被匹配，但是括号对应的c不会被返回。

**（4）后行断言**

x(?!y)称为后行断言（Negative look-ahead），x只有不在y前面才匹配，y不会被计入返回结果。

{% highlight javascript %}

var m = "abd".match(/b(?!c)/);
m
// ["b"]

{% endhighlight %}

上面的代码使用了后行断言，b不在c前面所以被匹配，而且括号对应的d不会被返回。

## 参考链接
- Axel Rauschmayer, [JavaScript: an overview of the regular expression API](http://www.2ality.com/2011/04/javascript-overview-of-regular.html)
- Mozilla Developer Network, [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- Axel Rauschmayer, [The flag /g of JavaScript’s regular expressions](http://www.2ality.com/2013/08/regexp-g.html)
- Sam Hughes, [Learn regular expressions in about 55 minutes](http://qntm.org/files/re/re.html)
