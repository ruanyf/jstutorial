---
title: Boolean 对象
layout: page
category: stdlib
date: 2013-04-30
modifiedOn: 2013-10-31
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

上面代码之所以得到true，是因为b1是一个对象，进行逻辑运算时，被自动转化成布尔值true。
