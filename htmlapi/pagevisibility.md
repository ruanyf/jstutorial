---
title: Page Visibility API
layout: page
date: 2012-11-20
category: htmlapi
modifiedOn: 2013-09-26
---

## 简介

通常，我们使用各种事件，判断用户是否正在离开当前页面。

- visibilityState
- pageshow
- pagehide
- beforeunload
- unload

但是，手机浏览器往往不会触发这些事件，原因是浏览器进程会被突然关闭或者切换到后台，从而没有机会触发这些事件。常见的场景有以下这些。

- 用户点击了一条系统通知，切换到另一个 App。
- 用户进入任务切换窗口，切换到另一个 App。
- 用户点击了 Home 按钮，切换回主屏幕。
- 操作系统自动切换到另一个 App（比如，收到一个打入的电话）。

上面这些情况，都会导致浏览器进程切换到后台，也很可能会被操作系统自动终止，以便回收资源。 这使得`pagehide`、`beforeunload`、`unload`等事件根本不会触发。

这种情况下面，我们就要使用 Page Visibility API，判断页面是否可见。它可以保证会在手机浏览器得到执行。

```javascript
// 页面的 visibility 属性可能返回三种状态
// prerender，visible 和 hidden
let pageVisibility = document.visibilityState;

// 监听 visibility change 事件
document.addEventListener('visibilitychange', function() {
  // 页面变为不可见时触发
  if (document.visibilityState == 'hidden') { ... }

  // 页面变为可见时触发
  if (document.visibilityState == 'visible') { ... }
});
```

其他的用途还包括根据用户行为调整程序。比如，在轮询的情况下，如果页面处于当前窗口，可以每隔15秒向服务器请求数据；如果不处于当前窗口，则每隔几分钟请求一次数据。

实际开发中，为了防止某些浏览器不支持这个 API，最好同时监听`pagehide`事件，这样会比较保险。

## 属性

这个 API 部署在`document`对象上，提供以下两个属性。

- `document.hidden`：返回一个布尔值，表示当前是否被隐藏。
- `document.visibilityState`：表示页面当前的状态，可以取三个值。
  - visibile：页面可见
  - hidden：页面不可见
  - prerender：页面即将或正在渲染，不可见

## VisibilityChange 事件

页面的可见状态发生变化时，会触发`VisibilityChange`事件。

```javascript
document.addEventListener('visibilitychange', function () {
  console.log(document.visibilityState);
});
```

## 参考链接

- [W3草案](http://www.w3.org/TR/page-visibility/)
- David Walsh, [Page Visibility API](http://davidwalsh.name/page-visibility)
- Joe Marini, [Using the pageVisbility API](http://www.html5rocks.com/en/tutorials/pagevisibility/intro/)
- Jatinder Mann, [Using PC Hardware more efficiently in HTML5: New Web Performance APIs, Part 2](http://blogs.msdn.com/b/ie/archive/2011/07/08/using-pc-hardware-more-efficiently-in-html5-new-web-performance-apis-part-2.aspx)
- Ilya Grigorik，[Don't lose user and app state, use Page Visibility](https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/)

