---
title: window对象
layout: page
category: bom
date: 2013-09-19
modifiedOn: 2014-01-12
---

## 概述

在浏览器中，`window`对象（注意，`w`为小写）指当前的浏览器窗口。它也是所有对象的顶层对象。

“顶层对象”指的是最高一层的对象，所有其他对象都是它的下属。JavaScript规定，浏览器环境的所有全局变量，都是`window`对象的属性。

```javascript
var a = 1;
window.a // 1
```

上面代码中，变量`a`是一个全局变量，但是实质上它是`window`对象的属性。声明一个全局变量，就是为`window`对象的同名属性赋值。

从语言设计的角度看，所有变量都是`window`对象的属性，其实不是很合理。因为`window`对象有自己的实体含义，不适合当作最高一层的顶层对象。这个设计失误与JavaScript语言匆忙的设计过程有关，最早的设想是语言内置的对象越少越好，这样可以提高浏览器的性能。因此，语言设计者Brendan Eich就把`window`对象当作顶层对象，所有未声明就赋值的变量都自动变成`window`对象的属性。这种设计使得编译阶段无法检测出未声明变量，但到了今天已经没有办法纠正了。

## window对象的属性

### window.window，window.name

`window`对象的`window`属性指向自身。

```javascript
window.window === this // true
```

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

`window.location`返回一个`location`对象，用于获取窗口当前的URL信息。它等同于`document.location`对象，详细介绍见《document对象》一节。

```javascript
window.location === document.location // true
```

### window.closed，window.opener

`window.closed`属性返回一个布尔值，表示窗口是否关闭。

```javascript
window.closed // false
```

上面代码检查当前窗口是否关闭。这种检查意义不大，因为只要能运行代码，当前窗口肯定没有关闭。这个属性一般用来检查，使用脚本打开的新窗口是否关闭。

```javascript
var popup = window.open();

if ((popup !== null) && !popup.closed) {
  // 窗口仍然打开着
}
```

`window.opener`属性返回打开当前窗口的父窗口。如果当前窗口没有父窗口，则返回`null`。

```javascript
window.open().opener === window // true
```

上面表达式会打开一个新窗口，然后返回`true`。

通过`opener`属性，可以获得父窗口的的全局变量和方法，比如`window.opener.propertyName`和`window.opener.functionName()`。但这只限于两个窗口属于同源的情况（参见《[同源政策](/bom/same-origin.html)》一节），且其中一个窗口由另一个打开。

### window.frames，window.length

`window.frames`属性返回一个类似数组的对象，成员为页面内所有框架窗口，包括`frame`元素和`iframe`元素。`window.frames[0]`表示页面中第一个框架窗口。

如果`iframe`元素设置了`id`或`name`属性，那么就可以用属性值，引用这个`iframe`窗口。比如`<iframe name="myIFrame">`就可以用`frames['myIFrame']`或者`frames.myIFrame`来引用。

`frames`属性实际上是`window`对象的别名。

```javascript
frames === window // true
```

因此，`frames[0]`也可以用`window[0]`表示。但是，从语义上看，`frames`更清晰，而且考虑到`window`还是全局对象，因此推荐表示多窗口时，总是使用`frames[0]`的写法。更多介绍请看下文的《多窗口操作》部分。

`window.length`属性返回当前网页包含的框架总数。如果当前网页不包含`frame`和`iframe`元素，那么`window.length`就返回`0`。

```javascript
window.frames.length === window.length // true
```

`window.frames.length`与`window.length`应该是相等的。

### window.screenX，window.screenY

`window.screenX`和`window.screenY`属性，返回浏览器窗口左上角相对于当前屏幕左上角（`(0, 0)`）的水平距离和垂直距离，单位为像素。

### window.innerHeight，window.innerWidth

`window.innerHeight`和`window.innerWidth`属性，返回网页在当前窗口中可见部分的高度和宽度，即“视口”（viewport），单位为像素。

当用户放大网页的时候（比如将网页从100%的大小放大为200%），这两个属性会变小。因为这时网页的像素大小不变（比如宽度还是960像素），只是每个像素占据的屏幕空间变大了，因为可见部分（视口）就变小了。

注意，这两个属性值包括滚动条的高度和宽度。

### window.outerHeight，window.outerWidth

`window.outerHeight`和`window.outerWidth`属性返回浏览器窗口的高度和宽度，包括浏览器菜单和边框，单位为像素。

### window.pageXOffset，window.pageYOffset

`window.pageXOffset`属性返回页面的水平滚动距离，`window.pageYOffset`属性返回页面的垂直滚动距离，单位都为像素。

举例来说，如果用户向下拉动了垂直滚动条75像素，那么`window.pageYOffset`就是75。用户水平向右拉动水平滚动条200像素，`window.pageXOffset`就是200。

## navigator对象

`window`对象的`navigator`属性，指向一个包含浏览器信息的对象。

### navigator.userAgent

`navigator.userAgent`属性返回浏览器的User-Agent字符串，标示浏览器的厂商和版本信息。

下面是Chrome浏览器的`userAgent`。

```javascript
navigator.userAgent
// "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safari/537.36"
```

通过`userAgent`属性识别浏览器，不是一个好办法。因为必须考虑所有的情况（不同的浏览器，不同的版本），非常麻烦，而且无法保证未来的适用性，更何况各种上网设备层出不穷，难以穷尽。所以，现在一般不再识别浏览器了，而是使用“功能识别”方法，即逐一测试当前浏览器是否支持要用到的JavaScript功能。

不过，通过`userAgent`可以大致准确地识别手机浏览器，方法就是测试是否包含`mobi`字符串。

```javascript
var ua = navigator.userAgent.toLowerCase();

if (/mobi/i.test(ua)) {
  // 手机浏览器
} else {
  // 非手机浏览器
}
```

如果想要识别所有移动设备的浏览器，可以测试更多的特征字符串。

```javascript
/mobi|android|touch|mini/i.test(ua)
```

### navigator.plugins

`navigator.plugins`属性返回一个类似数组的对象，成员是浏览器安装的插件，比如Flash、ActiveX等。

### navigator.platform

`navigator.platform`属性返回用户的操作系统信息。

```javascript
navigator.platform
// "Linux x86_64"
```

### navigator.onLine

`navigator.onLine`属性返回一个布尔值，表示用户当前在线还是离线。

```javascript
navigator.onLine // true
```

### navigator.geolocation

`navigator.geolocation`返回一个Geolocation对象，包含用户地理位置的信息。

### navigator.javaEnabled()，navigator.cookieEnabled

`javaEnabled`方法返回一个布尔值，表示浏览器是否能运行Java Applet小程序。

```javascript
navigator.javaEnabled() // false
```

`cookieEnabled`属性返回一个布尔值，表示浏览器是否能储存Cookie。

```javascript
navigator.cookieEnabled // true
```

注意，这个返回值与是否储存某个网站的Cookie无关。用户可以设置某个网站不得储存Cookie，这时`cookieEnabled`返回的还是`true`。

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

### window.scrollTo()，window.scrollBy()

`window.scrollTo`方法用于将网页的指定位置，滚动到浏览器左上角。它的参数是相对于整张网页的横坐标和纵坐标。它有一个别名`window.scroll`。

```javascript
window.scrollTo(0, 1000);
```

`window.scrollBy`方法用于将网页移动指定距离，单位为像素。它接受两个参数：向右滚动的像素，向下滚动的像素。

```javascript
window.scrollBy(0, window.innerHeight)
```

上面代码用于将网页向下滚动一屏。

### window.open(), window.close()

`window.open`方法用于新建另一个浏览器窗口，并且返回该窗口对象。

```javascript
var popup = window.open('somefile.html');
```

上面代码会让浏览器弹出一个新建窗口，网址是当前域名下的`somefile.html`。

`open`方法一共可以接受四个参数。

- 第一个参数：字符串，表示新窗口的网址。如果省略，默认网址就是`about:blank`。
- 第二个参数：字符串，表示新窗口的名字。如果该名字的窗口已经存在，则跳到该窗口，不再新建窗口。如果省略，就默认使用`_blank`，表示新建一个没有名字的窗口。
- 第三个参数：字符串，内容为逗号分隔的键值对，表示新窗口的参数，比如有没有提示栏、工具条等等。如果省略，则默认打开一个完整UI的新窗口。
- 第四个参数：布尔值，表示第一个参数指定的网址，是否应该替换`history`对象之中的当前网址记录，默认值为`false`。显然，这个参数只有在第二个参数指向已经存在的窗口时，才有意义。

下面是一个例子。

```javascript
var popup = window.open(
  'somepage.html',
  'DefinitionsWindows',
  'height=200,width=200,location=no,status=yes,resizable=yes,scrollbars=yes'
);
```

上面代码表示，打开的新窗口高度和宽度都为200像素，没有地址栏和滚动条，但有状态栏，允许用户调整大小。

注意，如果在第三个参数中设置了一部分参数，其他没有被设置的`yes/no`参数都会被设成`no`，只有`titlebar`和关闭按钮除外（它们的值默认为`yes`）。

另外，`open`方法的第二个参数虽然可以指定已经存在的窗口，但是不等于可以任意控制其他窗口。为了防止被不相干的窗口控制，浏览器只有在两个窗口同源，或者目标窗口被当前网页打开的情况下，才允许`open`方法指向该窗口。

`open`方法返回新窗口的引用。

```javascript
var windowB = window.open('windowB.html', 'WindowB');
windowB.window.name // "WindowB"
```

下面是另一个例子。

```javascript
var w = window.open();
w.alert('已经打开新窗口');
w.location = 'http://example.com';
```

上面代码先打开一个新窗口，然后在该窗口弹出一个对话框，再将网址导向`example.com`。

由于`open`这个方法很容易被滥用，许多浏览器默认都不允许脚本自动新建窗口。只允许在用户点击链接或按钮，脚本做出反应，弹出新窗口。因此，有必要检查一下打开新窗口是否成功。

```javascript
if (popup === null) {
  // 新建窗口失败
}
```

`window.close`方法用于关闭当前窗口，一般用来关闭`window.open`方法新建的窗口。

```javascript
popup.close()
```

该方法只对顶层窗口有效，`iframe`框架之中的窗口使用该方法无效。

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

### window.getComputedStyle()

`getComputedStyle`方法接受一个HTML元素作为参数，返回一个包含该HTML元素的最终样式信息的对象。详见《DOM》一章的CSS章节。

### window.matchMedia()

`window.matchMedia`方法用来检查CSS的mediaQuery语句。详见《DOM》一章的CSS章节。

### window.focus()

`focus`方法会激活指定当前窗口，使其获得焦点。

```javascript
var popup = window.open('popup.html', 'Popup Window');

if ((popup !== null) && !popup.closed) {
  popup.focus();
}
```

上面代码先检查`popup`窗口是否依然存在，确认后激活该窗口。

当前窗口获得焦点时，会触发`focus`事件；当前窗口失去焦点时，会触发`blur`事件。

### window.getSelection()

`window.getSelection`方法返回一个`Selection`对象，表示用户现在选中的文本。

```javascript
var selObj = window.getSelection();
```

使用`Selction`对象的`toString`方法可以得到选中的文本。

```javascript
var selectedText = selObj.toString();
```

## 多窗口操作

由于网页可以使用`iframe`元素，嵌入其他网页，因此一个网页之中会形成多个窗口。另一情况是，子网页之中又嵌入别的网页，形成多级窗口。

### 窗口的引用

各个窗口之中的脚本，可以引用其他窗口。浏览器提供了一些特殊变量，用来返回其他窗口。

- `top`：顶层窗口，即最上层的那个窗口
- `parent`：父窗口
- `self`：当前窗口，即自身

下面代码可以判断，当前窗口是否为顶层窗口。

```javascript
top === self

// 更好的写法
window.top === window.self
```

下面的代码让父窗口的访问历史后退一次。

```javascript
parent.history.back();
```

与这些变量对应，浏览器还提供一些特殊的窗口名，供`open`方法、`<a>`标签、`<form>`标签等引用。

- `_top`：顶层窗口
- `_parent`：父窗口
- `_blank`：新窗口

下面代码就表示在顶层窗口打开链接。

```html
<a href="somepage.html" target="_top">Link</a>
```

### iframe标签

对于`iframe`嵌入的窗口，`document.getElementById`方法可以拿到该窗口的DOM节点，然后使用`contentWindow`属性获得`iframe`节点包含的`window`对象，或者使用`contentDocument`属性获得包含的`document`对象。

```javascript
var frame = document.getElementById('theFrame');
var frameWindow = frame.contentWindow;

// 等同于 frame.contentWindow.document
var frameDoc = frame.contentDocument;

// 获取子窗口的变量和属性
frameWindow.function()

// 获取子窗口的标题
frameWindow.title
```

`iframe`元素遵守同源政策，只有当父页面与框架页面来自同一个域名，两者之间才可以用脚本通信，否则只有使用`window.postMessage`方法。

`iframe`窗口内部，使用`window.parent`引用父窗口。如果当前页面没有父窗口，则`window.parent`属性返回自身。因此，可以通过`window.parent`是否等于`window.self`，判断当前窗口是否为`iframe`窗口。

```javascript
if (window.parent !== window.self) {
  // 当前窗口是子窗口
}
```

`iframe`嵌入窗口的`window`对象，有一个`frameElement`属性，返回它在父窗口中的DOM节点。对于那么非嵌入的窗口，该属性等于`null`。

```javascript
var f1Element = document.getElementById('f1');
var fiWindow = f1Element.contentWindow;
f1Window.frameElement === f1Element // true
window.frameElement === null // true
```

### frames属性

`window`对象的`frames`属性返回一个类似数组的对象，成员是所有子窗口的`window`对象。可以使用这个属性，实现窗口之间的互相引用。比如，`frames[0]`返回第一个子窗口，`frames[1].frames[2]`返回第二个子窗口内部的第三个子窗口，`parent.frames[1]`返回父窗口的第二个子窗口。

需要注意的是，`window.frames`每个成员的值，是框架内的窗口（即框架的`window`对象），而不是`iframe`标签在父窗口的DOM节点。如果要获取每个框架内部的DOM树，需要使用`window.frames[0].document`的写法。

另外，如果`iframe`元素设置了`name`或`id`属性，那么属性值会自动成为全局变量，并且可以通过`window.frames`属性引用，返回子窗口的`window`对象。

```javascript
// HTML代码为<iframe id="myFrame">
myFrame // [HTMLIFrameElement]
frames.myframe === myFrame // true
```

另外，`name`属性的值会自动成为子窗口的名称，可以用在`window.open`方法的第二个参数，或者`<a>`和`<frame>`标签的`target`属性。

## 事件

`window`对象可以接收以下事件。

### load事件和onload属性

`load`事件发生在文档在浏览器窗口加载完毕时。`window.onload`属性可以指定这个事件的回调函数。

```javascript
window.onload = function() {
  var elements = document.getElementsByClassName('example');
  for (var i = 0; i < elements.length; i++) {
    var elt = elements[i];
    // ...
  }
};
```

上面代码在网页加载完毕后，获取指定元素并进行处理。

### error事件和onerror属性

浏览器脚本发生错误时，会触发window对象的`error`事件。我们可以通过`window.onerror`属性对该事件指定回调函数。

```javascript
window.onerror = function (message, filename, lineno, colno, error) {
  console.log("出错了！--> %s", error.stack);
};
```

由于历史原因，`window`的`error`事件的回调函数不接受错误对象作为参数，而是一共可以接受五个参数，它们的含义依次如下。

- 出错信息
- 出错脚本的网址
- 行号
- 列号
- 错误对象

老式浏览器只支持前三个参数。

并不是所有的错误，都会触发JavaScript的`error`事件（即让JavaScript报错），只限于以下三类事件。

- JavaScript语言错误
- JavaScript脚本文件不存在
- 图像文件不存在

以下两类事件不会触发JavaScript的error事件。

- CSS文件不存在
- iframe文件不存在

下面是一个例子，如果整个页面未捕获错误超过3个，就显示警告。

```javascript
window.onerror = function(msg, url, line) {
  if (onerror.num++ > onerror.max) {
    alert('ERROR: ' + msg + '\n' + url + ':' + line);
    return true;
  }
}
onerror.max = 3;
onerror.num = 0;
```

需要注意的是，如果脚本网址与网页网址不在同一个域（比如使用了CDN），浏览器根本不会提供详细的出错信息，只会提示出错，错误类型是“Script error.”，行号为0，其他信息都没有。这是浏览器防止向外部脚本泄漏信息。一个解决方法是在脚本所在的服务器，设置`Access-Control-Allow-Origin`的HTTP头信息。

```bash
Access-Control-Allow-Origin: *
```

然后，在网页的`<script>`标签中设置`crossorigin`属性。

```html
<script crossorigin="anonymous" src="//example.com/file.js"></script>
```

上面代码的`crossorigin="anonymous"`表示，读取文件不需要身份信息，即不需要cookie和HTTP认证信息。如果设为`crossorigin="use-credentials"`，就表示浏览器会上传cookie和HTTP认证信息，同时还需要服务器端打开HTTP头信息`Access-Control-Allow-Credentials`。

## URL的编码/解码方法

网页URL的合法字符分成两类。

- URL元字符：分号（`;`），逗号（','），斜杠（`/`），问号（`?`），冒号（`:`），at（`@`），`&`，等号（`=`），加号（`+`），美元符号（`$`），井号（`#`）
- 语义字符：`a-z`，`A-Z`，`0-9`，连词号（`-`），下划线（`_`），点（`.`），感叹号（`!`），波浪线（`~`），星号（`*`），单引号（`\``），圆括号（`()`）

除了以上字符，其他字符出现在URL之中都必须转义，规则是根据操作系统的默认编码，将每个字节转为百分号（`%`）加上两个大写的十六进制字母。比如，UTF-8的操作系统上，`http://www.example.com/q=春节`这个URL之中，汉字“春节”不是URL的合法字符，所以被浏览器自动转成`http://www.example.com/q=%E6%98%A5%E8%8A%82`。其中，“春”转成了`%E6%98%A5`，“节”转成了“%E8%8A%82”。这是因为“春”和”节“的UTF-8编码分别是`E6 98 A5`和`E8 8A 82`，将每个字节前面加上百分号，就构成了URL编码。

JavaScript提供四个URL的编码/解码方法。

- `encodeURI()`
- `encodeURIComponent()`
- `decodeURI()`
- `decodeURIComponent()`

### encodeURI

`encodeURI` 方法的参数是一个字符串，代表整个URL。它会将元字符和语义字符之外的字符，都进行转义。

```javascript
encodeURI('http://www.example.com/q=春节')
// "http://www.example.com/q=%E6%98%A5%E8%8A%82"
```

### encodeURIComponent

`encodeURIComponent`只转除了语义字符之外的字符，元字符也会被转义。因此，它的参数通常是URL的路径或参数值，而不是整个URL。

```javascript
encodeURIComponent('春节')
// "%E6%98%A5%E8%8A%82"
encodeURIComponent('http://www.example.com/q=春节')
// "http%3A%2F%2Fwww.example.com%2Fq%3D%E6%98%A5%E8%8A%82"
```

上面代码中，`encodeURIComponent`会连URL元字符一起转义，所以通常只用它转URL的片段。

### decodeURI

`decodeURI`用于还原转义后的URL。它是`encodeURI`方法的逆运算。

```javascript
decodeURI('http://www.example.com/q=%E6%98%A5%E8%8A%82')
// "http://www.example.com/q=春节"
```

### decodeURIComponent

`decodeURIComponent`用于还原转义后的URL片段。它是`encodeURIComponent`方法的逆运算。

```javascript
decodeURIComponent('%E6%98%A5%E8%8A%82')
// "春节"
```

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

这三个方法都具有堵塞效应，一旦弹出对话框，整个页面就是暂停执行，等待用户做出反应。

## 参考链接

- Karl Dubost, [User-Agent detection, history and checklist](https://hacks.mozilla.org/2013/09/user-agent-detection-history-and-checklist/)
- Conrad Irwin, [JS stacktraces. The good, the bad, and the ugly](https://bugsnag.com/blog/js-stacktraces/)
- Daniel Lee, [How to catch JavaScript Errors with window.onerror (even on Chrome and Firefox)](http://danlimerick.wordpress.com/2014/01/18/how-to-catch-javascript-errors-with-window-onerror-even-on-chrome-and-firefox/)
