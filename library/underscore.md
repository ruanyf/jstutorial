---
title: Underscore.js
layout: page
category: library
date: 2012-12-27
modifiedOn: 2012-12-27
---

## 概述

[Underscore.js](http://underscorejs.org/)是一个很精干的库，压缩后只有4KB。它提供了几十种函数式编程的方法，大大方便了Javascript的编程。MVC框架backbone.js就是基于这个库。

它定义了一个下划线（_）对象，函数库的所有方法都属于这个对象。这些方法大致上可以分成：集合（collection）、数组（array）、函数（function）、对象（object）和工具（utility）五大类。

## 与函数相关的方法

1. throttle

该方法返回一个函数的新版本。连续调用这个新版本的函数时，必须等待一定时间才会触发下一次执行。

{% highlight javascript %}

// 返回updatePosition函数的新版本
var throttled = _.throttle(updatePosition, 100);

// 连续触发这个新版本的函数，但是每过100毫秒才会触发一次
$(window).scroll(throttled);

{% endhighlight %}

2. debounce

该方法也是返回一个函数的新版本。每次调用这个新版本的函数，必须与上一次调用间隔一定的时间，否则就无效。它的典型应用是防止用户双击某个按钮，导致两次提交表单。

{% highlight javascript %}

$("button").on("click", _.debounce(submitForm, 1000));

{% endhighlight %}

## 参考链接

- [Using Underscore.js's debounce() to filter double-clicks](http://eng.wealthfront.com/2012/12/using-underscorejss-debounce-to-filter.html)
