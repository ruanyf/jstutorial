---
title: 工具方法
layout: page
category: jquery
date: 2013-02-16
modifiedOn: 2013-02-16
---

## jQuery.proxy()

该方法用于绑定函数运行时的上下文和参数，也就是绑定this对象。

正常情况下，下面代码中的this指向事件所针对的DOM对象。

{% highlight javascript %}

$('#myElement').click(function() {
        // In this function, "this" is our DOM element.
    $(this).addClass('aNewClass');
});

{% endhighlight %}

如果我们把this对象放在setTimeout中，代码就会出错，因为函数运行的上下文已经不存在了，这时setTimeout是在全局环境的上下文运行，所以this对象指向全局对象。

{% highlight javascript %}

$('#myElement').click(function() {
    setTimeout(function() {
          // Problem! In this function "this" is not our element!
        $(this).addClass('aNewClass');
    }, 1000);
});

{% endhighlight %}

我们可以用jQuery.proxy()方法，将this对象与DOM对象绑定。

{% highlight javascript %}

$('#myElement').click(function() {

    setTimeout($.proxy(function() {
        $(this).addClass('aNewClass');  // Now "this" is again our element
    }, this), 1000);

});

{% endhighlight %}

