---
title: SSE：服务器发送事件
layout: page
category: htmlapi
date: 2013-01-07
modifiedOn: 2013-01-07
---

## 概述

传统的网页都是浏览器向服务器“查询”数据，但是很多场合，最有效的方式是服务器向浏览器“发送”数据。比如，每当收到新的电子邮件，服务器就向浏览器发送一个“通知”，这要比浏览器按时向服务器查询（polling）更有效率。

服务器发送事件（Server-Sent Events，简称SSE）就是为了解决这个问题，而提出的一种新API，部署在EventSource对象上。目前，除了IE，其他主流浏览器都支持。

简单说，所谓SSE，就是浏览器向服务器发送一个HTTP请求，然后服务器不断单向地向浏览器推送“信息”（message）。这种信息在格式上很简单，就是“信息”加上前缀“data: ”，然后以“\n\n”结尾。

{% highlight bash %}

$ curl http://example.com/dates
data: 1394572346452

data: 1394572347457

data: 1394572348463

^C

{% endhighlight %}

SSE与WebSocket有相似功能，都是用来建立浏览器与服务器之间的通信渠道。两者的区别在于：

- WebSocket是全双工通道，可以双向通信，功能更强；SSE是单向通道，只能服务器向浏览器端发送。

- WebSocket是一个新的协议，需要服务器端支持；SSE则是部署在HTTP协议之上的，现有的服务器软件都支持。

- SSE是一个轻量级协议，相对简单；WebSocket是一种较重的协议，相对复杂。

- SSE默认支持断线重连，WebSocket则需要额外部署。

- SSE支持自定义发送的数据类型。

从上面的比较可以看出，两者各有特点，适合不同的场合。

## 客户端代码

### 概述

首先，使用下面的代码，检测浏览器是否支持SSE。

{% highlight javascript %}

if (!!window.EventSource) {
  // ...
}

{% endhighlight %}

然后，部署SSE大概如下。

{% highlight javascript %}

var source = new EventSource('/dates');

source.onmessage = function(e){
  console.log(e.data);
};

// 或者

source.addEventListener('message', function(e){})

{% endhighlight %}

### 建立连接

首先，浏览器向服务器发起连接，生成一个EventSource的实例对象。

{% highlight javascript %}

var source = new EventSource(url);

{% endhighlight %}

参数url就是服务器网址，必须与当前网页的网址在同一个网域（domain），而且协议和端口都必须相同。

下面是一个建立连接的实例。

{% highlight javascript %}

if (!!window.EventSource) {
  var source = new EventSource('http://127.0.0.1/sses/');
}

{% endhighlight %}

新生成的EventSource实例对象，有一个readyState属性，表明连接所处的状态。

{% highlight javascript %}

source.readyState

{% endhighlight %}

它可以取以下值：

- 0，相当于常量EventSource.CONNECTING，表示连接还未建立，或者连接断线。

- 1，相当于常量EventSource.OPEN，表示连接已经建立，可以接受数据。

- 2，相当于常量EventSource.CLOSED，表示连接已断，且不会重连。

### open事件

连接一旦建立，就会触发open事件，可以定义相应的回调函数。

{% highlight javascript %}

source.onopen = function(event) {
  // handle open event
};

// 或者

source.addEventListener("open", function(event) {
  // handle open event
}, false);

{% endhighlight %}

### message事件

收到数据就会触发message事件。

{% highlight javascript %}

source.onmessage = function(event) {
  var data = event.data;
  var origin = event.origin;
  var lastEventId = event.lastEventId;
  // handle message
};

// 或者

source.addEventListener("message", function(event) {
  var data = event.data;
  var origin = event.origin;
  var lastEventId = event.lastEventId;
  // handle message
}, false);

{% endhighlight %}

参数对象event有如下属性：

- data：服务器端传回的数据（文本格式）。

- origin： 服务器端URL的域名部分，即协议、域名和端口。

- lastEventId：数据的编号，由服务器端发送。如果没有编号，这个属性为空。

### error事件

如果发生通信错误（比如连接中断），就会触发error事件。

{% highlight javascript %}

source.onerror = function(event) {
  // handle error event
};

// 或者

source.addEventListener("error", function(event) {
  // handle error event
}, false);

{% endhighlight %}

### 自定义事件

服务器可以与浏览器约定自定义事件。这种情况下，发送回来的数据不会触发message事件。

{% highlight javascript %}

source.addEventListener("foo", function(event) {
  var data = event.data;
  var origin = event.origin;
  var lastEventId = event.lastEventId;
  // handle message
}, false);

{% endhighlight %}

上面代码表示，浏览器对foo事件进行监听。

### close方法

close方法用于关闭连接。

{% highlight javascript %}

source.close();

{% endhighlight %}

## 数据格式

### 概述

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

: This is a comment

{% endhighlight %}

下面是一些例子。

{% highlight html %}

: this is a test stream\n\n

data: some text\n\n

data: another message\n
data: with two lines \n\n

{% endhighlight %}

### data：数据栏

数据内容用data表示，可以占用一行或多行。如果数据只有一行，则像下面这样，以“\n\n”结尾。

{% highlight html %}

data:  message\n\n

{% endhighlight %}

如果数据有多行，则最后一行用“\n\n”结尾，前面行都用“\n”结尾。

{% highlight html %}

data: begin message\n
data: continue message\n\n

{% endhighlight %}

总之，最后一行的data，结尾要用两个换行符号，表示数据结束。

以发送JSON格式的数据为例。

{% highlight html %}

data: {\n
data: "foo": "bar",\n
data: "baz", 555\n
data: }\n\n

{% endhighlight %}

### id：数据标识符

数据标识符用id表示，相当于每一条数据的编号。

{% highlight html %}

id: msg1\n
data: message\n\n

{% endhighlight %}

浏览器用lastEventId属性读取这个值。一旦连接断线，浏览器会发送一个HTTP头，里面包含一个特殊的“Last-Event-ID”头信息，将这个值发送回来，用来帮助服务器端重建连接。因此，这个头信息可以被视为一种同步机制。

### event栏：自定义信息类型

event头信息表示自定义的数据类型，或者说数据的名字。

{% highlight html %}

event: foo\n
data: a foo event\n\n

data: an unnamed event\n\n

event: bar\n
data: a bar event\n\n

{% endhighlight %}

上面的代码创造了三条信息。第一条是foo，触发浏览器端的foo事件；第二条未取名，表示默认类型，触发浏览器端的message事件；第三条是bar，触发浏览器端的bar事件。

### retry：最大间隔时间

服务器端可以用`retry`字段，指定浏览器重新发起连接的时间间隔。

```html
retry: 10000\n
```

两种情况会导致浏览器重新发起连接：一种是浏览器开始正常完毕服务器发来的信息，二是由于网络错误等原因，导致连接出错。

## 服务器代码

服务器端发送事件，要求服务器与浏览器保持连接。对于不同的服务器软件来说，所消耗的资源是不一样的。Apache服务器，每个连接就是一个线程，如果要维持大量连接，势必要消耗大量资源。Node.js则是所有连接都使用同一个线程，因此消耗的资源会小得多，但是这要求每个连接不能包含很耗时的操作，比如磁盘的IO读写。

下面是Node.js的服务器发送事件的[代码实例](http://cjihrig.com/blog/server-sent-events-in-node-js/)。

{% highlight javascript %}

var http = require("http");

http.createServer(function (req, res) {

	var fileName = "." + req.url;

	if (fileName === "./stream") {
		res.writeHead(200, {"Content-Type":"text/event-stream", 
							"Cache-Control":"no-cache", 
							"Connection":"keep-alive"});
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

PHP代码实例。

{% highlight php %}

<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache'); // 建议不要缓存SSE数据

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
- Segment.io, [Server-Sent Events: The simplest realtime browser spec](https://segment.io/blog/2014-04-03-server-sent-events-the-simplest-realtime-browser-spec/)
