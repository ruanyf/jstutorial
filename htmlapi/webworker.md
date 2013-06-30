---
title: Web Worker
layout: page
category: htmlapi
date: 2013-01-25
modifiedOn: 2013-06-30
---

## 概述

JavaScript语言采用的是单线程模型，也就是说，所有任务排成一个队列，一次只能做一件事。随着电脑计算能力的增强，这一点带来很大的不便，无法充分发挥JavaScript的潜力。尤其考虑到，File API允许JavaScript读取本地文件，就更是如此了。

Web Worker的目的，就是为JavaScript创造多线程环境，允许主线程将一些任务分配给子线程。在主线程运行的同时，子线程在后台运行，两者互不干扰。等到子线程完成计算任务，再把结果返回给主线程。因此，每一个子线程就好像一个“工人”（worker），默默地完成自己的工作。

Web Worker有以下几个特点：

- 同域限制，即子线程加载的脚本文件，必须与主线程的脚本文件在同一个域。
- 子线程无法读取网页的DOM对象，即document、window、parent这些对象，子线程都无法得到。（但是，navigator对象和location对象可以获得。）
- 子线程无法读取本地文件，即子线程无法打开本机的文件系统（file://），它所加载的脚本，必须来自网络。

使用之前，检查浏览器是否支持这个API。支持的浏览器包括IE10、Firefox (从3.6版本开始)、Safari (从4.0版本开始)、Chrome 和 Opera 11，但是手机浏览器还不支持。

{% highlight javascript %}

if (window.Worker) {
  // 支持
} else {
  // 不支持
}

{% endhighlight %}

如果使用Modernizr库，则判断方法为：

{% highlight javascript %}

if (Modernizr.webworkers) {
    // 支持
} else {
    // 不支持
}

{% endhighlight %}

## 新建和启动子线程

在主线程内部，采用new命令调用Worker方法，可以新建一个子线程。

{% highlight javascript %}

var worker = new Worker('work.js');

{% endhighlight %}

Worker方法的参数是一个脚本文件，这个文件就是子线程所要完成的任务，上面的代码中是work.js。由于子线程不能读取本地文件系统，所以这个脚本文件必须来自网络端。如果下载成功，比如出现404错误，这个子线程就会默默地失败。

子线程新建之后，并没有启动，必需等待主线程调用postMessage方法，即发出信号之后才会启动。

{% highlight javascript %}

worker.postMessage("Hello World");

{% endhighlight %}

postMessage方法的参数，就是主线程传给子线程的信号。它可以是一个字符串，也可以是一个对象。

{% highlight javascript %}

worker.postMessage({method: 'echo', args: ['Work']});

{% endhighlight %}

## 子线程的事件监听

在子线程内，必须有一个回调函数，监听message事件。

{% highlight javascript %}

/* File: work.js */

self.addEventListener('message', function(e) { 

			self.postMessage('You said: ' + e.data);
			
}, false);

{% endhighlight %}

self代表子线程自身，self.addEventListener表示对子线程的message事件指定回调函数（直接指定onmessage属性的值也可）。回调函数的参数是一个事件对象，它的data属性包含主线程发来的信号。self.postMessage则表示，子线程向主线程发送一个信号。

根据主线程发来的不同的信号值，子线程可以调用不同的方法。

{% highlight javascript %}

/* File: work.js */

self.onmessage = function(event) {
  var method = event.data.method;
  var args = event.data.args;

  var reply = doSomething(args);
  self.postMessage({method: method, reply: reply});
};

{% endhighlight %}

## 主线程的事件监听

主线程也必须指定message事件的回调函数，监听子线程发来的信号。

{% highlight javascript %}

/* File: main.js */

worker.addEventListener('message', function(e) {

			console.log(e.data);
			
}, false);

{% endhighlight %}

## 错误处理

主线程可以监听子线程是否发生错误。如果发生错误，会触发主线程的error事件。

{% highlight javascript %}

worker.onerror(function(event) {
  console.log(event);
});

// or

worker.addEventListener('error', function(event) {
  console.log(event);
});

{% endhighlight %}

## 关闭子线程

使用完毕之后，为了节省系统资源，我们必须在主线程调用terminate方法，手动关闭子线程。

{% highlight javascript %}

worker.terminate(); 

{% endhighlight %}

也可以子线程内部关闭自身。

{% highlight javascript %}

self.close();

{% endhighlight %}

## 主线程与子线程的数据通信

前面说过，主线程与子线程之间的通信内容，可以是文本，也可以是对象。需要注意的是，这种通信是拷贝关系，即是传值而不是传址，子线程对通信内容的修改，不会影响到主线程。事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给子线程，后者再将它还原。

主线程与子线程之间也可以交换二进制数据，比如File、Blob、ArrayBuffer等对象，也可以在线程之间发送。

但是，用拷贝方式发送二进制数据，会造成性能问题。比如，主线程向子线程发送一个500MB文件，默认情况下浏览器会生成一个原文件的拷贝。为了解决这个问题，JavaScript允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面。这种转移数据的方法，叫做[Transferable Objects](http://www.w3.org/html/wg/drafts/html/master/infrastructure.html#transferable-objects)。

如果要使用该方法，postMessage方法的最后一个参数必须是一个数组，用来指定前面发送的哪些值可以被转移给子线程。

{% highlight javascript %}

worker.postMessage(arrayBuffer, [arrayBuffer]);
window.postMessage(arrayBuffer, targetOrigin, [arrayBuffer]);

{% endhighlight %}

## 参考链接

- Matt West, [Using Web Workers to Speed-Up Your JavaScript Applications](http://blog.teamtreehouse.com/using-web-workers-to-speed-up-your-javascript-applications)
- Eric Bidelman，[The Basics of Web Workers](http://www.html5rocks.com/en/tutorials/workers/basics/)
- Eric Bidelman，[Transferable Objects: Lightning Fast!](http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast)
