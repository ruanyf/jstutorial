---
title: 对象的继承
layout: page
date: 2012-12-12
modifiedOn: 2012-12-12
category: oop
---

## 属性的继承

属性分成两种。一种是对象自身的属性，另一种是继承自原型的属性。

### 对象本身的属性

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

## 参考链接

- Dr. Axel Rauschmayer, [JavaScript properties: inheritance and enumerability](http://www.2ality.com/2011/07/js-properties.html)
