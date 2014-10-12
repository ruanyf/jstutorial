---
title: Date对象
layout: page
category: stdlib
date: 2013-09-03
modifiedOn: 2014-01-05
---

## 概述

Date对象是JavaScript提供的日期和时间的操作接口。它有多种用法。

### Date()

作为一个函数，Date对象可以直接调用，返回一个当前日期和时间的字符串。

{% highlight javascript %}

Date()
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

Date(2000, 1, 1)
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

上面代码说明，无论有没有参数，直接调用Date总是返回当前时间。

### new Date()

Date对象还是一个构造函数，对它使用new命令，会返回一个Date对象的实例。如果不加参数，生成的就是代表当前时间的对象。

{% highlight javascript %}

var today = new Date();

today 
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

// 等同于
today.toString() 
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

### new Date(milliseconds)

Date对象接受从1970年1月1日00:00:00 UTC开始计算的毫秒数作为参数。这意味着如果将Unix时间戳作为参数，必须将Unix时间戳乘以1000。

{% highlight javascript %}

new Date(1378218728000)
// Tue Sep 03 2013 22:32:08 GMT+0800 (CST)

// 1970年1月2日的零时
var Jan02_1970 = new Date(3600*24*1000);
// Fri Jan 02 1970 08:00:00 GMT+0800 (CST)

// 1969年12月31日的零时
var Dec31_1969 = new Date(-3600*24*1000);
// Wed Dec 31 1969 08:00:00 GMT+0800 (CST)

{% endhighlight %}

上面代码说明，Date构造函数的参数可以是一个负数，表示1970年1月1日之前的时间。Date对象能够表示的日期范围是1970年1月1日前后各一亿天。

### new Date(datestring)

Date对象还接受一个日期字符串作为参数，返回所对应的时间。

{% highlight javascript %}

new Date("January 6, 2013");
// Sun Jan 06 2013 00:00:00 GMT+0800 (CST)

{% endhighlight %}

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

### new Date(year, month [, day, hours, minutes, seconds, ms])

在多个参数的情况下，Date对象将其分别视作对应的年、月、日、小时、分钟、秒和毫秒。如果采用这种用法，最少需要指定两个参数（年和月），其他参数都是可选的，默认等于0。如果只使用年一个参数，Date对象会将其解释为毫秒数。

{% highlight javascript %}

new Date(2013) // Thu Jan 01 1970 08:00:02 GMT+0800 (CST)
new Date(2013,0) // Tue Jan 01 2013 00:00:00 GMT+0800 (CST)
new Date(2013,0,1) // Tue Jan 01 2013 00:00:00 GMT+0800 (CST)
new Date(2013,0,1,0) // Tue Jan 01 2013 00:00:00 GMT+0800 (CST)
new Date(2013,0,1,0,0,0,0) // Tue Jan 01 2013 00:00:00 GMT+0800 (CST)

{% endhighlight %}

上面代码（除了第一行）返回的是2013年1月1日零点的时间，可以看到月份从0开始计算，因此1月是0，12月是11。但是，月份里面的天数从1开始计算。

这些参数如果超出了正常范围，会被自动折算。比如，如果月设为15，就算折算为下一年的4月。参数还可以使用负数，表示扣去的时间。

```javascript

new Date(2013,0) // Tue Jan 01 2013 00:00:00 GMT+0800 (CST)
new Date(2013,-1) // Sat Dec 01 2012 00:00:00 GMT+0800 (CST) 
new Date(2013,0,1) // Tue Jan 01 2013 00:00:00 GMT+0800 (CST)
new Date(2013,0,0) // Mon Dec 31 2012 00:00:00 GMT+0800 (CST)
new Date(2013,0,-1) // Sun Dec 30 2012 00:00:00 GMT+0800 (CST)

```

上面代码分别对月和日使用了负数，表示从基准日扣去相应的时间。

年的情况有所不同，如果为0，表示1900年；如果为负数，则表示公元前。

```javascript

new Date(1,0) // Tue Jan 01 1901 00:00:00 GMT+0800 (CST)
new Date(0,0) // Mon Jan 01 1900 00:00:00 GMT+0800 (CST)
new Date(-1,0) // Fri Jan 01 -1 00:00:00 GMT+0800 (CST)

```

### 日期的运算

类型转换时，Date对象的实例如果转为数值，则等于对应的毫秒数；如果转为字符串，则等于对应的日期字符串。所以，两个日期对象进行减法运算，返回的就是它们间隔的毫秒数；进行加法运算，返回的就是连接后的两个字符串。

{% highlight javascript %}

var then = new Date(2013,2,1);
var now = new Date(2013,3,1);

now - then
// 2678400000

now + then
// "Mon Apr 01 2013 00:00:00 GMT+0800 (CST)Fri Mar 01 2013 00:00:00 GMT+0800 (CST)"

{% endhighlight %}

## Date对象的方法

### Date.now()

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

### Date.parse()

parse方法用来解析日期字符串，返回距离1970年1月1日 00:00:00的毫秒数。日期字符串的格式应该完全或者部分符合RFC 2822和ISO 8061，即YYYY-MM-DDTHH:mm:ss.sssZ格式，其中最后的Z表示时区，是可选的。

- YYYY
- YYYY-MM
- YYYY-MM-DD
- THH:mm（比如“T12:00”）
- THH:mm:ss
- THH:mm:ss.sss

请看例子。

{% highlight javascript %}

Date.parse("Aug 9, 1995")
// 返回807897600000，以下省略返回值

Date.parse("January 26, 2011 13:51:50")
Date.parse("Mon, 25 Dec 1995 13:30:00 GMT")
Date.parse("Mon, 25 Dec 1995 13:30:00 +0430")
Date.parse("2011-10-10")
Date.parse("2011-10-10T14:48:00")

{% endhighlight %}

如果解析失败，返回NaN。

```javascript

Date.parse("xxx")
// NaN

```

### Date.UTC()

默认情况下，Date对象返回的都是当前时区的时间。Date.UTC方法可以返回UTC时间（世界标准时间）。该方法接受年、月、日等变量作为参数，返回当前距离1970年1月1日 00:00:00 UTC的毫秒数。

{% highlight javascript %}

// 使用的格式
Date.UTC(year, month[, date[, hrs[, min[, sec[, ms]]]]]) 

Date.UTC(2011,0,1,2,3,4,567)
// 1293847384567

{% endhighlight %}

该方法的参数用法与Date构造函数完全一致，比如月从0开始计算。

## Date实例对象的方法

使用new命令生成的Date对象的实例，有很多自己的方法。

### Date.prototype.toString()

toString方法返回一个完整的时间字符串。

{% highlight javascript %}

var today = new Date(1362790014000);

today.toString()
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

today
// "Sat Mar 09 2013 08:46:54 GMT+0800 (CST)"

{% endhighlight %}

因为toString是默认的调用方法，所以如果直接读取Date对象实例，就相当于调用这个方法。

### Date.prototype.toUTCString()，Date.prototype.toISOString()

toUTCString方法返回对应的UTC时间，也就是比北京时间晚8个小时。toISOString方法返回对应时间的ISO8601写法。

{% highlight javascript %}

var today = new Date(1362790014000);

today.toUTCString()
// "Sat, 09 Mar 2013 00:46:54 GMT"

today.toISOString()
// "2013-03-09T00:46:54.000Z"

{% endhighlight %}

### Date.prototype.toDateString()，Date.prototype.toTimeString()

toDateString方法返回日期的字符串形式，toTimeString方法返回时间的字符串形式。

{% highlight javascript %}

var today = new Date(1362790014000);

today.toDateString()
// "Sat Mar 09 2013"

today.toTimeString()
// "08:46:54 GMT+0800 (CST)"

{% endhighlight %}

### Date.prototype.toLocalDateString()，Date.prototype.toLocalTimeString()

toLocalDateString方法返回一个字符串，代表日期的当地写法；toLocalTimeString方法返回一个字符串，代表时间的当地写法。

{% highlight javascript %}

var today = new Date(1362790014000);

today.toLocaleDateString()
// "2013年3月9日"

today.toLocaleTimeString()
"上午8:46:54"

{% endhighlight %}

### Date.prototype.valueOf()

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

### Date.prototype.get系列方法

Date对象提供了一系列get方法，用来获取实例对象某个方面的值。

- **Date.prototype.getTime()**：返回实例对象距离1970年1月1日00:00:00对应的毫秒数，等同于valueOf方法。
- **Date.prototype.getDate()**：返回实例对象对应每个月的几号（从1开始）。
- **Date.prototype.getDay()**：返回星期，星期日为0，星期一为1，以此类推。
- **Date.prototype.getFullYear()**：返回四位的年份。
- **Date.prototype.getMonth()**：返回月份（0表示1月，11表示12月）。
- **Date.prototype.getHours()**：返回小时（0-23）。
- **Date.prototype.getMilliseconds()**：返回毫秒（0-999）。
- **Date.prototype.getMinutes()**：返回分钟（0-59）。
- **Date.prototype.getSeconds()**：返回秒（0-59）。
- **Date.prototype.getTimezoneOffset()**：返回当前时间与UTC的时区差异，以分钟表示，返回结果考虑到了夏令时因素。

{% highlight javascript %}

var d = new Date("January 6, 2013");

d.getDate() // 6
d.getMonth() // 0
d.getFullYear() // 2013
d.getTimezoneOffset() // -480

{% endhighlight %}

上面这些方法默认返回的都是当前时区的时间，Date对象还提供了这些方法对应的UTC版本，用来返回UTC时间，比如getUTCFullYear()、getUTCMonth()、getUTCDay()、getUTCHours()等等。

### Date.prototype.set系列方法

Date对象提供了一系列set方法，用来设置实例对象的各个方面。

- **Date.prototype.setDate(date)**：设置实例对象对应的每个月的几号（1-31），返回改变后毫秒时间戳。
- **Date.prototype.setFullYear(year [, month, date])**：设置四位年份。
- **Date.prototype.setHours(hour [, min, sec, ms])**：设置小时（0-23）。
- **Date.prototype.setMilliseconds()**：设置毫秒（0-999）。
- **Date.prototype.setMinutes(min [, sec, ms])**：设置分钟（0-59）。
- **Date.prototype.setMonth(month [, date])**：设置月份（0-11）。
- **Date.prototype.setSeconds(sec [, ms])**：设置秒（0-59）。
- **Date.prototype.setTime(milliseconds)**：设置毫秒时间戳。

{% highlight javascript %}

var d = new Date ("January 6, 2013");

d 
// Sun Jan 06 2013 00:00:00 GMT+0800 (CST)

d.setDate(9) 
// 1357660800000

d
// Wed Jan 09 2013 00:00:00 GMT+0800 (CST)

{% endhighlight %}

set方法的参数都会自动折算。以setDate为例，如果参数超过当月的最大天数，则向下一个月顺延，如果参数是负数，表示从上个月的最后一天开始减去的天数。

{% highlight javascript %}

var d = new Date("January 6, 2013");

d.setDate(32)
// 1359648000000
d 
// Fri Feb 01 2013 00:00:00 GMT+0800 (CST)

var d = new Date ("January 6, 2013");

d.setDate(-1)
// 1356796800000
d
// Sun Dec 30 2012 00:00:00 GMT+0800 (CST)

{% endhighlight %}

使用setDate方法，可以算出今天过后1000天是几月几日。

```javascript

var d = new Date();
d.setDate( d.getDate() + 1000 );
d.getDay();

```

set系列方法除了setTime()，都有对应的UTC版本，比如setUTCHours()。

### Date.prototype.toJSON()

toJSON方法返回JSON格式的日期对象。

{% highlight javascript %}

var jsonDate = (new Date()).toJSON();

jsonDate
"2013-09-03T14:26:31.880Z"

var backToDate = new Date(jsonDate);

{% endhighlight %}

## 参考链接

- Rakhitha Nimesh，[Getting Started with the Date Object](http://jspro.com/raw-javascript/beginners-guide-to-javascript-date-and-time/)
- Ilya Kantor, [Date/Time functions](http://javascript.info/tutorial/datetime-functions)
