---
title: classList API
category: dom
layout: page
date: 2012-11-22
modifiedOn: 2012-11-22
---

这个API是操作网页元素的class属性的接口。

目前，只有Firefox支持这个接口。

## 属性

### length

返回该网页元素的class数量。

## 方法

### add()

用于增加一个class。

{% highlight javascript %}

myDiv.classList.add('myCssClass');

{% endhighlight %}

### remove()

用于删除一个class。

{% highlight javascript %}

myDiv.classList.remove('myCssClass');

{% endhighlight %}

### toggle()

用于增删某个class。如果网页元素没有这个class，则加入；否则，就删除。

{% highlight javascript %}

myDiv.classList.toggle('myCssClass'); //now it's added
myDiv.classList.toggle('myCssClass'); //now it's removed

{% endhighlight %}

### contains()

判断是否包含某个class。

{% highlight javascript %}

myDiv.classList.contains('myCssClass'); //returns true or false

{% endhighlight %}

## 参考链接

* David Walsh, [HTML5 classList API](http://davidwalsh.name/classlist)


