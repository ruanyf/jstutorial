---
title: Web Worker
layout: page
category: htmlapi
date: 2013-01-25
modifiedOn: 2013-08-10
---

## 概述

JavaScript语言采用的是单线程模型，也就是说，所有任务排成一个队列，一次只能做一件事。随着电脑计算能力的增强，尤其是多核CPU的出现，这一点带来很大的不便，无法充分发挥JavaScript的潜力。

Web Worker的目的，就是为JavaScript创造多线程环境，允许主线程将一些任务分配给子线程。在主线程运行的同时，子线程在后台运行，两者互不干扰。等到子线程完成计算任务，再把结果返回给主线程。因此，每一个子线程就好像一个“工人”（worker），默默地完成自己的工作。这样做的好处是，一些高计算量或高延迟的工作，被worker线程负担了，所以主进程（通常是UI进程）就会很流畅，不会被阻塞或拖慢。

Worker线程分成好几种。

- 普通的Worker：只能与创造它们的主进程通信。
- Shared Worker：能被所有同源的进程获取（比如来自不同的浏览器窗口、iframe窗口和其他Shared worker），它们必须通过一个端口通信。
- ServiceWorker：实际上是一个在网络应用与浏览器或网络层之间的代理层。它可以拦截网络请求，使得离线访问成为可能。

Web Worker有以下几个特点：

- **同域限制**。子线程加载的脚本文件，必须与主线程的脚本文件在同一个域。

- **DOM限制**。子线程所在的全局对象，与主进程不一样，它无法读取网页的DOM对象，即`document`、`window`、`parent`这些对象，子线程都无法得到。（但是，`navigator`对象和`location`对象可以获得。）

- **脚本限制**。子线程无法读取网页的全局变量和函数，也不能执行alert和confirm方法，不过可以执行setInterval和setTimeout，以及使用XMLHttpRequest对象发出AJAX请求。

- **文件限制**。子线程无法读取本地文件，即子线程无法打开本机的文件系统（file://），它所加载的脚本，必须来自网络。

使用之前，检查浏览器是否支持这个API。

```javascript
if (window.Worker) {
  // 支持
} else {
  // 不支持
}
```

## 新建和启动子线程

主线程采用`new`命令，调用`Worker`构造函数，可以新建一个子线程。

```javascript
var worker = new Worker('work.js');
```

Worker构造函数的参数是一个脚本文件，这个文件就是子线程所要完成的任务，上面代码中是`work.js`。由于子线程不能读取本地文件系统，所以这个脚本文件必须来自网络端。如果下载没有成功，比如出现404错误，这个子线程就会默默地失败。

子线程新建之后，并没有启动，必需等待主线程调用`postMessage`方法，即发出信号之后才会启动。`postMessage`方法的参数，就是主线程传给子线程的信号。它可以是一个字符串，也可以是一个对象。

```javascript
worker.postMessage("Hello World");
worker.postMessage({method: 'echo', args: ['Work']});
```

只要符合父线程的同源政策，Worker线程自己也能新建Worker线程。Worker线程可以使用XMLHttpRequest进行网络I/O，但是`XMLHttpRequest`对象的`responseXML`和`channel`属性总是返回`null`。

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

## 实例：Worker 进程完成论询

有时，浏览器需要论询服务器状态，以便第一时间得知状态改变。这个工作可以放在 Worker 进程里面。

```javascript
var pollingWorker = createWorker(function (e) {
  var cache;

  function compare(new, old) { ... };

  var myRequest = new Request('/my-api-endpoint');

  setInterval(function () {
    fetch('/my-api-endpoint').then(function (res) {
      var data = res.json();

      if(!compare(res.json(), cache)) {
        cache = data;

        self.postMessage(data);
      }
    })
  }, 1000)
});

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init');
```

## Service Worker

Service worker是一个在浏览器后台运行的脚本，与网页不相干，专注于那些不需要网页或用户互动就能完成的功能。它主要用于操作离线缓存。

Service Worker有以下特点。

- 属于JavaScript Worker，不能直接接触DOM，通过`postMessage`接口与页面通信。
- 不需要任何页面，就能执行。
- 不用的时候会终止执行，需要的时候又重新执行，即它是事件驱动的。
- 有一个精心定义的升级策略。
- 只在HTTPs协议下可用，这是因为它能拦截网络请求，所以必须保证请求是安全的。
- 可以拦截发出的网络请求，从而控制页面的网路通信。
- 内部大量使用Promise。

Service worker的常见用途。

- 通过拦截网络请求，使得网站运行得更快，或者在离线情况下，依然可以执行。
- 作为其他后台功能的基础，比如消息推送和背景同步。

使用Service Worker有以下步骤。

首先，需要向浏览器登记Service Worker。

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
    // 登记成功
    console.log('ServiceWorker登记成功，范围为', registration.scope);
    }).catch(function(err) {
    // 登记失败
      console.log('ServiceWorker登记失败：', err);
    });
}
```

上面代码向浏览器登记`sw.js`脚本，实质就是浏览器加载`sw.js`。这段代码可以多次调用，浏览器会自行判断`sw.js`是否登记过，如果已经登记过，就不再重复执行了。注意，Service worker脚本必须与页面在同一个域，且必须在HTTPs协议下正常运行。

`sw.js`位于域名的根目录下，这表明这个Service worker的范围（scope）是整个域，即会接收整个域下面的`fetch`事件。如果脚本的路径是`/example/sw.js`，那么Service worker只对`/example/`开头的URL有效（比如`/example/page1/`、`/example/page2/`）。如果脚本不在根目录下，但是希望对整个域都有效，可以指定`scope`属性。

```javascript
navigator.serviceWorker.register('/path/to/serviceworker.js', {
  scope: '/'
});
```

一旦登记完成，这段脚本就会用户的浏览器之中长期存在，不会随着用户离开你的网站而消失。

`.register`方法返回一个Promise对象。

登记成功后，浏览器执行下面步骤。

1. 下载资源（Download）
2. 安装（Install）
3. 激活（Activate）

安装和激活，主要通过事件来判断。

```javascript
self.addEventListener('install', function(event) {
  event.waitUntil(
    fetchStuffAndInitDatabases()
  );
});

self.addEventListener('activate', function(event) {
  // You're good to go!
});
```

Service worker一旦激活，就开始控制页面。网页加载的时候，可以选择一个Service worker作为自己的控制器。不过，页面第一次加载的时候，它不受Service worker控制，因为这时还没有一个Service worker在运行。只有重新加载页面后，Service worker才会生效，控制加载它的页面。

你可以查看`navigator.serviceWorker.controller`，了解当前哪个ServiceWorker掌握控制权。如果后台没有任何Service worker，`navigator.serviceWorker.controller`返回`null`。

Service worker激活以后，就能监听`fetch`事件。

```javascript
self.addEventListener('fetch', function(event) {
  console.log(event.request);
});
```

`fetch`事件会在两种情况下触发。

- 用户访问Service worker范围内的网页。
- 这些网页发出的任何网络请求（页面本身、CSS、JS、图像、XHR等等），即使这些请求是发向另一个域。但是，`iframe`和`<object>`标签发出的请求不会被拦截。

`fetch`事件的`event`对象的`request`属性，返回一个对象，包含了所拦截的网络请求的所有信息，比如URL、请求方法和HTTP头信息。

Service worker的强大之处，在于它会拦截请求，并会返回一个全新的回应。

```javascript
self.addEventListener('fetch', function(event) {
  event.respondWith(new Response("Hello world!"));
});
```

`respondWith`方法的参数是一个Response对象实例，或者一个Promise对象（resolved以后返回一个Response实例）。上面代码手动创造一个Response实例。

下面是完整的[代码](https://github.com/jakearchibald/isserviceworkerready/tree/gh-pages/demos/manual-response)。

先看网页代码`index.html`。

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      white-space: pre-line;
      font-family: monospace;
      font-size: 14px;
    }
  </style>
</head>
<body><script>
    function log() {
      document.body.appendChild(document.createTextNode(Array.prototype.join.call(arguments, ", ") + '\n'));
      console.log.apply(console, arguments);
    }
    window.onerror = function(err) {
      log("Error", err);
    };
    navigator.serviceWorker.register('sw.js', {
      scope: './'
    }).then(function(sw) {
      log("Registered!", sw);
      log("You should get a different response when you refresh");
    }).catch(function(err) {
      log("Error", err);
    });
  </script></body>
</html>
```

然后是Service worker脚本`sw.js`。

```javascript
// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
console.log("SW startup");

self.addEventListener('install', function(event) {
  console.log("SW installed");
});

self.addEventListener('activate', function(event) {
  console.log("SW activated");
});

self.addEventListener('fetch', function(event) {
  console.log("Caught a fetch!");
  event.respondWith(new Response("Hello world!"));
});
```

每一次浏览器向服务器要求一个文件的时候，就会触发`fetch`事件。Service worker可以在发出这个请求之前，前拦截它。

```javascript
self.addEventListener('fetch', function (event) {
  var request = event.request;
  ...
});
```

实际应用中，我们使用`fetch`方法去抓取资源，该方法返回一个Promise对象。

```javascript
self.addEventListener('fetch', function(event) {
  if (/\.jpg$/.test(event.request.url)) {
    event.respondWith(
      fetch('//www.google.co.uk/logos/example.gif', {
        mode: 'no-cors'
      })
    );
  }
});
```

上面代码中，如果网页请求JPG文件，就会被Service worker拦截，转而返回一个Google的Logo图像。`fetch`方法默认会加上CORS信息头，，上面设置了取消这个头。

下面的代码是一个将所有JPG、PNG图片请求，改成WebP格式返回的例子。

```javascript
"use strict";

// Listen to fetch events
self.addEventListener('fetch', function(event) {

  // Check if the image is a jpeg
  if (/\.jpg$|.png$/.test(event.request.url)) {
    // Inspect the accept header for WebP support
    var supportsWebp = false;
    if (event.request.headers.has('accept')){
      supportsWebp = event.request.headers.get('accept').includes('webp');
    }

    // If we support WebP
    if (supportsWebp) {
      // Clone the request
      var req = event.request.clone();
      // Build the return URL
      var returnUrl = req.url.substr(0, req.url.lastIndexOf(".")) + ".webp";
      event.respondWith(fetch(returnUrl, {
        mode: 'no-cors'
      }));
    }
  }
});
```

如果请求失败，可以通过Promise的`catch`方法处理。

```javascript
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return new Response("Request failed!");
    })
  );
});
```

登记成功后，可以在Chrome浏览器访问`chrome://inspect/#service-workers`，查看整个浏览器目前正在运行的Service worker。访问`chrome://serviceworker-internals`，可以查看浏览器目前安装的所有Service worker。

一个已经登记过的Service worker脚本，如果发生改动，浏览器就会重新安装，这被称为“升级”。

Service worker有一个Cache API，用来缓存外部资源。

```javascript
self.addEventListener('install', function(event) {
  // pre cache a load of stuff:
  event.waitUntil(
    caches.open('myapp-static-v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/styles/all.css',
        '/styles/imgs/bg.png',
        '/scripts/all.js'
      ]);
    })
  )
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
```

上面代码中，`caches.open`方法用来建立缓存，然后使用`addAll`方法添加资源。`caches.match`方法则用来建立缓存以后，匹配当前请求是否在缓存之中，如果命中就取出缓存，否则就正常发出这个请求。一旦一个资源进入缓存，它原来指定是否过期的HTTP信息头，就会被忽略。缓存之中的资源，只在你移除它们的时候，才会被移除。

单个资源可以使用`cache.put(request, response)`方法添加。

下面是一个在安装阶段缓存资源的例子。

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

## 参考链接

- Matt West, [Using Web Workers to Speed-Up Your JavaScript Applications](http://blog.teamtreehouse.com/using-web-workers-to-speed-up-your-javascript-applications)
- Eric Bidelman, [The Basics of Web Workers](http://www.html5rocks.com/en/tutorials/workers/basics/)
- Eric Bidelman, [Transferable Objects: Lightning Fast!](http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast)
- Jesse Cravens, [Web Worker Patterns](http://tech.pro/tutorial/1487/web-worker-patterns)
- Bipin Joshi, [7 Things You Need To Know About Web Workers](http://www.developer.com/lang/jscript/7-things-you-need-to-know-about-web-workers.html)
- Jeremy Keith, [My first Service Worker](https://adactio.com/journal/9775)
- Alex Russell, [ServiceWorker](https://github.com/slightlyoff/ServiceWorker)
