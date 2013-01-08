---
title: 服务器端发送事件
layout: page
category: htmlapi
date: 2013-01-07
modifiedOn: 2013-01-07
---

## 概述

传统的网页都是浏览器端向服务器端“查询”数据，但是很多场合，最有效的方式是服务器端向浏览器端“发送”数据。比如，每当收到新的电子邮件，服务器就向浏览器发送一个“通知”，这要比浏览器按时向服务器查询更有效率。

服务器端发送事件（Server-sent events）就是为了解决这个问题，而提出的一种新API，部署在EventSource对象上。目前，除了IE，其他主流浏览器都支持。

使用下面的代码，检测浏览器是否支持服务器端发送事件。

{% highlight javascript %}

if (!!window.EventSource) {
  // some code here
}

{% endhighlight %}

## 与WebSocket的区别

这个API与WebSocket有相似功能，都是用来建立浏览器与服务器之间的通信渠道。两者的区别在于：

- WebSocket是全双工通道，可以双向通信，功能更强；服务器端发送事件是单向通道，只能服务器端向浏览器端发送。
- WebSocket是一个新的协议，需要服务器端支持；服务器端发送事件则是HTTP协议之上的，现有的服务器软件都支持。
- 服务器端发送事件默认支持断线重连，WebSocket则需要额外部署。
- 服务器端发送事件支持自定义发送的数据类型。

从上面的比较可以看出，两者各有特点，适合不同的场合。

## 建立连接

首先，浏览器向服务器发起连接，使用EventSource方法。

{% highlight javascript %}

var source = EventSource(url);

{% endhighlight %}

参数url就是服务器网址，必须在网页的网址在同一个网域（domain），而且协议和端口都必须相同。

关闭连接使用close方法。

{% highlight javascript %}

source.close();

{% endhighlight %}

下面是一个建立连接的实例。

{% highlight javascript %}

if (!!window.EventSource) {
  var source = new EventSource('http://127.0.0.1/sses/');
}

{% endhighlight %}

## 连接状态

EventSource对象的readyState属性，表明连接所处的状态。

{% highlight javascript %}

source.readyState

{% endhighlight %}

它可以取以下值：

- 0，相当于常量EventSource.CONNECTING，表示连接还未建立，或者连接断线。
- 1，相当于常量EventSource.OPEN，表示连接已经建立，可以接受数据。
- 2，相当于常量EventSource.CLOSED，表示连接已断，且不会重连。

## 监听事件

### open事件

连接一旦建立，就会触发open事件，我们可以定义相应的回调函数。

{% highlight javascript %}

source.onopen = function(event) {
  // handle open event
};

// or

source.addEventListener("open", function(event) {
  // handle open event
}, false);

{% endhighlight %}

### 收到数据

收到数据就会触发message事件。

{% highlight javascript %}

source.onmessage = function(event) {
  var data = event.data;
  var origin = event.origin;
  var lastEventId = event.lastEventId;
  // handle message
};

// or

source.addEventListener("message", function(event) {
  var data = event.data;
  var origin = event.origin;
  var lastEventId = event.lastEventId;
  // handle message
}, false);

{% endhighlight %}

参数event有如下属性：

- data：服务器端传回的数据（文本格式）。
- origin： 服务器端URL的域名部分，即协议、域名和端口。
- lastEventId：每一条数据的一个编号，由服务器端发送。如果没有编号，这个属性为空。

### 自定义事件

服务器端可以与浏览器端约定自定义事件。这种情况下，发送回来的数据不会触发message事件。

{% highlight javascript %}

source.addEventListener("foo", function(event) {
  var data = event.data;
  var origin = event.origin;
  var lastEventId = event.lastEventId;
  // handle message
}, false);

{% endhighlight %}

### error事件

如果发生通信错误，就会触发error事件，比如连接中断。

{% highlight javascript %}

source.onerror = function(event) {
  // handle error event
};

// or

source.addEventListener("error", function(event) {
  // handle error event
}, false);

{% endhighlight %}

## 服务器端的设置

### 格式

服务器端发送的数据的HTTP头信息如下：

{% highlight html %}

Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

{% endhighlight %}

后面的行都是如下格式：

{% highlight html %}

field: value\n

{% endhighlight %}

field可以取四个值：“data”, “event”, “id”, or “retry”，也就是说有四类头信息。每次HTTP通信可以包含这四类头信息中的一类或多类。\n代表换行符。

以冒号开头的行，表示注释。通常，服务器每隔一段时间就会向浏览器发送一个注释，保持连接不中断。

{% highlight html %}

: This is a comment\n

{% endhighlight %}

### 数据栏

数据内容用data表示，可以占用一行或多行。

{% highlight html %}

data:  message\n\n

{% endhighlight %}

或者

{% highlight html %}

data: begin message\n
data: continue message\n\n

{% endhighlight %}

最后一行的data头信息，结尾要用两个换行符号，表示数据结束。

发送JSON格式的方法如下：

{% highlight html %}

data: {\n
data: "foo": "bar",\n
data: "baz", 555\n
data: }\n\n

{% endhighlight %}

### 数据标识符

数据标识符用id表示，相当于每一条数据的编号。

{% highlight html %}

id: msg1\n
data: message\n\n

{% endhighlight %}

浏览器端用lastEventId属性读取这个值。一旦连接断线，浏览器端会发送一个HTTP头，里面包含一个特殊的“Last-Event-ID”头信息，将这个值发送回来，用来帮助服务器端重建连接。因此，这个头信息可以被视为一种同步机制。

### 自定义信息类型

event头信息表示自定义的数据类型，或者说数据的名字。

{% highlight html %}

event: foo\n
data: a foo event\n\n
data: an unnamed event\n\n
event: bar\n
data: a bar event\n\n

{% endhighlight %}

上面的代码创造了三条信息。第一条是foo，第二条未取名，表示默认类型，第三条是bar。

### 最大间隔时间

浏览器默认的是，如果服务器端三秒内没有发送任何信息，则开始重连。服务器端可以用retry头信息，指定通信的最大间隔时间。

{% highlight html %}

retry: 10000\n

{% endhighlight %}

## 服务器端代码实例

服务器端发送事件，要求服务器与浏览器保持连接。对于不同的服务器软件来说，所消耗的资源是不一样的。Apache服务器，每个连接就是一个线程，如果要维持大量连接，势必要消耗大量资源。Node.js则是所有连接都使用同一个线程，因此消耗的资源会小得多，但是这要求每个连接不能包含很耗时的操作，比如磁盘的IO读写。

Node.js的服务器端发送事件的代码实例，可以参考[这里](http://cjihrig.com/blog/server-sent-events-in-node-js/)。

{% highlight javascript %}

var http = require("http");

http.createServer(function (req, res) {

	var fileName = "." + req.url;

	if (fileName === "./stream") {
    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
    res.write("retry: 10000\n");
    res.write("event: connecttime\n");
    res.write("data: " + (new Date()) + "\n\n");
    res.write("data: " + (new Date()) + "\n\n");

    interval = setInterval(function() {
      res.write("data: " + (new Date()) + "\n\n");
    }, 1000);
    req.connection.addListener("close", function () {
      clearInterval(interval);
    }, false);
  }

}).listen(80, "127.0.0.1");

{% endhighlight %}

PHP代码实例：

{% highlight php %}

<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache'); // recommended to prevent caching of event data.

/**
 * Constructs the SSE data format and flushes that data to the client.
 *
 * @param string $id Timestamp/id of this connection.
 * @param string $msg Line of text that should be transmitted.
 */
function sendMsg($id, $msg) {
  echo "id: $id" . PHP_EOL;
  echo "data: $msg" . PHP_EOL;
  echo PHP_EOL;
  ob_flush();
  flush();
}

$serverTime = time();

sendMsg($serverTime, 'server time: ' . date("h:i:s", time()));

{% endhighlight %}

## 参考链接

- Colin Ihrig, [Implementing Push Technology Using Server-Sent Events](http://jspro.com/apis/implementing-push-technology-using-server-sent-events/)
- Colin Ihrig，[The Server Side of Server-Sent Events](http://cjihrig.com/blog/the-server-side-of-server-sent-events/)
- Eric Bidelman, [Stream Updates with Server-Sent Events](http://www.html5rocks.com/en/tutorials/eventsource/basics/)
- MDN，[Using server-sent events](https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events)
