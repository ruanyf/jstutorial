---
title: 继承
layout: page
date: 2012-12-12
modifiedOn: 2012-12-14
category: oop
---

## 属性的继承

属性分成两种。一种是对象自身的原生属性，另一种是继承自原型的继承属性。

### 对象的原生属性

对象本身可枚举的属性，可以用Object.keys方法取得。

{% highlight javascript %}

Object.keys(obj)

{% endhighlight %}

对象本身的所有属性，不管是否可枚举，可以用下面的方法取得

{% highlight javascript %}

Object.getOwnPropertyNames(object)
object.hasOwnProperty(property)

{% endhighlight %}

### 对象的继承属性

对象所有可枚举的属性，可以用for-in循环得到。

{% highlight javascript %}

for (property in object)

{% endhighlight %}

不管是否可枚举，都可以用下面的方法判断，对象是否包括某个属性

{% highlight javascript %}

property in object

{% endhighlight %}

用法如下

{% highlight javascript %}

> "valueOf" in {}
true

> "toString" in {}
true

{% endhighlight %}

用Object.create方法创造的对象，它会继承所有原型对象的属性。

{% highlight javascript %}

> var proto = { p1: 123 };
> var o = Object.create(proto);
> o.hasOwnProperty("p1")
  false

{% endhighlight %}

所有的继承属性，默认都是不可枚举的。

{% highlight javascript %}

> var proto = { p1: 123 };
> var o = Object.create(proto);
> 'p1' in Object.keys(o)
  false

{% endhighlight %}

## 参考链接

- Dr. Axel Rauschmayer, [JavaScript properties: inheritance and enumerability](http://www.2ality.com/2011/07/js-properties.html)
