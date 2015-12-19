---
title: document节点
layout: page
category: dom
date: 2014-05-18
modifiedOn: 2014-05-18
---

## document节点概述

`document`节点是文档的根节点，每张网页都有自己的`document`节点。`window.document`属性就指向这个节点。也就是说，只要浏览器开始载入HTML文档，这个节点对象就存在了，可以直接调用。

document节点有不同的办法可以获取。

- 对于正常的网页，直接使用`document`或`window.document`。
- 对于`iframe`载入的网页，使用`iframe`节点的`contentDocument`属性。
- 对Ajax操作返回的文档，使用XMLHttpRequest对象的`responseXML`属性。
- 对于某个节点包含的文档，使用该节点的`ownerDocument`属性。

上面这四种`document`节点，都部署了[Document接口](http://dom.spec.whatwg.org/#interface-document)，因此有共同的属性和方法。当然，各自也有一些自己独特的属性和方法，比如HTML和XML文档的`document`节点就不一样。

## document节点的属性

document节点有很多属性，用得比较多的是下面这些。

### doctype，documentElement，defaultView，body，head，activeElement

以下属性指向文档内部的某个节点。

**（1）doctype**

对于HTML文档来说，document对象一般有两个子节点。第一个子节点是document.doctype，它是一个对象，包含了当前文档类型（Document Type Declaration，简写DTD）信息。对于HTML5文档，该节点就代表&lt;!DOCTYPE html&gt;。如果网页没有声明DTD，该属性返回null。

```javascript

var doctype = document.doctype;

doctype // "<!DOCTYPE html>"
doctype.name // "html"

```

document.firstChild通常就返回这个节点。

**（2）documentElement**

document.documentElement属性，表示当前文档的根节点（root）。它通常是document节点的第二个子节点，紧跟在`document.doctype`节点后面。

对于HTML网页，该属性返回HTML节点，代表&lt;html lang="en"&gt;。

**（3）defaultView**

defaultView属性，在浏览器中返回document对象所在的window对象，否则返回null。

```javascript

var win = document.defaultView;

```

**（4）body**

body属性返回当前文档的body或frameset节点，如果不存在这样的节点，就返回null。这个属性是可写的，如果对其写入一个新的节点，会导致原有的所有子节点被移除。

**（4）head**

head属性返回当前文档的head节点。如果当前文档有多个head，则返回第一个。

```javascript
document.head === document.querySelector('head')
```

**（5）activeElement**

activeElement属性返回当前文档中获得焦点的那个元素。用户通常可以使用tab键移动焦点，使用空格键激活焦点，比如如果焦点在一个链接上，此时按一下空格键，就会跳转到该链接。

### documentURI，URL，domain，lastModified，location，referrer，title，characterSet

以下属性返回文档信息。

**（1）documentURI，URL**

documentURI属性和URL属性都返回当前文档的网址。不同之处是documentURI属性是所有文档都具备的，URL属性则是HTML文档独有的。

**（2）domain**

domain属性返回当前文档的域名。比如，某张网页的网址是 http://www.example.com/hello.html ，domain属性就等于 www.example.com 。如果无法获取域名，该属性返回null。

```javascript

var badDomain = "www.example.xxx";

if (document.domain === badDomain)
  window.close();

```

上面代码判断，如果当前域名等于指定域名，则关闭窗口。

二级域名的情况下，domain属性可以设置为对应的一级域名。比如，当前域名是sub.example.com，则domain属性可以设置为example.com。除此之外的写入，都是不可以的。

**（3）lastModified**

lastModified属性返回当前文档最后修改的时间戳，格式为字符串。

```javascript

document.lastModified
// Tuesday, July 10, 2001 10:19:42

```

注意，lastModified属性的值是字符串，所以不能用来直接比较，两个文档谁的日期更新，需要用Date.parse方法转成时间戳格式，才能进行比较。

```javascript

if (Date.parse(doc1.lastModified) > Date.parse(doc2.lastModified)) {
  // ...
}

```

**（4）location**

location属性返回一个只读对象，提供了当前文档的URL信息。

```javascript

// 假定当前网址为http://user:passwd@www.example.com:4097/path/a.html?x=111#part1

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

// 跳转到另一个网址
document.location.assign('http://www.google.com')
// 优先从服务器重新加载
document.location.reload(true)
// 优先从本地缓存重新加载（默认值）
document.location.reload(false)
// 跳转到另一个网址，但当前文档不保留在history对象中，
// 即无法用后退按钮，回到当前文档
document.location.assign('http://www.google.com')
// 将location对象转为字符串，等价于document.location.href
document.location.toString()

```

虽然location属性返回的对象是只读的，但是可以将URL赋值给这个属性，网页就会自动跳转到指定网址。

```javascript

document.location = 'http://www.example.com';
// 等价于
document.location.href = 'http://www.example.com';

```

document.location属性与window.location属性等价，历史上，IE曾经不允许对document.location赋值，为了保险起见，建议优先使用window.location。如果只是单纯地获取当前网址，建议使用document.URL。

**（5）referrer**

referrer属性返回一个字符串，表示前文档的访问来源，如果是无法获取来源或是用户直接键入网址，而不是从其他网页点击，则返回一个空字符串。

**（6）title**

title属性返回当前文档的标题，该属性是可写的。

```javascript
document.title = '新标题';
```

**（7）characterSet**

characterSet属性返回渲染当前文档的字符集，比如UTF-8、ISO-8859-1。

### readyState，designModed

以下属性与文档行为有关。

**（1）readyState**

readyState属性返回当前文档的状态，共有三种可能的值，加载HTML代码阶段（尚未完成解析）是“loading”，加载外部资源阶段是“interactive”，全部加载完成是“complete”。

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

**（2）designModed**

designMode属性控制当前document是否可编辑。通常会打开iframe的designMode属性，将其变为一个所见即所得的编辑器。

```javascript

iframe_node.contentDocument.designMode = "on";

```

### implementation，compatMode

以下属性返回文档的环境信息。

**（1）implementation**

implementation属性返回一个对象，用来甄别当前环境部署了哪些DOM相关接口。implementation属性的hasFeature方法，可以判断当前环境是否部署了特定版本的特定接口。

```javascript

document.implementation.hasFeature( 'HTML, 2.0 )
// true

document.implementation.hasFeature('MutationEvents','2.0')
// true

```

上面代码表示，当前环境部署了DOM HTML 2.0版和MutationEvents的2.0版。

**（2）compatMode**

compatMode属性返回浏览器处理文档的模式，可能的值为BackCompat（向后兼容模式）和 CSS1Compat（严格模式）。

### anchors，embeds，forms，images，links，scripts，styleSheets

以下属性返回文档内部特定元素的集合（即HTMLCollection对象，详见下文）。这些集合都是动态的，原节点有任何变化，立刻会反映在集合中。

**（1）anchors**

anchors属性返回网页中所有的a节点元素。注意，只有指定了name属性的a元素，才会包含在anchors属性之中。

**（2）embeds**

embeds属性返回网页中所有嵌入对象，即embed标签，返回的格式为类似数组的对象（nodeList）。

**（3）forms**

forms属性返回页面中所有表单。

```javascript

var selectForm = document.forms[index];
var selectFormElement = document.forms[index].elements[index];

```

上面代码获取指定表单的指定元素。

**（4）images**

images属性返回页面所有图片元素（即img标签）。

```javascript

var ilist = document.images;

for(var i = 0; i < ilist.length; i++) {
  if(ilist[i].src == "banner.gif") {
    // ...
  }
}

```

上面代码在所有img标签中，寻找特定图片。

**（4）links**

links属性返回当前文档所有的链接元素（即a标签，或者说具有href属性的元素）。

**（5）scripts**

scripts属性返回当前文档的所有脚本（即script标签）。

```javascript
var scripts = document.scripts;
if (scripts.length !== 0 ) {
  console.log("当前网页有脚本");
}
```

**（6）styleSheets**

styleSheets属性返回一个类似数组的对象，包含了当前网页的所有样式表。该属性提供了样式表操作的接口。然后，每张样式表对象的cssRules属性，返回该样式表的所有CSS规则。这又方便了操作具体的CSS规则。

```javascript

var allSheets = [].slice.call(document.styleSheets);

```

上面代码中，使用slice方法将document.styleSheets转为数组，以便于进一步处理。

### cookie

**（1）概述**

cookie是服务器要求浏览器保存的一段信息。以后，浏览器每次向服务器发出请求，就会自动附上这段信息。

`document.cookie`属性返回当前网页的cookie。

```javascript
// 读取当前网页的所有cookie
allCookies = document.cookie;
```

该属性是可写的，但是一次只能写入一个cookie，也就是说写入并不是覆盖，而是添加。另外，cookie的值必须对分号、逗号和空格进行转义。

```javascript
// 写入一个新cookie
document.cookie = "test1=hello";
// 再写入一个cookie
document.cookie = "test2=world";

document.cookie
// test1=hello;test2=world
```

`document.cookie`属性的读写操作含义不同，跟服务器与浏览器的通信格式有关。浏览器向服务器发送cookie，是一次性所有cookie全部发送。

```http
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: cookie_name1=cookie_value1; cookie_name2=cookie_value2
Accept: */*
```

服务器告诉浏览器需要储存cookie，则是分行指定。

```http
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: cookie_name1=cookie_value1
Set-Cookie: cookie_name2=cookie_value2; expires=Sun, 16 Jul 3567 06:23:41 GMT
```

cookie的值可以用encodeURIComponent方法进行处理，对逗号、分号、空格进行转义（这些符号都不允许作为cookie的值）。

**（2）cookie的属性**

除了cookie本身的内容，还有一些可选的属性也是可以写入的，它们都必须以分号开头。

```http
Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]
```

- ; path=path，指定路径，必须是绝对路径（比如'/'，'/mydir'），如果未指定，默认为设定该cookie的路径。只有path属性匹配向服务器发送的路径，cookie才会发送。这里的匹配不是绝对匹配，而是从根路径开始，只要path属性匹配发送路径的一部分，就可以发送。比如，path属性等于`/blog`，则发送路径是`/blog`或者`/blogroll`，cookie都会发送。path属性生效的前提是domain属性匹配。

- ; domain=domain，指定cookie所在的域名，比如'example.com'，'.example.com'（这种写法将对所有子域名生效）、'subdomain.example.com'。如果未指定，默认为设定该cookie的域名。所指定的域名必须是当前发送cookie的域名的一部分，比如当前访问的域名是example.com，就不能将其设为google.com。只有访问的域名匹配domain属性，cookie才会发送到服务器。

- ; max-age=max-age-in-seconds，指定cookie有效期，比如60*60*24*365（即一年31536e3秒）。

- ; expires=date-in-GMTString-format，指定cookie过期时间，日期格式等同于Date.toUTCString()的格式。如果不设置该属性，则cookie只在当前会话（session）有效，浏览器窗口一旦关闭，当前session结束，该cookie就会被删除。浏览器根据本地时间，决定cookie是否过期，由于本地时间是不精确的，所以没有办法保证cookie一定会在服务器指定的时间过期。

- ; secure，指定cookie只能在加密协议HTTPS下发送到服务器。该属性只是一个开关，不需要设定值。在HTTPS协议下设定的cookie，该开关自动打开。

以上属性可以同时设置一个或多个，也没有次序的要求。如果服务器想改变一个早先设置的cookie，必须同时满足四个条件：cookie的名字、domain、path和secure。也就是说，如果原始的cookie是用如下的Set-Cookie头命令设置的。

```http
Set-Cookie: key1=value1; domain=example.com; path=/blog
```

改变上面这个cookie的值，就必须使用同样的Set-Cookie命令。

```http
Set-Cookie: key1=value2; domain=example.com; path=/blog
```

只要有一个属性不同，就会生成一个全新的cookie，而不是替换掉原来那个cookie。

```http
Set-Cookie: key1=value2; domain=example.com; path=/
```

上面的命令设置了一个全新的同名cookie。下一次访问`example.com/blog`的时候，浏览器将向服务器发送两个同名的cookie。

```http
Cookie: key1=value1; key1=value2
```

上面代码的两个cookie是同名的，匹配越精确的cookie排在越前面。

```javascript
var str = 'someCookieName=true';
str += '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
str += '; path=/';

document.cookie = str;
```

另外，上面这些cookie属性只能用来设置cookie。一旦设置完成，就没有办法从某个cookie读取这些属性的值。

删除一个cookie的简便方法，就是设置expires属性等于0。

**（3）cookie的限制**

浏览器对cookie的数量和长度有限制，但是每个浏览器的规定是不一样的。

- IE6：每个域名20个cookie。
- IE7，IE8，Firefox：每个域名50个cookie
- Safari，Chrome：没有域名数量的限制。

所有cookie的累加长度限制为4KB。超过这个长度的cookie，将被忽略，不会被设置。

由于cookie存在数量限制，有时为了规避限制，可以将cookie设置成下面的形式。

```http
name=a=b&c=d&e=f&g=h
```

上面代码实际上是设置了一个cookie，但是这个cookie内部使用&符号，设置了多部分的内容。因此，可以在一个cookie里面，通过自行解析，可以得到多个键值对。这样就规避了cookie的数量限制。

**（4）HTTP-Only cookie**

设置cookie的时候，如果服务器加上了HTTPOnly属性，则这个cookie无法被JavaScript读取（即`document.cookie`不会返回这个cookie的值），只用于向服务器发送。

```http
Set-Cookie: key=value; HttpOnly
```

上面的这个cookie将无法用JavaScript获取。进行AJAX操作时，getAllResponseHeaders方法或getResponseHeader方法也不会显示这个头命令。

## document对象的方法

document对象主要有以下一些方法。

### open()，close()，write()，writeln()

document.open方法用于新建一个文档，供write方法写入内容。它实际上等于清除当前文档，重新写入内容。不要将此方法与window.open()混淆，后者用来打开一个新窗口，与当前文档无关。

document.close方法用于关闭open方法所新建的文档。一旦关闭，write方法就无法写入内容了。如果再调用write方法，就等同于又调用open方法，新建一个文档，再写入内容。

document.write方法用于向当前文档写入内容。只要当前文档还没有用close方法关闭，它所写入的内容就会追加在已有内容的后面。

```js
// 页面显示“helloworld”
document.open();
document.write("hello");
document.write("world");
document.close();
```

如果页面已经渲染完成（DOMContentLoaded事件发生之后），再调用write方法，它会先调用open方法，擦除当前文档所有内容，然后再写入。

```javascript

document.addEventListener("DOMContentLoaded", function(event) {
  document.write('<p>Hello World!</p>');
});

// 等同于

document.addEventListener("DOMContentLoaded", function(event) {
  document.open();
  document.write('<p>Hello World!</p>');
  document.close();
});

```

如果在页面渲染过程中调用write方法，并不会调用open方法。（可以理解成，open方法已调用，但close方法还未调用。）

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

在浏览器打开上面网页，将会显示“hello world”。

需要注意的是，虽然调用close方法之后，无法再用write方法写入内容，但这时当前页面的其他DOM节点还是会继续加载。

```html
<html>
<head>
<title>write example</title>
<script type="text/javascript">
  document.open();
  document.write("hello");
  document.close();
</script>
</head>
<body>
world
</body>
</html>
```

在浏览器打开上面网页，将会显示“hello world”。

总之，除了某些特殊情况，应该尽量避免使用document.write这个方法。

document.writeln方法与write方法完全一致，除了会在输出内容的尾部添加换行符。

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

注意，writeln方法添加的是ASCII码的换行符，渲染成HTML网页时不起作用。

### hasFocus()

document.hasFocus方法返回一个布尔值，表示当前文档之中是否有元素被激活或获得焦点。

```javascript

focused = document.hasFocus();

```

注意，有焦点的文档必定被激活（active），反之不成立，激活的文档未必有焦点。比如如果用户点击按钮，从当前窗口跳出一个新窗口，该新窗口就是激活的，但是不拥有焦点。

### querySelector()，getElementById()，querySelectorAll()，getElementsByTagName()，getElementsByClassName()，getElementsByName()，elementFromPoint()

以下方法用来选中当前文档中的元素。

**（1）querySelector()**

`querySelector`方法返回匹配指定的CSS选择器的元素节点。如果有多个节点满足匹配条件，则返回第一个匹配的节点。如果没有发现匹配的节点，则返回`null`。

```javascript
var el1 = document.querySelector('.myclass');
var el2 = document.querySelector('#myParent > [ng-click]');
```

`querySelector`方法无法选中CSS伪元素。

**（2）getElementById()**

`getElementById`方法返回匹配指定ID属性的元素节点。如果没有发现匹配的节点，则返回null。

```javascript
var elem = document.getElementById("para1");
```

注意，在搜索匹配节点时，`id`属性是大小写敏感的。比如，如果某个节点的`id`属性是`main`，那么`document.getElementById("Main")`将返回`null`，而不是指定节点。

`getElementById`方法与`querySelector`方法都能获取元素节点，不同之处是`querySelector`方法的参数使用CSS选择器语法，`getElementById`方法的参数是HTML标签元素的id属性。

```javascript
document.getElementById('myElement')
document.querySelector('#myElement')
```

上面代码中，两个方法都能选中id为myElement的元素，但是getElementById()比querySelector()效率高得多。

**（3）querySelectorAll()**

`querySelectorAll`方法返回匹配指定的CSS选择器的所有节点，返回的是NodeList类型的对象。NodeList对象不是动态集合，所以元素节点的变化无法实时反映在返回结果中。

```javascript
elementList = document.querySelectorAll(selectors);
```

querySelectorAll方法的参数，可以是逗号分隔的多个CSS选择器，返回所有匹配其中一个选择器的元素。

```javascript
var matches = document.querySelectorAll('div.note, div.alert');
```

上面代码返回class属性是note或alert的div元素。

querySelectorAll方法支持复杂的CSS选择器。

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

如果querySelectorAll方法和getElementsByTagName方法的参数是字符串“*”，则会返回文档中的所有HTML元素节点。

与querySelector方法一样，querySelectorAll方法无法选中CSS伪元素。

**（4）getElementsByClassName()**

getElementsByClassName方法返回一个类似数组的对象（HTMLCollection类型的对象），包括了所有class名字符合指定条件的元素（搜索范围包括本身），元素的变化实时反映在返回结果中。这个方法不仅可以在document对象上调用，也可以在任何元素节点上调用。

```javascript
// document对象上调用
var elements = document.getElementsByClassName(names);
// 非document对象上调用
var elements = rootElement.getElementsByClassName(names);
```

getElementsByClassName方法的参数，可以是多个空格分隔的class名字，返回同时具有这些节点的元素。

```javascript
document.getElementsByClassName('red test');
```

上面代码返回class同时具有red和test的元素。

**（5）getElementsByTagName()**

getElementsByTagName方法返回所有指定标签的元素（搜索范围包括本身）。返回值是一个HTMLCollection对象，也就是说，搜索结果是一个动态集合，任何元素的变化都会实时反映在返回的集合中。这个方法不仅可以在document对象上调用，也可以在任何元素节点上调用。

```javascript
var paras = document.getElementsByTagName("p");
```

上面代码返回当前文档的所有p元素节点。

注意，getElementsByTagName方法会将参数转为小写后，再进行搜索。

**（6）getElementsByName()**

getElementsByName方法用于选择拥有name属性的HTML元素，比如form、img、frame、embed和object，返回一个NodeList格式的对象，不会实时反映元素的变化。

```javascript

// 假定有一个表单是<form name="x"></form>
var forms = document.getElementsByName("x");
forms[0].tagName // "FORM"

```

注意，在IE浏览器使用这个方法，会将没有name属性、但有同名id属性的元素也返回，所以name和id属性最好设为不一样的值。

**（7）elementFromPoint()**

elementFromPoint方法返回位于页面指定位置的元素。

```javascript
var element = document.elementFromPoint(x, y);
```

上面代码中，elementFromPoint方法的参数x和y，分别是相对于当前窗口左上角的横坐标和纵坐标，单位是CSS像素。elementFromPoint方法返回位于这个位置的DOM元素，如果该元素不可返回（比如文本框的滚动条），则返回它的父元素（比如文本框）。如果坐标值无意义（比如负值），则返回null。

### createElement()，createTextNode()，createAttribute()，createDocumentFragment()

以下方法用于生成元素节点。

**（1）createElement()**

createElement方法用来生成HTML元素节点。

```javascript
var element = document.createElement(tagName);
// 实例
var newDiv = document.createElement("div");
```

createElement方法的参数为元素的标签名，即元素节点的tagName属性。如果传入大写的标签名，会被转为小写。如果参数带有尖括号（即&lt;和&gt;）或者是null，会报错。

**（2）createTextNode()**

createTextNode方法用来生成文本节点，参数为所要生成的文本节点的内容。

```javascript
var newDiv = document.createElement("div");
var newContent = document.createTextNode("Hello");
newDiv.appendChild(newContent);
```

上面代码新建一个div节点和一个文本节点，然后将文本节点插入div节点。

**（3）createAttribute()**

createAttribute方法生成一个新的属性对象节点，并返回它。

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

**（4）createDocumentFragment()**

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

### createEvent()

createEvent方法生成一个事件对象，该对象可以被element.dispatchEvent方法使用，触发指定事件。

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

### createNodeIterator()，createTreeWalker()

以下方法用于遍历元素节点。

**（1）createNodeIterator()**

createNodeIterator方法返回一个DOM的子节点遍历器。

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

**（2）createTreeWalker()**

createTreeWalker方法返回一个DOM的子树遍历器。它与createNodeIterator方法的区别在于，后者只遍历子节点，而它遍历整个子树。

createTreeWalker方法的第一个参数，是所要遍历的根节点，第二个参数指定所要遍历的节点类型。

```javascript
var treeWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT
);

var nodeList = [];

while(treeWalker.nextNode()) nodeList.push(treeWalker.currentNode);
```

上面代码遍历body节点下属的所有元素节点，将它们插入nodeList数组。

### adoptNode()，importNode()

以下方法用于获取外部文档的节点。

**（1）adoptNode()**

adoptNode方法将某个节点，从其原来所在的文档移除，插入当前文档，并返回插入后的新节点。

```javascript
node = document.adoptNode(externalNode);
```

importNode方法从外部文档拷贝指定节点，插入当前文档。

```javascript
var node = document.importNode(externalNode, deep);
```

**（2）importNode()**

importNode方法用于创造一个外部节点的拷贝，然后插入当前文档。它的第一个参数是外部节点，第二个参数是一个布尔值，表示对外部节点是深拷贝还是浅拷贝，默认是浅拷贝（false）。虽然第二个参数是可选的，但是建议总是保留这个参数，并设为true。

另外一个需要注意的地方是，importNode方法只是拷贝外部节点，这时该节点的父节点是null。下一步还必须将这个节点插入当前文档的DOM树。

```javascript
var iframe = document.getElementsByTagName("iframe")[0];
var oldNode = iframe.contentWindow.document.getElementById("myNode");
var newNode = document.importNode(oldNode, true);
document.getElementById("container").appendChild(newNode);
```

上面代码从iframe窗口，拷贝一个指定节点myNode，插入当前文档。

### addEventListener()，removeEventListener()，dispatchEvent()

以下三个方法与Document节点的事件相关。这些方法都继承自EventTarget接口，详细介绍参见《Event对象》章节的《EventTarget》部分。

```javascript
// 添加事件监听函数
document.addEventListener('click', listener, false);

// 移除事件监听函数
document.removeEventListener('click', listener, false);

// 触发事件
var event = new Event('click');
document.dispatchEvent(event);
```


