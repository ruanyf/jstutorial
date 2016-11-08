---
layout: homepage
title: JavaScript 标准参考教程（alpha）
date: 2012-11-18
modifiedOn: 2014-05-18
---

<h2 id="introduction">导论</h2>

- [概述](introduction/intro.md)
- [JavaScript的历史](introduction/history.md)

<h2 id="grammar">语法</h2>

- [基本语法](grammar/basic.md)
- [数据类型](grammar/types.md)
- [数值](grammar/number.md)
- [字符串](grammar/string.md)
- [对象](grammar/object.md)
- [数组](grammar/array.md)
- [函数](grammar/function.md)
- [运算符](grammar/operator.md)
- [数据类型转换](grammar/conversion.md)
- [错误处理机制](grammar/error.md)
- [编程风格](grammar/style.md)

<h2 id="stdlib">标准库</h2>

- [Object对象](stdlib/object.md)
- [Array对象](stdlib/array.md)
- [包装对象和Boolean对象](stdlib/wrapper.md)
- [Number对象](stdlib/number.md)
- [String对象](stdlib/string.md)
- [Math对象](stdlib/math.md)
- [Date对象](stdlib/date.md)
- [RegExp对象](stdlib/regexp.md)
- [JSON对象](stdlib/json.md)
- [console对象](stdlib/console.md)
- [属性描述对象](stdlib/attributes.md)

<h2 id="oop">面向对象编程</h2>

- [概述](oop/basic.md)
- [this 关键字](oop/this.md)
- [prototype 对象](oop/prototype.md)
- [Object 对象与继承](oop/object.md)
- [面向对象编程的模式](oop/pattern.md)

<h2 id="advanced">语法专题</h2>

- [单线程模型](advanced/single-thread.md)
- [定时器](advanced/timer.md)
- [Promise](advanced/promise.md)
- [严格模式](advanced/strict.md)

<h2 id="dom">DOM模型</h2>

- [概述](dom/node.md)
- [Document节点](dom/document.md)
- [Element节点](dom/element.md)
- [属性的操作](dom/attribute.md)
- [Text节点和DocumentFragment节点](dom/text.md)
- [Event对象](dom/event.md)
- [CSS操作](dom/css.md)
- [Mutation Observer](dom/mutationobserver.md)

<h2 id="bom">浏览器环境</h2>

- [概述](bom/engine.md)
- [window对象](bom/window.md)
- [History对象](bom/history.md)
- [Cookie](bom/cookie.md)
- [Web Storage：浏览器端数据储存机制](bom/webstorage.md)
- [同源政策](bom/same-origin.md)
- [Ajax](bom/ajax.md)
- [CORS](bom/cors.md)
- [IndexedDB：浏览器端数据库](bom/indexeddb.md)
- [Web Notification API](bom/notification.md)
- [Performance API](bom/performance.md)
- [移动设备API](bom/mobile.md)

<h2 id="htmlapi">HTML网页的API</h2>

- [概述](htmlapi/elements.md)
- [Canvas](htmlapi/canvas.md)
- [SVG图像](htmlapi/svg.md)
- [表单](htmlapi/form.md)
- [文件与二进制数据的操作](htmlapi/file.md)
- [Web Worker](htmlapi/webworker.md)
- [SSE：服务器发送事件](htmlapi/eventsource.md)
- [Page Visiblity](htmlapi/pagevisibility.md)
- [FullScreen API：全屏操作](htmlapi/fullscreen.md)
- [Web Speech](htmlapi/webspeech.md)
- [requestAnimationFrame](htmlapi/requestanimationframe.md)
- [WebSocket](htmlapi/websocket.md)
- [WebRTC](htmlapi/webrtc.md)
- [Web Components](htmlapi/webcomponents.md)

---

<h2 id="library">废稿</h2>

- [Underscore.js](library/underscore.md)
- [Modernizr](library/modernizr.md)
- [Datejs](library/datejs.md)
- [D3.js](library/d3.md)
- [设计模式](library/designpattern.md)
- [排序算法](library/sorting.md)
- [PhantomJS](tool/phantomjs.md)
- [Bower：客户端库管理工具](tool/bower.md)
- [Grunt：任务自动管理工具](tool/grunt.md)
- [RequireJS和AMD规范](tool/requirejs.md)
- [Lint工具](tool/lint.md)
- [MVC模式和Backbone.js](advanced/backbonejs.md)
- [Gulp：任务自动管理工具](tool/gulp.md)
- [Browserify：浏览器加载Node.js模块](tool/browserify.md)
- [JavaScript 测试](tool/testing.md)
- [Source map](tool/sourcemap.md)
- [有限状态机](advanced/fsm.md)

<h2 id="jquery">草稿：jQuery</h2>

- [概述](jquery/basic.md)
- [工具方法](jquery/utility.md)
- [插件开发](jquery/plugin.md)
- [deferred对象](jquery/deferred.md)
- [如何做到jQuery-free？](jquery/jquery-free.md)

<h2 id="nodejs">草稿：Node.js</h2>

- [概述](nodejs/basic.md)
- [Module](nodejs/module.md)
- [package.json文件](nodejs/packagejson.md)
- [npm模块管理器](nodejs/npm.md)
- [fs模块](nodejs/fs.md)
- [path模块](nodejs/path.md)
- [process对象](nodejs/process.md)
- [Buffer对象](nodejs/buffer.md)
- [Events模块](nodejs/events.md)
- [Stream接口](nodejs/stream.md)
- [Child Process模块](nodejs/child-process.md)
- [Http模块](nodejs/http.md)
- [assert模块](nodejs/assert.md)
- [Cluster模块](nodejs/cluster.md)
- [OS模块](nodejs/os.md)
- [Net模块和DNS模块](nodejs/net.md)
- [Express框架](nodejs/express.md)
- [Koa框架](nodejs/koa.md)

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
