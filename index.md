---
layout: homepage
title: JavaScript 标准教程（alpha）
date: 2012-11-18
modifiedOn: 2013-07-05
---

<h2 id="introduction">导论</h2>

- [为什么学习JavaScript？](introduction/why.md)
- [Javascript的历史](introduction/history.md)
- [使用说明](introduction/instruction.md)
- [参考书目](introduction/bibliography.md)

<h2 id="grammar">基本语法</h2>

- [概述](grammar/basic.md)
- [运算符](grammar/operator.md)
- [数值](grammar/number.md)
- [对象](grammar/object.md)
- [数组](grammar/array.md)
- [函数](grammar/function.md)
- [数据类型转换](grammar/conversion.md)
- [编程风格](grammar/style.md)
- [严格模式](grammar/strict.md)

<h2 id="stdlib">标准库</h2>

- [Object对象](stdlib/object.md)
- [Array 对象](stdlib/array.md)
- [原始类型的包装对象](stdlib/wrapper.md)
- [Boolean对象](stdlib/boolean.md)
- [Number对象](stdlib/number.md)
- [String对象](stdlib/string.md)
- [Math对象](stdlib/math.md)
- [Date对象](stdlib/date.md)
- [Regex对象](stdlib/regex.md)
- [JSON对象](stdlib/json.md)
- [Error对象](stdlib/error.md)

<h2 id="oop">面向对象编程</h2>

- [概述](oop/basic.md)
- [封装](oop/encapsulation.md)
- [继承](oop/inheritance.md)
- [ECMAscript 6 介绍](oop/ecmascript6.md)

<h2 id="dom">DOM</h2>

- [dataset](dom/dataset.md)
- [classList](dom/classlist.md)
- [样式表操作](dom/stylesheet.md)

<h2 id="bom">浏览器对象</h2>

- [JavaScript运行原理](bom/engine.md)
- [History对象](bom/history.md)
- [CSS](bom/css.md)
- [Ajax](bom/ajax.md)
- [Web Storage](bom/webstorage.md)
- [WebSocket](bom/websocket.md)
- [Geolocation](bom/geolocation.md)
- [MatchMedia](bom/matchmedia.md)
- [WebRTC](bom/webrtc.md)

<h2 id="htmlapi">HTML网页的API</h2>

- [Canvas](htmlapi/canvas.md)
- [SVG图像](htmlapi/svg.md)
- [File对象和二进制数据](htmlapi/file.md)
- [Web Worker](mhtmlpi/webworker.md)
- [服务器端发送事件](htmlapi/eventsource.md)
- [Page Visiblity](htmlapi/pagevisibility.md)
- [FullScreen](htmlapi/fullscreen.md)
- [Web Speech](htmlapi/webspeech.md)
- [requestAnimationFrame](htmlapi/requestanimationframe.md)

<h2 id="jquery">jQuery</h2>

- [选择器](jquery/selector.md)
- [Utility方法](jquery/utility.md)
- [deferred对象](jquery/deferred.md)
- [如何做到jQuery-free？](jquery/jquery-free.md)

<h2 id="library">函数库</h2>

- [Underscore.js](library/underscore.md)
- [Modernizr](library/modernizr.md)
- [Datejs](library/datejs.md)

<h2 id="tool">开发工具</h2>

- [console对象](tool/console.md)
- [Chrome开发工具](tool/chrome.md)
- [性能测试（Benchmark）](tool/benchmark.md)
- [PhantomJS](tool/phantomjs.md)
- [Grunt任务管理工具](tool/grunt.md)
- [RequireJS和AMD规范](tool/requirejs.md)
- [移动端开发](tool/mobile.md)
- [Google Closure](tool/closure.md)
- [Source map](tool/sourcemap.md)

<h2 id="nodejs">Node.js</h2>

- [概述](nodejs/basic.md)
- [CommonJS规范](nodejs/commonjs.md)

<h2 id="pattern">模式</h2>

- [设计模式](pattern/designpattern.md)
- [异步编程](pattern/asynchronous.md)

<h2 id="algorithm">算法</h2>

* [排序](algorithm/sorting.md)

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
{% if page.url !='/index.md' %}
* [{{ page.title }}]( {{ page.url }})（{{ page.date }}）
{% endif %}
{% endfor %}

{% endif %}

{% endcomment %}
