---
layout: homepage
title: Javascript 标准教程
date: 2012-11-18
modifiedOn: 2013-1-5
---

<h2 id="introduction">导论</h2>

- [为什么学习Javascript？](introduction/why.html)

<h2 id="grammar">基本语法</h2>

- [概述](grammar/basic.html)
- [对象](grammar/object.html)
- [数组](grammar/array.html)
- [函数](grammar/function.html)

<h2 id="oop">面向对象编程</h2>

- [概述](oop/basic.html)
- [封装](oop/encapsulation.html)
- [继承](oop/inheritance.html)

<h2 id="dom">DOM</h2>

* [dataset](dom/dataset.html)
* [classList](dom/classlist.html)

<h2 id="bom">浏览器对象</h2>

- [Web Storage](bom/webstorage.html)
- [History对象](bom/history.html)
- [WebSocket](bom/websocket.html)	
- [Geolocation](bom/geolocation.html)
- [window.matchMedia](bom/matchmedia.html)

<h2 id="htmlapi">HTML网页的API</h2>

* [Canvas](htmlapi/canvas.html)
* [Blob对象](htmlapi/blob.html)
* [File](htmlapi/file.html)
* [Page Visiblity](htmlapi/pagevisibility.html)
* [FullScreen](htmlapi/fullscreen.html)

<h2 id="jquery">jQuery</h2>

+ [deferred对象](jquery/deferred.html)

<h2 id="library">函数库</h2>

- [Underscore.js](library/underscore.html)

<h2 id="tool">开发工具</h2>

- [性能测试（Benchmark）](tool/benchmark.html)
- [PhantomJS](tool/phantomjs.html)

<h2 id="pattern">模式</h2>

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
