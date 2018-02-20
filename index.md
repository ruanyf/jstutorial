---
layout: homepage
title: JavaScript 标准参考教程（alpha）
date: 2012-11-18
modifiedOn: 2014-05-18
---

<h2 id="introduction">导论</h2>

- [概述](introduction/intro.html)
- [JavaScript的历史](introduction/history.html)

<h2 id="grammar">语法</h2>

- [基本语法](grammar/basic.html)
- [数据类型](grammar/types.html)
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
- [Array对象](stdlib/array.html)
- [包装对象](stdlib/wrapper.html)
- [Number对象](stdlib/number.html)
- [String对象](stdlib/string.html)
- [Math对象](stdlib/math.html)
- [Date对象](stdlib/date.html)
- [RegExp对象](stdlib/regexp.html)
- [JSON对象](stdlib/json.html)
- [console对象](stdlib/console.html)
- [属性描述对象](stdlib/attributes.html)

<h2 id="oop">面向对象编程</h2>

- [概述](oop/basic.html)
- [this 关键字](oop/this.html)
- [prototype 对象](oop/prototype.html)
- [Object 对象与继承](oop/object.html)
- [面向对象编程的模式](oop/pattern.html)

<h2 id="advanced">语法专题</h2>

- [异步操作概述](advanced/single-thread.html)
- [定时器](advanced/timer.html)
- [Promise 对象](advanced/promise.html)
- [严格模式](advanced/strict.html)

<h2 id="dom">DOM 模型</h2>

- [概述](dom/node.html)
- [Document 节点](dom/document.html)
- [Element 节点](dom/element.html)
- [属性的操作](dom/attribute.html)
- [Text节点和DocumentFragment节点](dom/text.html)
- [事件模型](dom/event.html)
- [事件类型](dom/event-type.html)
- [CSS操作](dom/css.html)
- [Mutation Observer](dom/mutationobserver.html)

<h2 id="bom">浏览器环境</h2>

- [概述](bom/engine.html)
- [window对象](bom/window.html)
- [History对象](bom/history.html)
- [Cookie](bom/cookie.html)
- [Web Storage：浏览器端数据储存机制](bom/webstorage.html)
- [同源政策](bom/same-origin.html)
- [Ajax](bom/ajax.html)
- [CORS](bom/cors.html)

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
