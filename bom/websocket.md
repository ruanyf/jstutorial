---
title: WebSocket
layout: page
category: bom 
date: 2012-12-23
modifiedOn: 2012-12-23
---

## 概述

HTTP协议是一种无状态协议，服务器端本身不具有识别客户端的能力，必须借助外部机制，比如session和cookie，才能与特定客户端保持对话。这多多少少带来一些不便，尤其在服务器端与客户端需要持续交换数据的场合（比如网络聊天），更是如此。为了解决这个问题，HTML5提出了浏览器的[WebSocket API](http://dev.w3.org/html5/websockets/)。

WebSocket的主要作用是，允许服务器端与客户端进行全双工（full-duplex）的通信。举例来说，http协议有点像发电子邮件，发出后必须等待对方回信；WebSocket则是像打电话，服务器端和客户端可以同时向对方发送数据，它们之间存着一条持续打开的数据通道。

WebSocket不使用HTTP协议，而是使用自己的协议。浏览器发出的WebSocket请求类似于下面的样子：

{% highlight http %}

GET / HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Host: example.com
Origin: null
Sec-WebSocket-Key: sN9cRrP/n9NdMgdcy2VJFQ==
Sec-WebSocket-Version: 13

{% endhighlight %}

服务器端的Websocket相映则是

{% highlight http %}

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: fFBooB7FAkLlXgRSz0BT3v4hq5s=
Sec-WebSocket-Origin: null
Sec-WebSocket-Location: ws://example.com/

{% endhighlight %}

WebSocket服务器需要安装，目前比较流行是基于node.js的[socket.io](http://socket.io/)，更多的实现可参阅[Wikipedia](http://en.wikipedia.org/wiki/WebSocket#Server_side)。

## 连接WebSocket服务器

首先，客户端要检查浏览器是否支持WebSocket，使用的方法是查看window对象是否具有WebSocket属性。

{% highlight javascript	%}

if(window.WebSocket != undefined) {

	// WebSocket代码

}

{% endhighlight %}

然后，开始与服务器建立连接（这里假定服务器就是本机）。

{% highlight javascript	%}

if(window.WebSocket != undefined) {

	var connection = new WebSocket('ws://localhost:1740');

}

{% endhighlight %}

建立连接以后的WebSocket实例对象（即上面代码中的connection），有一个readyState属性，表示目前的状态，共有4个值：

- 0： 正在连接
- 1： 连接成功
- 2： 正在关闭
- 3： 连接关闭

## open事件

WebSocket连接成功后，浏览器会触发实例对象的open事件，我们可以指定它的回调函数。

{% highlight javascript	%}

connection.onopen = onopen;

function onopen (event) {

	document.getElementById('connection').innerHTML = "Connected";

}

{% endhighlight %}

## 数据交换

连接建立后，客户端通过send方法向服务器端发送数据。

{% highlight javascript	%}

connection.send(messagetext);

{% endhighlight %}

然后，通过定义message事件的回调函数，来处理服务端返回的数据。

{% highlight javascript	%}

connection.onmessage = onmessage;

function onmessage (event) {

	document.getElementById('connection').innerHTML = event.data;
}

{% endhighlight %}

## error事件

如果出现错误，浏览器会触发WebSocket实例对象的error事件。

{% highlight javascript	%}

connection.onerror = onerror;

function onerror(event) {

	document.getElementById('connection').innerHTML = "There was an error: " + event.data;
}

{% endhighlight %}

## 参考链接

- Ryan Stewart, [Real-time data exchange in HTML5 with WebSockets](http://www.adobe.com/devnet/html5/articles/real-time-data-exchange-in-html5-with-websockets.html)

