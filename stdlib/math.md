---
title: Math对象
layout: page
category: stdlib
date: 2013-02-12
modifiedOn: 2013-10-27
---

Math对象是JavaScript的内置对象，提供一系列数学常数和数学方法。

该对象不是构造函数，所以不能生成实例，所有的属性和方法都必须在Math对象上调用。

{% highlight javascript %}

new Math()
// TypeError: object is not a function

{% endhighlight %}

上面代码表示，Math不能当作构造函数用。

## 属性

Math对象提供以下一些只读的数学常数。

- E：常数e。
- LN2：2的自然对数。
- LN10：10的自然对数。
- LOG2E：以2为底的e的对数。
- LOG10E：以10为底的e的对数。
- PI：常数Pi。
- SQRT1_2：0.5的平方根。
- SQRT2：2的平方根。

这些常数的值如下。

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

### round方法

round方法用于四舍五入。

{% highlight javascript %}

Math.round(0.1) // 0
Math.round(0.5) // 1

{% endhighlight %}

它对于负值的运算结果与正值略有不同，主要体现在对.5的处理。

{% highlight javascript %}

Math.round(-1.1) // -1
Math.round(-1.5) // -1

{% endhighlight %}

### abs方法，max方法，min方法

abs方法返回参数值的绝对值。

{% highlight javascript %}

Math.abs(1) // 1
Math.abs(-1) // 1

{% endhighlight %}

max方法返回最大的参数，min方法返回最小的参数。

{% highlight javascript %}

Math.max(2, -1, 5) // 5
Math.min(2, -1, 5) // -1

{% endhighlight %}

### floor方法，ceil方法

floor方法返回小于参数值的最大整数。

{% highlight javascript %}

Math.floor(3.2) // 3
Math.floor(-3.2) // -4

{% endhighlight %}

ceil方法返回大于参数值的最小整数。

{% highlight javascript %}

Math.ceil(3.2) // 4
Math.ceil(-3.2) // -3

{% endhighlight %}

### pow方法，sqrt方法

power方法返回以第一个参数为底数、第二个参数为幂的指数值。

{% highlight javascript %}

Math.pow(2, 2) // 4
Math.pow(2, 3) // 8

{% endhighlight %}

sqrt方法法返回参数值的平方根。如果参数是一个负值，则返回NaN。

{% highlight javascript %}

Math.sqrt(4) // 2
Math.sqrt(-4) // NaN

{% endhighlight %}

### log方法，exp方法

log方法返回以e为底的自然对数值。

{% highlight javascript %}

Math.log(Math.E) // 1
Math.log(10) // 2.302585092994046

{% endhighlight %}

求以10为底的对数，可以除以Math.LN10；求以2为底的对数，可以除以Math.LN2。

{% highlight javascript %}

Math.log(100)/Math.LN10 // 2
Math.log(8)/Math.LN2 // 3

{% endhighlight %}

exp方法返回常数e的参数次方。

{% highlight javascript %}

Math.exp(1) // 2.718281828459045
Math.exp(3) // 20.085536923187668

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

### 三角函数方法

sin方法返回参数的正弦，cos方法返回参数的余弦，tan方法返回参数的正切。

{% highlight javascript %}

Math.sin(0) // 0
Math.cos(0) // 1
Math.tan(0) // 0

{% endhighlight %}

asin方法返回参数的反正弦，acos方法返回参数的反余弦，atan方法返回参数的反正切。这个三个方法的返回值都是弧度值。

{% highlight javascript %}

Math.asin(1) // 1.5707963267948966
Math.acos(1) // 0
Math.atan(1) // 0.7853981633974483

{% endhighlight %}
