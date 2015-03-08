---
title: Cluster模块
layout: page
category: nodejs
date: 2015-03-08
modifiedOn: 2015-03-08
---

## 概述

### 基本用法

Node.js默认单进程运行，对于多核CPU的计算机来说，这样做效率很低，因为只有一个核在运行，其他核都在闲置。cluster模块就是为了解决这个问题而提出的。

cluster模块允许设立一个主进程和若干个worker进程，由主进程监控和协调worker进程的运行。

{% highlight javascript %}

var cluster = require('cluster');
var os = require('os');

if (cluster.isMaster){
  for (var i = 0, n = os.cpus().length; i < n; i += 1){
    cluster.fork();
	}
} else {
	http.createServer(function(req, res) {
	  res.writeHead(200);
	  res.end("hello world\n");
	}).listen(8000);
}

{% endhighlight %}

上面代码先判断当前进程是否为主进程（cluster.isMaster），如果是的，就按照CPU的核数，新建若干个worker进程；如果不是，说明当前进程是worker进程，则在该进程启动一个服务器程序。

### cluster.worker对象

cluster.worker指向当前worker进程对象，主进程没有这个值。

它有如下属性。

（1）worker.id

work.id返回当前worker的独一无二的进程编号。这个编号也是cluster.workers中指向当前进程的索引值。

（2）worker.process

所有的worker进程都是用child_process.fork()生成的。child_process.fork()返回的对象，就被保存在worker.process之中。通过这个属性，可以获取worker所在的进程对象。

（3）worker.send()

该方法用于在主进程中，向子进程发送信息。

```javascript
if (cluster.isMaster) {
  var worker = cluster.fork();
  worker.send('hi there');
} else if (cluster.isWorker) {
  process.on('message', function(msg) {
    process.send(msg);
  });
}
```

上面代码的作用是，worker进程对主进程发出的每个消息，都做回声。

在worker进程中调用这个方法，等同于process.send(message)。

### cluster.workers对象

该对象只有主进程才有，包含了所有worker进程。每个成员的键值就是一个worker进程，键名就是该worker进程的worker.id属性。

```javascript
function eachWorker(callback) {
  for (var id in cluster.workers) {
    callback(cluster.workers[id]);
  }
}
eachWorker(function(worker) {
  worker.send('big announcement to all workers');
});
```

上面代码用来遍历所有worker进程。

当前socket的data事件，也可以用id属性识别worker进程。

```javascript
socket.on('data', function(id) {
  var worker = cluster.workers[id];
});
```

## 属性与方法

### isMaster，isWorker

isMaster属性返回一个布尔值，表示当前进程是否为主进程。这个属性由process.env.NODE_UNIQUE_ID决定，如果process.env.NODE_UNIQUE_ID为未定义，就表示该进程是主进程。

isWorker属性返回一个布尔值，表示当前进程是否为work进程。它与isMaster属性的值正好相反。

### fork()

fork方法用于新建一个worker进程，上下文都复制主进程。只有主进程才能调用这个方法。

该方法返回一个worker对象。

### kill()

kill方法用于终止worker进程。它可以接受一个参数，表示系统信号。

如果当前是主进程，就会终止与worker.process的联络，然后将系统信号法发向worker进程。如果当前是worker进程，就会终止与主进程的通信，然后退出，返回0。

在以前的版本中，该方法也叫做 worker.destroy() 。

### listening事件

worker进程调用listen方面以后，“listening”就传向该进程的服务器，然后传向主进程。

该事件的回调函数接受两个参数，一个是当前worker对象，另一个是地址对象，包含网址、端口、地址类型（IPv4、IPv6、Unix socket、UDP）等信息。这对于那些服务多个网址的Node应用程序非常有用。

```javascript
cluster.on('listening', function(worker, address) {
  console.log("A worker is now connected to " + address.address + ":" + address.port);
});
```

## 实例：不中断地重启Node服务

重启服务需要关闭后再启动，利用cluster模块，可以做到先启动一个worker进程，再把原有的所有work进程关闭。这样就能实现不中断地重启Node服务。

下面是主进程的代码master.js。

```javascript
var cluster = require('cluster');

console.log('started master with ' + process.pid);

// 新建一个worker进程
cluster.fork();

process.on('SIGHUP', function () {
  console.log('Reloading...');
  var new_worker = cluster.fork();
  new_worker.once('listening', function () {
    // 关闭所有其他worker进程
    for(var id in cluster.workers) {
      if (id === new_worker.id.toString()) continue;
      cluster.workers[id].kill('SIGTERM');
    }
  });
});
```

上面代码中，主进程监听SIGHUP事件，如果发生该事件就关闭其他所有worker进程。之所以是SIGHUP事件，是因为nginx服务器监听到这个信号，会创造一个新的worker进程，重新加载配置文件。另外，关闭worker进程时，主进程发送SIGTERM信号，这是因为Node允许多个worker进程监听同一个端口。

下面是worker进程的代码server.js。

```javascript
var cluster = require('cluster');

if (cluster.isMaster) {
  require('./master');
  return;
}

var express = require('express');
var http = require('http');
var app = express();

app.get('/', function (req, res) {
  res.send('ha fsdgfds gfds gfd!');
});

http.createServer(app).listen(8080, function () {
  console.log('http://localhost:8080');
});
```

使用时代码如下。

```bash
$ node server.js
started master with 10538
http://localhost:8080
```

然后，向主进程连续发出两次SIGHUP信号。

```bash
$ kill -SIGHUP 10538
$ kill -SIGHUP 10538
```

主进程会连续两次新建一个worker进程，然后关闭所有其他worker进程，显示如下。

```bash
Reloading...
http://localhost:8080
Reloading...
http://localhost:8080

```

最后，向主进程发出SIGTERM信号，关闭主进程。

```bash
$ kill 10538
```

## 参考链接

- José F. Romaniello, [Reloading node with no downtime](http://joseoncode.com/2015/01/18/reloading-node-with-no-downtime/)
