---
title: Service Worker
layout: page
category: webapp
date: 2016-08-14
modifiedOn: 2016-08-14
---

## Service worker 是什么？

Service worker 是一个指定网页在后台运行的服务进程。它有很多功能。

- 推送通知（push notification）
- 背景同步（background sync）
- 拦截和处理网络请求，管理服务器回应（response）的缓存

因此，Service worker 可以提供离线体验，可以把它看作是一个可编程的网络代理，允许开发者控制页面的网络请求。

它有以下注意点。

- Service worker 只支持 HTTPS 协议
- Service worker 不能直接获取 DOM，只能通过`postMessage`接口，与它控制的页面进行通信，然后由页面上的脚本获取 DOM。
- Service worker 不用的时候会关闭，需要的时候再重启，所以不能依赖它里面的全局状态。如果需要持久地保存一个值，Service worker 可以用 IndexedDB API。

Service Worker 的运行过程如下。

（1）主页面加载以后，第一步需要“登记”（register）Service worker 脚本。

（2）“登记”会触发浏览器开始在后台“安装” Service worker。安装的时候，需要缓存一些静态资源。等到缓存成功，就算安装完毕了。如果有静态资源下载或者缓存失败，安装就会失败，Service worker就不会激活（activate），等到下次网页加载的时候，浏览器会再次尝试安装。如果安装成功，缓存里面就会有静态资源。

（3）安装完成后，就是激活，这一步主要是处理以前旧的缓存。

（4）激活成功后，Service Worker 就控制了页面。但是，Service Worker 必须等到用户第二次访问这个页面时才会生效。一旦生效，Service worker 就只有两种状态：要么关闭（terminate），这样可以节省内存；要么就处理网络请求产生的各种事件。

## 主页面

网站的主页面（比如`index.html`）需要登记 Service Worker。登记是安装前的准备步骤。

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

这里需要注意，上面例子的 Service Worker 脚本放在域名的根目录下，这意味着这个脚本的作用域是整个域。这个域下面的任何变化，都会让Service Worker脚本收到`fetch`事件。如果Service worker脚本放在域名的子目录下，比如`/example/sw.js`，那么这个脚本只能接收到`/example/`开头的网址（比如`/example/page1/`、`/example/page2/`）下发生的变化。

登记以后，访问Chrome浏览器的`chrome://inspect/#service-workers`，可以看到Service Worker脚本的细节。

## Service Worker 脚本

Service Worker 脚本采用事件监听的写法。最重要的两个事件是`install`和`fetch`，前者指将静态资源“安装”到本地缓存，后者指用户读取某个已经缓存的静态资源。

### install 事件

Service Worker 脚本接受的第一个事件是`install`。Service worker 脚本一旦运行，就会触发这个事件，但是只会触发一次。可以使用这个事件，向缓存添加文件。

```javascript
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('static-v1')
    .then(cache => cache.add('/cat.svg'))
    .then(function() {
      console.log('成功! App 离线可用!');
    })
  );
});
```

上面代码中，`install`事件的回调函数，会得到一个事件对象`event`作为参数。`event.waitUntil()`方法接受一个 Promise 对象作为参数，这个 Promise 定义了需要安装哪些文件作为缓存。一旦这个 Promise 变为`resolved`，`install`事件才算执行完成。如果变为`rejected`，浏览器就会抛弃这个 Service Worker 脚本，不会让它继续运行（如果这时还有老版本的缓存在运行，那么老版本的缓存将完全不受影响）。

如果所有静态资源全部成功缓存，安装就算成功了。如果有任何一个静态资源没有下载成功，安装步骤就失败了。所以，这一步可以定义所有需要的静态资源。需要注意的是，不宜缓存太多静态资源，因为下载的文件越多，安装步骤就越容易失败。

下面是另一个例子。

```javascript
const caches = [
  '/css/whatever-v3.css',
  '/css/imgs/sprites-v6.png',
  '/css/fonts/whatever-v8.woff',
  '/js/all-min-v4.js'
  // etc
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('mysite-static-v3').then(function(cache) {
      return cache.addAll(caches);
    })
  );
});
```

`caches.open`和`cache.addAll`方法都返回 Promise 对象。只要有一个缓存文件获取失败，那么整个 Promise 对象将变为`rejected`。

有些缓存文件可能不是立刻需要的，但是因为体积较大，所以希望能够早点开始下载。这时，如果等这些文件下载结束，再完成`Install`事件，就太影响效率了。举例来说，现在要将游戏的关卡文件加入缓存，第1关到第10关需要立刻安装，第11关到第20关也可以同时下载，但不要影响`install`的完成，这时可以写成下面这样。

```javascript
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('mygame-core-v1').then(function(cache) {
      cache.addAll(
        // 第11-20关
      );
      return cache.addAll(
        // 第1-10关
      );
    })
  );
});
```

上面代码中，第1关到第10关下载完成后，`install`就完成了。这时，第11关到第20关有可能下载完成，也有可能还在下载。但是，这种写法有一个问题，等到第11关到第20关下载完成时，Service Worker有可能已经停止运行了，这时这些下载的文件是无法安装进缓存的，等于白白下载了。

### active 事件

缓存文件安装完成后，旧版的缓存失效，新版的缓存开始生效，这时 Service Worker 脚本的状态就变成了”active“。

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

### fetch 事件

Service Worker 激活以后，用户访问作用域之内的其他网页或刷新页面，Service worker 脚本就会收到`fetch`事件，即用户的请求会先被 Service Worker 处理。Service Worker 会先判断该网址是否已经存在于缓存之中。

```javascript
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // 试着从缓存中获取
    caches.match(event.request)
    .then(function(response) {
      // 如果资源没有存储在缓存中，就回退到网络，
      // 向互联网发出该请求
      return response || fetch(event.request);
    })
  );
});
```

上面代码中，Service Worker 脚本收到`fetch`事件以后，调用`event.respondWith()`方法，它接受一个 Promise 对象作为参数。这个 Promise 对象由`caches.match()`方法产生，这个方法检查客户端的请求，发现是否有缓存匹配这个请求。如果有的，就返回这个缓存，如果没有就去抓取这个静态资源。

下面是另一个例子。

```javascript
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin == location.origin && url.pathname == '/dog.svg') {
    event.respondWith(caches.match('/cat.svg'));
  }
});
```

上面代码中，如果用户请求`dog.svg`，则会返回`cat.svg`。注意，第一次加载网页的时候，用户看到的是`dog.svg`，再刷新才会看到`cat.svg`。

## 参考链接

- [The offline cookbook](https://jakearchibald.com/2014/offline-cookbook/), by Jake Archibald
- [Introduction to Service Worker](https://developers.google.com/web/fundamentals/primers/service-worker/?hl=en), by Google
