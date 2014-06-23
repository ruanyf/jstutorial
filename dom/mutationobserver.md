---
title: Mutation Observer
category: dom
layout: page
date: 2013-09-16
ModifiedOn: 2013-09-16
---

## 概述

Mutation Observer（变动观察器）是监视DOM变动的接口。当DOM对象树发生任何变动的时候，Mutation Observer会得到通知。

在概念上，它很接近事件。可以理解为，当DOM发生变动，会触发Mutation Observer事件。但是，它与事件有一个本质不同：事件是同步触发，也就是说，当DOM发生变动，立刻会触发相应的事件；Mutation Observer则是异步触发，DOM发生变动以后，并不会马上触发，而是要等到当前所有DOM操作都结束后才触发。

这样设计是为了应付DOM变动频繁的特点。举例来说，如果在文档中连续插入1000个段落（p元素），就会连续触发1000个插入事件，执行每个事件的回调函数，这很可能造成浏览器的卡顿；而Mutation Observer完全不同，只在1000个段落都插入结束后才会触发，而且只触发一次。

Mutation Observer有以下特点：

- 它等待所有脚本任务完成后，才会运行，即采用异步方式。

- 它把DOM变动记录封装成一个数组进行处理，而不是一条条地个别处理DOM变动。

- 它既可以观察发生在DOM节点的所有变动，也可以观察某一类变动。

目前，Firefox（14+）、 Chrome(26+)、Opera（15+）、IE（11+）和Safari（6.1+）支持这个API。Safari 6.0和Chrome 18-25使用这个API的时候，需要加上WebKit前缀（WebKitMutationObserver）。可以使用下面的表达式，检查当前浏览器是否支持这个API。

{% highlight javascript %}

var MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver || 
        window.MozMutationObserver;

var observeMutationSupport = !!MutationObserver;

{% endhighlight %}

## 使用方法

首先，使用MutationObserver构造函数，新建一个实例，同时指定这个实例的回调函数。

{% highlight javascript %}

var observer = new MutationObserver( callback );

{% endhighlight %}

### observe方法

observe方法指定所要观察的DOM元素，以及所要观察的特定变动。

{% highlight javascript %}

var article = document.querySelector( 'article' );

var  options = {
    'childList': true,
    'attributes':true
} ;

observer.observe( article, options );

{% endhighlight %}

上面代码首先指定，所要观察的DOM元素是article，然后，指定所要观察的变动是子元素变动和属性变动。最后，将这两个限定条件作为参数，传入observer对象的observe方法。

Mutation Observer所观察的DOM变动（即上面代码的option对象），包含以下类型：

- **childList**：子元素的变动。
- **attributes**：属性的变动。
- **characterData**：节点内容或节点文本的变动。
- **subtree**：所有下属节点（包括子节点和子节点的子节点）的变动。

想要观察哪一种变动类型，就在option对象中指定它的值为true。需要注意的是，不能单独观察subtree变动，必须同时指定childList、attributes和characterData中的一种或多种。

除了变动类型，option对象还可以设定以下属性：

- **attributeOldValue**：值为true或者false。如果为true，则表示需要记录变动前的属性值。
- **characterDataOldValue**：值为true或者false。如果为true，则表示需要记录变动的数据值。
- **attributeFilter**：值为一个数组，表示需要观察的特定属性（比如['class','src']）。

### disconnect方法和takeRecords方法

disconnect方法用来停止观察。发生相应变动时，不再调用回调函数。

{% highlight javascript %}

observer.disconnect();

{% endhighlight %}

takeRecords方法用来清除变动记录，即不再处理未处理的变动。

{% highlight javascript %}

observer.takeRecords();

{% endhighlight %}

### MutationRecord对象

DOM对象每次发生变化，就会生成一条变动记录。这个变动记录对应一个MutationRecord对象，该对象包含了与变动相关的所有信息。Mutation Observer处理的是一个个MutationRecord对象所组成的数组。

MutationRecord对象包含了DOM的相关信息，有如下属性：

- **type**：观察的变动类型（attribute、characterData或者childList）。
- **target**：发生变动的DOM对象。
- **addedNodes**：新增的DOM对象。
- **removedNodes**：删除的DOM对象。
- **previousSibling**：前一个同级DOM对象，如果没有则返回null。
- **nextSibling**：下一个同级DOM对象，如果没有则返回null。
- **attributeName**：发生变动的属性。如果设置了attributeFilter，则只返回预先指定的属性。
- **oldValue**：变动前的值。这个属性只对attribute和characterData变动有效，如果发生childList变动，则返回null。

## 实例

### 子元素的变动

下面的例子说明如何读取变动记录。

{% highlight javascript %}

var callback = function(records){
    records.map(function(record){
    	console.log('Mutation type: ' + record.type); 
    	console.log('Mutation target: ' + record.target);
    });
};

var mo = new MutationObserver(callback);

var option = {
    'childList': true, 
    'subtree': true
};

mo.observe(document.body, option);

{% endhighlight %}

上面代码的观察器，观察body元素的所有下级元素（childList表示观察子元素，subtree表示观察子元素的下级元素）的变动。回调函数会在控制台显示所有变动的类型和目标元素。

### 属性的变动

下面的例子说明如何追踪属性的变动。

{% highlight javascript %}

var callback = function(records){
    records.map(function(record){
    	console.log('Previous attribute value: ' + record.oldValue);  
    });
};

var mo = new MutationObserver(callback);

var element = document.getElementById('#my_element');

var options = {
    'attributes': true,
    'attributeOldValue': true 
}

mo.observe(element, options);

{% endhighlight %}

上面代码先设定追踪属性变动（'attributes': true），然后设定记录变动前的值。实际发生变动时，会将变动前的值显示在控制台。

## 参考链接

- Tiffany Brown, [Getting to know mutation observers](http://dev.opera.com/articles/view/mutation-observers-tutorial/)
- Michal Budzynski, [JavaScript: The less known parts. DOM Mutations](http://michalbe.blogspot.com/2013/04/javascript-less-known-parts-dom.html)
- Jeff Griffiths, [DOM MutationObserver – reacting to DOM changes without killing browser performance](https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/)
- Addy Osmani, [Detect, Undo And Redo DOM Changes With Mutation Observers](http://addyosmani.com/blog/mutation-observers/)
