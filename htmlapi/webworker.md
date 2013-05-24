---
title: Web Worker
layout: page
category: htmlapi
date: 2013-01-25
modifiedOn: 2013-05-21
---

## 概述

JavaScript语言采用的是单线程模型，也就是说，所有任务排成一个队列，一次只能做一件事。随着电脑计算能力的增强，这一点带来很大的不便，无法充分发挥JavaScript的潜力。尤其考虑到，File API允许JavaScript读取本地文件，就更是如此了。

Web Worker的目的，就是为JavaScript创造多线程环境，允许主线程将一些任务分配给子线程。在主线程运行的同时，子线程在后台运行，两者互不干扰。等到子线程完成计算任务，再把结果返回给主线程。因此，每一个子线程就好像一个“工人”（worker），默默地完成自己的工作。

Web Worker有以下几个特点：

- 同域限制，即子线程加载的脚本文件，必须与主线程的脚本文件在同一个域。
- 子线程无法读取网页的DOM对象，即document、window、parent这些对象，子线程都无法得到。
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

在主线程内部，采用new命令调用Worker构造函数，可以新建一个子线程。

{% highlight javascript %}

var worker = new Worker('work.js');

{% endhighlight %}

Worker构造函数的参数，就是子线程所要完成的任务脚本，上面的代码中是work.js。

子线程新建之后，并没有启动，必需等待主线程调用postMessage方法，即发出信号之后才会启动。

{% highlight javascript %}

worker.postMessage("Hello World");

{% endhighlight %}

postMessage的参数，就是主线程传给子线程的信号。它可以是一个字符串，也可以是一个对象。

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

self代表子线程自身，对它的message事件指定回调函数。该函数的参数是一个事件对象，该事件对象的data属性包含主线程发来的信号。self.postMessage则表示，子线程反过来向主线程也发送一个信号。

通过主线程发来信号的属性，子线程可以调用不同的方法。

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

## 参考链接

- Matt West, [Using Web Workers to Speed-Up Your JavaScript Applications](http://blog.teamtreehouse.com/using-web-workers-to-speed-up-your-javascript-applications)
