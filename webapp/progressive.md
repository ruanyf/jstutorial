---
title: Progressive Web App
layout: page
category: webapp
date: 2016-08-14
modifiedOn: 2016-08-14
---

渐进式Web应用（progressive Web App）是谷歌2005年提出的方案，主要目的是为了让Web App能具有原生应用的性能。

它可以达到系统安装、离线使用、系统通知等正常的网页应用不具有的功能。

- 网页可以像原生应用那样，在主屏显示一个图标，点击后会有一个网站名称的标志页，然后直接打开该网页，且不显示浏览器菜单栏。
- 可以在状态栏弹出提示。
- 可以利用缓存，达到离线使用的目的。

它主要用到了三种技术。

- Service worker
- 浏览器缓存
- Push API

它要求必须使用HTTPS协议。

## Web App Manifest

Manifest主要用于让Web App可以添加到桌面，告诉浏览器启动哪个文件，以及如何启动（全屏还是在浏览器窗口），以及在桌面如何显示图标。用户可以通过安卓系统的Chrome浏览器菜单中的“添加到主屏幕”选项，让网页拥有一个像原生App那样的图标，在主屏上显示。1网页之中必须有一个`link`元素，指向manifest文件（大多数人使用`manifest.json`这个名字）。

```html
<link rel="manifest" href="/manifest.json">
```

Manifest是一个JSON文件，它有[国际标准](https://w3c.github.io/manifest/)。有了它，就可以像原生App那样，全屏使用Web App，并且可以安装，还能分配图标。

Android系统会对具备以下条件的Web应用，显示[安装提示](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android)，询问用户是否要在桌面添加图标。

- 具有Manifest配置文件
- 使用HTTPS协议
- 登记了至少一个service worker
- 被访问了两次，相隔至少5分钟

Manifest文件主要有以下字段。

- `short_name`：安装时显示的应用名
- `start_url`：启动路径（比如`/`或`index.html`），如果省略将使用网页的URL
- `icons`：至少指定一个`144x144`的PNG格式图标，并且必须`image/png`的类型说明
- `display`：是否全屏
- `orientation`：启动时展示的方向，`portrait`表示竖屏显示，`landscape`表示横屏显示

下面是Manifest文件的一个例子。

```javascript
{
  "short_name": "Kinlan's Amaze App",
  "name": "Kinlan's Amazing Application ++",
  "icons": [
    {
      "src": "launcher-icon-2x.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "launcher-icon-3x.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "launcher-icon-4x.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "start_url": "/index.html",
  "display": "standalone",
  "orientation": "landscape"
}
```

Chrome允许用户监听`beforeinstallprompt`，取消安装提示。

```javascript
window.addEventListener('beforeinstallprompt', function(e) {
  console.log('beforeinstallprompt Event fired');
  e.preventDefault();
  return false;
});
```

`beforeinstallprompt`事件会返回一个叫做`userChoice`的Promise对象，一旦用户做出反应，这个Promise的状态就会`resolve`。它的返回值的`outcome`属性，如果等于`dismissed`就说明用户没有安装，如果等于`accepted`就说明用户已经安装。

```javascript
window.addEventListener('beforeinstallprompt', function (e) {
  e.userChoice.then(function (choiceResult) {
    if(choiceResult.outcome === 'dismissed') {
      console.log('User cancelled home screen install');
    } else {
      console.log('User added to home screen');
    }
  });
});
```

## Service Worker

Service worker的作用是缓存静态资源，供以后离线时调用，或者没有网络时，提示用户需要连接网络。

```javascript
// Register the service worker if available.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
        console.log('Successfully registered service worker', reg);
    }).catch(function(err) {
        console.warn('Error whilst registering service worker', err);
    });
}

window.addEventListener('online', function(e) {
  console.log("You are online");
  hideOfflineWarning();
  loadData();
}, false);

window.addEventListener('offline', function(e) {
  console.log("You are offline");
  showOfflineWarning();
}, false);

// Check if the user is connected.
if (navigator.onLine) {
  loadData();
} else {
  showOfflineWarning();
}
```

Service worker通过事件进行通信。

- `install`事件：安装阶段才会触发一次，以后刷新并不会重新触发。
- `online`事件：用户从离线变成上线
- `offline`事件：用户从上线变成离线
- `fetch`事件：用户从互联网获取资源

下面代码定义了`install`事件和`fetch`事件。

```javascript
// 定义缓存版本
var cacheName = 'v1:static';

// install事件时，缓存静态资源
self.addEventListener('install', function(e) {
  // 一旦service worker的安装完成，开始抓取并缓存静态资源
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        './',
        './css/style.css',
        './js/build/script.min.js',
        './js/build/vendor.min.js',
        './css/fonts/roboto.woff',
        './offline.html'
      ]).then(function () {
        self.skipWaiting();
      });
    })
  );
});

// 抓取静态资源的回调函数
self.addEventListener('fetch', function(event) {
  // 判断是从缓存中取出，还是从网上抓取
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        // 从缓存中取出
        return response;
      }
        // 从网上抓取
        return fetch(event.request);
      })
    );
});
```

## Push API

Push API主要用于接收服务器推送（push）的消息。网页必须有一个激活的Service Worker，这个API才会生效。因为推送过来的时候，这个Service Worker在后台运行，可以接收到消息。

## 参考链接

- [A Beginner’s Guide To Progressive Web Apps](https://www.smashingmagazine.com/2016/08/a-beginners-guide-to-progressive-web-apps/), by Kevin Farrugia
- [Push Notifications on the Open Web](https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web), by Google

