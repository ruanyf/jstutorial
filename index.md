---
layout: homepage
title: JavaScript 标准参考教程（alpha）
date: 2012-11-18
modifiedOn: 2014-05-18
---

<h2 id="introduction">导论与历史</h2>

- [导论](introduction/intro.html)
- [JavaScript的历史](introduction/history.html)

<h2 id="grammar">基本语法</h2>

- [概述](grammar/basic.html)
- [数值](grammar/number.html)
- [字符串](grammar/string.html)
- [对象](grammar/object.html)
- [数组](grammar/array.html)
- [函数](grammar/function.html)
- [运算符](grammar/operator.html)
- [数据类型转换](grammar/conversion.html)
- [错误处理机制](grammar/error.html)
- [编程风格](grammar/style.html)

<h2 id="stdlib">标准库</h2>

- [Object对象](stdlib/object.html)
- [Array 对象](stdlib/array.html)
- [包装对象和Boolean对象](stdlib/wrapper.html)
- [Number对象](stdlib/number.html)
- [String对象](stdlib/string.html)
- [Math对象](stdlib/math.html)
- [Date对象](stdlib/date.html)
- [RegExp对象](stdlib/regexp.html)
- [JSON对象](stdlib/json.html)

<h2 id="oop">面向对象编程</h2>

- [概述](oop/basic.html)
- [封装](oop/encapsulation.html)
- [继承](oop/inheritance.html)
- [模块化编程](oop/module.html)

<h2 id="dom">DOM</h2>

- [Node节点](dom/node.html)
- [Document节点](dom/document.html)
- [Element节点](dom/element.html)
- [Text节点和DocumentFragment节点](dom/text.html)
- [Event对象](dom/event.html)
- [CSS操作](dom/css.html)
- [Mutation Observer](dom/mutationobserver.html)

<h2 id="bom">浏览器对象</h2>

- [浏览器的JavaScript引擎](bom/engine.html)
- [定时器](bom/timer.html)
- [window对象](bom/window.html)
- [History对象](bom/history.html)
- [Ajax](bom/ajax.html)
- [window.postMessage方法](bom/windowpostmessage.html)
- [Web Storage：浏览器端数据储存机制](bom/webstorage.html)
- [IndexedDB：浏览器端数据库](bom/indexeddb.html)
- [Web Notification API](bom/notification.html)
- [Performance API](bom/performance.html)
- [移动设备API](bom/mobile.html)

<h2 id="htmlapi">HTML网页的API</h2>

- [HTML网页元素](htmlapi/elements.html)
- [Canvas](htmlapi/canvas.html)
- [SVG图像](htmlapi/svg.html)
- [表单](htmlapi/form.html)
- [文件与二进制数据的操作](htmlapi/file.html)
- [Web Worker](htmlapi/webworker.html)
- [SSE：服务器发送事件](htmlapi/eventsource.html)
- [Page Visiblity](htmlapi/pagevisibility.html)
- [FullScreen API：全屏操作](htmlapi/fullscreen.html)
- [Web Speech](htmlapi/webspeech.html)
- [requestAnimationFrame](htmlapi/requestanimationframe.html)
- [WebSocket](htmlapi/websocket.html)
- [WebRTC](htmlapi/webrtc.html)
- [Web Components](htmlapi/webcomponents.html)

<h2 id="tool">开发工具</h2>

- [console对象](tool/console.html)
- [PhantomJS](tool/phantomjs.html)
- [Bower：客户端库管理工具](tool/bower.html)
- [Grunt：任务自动管理工具](tool/grunt.html)
- [Gulp：任务自动管理工具](tool/gulp.html)
- [Browserify：浏览器加载Node.js模块](tool/browserify.html)
- [RequireJS和AMD规范](tool/requirejs.html)
- [Source map](tool/sourcemap.html)
- [Lint工具](tool/lint.html)
- [JavaScript 测试](tool/testing.html)

<h2 id="advanced">JavaScript高级语法</h2>

- [Promise](advanced/promise.html)
- [有限状态机](advanced/fsm.html)
- [MVC模式和Backbone.js](advanced/backbonejs.html)
- [严格模式](advanced/strict.html)

<hr></hr>

<h2 id="appendix">附录</h2>

- [JavaScript API列表](appendix/api.html)

<h2 id="library">草稿一：函数库</h2>

- [Underscore.js](library/underscore.html)
- [Modernizr](library/modernizr.html)
- [Datejs](library/datejs.html)
- [D3.js](library/d3.html)
- [设计模式](library/designpattern.html)
- [排序算法](library/sorting.html)

<h2 id="jquery">草稿二：jQuery</h2>

- [概述](jquery/basic.html)
- [工具方法](jquery/utility.html)
- [插件开发](jquery/plugin.html)
- [deferred对象](jquery/deferred.html)
- [如何做到jQuery-free？](jquery/jquery-free.html)

<h2 id="nodejs">草稿三：Node.js</h2>

- [概述](nodejs/basic.html)
- [Module](nodejs/module.html)
- [package.json文件](nodejs/packagejson.html)
- [npm模块管理器](nodejs/npm.html)
- [fs模块](nodejs/fs.html)
- [path模块](nodejs/path.html)
- [process对象](nodejs/process.html)
- [Buffer对象](nodejs/buffer.html)
- [Events模块](nodejs/events.html)
- [Stream接口](nodejs/stream.html)
- [Child Process模块](nodejs/child-process.html)
- [Http模块](nodejs/http.html)
- [assert模块](nodejs/assert.html)
- [Cluster模块](nodejs/cluster.html)
- [OS模块](nodejs/os.html)
- [Net模块和DNS模块](nodejs/net.html)
- [Express框架](nodejs/express.html)
- [Koa框架](nodejs/koa.html)

{% comment %}

{% if site.posts.size != 0 %}

## 最新文章

{% for post in site.posts %}
* {{ post.date | date_to_string }} [{{ post.title }}]({{ post.url }})
{% endfor %}

{% endif %}

{% if site.pages.size != 0 %}

## 最新页面

{% for page in site.pages limit:5 %}
{% if page.url !='/index.html' %}
* [{{ page.title }}]( {{ page.url }})（{{ page.date }}）
{% endif %}
{% endfor %}

{% endif %}

{% endcomment %}
