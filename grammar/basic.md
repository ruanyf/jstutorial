---
title: 语法概述
layout: page
category: grammar
date: 2012-12-14
modifiedOn: 2013-01-04
---

## 数据类型

Javascript的数据类型分成两大类，原始类型（primitive type）和对象类型（object）。

原始类型分成三种。

- 数值（number）
- 字符串（string）
- 布尔值（boolean）

对象类型也分成三种。

- 对象（object）
- 数组（array）
- 函数（function）

通常，变量的值就是上面六类数据类型中的一种。但是，Javascript还定义一个特殊的数据类型undefined和一个特殊的值null。

如果，一个变量只是被声明，没有被赋值，那么它的值默认就是undefined，表示“未定义”。

{% highlight javascript %}

var v;

v
// undefined

{% endhighlight %}

null是对象的一种，表示空对象。所以null不是一种单独的数据类型，而是包含在对象类型之中的一种特殊值。

{% highlight javascript %}

var v = null;

v
// null

{% endhighlight %}


## typeof 运算符

该运算符返回一个值的数据类型，可能有以下结果：

- 如果值的类型是undefined: 返回undefined。

{% highlight javascript %}

> typeof undefined
  "undefined"

{% endhighlight %}

- 如果值的类型是null，返回object。

{% highlight javascript %}

> typeof null
  "object"

{% endhighlight %}

- 如果值的类型是布尔值，返回boolean。

{% highlight javascript %}

> typeof false
  "boolean"

{% endhighlight %}

- 如果值的类型是数值，返回number。

{% highlight javascript %}

> typeof 123
  "number"

{% endhighlight %}

- 如果值的类型是字符串，返回string。

{% highlight javascript %}

> typeof "123"
  "string"

{% endhighlight %}

- 如果值的类型是函数，返回function。

{% highlight javascript %}

> typeof print
  "function"

{% endhighlight %}

- 如果值的类型不属于上面任何一种情况，返回object。

{% highlight javascript %}

typeof window // object

typeof {}; // object

typeof []; // object

{% endhighlight %}

