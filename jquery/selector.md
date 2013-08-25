---
title: 选择器
layout: page
category: jquery
date: 2013-02-01
modifiedOn: 2013-08-25
---

## 内置循环

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

## 属性的读写

.attr(name)用于读取某个网页元素的属性值，.attr(name, val)用于写入属性值。

.prop(name)用于读取某个DOM元素的属性值，.prop(name, val)用于写入属性值。它与attr方法的区别在于，后者针对的是网页元素的属性，也就是说这个属性应该是出现在网页代码中的，而前者针对DOM元素的属性，范围大了很多，比如selectedIndex、 tagName、nodeName、nodeType、ownerDocument、defaultChecked、defaultSelected这些DOM的内置属性。在英语中，attr是attribute的缩写，prop是property的缩写，中文很难表达出这种差异。

有时，attr方法和prop方法对同一个属性会读到不一样的值。比如，网页上有一个单选框。

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

## 参考链接

- Elijah Manor, [Do You Know When You Are Looping in jQuery?](http://www.elijahmanor.com/2013/01/yo-dawg-i-herd-you-like-loops-so-jquery.html)
