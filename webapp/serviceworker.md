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

## register

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
