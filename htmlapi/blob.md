---
title: Blob对象
category: htmlapi
layout: page
date: 2012-12-15
modifiedOn: 2012-12-15
---

## 概述

Blob是浏览器的内置对象，用来操作二进制数据。

## a元素的download属性

网页的a元素（链接元素），有一个download属性，可以用来指定下载文件名。

{% highlight html %}

<a href="http://www.google.com/.../logo2w.png" download="MyGoogleLogo">download me</a>

{% endhighlight %}

使用blob对象，可以对这个download属性进行编程。

{% highlight javascript %}

var blob = new Blob(["Hello World"]);

var a = document.createElement("a");
a.href = window.URL.createObjectURL(blob);
a.download = "hello-world.txt";
a.textContent = "Download Hello World!";

{% endhighlight %}

## 参考链接

- [HTML5 download attribute](http://javascript-reverse.tumblr.com/post/37056936789/html5-download-attribute)
