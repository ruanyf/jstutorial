---
title: 原始类型的包装对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-04-30
---

## 概述

在JavaScript中，“一切皆对象”，数组和函数本质上都是对象，就连三种原始类型的值——数字、字符串、布尔值——也有自己对应的包装对象。所谓“包装对象”，就是说可以通过原生的Number、String、Boolean对象，获得相应的原始类型的值。

以下分别用原始类型和包装对象两种形式，获取同一个值。

{% highlight javascript %}

var v = 123;
var v = new Number(123);

var v = "abc";
var v = new String("abc");

var v = true;
var v = new Boolean(true);

{% endhighlight %}

这两种定义值的方法，虽然都对应同一个值，但是值的类型不一样。包装对象的值属于Object类型，用typeof运算符就可以看出来。

{% highlight javascript %}

typeof "abc"
//  'string'
 
typeof new String("abc")
// 'object'

{% endhighlight %}

而且，包装对象的值都是Object对象的实例（即Object对象是它们的原型），原始类型则不是。（instanceof是判断一个对象是否为另一个对象的实例的运算符，详见《面向对象编程》一章。）

{% highlight javascript %}

"abc" instanceof Object
// false
 
new String("abc") instanceof Object
// true

{% endhighlight %}

### 包装对象的目的

JavaScript设计包装对象的最大目的，就是使得JavaScript可以使用同样一套关于“对象”的规范，描述所有的值。

首先，包装对象可以使用Object对象的原生方法，主要是valueOf和toString方法。

valueOf方法，返回该对象对应的原始类型的值。

{% highlight javascript %}

new Number(123).valueOf()
// 123

new String("abc").valueOf()
// "abc"

new Boolean("true").valueOf()
// true

{% endhighlight %}

toString方法，返回该对象的值的字符串形式。

{% highlight javascript %}

new Number(123).toString()
// "123"

new String("abc").toString()
// "abc"

new Boolean("true").toString()
// "true"

{% endhighlight %}

如果不加new关键字，直接调用包装对象，则相当于生成实例后再调用valueOf方法。

{% highlight javascript %}

Number(123)
// 123

String("abc")
// "abc"

Boolean(true)
// true

{% endhighlight %}

除了valueOf和toString方法，字符串对象还有length属性，返回字符串的长度。

{% highlight javascript %}

var v = new String("abc");

v.length
// 3

"abc".length
// 3

{% endhighlight %}

其次，三种包装对象还可以在原型上添加自定义方法（prototype的含义详见《面向对象编程》一章）。比如，我们可以新增一个double方法，使得字符串和数字翻倍。

{% highlight javascript %}

String.prototype.double = function (){

	return this.valueOf() + this.valueOf();

};

"abc".double()
// abcabc

Number.prototype.double = function (){

	return this.valueOf() + this.valueOf();

};

(123).double()
// 246

{% endhighlight %}

### 自动转化

可以直接在原始类型的值上使用包装对象的方法，这时原始类型的值会自动转化成包装对象。

{% highlight javascript %}

var v = 123;

v.valueOf()
// 123

{% endhighlight %}

如果使用的是未定义的方法或属性，原始类型不会自动转化。

{% highlight javascript %}

var v = 123;

v.x = 246;

v.x
// undefined

v.x = function (){};

v.x()
// 报错

{% endhighlight %}

如果包装对象与原始类型进行混合运算，包装对象会转化为原始类型（实际是调用自身的valueOf方法）。

{% highlight javascript %}

new Number(123) + 123
// 246

new String("abc") + "abc"
// "abcabc"

{% endhighlight %}

特别要注意的是，除了null以外，所有对象的布尔运算结果都是true，所以false的包装对象的布尔运算结果也是true。

{% highlight javascript %}

if (new Boolean(false)) {

    console.log("true"); 

}
// true

if (new Boolean(false).valueOf()) {

    console.log("true"); 

}
// 无输出

{% endhighlight %}

如果要获得一个变量对应的布尔值，规范的写法如下：

{% highlight javascript %}

var a = "";

new Boolean(a).valueOf()
//false

{% endhighlight %}

简洁的写法是：

{% highlight javascript %}

var a = "";

Boolean(a)
//false

{% endhighlight %}

还有更简洁的写法：

{% highlight javascript %}

var a = "";

!!a
//false

{% endhighlight %}
