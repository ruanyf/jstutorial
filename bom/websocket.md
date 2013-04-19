---
title: WebSocket
layout: page
category: bom 
date: 2012-12-23
modifiedOn: 2013-04-19
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

上面的头信息显示，有一个HTTP头是Upgrade。HTTP1.1协议规定，Upgrade头信息表示将通信协议从HTTP/1.1转向该项所指定的协议。“Connection: Upgrade”就表示浏览器通知服务器，如果可以，就升级到webSocket协议。Origin用于验证浏览器域名是否在服务器许可的范围内。Sec-WebSocket-Key则是用于握手协议的密钥，是base64编码的16字节随机字符串。

服务器端的Websocket相应则是

{% highlight http %}

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: fFBooB7FAkLlXgRSz0BT3v4hq5s=
Sec-WebSocket-Origin: null
Sec-WebSocket-Location: ws://example.com/

{% endhighlight %}

服务器端同样用“Connection: Upgrade”通知浏览器，需要改变协议。Sec-WebSocket-Accept是服务器在浏览器提供的Sec-WebSocket-Key字符串后面，添加“258EAFA5-E914-47DA-95CA-C5AB0DC85B11” 字符串，然后再取sha-1的hash值。浏览器将对这个值进行验证，以证明确实是目标服务器回应了webSocket请求。

WebSocket服务器需要安装，目前比较流行是基于node.js的[socket.io](http://socket.io/)，更多的实现可参阅[Wikipedia](http://en.wikipedia.org/wiki/WebSocket#Server_side)。

## 客户端

### 连接WebSocket服务器

首先，客户端要检查浏览器是否支持WebSocket，使用的方法是查看window对象是否具有WebSocket属性。

{% highlight javascript	%}

if(window.WebSocket != undefined) {

	// WebSocket代码

}

{% endhighlight %}

然后，开始与服务器建立连接（这里假定服务器就是本机）。这里需要使用ws协议。

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

当握手协议成功以后，readyState就从0变为1,并触发open事件，这时就可以向服务器发送要传递的信息了。

### open事件

WebSocket连接成功后，浏览器会触发实例对象的open事件，我们可以指定它的回调函数。

{% highlight javascript	%}

connection.onopen = onOpen;

function onOpen (event) {

	document.getElementById('connection').innerHTML = "Connected";

}

{% endhighlight %}

### close事件

WebSocket关闭时，触发close事件。

{% highlight javascript	%}

connection.onclose = onClose;

function onClose () {

	document.getElementById('connection').innerHTML = "Closed";

}

connection.close();

{% endhighlight %}

### 数据交换

连接建立后，客户端通过send方法向服务器端发送数据。

{% highlight javascript	%}

connection.send(messagetext);

{% endhighlight %}

除了发送字符串，也可以使用 Blob 或 ArrayBuffer 对象发送二进制数据。

{% highlight javascript	%}

// 使用ArrayBuffer发送canvas图像数据
var img = canvas_context.getImageData(0, 0, 400, 320);
var binary = new Uint8Array(img.data.length);
for (var i = 0; i < img.data.length; i++) {
	binary[i] = img.data[i];
}
connection.send(binary.buffer);

// 使用Blob发送文件
var file = document.querySelector('input[type="file"]').files[0];
connection.send(file);

{% endhighlight %}

然后，通过定义message事件的回调函数，来处理服务端返回的数据。

{% highlight javascript	%}

connection.onmessage = onmessage;

function onmessage (event) {

	document.getElementById('connection').innerHTML = event.data;
}

{% endhighlight %}

### error事件

如果出现错误，浏览器会触发WebSocket实例对象的error事件。

{% highlight javascript	%}

connection.onerror = onerror;

function onerror(event) {

	document.getElementById('connection').innerHTML = "There was an error: " + event.data;
}

{% endhighlight %}

## 服务器端

下面用node.js搭建一个服务器环境。

{% highlight javascript	%}

var http = require('http');
var server = http.createServer(function(request, response) {});

{% endhighlight %}

假设监听1234端口。

{% highlight javascript	%}

server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});

{% endhighlight %}

接着启动Web Socket服务器。这需要加载websocket库，如果没有安装，可以先使用npm命令安装。

{% highlight javascript	%}

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

{% endhighlight %}

Web Socket服务器建立request事件的回调函数。

{% highlight javascript	%}

wsServer.on('request', function(r){
    // Code here to run on connection
});

{% endhighlight %}

在回调函数中，参数r表示request对象。第一步，建立Web Socket连接。

{% highlight javascript	%}

var connection = r.accept('echo-protocol', r.origin);

{% endhighlight %}

然后，监听message事件。

{% highlight javascript	%}

// Create event listener
connection.on('message', function(message) {

    // The string message that was sent to us
    var msgString = message.utf8Data;

    // Send a message to the client with the message
    connection.sendUTF(msgString);

});

{% endhighlight %}

最后，监听用户的disconnect事件。

{% highlight javascript	%}

connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
});

{% endhighlight %}

## 参考链接

- Ryan Stewart, [Real-time data exchange in HTML5 with WebSockets](http://www.adobe.com/devnet/html5/articles/real-time-data-exchange-in-html5-with-websockets.html)
- Malte Ubl & Eiji Kitamura，[WEBSOCKETS 简介：将套接字引入网络](http://www.html5rocks.com/zh/tutorials/websockets/basics/)
- Jack Lawson, [WebSockets: A Guide](http://buildnewgames.com/websockets/)
- [Starting with Node and Web Sockets](http://codular.com/node-web-sockets)
- Jesse Cravens, [Introduction to WebSockets](http://tech.pro/tutorial/1167/introduction-to-websockets)
