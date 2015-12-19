---
title: Element对象
category: dom
layout: page
date: 2015-04-15
modifiedOn: 2015-04-15
---

Element对象对应网页的HTML标签元素。每一个HTML标签元素，在DOM树上都会转化成一个Element节点对象（以下简称元素节点）。元素节点的nodeType属性都是1，但是不同HTML标签生成的元素节点是不一样的。JavaScript内部使用不同的构造函数，生成不同的Element节点，比如a标签的节点对象由HTMLAnchorElement()构造函数生成，button标签的节点对象由HTMLButtonElement()构造函数生成。因此，元素节点不是一种对象，而是一组对象。

## 属性

### attributes，id，tagName

以下属性返回元素节点的性质。

**（1）attributes**

attributes属性返回一个类似数组的对象，成员是当前元素节点的所有属性节点，每个数字索引对应一个属性节点（Attribute）对象。返回值中，所有成员都是动态的，即属性的变化会实时反映在结果集。

下面是一个HTML代码。

```html
<p id="para">Hello World</p>
```

获取attributes成员的代码如下。

```javascript
var para = document.getElementById('para');
var attr = para.attributes[0];

attr.name // id
attr.value // para
```

上面代码说明，通过attributes属性获取属性节点对象（attr）以后，可以通过name属性获取属性名（id），通过value属性获取属性值（para）。

注意，属性节点的name属性和value属性，等同于nodeName属性和nodeValue属性。

下面代码是遍历一个元素节点的所有属性。

```javascript
var para = document.getElementsByTagName("p")[0];

if (para.hasAttributes()) {
  var attrs = para.attributes;
  var output = "";
  for(var i = attrs.length - 1; i >= 0; i--) {
    output += attrs[i].name + "->" + attrs[i].value;
  }
  result.value = output;
} else {
  result.value = "No attributes to show";
}
```

**（2）id属性**

id属性返回指定元素的id标识。该属性可读写。

**（3）tagName属性**

tagName属性返回指定元素的大写的标签名，与nodeName属性的值相等。

```javascript
// 假定HTML代码如下
// <span id="span">Hello</span>
var span = document.getElementById("span");
span.tagName // "SPAN"
```

### innerHTML，outerHTML

以下属性返回元素节点的HTML内容。

**（1）innerHTML**

innerHTML属性返回该元素包含的HTML代码。该属性可读写，常用来设置某个节点的内容。

如果将该属性设为空，等于删除所有它包含的所有节点。

```javascript
el.innerHTML = '';
```

上面代码等于将el节点变成了一个空节点，el原来包含的节点被全部删除。

注意，如果文本节点中包含&amp;、小于号（&lt;）和大于号（%gt;），innerHTML属性会将它们转为实体形式&amp、&lt、&gt。

```javascript
// HTML代码如下 <p id="para"> 5 > 3 </p>
document.getElementById('para').innerHTML
// 5 &gt; 3
```

由于上面这个原因，导致在innerHTML插入&lt;script&gt;标签，不会被执行。

```javascript
var name = "<script>alert('haha')</script>";
el.innerHTML = name;
```

上面代码将脚本插入内容，脚本并不会执行。但是，innerHTML还是有安全风险的。

```javascript
var name = "<img src=x onerror=alert(1)>";
el.innerHTML = name;
```

上面代码中，alert方法是会执行的。因此为了安全考虑，如果插入的是文本，最好用textContent属性代替innerHTML。

**（2）outerHTML**

outerHTML属性返回一个字符串，内容为指定元素的所有HTML代码，包括它自身和包含的所有子元素。

```javascript
// 假定HTML代码如下
// <div id="d"><p>Hello</p></div>

d = document.getElementById("d");
dump(d.outerHTML);

// '<div id="d"><p>Hello</p></div>'
```

outerHTML属性是可读写的，对它进行赋值，等于替换掉当前元素。

```javascript
// 假定HTML代码如下
// <div id="container"><div id="d">Hello</div></div>

container = document.getElementById("container");
d = document.getElementById("d");
container.firstChild.nodeName // "DIV"
d.nodeName // "DIV"

d.outerHTML = "<p>Hello</p>";
container.firstChild.nodeName // "P"
d.nodeName // "DIV"
```

上面代码中，outerHTML属性重新赋值以后，内层的div元素就不存在了，被p元素替换了。但是，变量d依然指向原来的div元素，这表示被替换的DIV元素还存在于内存中。

如果指定元素没有父节点，对它的outerTHML属性重新赋值，会抛出一个错误。

```javascript
document.documentElement.outerHTML = "test";  // DOMException
```

### children，childElementCount，firstElementChild，lastElementChild

以下属性与元素节点的子元素相关。

**（1）children**

children属性返回一个类似数组的动态对象（实时反映变化），包括当前元素节点的所有子元素。如果当前元素没有子元素，则返回的对象包含零个成员。

```javascript
// para是一个p元素节点
if (para.children.length) {
  var children = para.children;
    for (var i = 0; i < children.length; i++) {
      // ...
    }
}
```

**（2）childElementCount**

childElementCount属性返回当前元素节点包含的子元素节点的个数。

**（3）firstElementChild**

firstElementChild属性返回第一个子元素，如果没有，则返回null。

**（4）lastElementChild**

lastElementChild属性返回最后一个子元素，如果没有，则返回null。

### nextElementSibling，previousElementSibling

以下属性与元素节点的同级元素相关。

**（1）nextElementSibling**

nextElementSibling属性返回指定元素的后一个同级元素，如果没有则返回null。

```javascript
// 假定HTML代码如下
// <div id="div-01">Here is div-01</div>
// <div id="div-02">Here is div-02</div>
var el = document.getElementById('div-01');
el.nextElementSibling
// <div id="div-02">Here is div-02</div>

```

**（2）previousElementSibling**

previousElementSibling属性返回指定元素的前一个同级元素，如果没有则返回null。

### className，classList

className属性用来读取和设置当前元素的class属性。它的值是一个字符串，每个class之间用空格分割。

classList属性则返回一个类似数组的对象，当前元素节点的每个class就是这个对象的一个成员。

{% highlight html %}

<div class="one two three" id="myDiv"></div>

{% endhighlight %}

上面这个div元素的节点对象的className属性和classList属性，分别如下。

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

从上面代码可以看出，className属性返回一个空格分隔的字符串，而classList属性指向一个类似数组的对象，该对象的length属性（只读）返回当前元素的class数量。

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

toggle方法可以接受一个布尔值，作为第二个参数。如果为true，则添加该属性；如果为false，则去除该属性。

```javascript
el.classList.toggleClass("abc", someBool);

// 等同于

if (someBool){
  el.classList.add("abc");
} else {
  el.classList.remove("abc");
}

```

### clientHeight，clientLeft，clientTop，clientWidth

以下属性与元素节点的可见区域的坐标相关。

**（1）clientHeight**

clientHeight属性返回元素节点的可见高度，包括padding、但不包括水平滚动条、边框和margin的高度，单位为像素。该属性可以计算得到，等于元素的CSS高度，加上CSS的padding高度，减去水平滚动条的高度（如果存在水平滚动条）。

如果一个元素是可以滚动的，则clientHeight只计算它的可见部分的高度。

**（2）clientLeft**

clientLeft属性等于元素节点左边框（border）的宽度，单位为像素，包括垂直滚动条的宽度，不包括左侧的margin和padding。但是，除非排版方向是从右到左，且发生元素宽度溢出，否则是不可能存在左侧滚动条。如果该元素的显示设为`display: inline`，clientLeft一律为0，不管是否存在左边框。

**（3）clientTop**

clientTop属性等于网页元素顶部边框的宽度，不包括顶部的margin和padding。

**（4）clientWidth**

clientWidth属性等于网页元素的可见宽度，即包括padding、但不包括垂直滚动条（如果有的话）、边框和margin的宽度，单位为像素。

如果一个元素是可以滚动的，则clientWidth只计算它的可见部分的宽度。

### scrollHeight，scrollWidth，scrollLeft，scrollTop

以下属性与元素节点占据的总区域的坐标相关。

**（1）scrollHeight**

scrollHeight属性返回指定元素的总高度，包括由于溢出而无法展示在网页的不可见部分。如果一个元素是可以滚动的，则scrollHeight包括整个元素的高度，不管是否存在垂直滚动条。scrollHeight属性包括padding，但不包括border和margin。该属性为只读属性。

如果不存在垂直滚动条，scrollHeight属性与clientHeight属性是相等的。如果存在滚动条，scrollHeight属性总是大于clientHeight属性。当滚动条滚动到内容底部时，下面的表达式为true。

```javascript
element.scrollHeight - element.scrollTop === element.clientHeight
```

如果滚动条没有滚动到内容底部，上面的表达式为false。这个特性结合`onscroll`事件，可以判断用户是否滚动到了指定元素的底部，比如是否滚动到了《使用须知》区块的底部。

```javascript
var rules = document.getElementById("rules");
rules.onscroll = checking;

function checking(){
  if (this.scrollHeight - this.scrollTop === this.clientHeight) {
    console.log('谢谢阅读');
  } else {
    console.log('您还未读完');
  }
}
```

**（2）scrollWidth**

scrollWidth属性返回元素的总宽度，包括由于溢出容器而无法显示在网页上的那部分宽度，不管是否存在水平滚动条。该属性是只读属性。

**（3）scrollLeft**

scrollLeft属性设置或返回水平滚动条向右侧滚动的像素数量。它的值等于元素的最左边与其可见的最左侧之间的距离。对于那些没有滚动条或不需要滚动的元素，该属性等于0。该属性是可读写属性，设置该属性的值，会导致浏览器将指定元素自动滚动到相应的位置。

**（4）scrollTop**

scrollTop属性设置或返回垂直滚动条向下滚动的像素数量。它的值等于元素的顶部与其可见的最高位置之间的距离。对于那些没有滚动条或不需要滚动的元素，该属性等于0。该属性是可读写属性，设置该属性的值，会导致浏览器将指定元素自动滚动到相应位置。

```javascript
document.querySelector('div').scrollTop = 150;
```

上面代码将div元素向下滚动150像素。

## 方法

### hasAttribute()，getAttribute()，removeAttribute()，setAttribute()

以下方法与元素节点的属性相关。

**（1）hasAttribute()**

`hasAttribute`方法返回一个布尔值，表示当前元素节点是否包含指定的HTML属性。

```javascript
var d = document.getElementById("div1");

if (d.hasAttribute("align")) {
  d.setAttribute("align", "center");
}
```

上面代码检查`div`节点是否含有`align`属性。如果有，则设置为“居中对齐”。

**（2）getAttribute()**

`getAttribute`方法返回当前元素节点的指定属性。如果指定属性不存在，则返回`null`。

```javascript
var div = document.getElementById('div1');
div.getAttribute('align') // "left"
```

**（3）removeAttribute()**

removeAttribute方法用于从当前元素节点移除属性。

```javascript
// 原来的HTML代码
// <div id="div1" align="left" width="200px">
document.getElementById("div1").removeAttribute("align");
// 现在的HTML代码
// <div id="div1" width="200px">
```

**（4）setAttribute()**

`setAttribute`方法用于为当前元素节点新增属性，或编辑已存在的属性。

```javascript
var d = document.getElementById('d1');
d.setAttribute('align', 'center');
```

该方法会将所有属性名，都当作小写处理。对于那些已存在的属性，该方法是编辑操作，否则就会新建属性。

下面是一个对`img`元素的`src`属性赋值的例子。

```javascript
var myImage = document.querySelector('img');
myImage.setAttribute ('src', 'path/to/example.png');
```

大多数情况下，直接对属性赋值比使用该方法更好。

```javascript
el.value = 'hello';
// or
el.setAttribute('value', 'hello');
```

### querySelector()，querySelectorAll()，getElementsByClassName()，getElementsByTagName()

以下方法与获取当前元素节点的子元素相关。

**（1）querySelector()**

querySelector方法接受CSS选择器作为参数，返回父元素的第一个匹配的子元素。

```javascript
var content = document.getElementById('content');
var el = content.querySelector('p');
```

上面代码返回content节点的第一个p元素。

注意，如果CSS选择器有多个组成部分，比如`div p`，querySelector方法会把父元素考虑在内。假定HTML代码如下。

```html
<div id="outer">
  <p>Hello</p>
  <div id="inner">
    <p>World</p>
  </div>
</div>
```

那么，下面代码会选中第一个p元素。

```javascript
var outer = document.getElementById('outer');
var el = outer.querySelector('div p');
```

**（2）querySelectorAll()**

querySelectorAll方法接受CSS选择器作为参数，返回一个NodeList对象，包含所有匹配的子元素。

```javascript
var el = document.querySelector('#test');
var matches = el.querySelectorAll('div.highlighted > p');
```

在CSS选择器有多个组成部分时，querySelectorAll方法也是会把父元素本身考虑在内。

还是以上面的HTML代码为例，下面代码会同时选中两个p元素。

```javascript
var outer = document.getElementById('outer');
var el = outer.querySelectorAll('div p');
```

**（3）getElementsByClassName()**

getElementsByClassName方法返回一个HTMLCollection对象，成员是当前元素节点的所有匹配指定class的子元素。该方法与document.getElementsByClassName方法的用法类似，只是搜索范围不是整个文档，而是当前元素节点。

**（4）getElementsByTagName()**

getElementsByTagName方法返回一个HTMLCollection对象，成员是当前元素节点的所有匹配指定标签名的子元素。该方法与document.getElementsByClassName方法的用法类似，只是搜索范围不是整个文档，而是当前元素节点。此外，该方法搜索之前，会统一将标签名转为小写。

### closest()，matches()

**（1）closest()**

closest方法返回当前元素节点的最接近的父元素（或者当前节点本身），条件是必须匹配给定的CSS选择器。如果不满足匹配，则返回null。

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

**（2）match()**

match方法返回一个布尔值，表示当前元素是否匹配给定的CSS选择器。

```javascript
if (el.matches(".someClass")) {
  console.log("Match!");
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

### addEventListener()，removeEventListener()，dispatchEvent()

以下三个方法与Element节点的事件相关。这些方法都继承自EventTarget接口，详细介绍参见《Event对象》章节的《EventTarget》部分。

```javascript
// 添加事件监听函数
el.addEventListener('click', listener, false);

// 移除事件监听函数
el.removeEventListener('click', listener, false);

// 触发事件
var event = new Event('click');
el.dispatchEvent(event);
```

### getBoundingClientRect()，getClientRects()

以下方法返回元素节点的CSS盒状模型信息。

**（1）getBoundingClientRect()**

getBoundingClientRect方法返回一个对象，该对象提供当前元素节点的大小、它相对于视口（viewport）的位置等信息，基本上就是CSS盒状模型的内容。

```javascript
var rect = obj.getBoundingClientRect();
```

上面代码中，getBoundingClientRect方法返回的对象，具有以下属性（全部为只读）。

- bottom：元素底部相对于视口的纵坐标。
- height：元素高度（等于bottom减去top）。
- left：元素左上角相对于视口的坐标。
- right：元素右边界相对于视口的横坐标。
- top：元素顶部相对于视口的纵坐标。
- width：元素宽度（等于right减去left）。

由于元素相对于视口（viewport）的位置，会随着页面滚动变化，因此表示位置的四个属性值，都不是固定不变的。

注意，getBoundingClientRect方法的所有属性，都把边框（border属性）算作元素的一部分。也就是说，都是从边框外缘的各个点来计算。因此，width和height包括了元素本身 + padding + border。

**（1）getClientRects()**

getClientRects方法返回一个类似数组的对象，里面是当前元素在页面上形成的所有矩形。每个矩形都有`bottom`、`height`、`left`、`right`、`top`和`width`六个属性，表示它们相对于视口的四个坐标，以及本身的高度和宽度。

对于盒状元素（比如div和p），该方法返回的对象中只有该元素一个成员。对于行内元素（比如span、a、em），该方法返回的对象有多少个成员，取决于该元素在页面上占据多少行。

```html
<span id="inline">
Hello World
Hello World
Hello World
</span>
```

上面代码是一个行内元素span，如果它在页面上占据三行，getClientRects方法返回的对象就有三个成员，如果它在页面上占据一行，getClientRects方法返回的对象就只有一个成员。

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

### insertAdjacentHTML()，remove()

以下方法操作元素节点的DOM树。

**（1）insertAdjacentHTML()**

insertAdjacentHTML方法解析字符串，然后将生成的节点插入DOM树的指定位置。

```javascript
element.insertAdjacentHTML(position, text);
```

该方法接受两个参数，第一个是指定位置，第二个是待解析的字符串。

指定位置共有四个。

- beforebegin：在当前元素节点的前面。
- afterbegin：在当前元素节点的里面，插在它的第一个子元素之前。
- beforeend：在当前元素节点的里面，插在它的最后一个子元素之后。
- afterend：在当前元素节点的后面。'

```javascript
// 原来的HTML代码：<div id="one">one</div>
var d1 = document.getElementById('one');
d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');
// 现在的HTML代码：
// <div id="one">one</div><div id="two">two</div>
```

该方法不是彻底置换现有的DOM结构，这使得它的执行速度比innerHTML操作快得多。所有浏览器都支持这个方法，包括IE 6。

**（2）remove()**

remove方法用于将当前元素节点从DOM树删除。

```javascript
var el = document.getElementById('div-01');
el.remove();
```

### scrollIntoView()

scrollIntoView方法滚动当前元素，进入浏览器的可见区域。

```javascript
el.scrollIntoView(); // 等同于el.scrollIntoView(true)
el.scrollIntoView(false);
```

该方法可以接受一个布尔值作为参数。如果为true，表示元素的顶部与当前区域的可见部分的顶部对齐（前提是当前区域可滚动）；如果为false，表示元素的底部与当前区域的可见部分的尾部对齐（前提是当前区域可滚动）。如果没有提供该参数，默认为true。
