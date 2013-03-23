---
title: Number对象
layout: page
category: stdlib
date: 2013-03-16
modifiedOn: 2013-03-23
---

## 属性

Number拥有一些特别的属性。

- Number.POSITIVE_INFINITY 正的无限
- Number.NEGATIVE_INFINITY 负的无限
- Number.NaN 表示非数值，被0除就得到这个值

## toString方法

Number对象部署了单独的toString方法，可以接受一个参数，表示将一个数字转化成某个进制的字符串。

{% highlight javascript %}

(10).toString() //"10"

(10).toString(2) // "1010"

(10).toString(8) // "12"

(10).toString(16) // "a"

{% endhighlight %}


