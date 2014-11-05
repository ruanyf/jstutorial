---
title: console对象
layout: page
category: tool
date: 2013-03-10
modifiedOn: 2013-12-03
---

console对象是JavaScript的原生对象，它的作用有点像Unix系统的标准输出stdout和标准错误stderr，在浏览器中，代表了JavaScript控制台。它的作用主要有两个。

- 显示网页代码运行时的错误信息。

- 提供了一个命令行接口，用来与网页代码互动。

console对象提供了很多方法，可供开发者调用。

## 开发者工具

与console对象互动，需要通过浏览器自带的开发工具，以Chrome浏览器的“开发者工具”（Developer Tools）为例，打开它的方法有三种。

1. 按F12或者Control+Shift+i。

2. 在菜单中选择“工具”/“开发者工具”。

3. 在一个页面元素上，打开右键菜单，选择其中的“Inspect Element”。

![开发者工具](https://developers.google.com/chrome-developer-tools/images/image03.png)

打开“开发者工具”以后，可以看到在顶端有八个面板卡可供选择，分别是：

- **Elements**：用来调试网页的HTML源码和CSS代码。

- **Resources**：查看网页加载的各种资源文件（比如代码文件、字体文件、css文件等），以及在硬盘上创建的各种内容（比如本地缓存、Cookie、Local Storage等）。

- **Network**：查看网页的HTTP通信情况。

- **Sources**：调试JavaScript代码。

- **Timeline**：查看各种网页行为随时间变化的情况。

- **Profiles**：查看网页的性能情况，比如CPU和内存消耗。

- **Audits**：提供网页优化的建议。

- **Console**：用来运行JavaScript命令。

这八个面板都有各自的用途，以下都针对Console面板，也就是控制台。这个面板基本上就是一个命令行窗口，你可以在提示符下，键入各种命令。

下面介绍console对象提供的各种方法。

## console.log()，console.info()，console.debug()

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

```javascript

console.log(" %s + %s ", 1, 1, "= 2")
// 1 + 1  = 2

```

如果参数是一个对象，console.log会显示该对象的值。

```javascript

console.log({foo: 'bar'})
// Object {foo: "bar"} 

console.log(Date)
// function Date() { [native code] } 

```

上面代码输出Date对象的值，结果为一个构造函数。

console.info()和console.debug()都是console.log方法的别名，它们完全一样。

console对象的所有方法，都可以被覆盖。因此，可以按照自己的需要，定义console.log方法。

```javascript

["log", "info", "warn", "error"].forEach(function(method) {
    console[method] = console[method].bind(
        console,
        new Date().toISOString()
    );
});

console.log("出错了！");
// 2014-05-18T09:00.000Z 出错了！

```

上面代码表示，使用自定义的console.log方法，可以在显示结果添加当前时间。

## console.warn()，console.error()

warn方法和error方法也是输出信息，它们与log方法的不同之处在于，warn方法输出信息时，在最前面加一个黄色三角，表示警告；error方法输出信息时，在最前面加一个红色的叉，表示出错。其他用法都一样。

{% highlight javascript %}

console.error("Error: %s (%i)", "Server is not responding",500)
// Error: Server is not responding (500)

console.warn('Warning! Too few nodes (%d)', document.childNodes.length)
// Warning! Too few nodes (1)

{% endhighlight %}

本质上，log方法是写入标准输出（stdout），warn方法和error方法是写入标准错误（stderr）。

## console.table()

对于某些复合类型的数据，console.table方法可以将其转为表格显示。

{% highlight javascript %}

var languages = [
    { name: "JavaScript", fileExtension: ".js" },
    { name: "TypeScript", fileExtension: ".ts" },
    { name: "CoffeeScript", fileExtension: ".coffee" }
];

console.table(languages);

{% endhighlight %}

上面代码的language，转为表格显示如下。

(index)|name|fileExtension
-------|----|-------------
0|"JavaScript"|".js"
1|"TypeScript"|".ts"
2|"CoffeeScript"|".coffee"

复合型数据转为表格显示的条件是，必须拥有主键。对于上面的数组来说，主键就是数字键。对于对象来说，主键就是它的最外层键。

{% highlight javascript %}

var languages = {
    csharp: { name: "C#", paradigm: "object-oriented" },
    fsharp: { name: "F#", paradigm: "functional" }
};

console.table(languages);

{% endhighlight %}

上面代码的language，转为表格显示如下。

(index)|name|paradigm
-------|----|--------
csharp|"C#"|"object-oriented"
fsharp|"F#"|"functional"

## console.dir()

dir方法用来对一个对象进行检查（inspect），并以易于阅读和打印的格式显示。

```javascript

console.dir({foo: 'bar'})
> Object
>  foo: "bar"
>  __proto__: Object
 
```

上面代码显示dir方法的参数属于Object，该对像有一个属性foo，以及一个指向原型对象的\__proto\__的属性。

## console.assert()

console.assert方法用来验证某个条件是否为真。如果为假，则显示一条事先指定的错误信息。它的格式如下。

{% highlight javascript %}

// 用法格式
console.assert(条件判断，输出信息)

// 实例
console.assert(true === false,"判断条件不成立")
// Assertion failed: 判断条件不成立

{% endhighlight %}

上面代码表明，assert方法的第一个参数是判断条件，第二个参数是一个字符串，当判断条件不成立时，这个字符串就会显示。

下面是另一个例子，判断子节点的个数是否大于等于500。

{% highlight javascript %}

console.assert(list.childNodes.length < 500, "节点个数大于等于500")

{% endhighlight %}

## console.time()，console.timeEnd()

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

## console.profile()，console.profileEnd()

console.profile方法用来新建一个性能测试器（profile），它的参数是性能测试器的名字。

```javascript

console.profile('p')
// Profile 'p' started. 

```

console.profileEnd方法用来结束正在运行的性能测试器。

```javascript

console.profileEnd()
// Profile 'p' finished. 
    
```

打开浏览器的开发者工具，在profile面板中，可以看到这个性能调试器的运行结果。

## console.group()，console.groupend()

这两个方法用于将显示的信息分组。它只在输出大量信息时有用，分在一组的信息，可以用鼠标折叠/展开。

## 其他方法

- **console.dir()**：输出对象的信息，用于显示一个对象的所有属性。

- **console.clear()**：对console窗口进行清屏，光标回到第一行。

- **console.trace()**：当前执行的代码在堆栈中的调用路径。

## 命令行API

在控制台中，除了使用console对象，还可以使用一些控制台自带的命令行方法。

（1）$_ 

$_属性返回上一个表达式的值。

{% highlight javascript %}

2+2
// 4
$_
// 4

{% endhighlight %}

（2）$0 - $4 

控制台保存了最近5个在Elements面板选中的DOM元素，$0代表倒数第一个，$1代表倒数第二个，以此类推直到$4。

（3）$(selector) 

$(selector)返回一个数组，包括特定的CSS选择器匹配的所有DOM元素。该方法实际上是document.querySelectorAll方法的别名。

{% highlight javascript %}

var images = $('img');
for (each in images) {
    console.log(images[each].src);
}

{% endhighlight %}

上面代码打印出网页中所有img元素的src属性。

（4）$$(selector)

$$(selector)返回一个选中的DOM对象，等同于document.querySelectorAll。

（5）$x(path) 

$x(path)方法返回一个数组，包含匹配特定XPath表达式的所有DOM元素。

{% highlight javascript %}

$x("//p[a]")

{% endhighlight %}

上面代码返回所有包含a元素的p元素。

（6）inspect(object) 

inspect(object)方法打开相关面板，并选中相应的元素：DOM元素在Elements面板中显示，JavaScript对象在Profiles中显示。

（7）getEventListeners(object)

getEventListeners(object)方法返回一个对象，该对象的成员为登记了回调函数的各种事件（比如click或keydown），每个事件对应一个数组，数组的成员为该事件的回调函数。

（8）keys(object)，values(object)

keys(object)方法返回一个数组，包含特定对象的所有键名。

values(object)方法返回一个数组，包含特定对象的所有键值。

{% highlight javascript %}

var o = {'p1':'a', 'p2':'b'};

keys(o)
// ["p1", "p2"]
values(o)
// ["a", "b"]

{% endhighlight %}

（9）monitorEvents(object[, events]) ，unmonitorEvents(object[, events])

monitorEvents(object[, events])方法监听特定对象上发生的特定事件。当这种情况发生时，会返回一个Event对象，包含该事件的相关信息。unmonitorEvents方法用于停止监听。

{% highlight javascript %}

monitorEvents(window, "resize");

monitorEvents(window, ["resize", "scroll"])

{% endhighlight %}

上面代码分别表示单个事件和多个事件的监听方法。

{% highlight javascript %}

monitorEvents($0, "mouse");
unmonitorEvents($0, "mousemove");

{% endhighlight %}

上面代码表示如何停止监听。

monitorEvents允许监听同一大类的事件。所有事件可以分成四个大类。

- mouse："mousedown", "mouseup", "click", "dblclick", "mousemove", "mouseover", "mouseout", "mousewheel"
- key："keydown", "keyup", "keypress", "textInput"
- touch："touchstart", "touchmove", "touchend", "touchcancel"
- control："resize", "scroll", "zoom", "focus", "blur", "select", "change", "submit", "reset"

{% highlight javascript %}

monitorEvents($("#msg"), "key");

{% endhighlight %}

上面代码表示监听所有key大类的事件。

（10）profile([name])，profileEnd()

profile方法用于启动一个特定名称的CPU性能测试，profileEnd方法用于结束该性能测试。

{% highlight javascript %}

profile("My profile")

profileEnd("My profile")

{% endhighlight %}

（11）其他方法

命令行API还提供以下方法。

- clear()方法清除控制台的历史。
- copy(object)方法复制特定DOM元素到剪贴板。
- dir(object)方法显示特定对象的所有属性，是console.dir方法的别名。
- dirxml(object)方法显示特定对象的XML形式，是console.dirxml方法的别名。

## debugger语句

debugger语句必须与除错工具配合使用，如果没有除错工具，debugger语句不会产生任何结果。

在chrome浏览器中，当代码运行到debugger指定的行时，就会暂停运行，自动打开console界面。它的作用类似于设置断点。

{% highlight javascript %}

for(var i = 0;i<5;i++){
	console.log(i);
	if (i===2) debugger;
}

{% endhighlight %}

上面代码打印出0，1，2以后，就会暂停，自动打开console窗口，等待进一步处理。

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
- Axel Rauschmayer, [The JavaScript console API](http://www.2ality.com/2013/10/console-api.html)
- Marius Schulz, [Advanced JavaScript Debugging with console.table()](http://blog.mariusschulz.com/2013/11/13/advanced-javascript-debugging-with-consoletable)
- Google Developer, [Command Line API Reference](https://developers.google.com/chrome-developer-tools/docs/commandline-api)
