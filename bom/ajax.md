---
title: Ajax
layout: page
category: bom
date: 2013-02-16
modifiedOn: 2013-08-25
---

## XMLHttpRequest对象

该对象用于从JavaScript发出HTTP请求，下面是典型用法。

{% highlight javascript %}

// 新建一个XMLHttpRequest实例对象
var xhr = new XMLHttpRequest();

// 指定通信过程中状态改变时的回调函数
xhr.onreadystatechange = function(){

	// 通信成功时，状态值为4
    var completed = 4;
    if(xhr.readyState === completed){
        if(xhr.status === 200){
            // 处理服务器发送过来的数据
        }else{
            // 处理错误
        }
    }
};

// open方式用于指定HTTP动词、请求的网址、是否异步
xhr.open('GET', '/endpoint', true);

// 发送HTTP请求
xhr.send(null);

{% endhighlight %}

### Open方法

open方法用于指定发送HTTP请求的参数，它有三个参数如下：
- 发送方法，一般来说为“GET”、“POST”、“PUT”和“DELETE”中的一个值。
- 网址。
- 是否异步，true表示异步，false表示同步。

### readyState属性和readyStateChange事件

在通信过程中，每当发生状态变化的时候，readyState属性的值就会发生改变。

这个值每一次变化，都会触发readyStateChange事件。我们可以指定这个事件的回调函数，对不同状态进行不同处理。尤其是当状态变为4的时候，表示通信成功，这时回调函数就可以处理服务器传送回来的数据。

### send方法

send方法用于实际发出HTTP请求。如果不带参数，就表示HTTP请求只包含头信息，也就是只有一个URL，典型例子就是GET请求；如果带有参数，就表示除了头信息，还带有包含具体数据的信息体，典型例子就是POST请求。它可以发送许多类型的数据。

{% highlight javascript %}

void send();
void send(ArrayBuffer data);
void send(Blob data);
void send(Document data);
void send(DOMString? data);
void send(FormData data);

{% endhighlight %}

### 服务器返回的信息

（1）status属性

status属性表示返回的HTTP状态码。一般来说，如果通信成功的话，这个状态码是200。

（2）responseText属性

responseText属性表示服务器返回的文本数据。

### responseType属性

XMLHttpRequest对象有一个responseType属性，用来指定服务器返回数据（xhr.response）的类型。

如果将这个属性设为“json”，支持JSON的浏览器，就会自动对返回数据调用JSON.parse() 方法。也就是说，你从xhr.response属性（注意，不是xhr.responseText属性）得到的不是文本，而不是一个JSON对象。

## JSON-P

越来越多的服务器返回JSON格式的数据，但是从数据性质上来看，它属于字符串。这时就需要用JSON.parse方法将文本数据转为JSON对象。为了方便起见，许多服务器也支持指定回调函数的名称，直接将JSON数据放入回调函数的参数，如此一来就省略将字符串解析为JSON对象的步骤。这种方法就被称为JSON-P。

请看下面的例子，假定访问 http://example.com/ip ，返回如下JSON数据：

{% highlight javascript %}

{"ip":"8.8.8.8"}

{% endhighlight %}

现在服务器端允许使用callback参数指定回调函数。访问 http://example.com/ip?callback=foo ，返回的数据变成：

{% highlight javascript %}

foo({"ip":"8.8.8.8"})

{% endhighlight %}

这时，如果客户端定义了foo函数，该函数就会被立即调用，而作为参数的JSON数据被视为JavaScript对象，而不是字符串，因此避免了使用JSON.parse的步骤。

{% highlight javascript %}

function foo(data) {
    alert('Your public IP address is: ' + data.ip);
};

{% endhighlight %}

## 参考链接

- MDN, [Using XMLHttpRequest](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Using_XMLHttpRequest)
- Mathias Bynens, [Loading JSON-formatted data with Ajax and xhr.responseType='json'](http://mathiasbynens.be/notes/xhr-responsetype-json)
