---
title: Web Worker
layout: page
category: htmlapi
date: 2013-01-25
modifiedOn: 2013-08-10
---

## 概述

JavaScript语言采用的是单线程模型，也就是说，所有任务排成一个队列，一次只能做一件事。随着电脑计算能力的增强，这一点带来很大的不便，无法充分发挥JavaScript的潜力。尤其考虑到，File API允许JavaScript读取本地文件，就更是如此了。

Web Worker的目的，就是为JavaScript创造多线程环境，允许主线程将一些任务分配给子线程。在主线程运行的同时，子线程在后台运行，两者互不干扰。等到子线程完成计算任务，再把结果返回给主线程。因此，每一个子线程就好像一个“工人”（worker），默默地完成自己的工作。

普通的Wek Worker，只能与创造它们的主进程通信。还有另一类Shared worker，能被所有同源的进程获取（比如来自不同的浏览器窗口、iframe窗口和其他Shared worker）。本节不涉及这一类的worker进程。

Web Worker有以下几个特点：

- **同域限制**。子线程加载的脚本文件，必须与主线程的脚本文件在同一个域。

- **DOM限制**。子线程无法读取网页的DOM对象，即document、window、parent这些对象，子线程都无法得到。（但是，navigator对象和location对象可以获得。）

- **脚本限制**。子线程无法读取网页的全局变量和函数，也不能执行alert和confirm方法，不过可以执行setInterval和setTimeout，以及使用XMLHttpRequest对象发出AJAX请求。

- **文件限制**。子线程无法读取本地文件，即子线程无法打开本机的文件系统（file://），它所加载的脚本，必须来自网络。

使用之前，检查浏览器是否支持这个API。支持的浏览器包括IE10、Firefox (从3.6版本开始)、Safari (从4.0版本开始)、Chrome 和 Opera 11，但是手机浏览器还不支持。

```javascript
if (window.Worker) {
  // 支持
} else {
  // 不支持
}
```

## 新建和启动子线程

主线程采用new命令，调用Worker构造函数，可以新建一个子线程。

```javascript
var worker = new Worker('work.js');
```

Worker构造函数的参数是一个脚本文件，这个文件就是子线程所要完成的任务，上面代码中是work.js。由于子线程不能读取本地文件系统，所以这个脚本文件必须来自网络端。如果下载没有成功，比如出现404错误，这个子线程就会默默地失败。

子线程新建之后，并没有启动，必需等待主线程调用postMessage方法，即发出信号之后才会启动。postMessage方法的参数，就是主线程传给子线程的信号。它可以是一个字符串，也可以是一个对象。

```javascript
worker.postMessage("Hello World");
worker.postMessage({method: 'echo', args: ['Work']});
```

## 子线程的事件监听

在子线程内，必须有一个回调函数，监听message事件。

```javascript
/* File: work.js */

self.addEventListener('message', function(e) {
  self.postMessage('You said: ' + e.data);
}, false);
```

self代表子线程自身，self.addEventListener表示对子线程的message事件指定回调函数（直接指定onmessage属性的值也可）。回调函数的参数是一个事件对象，它的data属性包含主线程发来的信号。self.postMessage则表示，子线程向主线程发送一个信号。

根据主线程发来的不同的信号值，子线程可以调用不同的方法。

```javascript
/* File: work.js */

self.onmessage = function(event) {
  var method = event.data.method;
  var args = event.data.args;

  var reply = doSomething(args);
  self.postMessage({method: method, reply: reply});
};
```

## 主线程的事件监听

主线程也必须指定message事件的回调函数，监听子线程发来的信号。

```javascript
/* File: main.js */

worker.addEventListener('message', function(e) {
	console.log(e.data);
}, false);
```

## 错误处理

主线程可以监听子线程是否发生错误。如果发生错误，会触发主线程的error事件。

```javascript
worker.onerror(function(event) {
  console.log(event);
});

// or

worker.addEventListener('error', function(event) {
  console.log(event);
});
```

## 关闭子线程

使用完毕之后，为了节省系统资源，我们必须在主线程调用terminate方法，手动关闭子线程。

```javascript
worker.terminate();
```

也可以子线程内部关闭自身。

```javascript
self.close();
```

## 主线程与子线程的数据通信

前面说过，主线程与子线程之间的通信内容，可以是文本，也可以是对象。需要注意的是，这种通信是拷贝关系，即是传值而不是传址，子线程对通信内容的修改，不会影响到主线程。事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给子线程，后者再将它还原。

主线程与子线程之间也可以交换二进制数据，比如File、Blob、ArrayBuffer等对象，也可以在线程之间发送。

但是，用拷贝方式发送二进制数据，会造成性能问题。比如，主线程向子线程发送一个500MB文件，默认情况下浏览器会生成一个原文件的拷贝。为了解决这个问题，JavaScript允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面。这种转移数据的方法，叫做[Transferable Objects](http://www.w3.org/html/wg/drafts/html/master/infrastructure.html#transferable-objects)。

如果要使用该方法，postMessage方法的最后一个参数必须是一个数组，用来指定前面发送的哪些值可以被转移给子线程。

```javascript
worker.postMessage(arrayBuffer, [arrayBuffer]);
window.postMessage(arrayBuffer, targetOrigin, [arrayBuffer]);
```

## 同页面的Web Worker

通常情况下，子线程载入的是一个单独的JavaScript文件，但是也可以载入与主线程在同一个网页的代码。假设网页代码如下：

```html
<!DOCTYPE html>
    <body>
        <script id="worker" type="app/worker">

            addEventListener('message', function() {
                postMessage('Im reading Tech.pro');
            }, false);
        </script>
    </body>
</html>
```

我们可以读取页面中的script，用worker来处理。

```javascript
var blob = new Blob([document.querySelector('#worker').textContent]);
```

这里需要把代码当作二进制对象读取，所以使用Blob接口。然后，这个二进制对象转为URL，再通过这个URL创建worker。

```javascript
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);
```

部署事件监听代码。

```javascript
worker.addEventListener('message', function(e) {
   console.log(e.data);
}, false);
```

最后，启动worker。

```javascript
worker.postMessage('');
```

整个页面的代码如下：

```html
<!DOCTYPE html>
<body>
  <script id="worker" type="app/worker">
    addEventListener('message', function() {
      postMessage('Work done!');
    }, false);
   </script>

  <script>
    (function() {
      var blob = new Blob([document.querySelector('#worker').textContent]);
      var url = window.URL.createObjectURL(blob);
      var worker = new Worker(url);

      worker.addEventListener('message', function(e) {
        console.log(e.data);
      }, false);

      worker.postMessage('');
    })();
  </script>
</body>
</html>
```

可以看到，主线程和子线程的代码都在同一个网页上面。

上面所讲的Web Worker都是专属于某个网页的，当该网页关闭，worker就自动结束。除此之外，还有一种共享式的Web Worker，允许多个浏览器窗口共享同一个worker，只有当所有网口关闭，它才会结束。这种共享式的Worker用SharedWorker对象来建立，因为适用场合不多，这里就省略了。

## Service Worker

Service worker是一个在浏览器后台运行的脚本，与网页不相干，专注于那些不需要网页或用户互动就能完成的功能。

Service Worker的特点。

（1）它属于JavaScript Worker，不能直接接触DOM，通过`postMessage`接口与页面通信。

（2）Service worker可以作为网络请求的代理，从而控制页面的网路通信。

（3）它可以在使用结束时终止，也可以在需要的时候重启。所以，不能依赖它内部的`onfetch`和`onmessage`监听函数。如果确实需要它一直运行，就必须让它可以使用IndexedDB API。

（4）它大量使用Promise。

使用Service Worker有以下步骤。

首先，需要向浏览器登记Service Worker。

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // 登记成功
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // 登记失败
    console.log('ServiceWorker registration failed: ', err);
  });
}
```

上面代码向浏览器登记`sw.js`脚本，实质就是浏览器加载`sw.js`。这段代码可以多次调用，浏览器会自行判断`sw.js`是否登记过，如果已经登记过，就不再重复执行了。

`sw.js`位于域名的根目录下，这表明这个Service worker的范围（scope）是整个域，即会接收整个域下面的`fetch`事件。如果脚本的路径是`/example/sw.js`，那么Service worker只对`/example/`开头的URL有效（比如`/example/page1/`、`/example/page2/`）。如果脚本不在根目录下，但是希望对整个域都有效，可以指定`scope`属性。

```javascript
navigator.serviceWorker.register('/path/to/serviceworker.js', {
  scope: '/'
});
```

一旦登记完成，这段脚本就会用户的浏览器之中长期存在，不会随着用户离开你的网站而消失。

登记成功后，可以在Chrome浏览器访问`chrome://inspect/#service-workers`，查看整个浏览器目前正在运行的Service worker。访问`chrome://serviceworker-internals`，可以查看浏览器目前安装的所有Service worker。

登记以后，浏览器就开始安装，也就是执行这个脚本，并将涉及的外部资源存入浏览器。

```javascript
var staticCacheName = 'static';
var version = 'v1::';

self.addEventListener('install', function (event) {
  event.waitUntil(updateStaticCache());
});

function updateStaticCache() {
  return caches.open(version + staticCacheName)
    .then(function (cache) {
      return cache.addAll([
        '/path/to/javascript.js',
        '/path/to/stylesheet.css',
        '/path/to/someimage.png',
        '/path/to/someotherimage.png',
        '/',
        '/offline'
      ]);
    });
};
```

上面代码将JavaScript脚本、CSS样式表、图像文件、网站首页、离线页面，存入浏览器缓存。这些资源都要等全部进入缓存之后，才会安装。

安装以后，就需要激活。

```javascript
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys
          .filter(function (key) {
            return key.indexOf(version) !== 0;
          })
          .map(function (key) {
            return caches.delete(key);
          })
        );
      })
  );
});
```

每一次浏览器向服务器要求一个文件的时候，就会触发`fetch`事件。Service worker可以在发出这个请求之前，前拦截它。

```javascript
self.addEventListener('fetch', function (event) {
  var request = event.request;
  ...
});
```

## 参考链接

- Matt West, [Using Web Workers to Speed-Up Your JavaScript Applications](http://blog.teamtreehouse.com/using-web-workers-to-speed-up-your-javascript-applications)
- Eric Bidelman, [The Basics of Web Workers](http://www.html5rocks.com/en/tutorials/workers/basics/)
- Eric Bidelman, [Transferable Objects: Lightning Fast!](http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast)
- Jesse Cravens, [Web Worker Patterns](http://tech.pro/tutorial/1487/web-worker-patterns)
- Bipin Joshi, [7 Things You Need To Know About Web Workers](http://www.developer.com/lang/jscript/7-things-you-need-to-know-about-web-workers.html)
- Jeremy Keith, [My first Service Worker](https://adactio.com/journal/9775)
