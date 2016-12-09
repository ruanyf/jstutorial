---
title: Element对象
category: dom
layout: page
date: 2015-04-15
modifiedOn: 2015-04-15
---

`Element`对象对应网页的HTML标签元素。每一个HTML标签元素，在DOM树上都会转化成一个`Element`节点对象（以下简称元素节点）。

元素节点的`nodeType`属性都是`1`，但是不同HTML标签生成的元素节点是不一样的。JavaScript内部使用不同的构造函数，生成不同的Element节点，比如`<a>`标签的节点对象由`HTMLAnchorElement()`构造函数生成，`<button>`标签的节点对象由`HTMLButtonElement()`构造函数生成。因此，元素节点不是一种对象，而是一组对象。

## 特征相关的属性

以下属性与元素特点本身的特征相关。

### Element.attributes

`Element.attributes`属性返回一个类似数组的对象，成员是当前元素节点的所有属性节点，详见本章《属性的操作》一节。

### Element.id，Element.tagName

`Element.id`属性返回指定元素的`id`属性，该属性可读写。

`Element.tagName`属性返回指定元素的大写标签名，与`nodeName`属性的值相等。

```javascript
// HTML代码为
// <span id="myspan">Hello</span>
var span = document.getElementById('span');
span.id // "myspan"
span.tagName // "SPAN"
```

### Element.innerHTML

`Element.innerHTML`属性返回该元素包含的HTML代码。该属性可读写，常用来设置某个节点的内容。

如果将该属性设为空，等于删除所有它包含的所有节点。

```javascript
el.innerHTML = '';
```

上面代码等于将`el`节点变成了一个空节点，`el`原来包含的节点被全部删除。

注意，如果文本节点中包含`&`、小于号（`<`）和大于号（`>`），`innerHTML`属性会将它们转为实体形式`&amp;`、`&lt;`、`&gt;`。

```javascript
// HTML代码如下 <p id="para"> 5 > 3 </p>
document.getElementById('para').innerHTML
// 5 &gt; 3
```

由于上面这个原因，导致用`innerHTML`插入`<script>`标签，不会被执行。

```javascript
var name = "<script>alert('haha')</script>";
el.innerHTML = name;
```

上面代码将脚本插入内容，脚本并不会执行。但是，`innerHTML`还是有安全风险的。

```javascript
var name = "<img src=x onerror=alert(1)>";
el.innerHTML = name;
```

上面代码中，`alert`方法是会执行的。因此为了安全考虑，如果插入的是文本，最好用`textContent`属性代替`innerHTML`。

### Element.outerHTML

`Element.outerHTML`属性返回一个字符串，内容为指定元素节点的所有HTML代码，包括它自身和包含的所有子元素。

```javascript
// HTML代码如下
// <div id="d"><p>Hello</p></div>

d = document.getElementById('d');
d.outerHTML
// '<div id="d"><p>Hello</p></div>'
```

`outerHTML`属性是可读写的，对它进行赋值，等于替换掉当前元素。

```javascript
// HTML代码如下
// <div id="container"><div id="d">Hello</div></div>

container = document.getElementById('container');
d = document.getElementById("d");
container.firstChild.nodeName // "DIV"
d.nodeName // "DIV"

d.outerHTML = '<p>Hello</p>';
container.firstChild.nodeName // "P"
d.nodeName // "DIV"
```

上面代码中，`outerHTML`属性重新赋值以后，内层的`div`元素就不存在了，被`p`元素替换了。但是，变量`d`依然指向原来的`div`元素，这表示被替换的`DIV`元素还存在于内存中。

### Element.className，Element.classList

`className`属性用来读写当前元素节点的`class`属性。它的值是一个字符串，每个`class`之间用空格分割。

`classList`属性则返回一个类似数组的对象，当前元素节点的每个`class`就是这个对象的一个成员。

```html
<div class="one two three" id="myDiv"></div>
```

上面这个`div`元素的节点对象的`className`属性和`classList`属性，分别如下。

```javascript
document.getElementById('myDiv').className
// "one two three"

document.getElementById('myDiv').classList
// {
//   0: "one"
//   1: "two"
//   2: "three"
//   length: 3
// }
```

从上面代码可以看出，`className`属性返回一个空格分隔的字符串，而`classList`属性指向一个类似数组的对象，该对象的`length`属性（只读）返回当前元素的`class`数量。

classList对象有下列方法。

- add()：增加一个class。
- remove()：移除一个class。
- contains()：检查当前元素是否包含某个class。
- toggle()：将某个class移入或移出当前元素。
- item()：返回指定索引位置的class。
- toString()：将class的列表转为字符串。

```javascript
myDiv.classList.add('myCssClass');
myDiv.classList.add('foo', 'bar');
myDiv.classList.remove('myCssClass');
myDiv.classList.toggle('myCssClass'); // 如果myCssClass不存在就加入，否则移除
myDiv.classList.contains('myCssClass'); // 返回 true 或者 false
myDiv.classList.item(0); // 返回第一个Class
myDiv.classList.toString();
```

下面比较一下，className和classList在添加和删除某个类时的写法。

```javascript
// 添加class
document.getElementById('foo').className += 'bold';
document.getElementById('foo').classList.add('bold');

// 删除class
document.getElementById('foo').classList.remove('bold');
document.getElementById('foo').className =
  document.getElementById('foo').className.replace(/^bold$/, '');
```

toggle方法可以接受一个布尔值，作为第二个参数。如果为`true`，则添加该属性；如果为`false`，则去除该属性。

```javascript
el.classList.toggle('abc', boolValue);

// 等同于

if (boolValue){
  el.classList.add('abc');
} else {
  el.classList.remove('abc');
}
```

## 盒状模型相关属性

### Element.clientHeight，Element.clientWidth

`Element.clientHeight`属性返回元素节点可见部分的高度，`Element.clientWidth`属性返回元素节点可见部分的宽度。所谓“可见部分”，指的是不包括溢出（overflow）的大小，只返回该元素在容器中占据的大小，对于有滚动条的元素来说，它们等于滚动条围起来的区域大小。这两个属性的值包括Padding、但不包括滚动条、边框和Margin，单位为像素。这两个属性可以计算得到，等于元素的CSS高度（或宽度）加上CSS的Padding，减去滚动条（如果存在）。

对于整张网页来说，当前可见高度（即视口高度）要从`document.documentElement`对象（即`<html>`节点）上获取，等同于`window.innerHeight`属性减去水平滚动条的高度。没有滚动条时，这两个值是相等的；有滚动条时，前者小于后者。

```javascript
var rootElement = document.documentElement;

// 没有水平滚动条时
rootElement.clientHeight === window.innerHeight // true

// 没有垂直滚动条时
rootElement.clientWidth === window.innerWidth // true
```

注意，这里不能用`document.body.clientHeight`或`document.body.clientWidth`，因为`document.body`返回`<body>`节点，与视口大小是无关的。

### Element.clientLeft，Element.clientTop

`Element.clientLeft`属性等于元素节点左边框（left border）的宽度，`Element.clientTop`属性等于网页元素顶部边框的宽度，单位为像素。

这两个属性包括滚动条的宽度，但不包括Margin和Padding。不过，一般来说，除非排版方向是从右到左，且发生元素高度溢出，否则不可能存在左侧滚动条，亦不可能存在顶部的滚动条。

如果元素的显示设为`display: inline`，它的`clientLeft`属性一律为`0`，不管是否存在左边框。

### Element.scrollHeight，Element.scrollWidth

`Element.scrollHeight`属性返回某个网页元素的总高度，`Element.scrollWidth`属性返回总宽度，可以理解成元素在垂直和水平两个方向上可以滚动的距离。它们都包括由于溢出容器而无法显示在网页上的那部分高度或宽度。这两个属性是只读属性。

它们返回的是整个元素的高度或宽度，包括由于存在滚动条而不可见的部分。默认情况下，它们包括Padding，但不包括Border和Margin。

整张网页的总高度可以从`document.documentElement`或`document.body`上读取。

```javascript
document.documentElement.scrollHeight
```

如果内容正好适合它的容器，没有溢出，那么`Element.scrollHeight`和`Element.clientHeight`是相等的，`scrollWidth`属性与`clientHeight`属性是相等的。如果存在溢出，那么`scrollHeight`属性大于`clientHeight`属性，`scrollWidth`属性大于`clientHeight`属性。

存在溢出时，当滚动条滚动到内容底部时，下面的表达式为`true`。

```javascript
element.scrollHeight - element.scrollTop === element.clientHeight
```

如果滚动条没有滚动到内容底部，上面的表达式为`false`。这个特性结合`onscroll`事件，可以判断用户是否滚动到了指定元素的底部，比如向用户展示某个内容区块时，判断用户是否滚动到了区块的底部。

```javascript
var rules = document.getElementById('rules');
rules.onscroll = checking;

function checking(){
  if (this.scrollHeight - this.scrollTop === this.clientHeight) {
    console.log('谢谢阅读');
  } else {
    console.log('您还未读完');
  }
}
```

### Element.scrollLeft，Element.scrollTop

`Element.scrollLeft`属性表示网页元素的水平滚动条向右侧滚动的像素数量，`Element.scrollTop`属性表示网页元素的垂直滚动条向下滚动的像素数量。对于那些没有滚动条的网页元素，这两个属性总是等于0。

如果要查看整张网页的水平的和垂直的滚动距离，要从`document.body`元素上读取。

```javascript
document.body.scrollLeft
document.body.scrollTop
```

这两个属性都可读写，设置该属性的值，会导致浏览器将指定元素自动滚动到相应的位置。

### Element.offsetHeight，Element.offsetWidth

`Element.offsetHeight`属性返回元素的垂直高度，`Element.offsetWidth`属性返回水平宽度。`offsetHeight`可以理解成元素左下角距离左上角的位移，`offsetWidth`是元素右上角距离左上角的位移。它们的单位为像素，都是只读。

这两个属性值包括`Padding`和`Border`、以及滚动条。这也意味着，如果不存在内容溢出，`Element.offsetHeight`只比`Element.clientHeight`多了边框的高度。

整张网页的高度，可以在`document.documentElement`和`document.body`上读取。

```javascript
// 网页总高度
document.documentElement.offsetHeight
document.body.offsetHeight

// 网页总宽度
document.documentElement.offsetWidth
document.body.offsetWidth
```

### Element.offsetLeft，Element.offsetTop

`Element.offsetLeft`返回当前元素左上角相对于`Element.offsetParent`节点的水平位移，`Element.offsetTop`返回垂直位移，单位为像素。通常，这两个值是指相对于父节点的位移。

下面的代码可以算出元素左上角相对于整张网页的坐标。

```javascript
function getElementPosition(e) {
  var x = 0;
  var y = 0;
  while (e !== null)  {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent;
  }
  return {x: x, y: y};
}
```

注意，上面的代码假定所有元素都适合它的容器，不存在内容溢出。

### Element.style

每个元素节点都有`style`用来读写该元素的行内样式信息，具体介绍参见《CSS操作》一节。

### 总结

整张网页的高度和宽度，可以从`document.documentElement`（即`<html>`元素）或`<body>`元素上读取。

```javascript
// 网页总高度
document.documentElement.offsetHeight
document.documentElement.scrollHeight
document.body.offsetHeight
document.body.scrollHeight

// 网页总宽度
document.documentElement.offsetWidth
document.documentElement.scrollWidth
document.body.offsetWidth
document.body.scrollWidth
```

由于`<html>`和`<body>`的宽度可能设得不一样，因此从`<body>`上取值会更保险一点。

视口的高度和宽度（包括滚动条），有两种方法可以获得。

```javascript
// 视口高度
window.innerHeight // 包括滚动条
document.documentElement.clientHeight // 不包括滚动条

// 视口宽度
window.innerWidth // 包括滚动条
document.documentElement.clientWidth // 不包括滚动条
```

某个网页元素距离视口左上角的坐标，使用`Element.getBoundingClientRect`方法读取。

```javascript
// 网页元素左上角的视口横坐标
Element.getBoundingClientRect().left

// 网页元素左上角的视口纵坐标
Element.getBoundingClientRect().top
```

某个网页元素距离网页左上角的坐标，使用视口坐标加上网页滚动距离。

```javascript
// 网页元素左上角的网页横坐标
Element.getBoundingClientRect().left + document.body.scrollLeft

// 网页元素左上角的网页纵坐标
Element.getBoundingClientRect().top + document.body.scrollTop
```

网页目前滚动的距离，可以从`document.body`对象上得到。

```javascript
// 网页滚动的水平距离
document.body.scrollLeft

// 网页滚动的垂直距离
document.body.scrollTop
```

网页元素本身的高度和宽度（不含overflow溢出的部分），通过`offsetHeight`和`offsetWidth`属性（包括`Padding`和`Border`）或`Element.getBoundingClientRect`方法获取。

```javascript
// 网页元素的高度
Element.offsetHeight

// 网页元素的宽度
Element.offsetWidth
```

## 相关节点的属性

以下属性返回元素节点的相关节点。

### Element.children，Element.childElementCount

`Element.children`属性返回一个`HTMLCollection`对象，包括当前元素节点的所有子元素。它是一个类似数组的动态对象（实时反映网页元素的变化）。如果当前元素没有子元素，则返回的对象包含零个成员。

```javascript
// para是一个p元素节点
if (para.children.length) {
  var children = para.children;
    for (var i = 0; i < children.length; i++) {
      // ...
    }
}
```

这个属性与`Node.childNodes`属性的区别是，它只包括HTML元素类型的子节点，不包括其他类型的子节点。

`Element.childElementCount`属性返回当前元素节点包含的子HTML元素节点的个数，与`Element.children.length`的值相同。注意，该属性只计算HTML元素类型的子节点。

### Element.firstElementChild，Element.lastElementChild

`Element.firstElementChild`属性返回第一个HTML元素类型的子节点，`Element.lastElementChild`返回最后一个HTML元素类型的子节点。

如果没有HTML类型的子节点，这两个属性返回`null`。

### Element.nextElementSibling，Element.previousElementSibling

`Element.nextElementSibling`属性返回当前HTML元素节点的后一个同级HTML元素节点，如果没有则返回`null`。

```javascript
// 假定HTML代码如下
// <div id="div-01">Here is div-01</div>
// <div id="div-02">Here is div-02</div>
var el = document.getElementById('div-01');
el.nextElementSibling
// <div id="div-02">Here is div-02</div>

```

`Element.previousElementSibling`属性返回当前HTML元素节点的前一个同级HTML元素节点，如果没有则返回`null`。

### Element.offsetParent

`Element.offsetParent`属性返回当前HTML元素的最靠近的、并且CSS的`position`属性不等于`static`的父元素。如果某个元素的所有上层节点都将`position`属性设为`static`，则`Element.offsetParent`属性指向`<body>`元素。

该属性主要用于确定子元素的位置偏移，是`Element.offsetTop`和`Element.offsetLeft`的计算基准。

## 属性相关的方法

元素节点提供以下四个方法，用来操作HTML标签的属性。

- `Element.getAttribute()`：读取指定属性
- `Element.setAttribute()`：设置指定属性
- `Element.hasAttribute()`：返回一个布尔值，表示当前元素节点是否有指定的属性
- `Element.removeAttribute()`：移除指定属性

这些属性的详细介绍，参见本章的《属性的操作》一节。

## 查找相关的方法

以下四个方法用来查找与当前元素节点相关的节点。这四个方法也部署在`document`对象上，用法完全一致。

- `Element.querySelector()`
- `Element.querySelectorAll()`
- `Element.getElementsByTagName()`
- `Element.getElementsByClassName()`

上面四个方法只返回Element子节点，因此可以采用链式写法。

```javascript
document
  .getElementById('header')
  .getElementsByClassName('a')
```

### Element.querySelector()

`Element.querySelector`方法接受CSS选择器作为参数，返回父元素的第一个匹配的子元素。

```javascript
var content = document.getElementById('content');
var el = content.querySelector('p');
```

上面代码返回`content`节点的第一个`p`元素。

需要注意的是，浏览器执行`querySelector`方法时，是先在全局范围内搜索给定的CSS选择器，然后过滤出哪些属于当前元素的子元素。因此，会有一些违反直觉的结果，请看下面的HTML代码。

```html
<div>
<blockquote id="outer">
  <p>Hello</p>
  <div id="inner">
    <p>World</p>
  </div>
</blockquote>
</div>
```

那么，下面代码实际上会返回第一个`p`元素，而不是第二个。

```javascript
var outer = document.getElementById('outer');
outer.querySelector('div p')
// <p>Hello</p>
```

### Element.querySelectorAll()

`Element.querySelectorAll`方法接受CSS选择器作为参数，返回一个`NodeList`对象，包含所有匹配的子元素。

```javascript
var el = document.querySelector('#test');
var matches = el.querySelectorAll('div.highlighted > p');
```

该方法的执行机制与`querySelector`相同，也是先在全局范围内查找，再过滤出当前元素的子元素。因此，选择器实际上针对整个文档的。

### Element.getElementsByClassName()

`Element.getElementsByClassName`方法返回一个`HTMLCollection`对象，成员是当前元素节点的所有匹配指定`class`的子元素。该方法与`document.getElementsByClassName`方法的用法类似，只是搜索范围不是整个文档，而是当前元素节点。

```javascript
element.getElementsByClassName('red test');
```

注意，该方法的参数大小写敏感。

### Element.getElementsByTagName()

`Element.getElementsByTagName`方法返回一个`HTMLCollection`对象，成员是当前元素节点的所有匹配指定标签名的子元素。该方法与`document.getElementsByClassName`方法的用法类似，只是搜索范围不是整个文档，而是当前元素节点。

```javascript
var table = document.getElementById('forecast-table');
var cells = table.getElementsByTagName('td');
```

注意，该方法的参数是大小写不敏感的。

### Element.closest()

`Element.closest`方法返回当前元素节点的最接近的父元素（或者当前节点本身），条件是必须匹配给定的CSS选择器。如果不满足匹配，则返回null。

假定HTML代码如下。

```html
<article>
  <div id="div-01">Here is div-01
    <div id="div-02">Here is div-02
      <div id="div-03">Here is div-03</div>
    </div>
  </div>
</article>
```

div-03节点的closet方法的例子如下。

```javascript
var el = document.getElementById('div-03');
el.closest("#div-02") // div-02
el.closest("div div") // div-03
el.closest("article > div") //div-01
el.closest(":not(div)") // article
```

上面代码中，由于closet方法将当前元素节点也考虑在内，所以第二个closet方法返回div-03。

### Element.match()

`Element.match`方法返回一个布尔值，表示当前元素是否匹配给定的CSS选择器。

```javascript
if (el.matches('.someClass')) {
  console.log('Match!');
}
```

该方法带有浏览器前缀，下面的函数可以兼容不同的浏览器，并且在浏览器不支持时，自行部署这个功能。

```javascript
function matchesSelector(el, selector) {
  var p = Element.prototype;
  var f = p.matches
    || p.webkitMatchesSelector
    || p.mozMatchesSelector
    || p.msMatchesSelector
    || function(s) {
    return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
  };
  return f.call(el, selector);
}

// 用法
matchesSelector(
  document.getElementById('myDiv'),
  'div.someSelector[some-attribute=true]'
)
```

## 事件相关的方法

以下三个方法与`Element`节点的事件相关。这些方法都继承自`EventTarget`接口，详见本章的《Event对象》一节。

- `Element.addEventListener()`：添加事件的回调函数
- `Element.removeEventListener()`：移除事件监听函数
- `Element.dispatchEvent()`：触发事件

```javascript
element.addEventListener('click', listener, false);
element.removeEventListener('click', listener, false);

var event = new Event('click');
element.dispatchEvent(event);
```

## 其他方法

### Element.scrollIntoView()

`Element.scrollIntoView`方法滚动当前元素，进入浏览器的可见区域，类似于设置`window.location.hash`的效果。

```javascript
el.scrollIntoView(); // 等同于el.scrollIntoView(true)
el.scrollIntoView(false);
```

该方法可以接受一个布尔值作为参数。如果为`true`，表示元素的顶部与当前区域的可见部分的顶部对齐（前提是当前区域可滚动）；如果为`false`，表示元素的底部与当前区域的可见部分的尾部对齐（前提是当前区域可滚动）。如果没有提供该参数，默认为`true`。

### Element.getBoundingClientRect()

`Element.getBoundingClientRect`方法返回一个对象，该对象提供当前元素节点的大小、位置等信息，基本上就是CSS盒状模型提供的所有信息。

```javascript
var rect = obj.getBoundingClientRect();
```

上面代码中，`getBoundingClientRect`方法返回的`rect`对象，具有以下属性（全部为只读）。

- `x`：元素左上角相对于视口的横坐标
- `left`：元素左上角相对于视口的横坐标，与`x`属性相等
- `right`：元素右边界相对于视口的横坐标（等于`x`加上`width`）
- `width`：元素宽度（等于`right`减去`left`）
- `y`：元素顶部相对于视口的纵坐标
- `top`：元素顶部相对于视口的纵坐标，与`y`属性相等
- `bottom`：元素底部相对于视口的纵坐标
- `height`：元素高度（等于`y`加上`height`）

由于元素相对于视口（viewport）的位置，会随着页面滚动变化，因此表示位置的四个属性值，都不是固定不变的。如果想得到绝对位置，可以将`left`属性加上`window.scrollX`，`top`属性加上`window.scrollY`。

注意，`getBoundingClientRect`方法的所有属性，都把边框（`border`属性）算作元素的一部分。也就是说，都是从边框外缘的各个点来计算。因此，`width`和`height`包括了元素本身 + `padding` + `border`。

### Element.getClientRects()

`Element.getClientRects`方法返回一个类似数组的对象，里面是当前元素在页面上形成的所有矩形。每个矩形都有`bottom`、`height`、`left`、`right`、`top`和`width`六个属性，表示它们相对于视口的四个坐标，以及本身的高度和宽度。

对于盒状元素（比如`<div>`和`<p>`），该方法返回的对象中只有该元素一个成员。对于行内元素（比如span、a、em），该方法返回的对象有多少个成员，取决于该元素在页面上占据多少行。这是它和`Element.getBoundingClientRect()`方法的主要区别，对于行内元素，后者总是返回一个矩形区域，前者可能返回多个矩形区域，所以方法名中的`Rect`用的是复数。

```html
<span id="inline">
Hello World
Hello World
Hello World
</span>
```

上面代码是一个行内元素`<span>`，如果它在页面上占据三行，`getClientRects`方法返回的对象就有三个成员，如果它在页面上占据一行，`getClientRects`方法返回的对象就只有一个成员。

```javascript
var el = document.getElementById('inline');
el.getClientRects().length // 3
el.getClientRects()[0].left // 8
el.getClientRects()[0].right // 113.908203125
el.getClientRects()[0].bottom // 31.200000762939453
el.getClientRects()[0].height // 23.200000762939453
el.getClientRects()[0].width // 105.908203125
```

这个方法主要用于判断行内元素是否换行，以及行内元素的每一行的位置偏移。

### Element.insertAdjacentHTML()

`Element.insertAdjacentHTML`方法解析HTML字符串，然后将生成的节点插入DOM树的指定位置。

```javascript
element.insertAdjacentHTML(position, text);
```

该方法接受两个参数，第一个是指定位置，第二个是待解析的字符串。

指定位置共有四个。

- `beforebegin`：在当前元素节点的前面。
- `afterbegin`：在当前元素节点的里面，插在它的第一个子元素之前。
- `beforeend`：在当前元素节点的里面，插在它的最后一个子元素之后。
- `afterend`：在当前元素节点的后面。'

```javascript
// 原来的HTML代码：<div id="one">one</div>
var d1 = document.getElementById('one');
d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');
// 现在的HTML代码：
// <div id="one">one</div><div id="two">two</div>
```

该方法不是彻底置换现有的DOM结构，这使得它的执行速度比`innerHTML`操作快得多。

### Element.remove()

`Element.remove`方法用于将当前元素节点从DOM树删除。

```javascript
var el = document.getElementById('div-01');
el.remove();
```

### Element.focus()

`Element.focus`方法用于将当前页面的焦点，转移到指定元素上。

```javascript
document.getElementById('my-span').focus();
```

## 参考链接

- Craig Buckler，[How to Translate from DOM to SVG Coordinates and Back Again](https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/)
