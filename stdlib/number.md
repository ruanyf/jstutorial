---
title: Number对象
layout: page
category: stdlib
date: 2013-03-16
modifiedOn: 2013-03-16
---

## toString方法

Number对象部署了单独的toString方法，可以接受一个参数，表示将一个数字转化成某个进制的字符串。

{% highlight javascript %}

(10).toString() //"10"

(10).toString(2) // "1010"

(10).toString(8) // "12"

(10).toString(16) // "a"

{% endhighlight %}
