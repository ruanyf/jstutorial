---
title: classList API
category: dom
layout: page
date: 2012-11-22
modifiedOn: 2013-08-08
---

这个API是操作网页元素的class属性的接口。每个DOM元素都有自己的classList属性，它返回一个类似数组的对象，包含了该元素的每个class。

{% highlight html %}

<div class="one two three" id="myDiv"></div>

{% endhighlight %}

上面这个div元素的DOM对象的classList属性，会返回该元素的所有class。

{% highlight javascript %}

document.getElementById('myDiv').classList
// {
//	0: "one"
//	1: "two"
//	2: "three"
//	length: 3
//	}

{% endhighlight %}

可以看到，classList对象的length属性，返回该元素拥有的class数量。

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

## 参考链接

- David Walsh, [HTML5 classList API](http://davidwalsh.name/classlist)
- Derek Johnson, [The classList API](http://html5doctor.com/the-classlist-api/)

