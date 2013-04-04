---
title: 移动端开发
layout: page
category: tool
date: 2013-01-12
modifiedOn: 2013-04-04
---

## 模拟手机视口（viewport）

chrome浏览器的开发者工具，提供一个选项，可以模拟手机屏幕的显示效果。

打开“设置”的Overrides面板，选择相应的User Agent和Device Metrics选项。

![选择User Agent](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation/image_3.png)

User Agent可以使得当前浏览器发出手机浏览器的Agent字符串，Device Metrics则使得当前浏览器的视口变为手机的视口大小。这两个选项可以独立选择，不一定同时选中。

## 模拟touch事件

我们可以在PC端模拟JavaScript的touch事件。

首先，打开chrome浏览器的开发者工具，选择“设置”中的Overrides面板，勾选“Enable touch events”选项。

![Enable touch events的图片](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation/image_0.png)

然后，鼠标就会触发touchstart、touchmove和touchend事件。（此时，鼠标本身的事件依然有效。）

至于多点触摸，必须要有支持这个功能的设备才能模拟，具体可以参考[Multi-touch web development](http://www.html5rocks.com/en/mobile/touch/)。

## 模拟经纬度

chrome浏览器的开发者工具，还可以模拟当前的经纬度数据。打开“设置”的Overrides面板，选中Override Geolocation选项，并填入相应经度和纬度数据。

![模拟经纬度](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation/image_11.png)

## 远程除错

(1) Chrome for Android

Android设备上的Chrome浏览器支持USB除错。PC端需要安装Android SDK和Chrome浏览器，然后用usb线将手机和PC连起来，可参考[官方文档](https://developers.google.com/chrome-developer-tools/docs/remote-debugging)。

(2) Opera

Opera浏览器的除错环境Dragonfly支持远程除错（[教程](http://www.codegeek.net/blog/2012/mobile-debugging-with-opera-dragonfly/)）。

(3) Firefox for Android 

参考[官方文档](https://hacks.mozilla.org/2012/08/remote-debugging-on-firefox-for-android/)。

(4) Safari on iOS6

你可以使用Mac桌面电脑的Safari 6浏览器，进行远程除错（[教程](http://www.mobilexweb.com/blog/iphone-5-ios-6-html5-developers)）。 

## 工具

- [JSconsole.com](http://jsconsole.com/)
- [Aardwolf](http://lexandera.com/aardwolf/)
		
## 参考链接

- Addy Osmani, [The Current State Of Remote Debugging For Mobile](https://plus.google.com/115133653231679625609/posts/Px3bQdQ2HDu)
- Chrome Developer Tools, [Mobile Emulation](https://developers.google.com/chrome-developer-tools/docs/mobile-emulation)
- John McCutchan, [Profiling Mobile HTML5 Apps With Chrome DevTools](http://www.html5rocks.com/en/mobile/profiling/)
