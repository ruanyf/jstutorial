---
title: document节点
layout: page
category: dom
date: 2014-05-18
modifiedOn: 2014-05-18
---

## 概述

`document`节点是文档的根节点，每张网页都有自己的`document`节点。`window.document`属性就指向这个节点。只要浏览器开始载入HTML文档，这个节点对象就存在了，可以直接调用。

`document`节点有不同的办法可以获取。

- 对于正常的网页，直接使用`document`或`window.document`。
- 对于`iframe`载入的网页，使用`iframe`节点的`contentDocument`属性。
- 对Ajax操作返回的文档，使用XMLHttpRequest对象的`responseXML`属性。
- 对于包含某个节点的文档，使用该节点的`ownerDocument`属性。

上面这四种`document`节点，都部署了[Document接口](http://dom.spec.whatwg.org/#interface-document)，因此有共同的属性和方法。当然，各自也有一些自己独特的属性和方法，比如HTML和XML文档的`document`节点就不一样。

## 内部节点属性

`document`节点有很多属性，其中相当一部分属于快捷方式，指向文档内部的某个节点。

### document.doctype，document.documentElement，document.defaultView

对于HTML文档来说，`document`对象一般有两个子节点。第一个子节点是`document.doctype`，它是一个对象，包含了当前文档类型（Document Type Declaration，简写DTD）信息。对于HTML5文档，该节点就代表`<!DOCTYPE html>`。如果网页没有声明DTD，该属性返回`null`。

```javascript
var doctype = document.doctype;
doctype // "<!DOCTYPE html>"
doctype.name // "html"
```

`document.firstChild`通常就返回这个节点。

`document.documentElement`属性返回当前文档的根节点（root）。它通常是`document`节点的第二个子节点，紧跟在`document.doctype`节点后面。对于HTML网页，该属性返回`<html>`节点。

`document.defaultView`属性，在浏览器中返回`document`对象所在的`window`对象，否则返回`null`。

```javascript
document.defaultView === window // true
```

### document.body，document.head

`document.head`属性返回当前文档的`<head>`节点，`document.body`属性返回当前文档的`<body>`。

```javascript
document.head === document.querySelector('head') // true
document.body === document.querySelector('body') // true
```

这两个属性总是存在的，如果网页源码里面省略了`<head>`或`<body>`，浏览器会自动创造。另外，这两个属性是可写的，如果对其写入一个新的节点，会导致原有的所有子节点被移除。

### document.activeElement

`document.activeElement`属性返回当前文档中获得焦点的那个元素。用户通常可以使用Tab键移动焦点，使用空格键激活焦点。比如，如果焦点在一个链接上，此时按一下空格键，就会跳转到该链接。

## 节点集合属性

以下属性返回文档内部特定元素的集合，都是类似数组的对象。这些集合都是动态的，原节点有任何变化，立刻会反映在集合中。

### document.links，document.forms，document.images，document.embeds

`document.links`属性返回当前文档所有设定了`href`属性的`a`及`area`元素。

`document.forms`属性返回页面中所有表单元素`form`。

```javascript
var selectForm = document.forms[0];
```

上面代码获取文档第一个表单。

`document.images`属性返回页面所有图片元素（即`img`标签）。

```javascript
var imglist = document.images;

for(var i = 0; i < imglist.length; i++) {
  if (imglist[i].src === 'banner.gif') {
    // ...
  }
}
```

上面代码在所有`img`标签中，寻找特定图片。

`document.embeds`属性返回网页中所有嵌入对象，即`embed`标签。

以上四个属性返回的都是`HTMLCollection`对象实例。

```javascript
document.links instanceof HTMLCollection // true
document.images instanceof HTMLCollection // true
document.forms instanceof HTMLCollection // true
document.embeds instanceof HTMLCollection // true
```

由于`HTMLCollection`实例可以用HTML元素的`id`或`name`属性引用，因此如果一个元素有`id`或`name`属性，就可以在上面这四个属性上引用。

```javascript
// HTML代码为
// <form name="myForm" >

document.myForm === document.forms.myForm // true
```

### document.scripts，document.styleSheets

`document.scripts`属性返回当前文档的所有脚本（即`script`标签）。

```javascript
var scripts = document.scripts;
if (scripts.length !== 0 ) {
  console.log('当前网页有脚本');
}
```

`document.scripts`返回的也是`HTMLCollection`实例。

```javascript
document.scripts instanceof HTMLCollection // true
```

因此，如果一个`script`标签有`id`或`name`属性，就可以在`document.scripts`上引用。

```javascript
// HTML代码为
// <script id="myScript" >

document.scripts.myScript
// <script id="myScript"></script>
```

`document.styleSheets`属性返回一个类似数组的对象，代表当前网页的所有样式表。每个样式表对象都有`cssRules`属性，返回该样式表的所有CSS规则，这样这可以操作具体的CSS规则了。

```javascript
var allSheets = [].slice.call(document.styleSheets);
```

上面代码中，使用`slice`方法将`document.styleSheets`转为数组，以便于进一步处理。

## 文档信息属性

以下属性返回文档信息。

### document.documentURI，document.URL

`document.documentURI`属性和`document.URL`属性都返回一个字符串，表示当前文档的网址。不同之处是`documentURI`属性是所有文档都具备的，`URL`属性则是HTML文档独有的。

```javascript
document.documentURI === document.URL
// true
```

另外，如果文档的锚点（`#anchor`）变化，这两个属性都不会跟着变化，它们的值是静态的。但是，`document.location`会跟着变化，`document.location`总是返回最新的URL，会跟踪锚点的变化。

### document.domain

`document.domain`属性返回当前文档的域名。比如，某张网页的网址是 http://www.example.com/hello.html ，`domain`属性就等于`www.example.com`。如果无法获取域名，该属性返回`null`。

```javascript
var badDomain = 'www.example.xxx';
if (document.domain === badDomain)
  window.close();
```

上面代码判断，如果当前域名等于指定域名，则关闭窗口。

二级域名的情况下，domain属性可以设置为对应的一级域名。比如，当前域名是sub.example.com，则domain属性可以设置为example.com。除此之外的写入，都是不可以的。

### document.lastModified

`document.lastModified`属性返回当前文档最后修改的时间戳，格式为字符串。

```javascript
document.lastModified
// Tuesday, July 10, 2001 10:19:42
```

注意，`lastModified`属性的值是字符串，所以不能用来直接比较，两个文档谁的日期更新，需要用`Date.parse`方法转成时间戳格式，才能进行比较。

```javascript
if (Date.parse(doc1.lastModified) > Date.parse(doc2.lastModified)) {
  // ...
}
```

### document.location

`document.location`属性返回`location`对象，提供了当前文档的URL信息。

```javascript
// 当前网址为 http://user:passwd@www.example.com:4097/path/a.html?x=111#part1
document.location.href // "http://user:passwd@www.example.com:4097/path/a.html?x=111#part1"
document.location.protocol // "http:"
document.location.host // "www.example.com:4097"
document.location.hostname // "www.example.com"
document.location.port // "4097"
document.location.pathname // "/path/a.html"
document.location.search // "?x=111"
document.location.hash // "#part1"
document.location.user // "user"
document.location.password // "passed"
```

`location`对象有以下方法。

- `location.assign()`
- `location.reload()`
- `location.toString()`

```javascript
// 跳转到另一个网址
document.location.assign('http://www.google.com')
// 优先从服务器重新加载
document.location.reload(true)
// 优先从本地缓存重新加载（默认值）
document.location.reload(false)
// 跳转到新网址，并将取代掉history对象中的当前记录
document.location.replace('http://www.google.com');
// 将location对象转为字符串，等价于document.location.href
document.location.toString()
```

如果将新的网址赋值给`location`对象，网页就会自动跳转到新网址。

```javascript
document.location = 'http://www.example.com';
// 等同于
document.location.href = 'http://www.example.com';
```

也可以指定相对URL。

```javascript
document.location = 'page2.html';
```

如果指定的是锚点，浏览器会自动滚动到锚点处。

```javascript
document.location = '#top';
```

注意，采用上面的方法重置URL，跟用户点击链接跳转的效果是一样的。上一个网页依然将保存在浏览器历史之中，点击“后退”按钮就可以回到前一个网页。

如果不希望用户看到前一个网页，可以使用`location.replace`方法，浏览器`history`对象就会用新的网址，取代当前网址，这样的话，“后退”按钮就不会回到当前网页了。它的一个应用就是，当脚本发现当前是移动设备时，就立刻跳转到移动版网页。

`document.location`属性与`window.location`属性等价。

```javascript
document.location === window.location // true
```

历史上，IE曾经不允许对`document.location`赋值，为了保险起见，建议优先使用`window.location`。如果只是单纯地获取当前网址，建议使用`document.URL`，语义性更好。

### document.referrer，document.title，document.characterSet

`document.referrer`属性返回一个字符串，表示当前文档的访问来源，如果是无法获取来源或是用户直接键入网址，而不是从其他网页点击，则返回一个空字符串。

`document.referrer`的值，总是与HTTP头信息的`Referer`保持一致，但是它的拼写有两个`r`。

`document.title`属性返回当前文档的标题，该属性是可写的。

```javascript
document.title = '新标题';
```

`document.characterSet`属性返回渲染当前文档的字符集，比如UTF-8、ISO-8859-1。

### document.readyState

`document.readyState`属性返回当前文档的状态，共有三种可能的值。

- `loading`：加载HTML代码阶段（尚未完成解析）
- `interactive`：加载外部资源阶段时
- `complete`：加载完成时

这个属性变化的过程如下。

1. 浏览器开始解析HTML文档，`document.readyState`属性等于`loading`。
1. 浏览器遇到HTML文档中的`<script>`元素，并且没有`async`或`defer`属性，就暂停解析，开始执行脚本，这时`document.readyState`属性还是等于`loading`。
1. HTML文档解析完成，`document.readyState`属性变成`interactive`。
1. 浏览器等待图片、样式表、字体文件等外部资源加载完成，一旦全部加载完成，`document. readyState`属性变成`complete`。

下面的代码用来检查网页是否加载成功。

```javascript
// 基本检查
if (document.readyState === 'complete') {
  // ...
}

// 轮询检查
var interval = setInterval(function() {
  if (document.readyState === 'complete') {
    clearInterval(interval);
    // ...
  }
}, 100);
```

### document.designMode

`document.designMode`属性控制当前文档是否可编辑，通常用在制作所见即所得编辑器。打开`iframe`元素包含的文档的`designMode`属性，就能将其变为一个所见即所得的编辑器。

```html
<iframe id="editor" src="about:blank"></iframe>
<script>
!(function () {
  var editor = document.getElementById('editor');
  editor.contentDocument.designMode = 'on';
})();
</script>
```

### document.implementation

`document.implementation`属性返回一个对象，用来甄别当前环境部署了哪些DOM相关接口。`implementation`属性的`hasFeature`方法，可以判断当前环境是否部署了特定版本的特定接口。

```javascript
document.implementation.hasFeature('HTML', '2.0')
// true

document.implementation.hasFeature('MutationEvents','2.0')
// true
```

上面代码表示，当前环境部署了DOM HTML 2.0版和MutationEvents的2.0版。

### document.compatMode

`compatMode`属性返回浏览器处理文档的模式，可能的值为`BackCompat`（向后兼容模式）和`CSS1Compat`（严格模式）。

一般来说，如果网页代码的第一行设置了明确的`DOCTYPE`（比如`<!doctype html>`），`document.compatMode`的值都为`CSS1Compat`。

### document.cookie

`document.cookie`属性用来操作浏览器Cookie，详见《浏览器环境》一章的《Cookie》部分。

## 读写相关的方法

### document.open()，document.close()

`document.open`方法用于新建一个文档，供write方法写入内容。它实际上等于清除当前文档，重新写入内容。不要将此方法与`window.open()`混淆，后者用来打开一个新窗口，与当前文档无关。

`document.close`方法用于关闭`open`方法所新建的文档。一旦关闭，`write`方法就无法写入内容了。如果再调用`write`方法，就等同于又调用`open`方法，新建一个文档，再写入内容。

### document.write()，document.writeln()

`document.write`方法用于向当前文档写入内容。只要当前文档还没有用`close`方法关闭，它所写入的内容就会追加在已有内容的后面。

```javascript
// 页面显示“helloworld”
document.open();
document.write('hello');
document.write('world');
document.close();
```

注意，`document.write`会当作HTML代码解析，不会转义。

```javascript
document.write('<p>hello world</p>');
```

如果页面已经解析完成（`DOMContentLoaded`事件发生之后），再调用`write`方法，它会先调用`open`方法，擦除当前文档所有内容，然后再写入。

```javascript
document.addEventListener('DOMContentLoaded', function (event) {
  document.write('<p>Hello World!</p>');
});

// 等同于

document.addEventListener('DOMContentLoaded', function (event) {
  document.open();
  document.write('<p>Hello World!</p>');
  document.close();
});
```

如果在页面渲染过程中调用`write`方法，并不会调用`open`方法。（可以理解成，`open`方法已调用，但`close`方法还未调用。）

```html
<html>
<body>
hello
<script type="text/javascript">
  document.write("world")
</script>
</body>
</html>
```

在浏览器打开上面网页，将会显示`hello world`。

`document.write`是JavaScript语言标准化之前就存在的方法，现在完全有更符合标准的方法向文档写入内容（比如对`innerHTML`属性赋值）。所以，除了某些特殊情况，应该尽量避免使用`document.write`这个方法。

`document.writeln`方法与`write`方法完全一致，除了会在输出内容的尾部添加换行符。

```js
document.write(1);
document.write(2);
// 12

document.writeln(1);
document.writeln(2);
// 1
// 2
//
```

注意，`writeln`方法添加的是ASCII码的换行符，渲染成HTML网页时不起作用，即在网页上显示不出换行。

## 查找节点的方法

以下方法用来查找某个节点。

### document.querySelector()，document.querySelectorAll()

`document.querySelector`方法接受一个CSS选择器作为参数，返回匹配该选择器的元素节点。如果有多个节点满足匹配条件，则返回第一个匹配的节点。如果没有发现匹配的节点，则返回`null`。

```javascript
var el1 = document.querySelector('.myclass');
var el2 = document.querySelector('#myParent > [ng-click]');
```

`document.querySelectorAll`方法与`querySelector`用法类似，区别是返回一个`NodeList`对象，包含所有匹配给定选择器的节点。

```javascript
elementList = document.querySelectorAll('.myclass');
```

这两个方法的参数，可以是逗号分隔的多个CSS选择器，返回匹配其中一个选择器的元素节点。

```javascript
var matches = document.querySelectorAll('div.note, div.alert');
```

上面代码返回`class`属性是`note`或`alert`的`div`元素。

这两个方法都支持复杂的CSS选择器。

```javascript
// 选中data-foo-bar属性等于someval的元素
document.querySelectorAll('[data-foo-bar="someval"]');

// 选中myForm表单中所有不通过验证的元素
document.querySelectorAll('#myForm :invalid');

// 选中div元素，那些class含ignore的除外
document.querySelectorAll('DIV:not(.ignore)');

// 同时选中div，a，script三类元素
document.querySelectorAll('DIV, A, SCRIPT');
```

但是，它们不支持CSS伪元素的选择器（比如`:first-line`和`:first-letter`）和伪类的选择器（比如`:link`和`:visited`），即无法选中伪元素和伪类。

如果`querySelectorAll`方法的参数是字符串`*`，则会返回文档中的所有HTML元素节点。另外，`querySelectorAll`的返回结果不是动态集合，不会实时反映元素节点的变化。

最后，这两个方法除了定义在`document`对象上，还定义在元素节点上，即在元素节点上也可以调用。

### document.getElementsByTagName()

`document.getElementsByTagName`方法返回所有指定HTML标签的元素，返回值是一个类似数组的`HTMLCollection`对象，可以实时反映HTML文档的变化。如果没有任何匹配的元素，就返回一个空集。

```javascript
var paras = document.getElementsByTagName('p');

paras instanceof HTMLCollection // true
```

上面代码返回当前文档的所有`p`元素节点。

HTML标签名是大小写不敏感的，因此`getElementsByTagName`方法也是大小写不敏感的。另外，返回结果中，各个成员的顺序就是它们在文档中出现的顺序。

如果传入`*`，就可以返回文档中所有HTML元素。

```javascript
var allElements = document.getElementsByTagName('*');
```

注意，HTML元素本身也定义了`getElementsByTagName`方法，返回该元素的后代元素中符合指定标签的元素。也就是说，这个方法不仅可以在`document`对象上调用，也可以在任何元素节点上调用。

```javascript
var firstPara = document.getElementsByTagName('p')[0];
var spans = firstPara.getElementsByTagName('span');
```

上面代码选中第一个`p`元素内部的所有`span`元素。

### document.getElementsByClassName()

`document.getElementsByClassName`方法返回一个类似数组的对象（`HTMLCollection`实例对象），包括了所有`class`名字符合指定条件的元素，元素的变化实时反映在返回结果中。

```javascript
var elements = document.getElementsByClassName(names);
```

由于`class`是保留字，所以JavaScript一律使用`className`表示CSS的`class`。

如果参数是一个空格分隔的字符串，元素的`class`必须符合所有字符串之中所有的`class`才会返回。

```javascript
var elements = document.getElementsByClassName('foo bar');
```

上面代码返回同时具有`foo`和`bar`两个`class`的元素，`foo`和`bar`的顺序不重要。

注意，正常模式下，CSS的`class`是大小写敏感的。（`quirks mode`下，大小写不敏感。）

与`getElementsByTagName`方法一样，`getElementsByClassName`方法不仅可以`在document`对象上调用，也可以在任何元素节点上调用。

```javascript
// 非document对象上调用
var elements = rootElement.getElementsByClassName(names);
```

### document.getElementsByName()

`document.getElementsByName`方法用于选择拥有`name`属性的HTML元素（比如`<form>`、`<radio>`、`<img>`、`<frame>`、`<embed>`和`<object>`等），返回一个类似数组的的对象（`NodeList`对象的实例），因为`name`属性相同的元素可能不止一个。

```javascript
// 表单为 <form name="x"></form>
var forms = document.getElementsByName('x');
forms[0].tagName // "FORM"
```

### getElementById()

`getElementById`方法返回匹配指定`id`属性的元素节点。如果没有发现匹配的节点，则返回`null`。

```javascript
var elem = document.getElementById('para1');
```

注意，该方法的参数是大小写敏感的。比如，如果某个节点的`id`属性是`main`，那么`document.getElementById('Main')`将返回`null`，而不是那个节点。

`document.getElementById`方法与`document.querySelector`方法都能获取元素节点，不同之处是`document.querySelector`方法的参数使用CSS选择器语法，`document.getElementById`方法的参数是HTML标签元素的`id`属性。

```javascript
document.getElementById('myElement')
document.querySelector('#myElement')
```

上面代码中，两个方法都能选中`id`为`myElement`的元素，但是`getElementById()`比`querySelector()`效率高得多。

另外，这个方法只能在`document`对象上使用，不能在其他元素节点上使用。

### document.elementFromPoint()

`document.elementFromPoint`方法返回位于页面指定位置最上层的Element子节点。

```javascript
var element = document.elementFromPoint(50, 50);
```

上面代码选中在`(50, 50)`这个坐标位置的最上层的那个HTML元素。

`elementFromPoint`方法的两个参数，依次是相对于当前视口左上角的横坐标和纵坐标，单位是像素。如果位于该位置的HTML元素不可返回（比如文本框的滚动条），则返回它的父元素（比如文本框）。如果坐标值无意义（比如负值或超过视口大小），则返回`null`。

## 生成节点的方法

以下方法用于生成元素节点。

### document.createElement()

`document.createElement`方法用来生成HTML元素节点。

```javascript
var newDiv = document.createElement('div');
```

`createElement`方法的参数为元素的标签名，即元素节点的`tagName`属性，对HTML文档大小写不敏感。如果参数带有尖括号（即`<`和`>`）或者是`null`，会报错。

### document.createTextNode()

`document.createTextNode`方法用来生成文本节点，参数为所要生成的文本节点的内容。

```javascript
var newDiv = document.createElement('div');
var newContent = document.createTextNode('Hello');
newDiv.appendChild(newContent);
```

上面代码新建一个`div`节点和一个文本节点，然后将文本节点插入`div`节点。

这个方法可以确保返回的节点，被浏览器当作文本渲染，而不是当作HTML代码渲染。因此，可以用来展示用户的输入，避免XSS攻击。

```javascript
var div = document.createElement('div');
div.appendChild(document.createTextNode('<span>Foo & bar</span>'));
console.log(div.innerHTML)
// &lt;span&gt;Foo &amp; bar&lt;/span&gt;
```

上面代码中，`createTextNode`方法对大于号和小于号进行转义，从而保证即使用户输入的内容包含恶意代码，也能正确显示。

需要注意的是，该方法不对单引号和双引号转义，所以不能用来对HTML属性赋值。

```html
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

var userWebsite = '" onmouseover="alert(\'derp\')" "';
var profileLink = '<a href="' + escapeHtml(userWebsite) + '">Bob</a>';
var div = document.getElemenetById('target');
div.innerHtml = profileLink;
// <a href="" onmouseover="alert('derp')" "">Bob</a>
```

上面代码中，由于`createTextNode`方法不转义双引号，导致`onmouseover`方法被注入了代码。

### document.createAttribute()

`document.createAttribute`方法生成一个新的属性对象节点，并返回它。

```javascript
attribute = document.createAttribute(name);
```

createAttribute方法的参数name，是属性的名称。

```javascript
var node = document.getElementById("div1");
var a = document.createAttribute("my_attrib");
a.value = "newVal";
node.setAttributeNode(a);

// 等同于

var node = document.getElementById("div1");
node.setAttribute("my_attrib", "newVal");
```

### document.createDocumentFragment()

createDocumentFragment方法生成一个DocumentFragment对象。

```javascript
var docFragment = document.createDocumentFragment();
```

DocumentFragment对象是一个存在于内存的DOM片段，但是不属于当前文档，常常用来生成较复杂的DOM结构，然后插入当前文档。这样做的好处在于，因为DocumentFragment不属于当前文档，对它的任何改动，都不会引发网页的重新渲染，比直接修改当前文档的DOM有更好的性能表现。

```javascript
var docfrag = document.createDocumentFragment();

[1, 2, 3, 4].forEach(function(e) {
  var li = document.createElement("li");
  li.textContent = e;
  docfrag.appendChild(li);
});

document.body.appendChild(docfrag);
```

## 事件相关的方法

### document.createEvent()

`document.createEvent`方法生成一个事件对象，该对象可以被`element.dispatchEvent`方法使用，触发指定事件。

```javascript
var event = document.createEvent(type);
```

createEvent方法的参数是事件类型，比如UIEvents、MouseEvents、MutationEvents、HTMLEvents。

```javascript
var event = document.createEvent('Event');
event.initEvent('build', true, true);
document.addEventListener('build', function (e) {
  // ...
}, false);
document.dispatchEvent(event);
```

### document.addEventListener()，document.removeEventListener()，document.dispatchEvent()

以下三个方法与`document`节点的事件相关。这些方法都继承自EventTarget接口，详细介绍参见《Event对象》章节的《EventTarget》部分。

```javascript
// 添加事件监听函数
document.addEventListener('click', listener, false);

// 移除事件监听函数
document.removeEventListener('click', listener, false);

// 触发事件
var event = new Event('click');
document.dispatchEvent(event);
```

## 其他方法

### document.hasFocus()

`document.hasFocus`方法返回一个布尔值，表示当前文档之中是否有元素被激活或获得焦点。

```javascript
var focused = document.hasFocus();
```

注意，有焦点的文档必定被激活（active），反之不成立，激活的文档未必有焦点。比如如果用户点击按钮，从当前窗口跳出一个新窗口，该新窗口就是激活的，但是不拥有焦点。

### document.createNodeIterator()，document.createTreeWalker()

以下方法用于遍历元素节点。

**（1）document.createNodeIterator()**

`document.createNodeIterator`方法返回一个DOM的子节点遍历器。

```javascript
var nodeIterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_ELEMENT
);
```

上面代码返回body元素的遍历器。createNodeIterator方法的第一个参数为遍历器的根节点，第二个参数为所要遍历的节点类型，这里指定为元素节点。其他类型还有所有节点（NodeFilter.SHOW_ALL）、文本节点（NodeFilter.SHOW_TEXT）、评论节点（NodeFilter.SHOW_COMMENT）等。

所谓“遍历器”，在这里指可以用nextNode方法和previousNode方法依次遍历根节点的所有子节点。

```javascript
var nodeIterator = document.createNodeIterator(document.body);
var pars = [];
var currentNode;

while (currentNode = nodeIterator.nextNode()) {
  pars.push(currentNode);
}
```

上面代码使用遍历器的nextNode方法，将根节点的所有子节点，按照从头部到尾部的顺序，读入一个数组。nextNode方法先返回遍历器的内部指针所在的节点，然后会将指针移向下一个节点。所有成员遍历完成后，返回null。previousNode方法则是先将指针移向上一个节点，然后返回该节点。

```javascript
var nodeIterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_ELEMENT
);

var currentNode = nodeIterator.nextNode();
var previousNode = nodeIterator.previousNode();

currentNode === previousNode // true
```

上面代码中，currentNode和previousNode都指向同一个的节点。

有一个需要注意的地方，遍历器返回的第一个节点，总是根节点。

**（2）document.createTreeWalker()**

`document.createTreeWalker`方法返回一个DOM的子树遍历器。它与createNodeIterator方法的区别在于，后者只遍历子节点，而它遍历整个子树。

`document.createTreeWalker`方法的第一个参数，是所要遍历的根节点，第二个参数指定所要遍历的节点类型。

```javascript
var treeWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT
);

var nodeList = [];

while(treeWalker.nextNode()) nodeList.push(treeWalker.currentNode);
```

上面代码遍历body节点下属的所有元素节点，将它们插入nodeList数组。

### document.adoptNode()

`document.adoptNode`方法将某个节点，从其原来所在的文档移除，插入当前文档，并返回插入后的新节点。

```javascript
node = document.adoptNode(externalNode);
```

### document.importNode()

`document.importNode`方法从外部文档拷贝指定节点，插入当前文档。

```javascript
var node = document.importNode(externalNode, deep);
```

`document.importNode`方法用于创造一个外部节点的拷贝，然后插入当前文档。它的第一个参数是外部节点，第二个参数是一个布尔值，表示对外部节点是深拷贝还是浅拷贝，默认是浅拷贝（false）。虽然第二个参数是可选的，但是建议总是保留这个参数，并设为`true`。

注意，`importNode方法`只是拷贝外部节点，这时该节点的父节点是null。下一步还必须将这个节点插入当前文档的DOM树。

```javascript
var iframe = document.getElementsByTagName('iframe')[0];
var oldNode = iframe.contentWindow.document.getElementById('myNode');
var newNode = document.importNode(oldNode, true);
document.getElementById("container").appendChild(newNode);
```

上面代码从`iframe`窗口，拷贝一个指定节点`myNode`，插入当前文档。

### document.getSelection()

这个方法指向`window.getSelection()`，参见`window`对象一节的介绍。
