---
title: window对象
layout: page
category: bom
date: 2013-09-19
modifiedOn: 2014-01-12
---

## 概述

JavaScript的所有对象都存在于一个运行环境之中，这个运行环境本身也是对象，称为“顶层对象”。这就是说，JavaScript的所有对象，都是“顶层对象”的下属。不同的运行环境有不同的“顶层对象”，在浏览器环境中，这个顶层对象就是`window`对象（w为小写）。

所有浏览器环境的全局变量，都是window对象的属性。

```javascript
var a = 1;
window.a // 1
```

可以简单理解成，`window`就是指当前的浏览器窗口。

只要指定某个`window`或帧框（frame）的名字，就可以从这个全局对象读取该窗口的全局变量。比如，某个文档存在一个全局变量`x`，就可以从iframe的`parent.x`读取该全局变量。

## window对象的属性

### window.name属性

window.name属性用于设置当前浏览器窗口的名字。它有一个特点，就是浏览器刷新后，该属性保持不变。所以，可以把值存放在该属性内，然后跨页面、甚至跨域名使用。当然，这个值有可能被其他网站的页面改写。

{% highlight javascript %}

window.name = "Hello World!";
console.log(window.name);

{% endhighlight %}

各个浏览器对这个值的储存容量有所不同，但是一般来说，可以高达几MB。

该属性只能保存字符串，且当浏览器窗口关闭后，所保存的值就会消失。因此局限性比较大，但是与iFrame窗口通信时，非常有用。

### window.innerHeight属性，window.innerWidth属性

这两个属性返回网页的CSS布局占据的浏览器窗口的高度和宽度，单位为像素。很显然，当用户放大网页的时候（比如将网页从100%的大小放大为200%），这两个属性会变小。

注意，这两个属性值包括滚动条的高度和宽度。

### window.pageXOffset属性，window.pageYOffset属性

window.pageXOffset属性返回页面的水平滚动距离，window.pageYOffset属性返回页面的垂直滚动距离。这两个属性的单位为像素。

### iframe元素

window.frames返回一个类似数组的对象，成员为页面内的所有框架，包括`frame`元素和`iframe`元素。需要注意的是，`window.frames`的每个成员对应的是框架内的窗口（即框架的window对象），获取每个框架的DOM树，需要使用`window.frames[0].document`。

```javascript
var iframe = window.getElementsByTagName("iframe")[0];
var iframe_title = iframe.contentWindow.title;
```

上面代码用于获取框架页面的标题。

`iframe`元素遵守同源政策，只有当父页面与框架页面来自同一个域名，两者之间才可以用脚本通信，否则只有使用window.postMessage方法。

在iframe框架内部，使用window.parent指向父页面。

### Navigator对象

Window对象的Navigator属性，指向一个包含浏览器相关信息的对象。

**（1）Navigator.userAgent属性**

Navigator.userAgent属性返回浏览器的User-Agent字符串，用来标示浏览器的种类。下面是Chrome浏览器的User-Agent。

{% highlight javascript %}

navigator.userAgent
// "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safari/537.36"

{% endhighlight %}

通过userAgent属性识别浏览器，不是一个好办法。因为必须考虑所有的情况（不同的浏览器，不同的版本），非常麻烦，而且无法保证未来的适用性，更何况各种上网设备层出不穷，难以穷尽。所以，现在一般不再识别浏览器了，而是使用“功能识别”方法，即逐一测试当前浏览器是否支持要用到的JavaScript功能。

不过，通过userAgent可以大致准确地识别手机浏览器，方法就是测试是否包含“mobi”字符串。

{% highlight javascript %}

var ua = navigator.userAgent.toLowerCase();
 
if (/mobi/i.test(ua)) {
    // 手机浏览器
} else {
    // 非手机浏览器
}

{% endhighlight %}

如果想要识别所有移动设备的浏览器，可以测试更多的特征字符串。

{% highlight javascript %}

/mobi|android|touch|mini/i.test(ua)

{% endhighlight %}

**（2）navigator.plugins属性**

navigator.plugins属性返回一个类似数组的对象，成员是浏览器安装的插件，比如Flash、ActiveX等。

### screen对象

screen对象包含了显示设备的信息。

```javascript

// 显示设备的高度，单位为像素
screen.height
// 1920

// 显示设备的宽度，单位为像素
screen.width
// 1080

```

一般使用以上两个属性，了解设备的分辨率。上面代码显示，某设备的分辨率是1920x1080。

除非调整显示器的分辨率，否则这两个值可以看作常量，不会发生变化。显示器的分辨率与浏览器设置无关，缩放网页并不会改变分辨率。

下面是根据屏幕分辨率，将用户导向不同网页的代码。

{% highlight javascript %}

if ((screen.width<=800) && (screen.height<=600)) {
	window.location.replace('small.html');
} else {
	window.location.replace('wide.html');
}

{% endhighlight %}

## window对象的方法

### URL的编码/解码方法

JavaScript提供四个URL的编码/解码方法。

- decodeURI()
- decodeURIComponent()
- encodeURI()
- encodeURIComponent()

### window.getComputedStyle方法

getComputedStyle方法接受一个HTML元素作为参数，返回一个包含该HTML元素的最终样式信息的对象。详见《DOM》一章的CSS章节。

### window.matchMedia方法

window.matchMedia方法用来检查CSS的mediaQuery语句。详见《DOM》一章的CSS章节。

## window对象的事件

### window.onerror

浏览器脚本发生错误时，会触发window对象的error事件。我们可以通过`window.onerror`属性对该事件指定回调函数。

```javascript

window.onerror = function (message, filename, lineno, colno, error) {
    console.log("出错了！--> %s", error.stack);
};

```

error事件的回调函数，一共可以有五个参数，它们的含义依次如下。

- 出错信息
- 出错脚本的网址
- 行号
- 列号
- 错误对象

老式浏览器只支持前三个参数。

需要注意的是，如果脚本网址与网页网址不在同一个域（比如使用了CDN），浏览器根本不会提供详细的出错信息，只会提示出错，错误类型是“Script error.”，行号为0，其他信息都没有。这是浏览器防止向外部脚本泄漏信息。一个解决方法是在脚本所在的服务器，设置Access-Control-Allow-Origin的HTTP头信息。


```bash

Access-Control-Allow-Origin:*

```

然后，在网页的script标签中设置crossorigin属性。

```html
<script crossorigin="anonymous" src="//example.com/file.js"></script>
```

上面代码的`crossorigin="anonymous"`表示，读取文件不需要身份信息，即不需要cookie和HTTP认证信息。如果设为`crossorigin="use-credentials"`，就表示浏览器会上传cookie和HTTP认证信息，同时还需要服务器端打开HTTP头信息Access-Control-Allow-Credentials。

并不是所有的错误，都会触发JavaScript的error事件（即让JavaScript报错），只限于以下三类事件。

- JavaScript语言错误
- JavaScript脚本文件不存在
- 图像文件不存在

以下两类事件不会触发JavaScript的error事件。

- CSS文件不存在
- iframe文件不存在

## alert()，prompt()，confirm()

alert()、prompt()、confirm()都是浏览器用来与用户互动的方法。它们会弹出不同的对话框，要求用户做出回应。

需要注意的是，alert()、prompt()、confirm()这三个方法弹出的对话框，都是浏览器统一规定的式样，是无法定制的。

alert方法弹出的对话框，只有一个“确定”按钮，往往用来通知用户某些信息。

```javascript

// 格式
alert(message);

// 实例
alert("Hello World");

```

用户只有点击“确定”按钮，对话框才会消失。在对话框弹出期间，浏览器窗口处于冻结状态，如果不点“确定”按钮，用户什么也干不了。

prompt方法弹出的对话框，在提示文字的下方，还有一个输入框，要求用户输入信息，并有“确定”和“取消”两个按钮。它往往用来获取用户输入的数据。

```javascript

// 格式
var result = prompt(text[, default]);

// 实例
var result = prompt('您的年龄？', 25)

```

上面代码会跳出一个对话框，文字提示为“您的年龄？”，要求用户在对话框中输入自己的年龄（默认显示25）。

prompt方法的返回值是一个字符串（有可能为空）或者null，具体分成三种情况。

1. 用户输入信息，并点击“确定”，则用户输入的信息就是返回值。
2. 用户没有输入信息，直接点击“确定”，则输入框的默认值就是返回值。
3. 用户点击了“取消”（或者按了Escape按钮），则返回值是null。

prompt方法的第二个参数是可选的，但是如果不提供的话，IE浏览器会在输入框中显示undefined。因此，最好总是提供第二个参数，作为输入框的默认值。

confirm方法弹出的对话框，除了提示信息之外，只有“确定”和“取消”两个按钮，往往用来征询用户的意见。

```javascript
// 格式
var result = confirm(message);

// 实例
var result = confirm("你最近好吗？");
```

上面代码弹出一个对话框，上面只有一行文字“你最近好吗？”，用户选择点击“确定”或“取消”。

confirm方法返回一个布尔值，如果用户点击“确定”，则返回true；如果用户点击“取消”，则返回false。

## 参考链接

- Karl Dubost, [User-Agent detection, history and checklist](https://hacks.mozilla.org/2013/09/user-agent-detection-history-and-checklist/)
- Conrad Irwin, [JS stacktraces. The good, the bad, and the ugly](https://bugsnag.com/blog/js-stacktraces/)
- Daniel Lee, [How to catch JavaScript Errors with window.onerror (even on Chrome and Firefox)](http://danlimerick.wordpress.com/2014/01/18/how-to-catch-javascript-errors-with-window-onerror-even-on-chrome-and-firefox/)
