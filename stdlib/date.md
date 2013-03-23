---
title: Date对象
layout: page
category: stdlib
date: 2013-03-09
modifiedOn: 2013-03-23
---

## 概述

直接调用Date对象，会返回当前时间的字符串。

{% highlight javascript %}

Date()
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

对Date对象使用new命令，则生成一个代表时间的实例对象。如果不提供参数，生成的就是代表当前时间的对象。

{% highlight javascript %}

var today = new Date();

today
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

如果提供参数，则生成一个代表指定时间的对象。

{% highlight javascript %}

var date1 = new Date ( "January 6, 2013" );

date1
// "Sun Jan 06 2013 00:00:00 GMT+0800 (CST)"

{% endhighlight %}

## Date对象的参数

Date对象接受各种代表日期的字符串。

（1）YYYY-MM-DD

{% highlight javascript %}

new Date ( "2013-02-15" )
// Fri Feb 15 2013 08:00:00 GMT+0800 (CST)

{% endhighlight %}

（2）YYYY-MMM-DD

MMM表示月份的三位英语缩写，从1月到12月分别为"JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"。

{% highlight javascript %}

new Date ( "2013-FEB-15" )
// Fri Feb 15 2013 08:00:00 GMT+0800 (CST)

{% endhighlight %}

## Date对象的方法

now方法返回当前的Unix时间戳。

{% highlight javascript %}

Date.now()
// 1364026285194

{% endhighlight %}

如果需要更精确的时间，可以使用window.performance.now()。它提供页面加载到命令运行时的已经过去的时间，单位是浮点数形式的毫秒。

{% highlight javascript %}

window.performance.now()
// 21311140.415

{% endhighlight %}		

## 实例对象的方法

### toString，toDateString

toString方法，返回一个完整的时间字符串。

{% highlight javascript %}

var today = new Date();

today.toString()
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

因为toString是默认的调用方法，所以上面的命令相当于

{% highlight javascript %}

today
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

toDateString方法返回一个更可读的日期形式。

{% highlight javascript %}

today.toDateString()
// "Sat Mar 09 2013"

{% endhighlight %}

### valueOf，getTime

valueOf方法和getTime方法都返回实例对象对应的Unix时间戳。

{% highlight javascript %}

var today = new Date();

today.valueOf()
// 1362790014817

today.getTime()
// 1362790014817

{% endhighlight %}

### getDate，getMonth和getFullYear

getDate方法返回实例对象对应的是每个月的几号（从1开始）。

{% highlight javascript %}

var date1 = new Date ( "January 6, 2013" );

date1.getDate()
// 6

{% endhighlight %}

getMonth方法返回实例对象对应的是第几个月（从0开始）。

{% highlight javascript %}

date1.getMonth()
// 0

{% endhighlight %}

getFullYear方法返回实例对象对应的四位数年份。

{% highlight javascript %}

date1.getFullYear()
// 2013

{% endhighlight %}

### setDate，setMonth

setDate方法用来改变实例对象对应的每个月的几号（从1开始），返回改变后的Unix时间戳。

{% highlight javascript %}

var date1 = new Date ( "January 6, 2013" );

date1
// Sun Jan 06 2013 00:00:00 GMT+0800 (CST)

date1.setDate(9)
// 1357660800000

date1
// Wed Jan 09 2013 00:00:00 GMT+0800 (CST)

{% endhighlight %}

如果参数超过当月的最大天数，则向下一个月顺延。

{% highlight javascript %}

var date1 = new Date ( "January 6, 2013" );

date1.setDate(32)
// 得到“Fri Feb 01 2013 00:00:00 GMT+0800 (CST)”

{% endhighlight %}

如果参数是负数，表示从上个月的最后一天开始减去的天数。

{% highlight javascript %}

var date1 = new Date ( "January 6, 2013" );

date1.setDate(-1)
// 得到“Sun Dec 30 2012 00:00:00 GMT+0800 (CST)”

{% endhighlight %}

setMonth方法用来改变实例对象对应的月份（从0开始），返回改变后的Unix时间戳。

{% highlight javascript %}

var date1 = new Date ( "January 6, 2013" );

date1
// Sun Jan 06 2013 00:00:00 GMT+0800 (CST)

date1.setMonth(2)
// 1362499200000

date1
// Wed Mar 06 2013 00:00:00 GMT+0800 (CST)

{% endhighlight %}

setMonth方法的参数规则与setDate类似。

## 参考链接

- Rakhitha Nimesh，[Getting Started with the Date Object](http://jspro.com/raw-javascript/beginners-guide-to-javascript-date-and-time/)
