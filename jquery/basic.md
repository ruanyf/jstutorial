---
title: jQuery概述
layout: page
category: jquery
date: 2013-02-01
modifiedOn: 2013-10-27
---

jQuery是目前使用最广泛的JavaScript函数库。据统计，全世界使用JavaScript函数库的网页，90%选择了jQuery。下面就介绍jQuery的主要用法。

jQuery的核心思想是“选中某个元素，进行某种处理”（find something, do something），也就是说，先选择后处理。所以，绝大多数jQuery操作都是从选择器开始的。

jQuery函数库提供了一个全局对象jQuery，简写为$。在网页中加载jQuery以后，就可以使用这个全局对象了。jQuery的全部方法，都是定义在这个对象上面。

## 选择器

### 内置循环

jQuery默认对选中的元素进行循环处理。

{% highlight javascript %}

$(".class").addClass("highlight");

{% endhighlight %}

上面代码会执行一个内部循环，对每一个选中的元素进行addClass操作。由于这个原因，对选中的元素使用each方法是多余的。

{% highlight javascript %}

$(".class").each(function(index,element){
	 $(element).addClass("highlight");
});

// 或者

$(".class").each(function(){
	$(this).addClass("highlight");
});

{% endhighlight %}

上面代码的each方法，都是没必要使用的。

由于内置循环的存在，从性能考虑，应该尽量减少不必要的操作步骤。

{% highlight javascript %}

$(".class").css("color", "green").css("font-size", "16px");

// 应该写成

$(".class").css({ 
  "color": "green",
  "font-size": "16px"
});

{% endhighlight %}

### 属性的读写

首先，这里要区分两种属性。

一种是网页元素的属性，比如a元素的href属性、img元素的src属性，这要使用attr方法读写：.attr(name)用于读取属性值，.attr(name, val)用于写入属性值。

另一种是DOM元素的属性，比如tagName、nodeName、nodeType等等，这要使用prop方法读写：.prop(name)用于读取属性值，.prop(name, val)用于写入属性值。

所以，attr方法和prop方法针对的是不同的属性。在英语中，attr是attribute的缩写，prop是property的缩写，中文很难表达出这种差异。有时，attr方法和prop方法对同一个属性会读到不一样的值。比如，网页上有一个单选框。

{% highlight html %}

<input type="checkbox" checked="checked" />

{% endhighlight %}

对于checked属性，attr方法读到的是checked，prop方法读到的是true。

{% highlight javascript %}

$(input[type=checkbox]).attr("checked") // "checked"

$(input[type=checkbox]).prop("checked") // true

{% endhighlight %}

可以看到，attr方法读取的是网页上该属性的值，而prop方法读取的是DOM元素的该属性的值，根据规范，elem.checked应该返回一个布尔值。所以，判断单选框是否选中，要使用prop方法。事实上，不管这个单选框是否选中，attr("checked")的返回值都是checked。

{% highlight javascript %}

if ( $(elem).prop("checked") ) { //...};

// 下面两种方法亦可

if ( elem.checked ) { //...};
if ( $(elem).is(":checked") ) { //...};

{% endhighlight %}

## 事件处理

### 一次性事件

one方法指定一次性的回调函数，即这个函数只能运行一次。这对提交表单很有用。

{% highlight javascript %}

$("#button").one( "click", function() { return false; } );

{% endhighlight %}

one方法本质上是回调函数运行一次，即解除对事件的监听。

{% highlight javascript %}

document.getElementById("#button").addEventListener("click", handler);

function handler(e) {
    e.target.removeEventListener(e.type, arguments.callee);
	return false;
}

{% endhighlight %}

上面的代码在点击一次以后，取消了对click事件的监听。如果有特殊需要，可以设定点击2次或3次之后取消监听，这都是可以的。

## 参考链接

- Elijah Manor, [Do You Know When You Are Looping in jQuery?](http://www.elijahmanor.com/2013/01/yo-dawg-i-herd-you-like-loops-so-jquery.html)
- Craig Buckler, [How to Create One-Time Events in JavaScript](http://www.sitepoint.com/create-one-time-events-javascript/)
