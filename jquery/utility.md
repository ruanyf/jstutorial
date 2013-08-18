---
title: 工具方法
layout: page
category: jquery
date: 2013-02-16
modifiedOn: 2013-08-18
---

## jQuery.proxy()

jQuery.proxy()可以绑定函数的上下文（也就是this对象）和参数，返回一个新的函数。

它的用法主要有两种。

{% highlight javascript %}

jQuery.proxy(function, context)

jQuery.proxy(context, name)

{% endhighlight %}

第一种写法是为函数（function）指定上下文对象（context），第二种写法是将上下文对象（context）中的某个方法名（name）与对象本身绑定。

jQuery.proxy()的主要用处是为回调函数绑定上下文对象。

{% highlight javascript %}

var o = {
	type: "object",
	test: function(event) {
		console.log(this.type);
	}
};

$("#button")
  .on("click", o.test) // 无输出
  .on("click", $.proxy(o.test, o)) // object

{% endhighlight %}

上面的代码中，第一个回调函数没有绑定上下文，所以结果为空，没有任何输出；第二个回调函数将上下文绑定为对象o，结果就为object。这个例子的另一种等价的写法是：

{% highlight javascript %}

$("#button").on( "click", $.proxy(o, test)) 

{% endhighlight %}

$.proxy(o, test)的意思是，将o的方法test与o绑定。

再看一个例子。正常情况下，下面代码中的this对象指向发生click事件的DOM对象。

{% highlight javascript %}

$('#myElement').click(function() {
    $(this).addClass('aNewClass');
});

{% endhighlight %}

如果我们想把事件处理代码延后运行，使用setTimeout方法，代码就会出错，因为这时setTimeout是在全局环境的上下文运行，所以this对象指向全局对象。

{% highlight javascript %}

$('#myElement').click(function() {
    setTimeout(function() {
        $(this).addClass('aNewClass');
    }, 1000);
});

{% endhighlight %}

这时，就可以用jQuery.proxy()，将this对象的上下文与DOM对象绑定。

{% highlight javascript %}

$('#myElement').click(function() {

    setTimeout($.proxy(function() {
        $(this).addClass('aNewClass'); 
    }, this), 1000);

});

{% endhighlight %}

