---
title: Date对象
layout: page
category: stdlib
date: 2013-09-03
modifiedOn: 2014-01-05
---

## 概述

Date对象是JavaScript提供的日期和时间的操作接口。

Date是一个构造函数，但是可以直接调用，这时会返回表示当前日期时间的一个长字符串。无论有没有参数，结果都一样

{% highlight javascript %}

Date()
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

Date(2013,2,9)
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

对Date对象使用new命令，会返回一个Date对象的实例。如果这时不提供参数，生成的就是代表当前时间的对象。

{% highlight javascript %}

var today = new Date();

today 
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

// 等同于
today.toString() 
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

如果这时提供参数，则生成一个代表指定时间的对象。

{% highlight javascript %}

var d1 = new Date( "January 6, 2013" );
var d2 = new Date(2013,0,6);

d1 // "Sun Jan 06 2013 00:00:00 GMT+0800 (CST)"
d2 // "Sun Jan 06 2013 00:00:00 GMT+0800 (CST)"

{% endhighlight %}

Date对象接受各种代表日期和时间的参数。

**（1）日期字符串**

所有可以被Date.parse()方法解析的日期字符串，都可以当作Date对象的参数。

{% highlight javascript %}

new Date("2013-02-15")
new Date("2013-FEB-15")
new Date("FEB, 15, 2013")
new Date("FEB 15, 2013")
new Date("Feberuary, 15, 2013")
new Date("Feberuary 15, 2013")
new Date("15, Feberuary, 2013")
// Fri Feb 15 2013 08:00:00 GMT+0800 (CST)

{% endhighlight %}

上面多种写法，返回的都是同一个时间。

**（2）独立参数**

除了日期字符串，Date还接受年、月、日等变量独立作为参数，格式和实例如下。

{% highlight javascript %}

new Date(year, month, day [, hour, minute, second, millisecond]);

new Date(2013,2,1)
// Fri Mar 01 2013 00:00:00 GMT+0800 (CST)

new Date(2013,2,1,17,10,30)
// Fri Mar 01 2013 17:10:30 GMT+0800 (CST)

{% endhighlight %}

需要注意的是，月份是从0开始计算的，所以2就表示三月。

**（3）毫秒时间戳**

Date对象还接受从1970年1月1日00:00:00 UTC开始计算的毫秒数作为参数。这意味着如果将Unix时间戳作为参数，必须将Unix时间戳乘以1000。

{% highlight javascript %}

new Date(1378218728000)
// Tue Sep 03 2013 22:32:08 GMT+0800 (CST)

{% endhighlight %}

如果两个日期对象进行减法运算，返回的就是它们间隔的毫秒数；如果进行加法运算，返回的就是连接后的两个字符串。

{% highlight javascript %}

var then = new Date(2013,2,1);
var now = new Date(2013,3,1);

now - then
// 2678400000

now + then
// "Mon Apr 01 2013 00:00:00 GMT+0800 (CST)Fri Mar 01 2013 00:00:00 GMT+0800 (CST)"

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

## Date实例对象的方法

使用new命令生成的Date对象的实例，有很多自己的方法。

### toString系列方法

toString方法返回一个完整的时间字符串。

{% highlight javascript %}

var today = new Date();

today.toString()
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

因为toString是默认的调用方法，所以如果直接读取Date对象实例，就相当于调用这个方法。

{% highlight javascript %}

today
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

toUTCString方法返回对应的UTC时间，比如北京时间需要减去8个小时；toISOString方法返回时间的ISO8601写法。

{% highlight javascript %}

today.toUTCString()
// "Sat, 09 Mar 2013 00:46:54 GMT"

today.toISOString()
// "2013-03-09T00:46:54.000Z"

{% endhighlight %}

toDateString方法返回日期的字符串形式，toTimeString方法返回时间的字符串形式。

{% highlight javascript %}

today.toDateString()
// "Sat Mar 09 2013"

today.toTimeString()
// "08:46:54 GMT+0800 (CST)"

{% endhighlight %}

toLocalDateString方法返回一个字符串，代表日期的当地写法；toLocalTimeString方法返回一个字符串，代表时间的当地写法。

{% highlight javascript %}

today.toLocaleDateString()
// "2013年3月9日"

today.toLocaleTimeString()
"上午8:46:54"

{% endhighlight %}

### valueOf方法

valueOf方法返回实例对象距离1970年1月1日00:00:00 UTC对应的毫秒数，该方法等同于getTime方法。

{% highlight javascript %}

var today = new Date();

today.valueOf()
// 1362790014817

today.getTime()
// 1362790014817

{% endhighlight %}

该方法可以用于计算精确时间。

{% highlight javascript %}

var start = new Date();

doSomething();
var end = new Date();
var elapsed = end.getTime() - start.getTime(); 

{% endhighlight %}

### get系列方法

Date提供一系列get方法，得到实例对象某个方面的值。

- **getTime**：返回实例对象距离1970年1月1日00:00:00 UTC对应的毫秒数，等同于valueOf方法。
- **getDate**：返回实例对象对应每个月的几号（从1开始）。
- **getDay**：返回星期，星期日为0，星期一为1，以此类推。
- **getFullYear**：返回四位的年份。
- **getMonth**：返回月份（0表示1月，11表示12月）。
- **getHours**：返回小时（0-23）。
- **getUTCHours**：返回此时对应的UTC小时，比如北京时间半夜0点，对应UTC时间为前一天的16点。
- **getMilliseconds**：返回毫秒（0-999）。
- **getMinutes**：返回分钟（0-59）。
- **getSeconds**：返回秒（0-59）。
- **getTimezoneOffset**：返回时区差异。

{% highlight javascript %}

var date1 = new Date ( "January 6, 2013" );

date1.getDate() // 6
date1.getMonth() // 0
date1.getFullYear() // 2013

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
