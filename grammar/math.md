---
title: Math对象
layout: page
category: grammar
date: 2013-02-12
modifiedOn: 2013-02-12
---

## round方法

该方法用于四舍五入。

{% highlight javascript %}

Math.round(0.1) // 0
Math.round(0.5) // 1

{% endhighlight %}

它对于负值的运算结果与正值略有不同，主要对.5的处理。

{% highlight javascript %}

Math.round(-1.1) // -1
Math.round(-1.5) // -1

{% endhighlight %}

## abs方法

该方法返回参数值的绝对值。

{% highlight javascript %}

Math.abs(1) // 0
Math.abs(-1) // 1

{% endhighlight %}

## floor方法

该方法返回小于参数值的最大整数。

{% highlight javascript %}

Math.floor(3.2) // 3
Math.floor(-3.2) // -4

{% endhighlight %}

## ceil方法

该方法返回大于参数值的最小整数。

{% highlight javascript %}

Math.ceil(3.2) // 4
Math.ceil(-3.2) // -3

{% endhighlight %}

## pow方法

该方法返回以第一个参数为底数、第二个参数为幂的指数值。

{% highlight javascript %}

Math.pow(2, 2) // 4
Math.pow(2, 3) // 8

{% endhighlight %}
