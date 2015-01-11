---
title: document对象
layout: page
category: dom
date: 2014-05-18
modifiedOn: 2014-05-18
---

## DOM的含义

DOM是文档对象模型（Document Object Model）的简称，它的基本思想是把结构化文档（比如HTML和XML）解析成一系列的节点，再由这些节点组成一个树状结构。所有的节点和最终的树状结构，都有规范的对外接口，以达到使用编程语言操作文档的目的（比如增删内容）。所以，DOM可以理解成文档的编程接口。

DOM有自己的国际标准，目前的通用版本是[DOM 3](http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html)，下一代版本[DOM 4](http://www.w3.org/TR/dom/)正在拟定中。本章介绍的就是JavaScript对DOM标准的实现和用法。

## document对象概述

document对象是文档的根节点，window.document属性就指向这个对象。也就是说，只要浏览器开始载入HTML文档，这个对象就开始存在了，可以直接调用。

document.childNodes属性返回该对象的所有子节点。对于HTML文档来说，document对象一般有两个子节点。

第一个子节点是document.doctype，表示文档类型节点（DocumentType）。对于HTML5文档来说，该节点就代表&lt;!DOCTYPE html&gt;。

第二个子节点是document.documentElement，表示元素节点（Element），代表&lt;html lang="en"&gt;。

## document对象的属性

document对象有很多属性，用得比较多的是下面这些。

### 文档信息属性

- title：文档的标题。
- lastModified：文档文件的上一次修改时间。
- referrer：文档的访问来源。
- URL：文档的URL。
- compatMode：浏览器处理文档的模式，可能的值为BackCompat（向后兼容模式）和 CSS1Compat（严格模式）。

### 指向其他节点或对象的属性

- doctype：文档类型节点。
- documentElement：html元素节点。
- head：head元素节点。
- body：body元素节点。
- activeElement：文档中被激活（focused/active）的元素。
- defaultView：当前文档的JavaScript顶层对象，即window对象。

```javascript

document.doctype // <!DOCTYPE html>
document.documentElement // <html>...</html>
document.head // <head>...</head>
document.body // <body>...</body>
document.defaultView // window

document.querySelector('textarea').focus();
document.activeElement // <textarea>

```

### 指向特定元素集合的属性

document对象有一些属性，指向特定元素的集合。

- document.all ：文档中所有的元素，Firefox不支持该属性。
- document.forms ：所有的form元素。
- document.images：所有的img元素。
- document.links：所有的a元素。
- document.scripts：所有的script元素。
- document.styleSheets：所有的link或者style元素。

上面所有的元素集合都是动态的，原节点有任何变化，立刻会反映在这些集合中。

### implementation属性

该属性指向一个对象，提供浏览器支持的模块信息，它的hasFeature方法返回一个布尔值，表示是否支持某个模块。

```javascript

document.implementation.hasFeature('MutationEvents','2.0')
// true

```

上面代码表示，当前浏览器支持MutationEvents模块的2.0版本。

## document对象的方法

### document.write()

document.write方法用于向页面写入内容。

```javascript

document.addEventListener("DOMContentLoaded", function(event) {
   document.write('<p>Hello World!</p>');
});

```

需要注意的是，如果在页面已经渲染完成的情况下调用这个方法，会把原有的页面全部抹去，等于是在一个新建的页面上写入内容。上面的那段代码，实际执行效果如下。

```javascript

document.addEventListener("DOMContentLoaded", function(event) {
  document.open();
  document.write('<p>Hello World!</p>');
  document.close();
});

```

为了避免这种情况，一般document.write只能在页面渲染的过程中使用。

```javascript

<div> 
  <script type="text/javascript"> 
    document.write("<h1>Main title</h1>") 
  </script> 
</div>

```

上面的代码会在页面中插入一行h1，而不改变其他的代码。

除了某些特殊情况，应该尽量避免使用这个方法。

### querySelector()，getElementById()

这两个方法用于获取元素节点。它们的不同之处是，querySelector方法的参数使用CSS选择器语法，getElementById方法的参数是HTML标签元素的id属性。

{% highlight javascript %}

document.getElementById('myElement')

document.querySelector('#myElement')

{% endhighlight %}

上面代码中，两个方法都能选中id为myElement的元素，但是getElementById()比querySelector()效率高得多。

getElementById方法和querySelector方法的返回值，要么是null（未选中时），要么是选中的那个元素节点。如果有多个节点满足querySelector方法的条件，则返回第一个匹配的节点。

querySelector方法可以接受各种复杂的CSS选择器。

```javascript

document.querySelector('#myParent > [ng-click]');

```

### querySelectorAll()，getElementsByTagName()，getElementsByClassName()

这三个方法都返回一组符合条件的网页元素节点。

它们的不同之处如下。

（1）参数，querySelectorAll方法的参数是CSS选择器，getElementsByTagName方法的参数是HTML元素名，getElementsByClassName方法的参数是HTML元素的class属性。

（2）返回值的类型。getElementsByTagName方法和getElementsByClassName方法，返回的是HTMLCollection类型的对象，querySelectorAll方法返回的是NodeList类型的对象。这两类对象都是类似数组的对象，但是HTMLCollection只能包括HTML元素节点，NodeList可以包括各种节点。getElementsByTagName方法和getElementsByClassName方法返回的是对象的指针，当对象发生变化时，返回的结果集会跟着变化，querySelectorAll方法返回的结果集没有这种特性。

（3）效率。getElementsByTagName方法和getElementsByClassName方法的效率，高于querySelectorAll方法。

{% highlight javascript %}

document.querySelectorAll('li')
document.getElementsByTagName('li')
document.getElementsByClassName('liClass')

{% endhighlight %}

如果querySelectorAll方法和getElementsByTagName方法的参数是字符串“*”，则会返回文档中的所有HTML元素节点。

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

### getElementsByName()

getElementsByName方法用于选择拥有name属性的HTML元素，比如form、img、frame、embed和object。

```javascript

// 假定有一个表单是<form name="x"></form>

var forms = document.getElementsByName("x");
forms[0].tagName // "FORM"

```

上面代码表明getElementsByName方法的返回值是一组对象，必须用方括号运算符取出单个对象。

### createElement()，createTextNode()

createElement方法用来生成元素节点，createTextNode方法用来生成文本节点。

createElement方法接受一个字符串参数，表示要创造哪一种HTML元素，传入的字符串应该等同于元素节点的tagName属性。createTextNode方法的参数，就是所要生成的文本节点的内容。

```javascript

var elementNode = document.createElement('div');
var textNode = document.createTextNode('Hi');

```

### hasFocus()

hasFocus()方法返回一个布尔值，表示当前文档之中是否有元素被激活或获得焦点。

```javascript

focused = document.hasFocus();

```

如果用户点击按钮，从当前窗口跳出一个新窗口。在用户使用鼠标点击该窗口之前，该新窗口就不拥有焦点。
