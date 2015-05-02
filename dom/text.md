---
title: Text节点和DocumentFragment节点
category: dom
layout: page
date: 2015-05-01
modifiedOn: 2015-05-01
---

## Text节点的概念

Text节点代表元素节点和属性节点的文本内容。如果一个元素没有子元素，那么它就只有一个文本子节点，代表该元素的文本内容。通常使用元素节点的firstChild、nextSibling等属性获取文本节点，或者使用document对象的createTextNode方法创造一个文本节点。

{% highlight javascript %}

// 获取文本节点
var textNode = document.querySelector('p').firstChild;

// 创造文本节点
var textNode = document.createTextNode('Hi');
document.querySelector('div').appendChild(textNode);

{% endhighlight %}

浏览器原生提供一个Text构造函数。它返回一个文本节点。它的参数就是文本节点的内容。

```javascript
var text1 = new Text();
var text2 = new Text("This is a text node");
```

注意，由于空格也是一个字符，所以哪怕只有一个空格，也会形成文本节点。

## Text节点的属性

### data

除了继承的属性，文本节点自身主要的属性是data，它等同于nodeValue属性，用来设置或读取文本节点的内容。

{% highlight javascript %}

document.querySelector('p').firstChild.data

document.querySelector('p').firstChild.nodeValue

{% endhighlight %}

### wholeText

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

## Text节点的方法

### appendData()，deleteData()，insertData()，replaceData()，subStringData()

以下5个方法都是文本节点提供的编辑方法。

appendData方法，在文本尾部追加字符串。

deleteData方法用于删除子字符串，第一个参数为子字符串位置，第二个参数为子字符串长度。

insertData方法用于在文本中插入字符串，第一个参数为插入位置，第二个参数为插入的子字符串。

replaceData方法用于替换文本，第一个参数为替换开始位置，第二个参数为需要被替换掉的长度，第三个参数为新加入的字符串。

subStringData方法用于获取子字符串，第一个参数为子字符串在文本中的开始位置，第二个参数为子字符串长度。

{% highlight javascript %}

// HTML代码为
// <p>Hello World</p>
var pElementText = document.querySelector('p').firstChild;

pElementText.appendData('!');
// 页面显示 Hello World!
pElementText.deleteData(7,5);
// 页面显示 Hello W
pElementText.insertData(7,'Hello ');
// 页面显示 Hello WHello
pElementText.replaceData(7,5,'World');
// 页面显示 Hello WWorld
pElementText.substringData(7,10);
// 页面显示不变，返回"World "

{% endhighlight %}

### splitText()，normalize()

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

## DocumentFragment节点

DocumentFragment节点代表一个文档的片段，本身就是一个完整的DOM树形结构。它没有父节点，不属于当前文档，操作DocumentFragment节点，要比直接操作DOM树快得多。

它一般用于构建一个DOM结构，然后插入当前文档。document.createDocumentFragment方法，以及浏览器原生的DocumentFragment构造函数，可以创建一个空的DocumentFragment节点。然后再使用其他DOM方法，向其添加子节点。

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

DocumentFragment节点对象的属性和方法，除了继承Node对象，还继承ParentNode接口。后者提供以下四个属性。

- children：返回一个动态的HTMLCollection集合对象，包括当前DocumentFragment对象的所有子元素节点。
- firstElementChild：返回当前DocumentFragment对象的第一个子元素节点，如果没有则返回null。
- lastElementChild：返回当前DocumentFragment对象的最后一个子元素节点，如果没有则返回null。
- childElementCount：返回当前DocumentFragment对象的所有子元素数量。

Node对象的所有方法，都接受DocumentFragment节点作为参数（比如Node.appendChild、Node.insertBefore）。这时，DocumentFragment的子节点（而不是DocumentFragment节点本身）将插入当前节点。
