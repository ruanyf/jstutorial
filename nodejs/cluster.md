---
title: Cluster模块
layout: page
category: nodejs
date: 2015-03-08
modifiedOn: 2015-03-08
---

## 概述

### 基本用法

Node.js默认单进程运行，对于32位系统最高可以使用512MB内存，对于64位最高可以使用1GB内存。对于多核CPU的计算机来说，这样做效率很低，因为只有一个核在运行，其他核都在闲置。cluster模块就是为了解决这个问题而提出的。

cluster模块允许设立一个主进程和若干个worker进程，由主进程监控和协调worker进程的运行。worker之间采用进程间通信交换消息，cluster模块内置一个负载均衡器，采用Round-robin算法协调各个worker进程之间的负载。运行时，所有新建立的链接都由主进程完成，然后主进程再把TCP连接分配给指定的worker进程。

```javascript
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
```

上面代码先判断当前进程是否为主进程（cluster.isMaster），如果是的，就按照CPU的核数，新建若干个worker进程；如果不是，说明当前进程是worker进程，则在该进程启动一个服务器程序。

上面这段代码有一个缺点，就是一旦work进程挂了，主进程无法知道。为了解决这个问题，可以在主进程部署online事件和exit事件的监听函数。

```javascript
var cluster = require('cluster');

if(cluster.isMaster) {
  var numWorkers = require('os').cpus().length;
  console.log('Master cluster setting up ' + numWorkers + ' workers...');

  for(var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
}
```

上面代码中，主进程一旦监听到worker进程的exit事件，就会重启一个worker进程。worker进程一旦启动成功，可以正常运行了，就会发出online事件。

### worker对象

worker对象是`cluster.fork()`的返回值，代表一个worker进程。

它的属性和方法如下。

（1）worker.id

worker.id返回当前worker的独一无二的进程编号。这个编号也是cluster.workers中指向当前进程的索引值。

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

在worker进程中，要向主进程发送消息，使用`process.send(message)`；要监听主进程发出的消息，使用下面的代码。

```javascript
process.on('message', function(message) {
  console.log(message);
});
```

发出的消息可以字符串，也可以是JSON对象。下面是一个发送JSON对象的例子。

```javascript
worker.send({
  type: 'task 1',
  from: 'master',
  data: {
    // the data that you want to transfer
  }
});
```

### cluster.workers对象

该对象只有主进程才有，包含了所有worker进程。每个成员的键值就是一个worker进程对象，键名就是该worker进程的worker.id属性。

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

## cluster模块的属性与方法

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

worker进程调用listening方法以后，“listening”事件就传向该进程的服务器，然后传向主进程。

该事件的回调函数接受两个参数，一个是当前worker对象，另一个是地址对象，包含网址、端口、地址类型（IPv4、IPv6、Unix socket、UDP）等信息。这对于那些服务多个网址的Node应用程序非常有用。

```javascript
cluster.on('listening', function (worker, address) {
  console.log("A worker is now connected to " + address.address + ":" + address.port);
});
```

## 不中断地重启Node服务

### 思路

重启服务需要关闭后再启动，利用cluster模块，可以做到先启动一个worker进程，再把原有的所有work进程关闭。这样就能实现不中断地重启Node服务。

首先，主进程向worker进程发出重启信号。

```javascript
workers[wid].send({type: 'shutdown', from: 'master'});
```

worker进程监听message事件，一旦发现内容是shutdown，就退出。

```javascript
process.on('message', function(message) {
  if(message.type === 'shutdown') {
    process.exit(0);
  }
});
```

下面是一个关闭所有worker进程的函数。

```javascript
function restartWorkers() {
  var wid, workerIds = [];
  for(wid in cluster.workers) {
    workerIds.push(wid);
  }

  workerIds.forEach(function(wid) {
    cluster.workers[wid].send({
      text: 'shutdown',
      from: 'master'
     });
    setTimeout(function() {
      if(cluster.workers[wid]) {
        cluster.workers[wid].kill('SIGKILL');
      }
    }, 5000);
  });
};
```

### 实例

下面是一个完整的实例，先是主进程的代码master.js。

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

## PM2模块

PM2模块是cluster模块的一个包装层。它的作用是尽量将cluster模块抽象掉，让用户像使用单进程一样，部署多进程Node应用。

```javascript
// app.js
var http = require('http');

http.createServer(function(req, res) {
  res.writeHead(200);
  res.end("hello world");
}).listen(8080);
```

上面代码是标准的Node架设Web服务器的方式，然后用PM2从命令行启动这段代码。

```javascript
$ pm2 start app.js -i 4
```

上面代码的i参数告诉PM2，这段代码应该在cluster_mode启动，且新建worker进程的数量是4个。如果i参数的值是0，那么当前机器有几个CPU内核，PM2就会启动几个worker进程。

如果一个worker进程由于某种原因挂掉了，会立刻重启该worker进程。

```bash
# 重启所有worker进程
$ pm2 reload all
```

每个worker进程都有一个id，可以用下面的命令查看单个worker进程的详情。

```bash
$ pm2 show <worker id>
```

正确情况下，PM2采用fork模式新建worker进程，即主进程fork自身，产生一个worker进程。`pm2 reload`命令则会用spawn方式启动，即一个接一个启动worker进程，一个新的worker启动成功，再杀死一个旧的worker进程。采用这种方式，重新部署新版本时，服务器就不会中断服务。

```bash
$ pm2 reload <脚本文件名>
```

关闭worker进程的时候，可以部署下面的代码，让worker进程监听shutdown消息。一旦收到这个消息，进行完毕收尾清理工作再关闭。

```javascript
process.on('message', function(msg) {
  if (msg === 'shutdown') {
    close_all_connections();
    delete_logs();
    server.close();
    process.exit(0);
  }
});
```

## 参考链接

- José F. Romaniello, [Reloading node with no downtime](http://joseoncode.com/2015/01/18/reloading-node-with-no-downtime/)
- Joni Shkurti, [Node.js clustering made easy with PM2](https://keymetrics.io/2015/03/26/pm2-clustering-made-easy/)
- Behrooz Kamali, [How to Create a Node.js Cluster for Speeding Up Your Apps](http://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/)
