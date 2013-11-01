---
title: DOM概述
layout: page
category: dom
date: 2013-10-07
modifiedOn: 2013-10-07
---

DOM是文档对象模型（Document Object Model）的简称，它的基本思想是把结构化文档（比如HTML和XML）解析成一系列的节点，再由这些节点组成一个树状结构。所有的节点和最终的树状结构，都有规范的对外接口，以达到使用编程语言操作文档的目的（比如增删内容）。所以，DOM可以理解成文档的编程接口。

DOM有自己的国际标准，目前的通用版本是[DOM 3](http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html)，下一代版本[DOM 4](http://www.w3.org/TR/dom/)正在拟定中。本章介绍的就是JavaScript对DOM标准的实现和用法。

## Node节点对象

DOM的最小单位是节点（node），一个文档的树形结构就是由各种不同的节点组成。

对于HTML文档，节点有以下类型：

<table class="twelve">
  <thead>
    <tr><th>类型</th><th>名称</th><th>含义</th><th>nodeName</th><th>nodeType</th></tr>
  </thead>
  <tbody>
<tr><td>DOCUMENT_NODE</td><td>文档节点</td><td>整个文档（比如 window.document）</td><td>#document</td><td>9</td></tr>
<tr><td>ELEMENT_NODE</td><td>标签节点</td><td>各种HTML标签（比如&lt;body&gt;、&lt;a&gt;、&lt;p&gt;等）</td><td>大写的标签名（比如a标签对应的值为A）</td><td>1</td></tr>
<tr><td>ATTRIBUTE_NODE</td><td>属性节点</td><td>HTML标签的属性（比如class="right"）</td><td>等同于Attr.name</td><td>2</td></tr>
<tr><td>TEXT_NODE</td><td>文本节点</td><td>HTML文档中出现的文本</td><td>#text</td><td>3</td></tr>
<tr><td>DOCUMENT_FRAGMENT_NODE</td><td>文档碎片节点</td><td>文档的片段</td><td>#document-fragment</td><td>11</td></tr>
<tr><td>DOCUMENT_TYPE_NODE</td><td>文档类型节点</td><td>文档的类型（比如&lt;!DOCTYPE html&gt;）</td><td>等同于DocumentType.name</td><td>10</td></tr>
  </tbody>
</table>

浏览器原生提供一个Node对象，上面所有类型的节点都是Node对象派生出来的，也就是说它们都继承了Node的属性和方法。

### Node对象的属性

Node对象有以下属性：

- childNodes：所有子节点。
- firstChild：第一个子节点。
- lastChild：最后一个子节点。
- nextSibling：下一个同级节点。
- nodeName：节点名称。
- nodeType：节点类型。
- nodeValue：节点值。
- parentNode：父节点。
- previousSibling：上一个同级节点。
- firstElementChild：第一个类型为HTML元素的子节点。
- lastElementChild：最后一个类型为HTML元素的子节点。
- nextElementSibling：下一个类型为HTML元素的同级节点。
- previousElementChild：上一个类型为HTML元素的同级节点。
- children：所有类型为HTML元素的子节点。

（1）nodeName属性和nodeType属性

nodeName属性返回节点的名称，nodeType属性返回节点的常数值。具体的返回值，可查阅上方的表格。

通常来说，使用nodeType属性确定一个节点的类型，比较方便。

{% highlight javascript %}

document.querySelector('a').nodeType === 1
// true

document.querySelector('a').nodeType === Node.ELEMENT_NODE
// true

{% endhighlight %}

上面两种写法是等价的。

（2）nodeValue属性

Text节点的nodeValue属性返回文本内容，而其他五类节点都返回null。所以，该属性的作用主要是提取文本节点的内容。

（3）childNodes属性

该属性返回父节点的所有子节点，注意返回的不仅包括元素节点，还包括文本节点以及其他各种类型的子节点。另外，返回的是一个NodeList对象。

{% highlight javascript %}

var ulElementChildNodes = document.querySelector('ul').childNodes;

{% endhighlight %}

### Node对象的方法

Node对象有以下方法：

- appendChild()
- cloneNode()
- compareDocumentPosition()
- contains()
- hasChildNodes()
- insertBefore()
- isEqualNode()
- removeChild()
- replaceChild()

appendChild()方法用于在父节点的最后一个子节点后，再插入一个子节点。

{% highlight javascript %}

var elementNode = document.createElement('strong');
var textNode = document.createTextNode(' Dude');

document.querySelector('p').appendChild(elementNode);
document.querySelector('strong').appendChild(textNode);

{% endhighlight %}

insertBefore()用于将子节点插入父节点的指定位置。它接受两个参数，第一个参数是所要插入的子节点，第二个参数是父节点下方的另一个子节点，新插入的子节点将插在这个节点的前面。

{% highlight javascript %}

var text1 = document.createTextNode('1');
var li = document.createElement('li');
li.appendChild(text1);

var ul = document.querySelector('ul');
ul.insertBefore(li,ul.firstChild);

{% endhighlight %}

removeChild() 方法用于从父节点移除一个子节点。

{% highlight javascript %}

var divA = document.getElementById('A');
divA.parentNode.removeChild(divA);

{% endhighlight %}

replaceChild()方法用于将一个新的节点，替换父节点的某一个子节点。它接受两个参数，第一个参数是用来替换的新节点，第二个参数将要被替换走的子节点。

{% highlight javascript %}

var divA = document.getElementById('A');
var newSpan = document.createElement('span');
newSpan.textContent = 'Hello World!';
divA.parentNode.replaceChild(newSpan,divA);

{% endhighlight %}

cloneNode()方法用于克隆一个节点。它接受一个布尔值作为参数，表示是否同时克隆子节点，默认是false，即不克隆子节点。

{% highlight javascript %}

var cloneUL = document.querySelector('ul').cloneNode(true);

{% endhighlight %}

需要注意的是，克隆一个节点，会丧失定义在这个节点上的事件回调函数，但是会拷贝该节点的所有属性。因此，有可能克隆一个节点之后，DOM中出现两个有相同ID属性的HTML元素。

contains方法检查一个节点是否为另一个节点的子节点。

{% highlight javascript %}

document.querySelector('html').contains(document.querySelector('body'))
// true

{% endhighlight %}

isEqualNode()方法用来检查两个节点是否相等。所谓相等的节点，指的是两个节点的类型相同、属性相同、子节点相同。

{% highlight javascript %}

var input = document.querySelectorAll('input');
input[0].isEqualNode(input[1])

{% endhighlight %}

### NodeList对象

当使用querySelectorAll()方法选择一组对象时，会返回一个NodeList对象（比如document.querySelectorAll('*')的返回结果）或者HTMLCollection对象（比如document.scripts）。它们是类似数组的对象，即可以使用length属性，但是不能使用pop或push之类数组特有的方法。 

## Document对象

Document对象的方法：

- document.createElement()
- document.createTextNode()

createElement() 方法接受一个字符串参数，表示要创造哪一种HTML元素。传入的字符串应该等同于元素节点的tagName属性。

createTextNode()方法的参数，就是所要生成的文本节点的内容。

{% highlight javascript %}

var elementNode = document.createElement('div');

var textNode = document.createTextNode('Hi');

{% endhighlight %}

## Element对象

Element对象的属性：

- innerHTML
- outerHTML
- textContent
- innerText
- outerText
- firstElementChild
- lastElementChild
- nextElementChild
- previousElementChild
- children

innerHTML属性用来读取或设置某个节点内的HTML代码。

outerHTML属性用来读取或设置HTML代码时，会把节点本身包括在内。

textContent属性用来读取或设置节点包含的文本内容。

innerText属性和outerText属性在读取元素节点的文本内容时，得到的值是不一样的。它们的不同之处在于设置一个节点的文本属性时，outerText属性会使得原来的元素节点被文本节点替换掉。

Element对象的方法：

- insertAdjacentHTML()

### insertAdjacentHTML方法

insertAdjacentHTML方法可以将一段字符串，作为HTML或XML对象，插入DOM。

比如，原来的DOM结构如下：

{% highlight html %}

<div id="box1">
    <p>Some example text</p>
</div>
<div id="box2">
    <p>Some example text</p>
</div>

{% endhighlight %}

insertAdjacentHTML方法可以轻而易举地在上面两个div节点之间，再插入一个div节点。

{% highlight javascript %}

var box2 = document.getElementById("box2");

box2.insertAdjacentHTML('beforebegin', '<div><p>This gets inserted.</p></div>');

{% endhighlight %}

插入以后的DOM结构变成下面这样：

{% highlight html %}

<div id="box1">
    <p>Some example text</p>
</div>
<div><p>This gets inserted.</p></div>
<div id="box2">
    <p>Some example text</p>
</div>

{% endhighlight %}

insertAdjacentHTML方法接受两个参数，第一个是插入的位置，第二个是插入的节点字符串。关于插入的位置，可以取下面四个值。

- **beforebegin**：在指定元素之前插入，变成它的同级元素。
- **afterbegin**：在指定元素的开始标签之后插入，变成它的第一个子元素。
- **beforeend**：在指定元素的结束标签之前插入，变成它的最后一个子元素。
- **afterend**：在指定元素之后插入，变成它的同级元素。

需要注意的是，上面四个值都是字符串，而不是关键字，所以必须放在引号里面。

insertAdjacentHTML方法比innerHTML方法效率高，因为它不是彻底置换现有的DOM结构。所有浏览器都支持这个方法，包括IE 6。

### getBoundingClientRect方法

getBoundingClientRect方法用于获取元素相对于视口（viewport）的坐标。

{% highlight javascript %}

var box = document.getElementById('box');

var x1 = box.getBoundingClientRect().left;
var y1 = box.getBoundingClientRect().top;
var x2 = box.getBoundingClientRect().right;
var y2 = box.getBoundingClientRect().bottom;
var w = box.getBoundingClientRect().width;
var h = box.getBoundingClientRect().height;

{% endhighlight %}

上面代码获取DOM元素之后，使用getBoundingClientRect方法相应属性，先后得到左上角和右下角的四个坐标（相对于视口），然后得到元素的宽和高。所有这些值都是只读的。

所有浏览器都支持这个方法，但是IE 6到8对这个对象的支持不完整。 

## table元素

表格有一些特殊的DOM操作方法。

- **insertRow()**：在指定位置插入一个新行（tr）。
- **deleteRow()**：在指定位置删除一行（tr）。
- **insertCell()**：在指定位置插入一个单元格（td）。
- **deleteCell()**：在指定位置删除一个单元格（td）。
- **createCaption()**：插入标题。
- **deleteCaption()**：删除标题。
- **createTHead()**：插入表头。
- **deleteTHead()**：删除表头。

下面是使用JavaScript生成表格的一个例子。

{% highlight javascript %}

var table = document.createElement('table');
var tbody = document.createElement('tbody');
table.appendChild(tbody);

for (var i = 0; i <= 9; i++) {
  var rowcount = i + 1;
  tbody.insertRow(i);
  tbody.rows[i].insertCell(0);
  tbody.rows[i].insertCell(1);
  tbody.rows[i].insertCell(2);
  tbody.rows[i].cells[0].appendChild(document.createTextNode('Row ' + rowcount + ', Cell 1'));
  tbody.rows[i].cells[1].appendChild(document.createTextNode('Row ' + rowcount + ', Cell 2'));
  tbody.rows[i].cells[2].appendChild(document.createTextNode('Row ' + rowcount + ', Cell 3'));
}

table.createCaption();
table.caption.appendChild(document.createTextNode('A DOM-Generated Table'));

document.body.appendChild(table);

{% endhighlight %}

这些代码相当易读，其中需要注意的就是insertRow和insertCell方法，接受一个表示位置的参数（从0开始的整数）。

table元素有以下属性：

- **caption**：标题。
- **tHead**：表头。
- **tFoot**：表尾。
- **rows**：行元素对象，该属性只读。
- **rows.cells**：每一行的单元格对象，该属性只读。
- **tBodies**：表体，该属性只读。

## 参考链接

- Louis Lazaris, [Thinking Inside The Box With Vanilla JavaScript](http://coding.smashingmagazine.com/2013/10/06/inside-the-box-with-vanilla-javascript/)
