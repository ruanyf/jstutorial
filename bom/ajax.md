---
title: Ajax
layout: page
category: bom
date: 2013-02-16
modifiedOn: 2013-08-10
---

## XMLHttpRequest对象

该对象用于发出HTTP请求。

首先，新建一个实例对象。

{% highlight javascript %}

var xmlhttp = new XMLHttpRequest();

{% endhighlight %}

然后，使用open方式，指定请求的网址。

{% highlight javascript %}

xmlhttp.open( "GET", "some/ur1", true );

{% endhighlight %}

open方法的三个参数如下：

- 发送方法，一般来说为“GET”、“POST”、“PUT”和“DELETE”中的一个值。
- 网址。
- 是否异步，true表示异步，false表示同步。

XMLHttpRequest对象有一个readyStateChange事件，通信过程中任何状态的改变，都会触发这个事件。可以指定它的回调函数，对服务器传送的数据进行处理。

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

### responseType属性

XMLHttpRequest对象有一个responseType属性，用来指定服务器返回数据（xhr.response）的类型。

如果将这个属性设为“json”，支持JSON的浏览器，就会自动对返回数据调用JSON.parse() 方法。也就是说，你从xhr.response属性（注意，不是xhr.responseText属性）得到的不是文本，而不是一个JSON对象。

## JSON-P

越来越多的服务器返回JSON数据，这时就需要用JSON.parse将数据转为JSON对象。为了方便起见，许多服务器也支持指定回调函数的名称，直接将JSON数据放入回调函数的参数。这种方法就被称为JSON-P。

假定访问 http://example.com/ip ，返回如下JSON数据：

{% highlight javascript %}

{"ip":"8.8.8.8"}

{% endhighlight %}

现在服务器端允许使用callback参数指定回调函数。访问 http://example.com/ip?callback=foo ，返回的数据变成：

{% highlight javascript %}

foo({"ip":"8.8.8.8"})

{% endhighlight %}

这时，如果客户端网页设置了相应代码，foo函数就会被立即调用，而作为参数的JSON数据被视为JavaScript对象，而不是字符串，因此避免了使用JSON.parse的步骤。

{% highlight javascript %}

function foo(data) {
    alert('Your public IP address is: ' + data.ip);
};

{% endhighlight %}

## 参考链接

- MDN, [Using XMLHttpRequest](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Using_XMLHttpRequest)
- Mathias Bynens, [Loading JSON-formatted data with Ajax and xhr.responseType='json'](http://mathiasbynens.be/notes/xhr-responsetype-json)
