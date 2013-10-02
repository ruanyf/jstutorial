---
title: console对象
layout: page
category: tool
date: 2013-03-10
modifiedOn: 2013-10-02
---

## 概述

各大浏览器内置的开发工具，都提供了一个console对象。它主要有两个作用：

- 显示网页代码运行时的错误信息。

- 提供了一个命令行接口，用来与网页代码互动。

以chrome浏览器为例，打开console窗口，有两种方法：

- **快捷键**：Command+Option+J（Mac系统） 或者 Control+Shift+J（Windows/Linux系统）。

- **菜单**：工具 > JavaScript控制台。

按ESC键可以退出console窗口。

在console窗口中，键入一行代码，然后按回车键，会显示运行结果。如果要输入多行代码，则每一行之间用shift+回车键进行换行。

## 方法

console对象有如下内置方法，可供使用。

### log

log方法用于在console窗口显示信息。

如果参数是普通字符串，log方法将字符串内容显示在console窗口。

{% highlight javascript %}

console.log("Hello World")
// Hello World

console.log("a","b","c")
// a b c

{% endhighlight %}

如果参数是格式字符串（使用了格式占位符），log方法将占位符替换以后的内容，显示在console窗口。

{% highlight javascript %}

console.log(" %s + %s = %s", 1, 1, 2)
//  1 + 1 = 2

{% endhighlight %}

上面代码的%s表示字符串的占位符，其他占位符还有

- %d, %i 整数
- %f 浮点数
- %o 对象的链接
- %c CSS格式字符串

log方法的两种参数格式，可以结合在一起使用。

{% highlight javascript %}

console.log(" %s + %s ", 1, 1, "= 2")
// 1 + 1  = 2

{% endhighlight %}

### debug，info，warn，error方法

这四个方法的作用与log相同，都是显示信息：debug和info方法等同于log方法，warn方法在信息的最前面加一个黄色三角，error方法则在信息的最前面添加一个红色大叉。

{% highlight javascript %}

console.error("Error: %s (%i)", "Server is not responding",500)
// Error: Server is not responding (500)

console.warn('Warning! Too few nodes (%d)', document.childNodes.length)
// Warning! Too few nodes (1)

{% endhighlight %}

### assert方法

assert方法用来验证某个条件是否为真。如果为假，则显示一条事先指定的错误信息。它的格式如下：

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

### dir方法

dir方法用于显示一个对象的所有属性。

{% highlight javascript %}

var o = {p:1};

console.dir(o)
// Object

{% endhighlight %}

上面代码最后输出的Object是一个链接，点击显示对象o的所有属性。

### time和timeEnd方法

这两个方法用于计时，可以算出一个操作所花费的准确时间。

{% highlight javascript %}

console.time("Array initialize");

var array= new Array(1000000);
for (var i = array.length - 1; i >= 0; i--) {
    array[i] = new Object();
};

console.timeEnd("Array initialize");

// Array initialize: 1914.481ms

{% endhighlight %}

time方法表示计时开始，timeEnd方法表示计时结束。它们的参数是计时器的名称。调用timeEnd方法之后，console窗口会显示“计时器名称: 所耗费的时间”。

### 其他方法

- **clear方法**：对console窗口进行清屏，光标回到第一行。

- **trace方法**：当前执行的代码在堆栈中的调用路径。

## 参考链接

- Chrome Developer Tools, [Using the Console](https://developers.google.com/chrome-developer-tools/docs/console)
- Firebug Wiki, [Console API](https://getfirebug.com/wiki/index.php/Console_API)

