---
title: Node对象
layout: page
category: dom
date: 2013-10-07
modifiedOn: 2014-05-18
---

## Node节点对象

DOM的最小单位是节点（node），一个文档的树形结构就是由各种不同的节点组成。

对于HTML文档，节点有以下类型：

节点|名称|含义
----|----|----
DOCUMENT_NODE | 文档节点 | 整个文档（window.document）
ELEMENT_NODE | 元素节点 | HTML元素（比如&lt;body&gt;、&lt;a&gt;等）
ATTRIBUTE_NODE | 属性节点| HTML元素的属性（比如class="right"）
TEXT_NODE | 文本节点 | HTML文档中出现的文本
DOCUMENT_FRAGMENT_NODE | 文档碎片节点 | 文档的片段
DOCUMENT_TYPE_NODE | 文档类型节点 | 文档的类型（比如&lt;!DOCTYPE html&gt;）

浏览器原生提供一个Node对象，上面所有类型的节点都是Node对象派生出来的，也就是说它们都继承了Node的属性和方法。

### Node对象的属性

**（1）nodeName属性和nodeType属性**

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

**（2）nodeValue属性**

Text节点的nodeValue属性返回文本内容，而其他五类节点都返回null。所以，该属性的作用主要是提取文本节点的内容。

**（3）childNodes属性和children属性**

childNodes属性返回一个NodeList对象，该对象的成员是父节点的所有子节点，注意返回的不仅包括元素节点，还包括文本节点以及其他各种类型的子节点。如果父对象不包括任何子对象，则返回一个空对象。

{% highlight javascript %}

var ulElementChildNodes = document.querySelector('ul').childNodes;

{% endhighlight %}

children属性返回一个类似数组的对象，该对象的成员为HTML元素类型的子节点。如果没有HTML元素类型的子节点，则返回一个空数组。

childNodes属性和children属性返回的节点都是动态的。一旦原节点发生变化，立刻会反映在返回结果之中。

**（4）指向其他节点的属性**

以下属性指向其他的相关节点，用于遍历文档节点时非常方便。

- firstChild：第一个子节点。
- lastChild：最后一个子节点。
- parentNode：父节点。
- nextSibling：下一个同级节点。
- previousSibling：上一个同级节点。
- firstElementChild：第一个类型为HTML元素的子节点。
- lastElementChild：最后一个类型为HTML元素的子节点。
- nextElementSibling：下一个类型为HTML元素的同级节点。
- previousElementSibling：上一个类型为HTML元素的同级节点。

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

每一个HTML标签元素，都会转化成一个Element对象节点。所有的Element节点的nodeType属性都是1，但是不同标签生成的节点是不一样的。JavaScript内部使用不同的构造函数，生成不同的Element节点，比如a标签的节点由HTMLAnchorElement()构造函数生成，button标签的节点由HTMLButtonElement()构造函数生成。因此，Element对象不是一种对象，而是一组对象。

Element对象特有的属性：

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
- tagName
- dataset
- attributes

**（1）innerHTML属性，outerHTML属性，textContent属性，innerText属性，outerText属性**

innerHTML属性用来读取或设置某个节点内的HTML代码。

outerHTML属性用来读取或设置HTML代码时，会把节点本身包括在内。

textContent属性用来读取或设置节点包含的文本内容。

innerText属性和outerText属性在读取元素节点的文本内容时，得到的值是不一样的。它们的不同之处在于设置一个节点的文本属性时，outerText属性会使得原来的元素节点被文本节点替换掉。注意，innerText是非标准属性，Firefox不支持。

```javascript

document.getElementById('foo').innerHTML = 'Goodbye!';
document.getElementById('foo').innerText = 'GoodBye!';
document.getElementById('foo').textContent = 'Goodbye!';

```

使用textContent和innerText属性，为一个HTML元素设置内容，有一个好处，就是自动对HTML标签转义。这很适合用于用户提供的内容。

```javascript

document.getElementById('foo').innerText = '<p>GoodBye!</p>';

```

上面代码在插入文本时，会将p标签解释为文本，而不会当作标签处理。

**（2）tagName属性**

tagName属性返回该节点的HTML标签名，与nodeName属性相同。

{% highlight javascript %}

document.querySelector('a').tagName // A

document.querySelector('a').nodeName // A

{% endhighlight %}

从上面代码可以看出，这两个属性返回的都是标签名的大写形式。

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

### className属性和classList属性

className属性和classList属性都返回HTML元素的class属性。不同之处是，className属性返回一个字符串，每个class之间用空格分割，classList属性则返回一个类似数组的对象，每个class就是这个对象的一个成员。

{% highlight html %}

<div class="one two three" id="myDiv"></div>

{% endhighlight %}

上面这个div节点对象的className属性和classList属性，分别如下。

{% highlight javascript %}

document.getElementById('myDiv').className
// "one two three"

document.getElementById('myDiv').classList
// {
//	0: "one"
//	1: "two"
//	2: "three"
//	length: 3
//	}

{% endhighlight %}

从上面代码可以看出，classList属性指向一个类似数组的对象，该对象的length属性（只读）返回该节点的calss数量。

classList对象有一系列方法。

- add()：增加一个class。
- remove()：移除一个class。
- contains()：检查该DOM元素是否包含某个class。
- toggle()：将某个class移入或移出该DOM元素。
- item()：返回列表中某个特定位置的class。
- toString()：将class的列表转为字符串。

{% highlight javascript %}

myDiv.classList.add('myCssClass');

myDiv.classList.remove('myCssClass');

myDiv.classList.toggle('myCssClass'); // myCssClass被加入

myDiv.classList.toggle('myCssClass'); // myCssClass被移除

myDiv.classList.contains('myCssClass'); // 返回 true 或者 false

myDiv.classList.item(0);

myDiv.classList.toString();

{% endhighlight %}

各大浏览器（包括IE 10）都支持classList属性。

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

**（2） clientWidth属性和clientHeight属性**

这两个属性返回HTML元素的宽度和高度，在数值上等于内容本身+padding，不包括边框（border）。

{% highlight javascript %}

document.querySelector('div').clientWidth
document.querySelector('div').clientHeight

{% endhighlight %}

如果一个元素是可以滚动的，则clientWidth和clientHeight只计算它的可见部分的宽度和高度。

**（3）scrollHeight属性和scrollWidth属性**

这两个只读属性提供可滚动的HTML元素的总高度和总宽度。

{% highlight javascript %}

// <html>元素的总高度
document.documentElement.scrollHeight

// <body>元素的总高度
document.body.scrollHeight

{% endhighlight %}

**（4）scrollTop属性和scrollLeft属性**

这两个属性提供可滚动元素的可以滚动的高度和宽度。这两个属性是读写的。

{% highlight javascript %}

document.querySelector('div').scrollTop = 750;

{% endhighlight %}

上面代码将div元素的向下滚动750像素。

可滚动对象的高度和宽度，满足下面的公式。

{% highlight javascript %}

element.scrollHeight - element.scrollTop === element.clientHeight

{% endhighlight %}

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

**（5）scrollIntoView方法**

该方法用于将一个可滚动元素滚动到可见区域。

{% highlight javascript %}

document.querySelector('content').children[4].scrollIntoView();

{% endhighlight %}

scrollIntoView方法接受一个布尔值作为参数，默认值为true，表示滚动到HTML元素的上方边缘，如果该值为false，表示滚动到下方边缘。

### setAttribute()，removeAttribute()

setAttribute方法用于设置HTML元素的属性。

```javascript

// 使得<div id="foo"></div>
// 变为<div id="foo" role="button"></div>
document.getElementById('foo').setAttribute('role', 'button');

```

removeAttribute方法用于移除HTML元素的属性。

```javascript

document.getElementById('foo').removeAttribute('role');

```

### insertAdjacentHTML()

insertAdjacentHTML方法可以将一段字符串，作为HTML或XML对象，插入DOM。通常使用这个方法，在当前节点的前面或后面，添加新的同级节点或子节点。

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

getBoundingClientRect方法返回一个记录了位置信息的对象，用于获取HTML元素相对于视口（viewport）左上角的位置以及本身的长度和宽度。

{% highlight javascript %}

var box = document.getElementById('box');

var x1 = box.getBoundingClientRect().left;
var y1 = box.getBoundingClientRect().top;
var x2 = box.getBoundingClientRect().right;
var y2 = box.getBoundingClientRect().bottom;
var w = box.getBoundingClientRect().width;
var h = box.getBoundingClientRect().height;

{% endhighlight %}

上面代码获取DOM元素之后，使用getBoundingClientRect方法的相应属性，先后得到左上角和右下角的四个坐标（相对于视口），以及元素的宽和高。所有这些值都是只读的。

注意，getBoundingClientRect方法的所有属性，都把边框（border属性）算作元素的一部分。也就是说，都是从边框外缘的各个点来计算。因此，width和height包括了元素本身+padding+border。

所有浏览器都支持这个方法，但是IE 6到8对这个对象的支持不完整。 

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

文档中的文本对应Text节点，通常使用Element对象的firstChild、nextSibling等属性获取文本节点，或者使用document对象的createTextNode方法创造一个文本节点。

{% highlight javascript %}

// 获取文本节点
var textNode = document.querySelector('p').firstChild;

// 创造文本节点
var textNode = document.createTextNode('Hi');
document.querySelector('div').appendChild(textNode);

{% endhighlight %}

注意，由于空格也是一个字符，所以哪怕只有一个空格，也会形成文本节点。

### 文本节点的属性

除了继承的属性，文本节点自身主要的属性是data，它等同于nodeValue属性，用来返回文本节点的内容。

{% highlight javascript %}

document.querySelector('p').firstChild.data

document.querySelector('p').firstChild.nodeValue

{% endhighlight %}

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

（2）文本的分割与合并

- splitText()：将文本节点一分为二。
- normalize()：将毗邻的两个文本节点合并。

{% highlight javascript %}

// 将文本节点从第4个位置开始一分为二
document.querySelector('p').firstChild.splitText(4)

document.querySelector('p').firstChild.textContent
// 2

// 将毗邻的两个文本节点合并
document.querySelector('div').normalize()

document.querySelector('p').childNodes.length
// 1

{% endhighlight %}

## DocumentFragment节点

DocumentFragment节点代表一个完整的DOM树形结构，但是不属于当前文档，只存在于内存之中。操作DocumentFragment节点，要比直接操作文档快得多。它就像一个文档的片段，一般用于构建一个子结构，然后插入当前文档。

document对象的createDocumentFragment方法可以创建DocumentFragment节点，然后再可以使用其他DOM方法，添加子节点。

{% highlight javascript %}

var docFrag = document.createDocumentFragment();
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

## 参考链接

- Louis Lazaris, [Thinking Inside The Box With Vanilla JavaScript](http://coding.smashingmagazine.com/2013/10/06/inside-the-box-with-vanilla-javascript/)
- David Walsh, [HTML5 classList API](http://davidwalsh.name/classlist)
- Derek Johnson, [The classList API](http://html5doctor.com/the-classlist-api/)
- Mozilla Developer Network, [element.dataset API](http://davidwalsh.name/element-dataset)
- David Walsh, [The element.dataset API](http://davidwalsh.name/element-dataset) 
