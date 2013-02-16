---
title: Ajax
layout: page
category: bom
date: 2013-02-16
modifiedOn: 2013-02-16
---

## XMLHttpRequest对象

该对象用于发出HTTP请求。

首先，新建一个实例对象。

{% highlight javascript %}

var xmlhttp = new XMLHttpRequest();

{% endhighlight %}

然后，使用open方式，指定请求的网址。

{% highlight javascript %}

xmlhttp.open( "GET", "some/ur/1", true );

{% endhighlight %}

open方法的三个参数如下：

- 发送方法，一般来说为“GET”、“POST”、“PUT”和“DELETE”中的一个值。
- 网址。
- 是否异步，true表示异步，false表示同步。

XMLHttpRequest对象有一个readyStateChange，通信过程中任何状态的改变，都会触发这个事件。可以指定它的回调函数。

{% highlight javascript %}

xmlhttp.onreadystatechange = function( data ) {
    if ( xmlhttp.readyState === 4 ) {
        console.log( data );
    }
};

{% endhighlight %}

最后，调用send方法，实际发出请求。

{% highlight javascript %}

xmlhttp.send( null );

{% endhighlight %}

## 参考链接

- MDN, [Using XMLHttpRequest](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Using_XMLHttpRequest)
