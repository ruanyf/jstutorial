---
layout: homepage
title: Javascript 标准教程
date: 2012-11-18
modifiedOn: 2013-03-02
---

<h2 id="introduction">导论</h2>

- [为什么学习JavaScript？](introduction/why.html)
- [Javascript的历史](introduction/history.html)
- [使用说明](introduction/instruction.html)

<h2 id="grammar">基本语法</h2>

- [概述](grammar/basic.html)
- [运算符](grammar/operator.html)
- [数值](grammar/number.html)
- [对象](grammar/object.html)
- [数组](grammar/array.html)
- [函数](grammar/function.html)
- [严格模式](grammar/strict.html)

<h2 id="stdlib">标准库</h2>

- [Math对象](stdlib/math.html)
- [Date对象](stdlib/date.html)
- [Regex对象](stdlib/regex.html)
- [JSON格式](stdlib/json.html)

<h2 id="oop">面向对象编程</h2>

- [概述](oop/basic.html)
- [封装](oop/encapsulation.html)
- [继承](oop/inheritance.html)

<h2 id="dom">DOM</h2>

* [dataset](dom/dataset.html)
* [classList](dom/classlist.html)

<h2 id="bom">浏览器对象</h2>

- [History对象](bom/history.html)
- [CSS](bom/css.html)
- [Ajax](bom/ajax.html)
- [Web Storage](bom/webstorage.html)
- [WebSocket](bom/websocket.html)	
- [Geolocation](bom/geolocation.html)
- [MatchMedia](bom/matchmedia.html)
- [WebRTC](bom/webrtc.html)

<h2 id="htmlapi">HTML网页的API</h2>

* [Canvas](htmlapi/canvas.html)
- [SVG图像](htmlapi/svg.html)
* [Blob对象](htmlapi/blob.html)
* [File](htmlapi/file.html)
- [Web Worker](htmlapi/webworker.html)
- [服务器端发送事件](htmlapi/eventsource.html)		
* [Page Visiblity](htmlapi/pagevisibility.html)
* [FullScreen](htmlapi/fullscreen.html)
- [Web Speech](htmlapi/webspeech.html)
- [requestAnimationFrame](htmlapi/requestanimationframe.html)

<h2 id="jquery">jQuery</h2>

- [选择器](jquery/selector.html)
- [Utility方法](jquery/utility.html)
- [deferred对象](jquery/deferred.html)

<h2 id="library">函数库</h2>

- [Underscore.js](library/underscore.html)
- [Modernizr](library/modernizr.html)
- [Datejs](library/datejs.html)

<h2 id="tool">开发工具</h2>

- [Chrome开发工具](tool/chrome.html)
- [性能测试（Benchmark）](tool/benchmark.html)
- [PhantomJS](tool/phantomjs.html)
- [移动端除错](tool/mobiledebugging.html)
- [Source map](tool/sourcemap.html)

<h2 id="nodejs">Node.js</h2>

- [概述](nodejs/basic.html)

<h2 id="pattern">模式</h2>

- [设计模式](pattern/designpattern.html)
- [异步编程](pattern/asynchronous.html)

<h2 id="algorithm">算法</h2>

* [排序](algorithm/sorting.html)

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
