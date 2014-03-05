---
title: 对象
layout: page
category: grammar
date: 2012-12-12
modifiedOn: 2014-01-17
---

## 概述

对象（object）是JavaScript的核心概念，也是最重要的数据类型。这门语言中的所有数据都可以被视为对象。简单说，所谓对象，就是一种无序的数据集合，由若干个“键值对”（key-value）构成。

{% highlight javascript %}

var o = {
	p: "Hello World"
};

{% endhighlight %}

上面代码中，大括号就定义了一个对象，它被赋值给变量o。这个对象内部包含一个键值对（又称为“成员”），p是“键名”（成员的名称），字符串“Hello World”是“键值”（成员的值）。键名与键值之间用冒号分隔。如果对象内部包含多个键值对，每个键值对之间用逗号分隔。

键名加不加引号都可以，上面的代码也可以写成下面这样。

{% highlight javascript %}

var o = {
	"p": "Hello World"
};

{% endhighlight %}

但是，如果键名不符合标识名的条件（比如包含数字、字母、下划线以外的字符，或者第一个字符为数字），则必须加上引号。

{% highlight javascript %}

var o = {
	"1p": "Hello World",
	"h w": "Hello World",
	"p+q": "Hello World"
};

{% endhighlight %}

上面对象的三个键名，都不符合标识名的条件，所以必须加上引号。由于对象是键值对的封装，所以可以把对象看成是一个容器，里面封装了多个成员，上面的对象就包含了三个成员。

对象的每一个“键名”又称为“属性”（property），它的“键值”可以是任何数据类型。如果一个属性的值为函数，通常把这个属性称为“方法”，它可以像函数那样调用。

{% highlight javascript %}

var o = {
	p: function(x) {return 2*x;}
};

o.p(1)
// 2

{% endhighlight %}

上面的对象就有一个方法p，它就是一个函数。

对象的属性之间用逗号分隔，ECMAScript 5规定最后一个属性后面可以加逗号（trailing comma），也可以不加。

{% highlight javascript %}

var o = {
    p: 123,
    m: function () { ... },
}

{% endhighlight %}

上面的代码中m属性后面的那个逗号，有或没有都不算错。但是，ECMAScript 3不允许添加逗号，所以如果要兼容老式浏览器（比如IE 8），那就不能加这个逗号。

### 生成方法

对象的生成方法，通常有三种方法。除了像上面那样直接使用大括号生成（{}），还可以用new命令生成一个Object对象的实例，或者使用Object.create方法生成。

{% highlight javascript %}

var o1 = {};
var o2 = new Object();
var o3 = Object.create(null);

{% endhighlight %}

上面三行语句是等价的。一般来说，第一种采用大括号的写法比较简洁，第二种采用构造函数的写法清晰地表示了意图，第三种写法一般用在需要对象继承的场合。本书主要采用第一种写法，关于第二种写法请参考《标准库》一章的Object对象章节，第三种写法请参考《面向对象编程》一章的对象继承章节。

### 读取属性

读取对象的属性，有两种方法，一种是使用点运算符，还有一种是使用方括号运算符。

{% highlight javascript %}

var o = {
	p: "Hello World"
};

o.p // "Hello World"
o["p"] // "Hello World"

{% endhighlight %}

上面代码分别采用点运算符和方括号运算符，读取属性p。请注意，如果使用方括号运算符，键名必须放在引号里面，否则会被当作变量处理。

{% highlight javascript %}

var o = {
	p: "Hello World"
};

o[p]
// undefined

{% endhighlight %}

上面代码中的o[p]的值之所以是undefined，是因为p被当作变量，而这个变量是不存在的，所以等同于读取o[undefined]，也就是读取对象中一个没有定义的键。

{% highlight javascript %}

o[undefined] // undefined

{% endhighlight %}

上面代码说明，如果读取一个不存在的键，会返回undefined，而不是报错。可以利用这一点，来检查一个变量是否被声明。

{% highlight javascript %}

// 报错
if(a) {
	a += 1;
}
// ReferenceError: a is not defined	

// 不报错
if(window.a) {
	a += 1;
}

{% endhighlight %}

上面的第二种写法之所以不报错，是因为在浏览器环境，所有全局变量都是window对象的成员。window.a的含义就是读取window对象的a键，如果该键不存在，就返回undefined，而不会报错。需要注意的是，第二种写法有漏洞，如果a键的布尔值等于false（比如包含一个空字符串），则无法起到检查变量是否声明的作用。正确的写法请看下面的“in运算符”一节。

{% highlight javascript %}

if('a' in window) {
	a += 1;
}

{% endhighlight %}

点运算符和方括号运算符，不仅可以用来读取值，还可以用来赋值。

{% highlight javascript %}

o.p = "abc";
o["p"] = "abc";

{% endhighlight %}

上面代码分别使用点运算符和方括号运算符，对属性p赋值。

查看一个对象本身的所有属性，可以使用Object.keys方法。

{% highlight javascript %}

var o = {
	key1: 1,
	key2: 2
};

Object.keys(o);
// ["key1", "key2"]

{% endhighlight %}

### 属性的增加与删除

JavaScript允许属性的“后绑定”，也就是说，你可以在任意时刻新增属性，没必要在定义对象的时候，就定义好属性。

{% highlight javascript %}

var o = { p:1 };

// 等价于

var o = {};
o.p = 1;

{% endhighlight %}

删除一个属性，可以给这个属性赋值undefined。

{% highlight javascript %}

o.p = undefined;

{% endhighlight %}

也可以使用delete命令。

{% highlight javascript %}

var o = { p:1 };

delete o.p // true

o.p // undefined

{% endhighlight %}

麻烦的是，如果删除一个不存在的属性，delete不报错，而且返回true。

{% highlight javascript %}

var o = {};

delete o.p // true

{% endhighlight %}

上面代码表示，delete命令只能用来保证某个属性的值为undefined，而无法保证该属性是否真的存在。

只有一种情况，delete命令会返回false，那就是该属性存在，且不得删除。

{% highlight javascript %}

var o = Object.defineProperty({}, "p", {
        value: 123,
        configurable: false
});

o.p // 123
delete o.p // false

{% endhighlight %}

上面代码之中，o对象的p属性是不能删除的，所以delete命令返回false。关于对象属性模型的介绍，请看《标准库》一章的Object对象章节。

另外，需要注意的是，delete命令只能删除对象本身的属性，不能删除继承的属性（关于继承参见《面向对象编程》一节）。delete命令也不能删除var命令声明的变量，只能用来删除属性。

### 对象的引用

如果不同的变量名指向同一个对象，那么它们都是这个对象的引用，也就是说指向同一个内存地址。修改其中一个变量，会影响到其他所有变量。

{% highlight javascript %}

var o1 = {};
var o2 = o1;

o1.a = 1;
o2.a // 1

o2.b = 2;
o1.b // 2

{% endhighlight %}

上面代码之中，o1和o2指向同一个对象，因此为其中任何一个变量添加属性，另一个变量都可以读写该属性。

但是，这种引用只局限于对象，对于原始类型的数据则是传值引用，也就是说，都是值的拷贝。

{% highlight javascript %}

var x = 1;
var y = x;

x = 2;
y // 1

{% endhighlight %}

上面的代码中，当x的值发生变化后，y的值并不变，这就表示y和x并不是指向同一个内存地址。

### in运算符

in运算符用于检查对象是否包含某个属性（注意，检查的是键名，不是键值），如果包含就返回true。

{% highlight javascript %}

var o = { p: 1 };

'p' in o // true

{% endhighlight %}

如果某个属性值是undefined，in运算符也返回true。

{% highlight javascript %}

var o = { p: undefined };

'p' in o // true

{% endhighlight %}

该运算符对数组也适用。

{% highlight javascript %}

var a = ["hello", "world"];

0 in a // true
1 in a // true

{% endhighlight %}

上面代码表示，数字键0和1都在数组之中。

由于对象的键名都是字符串，因此也可以用字符串判断数组的成员。

{% highlight javascript %}

var a = ["hello", "world"];

'0' in a // true
'1' in a // true
'2' in a // false

{% endhighlight %}

在JavaScript语言中，所有全局变量都是顶层对象（浏览器环境的顶层对象为window）的属性，因此可以用in运算符判断一个全局变量是否存在。

{% highlight javascript %}

// 假设未声明变量x

if (x){ return 1; }
// 报错

if (window.x){ return 1; }
// 不正确的写法

if ('x' in window) { return 1; }
// 正确的写法

{% endhighlight %}

上面三种写法之中，如果x不存在，第一种写法会报错；如果x的值对应布尔值false（比如x等于空字符串），第二种写法无法得到正确结果；只有第三种写法，才是判断变量x是否存在的正确写法。

### for...in循环

for...in循环用来遍历一个对象的全部属性。

{% highlight javascript %}

var o = {a:1, b:2, c:3};

for (i in o){
	console.log(o[i]);
}
// 1
// 2
// 3

{% endhighlight %}

需要注意的是，for...in循环只能遍历对象本身的属性（更准确的说，是对象本身可enumberable的属性），而不能遍历继承自原型对象（prototype）的属性，详见《面向对象编程》一章。

## 类似数组的对象

在JavaScript中，有些对象被称为“类似数组的对象”（array-like object）。意思是，它们看上去很像数组，可以使用length属性，但是它们并不是数组，所以无法使用一些数组的方法。

下面就是一个类似数组的对象。

{% highlight javascript %}

var a = {
	0:'a',
	1:'b',
	2:'c',
	length:3
};

a[0] // 'a'
a[2] // 'c'
a.length // 3

{% endhighlight %}

上面代码的变量a是一个对象，但是看上去跟数组很像。所以只要有数字键和length属性，就是一个类似数组的对象。当然，变量a无法使用数组特有的一些方法，比如pop和push方法。而且，length属性不是动态值，不会随着成员的变化而变化。

{% highlight javascript %}

a[3] = 'd';

a.length // 3

{% endhighlight %}

上面代码为对象a添加了一个数字键，但是length属性没变。这就说明了a不是数组。

典型的类似数组的对象是函数的arguments对象，以及大多数DOM元素集，还有字符串。

## with语句

with语句的格式如下：

{% highlight javascript %}

with (object)
	statement

{% endhighlight %}

它的作用是操作同一个对象的多个属性时，提供一些书写的方便。

{% highlight javascript %}

o.p1 = 1;
o.p2 = 2;

// 等同于

with (o){
	p1 = 1;
	p2 = 2;
}
	
{% endhighlight %}

这里需要注意的是，在with区块内部依然是全局作用域。

{% highlight javascript %}

var o = {};

with (o){
	x = "abc";
}

o.x
// undefined

x
// "abc"
	
{% endhighlight %}

这意味着，如果你要在with语句内部，赋值对象某个属性，这个属性必须已经存在，否则你就是声明了一个全局变量。

{% highlight javascript %}

var o = {};

o.x = 1;

with (o){
	x = 2;
}

o.x
// 2
	
{% endhighlight %}

with语句有很大的弊病，主要问题是绑定对象不明确。

{% highlight javascript %}

with (o) {
	console.log(x);
}

{% endhighlight %}

单纯从上面的代码块，根本无法判断x到底是全局变量，还是o对象的一个属性。这非常不利于代码的除错和模块化。因此，建议不要使用with语句，可以考虑用一个临时变量代替with。

{% highlight javascript %}

with(o1.o2.o3) {
        console.log(p1 + p2);
    }

// 可以写成

var temp = o1.o2.o3;
console.log(temp.p1 + temp.p2);

{% endhighlight %}

## 参考链接

- Dr. Axel Rauschmayer，[Object properties in JavaScript](http://www.2ality.com/2012/10/javascript-properties.html)
- Lakshan Perera, [Revisiting JavaScript Objects](http://www.laktek.com/2012/12/29/revisiting-javascript-objects/)
- Angus Croll, [The Secret Life of JavaScript Primitives](http://javascriptweblog.wordpress.com/2010/09/27/the-secret-life-of-javascript-primitives/)i
- Dr. Axel Rauschmayer, [JavaScript’s with statement and why it’s deprecated](http://www.2ality.com/2011/06/with-statement.html)
