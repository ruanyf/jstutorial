---
title: console对象
layout: page
category: tool
date: 2013-03-10
modifiedOn: 2013-03-10
---

## 概述

各大浏览器内置的开发工具，都提供了一个console对象。它主要有两个作用：

- 显示网页代码运行时的错误信息。
- 提供了一个命令行接口，用来与网页代码互动。

以chrome浏览器为例，打开console窗口，有两种方法：

- 按键方法，Command - Option - J（Mac系统） 或者 Control -Shift -J （Windows/Linux系统）。
- 菜单方法，“View > Developer > JavaScript Console”。

按ESC键可以退出console窗口。

在console窗口中，键入一行代码，然后按回车键，会显示运行结果。如果要输入多行代码，则每一行之间用shift+回车键进行换行。

## 方法

console对象有一些内置方法，可供使用。

### clear

该方法用于对console窗口进行清屏。

{% highlight javascript %}

console.clear();

{% endhighlight %}

### log

该方法用于在console窗口显示信息，格式如下。

{% highlight javascript %}

console.log(object[, object, ...])

{% endhighlight %}

使用的时候，有两种方法。

一种是使用格式字符。

{% highlight javascript %}

console.log("The %s jumped over %d tall buildings", animal, count);

{% endhighlight %}

%s表示字符串的占位符，其他占位符还有

- %d, %i 整数
- %f 浮点数
- %o 对象的链接
- %c CSS格式字符串

另一种是不使用格式字符串。

{% highlight javascript %}

console.log("The", animal, "jumped over", count, "tall buildings");

{% endhighlight %}

这两种方法可以结合在一起使用。

{% highlight javascript %}

console.log("I am %s and I have:", myName, thing1, thing2, thing3);

{% endhighlight %}

### debug，info，warn，error

这四个方法的作用与log相同，都是显示信息。

其中，debug和info等同于log方法，warn方法在信息的最前面加一个黄色三角，error则添加一个红色大叉。

{% highlight javascript %}

console.error("Error: %s (%i)", "Server is  not responding",500);

console.warn('Warning! Too few nodes (%d)', a.childNodes.length);

{% endhighlight %}

### assert

assert用来验证某个条件是否为真。如果为假，则显示一条事先指定的错误信息。它的格式如下：

{% highlight javascript %}

console.assert(expression[, object, ...])

{% endhighlight %}

使用方法如下：

{% highlight javascript %}

console.assert(list.childNodes.length < 500, "Node count is > 500");

{% endhighlight %}

### group，groupend

这两个方法用于将显示的信息分组。

{% highlight javascript %}

console.group("Authenticating user '%s'", user);
console.log("User authenticated");
console.groupEnd();

{% endhighlight %}

### dir

该方法用于显示一个对象的所有属性。

{% highlight javascript %}

console.dir(document.body.firstElementChild);

{% endhighlight %}

### time，timeEnd

这两个方法用于计算一个操作所花费的时间。

{% highlight javascript %}

console.time("Array initialize");
var array= new Array(1000000);
for (var i = array.length - 1; i >= 0; i--) {
    array[i] = new Object();
};
console.timeEnd("Array initialize");

{% endhighlight %}

## 参考链接

- Chrome Developer Tools, [Using the Console](https://developers.google.com/chrome-developer-tools/docs/console)
- Firebug Wiki, [Console API](https://getfirebug.com/wiki/index.php/Console_API)

