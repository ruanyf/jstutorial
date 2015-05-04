---
title: Text节点和DocumentFragment节点
category: dom
layout: page
date: 2015-05-01
modifiedOn: 2015-05-01
---

## Text节点的概念

Text节点代表Element节点和Attribute节点的文本内容。如果一个节点只包含一段文本，那么它就有一个Text子节点，代表该节点的文本内容。通常我们使用Element节点的firstChild、nextSibling等属性获取Text节点，或者使用Document节点的createTextNode方法创造一个Text节点。

{% highlight javascript %}

// 获取Text节点
var textNode = document.querySelector('p').firstChild;

// 创造Text节点
var textNode = document.createTextNode('Hi');
document.querySelector('div').appendChild(textNode);

{% endhighlight %}

浏览器原生提供一个Text构造函数。它返回一个Text节点。它的参数就是该Text节点的文本内容。

```javascript
var text1 = new Text();
var text2 = new Text("This is a text node");
```

注意，由于空格也是一个字符，所以哪怕只有一个空格，也会形成Text节点。

Text节点除了继承Node节点的属性和方法，还继承了CharacterData接口。Node节点的属性和方法请参考《Node节点》章节，这里不再重复介绍了，以下的属性和方法大部分来自CharacterData接口。

## Text节点的属性

### data

data属性等同于nodeValue属性，用来设置或读取Text节点的内容。

{% highlight javascript %}

// 读取文本内容
document.querySelector('p').firstChild.data
// 等同于
document.querySelector('p').firstChild.nodeValue

// 设置文本内容
document.querySelector('p').firstChild.data = 'Hello World';

{% endhighlight %}

### wholeText

wholeText属性将当前Text节点与毗邻的Text节点，作为一个整体返回。大多数情况下，wholeText属性的返回值，与data属性和textContent属性相同。但是，某些特殊情况会有差异。

举例来说，HTML代码如下。

```html
<p id="para">A <em>B</em> C</p>
```

这时，Text节点的wholeText属性和data属性，返回值相同。

```javascript
var el = document.getElementById("para");
el.firstChild.wholeText // "A "
el.firstChild.data // "A "
```

但是，一旦移除em节点，wholeText属性与data属性就会有差异，因为这时其实P节点下面包含了两个毗邻的Text节点。

```javascript
el.removeChild(para.childNodes[1]);
el.firstChild.wholeText // "A C"
el.firstChild.data // "A "
```

### length

length属性返回当前Text节点的文本长度。

```javascript
(new Text('Hello')).length // 5
```

### nextElementSibling

nextElementSibling属性返回紧跟在当前Text节点后面的那个同级Element节点。如果取不到这样的节点，则返回null。

```javascript
// HTML为
// <div>Hello <em>World</em></div>

var tn = document.querySelector('div').firstChild;
tn.nextElementSibling
// <em>World</em>
```

### previousElementSibling

previousElementSibling属性返回当前Text节点前面最近的那个Element节点。如果取不到这样的节点，则返回null。

## Text节点的方法

### appendData()，deleteData()，insertData()，replaceData()，subStringData()

以下5个方法都是编辑Text节点文本内容的方法。

appendData方法用于在Text节点尾部追加字符串。

deleteData方法用于删除Text节点内部的子字符串，第一个参数为子字符串位置，第二个参数为子字符串长度。

insertData方法用于在Text节点插入字符串，第一个参数为插入位置，第二个参数为插入的子字符串。

replaceData方法用于替换文本，第一个参数为替换开始位置，第二个参数为需要被替换掉的长度，第三个参数为新加入的字符串。

subStringData方法用于获取子字符串，第一个参数为子字符串在Text节点中的开始位置，第二个参数为子字符串长度。

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

### remove()

remove方法用于移除当前Text节点。

```javascript
// HTML代码为
// <p>Hello World</p>

document.querySelector('p').firstChild.remove()
// 现在页面代码为
// <p></p>
```

### splitText()，normalize()

splitText方法将Text节点一分为二，变成两个毗邻的Text节点。它的参数就是分割位置（从零开始），分割到该位置的字符前结束。如果分割位置不存在，将报错。

分割后，该方法返回分割位置后方的字符串，而原Text节点变成只包含分割位置前方的字符串。

{% highlight javascript %}

// html代码为 <p id="p">foobar</p>
var p = document.getElementById('p');
var textnode = p.firstChild;

var newText = textnode.splitText(3);
newText // "bar"
textnode // "foo"

{% endhighlight %}

normalize方法可以将毗邻的两个Text节点合并。

接上面的例子，splitText方法将一个Text节点分割成两个，normalize方法可以实现逆操作，将它们合并。

```javascript
p.childNodes.length // 2

// 将毗邻的两个Text节点合并
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

DocumentFragment节点对象没有自己的属性和方法，全部继承自Node节点和ParentNode接口。也就是说，DocumentFragment节点比Node节点多出以下四个属性。

- children：返回一个动态的HTMLCollection集合对象，包括当前DocumentFragment对象的所有子元素节点。
- firstElementChild：返回当前DocumentFragment对象的第一个子元素节点，如果没有则返回null。
- lastElementChild：返回当前DocumentFragment对象的最后一个子元素节点，如果没有则返回null。
- childElementCount：返回当前DocumentFragment对象的所有子元素数量。

另外，Node节点的所有方法，都接受DocumentFragment节点作为参数（比如Node.appendChild、Node.insertBefore）。这时，DocumentFragment的子节点（而不是DocumentFragment节点本身）将插入当前节点。
