---
title: window.matchMedia
layout: page
category: bom
date: 2013-01-05
modifiedOn: 2013-01-05
---

## 概述

该方法用来检查[media query](https://developer.mozilla.org/en-US/docs/DOM/Using_media_queries_from_code)语句。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

{% endhighlight %}

它返回一个[MediaQueryList](https://developer.mozilla.org/en-US/docs/DOM/MediaQueryList)对象。该对象有以下两个属性。

- media：查询语句的内容。
- matches：如果查询结果为真，值为true，否则为false。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

result.media
// (min-width: 600px)

result.matches
// true

{% endhighlight %}

一个简单的用法，就是根据查询结果，加载相应的样式表。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

if (result.matches){
  document.write('<link rel="stylesheet" 
                  href="small.css">');
}

{% endhighlight %}

## 监听事件

window.matchMedia方法返回的MediaQueryList，还可以监听事件。如果查询结果发生变化，就调用指定的回调函数。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

result.addListener(sizeChange);

function sizeChange(result) {

	v = document.getElementById("myDiv");

    if (result.matches) {
        v.innerHTML = "getting big" + "<br/>" + result.media;
    } else {
        v.innerHTML = "getting small" + "<br/>"+ result.media;
    }

}

{% endhighlight %}

与之对应的还有一个removeListener方法，用来取消事件的监听。

{% highlight javascript %}

result.removeListener(sizeChange);

{% endhighlight %}

## 参考链接

-  Robert Nyman, [Using window.matchMedia to do media queries in JavaScript](https://hacks.mozilla.org/2012/06/using-window-matchmedia-to-do-media-queries-in-javascript/)
