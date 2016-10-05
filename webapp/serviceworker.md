---
title: Service Worker
layout: page
category: webapp
date: 2016-08-14
modifiedOn: 2016-08-14
---

Service worker是一个指定网页在后台运行的服务进程。它有很多功能。

- 推送通知（push notification）
- 背景同步（background sync）
- 拦截和处理网络请求，管理服务器回应（response）的缓存

因此，Service worker可以提供离线体验，可以把它看作是一个可编程的网络代理，允许开发者控制页面的网络请求。

它有以下注意点。

- Service worker只支持HTTPS协议
- Service worker不能直接获取DOM，只能通过`postMessage`接口，与它控制的页面进行通信，然后由页面上的脚本获取DOM。
- Service worker不用的时候会关闭，需要的时候再重启，所以不能依赖它里面的全局状态。如果需要持久地保存一个值，Service worker可以用 IndexedDB API。

## 生命周期

Service worker有自己的生命周期。

首先，页面加载以后，需要使用页面里的脚本“登记”（register）Service worker。“登记”会触发浏览器开始在后台“安装”Service worker。

安装的时候，需要缓存一些静态资源。等到缓存成功，计算安装完毕了。如果有静态资源下载或者缓存失败，安装就会失败，Service worker就不会激活（activate），等到下次网页加载的时候，浏览器会再次尝试安装。如果安装成功，缓存里面就会有静态资源。

安装完成后，就是激活，这一步主要是处理以前旧的缓存。

激活成功后，Service worker就控制了页面。但是，Service worker必须等到用户第二次访问这个页面时才会生效。一旦生效，Service worker就只有两种状态：要么关闭（terminate），这样可以节省内存；要么就处理网络请求产生的各种事件。

Service worker脚本的生命周期。

该脚本接受的第一个事件是`install`。Service worker脚本一旦运行，就会触发这个事件，但是只会触发一次。可以使用这个事件，向缓存添加文件。

```javascript
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('static-v1').then(cache => cache.add('/cat.svg'))
  );
});
```

上面代码中，`install`事件的回调函数，会得到一个事件对象`event`作为参数。该对象的`waitUntil()`接受一个Promise对象作为参数，它的意思是直到这个Promise完成，`install`事件才算执行完成。如果Promise执行失败，浏览器就会抛弃Service worker脚本，不会让它控制客户端。

安装完成后，Service worker脚本的状态就变成了”active“。

```javascript
self.addEventListener('activate', event => {
  console.log('V1 now ready to handle fetches!');
});
```

如果要更新缓存，也是在`activate`事件里面完成。

```javascript
self.addEventListener('activate', event => {
  // 删除缓存里面已有的文件，就想当于更新缓存了
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('V2 now ready to handle fetches!');
    })
  );
});
```

激活以后，收到用户的请求，会先判断该网址是否已经存在于缓存之中。如果在，就从缓存之中取出。

```javascript
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin == location.origin && url.pathname == '/dog.svg') {
    event.respondWith(caches.match('/cat.svg'));
  }
});
```

上面代码中，如果用户请求`dog.svg`，则会返回`cat.svg`。注意，第一次加载网页的时候，用户看到的是`dog.svg`，再刷新才会看到`cat.svg`。

## register

登记是安装前的准备步骤。

```javascript
window.addEventListener('load', function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(initialiseState);
  } else {
    console.warn('Service workers aren\'t supported in this browser.');
  }
}
```

上面的代码先检查，浏览器是否支持`serviceWorker`，如果支持就用`register`方法加载Service worker的脚本，浏览器会自动判别该脚本是否登记过。`register`返回一个Promise对象。

这里需要注意，上面例子的Service Worker脚本放在域名的根目录下，这意味着这个脚本的作用域是整个域。这个域下面的任何变化，都会让Service Worker脚本收到`fetch`事件。如果Service worker脚本放在域名的子目录下，比如`/example/sw.js`，那么这个脚本只能接收到`/example/`开头的网址（比如`/example/page1/`、`/example/page2/`）下发生的变化。

登记以后，访问Chrome浏览器的`chrome://inspect/#service-workers`，可以看到Service Worker脚本的细节。

## 安装

Service worker脚本开始登记以后，脚本内部的代码就会收到`install`事件。

```javascript
self.addEventListener('install', function(event) {
  // Perform install steps
});
```

这个事件里面可以执行安装步骤。

1. 新建缓存对象
1. 缓存文件
1. 确认所有需要的静态资源是否都缓存了

```javascript
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
```

上面代码中，`caches.open()`新建了一个缓存区域，`cache.addAll()`方法将需要的静态资源加入这个缓存区域。这两个方法都返回Promise对象。`event.waitUntil()`方法接受一个Promise对象作为参数，用来知道整个操作花费了多少时间，以及是否成功。

如果所有静态资源全部成功缓存，安装就算成功了。如果有任何一个静态资源没有下载成功，安装步骤就失败了。所以，这一步可以定义所有需要的静态资源。需要注意的是，不宜缓存太多静态资源，因为下载的文件越多，安装步骤就越容易失败。

## fetch

Service worker安装以后，用户访问作用域之内的其他网页或刷新页面，Service worker脚本就会收到`fetch`事件。

```javascript
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如何缓冲之中包含这个静态资源，就返回它
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

上面代码中，Service worker脚本收到`fetch`事件以后，调用`event.respondWith()`方法，它接受一个Promise对象作为参数。这个Promise对象由`caches.match()`方法产生，这个方法检查客户端的请求，发现是否有缓存匹配这个请求。如果有的，就返回这个缓存，如果没有就去抓取这个静态资源。

## 参考链接

- [Introduction to Service Worker](https://developers.google.com/web/fundamentals/primers/service-worker/?hl=en), by Google
