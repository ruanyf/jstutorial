---
title: window.matchMedia
layout: page
category: bom
date: 2013-01-05
modifiedOn: 2013-01-05
---

## 概述

window.matchMedia方法用来检查CSS的[media query](https://developer.mozilla.org/en-US/docs/DOM/Using_media_queries_from_code)语句。各种浏览器的最新版本（包括IE 10+）都支持该方法。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

result.media // (min-width: 600px)
result.matches // true

{% endhighlight %}

matchMedia返回一个[MediaQueryList](https://developer.mozilla.org/en-US/docs/DOM/MediaQueryList)对象。该对象有以下两个属性。

- media：查询语句的内容。
- matches：如果查询结果为真，值为true，否则为false。

该方法的一个简单用法，就是根据查询结果加载相应的CSS样式表。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

if (result.matches){
  document.write('<link rel="stylesheet" 
                  href="small.css">');
}

{% endhighlight %}

## 监听事件

window.matchMedia方法返回的MediaQueryList对象，还可以监听事件。如果查询结果发生变化，就调用指定的回调函数。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

result.addListener(function(e){
        if(e.matches){
                console.log('进入移动设备模式');
        }
});

{% endhighlight %}

## 参考链接

-  Robert Nyman, [Using window.matchMedia to do media queries in JavaScript](https://hacks.mozilla.org/2012/06/using-window-matchmedia-to-do-media-queries-in-javascript/)
