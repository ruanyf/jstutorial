---
title: Node对象
layout: page
category: dom
date: 2013-10-07
modifiedOn: 2014-05-18
---

## DOM的含义

DOM是文档对象模型（Document Object Model）的简称，它的基本思想是把结构化文档（比如HTML和XML）解析成一系列的节点，再由这些节点组成一个树状结构（DOM Tree）。所有的节点和最终的树状结构，都有规范的对外接口，以达到使用编程语言操作文档的目的（比如增删内容）。所以，DOM可以理解成文档（HTML文档、XML文档和SVG文档）的编程接口。

DOM有自己的国际标准，目前的通用版本是[DOM 3](http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html)，下一代版本[DOM 4](http://www.w3.org/TR/dom/)正在拟定中。本章介绍的就是JavaScript对DOM标准的实现和用法。

严格地说，DOM不属于JavaScript，但是操作DOM是JavaScript最常见的任务，而JavaScript也是最常用于DOM操作的语言。所以，DOM往往放在JavaScript里面介绍。

## Node节点的概念

DOM的最小组成单位叫做节点（node），一个文档的树形结构（DOM树），就是由各种不同类型的节点组成。

对于HTML文档，节点有以下类型。

节点|名称|含义
----|----|----
DOCUMENT_NODE | 文档节点 | 整个文档（window.document）
DOCUMENT_TYPE_NODE | 文档类型节点 | 文档的类型（比如&lt;!DOCTYPE html&gt;）
ELEMENT_NODE | 元素节点 | HTML元素（比如&lt;body&gt;、&lt;a&gt;等）
ATTRIBUTE_NODE | 属性节点| HTML元素的属性（比如class="right"）
TEXT_NODE | 文本节点 | HTML文档中出现的文本
DOCUMENT_FRAGMENT_NODE | 文档碎片节点 | 文档的片段

浏览器原生提供一个Node对象，上表所有类型的节点都是Node对象派生出来的。也就是说，它们都继承了Node的属性和方法。

## Node对象的属性

### nodeName，nodeType

nodeName属性返回节点的名称，nodeType属性返回节点的常数值。具体的返回值，可查阅下方的表格。

类型 | nodeName | nodeType
-----|----------|---------
DOCUMENT_NODE | #document | 9
ELEMENT_NODE | 大写的HTML元素名 | 1
ATTRIBUTE_NODE | 等同于Attr.name | 2
TEXT_NODE | #text | 3
DOCUMENT_FRAGMENT_NODE | #document-fragment | 11
DOCUMENT_TYPE_NODE | 等同于DocumentType.name |10

以document节点为例，它的nodeName属性等于#document，nodeType属性等于9。

```javascript

document.nodeName // "#document"
document.nodeType // 9

```

通常来说，使用nodeType属性确定一个节点的类型，比较方便。

```javascript

document.querySelector('a').nodeType === 1
// true

document.querySelector('a').nodeType === Node.ELEMENT_NODE
// true

```

上面两种写法是等价的。

### ownerDocument，nextSibling，previousSibling，parentNode，parentElement

以下属性返回当前节点的相关节点。

**（1）ownerDocument**

ownerDocument属性返回当前节点所在的顶层文档对象，即document对象。document对象本身的ownerDocument属性，返回null。

**（2）nextSibling**

nextsibling属性返回紧跟在当前节点后面的第一个同级节点。如果当前节点后面没有同级节点，则返回null。注意，该属性还包括文本节点和评论节点。因此如果当前节点后面有空格，该属性会返回一个文本节点，内容为空格。

```javascript
var el = document.getelementbyid('div-01').firstchild;
var i = 1;

while (el) {
  console.log(i + '. ' + el.nodename);
  el = el.nextsibling;
  i++;
}
```

上面代码遍历div-01节点的所有子节点。

**（3）previousSibling**

previoussibling属性返回当前节点前面的、距离最近的一个同级节点。如果当前节点前面没有同级节点，则返回null。

```javascript
// html代码如下
// <a><b1 id="b1"/><b2 id="b2"/></a>

document.getelementbyid("b1").previoussibling // null
document.getelementbyid("b2").previoussibling.id // "b1"
```

对于当前节点前面有空格，则previoussibling属性会返回一个内容为空格的文本节点。

**（4）parentnode**

parentnode属性返回当前节点的父节点。对于一个节点来说，它的父节点只可能是三种类型：element节点、document节点和documentfragment节点。对于document节点和documentfragment节点，它们的父节点都是null。另外，对于那些生成后还没插入dom树的节点，父节点也是null。

**（5）parentelement**

parentelement属性返回当前节点的父元素节点。如果当前节点没有父节点，或者父节点类型不是元素节点，则返回null。在ie浏览器中，只有element节点才有该属性，其他浏览器则是所有类型的节点都有该属性。

### textContent，nodeValue

以下属性返回当前节点的内容。

**（1）textContent**

textContent属性返回当前节点和它的所有后代节点的文本内容。该属性是可读写的，设置该属性的值，会用一个新的文本节点，替换所有它原来的子节点。

```javascript
// HTML代码为
// <div id="divA">This is <span>some</span> text</div>

document.getElementById("divA").textContent
// This is some text
```

对于Text节点和Comment节点，该属性的值与nodeValue属性相同。对于其他类型的节点，该属性会将每个子节点的内容连接在一起返回，但是不包括Comment节点。如果一个节点没有子节点，则返回空字符串。document节点的textContent属性为null。如果要读取整个文档的内容，可以使用`document.documentElement.textContent`。

IE浏览器对于所有Element节点，都有一个innerText属性。它与textContent属性基本相同，但是有两点区别。一是innerText不返回隐藏元素的值（即与CSS样式相关），而textContent会返回（即与CSS样式不相关）；二是innerText不返回&lt;script&gt;和&lt;style&gt;的文本内容，而textContent返回。

**（2）nodeValue**

nodeValue属性返回或设置当前节点的值。除了Text节点和Comment节点的nodeValue属性返回文本内容，其他类型节点的nodeValue都是null。因此，该属性的作用主要是提取和设置Text节点的内容，对于那些原来值为null的节点，设置nodeValue属性是无效的。

### childNodes，firstNode，lastChild

以下属性返回当前节点的子节点。

**（1）childNodes**

childNodes属性返回一个NodeList集合，成员包括当前节点的所有子节点。注意，除了HTML元素节点，该属性返回的还包括Text节点和Comment节点。如果当前节点不包括任何子节点，则返回一个空的NodeList集合。由于NodeList对象是一个动态集合，一旦子节点发生变化，立刻会反映在返回结果之中。

{% highlight javascript %}

var ulElementChildNodes = document.querySelector('ul').childNodes;

{% endhighlight %}

**（2）firstNode**

firstNode属性返回当前节点的第一个子节点，如果当前节点没有子节点，则返回null。注意，除了HTML元素子节点，该属性还包括文本节点和评论节点。

**（3）lastChild**

lastChild属性返回当前节点的最后一个子节点，如果当前节点没有子节点，则返回null。

### baseURI

baseURI属性返回一个字符串，由当前网页的协议、域名和所在的目录组成，表示当前网页的绝对路径。如果无法取到这个值，则返回null。浏览器根据这个属性，计算网页上的相对路径的URL。该属性为只读。

通常情况下，该属性由当前网址的URL（即window.location属性）决定，但是可以使用HTML的&lt;base&gt;标签，改变该属性的值。

```html
<base href="http://www.example.com/page.html">
<base target="_blank" href="http://www.example.com/page.html">
```

该属性不仅document对象有（`document.baseURI`），元素节点也有（`element.baseURI`）。通常情况下，它们的值是相同的。

## Node对象的方法

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

（1）appendChild()

appendChild()方法用于在父节点的最后一个子节点后，再插入一个子节点。它在父节点上调用，子节点作为方法的参数。

{% highlight javascript %}

var elementNode = document.createElement('strong');
var textNode = document.createTextNode(' Dude');

document.querySelector('p').appendChild(elementNode);
document.querySelector('strong').appendChild(textNode);

{% endhighlight %}

（2）insertBefore()

insertBefore()用于将子节点插入父节点的指定位置。它在父节点上调用，接受两个参数，第一个参数是所要插入的子节点，第二个参数是父节点下方的另一个子节点，新插入的子节点将插在这个节点的前面。

{% highlight javascript %}

var text1 = document.createTextNode('1');
var li = document.createElement('li');
li.appendChild(text1);

var ul = document.querySelector('ul');
ul.insertBefore(li,ul.firstChild);

{% endhighlight %}

（3）removeChild()

removeChild() 方法用于从父节点移除一个子节点。它在父节点上调用，被移除的子节点作为参数。

{% highlight javascript %}

var divA = document.getElementById('A');
divA.parentNode.removeChild(divA);

{% endhighlight %}

（4）replaceChild()

replaceChild()方法用于将一个新的节点，替换父节点的某一个子节点。它接受两个参数，第一个参数是用来替换的新节点，第二个参数将要被替换走的子节点。

{% highlight javascript %}

var divA = document.getElementById('A');
var newSpan = document.createElement('span');
newSpan.textContent = 'Hello World!';
divA.parentNode.replaceChild(newSpan,divA);

{% endhighlight %}

（5）cloneNode()

cloneNode()方法用于克隆一个节点。它接受一个布尔值作为参数，表示是否同时克隆子节点，默认是false，即不克隆子节点。

{% highlight javascript %}

var cloneUL = document.querySelector('ul').cloneNode(true);

{% endhighlight %}

需要注意的是，克隆一个节点，会丧失定义在这个节点上的事件回调函数，但是会拷贝该节点的所有属性。因此，有可能克隆一个节点之后，DOM中出现两个有相同ID属性的HTML元素。

（6）contains方法

contains方法检查一个节点是否为另一个节点的子节点。

{% highlight javascript %}

document.querySelector('html').contains(document.querySelector('body'))
// true

{% endhighlight %}

（7）isEqualNode()

isEqualNode()方法用来检查两个节点是否相等。所谓相等的节点，指的是两个节点的类型相同、属性相同、子节点相同。

{% highlight javascript %}

var input = document.querySelectorAll('input');
input[0].isEqualNode(input[1])

{% endhighlight %}

### NodeList对象

当使用querySelectorAll()方法选择一组对象时，会返回一个NodeList对象（比如document.querySelectorAll('*')的返回结果）或者HTMLCollection对象（比如document.scripts）。它们是类似数组的对象，即可以使用length属性，但是不能使用pop或push之类数组特有的方法。

## Element对象

### 属性

**（1）innerHTML属性，outerHTML属性，textContent属性，innerText属性，outerText属性**

textContent属性用来读取或设置节点包含的文本内容。

innerText属性和outerText属性在读取元素节点的文本内容时，得到的值是不一样的。它们的不同之处在于设置一个节点的文本属性时，outerText属性会使得原来的元素节点被文本节点替换掉。

```javascript
document.getElementById('foo').innerHTML = 'Goodbye!';
document.getElementById('foo').innerText = 'GoodBye!';
document.getElementById('foo').textContent = 'Goodbye!';
```

注意，innerText是非标准属性，Firefox不支持。考虑兼容老式浏览器，可以使用下面的写法，获取节点的文本内容。

```javascript
var text = element.textContent || element.innerText;
```

使用textContent和innerText属性，为一个HTML元素设置内容，有一个好处，就是自动对HTML标签转义。这很适合用于用户提供的内容。

```javascript

document.getElementById('foo').innerText = '<p>GoodBye!</p>';

```

上面代码在插入文本时，会将p标签解释为文本，而不会当作标签处理。

**（3）attributes属性**

该属性返回一个数组，数组成员就是Element元素包含的每一个属性节点对象。

{% highlight javascript %}

var atts = document.querySelector('a').attributes;

for(var i=0; i< atts.length; i++){
	console.log(atts[i].nodeName +'='+ atts[i].nodeValue);
}

{% endhighlight %}

**（4）textcontent属性**

该属性返回Element节点包含的所有文本内容。它通常用于剥离HTML标签，还用于返回&lt;script&gt;and&lt;style&gt;标签所包含的代码。

{% highlight javascript %}

document.body.textContent

{% endhighlight %}

如果对document或者doctype节点使用该属性，会返回null。

textcontent属性的作用与innerText属性很相近，但是有以下几点区别：

- innerText受CSS影响，textcontent没有这个问题。比如，如果CSS规则隐藏了某段文本，innerText就不会返回这段文本，textcontent则照样返回。

- innerText返回的文本，会过滤掉空格、换行和回车键，textcontent则不会。

- innerText属性不是DOM标准的一部分，Firefox浏览器甚至没有部署这个属性，而textcontent是DOM标准的一部分。

另外，该属性是可写的，可以用它设置Element节点的文本内容。但是这样一来，原有的子节点会被全部删除。

**（5）tabindex属性**

tabindex属性用来指定，当前HTML元素节点是否被tab键遍历，以及遍历的优先级。

```javascript
var b1 = document.getElementById("button1");

b1.tabIndex = 1;
```

如果 tabindex = -1 ，tab键跳过当前元素。

如果 tabindex = 0 ，表示tab键将遍历当前元素。如果一个元素没有设置tabindex，默认值就是0。

如果 tabindex 大于0，表示tab键优先遍历。值越大，就表示优先级越大。

### html元素

html元素是网页的根元素，document.documentElement就指向这个元素。

**（1）clientWidth属性，clientHeight属性**

这两个属性返回视口（viewport）的大小，单位为像素。所谓“视口”，是指用户当前能够看见的那部分网页的大小

document.documentElement.clientWidth和document.documentElement.clientHeight，基本上与window.innerWidth和window.innerHeight同义。只有一个区别，前者不将滚动条计算在内（很显然，滚动条和工具栏会减小视口大小），而后者包括了滚动条的高度和宽度。

**（2）offsetWidth属性，offsetHeight属性**

这两个属性返回html元素的宽度和高度，即网页的总宽度和总高度。

### dataset属性

dataset属性用于操作HTML标签元素的data-*属性。目前，Firefox、Chrome、Opera、Safari浏览器支持该API。

假设有如下的网页代码。

{% highlight html %}

<div id="myDiv" data-id="myId"></div>

{% endhighlight %}

以data-id属性为例，要读取这个值，可以用dataset.id。

{% highlight javascript %}

var id = document.getElementById("myDiv").dataset.id;

{% endhighlight %}

要设置data-id属性，可以直接对dataset.id赋值。这时，如果data-id属性不存在，将会被创造出来。

{% highlight javascript %}

document.getElementById("myDiv").dataset.id = "hello";

{% endhighlight %}

删除一个data-*属性，可以直接使用delete命令。

{% highlight javascript %}

delete document.getElementById("myDiv").dataset.id

{% endhighlight %}

IE 9不支持dataset属性，可以用 getAttribute('data-foo')、removeAttribute('data-foo')、setAttribute('data-foo')、hasAttribute('data-foo') 代替。

需要注意的是，dataset属性使用骆驼拼写法表示属性名，这意味着data-hello-world会用dataset.helloWorld表示。而如果此时存在一个data-helloWorld属性，该属性将无法读取，也就是说，data属性本身只能使用连词号，不能使用骆驼拼写法。

### 页面位置相关属性

**（1）offsetParent属性、offsetTop属性和offsetLeft属性**

这三个属性提供Element对象在页面上的位置。

- offsetParent：当前HTML元素的最靠近的、并且CSS的position属性不等于static的父元素。
- offsetTop：当前HTML元素左上角相对于offsetParent的垂直位移。
- offsetLeft：当前HTML元素左上角相对于offsetParent的水平位移。

如果Element对象的父对象都没有将position属性设置为非static的值（比如absolute或relative），则offsetParent属性指向body元素。另外，计算offsetTop和offsetLeft的时候，是从边框的左上角开始计算，即Element对象的border宽度不计入offsetTop和offsetLeft。

### style属性

style属性用来读写页面元素的行内CSS属性，详见本章《CSS操作》一节。

### Element对象的方法

**（1）选择子元素的方法**

Element对象也部署了document对象的4个选择子元素的方法，而且用法完全一样。

- querySelector方法
- querySelectorAll方法
- getElementsByTagName方法
- getElementsByClassName方法

上面四个方法只用于选择Element对象的子节点。因此，可以采用链式写法来选择子节点。

{% highlight javascript %}

document.getElementById('header').getElementsByClassName('a')

{% endhighlight %}

各大浏览器对这四个方法都支持良好，IE的情况如下：IE 6开始支持getElementsByTagName，IE 8开始支持querySelector和querySelectorAll，IE 9开始支持getElementsByClassName。

**（2）elementFromPoint方法**

该方法用于选择在指定坐标的最上层的Element对象。

{% highlight javascript %}

document.elementFromPoint(50,50)

{% endhighlight %}

上面代码了选中在(50,50)这个坐标的最上层的那个HTML元素。

**（3）HTML元素的属性相关方法**

- hasAttribute()：返回一个布尔值，表示Element对象是否有该属性。
- getAttribute()
- setAttribute()
- removeAttribute()

**（4）matchesSelector方法**

该方法返回一个布尔值，表示Element对象是否符合某个CSS选择器。

{% highlight javascript %}

document.querySelector('li').matchesSelector('li:first-child')

{% endhighlight %}

这个方法需要加上浏览器前缀，需要写成mozMatchesSelector()、webkitMatchesSelector()、oMatchesSelector()、msMatchesSelector()。

**（5）focus方法**

focus方法用于将当前页面的焦点，转移到指定元素上。

```javascript

document.getElementById('my-span').focus();

```

### table元素

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

## Text节点

Text节点代表元素节点和属性节点的文本内容。如果一个元素没有子元素，那么它就只有一个文本子节点，代表该元素的文本内容。通常使用元素节点的firstChild、nextSibling等属性获取文本节点，或者使用document对象的createTextNode方法创造一个文本节点。

{% highlight javascript %}

// 获取文本节点
var textNode = document.querySelector('p').firstChild;

// 创造文本节点
var textNode = document.createTextNode('Hi');
document.querySelector('div').appendChild(textNode);

{% endhighlight %}

注意，由于空格也是一个字符，所以哪怕只有一个空格，也会形成文本节点。

### 文本节点的属性

除了继承的属性，文本节点自身主要的属性是data，它等同于nodeValue属性，用来设置或读取文本节点的内容。

{% highlight javascript %}

document.querySelector('p').firstChild.data

document.querySelector('p').firstChild.nodeValue

{% endhighlight %}

wholeText属性将当前文本节点与毗邻的文本节点，作为一个整体返回。大多数情况下，wholeText属性的返回值，与data属性和textContent属性相同。但是，某些特殊情况会有差异。

举例来说，HTML代码如下。

```html
<p id="para">A <em>B</em> C</p>
```

这时，文本节点的wholeText属性和data属性，返回值相同。

```javascript
var el = document.getElementById("para");
el.firstChild.wholeText // "A "
el.firstChild.data // "A "
```

但是，一旦移除em节点，wholeText属性与data属性就会有差异。

```javascript
el.removeChild(para.childNodes[1]);
el.firstChild.wholeText // "A C"
el.firstChild.data // "A "
```

### 文本节点的方法

（1）文本编辑方法

- appendData()：在文本尾部追加字符串。
- deleteData()：删除子字符串，第一个参数为子字符串位置，第二个参数为子字符串长度。
- insertData()：在文本中插入字符串，第一个参数为插入位置，第二个参数为插入的子字符串。
- replaceData()：替换文本，第一个参数为替换开始位置，第二个参数为需要被替换掉的长度，第三个参数为新加入的字符串。
- subStringData()：获取子字符串，第一个参数为子字符串在文本中的开始位置，第二个参数为子字符串长度。

{% highlight javascript %}

var pElementText = document.querySelector('p').firstChild;

pElementText.appendData('!');
pElementText.deleteData(7,5);
pElementText.insertData(7,'Hello ');
pElementText.replaceData(7,5,'World');
pElementText.substringData(7,10));

{% endhighlight %}

（2）splitText()，normalize()

splitText方法将文本节点一分为二，变成两个毗邻的文本节点。它的参数就是分割位置（从零开始），分割到该位置的字符前结束。如果分割位置不存在，将报错。

分割后，该方法返回分割位置后方的字符串，而原文本节点变成只包含分割位置前方的字符串。

{% highlight javascript %}

// html代码为 <p id="p">foobar</p>
var p = document.getElementById('p');
var textnode = p.firstChild;

var newText = textnode.splitText(3);
newText // "bar"
textnode // "foo"

{% endhighlight %}

normalize方法可以将毗邻的两个文本节点合并。

接上面的例子，splitText方法将一个文本节点分割成两个，normalize方法可以实现逆操作，将它们合并。

```javascript
p.childNodes.length // 2

// 将毗邻的两个文本节点合并
p.normalize();
p.childNodes.length // 1
```

（3）Text构造函数

Text构造函数可以返回一个文本节点。它的参数就是文本节点的内容。

```javascript
var text1 = new Text();
var text2 = new Text("This is a text node");
```

## DocumentFragment节点

DocumentFragment是一个没有父节点的document对象，代表一个完整的DOM树形结构，但是不属于当前文档，只存在于内存之中。操作DocumentFragment节点，要比直接操作文档快得多。它就像一个文档的片段，一般用于构建一个子结构，然后插入当前文档。

Node对象的所有方法，都接受DocumentFragment节点作为参数（比如Node.appendChild、Node.insertBefore），这时DocumentFragment的子节点（而不是DocumentFragment节点本身）将新增或插入当前节点。

DocumentFragment节点对Web component也很有用，template元素的content属性包含的就是一个DocumentFragment对象。

document对象的createDocumentFragment方法，以及DocumentFragment构造函数，可以创建一个空的DocumentFragment节点，然后再可以使用其他DOM方法，向其添加子节点。

{% highlight javascript %}

var docFrag = document.createDocumentFragment();
// or
var docFrag = new DocumentFragment();

var li = document.createElement("li");
li.textContent = "Hello World";
docFrag.appendChild(li);

document.queryselector('ul').appendChild(docFrag);

{% endhighlight %}

上面代码创建了一个DocumentFragment节点，然后将一个li节点添加在它里面，最后将DocumentFragment节点移动到原文档。

一旦DocumentFragment节点被添加进原文档，它自身就变成了空节点（textContent属性为空字符串）。如果想要保存DocumentFragment节点的内容，可以使用cloneNode方法。

{% highlight javascript %}

document.queryselector('ul').(docFrag.cloneNode(true));

{% endhighlight %}

DocumentFragment对象的属性和方法，都继承自Node对象。以下四个属性是Node对象没有提供的属性。

- children：返回一个动态的HTMLCollection集合对象，包括当前DocumentFragment对象的所有子元素节点。
- firstElementChild：返回当前DocumentFragment对象的第一个子元素节点，如果没有则返回null。
- lastElementChild：返回当前DocumentFragment对象的最后一个子元素节点，如果没有则返回null。
- childElementCount：返回当前DocumentFragment对象的所有子元素数量。

## 参考链接

- Louis Lazaris, [Thinking Inside The Box With Vanilla JavaScript](http://coding.smashingmagazine.com/2013/10/06/inside-the-box-with-vanilla-javascript/)
- David Walsh, [HTML5 classList API](http://davidwalsh.name/classlist)
- Derek Johnson, [The classList API](http://html5doctor.com/the-classlist-api/)
- Mozilla Developer Network, [element.dataset API](http://davidwalsh.name/element-dataset)
- David Walsh, [The element.dataset API](http://davidwalsh.name/element-dataset) 
