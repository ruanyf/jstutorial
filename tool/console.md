---
title: Chrome开发者工具和console对象
layout: page
category: tool
date: 2013-03-10
modifiedOn: 2013-10-06
---

## 开发者工具

Chrome浏览器自带的“开发者工具”（Developer Tools），是网页开发调试的利器。打开它的方法有三种：

1. 按F12或者Control+Shift+i。

2. 在菜单中选择“工具”/“开发者工具”。

3. 在一个页面元素上，打开右键菜单，选择其中的“Inspect Element”。

![开发者工具](https://developers.google.com/chrome-developer-tools/images/image03.png)

打开以后，可以看到在顶端有八个面板卡可供选择，分别是：

- **Elements**：用来调试网页的HTML源码和CSS代码。

- **Resources**：查看网页加载的各种资源文件（比如代码文件、字体文件、css文件等），以及在硬盘上创建的各种内容（比如本地缓存、Cookie、Local Storage等）。

- **Network**：查看网页的HTTP通信情况。

- **Sources**：调试JavaScript代码。

- **Timeline**：查看各种网页行为随时间变化的情况。

- **Profiles**：查看网页的性能情况，比如CPU和内容消耗。

- **Audits**：提供网页优化的建议。

- **Console**：用来运行JavaScript命令。

这八个面板都有各自的用途，以下详细介绍Console面板。

## console对象

目前，各大浏览器的JavaScript引擎都原生提供一个console对象，用来代表浏览器的JavaScript控制窗口。Chrome浏览器的console对象，就是指开发者工具中的Console窗口。

console对象主要有两个作用：

- 显示网页代码运行时的错误信息。

- 提供了一个命令行接口，用来与网页代码互动。

console对象的接口有很多方法，可供开发者调用。

### console.log方法

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

### 其他输出方法：debug，info，warn，error方法

除了log，console对象还有四个输出信息的方法：

- **debug**：等同于log。

- **info**：等同于log。

- **warn**：输出信息时，在最前面加一个黄色三角，表示警告。

- **error**：输出信息时，在最前面加一个红色的叉，表示出错。

这四个方法的用法与log完全一样。

{% highlight javascript %}

console.error("Error: %s (%i)", "Server is not responding",500)
// Error: Server is not responding (500)

console.warn('Warning! Too few nodes (%d)', document.childNodes.length)
// Warning! Too few nodes (1)

{% endhighlight %}

### console.assert方法

assert方法用来验证某个条件是否为真。如果为假，则显示一条事先指定的错误信息。它的格式如下：

{% highlight javascript %}

console.assert(条件判断，输出信息)

{% endhighlight %}

使用方法如下：

{% highlight javascript %}

console.assert(list.childNodes.length < 500, "Node count is > 500");

{% endhighlight %}

### 分组方法：group和groupend

这两个方法用于将显示的信息分组。

{% highlight javascript %}

console.group("Authenticating user '%s'", user);
console.log("User authenticated");
console.groupEnd();

{% endhighlight %}

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

- **console.dir**：输出对象的信息，用于显示一个对象的所有属性。

- **console.clear**：对console窗口进行清屏，光标回到第一行。

- **console.trace**：当前执行的代码在堆栈中的调用路径。

## 移动端开发

（本节暂存此处）

### 模拟手机视口（viewport）

chrome浏览器的开发者工具，提供一个选项，可以模拟手机屏幕的显示效果。

打开“设置”的Overrides面板，选择相应的User Agent和Device Metrics选项。

![选择User Agent](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation/image_3.png)

User Agent可以使得当前浏览器发出手机浏览器的Agent字符串，Device Metrics则使得当前浏览器的视口变为手机的视口大小。这两个选项可以独立选择，不一定同时选中。

### 模拟touch事件

我们可以在PC端模拟JavaScript的touch事件。

首先，打开chrome浏览器的开发者工具，选择“设置”中的Overrides面板，勾选“Enable touch events”选项。

![Enable touch events的图片](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation/image_0.png)

然后，鼠标就会触发touchstart、touchmove和touchend事件。（此时，鼠标本身的事件依然有效。）

至于多点触摸，必须要有支持这个功能的设备才能模拟，具体可以参考[Multi-touch web development](http://www.html5rocks.com/en/mobile/touch/)。

### 模拟经纬度

chrome浏览器的开发者工具，还可以模拟当前的经纬度数据。打开“设置”的Overrides面板，选中Override Geolocation选项，并填入相应经度和纬度数据。

![模拟经纬度](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation/image_11.png)

### 远程除错

(1) Chrome for Android

Android设备上的Chrome浏览器支持USB除错。PC端需要安装Android SDK和Chrome浏览器，然后用usb线将手机和PC连起来，可参考[官方文档](https://developers.google.com/chrome-developer-tools/docs/remote-debugging)。

(2) Opera

Opera浏览器的除错环境Dragonfly支持远程除错（[教程](http://www.codegeek.net/blog/2012/mobile-debugging-with-opera-dragonfly/)）。

(3) Firefox for Android 

参考[官方文档](https://hacks.mozilla.org/2012/08/remote-debugging-on-firefox-for-android/)。

(4) Safari on iOS6

你可以使用Mac桌面电脑的Safari 6浏览器，进行远程除错（[教程](http://www.mobilexweb.com/blog/iphone-5-ios-6-html5-developers)）。 

## Google Closure

（本节暂存此处）

Google Closure是Google提供的一个JavaScript源码处理工具，主要用于压缩和合并多个JavaScript脚本文件。

Google Closure使用Java语言开发，使用之前必须先安装Java。然后，前往[官方网站](https://developers.google.com/closure/)进行下载，这里我们主要使用其中的编译器（compiler）。

首先，查看使用帮助。

{% highlight bash %}

java -jar /path/to/closure/compiler.jar --help

{% endhighlight %}

直接在脚本命令后面跟上要合并的脚本，就能完成合并。

{% highlight bash %}

java -jar /path/to/closure/compiler.jar *.js

{% endhighlight %}

使用--js参数，可以确保按照参数的先后次序合并文件。

{% highlight bash %}

java -jar /path/to/closure/compiler.jar --js script1.js --js script2.js --js script3.js

{% endhighlight %}

但是，这样的运行结果是将合并后的文件全部输出到屏幕（标准输出），因此需要使用--js_output_file参数，指定合并后的文件名。

{% highlight bash %}

java -jar /path/to/closure/compiler.jar --js script1.js --js script2.js --js script3.js --js_output_file scripts-compiled.js

{% endhighlight %}

## Javascript 性能测试

(本节暂存此处)

### 第一种做法

最常见的测试性能的做法，就是同一操作重复n次，然后计算每次操作的平均时间。

{% highlight javascript %}

var totalTime,
    start = new Date,
    iterations = 6;

while (iterations--) {
  // Code snippet goes here
}

// totalTime → the number of milliseconds it took to execute
// the code snippet 6 times
totalTime = new Date - start;

{% endhighlight %}

上面代码的问题在于，由于计算机的性能不断提高，如果只重复6次，很可能得到0毫秒的结果，即不到1毫秒，Javascript引擎无法测量。

### 第二种做法

另一种思路是，测试单位时间内完成了多少次操作。

{% highlight javascript %}

var hz,
    period,
    startTime = new Date,
    runs = 0;

do {
  // Code snippet goes here
  runs++;
  totalTime = new Date - startTime;
} while (totalTime < 1000);

// convert ms to seconds
totalTime /= 1000;

// period → how long per operation
period = totalTime / runs;

// hz → the number of operations per second
hz = 1 / period;

// can be shortened to
// hz = (runs * 1000) / totalTime;

{% endhighlight %}

这种做法的注意之处在于，测试结构受外界环境影响很大，为了得到正确结构，必须重复多次。

## 参考链接

- Chrome Developer Tools, [Using the Console](https://developers.google.com/chrome-developer-tools/docs/console)
- Firebug Wiki, [Console API](https://getfirebug.com/wiki/index.php/Console_API)

