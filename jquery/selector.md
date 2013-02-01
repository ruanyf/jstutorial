---
title: 选择器
layout: page
category: jquery
date: 2013-02-01
modifiedOn: 2013-02-01
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

## 参考链接

- Elijah Manor, [Do You Know When You Are Looping in jQuery?](http://www.elijahmanor.com/2013/01/yo-dawg-i-herd-you-like-loops-so-jquery.html)
