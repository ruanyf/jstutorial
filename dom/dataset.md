---
layout: page
title: dataset API
date: 2012-11-22
category: dom
modifiedOn: 2012-11-22
---

这个API用于操作网页元素的data-属性。

目前，Firefox、Chrome、Opera、Safari浏览器支持该API。

## 使用方法

假设有如下的网页代码。

{% highlight html %}

<div id="myDiv" data-id="myId"></div>

{% endhighlight %}

### 取值

以data-id属性为例，要读取这个值，可以用dataset.id。

{% highlight javascript %}

// Get the element
var element = document.getElementById("myDiv");

// Get the id
var id = element.dataset.id;

{% endhighlight %}

### 赋值

要设置data-id属性，可以直接对dataset.id赋值。这时，如果data-id属性不存在，将会被创造出来。

{% highlight javascript %}

// Sets the value to something else
element.dataset.id = "Some other value";

{% endhighlight %}

## 参考链接

* Mozilla Developer Network, [element.dataset API](http://davidwalsh.name/element-dataset)
* David Walsh, [The element.dataset API](http://davidwalsh.name/element-dataset) 
