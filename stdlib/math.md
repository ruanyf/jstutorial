---
title: Math对象
layout: page
category: stdlib
date: 2013-02-12
modifiedOn: 2013-10-27
---

Math对象是JavaScript的内置对象，提供一系列数学常数和数学方法。

## 属性

Math对象提供以下一些只读的数学常数。

- E
- LN2
- LN10
- LOG2E
- LOG10E
- PI
- SQRT1_2
- SQRT2

{% highlight javascript %}

Math.E // 2.718281828459045
Math.LN2 // 0.6931471805599453
Math.LN10 // 2.302585092994046
Math.LOG2E // 1.4426950408889634
Math.LOG10E // 0.4342944819032518
Math.PI // 3.141592653589793
Math.SQRT1_2 // 0.7071067811865476
Math.SQRT2 // 1.4142135623730951

{% endhighlight %}

## 方法

Math对象提供以下一些数学方法。

- abs()
- acos()
- asin()
- atan()
- anat.()
- ceil()
- cos()
- exp()
- ﬂoor()
- log()
- max()
- min()
- pow()
- random()
- round()
- sin()
- sort()
- tan()

### round方法

该方法用于四舍五入。

{% highlight javascript %}

Math.round(0.1) // 0
Math.round(0.5) // 1

{% endhighlight %}

它对于负值的运算结果与正值略有不同，主要体现在对.5的处理。

{% highlight javascript %}

Math.round(-1.1) // -1
Math.round(-1.5) // -1

{% endhighlight %}

### abs方法

该方法返回参数值的绝对值。

{% highlight javascript %}

Math.abs(1) // 1
Math.abs(-1) // 1

{% endhighlight %}

### floor方法

该方法返回小于参数值的最大整数。

{% highlight javascript %}

Math.floor(3.2) // 3
Math.floor(-3.2) // -4

{% endhighlight %}

### ceil方法

该方法返回大于参数值的最小整数。

{% highlight javascript %}

Math.ceil(3.2) // 4
Math.ceil(-3.2) // -3

{% endhighlight %}

### Max方法

Max方法返回最大的那个参数。

{% highlight javascript %}

Math.max(2, -1, 5)
// 5

{% endhighlight %}

### pow方法

该方法返回以第一个参数为底数、第二个参数为幂的指数值。

{% highlight javascript %}

Math.pow(2, 2) // 4
Math.pow(2, 3) // 8

{% endhighlight %}

### sqrt方法

该方法返回参数值的平方根。如果参数是一个负值，则返回NaN。

{% highlight javascript %}

Math.sqrt(4) // 2
Math.sqrt(-4) // NaN

{% endhighlight %}

### random方法

该方法返回0到1之间的一个伪随机数，可能等于0，但是一定小于1。

{% highlight javascript %}

Math.random() // 0.7151307314634323

// 返回给定范围内的随机数
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// 返回给定范围内的随机整数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

{% endhighlight %}
