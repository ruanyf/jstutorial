---
title: Date对象
layout: page
category: stdlib
date: 2013-09-03
modifiedOn: 2014-01-05
---

## 概述

`Date`对象是JavaScript提供的日期和时间的操作接口。它有多种用法。

JavaScript内部，所有日期和时间都储存为一个整数，表示当前时间距离1970年1月1日00:00:00的毫秒数，正负的范围为基准时间前后各1亿天。

### Date()

作为一个函数，`Date`对象可以直接调用，返回一个当前日期和时间的字符串。

```javascript
Date()
// "Tue Dec 01 2015 09:34:43 GMT+0800 (CST)"

Date(2000, 1, 1)
// "Tue Dec 01 2015 09:34:43 GMT+0800 (CST)"
```

上面代码说明，无论有没有参数，直接调用`Date`总是返回当前时间。

### new Date()

`Date`对象还是一个构造函数，对它使用`new`命令，会返回一个`Date`对象的实例。如果不加参数，生成的就是代表当前时间的对象。

```javascript
var today = new Date();

today
// "Tue Dec 01 2015 09:34:43 GMT+0800 (CST)"

// 等同于
today.toString()
// "Tue Dec 01 2015 09:34:43 GMT+0800 (CST)"
```

作为构造函数时，`Date`对象可以接受多种格式的参数。

**（1）new Date(milliseconds)**

Date对象接受从1970年1月1日00:00:00 UTC开始计算的毫秒数作为参数。这意味着如果将Unix时间戳作为参数，必须将Unix时间戳乘以1000。

```javascript
new Date(1378218728000)
// Tue Sep 03 2013 22:32:08 GMT+0800 (CST)

// 1970年1月2日的零时
var Jan02_1970 = new Date(3600 * 24 * 1000);
// Fri Jan 02 1970 08:00:00 GMT+0800 (CST)

// 1969年12月31日的零时
var Dec31_1969 = new Date(-3600 * 24 * 1000);
// Wed Dec 31 1969 08:00:00 GMT+0800 (CST)
```

上面代码说明，Date构造函数的参数可以是一个负数，表示1970年1月1日之前的时间。Date对象能够表示的日期范围是1970年1月1日前后各一亿天。

**（2）new Date(datestring)**

Date对象还接受一个日期字符串作为参数，返回所对应的时间。

```javascript
new Date("January 6, 2013");
// Sun Jan 06 2013 00:00:00 GMT+0800 (CST)
```

日期字符串的完整格式是“Month day, year hours:minutes:seconds”，比如“December 25, 1995 13:30:00”。如果省略了小时、分钟或秒数，这些值会被设为0。

但是，其他格式的日期字符串，也可以被解析。事实上，所有可以被`Date.parse()`方法解析的日期字符串，都可以当作`Date`对象的参数。

```javascript
new Date("2013-2-15")
new Date('2013/2/15')
new Date("2013-FEB-15")
new Date("FEB, 15, 2013")
new Date("FEB 15, 2013")
new Date("Feberuary, 15, 2013")
new Date("Feberuary 15, 2013")
new Date("15, Feberuary, 2013")

// Fri Feb 15 2013 00:00:00 GMT+0800 (CST)
```

上面多种日期字符串的写法，返回的都是同一个时间。

注意，在ES5之中，如果日期采用连词线（`-`）格式分隔，且具有前导0，JavaScript会认为这是一个ISO格式的日期字符串，导致返回的时间是以UTC时区计算的。

```javascript
new Date('2014-01-01')
// Wed Jan 01 2014 08:00:00 GMT+0800 (CST)

new Date('2014-1-1')
// Wed Jan 01 2014 00:00:00 GMT+0800 (CST)
```

上面代码中，日期字符串有没有前导0，返回的结果是不一样的。如果没有前导0，JavaScript引擎假设用户处于本地时区，所以本例返回0点0分。如果有前导0（即如果你以ISO格式表示日期），就假设用户处于格林尼治国际标准时的时区，所以返回8点0分。但是，ES6改变了这种做法，规定凡是没有指定时区的日期字符串，一律认定用户处于本地时区。

对于其他格式的日期字符串，一律视为非ISO格式，采用本地时区作为计时标准。

```javascript
new Date('2014-12-11')
// Thu Dec 11 2014 08:00:00 GMT+0800 (CST)

new Date('2014/12/11')
// Thu Dec 11 2014 00:00:00 GMT+0800 (CST)
```

上面代码中，第一个日期字符串是ISO格式，第二个不是。

**（3）new Date(year, month [, day, hours, minutes, seconds, ms])**

Date对象还可以接受多个整数作为参数，依次表示年、月、日、小时、分钟、秒和毫秒。如果采用这种格式，最少需要提供两个参数（年和月），其他参数都是可选的，默认等于0。因为如果只使用“年”这一个参数，Date对象会将其解释为毫秒数。

```javascript
new Date(2013)
// Thu Jan 01 1970 08:00:02 GMT+0800 (CST)
```

上面代码中，2013被解释为毫秒数，而不是年份。

其他情况下，被省略的参数默认都是0。

```javascript
new Date(2013, 0)
// Tue Jan 01 2013 00:00:00 GMT+0800 (CST)

new Date(2013, 0, 1)
// Tue Jan 01 2013 00:00:00 GMT+0800 (CST)

new Date(2013, 0, 1, 0)
// Tue Jan 01 2013 00:00:00 GMT+0800 (CST)

new Date(2013, 0, 1, 0, 0, 0, 0)
// Tue Jan 01 2013 00:00:00 GMT+0800 (CST)
```

上面代码（除了第一行）返回的是2013年1月1日零点的时间，可以看到月份从0开始计算，因此1月是0，12月是11。但是，月份里面的天数从1开始计算。

这些参数如果超出了正常范围，会被自动折算。比如，如果月设为15，就折算为下一年的4月。

```javascript
new Date(2013, 15)
// Tue Apr 01 2014 00:00:00 GMT+0800 (CST)

new Date(2013,0,0)
// Mon Dec 31 2012 00:00:00 GMT+0800 (CST)
```

参数还可以使用负数，表示扣去的时间。

```javascript
new Date(2013, -1)
// Sat Dec 01 2012 00:00:00 GMT+0800 (CST)

new Date(2013, 0, -1)
// Sun Dec 30 2012 00:00:00 GMT+0800 (CST)
```

上面代码分别对月和日使用了负数，表示从基准日扣去相应的时间。

年的情况有所不同，如果为0，表示1900年；如果为1，就表示1901年；如果为负数，则表示公元前。

```javascript
new Date(0, 0)
// Mon Jan 01 1900 00:00:00 GMT+0800 (CST)

new Date(1, 0)
// Tue Jan 01 1901 00:00:00 GMT+0800 (CST)

new Date(-1, 0)
// Fri Jan 01 -1 00:00:00 GMT+0800 (CST)
```

### 日期的运算

类型转换时，Date对象的实例如果转为数值，则等于对应的毫秒数；如果转为字符串，则等于对应的日期字符串。所以，两个日期对象进行减法运算，返回的就是它们间隔的毫秒数；进行加法运算，返回的就是连接后的两个字符串。

```javascript
var d1 = new Date(2000, 2, 1);
var d2 = new Date(2000, 3, 1);

d2 - d1
// 2678400000

d2 + d1
// "Sat Apr 01 2000 00:00:00 GMT+0800 (CST)Wed Mar 01 2000 00:00:00 GMT+0800 (CST)"
```

## Date对象的静态方法

### Date.now()

`Date.now`方法返回当前距离1970年1月1日 00:00:00 UTC的毫秒数（Unix时间戳乘以1000）。

```javascript
Date.now() // 1364026285194
```

如果需要比毫秒更精确的时间，可以使用`window.performance.now()`。它提供页面加载到命令运行时的已经过去的时间，可以精确到千分之一毫秒。

```javascript
window.performance.now() // 21311140.415
```

### Date.parse()

`Date.parse`方法用来解析日期字符串，返回距离1970年1月1日 00:00:00的毫秒数。

标准的日期字符串的格式，应该完全或者部分符合RFC 2822和ISO 8061，即`YYYY-MM-DDTHH:mm:ss.sssZ`格式，其中最后的`Z`表示时区。但是，其他格式也可以被解析，请看下面的例子。

```javascript
Date.parse('Aug 9, 1995')
// 返回807897600000，以下省略返回值

Date.parse('January 26, 2011 13:51:50')
Date.parse('Mon, 25 Dec 1995 13:30:00 GMT')
Date.parse('Mon, 25 Dec 1995 13:30:00 +0430')
Date.parse('2011-10-10')
Date.parse('2011-10-10T14:48:00')
```

如果解析失败，返回`NaN`。

```javascript
Date.parse('xxx') // NaN
```

### Date.UTC()

默认情况下，Date对象返回的都是当前时区的时间。`Date.UTC`方法可以返回UTC时间（世界标准时间）。该方法接受年、月、日等变量作为参数，返回当前距离1970年1月1日 00:00:00 UTC的毫秒数。

```javascript
// 格式
Date.UTC(year, month[, date[, hrs[, min[, sec[, ms]]]]])

// 用法
Date.UTC(2011, 0, 1, 2, 3, 4, 567)
// 1293847384567
```

该方法的参数用法与`Date`构造函数完全一致，比如月从0开始计算。

## Date实例对象的方法

Date的实例对象，有几十个自己的方法，分为以下三类。

- to类：从Date对象返回一个字符串，表示指定的时间。
- get类：获取Date对象的日期和时间。
- set类：设置Date对象的日期和时间。

### to类方法

**（1）Date.prototype.toString()**

`toString`方法返回一个完整的日期字符串。

```javascript
var d = new Date(2013, 0, 1);

d.toString()
// "Tue Jan 01 2013 00:00:00 GMT+0800 (CST)"

d
// "Tue Jan 01 2013 00:00:00 GMT+0800 (CST)"
```

因为`toString`是默认的调用方法，所以如果直接读取Date对象实例，就相当于调用这个方法。

**（2）Date.prototype.toUTCString()**

`toUTCString`方法返回对应的UTC时间，也就是比北京时间晚8个小时。

```javascript
var d = new Date(2013, 0, 1);

d.toUTCString()
// "Mon, 31 Dec 2012 16:00:00 GMT"

d.toString()
// "Tue Jan 01 2013 00:00:00 GMT+0800 (CST)"
```

**（3）Date.prototype.toISOString()**

`toISOString`方法返回对应时间的ISO8601写法。

```javascript
var d = new Date(2013, 0, 1);

d.toString()
// "Tue Jan 01 2013 00:00:00 GMT+0800 (CST)"

d.toISOString()
// "2012-12-31T16:00:00.000Z"
```

注意，`toISOString`方法返回的总是UTC时区的时间。

**（4）Date.prototype.toJSON()**

`toJSON`方法返回一个符合JSON格式的ISO格式的日期字符串，与`toISOString`方法的返回结果完全相同。

```javascript
var d = new Date(2013, 0, 1);

d.toJSON()
// "2012-12-31T16:00:00.000Z"

d.toISOString()
// "2012-12-31T16:00:00.000Z"
```

**（5）Date.prototype.toDateString()**

`toDateString`方法返回日期的字符串形式。

```javascript
var d = new Date(2013, 0, 1);

d.toDateString()
// "Tue Jan 01 2013"
```

**（6）Date.prototype.toTimeString()**

`toTimeString`方法返回时间的字符串形式。

```javascript
var d = new Date(2013, 0, 1);

d.toTimeString()
// "00:00:00 GMT+0800 (CST)"
```

**（7）Date.prototype.toLocalDateString()**

`toLocalDateString`方法返回一个字符串，代表日期的当地写法。

```javascript
var d = new Date(2013, 0, 1);

d.toLocaleDateString()
// 中文版浏览器为"2013年1月1日"
// 英文版浏览器为"1/1/2013"
```

**（8）Date.prototype.toLocalTimeString()**

`toLocalTimeString`方法返回一个字符串，代表时间的当地写法。

```javascript
var d = new Date(2013, 0, 1);

d.toLocaleTimeString()
// 中文版浏览器为"上午12:00:00"
// 英文版浏览器为"12:00:00 AM"
```

### get类方法

Date对象提供了一系列`get*`方法，用来获取实例对象某个方面的值。

- `getTime()`：返回实例对象距离1970年1月1日00:00:00对应的毫秒数，等同于valueOf方法。
- `getDate()`：返回实例对象对应每个月的几号（从1开始）。
- `getDay()`：返回星期几，星期日为0，星期一为1，以此类推。
- `getYear()`：返回距离1900的年数。
- `getFullYear()`：返回四位的年份。
- `getMonth()`：返回月份（0表示1月，11表示12月）。
- `getHours()`：返回小时（0-23）。
- `getMilliseconds()`：返回毫秒（0-999）。
- `getMinutes()`：返回分钟（0-59）。
- `getSeconds()`：返回秒（0-59）。
- `getTimezoneOffset()`：返回当前时间与UTC的时区差异，以分钟表示，返回结果考虑到了夏令时因素。

`get*`方法返回一个整数，不同方法的返回值不一样。

- 分钟和秒：0 到 59
- 小时：0 到 23
- 星期：0（星期天）到 6（星期六）
- 日期：1 到 31
- 月份：0（一月）到 11（十二月）
- 年份：距离1900年的年数

```javascript
var d = new Date('January 6, 2013');

d.getDate() // 6
d.getMonth() // 0
d.getYear() // 113
d.getFullYear() // 2013
d.getTimezoneOffset() // -480
```

下面是一个例子，计算本年度还剩下多少天。

```javascript
function leftDays() {
  var today = new Date();
  var endYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
  var msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((endYear.getTime() - today.getTime()) / msPerDay);
}
```

上面这些`get*`方法返回的都是当前时区的时间，`Date`对象还提供了这些方法对应的UTC版本，用来返回UTC时间。

- `getUTCDate()`
- `getUTCFullYear()`
- `getUTCMonth()`
- `getUTCDay()`
- `getUTCHours()`
- `getUTCMinutes()`
- `getUTCSeconds()`
- `getUTCMilliseconds()`

```javascript
var d = new Date('January 6, 2013');

d.getDate() // 6
d.getUTCDate() // 5
```

上面代码中，变量`d`表示当前时区（东八时区）的1月6日0点0分0秒，这个时间对于当前时区来说是1月6日，所以`getDate`方法返回6，对于UTC时区来说是1月5日，所以`getUTCDate`方法返回5。

### set类方法

Date对象提供了一系列`set*`方法，用来设置实例对象的各个方面。

- `setDate(date)`：设置实例对象对应的每个月的几号（1-31），返回改变后毫秒时间戳。
- `setYear(year)`: 设置距离1900年的年数。
- `setFullYear(year [, month, date])`：设置四位年份。
- `setHours(hour [, min, sec, ms])`：设置小时（0-23）。
- `setMilliseconds()`：设置毫秒（0-999）。
- `setMinutes(min [, sec, ms])`：设置分钟（0-59）。
- `setMonth(month [, date])`：设置月份（0-11）。
- `setSeconds(sec [, ms])`：设置秒（0-59）。
- `setTime(milliseconds)`：设置毫秒时间戳。

这些方法基本是跟`get*`方法一一对应的，但是没有`setDay`方法，因为星期几是计算出来的，而不是设置的。另外，需要注意的是，凡是涉及到设置月份，都是从0开始算的，即`0`是1月，`11`是12月。

```javascript
var d = new Date ('January 6, 2013');

d // Sun Jan 06 2013 00:00:00 GMT+0800 (CST)
d.setDate(9) // 1357660800000
d // Wed Jan 09 2013 00:00:00 GMT+0800 (CST)
```

`set*`方法的参数都会自动折算。以`setDate`为例，如果参数超过当月的最大天数，则向下一个月顺延，如果参数是负数，表示从上个月的最后一天开始减去的天数。

```javascript
var d1 = new Date('January 6, 2013');

d1.setDate(32) // 1359648000000
d1 // Fri Feb 01 2013 00:00:00 GMT+0800 (CST)

var d2 = new Date ('January 6, 2013');

d.setDate(-1) // 1356796800000
d // Sun Dec 30 2012 00:00:00 GMT+0800 (CST)
```

下面的例子是使用`setDate`方法，算出今天以后的第1000天是几月几日。

```javascript
var d = new Date();
d.setDate( d.getDate() + 1000 );
d.getDay();
```

`set*`系列方法除了`setTime()`和`setYear()`，都有对应的UTC版本，即设置UTC时区的时间。

- `setUTCDate()`
- `setUTCFullYear()`
- `setUTCHours()`
- `setUTCMilliseconds()`
- `setUTCMinutes()`
- `setUTCMonth()`
- `setUTCSeconds()`

```javascript
var d = new Date('January 6, 2013');
d.getUTCHours() // 16
d.setUTCHours(22) // 1357423200000
d // Sun Jan 06 2013 06:00:00 GMT+0800 (CST)
```

上面代码中，本地时区（东八时区）的1月6日0点0分，是UTC时区的前一天下午16点。设为UTC时区的22点以后，就变为本地时区的上午6点。

### Date.prototype.valueOf()

`valueOf`方法返回实例对象距离1970年1月1日00:00:00 UTC对应的毫秒数，该方法等同于`getTime`方法。

```javascript
var d = new Date();

d.valueOf() // 1362790014817
d.getTime() // 1362790014817
```

该方法可以用于计算精确时间。

```javascript
var start = new Date();

doSomething();
var end = new Date();
var elapsed = end.getTime() - start.getTime();
```

## 参考链接

- Rakhitha Nimesh，[Getting Started with the Date Object](http://jspro.com/raw-javascript/beginners-guide-to-javascript-date-and-time/)
- Ilya Kantor, [Date/Time functions](http://javascript.info/tutorial/datetime-functions)
