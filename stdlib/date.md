---
title: Date对象
layout: page
category: stdlib
date: 2013-09-03
modifiedOn: 2013-03-23
---

Date对象是日期和时间的主要操作接口。

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

Date对象接受各种代表日期和时间的参数。

（1）日期字符串

所有可以被Date.parse()方法解析的日期字符串，都可以当作Date对象的参数。

{% highlight javascript %}

new Date ( "2013-02-15" )
// Fri Feb 15 2013 08:00:00 GMT+0800 (CST)

new Date ( "2013-FEB-15" )
// Fri Feb 15 2013 08:00:00 GMT+0800 (CST)

{% endhighlight %}

（2）独立参数

除了日期字符串，Date还接受年、月、日等变量独立作为参数。

{% highlight javascript %}

new Date(year, month, day [, hour, minute, second, millisecond]);

new Date(2013,2,1)
// Fri Mar 01 2013 00:00:00 GMT+0800 (CST)

{% endhighlight %}

需要注意的是，月份是从0开始计算的，所以2就表示三月。

（3）毫秒时间戳

Date对象还接受从1970年1月1日00:00:00 UTC开始计算的毫秒数作为参数。这意味着如果将Unix时间戳作为参数，必须将Unix时间戳乘以1000。

{% highlight javascript %}

new Date(1378218728000)
// Tue Sep 03 2013 22:32:08 GMT+0800 (CST)

{% endhighlight %}

Date对象能够表示的日期范围是1970年1月1日前后各一亿天。

## Date对象的方法

### now方法

now方法返回当前距离1970年1月1日 00:00:00 UTC的毫秒数（Unix时间戳乘以1000）。

{% highlight javascript %}

Date.now()
// 1364026285194

{% endhighlight %}

如果需要更精确的时间，可以使用window.performance.now()。它提供页面加载到命令运行时的已经过去的时间，单位是浮点数形式的毫秒。

{% highlight javascript %}

window.performance.now()
// 21311140.415

{% endhighlight %}		

### parse方法

parse方法解析日期字符串，返回距离1970年1月1日 00:00:00 UTC的毫秒数。日期字符串的格式应该符合RFC 2822和ISO 8061。

{% highlight javascript %}

Date.parse("Aug 9, 1995")

Date.parse("Mon, 25 Dec 1995 13:30:00 GMT")

Date.parse("Mon, 25 Dec 1995 13:30:00 +0430")

Date.parse("2011-10-10")

Date.parse("2011-10-10T14:48:00")

{% endhighlight %}

### UTC方法

UTC方法接受年、月、日等变量独立作为参数，返回当前距离1970年1月1日 00:00:00 UTC的毫秒数。

{% highlight javascript %}

Date.UTC(year, month[, date[, hrs[, min[, sec[, ms]]]]]) 

{% endhighlight %}

参数变量之中，year只接收1900之后的年份，month从0开始计算。被省略的参数变量，一律视为0。

如果变量超出范围，会自动折算成相应的值。比如，如果month输入15，year就会自动加1，然后month自动折算为4。

## 实例对象的方法

### toString，toDateString和toTimeString

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

toDateString方法对日期部分返回一个更可读的形式。

{% highlight javascript %}

today.toDateString()
// "Sat Mar 09 2013"

{% endhighlight %}

toTimeString方法对时间部分返回一个更可读的形式。

{% highlight javascript %}

today.toTimeString()
// "08:46:54 GMT+0800 (CST)"

{% endhighlight %}

### valueOf，getTime

valueOf方法和getTime方法都返回实例对象距离1970年1月1日00:00:00 UTC对应的毫秒数。

{% highlight javascript %}

var today = new Date();

today.valueOf()
// 1362790014817

today.getTime()
// 1362790014817

{% endhighlight %}

getTime可以用于计算精确时间。

{% highlight javascript %}

var start = new Date();

doSomethingForALongTime();
var end = new Date();
var elapsed = end.getTime() - start.getTime(); 

{% endhighlight %}

### get系列方法

Date提供一系列get方法，得到实例对象某个方面的值。

- getDate：返回实例对象对应每个月的几号（从1开始）。
- getDay：返回星期，星期日为0，星期一为1，以此类推。
- getFullYear：返回四位的年份。
- getMonth：返回月份（0-11）。
- getHours：返回小时（0-23）。
- getMilliseconds：返回毫秒（0-999）。
- getMinutes：返回分钟（0-59）。
- getSeconds：返回秒（0-59）。
- getTimezoneOffset：返回时区差异。

{% highlight javascript %}

var date1 = new Date ( "January 6, 2013" );

date1.getDate()
// 6

date1.getMonth()
// 0

date1.getFullYear()
// 2013

{% endhighlight %}

### set系列方法

Date对象提供了一系列set方法，用来设置实例对象的各个方面。

- setDate：设置实例对象对应的每个月的几号（1-31），返回改变后毫秒时间戳。
- setFullYear：设置四位年份。
- setHours：设置小时（0-23）。
- setMilliseconds：设置毫秒（0-999）。
- setMinutes：设置分钟（0-59）。
- setMonth：设置月份（0-11）。
- setSeconds：设置秒（0-59）。
- setTime：设置毫秒时间戳。

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

### toISOString方法

toISOString方法返回ISO 8601的日期格式。

{% highlight javascript %}

var today = new Date("05 October 2011 14:48 UTC");

today.toISOString()
// "2011-10-05T14:48:00.000Z"

{% endhighlight %}

### toJSON方法

toJSON方法返回JSON格式的日期对象。

{% highlight javascript %}

var jsonDate = (new Date()).toJSON();

jsonDate
"2013-09-03T14:26:31.880Z"

var backToDate = new Date(jsonDate);

{% endhighlight %}

## 参考链接

- Rakhitha Nimesh，[Getting Started with the Date Object](http://jspro.com/raw-javascript/beginners-guide-to-javascript-date-and-time/)
