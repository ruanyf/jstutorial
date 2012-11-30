---
layout: homepage
title: Javascript教程
date: 2012-11-18
---

## DOM

* [dataset](dom/dataset.html)
* [classList](dom/classlist.html)

## HTML5 API

* [Canvas](htmlapi/canvas.html)
* [File](htmlapi/file.html)
* [Page Visiblity](htmlapi/pagevisibility.html)
* [FullScreen](htmlapi/fullscreen.html)

{% if site.posts.size != 0 %}

## 最新文章

{% for post in site.posts %}
* {{ post.date | date_to_string }} [{{ post.title }}]({{ post.url }})
{% endfor %}

{% endif %}

{% if site.pages.size != 0 %}

## 最新页面

{% for page in site.pages %}
{% if page.url !='/index.html' %}
* [{{ page.title }}]( {{ page.url }})（{{ page.date }}）
{% endif %}
{% endfor %}

{% endif %}
