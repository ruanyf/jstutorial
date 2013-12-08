---
title: Boolean 对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-12-08
---

## 概述

Boolean用于生成布尔值的包装对象的实例。

{% highlight javascript %}

var b = new Boolean(true);

typeof b // "object"
b.valueOf() // true

{% endhighlight %}

上面代码的变量b是一个Boolean对象的实例，属性为对象，值为布尔值true。

不建议使用这种写法，直接对变量赋值更简单清晰。

{% highlight javascript %}

var b = true;

{% endhighlight %}

Boolean对象的实例在运算时，极易产生混淆。

{% highlight javascript %}

var b1 = new Boolean(false);

var b2 = true;

b1 && b2
//true

{% endhighlight %}

上面代码之所以得到true，是因为虽然b1表示false，但它是一个对象，进行逻辑运算时，被自动转化成布尔值true。

如果对原始类型的布尔值调用valueOf方法和toString方法，它会自动转为布尔值对象。

{% highlight javascript %}

true.valueOf() // true
true.toString() // true

{% endhighlight %}

上面代码所调用的两个方法，实际上来自Boolean.prototype对象。

{% highlight javascript %}

true.toString === Boolean.prototype.toString // true

{% endhighlight %}
