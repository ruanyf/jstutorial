---
title: Performance API
category: bom
layout: page
date: 2013-09-26
modifiedOn: 2013-09-27
---

Performance API用于精确度量、控制、增强浏览器的性能表现。这个API为测量网站性能，提供以前没有办法做到的精度。

比如，为了得到脚本运行的准确耗时，需要一个高精度时间戳。传统的做法是使用Date对象的getTime方法。

```javascript

var start = new Date().getTime();

// do something here

var now = new Date().getTime();
var latency = now - start;
console.log("任务运行时间：" + latency);

```

上面这种做法有两个不足之处。首先，getTime方法（以及Date对象的其他方法）都只能精确到毫秒级别（一秒的千分之一），想要得到更小的时间差别就无能为力了；其次，这种写法只能获取代码运行过程中的时间进度，无法知道一些后台事件的时间进度，比如浏览器用了多少时间从服务器加载网页。

为了解决这两个不足之处，ECMAScript 5引入“高精度时间戳”这个API，部署在performance对象上。它的精度可以达到1毫秒的千分之一（1秒的百万分之一），这对于衡量的程序的细微差别，提高程序运行速度很有好处，而且还可以获取后台事件的时间进度。

目前，所有主要浏览器都已经支持performance对象，包括Chrome 20+、Firefox 15+、IE 10+、Opera 15+。

## performance.timing对象

performance对象的timing属性指向一个对象，它包含了各种与浏览器性能有关的时间数据，提供浏览器处理网页各个阶段的耗时。比如，performance.timing.navigationStart就是浏览器处理当前网页的启动时间。

```javascript

Date.now() - performance.timing.navigationStart
// 13260687

```

上面代码表示距离浏览器开始处理当前网页，已经过了13260687毫秒。

下面是另一个例子。

```javascript
var t = performance.timing;
var pageloadtime = t.loadEventStart - t.navigationStart;
var dns = t.domainLookupEnd - t.domainLookupStart;
var tcp = t.connectEnd - t.connectStart;
var ttfb = t.responseStart - t.navigationStart;
```

上面代码依次得到页面加载的耗时、域名解析的耗时、TCP连接的耗时、读取页面第一个字节之前的耗时。

performance.timing对象包含以下属性（全部为只读）：

- **navigationStart**：当前浏览器窗口的前一个网页关闭，发生unload事件时的Unix毫秒时间戳。如果没有前一个网页，则等于fetchStart属性。

- **unloadEventStart**：如果前一个网页与当前网页属于同一个域名，则返回前一个网页的unload事件发生时的Unix毫秒时间戳。如果没有前一个网页，或者之前的网页跳转不是在同一个域名内，则返回值为0。

- **unloadEventEnd**：如果前一个网页与当前网页属于同一个域名，则返回前一个网页unload事件的回调函数结束时的Unix毫秒时间戳。如果没有前一个网页，或者之前的网页跳转不是在同一个域名内，则返回值为0。

- **redirectStart**：返回第一个HTTP跳转开始时的Unix毫秒时间戳。如果没有跳转，或者不是同一个域名内部的跳转，则返回值为0。

- **redirectEnd**：返回最后一个HTTP跳转结束时（即跳转回应的最后一个字节接受完成时）的Unix毫秒时间戳。如果没有跳转，或者不是同一个域名内部的跳转，则返回值为0。

- **fetchStart**：返回浏览器准备使用HTTP请求读取文档时的Unix毫秒时间戳。该事件在网页查询本地缓存之前发生。

- **domainLookupStart**：返回域名查询开始时的Unix毫秒时间戳。如果使用持久连接，或者信息是从本地缓存获取的，则返回值等同于fetchStart属性的值。

- **domainLookupEnd**：返回域名查询结束时的Unix毫秒时间戳。如果使用持久连接，或者信息是从本地缓存获取的，则返回值等同于fetchStart属性的值。

- **connectStart**：返回HTTP请求开始向服务器发送时的Unix毫秒时间戳。如果使用持久连接（persistent connection），则返回值等同于fetchStart属性的值。

- **connectEnd**：返回浏览器与服务器之间的连接建立时的Unix毫秒时间戳。如果建立的是持久连接，则返回值等同于fetchStart属性的值。连接建立指的是所有握手和认证过程全部结束。

- **secureConnectionStart**：返回浏览器与服务器开始安全链接的握手时的Unix毫秒时间戳。如果当前网页不要求安全连接，则返回0。

- **requestStart**：返回浏览器向服务器发出HTTP请求时（或开始读取本地缓存时）的Unix毫秒时间戳。

- **responseStart**：返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的Unix毫秒时间戳。

- **responseEnd**：返回浏览器从服务器收到（或从本地缓存读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭时）的Unix毫秒时间戳。

- **domLoading**：返回当前网页DOM结构开始解析时（即Document.readyState属性变为“loading”、相应的readystatechange事件触发时）的Unix毫秒时间戳。

- **domInteractive**：返回当前网页DOM结构结束解析、开始加载内嵌资源时（即Document.readyState属性变为“interactive”、相应的readystatechange事件触发时）的Unix毫秒时间戳。

- **domContentLoadedEventStart**：返回当前网页DOMContentLoaded事件发生时（即DOM结构解析完毕、所有脚本开始运行时）的Unix毫秒时间戳。

- **domContentLoadedEventEnd**：返回当前网页所有需要执行的脚本执行完成时的Unix毫秒时间戳。

- **domComplete**：返回当前网页DOM结构生成时（即Document.readyState属性变为“complete”，以及相应的readystatechange事件发生时）的Unix毫秒时间戳。

- **loadEventStart**：返回当前网页load事件的回调函数开始时的Unix毫秒时间戳。如果该事件还没有发生，返回0。

- **loadEventEnd**：返回当前网页load事件的回调函数运行结束时的Unix毫秒时间戳。如果该事件还没有发生，返回0。

根据上面这些属性，可以计算出网页加载各个阶段的耗时。比如，网页加载整个过程的耗时的计算方法如下：

```javascript

var t = performance.timing; 
var pageLoadTime = t.loadEventEnd - t.navigationStart;

```

## performance.now()

`performance.now()`方法返回当前网页自从`performance.timing.navigationStart`到当前时间之间的毫秒数。

{% highlight javascript %}

performance.now()
// 23493457.476999998

Date.now() - (performance.timing.navigationStart + performance.now())
// -0.64306640625

{% endhighlight %}

上面代码表示，performance.timing.navigationStart加上performance.now()，近似等于Date.now()，也就是说，Date.now()可以替代performance.now()。但是，由于`performance.now()`带有小数，因此精度更高。

通过两次调用`performance.now()`方法，可以得到间隔的准确时间，用来衡量某种操作的耗时。

{% highlight javascript %}

var start = performance.now();
doTasks();
var end = performance.now();

console.log('耗时：' + (end - start) + '毫秒。');

{% endhighlight %}

## performance.mark()

mark方法用于为相应的视点做标记。

{% highlight javascript %}

window.performance.mark('mark_fully_loaded');

{% endhighlight %}

clearMarks方法用于清除标记，如果不加参数，就表示清除所有标记。

{% highlight javascript %}

window.peformance.clearMarks('mark_fully_loaded');

window.performance.clearMarks();

{% endhighlight %}

## performance.getEntries()

浏览器获取网页时，会对网页中每一个对象（脚本文件、样式表、图片文件等等）发出一个HTTP请求。performance.getEntries方法以数组形式，返回这些请求的时间统计信息，有多少个请求，返回数组就会有多少个成员。

由于该方法与浏览器处理网页的过程相关，所以只能在浏览器中使用。

```javascript

window.performance.getEntries()[0]

// PerformanceResourceTiming { 
//   responseEnd: 4121.6200000017125, 
//   responseStart: 4120.0690000005125, 
//   requestStart: 3315.355000002455, 
//   ...
// }

```

上面代码返回第一个HTTP请求（即网页的HTML源码）的时间统计信息。该信息以一个高精度时间戳的对象形式返回，每个属性的单位是毫秒（milliseconds)。

## performance.navigation对象

除了时间信息，performance还可以提供一些用户行为信息，主要都存放在performance.navigation对象上面。

它有两个属性：

**（1）performance.navigation.type**

该属性返回一个整数值，表示网页的加载来源，可能有以下4种情况：

- **0**：网页通过点击链接、地址栏输入、表单提交、脚本操作等方式加载，相当于常数performance.navigation.TYPE_NAVIGATENEXT。

- **1**：网页通过“重新加载”按钮或者location.reload()方法加载，相当于常数performance.navigation.TYPE_RELOAD。

- **2**：网页通过“前进”或“后退”按钮加载，相当于常数performance.navigation.TYPE_BACK_FORWARD。

- **255**：任何其他来源的加载，相当于常数performance.navigation.TYPE_UNDEFINED。

**（2）performance.navigation.redirectCount**

该属性表示当前网页经过了多少次重定向跳转。

## 参考链接

- Mozilla Developer Network, [Navigation Timing](https://developer.mozilla.org/en-US/docs/Navigation_timing)
- W3C, [Navigation Timing](http://www.w3.org/TR/navigation-timing/)
- W3C, [HTML5, A vocabulary and associated APIs for HTML and XHTML](http://www.w3.org/TR/html5/browsers.html)
- Matt West, [Timing JavaScript Code with High Resolution Timestamps](http://blog.teamtreehouse.com/timing-javascript-code-high-resolution-timestamps)
