---
title: 对象
layout: page
category: grammar
date: 2012-12-12
modifiedOn: 2013-08-28
---

## 概述

对象（object）是一种数据结构，由若干个“键值对”（key-value）构成。

{% highlight javascript %}

var o = {
	p: "Hello World"
};

{% endhighlight %}

上面代码中，大括号就代表一个对象，被赋值给变量o。这个对象内部包含一个键值对（又称为“成员”），p是“键名”（成员的名称），字符串“Hello World”是“键值”（成员的值）。键名与键值之间用逗号分隔。

键名加不加引号都可以，上面的代码也可以写成下面这样：

{% highlight javascript %}

var o = {
	"p": "Hello World"
};

{% endhighlight %}

但是如果键名不符合标识名的条件（即包含数字、字母、下划线以外的字符，且第一个字符不是数字），则必须加上引号。

{% highlight javascript %}

var o = {
	"1p": "Hello World",
	"h w": "Hello World",
	"p+q": "Hello World"
};

{% endhighlight %}

“键名”又称为“属性”（property），它的“键值”可以是任何数据类型。如果一个属性的值为函数，通常把这个属性称为“方法”。

{% highlight javascript %}

var o = {
	p: function(x) {return 2*x;}
};

o.p(1)
// 2

{% endhighlight %}

属性之间用逗号分隔，最后一个属性后面可以加逗号（trailing comma），也可以不加。

{% highlight javascript %}

   var obj = {
        foo: 123,
        bar: function () { ... },
    }

{% endhighlight %}

上面的代码中bar属性后面的那个逗号，有或没有都不算错。

### 生成方法

对象的生成方法，除了像上面那样直接使用{}，还可以用new Object()命令。

{% highlight javascript %}

var o = {};

// or

var o = new Object();

{% endhighlight %}

上面两行语句是等价的。

### 读取属性

读取一个属性，有两种方法，一种是使用点运算符，还有一种是使用方括号运算符。

{% highlight javascript %}

var o = {
	p: "Hello World"
};

// 点运算符
o.p
// "Hello World"

// 方括号运算符
o["p"]
// "Hello World"

{% endhighlight %}

可以看到，如果使用方括号，键名必须放在引号里面，否则会被当作变量处理。

{% highlight javascript %}

var o = {
	p: "Hello World"
};

o[p]
// undefined

{% endhighlight %}

上面代码中的o[p]的值之所以是undefined，是因为p被当作变量，而这个变量是不存在的，所以等同于读取o[undefined]，也就是读取对象中一个没有定义的键。

{% highlight javascript %}

o[undefined]
// undefined

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
// undefined

{% endhighlight %}

上面的第二种写法之所以不报错，是因为在浏览器环境，所有全局变量都是window对象的成员。window.a的含义就是读取window对象的a键，如果该键不存在，就返回undefined，而不会报错。

点运算符和方括号运算符，不仅可以用来读取值，还可以用来赋值。

{% highlight javascript %}

o.p = "abc";
o["p"] = "abc";

{% endhighlight %}

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

delete命令可以删除属性。

{% highlight javascript %}

var o = { p:1 };

delete o.p

o.p
// undefined

{% endhighlight %}

### 对象的引用

如果不同的变量名指向同一个对象，那么它们都是这个对象的引用，也就是说指向同一个内存地址。修改其中一个变量，会影响到其他所有变量。

{% highlight javascript %}

var v1 = {};

var v2 = v1;

v1.a = 1;

v2.a
// 1

{% endhighlight %}

这种引用只局限于对象，对于原始类型的数据，则是传值引用，也就是说，都是值的拷贝。

{% highlight javascript %}

var x = 1;

var y = x;

y
// 1

x = 2;
y
// 2

{% endhighlight %}

上面的代码中，当x的值发生变化后，y的值并不变，这就表示y和x并不是指向同一个内存地址。

## 类似数组的对象

在JavaScript中，有些对象被称为“类似数组的对象”（array-like object）。意思是，它们看上去很像数组，可以使用length属性，但是它们并不是数组，所以无法使用一些数组的方法。典型的例子是arguments对象，以及大多数DOM元素集。

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
