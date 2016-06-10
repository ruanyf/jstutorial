---
title: window对象
layout: page
category: bom
date: 2013-09-19
modifiedOn: 2014-01-12
---

## 概述

JavaScript的所有对象都存在于一个运行环境之中，这个运行环境本身也是对象，称为“顶层对象”。这就是说，JavaScript的所有对象，都是“顶层对象”的下属。不同的运行环境有不同的“顶层对象”，在浏览器环境中，这个顶层对象就是`window`对象（`w`为小写）。

所有浏览器环境的全局变量，都是`window`对象的属性。

```javascript
var a = 1;
window.a // 1
```

上面代码中，变量`a`是一个全局变量，但是实质上它是`window`对象的属性。声明一个全局变量，就是为`window`对象的同名属性赋值。

可以简单理解成，`window`就是指当前的浏览器窗口。

从语言设计的角度看，所有变量都是`window`对象的属性，其实不是很合理。因为`window`对象有自己的实体含义，不适合当作最高一层的顶层对象。这个设计失误与JavaScript语言匆忙的设计过程有关，最早的设想是语言内置的对象越少越好，这样可以提高浏览器的性能。因此，语言设计者Brendan Eich就把`window`对象当作顶层对象，所有未声明就赋值的变量都自动变成`window`对象的属性。这种设计使得编译阶段无法检测未声明变量，但到了今天已经没有办法纠正了。

## 窗口的大小和位置

浏览器提供一系列属性，用来获取浏览器窗口的大小和位置。

（1）window.screenX，window.screenY

`window.screenX`和`window.screenY`属性，返回浏览器窗口左上角相对于当前屏幕左上角（`(0, 0)`）的水平距离和垂直距离，单位为像素。

（2）window.innerHeight，window.innerWidth

`window.innerHeight`和`window.innerWidth`属性，返回网页在当前窗口中可见部分的高度和宽度，即“视口”（viewport），单位为像素。

当用户放大网页的时候（比如将网页从100%的大小放大为200%），这两个属性会变小。因为这时网页的像素大小不变，只是每个像素占据的屏幕空间变大了，因为可见部分（视口）就变小了。

注意，这两个属性值包括滚动条的高度和宽度。

（3）window.outerHeight，window.outerWidth

`window.outerHeight`和`window.outerWidth`属性返回浏览器窗口的高度和宽度，包括浏览器菜单和边框，单位为像素。

（4）window.pageXOffset属性，window.pageYOffset属性

`window.pageXOffset`属性返回页面的水平滚动距离，`window.pageYOffset`属性返回页面的垂直滚动距离，单位都为像素。

## window对象的属性

### window.closed

`window.closed`属性返回一个布尔值，表示指定窗口是否关闭，通常用来检查通过脚本新建的窗口。

```javascript
popup.closed // false
```

上面代码检查跳出窗口是否关闭。

### window.opener

`window.opener`属性返回打开当前窗口的父窗口。如果当前窗口没有父窗口，则返回`null`。

```javascript
var windowA = window.opener;
```

通过`opener`属性，可以获得父窗口的的全局变量和方法，比如`windowA.window.propertyName`和`windowA.window.functionName()`。

该属性只适用于两个窗口属于同源的情况（参见《[同源政策](/bom/same-origin.html)》一节），且其中一个窗口由另一个打开。

### window.name

`window.name`属性用于设置当前浏览器窗口的名字。

```javascript
window.name = 'Hello World!';
console.log(window.name)
// "Hello World!"
```

各个浏览器对这个值的储存容量有所不同，但是一般来说，可以高达几MB。

它有一个重要特点，就是只要是本窗口打开的网页，都能读写该属性，不管这些网页是否属于同一个网站。所以，可以把值存放在该属性内，然后让另一个网页读取，从而实现跨域通信（详见《[同源政策](/bom/same-origin.html)》一节）。

该属性只能保存字符串，且当浏览器窗口关闭后，所保存的值就会消失。因此局限性比较大，但是与iframe窗口通信时，非常有用。

### window.location

`window.location`返回一个`location`对象，用于获取窗口当前的URL信息。它等同于`document.location`对象。

```javascript
window.location === document.location // true
```

## 框架窗口

`window.frames`属性返回一个类似数组的对象，成员为页面内所有框架窗口，包括`frame`元素和`iframe`元素。`window.frames[0]`表示页面中第一个框架窗口，`window.frames['someName']`则是根据框架窗口的`name`属性的值（不是`id`属性），返回该窗口。另外，通过`document.getElementById()`方法也可以引用指定的框架窗口。

```javascript
var frame = document.getElementById('theFrame');
var frameWindow = frame.contentWindow;

// 等同于 frame.contentWindow.document
var frameDoc = frame.contentDocument;

// 获取子窗口的变量和属性
frameWindow.function()
```

`window.length`属性返回当前页面中所有框架窗口总数。

```javascript
window.frames.length === window.length // true
```

`window.frames.length`与`window.length`应该是相等的。

由于传统的`frame`窗口已经不建议使用了，这里主要介绍`iframe`窗口。

需要注意的是，`window.frames`的每个成员对应的是框架内的窗口（即框架的`window`对象）。如果要获取每个框架内部的DOM树，需要使用`window.frames[0].document`的写法。

```javascript
var iframe = window.getElementsByTagName('iframe')[0];
var iframe_title = iframe.contentWindow.title;
```

上面代码用于获取`iframe`页面的标题。

`iframe`元素遵守同源政策，只有当父页面与框架页面来自同一个域名，两者之间才可以用脚本通信，否则只有使用window.postMessage方法。

`iframe`窗口内部，使用`window.parent`引用父窗口。如果当前页面没有父窗口，则`window.parent`属性返回自身。因此，可以通过`window.parent`是否等于`window.self`，判断当前窗口是否为`iframe`窗口。

```javascript
if (window.parent != window.self) {
  // 当前窗口是子窗口
}
```

## navigator对象

Window对象的navigator属性，指向一个包含浏览器相关信息的对象。

**（1）navigator.userAgent属性**

navigator.userAgent属性返回浏览器的User-Agent字符串，用来标示浏览器的种类。下面是Chrome浏览器的User-Agent。

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

## window.screen对象

`window.screen`对象包含了显示设备的信息。

`screen.height`和`screen.width`两个属性，一般用来了解设备的分辨率。

```javascript
// 显示设备的高度，单位为像素
screen.height // 1920

// 显示设备的宽度，单位为像素
screen.width // 1080
```

上面代码显示，某设备的分辨率是1920x1080。

除非调整显示器的分辨率，否则这两个值可以看作常量，不会发生变化。显示器的分辨率与浏览器设置无关，缩放网页并不会改变分辨率。

下面是根据屏幕分辨率，将用户导向不同网页的代码。

```javascript
if ((screen.width <= 800) && (screen.height <= 600)) {
  window.location.replace('small.html');
} else {
  window.location.replace('wide.html');
}
```

`screen.availHeight`和`screen.availWidth`属性返回屏幕可用的高度和宽度，单位为像素。它们的值为屏幕的实际大小减去操作系统某些功能占据的空间，比如系统的任务栏。

`screen.colorDepth`属性返回屏幕的颜色深度，一般为16（表示16-bit）或24（表示24-bit）。

## window对象的方法

### window.moveTo()，window.moveBy()

`window.moveTo`方法用于移动浏览器窗口到指定位置。它接受两个参数，分别是窗口左上角距离屏幕左上角的水平距离和垂直距离，单位为像素。

```javascript
window.moveTo(100, 200)
```

上面代码将窗口移动到屏幕`(100, 200)`的位置。

`window.moveBy`方法将窗口移动到一个相对位置。它接受两个参数，分布是窗口左上角向右移动的水平距离和向下移动的垂直距离，单位为像素。

```javascript
window.moveBy(25, 50)
```

上面代码将窗口向右移动25像素、向下移动50像素。

### window.open(), window.close()

`window.open`方法用于新建另一个浏览器窗口，并且返回该窗口对象。

```javascript
var popup = window.open('somefile.html');
```

`open`方法的第一个参数是新窗口打开的网址，此外还可以加上第二个参数，表示新窗口的名字，以及第三个参数用来指定新窗口的参数，形式是一个逗号分隔的`property=value`字符串。

下面是一个例子。

```javascript
var popup = window.open(
  'somepage.html',
  'DefinitionsWindows',
  'height=200,width=200,location=no,resizable=yes,scrollbars=yes'
);
```

注意，如果在第三个参数中设置了一部分参数，其他没有被设置的`yes/no`参数都会被设成No，只有`titlebar`和关闭按钮除外（它们的值默认为yes）。

`open`方法返回新窗口的引用。

```javascript
var windowB = window.open('windowB.html', 'WindowB');
windowB.window.name // "WindowB"
```

由于`open`这个方法很容易被滥用，许多浏览器默认都不允许脚本新建窗口。因此，有必要检查一下打开新窗口是否成功。

```javascript
if (popup === null) {
  // 新建窗口失败
}
```

`window.close`方法用于关闭当前窗口，一般用来关闭`window.open`方法新建的窗口。

```javascript
popup.close()
```

`window.closed`属性用于检查当前窗口是否被关闭了。

```javascript
if ((popup !== null) && !popup.closed) {
  // 窗口仍然打开着
}
```

### window.print()

`print`方法会跳出打印对话框，同用户点击菜单里面的“打印”命令效果相同。

页面上的打印按钮代码如下。

```javascript
document.getElementById('printLink').onclick = function() {
  window.print();
}
```

非桌面设备（比如手机）可能没有打印功能，这时可以这样判断。

```javascript
if (typeof window.print === 'function') {
  // 支持打印功能
}
```

### URL的编码/解码方法

JavaScript提供四个URL的编码/解码方法。

- encodeURI()
- encodeURIComponent()
- decodeURI()
- decodeURIComponent()

#### encodeURI

`encodeURI` 方法的参数为完整的统一资源标识符（URI）的字符串，它使用 1 到 4 个转义字符串来替换 UTF-8 编码字符串中的每个字符（只有由 2 个代理字符区组成的字符才用 4 个转义字符编码）。例如：

```javascript
encodeURI('http://www.example.com?foo=bar&code=<p>')'</p>')
// http://www.example.com?foo=bar&code=%3Cp%3E
```

需要注意的是，`encodeURI` 方法不会替换下列字符：

类型 | 包含
--- | ---
保留字符 | ; , / ? : @ & = + $
非转义的字符 | 字母 数字 - _ . ! ~ * ' (  )
数字符号 | #

另外，如果试图编码一个非高（lead surrogates）-低（trail surrogates）代理位完整的代理对（surrogate pair），将会抛出一个 URIError 错误，例如：

```javascript
// 编码完整代理对 ok
console.log(encodeURI('\uD800\uDFFF'));

// 编码单独的高代理位抛出 "Uncaught URIError: URI malformed"
console.log(encodeURI('\uD800'));

// 编码单独的低代理位抛出 "Uncaught URIError: URI malformed"
console.log(encodeURI('\uDFFF'));
```

#### encodeURIComponent

`encodeURIComponent` 方法的参数为统一资源标识符（URI）的一部分的字符串，它使用 1 到 4 个转义字符串来替换 UTF-8 编码字符串中的每个字符（只有由 2 个代理字符区组成的字符才用 4 个转义字符编码）。

与 `encodeURI` 方法的区别在于，`encodeURIComponent` 方法会转义除了字母、数字、-、\_、.、!、~、\*、'、( 和 ) 之外的所有字符。例如：

```javascript
encodeURIComponent('http://www.example.com?foo=bar&code=<p>')'</p>')
// http%3A%2F%2Fwww.example.com%3Ffoo%3Dbar%26code%3D%3Cp%3E""
```

#### decodeURI

`decodeURI` 方法的参数为一个字符串，用于解码由 `encodeURI` 方法或者其它类似方法编码的统一资源标识符（URI）。例如：

```javascript
decodeURI('http://www.example.com?foo=bar&code=%3Cp%3E')
// http://www.example.com?foo=bar&code=<p>
```

#### decodeURIComponent

`decodeURIComponent` 方法的参数为一个字符串，用于解码由 `encodeURIComponent` 方法或者其它类似方法编码的部分统一资源标识符（URI）。例如：

```javascript
decodeURIComponent('http%3A%2F%2Fwww.example.com%3Ffoo%3Dbar%26code%3D%3Cp%3E')
// http://www.example.com?foo=bar&code=<p>
```

### window.getComputedStyle方法

getComputedStyle方法接受一个HTML元素作为参数，返回一个包含该HTML元素的最终样式信息的对象。详见《DOM》一章的CSS章节。

### window.matchMedia方法

window.matchMedia方法用来检查CSS的mediaQuery语句。详见《DOM》一章的CSS章节。

### window.focus()

`focus`方法会激活指定当前窗口，使其获得焦点。

```javascript
if ((popup !== null) && !popup.closed) {
  popup.focus();
}
```

上面代码先检查`popup`窗口是否依然存在，确认后激活该窗口。

当前窗口获得焦点时，会触发`focus`事件；当前窗口失去焦点时，会触发`blur`事件。

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

`alert()`、`prompt()`、`confirm()`都是浏览器与用户互动的全局方法。它们会弹出不同的对话框，要求用户做出回应。

需要注意的是，`alert()`、`prompt()`、`confirm()`这三个方法弹出的对话框，都是浏览器统一规定的式样，是无法定制的。

`alert`方法弹出的对话框，只有一个“确定”按钮，往往用来通知用户某些信息。

```javascript
// 格式
alert(message);

// 实例
alert('Hello World');
```

用户只有点击“确定”按钮，对话框才会消失。在对话框弹出期间，浏览器窗口处于冻结状态，如果不点“确定”按钮，用户什么也干不了。

`alert`方法的参数只能是字符串，没法使用CSS样式，但是可以用`\n`指定换行。

```javascript
alert('本条提示\n分成两行');
```

`prompt`方法弹出的对话框，在提示文字的下方，还有一个输入框，要求用户输入信息，并有“确定”和“取消”两个按钮。它往往用来获取用户输入的数据。

```javascript
// 格式
var result = prompt(text[, default]);

// 实例
var result = prompt('您的年龄？', 25)
```

上面代码会跳出一个对话框，文字提示为“您的年龄？”，要求用户在对话框中输入自己的年龄（默认显示25）。

`prompt`方法的返回值是一个字符串（有可能为空）或者`null`，具体分成三种情况。

1. 用户输入信息，并点击“确定”，则用户输入的信息就是返回值。
2. 用户没有输入信息，直接点击“确定”，则输入框的默认值就是返回值。
3. 用户点击了“取消”（或者按了Esc按钮），则返回值是`null`。

`prompt`方法的第二个参数是可选的，但是如果不提供的话，IE浏览器会在输入框中显示`undefined`。因此，最好总是提供第二个参数，作为输入框的默认值。

`confirm`方法弹出的对话框，除了提示信息之外，只有“确定”和“取消”两个按钮，往往用来征询用户的意见。

```javascript
// 格式
var result = confirm(message);

// 实例
var result = confirm("你最近好吗？");
```

上面代码弹出一个对话框，上面只有一行文字“你最近好吗？”，用户选择点击“确定”或“取消”。

`confirm`方法返回一个布尔值，如果用户点击“确定”，则返回`true`；如果用户点击“取消”，则返回`false`。

```javascript
var okay = confirm('Please confirm this message.');
if (okay) {
  // 用户按下“确定”
} else {
  // 用户按下“取消”
}
```

`confirm`的一个用途是，当用户离开当前页面时，弹出一个对话框，问用户是否真的要离开。

```javascript
window.onunload = function() {
  return confirm('你确定要离开当面页面吗？');
}
```

## 参考链接

- Karl Dubost, [User-Agent detection, history and checklist](https://hacks.mozilla.org/2013/09/user-agent-detection-history-and-checklist/)
- Conrad Irwin, [JS stacktraces. The good, the bad, and the ugly](https://bugsnag.com/blog/js-stacktraces/)
- Daniel Lee, [How to catch JavaScript Errors with window.onerror (even on Chrome and Firefox)](http://danlimerick.wordpress.com/2014/01/18/how-to-catch-javascript-errors-with-window-onerror-even-on-chrome-and-firefox/)
