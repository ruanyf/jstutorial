---
title: Page Visibility API
layout: page
date: 2012-11-20
category: htmlapi
modifiedOn: 2013-09-26
---

PageVisibility API用于判断页面是否处于浏览器的当前窗口，即是否可见。

使用这个API，可以帮助开发者根据用户行为调整程序。比如，如果页面处于当前窗口，可以让程序每隔15秒向服务器请求数据；如果不处于当前窗口，则让程序每隔几分钟请求一次数据。

## 属性

这个API部署在document对象上，提供以下两个属性。

- **document.hidden**：返回一个布尔值，表示当前是否被隐藏。

- **document.visibilityState**：表示页面当前的状态，可以取三个值，分别是visibile（页面可见）、hidden（页面不可见）、prerender（页面正处于渲染之中，不可见）。

这两个属性都带有浏览器前缀。使用的时候，必须进行前缀识别。

{% highlight javascript %}

function getHiddenProp(){
    var prefixes = ['webkit','moz','ms','o'];
    
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';
    
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document) 
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}

{% endhighlight %}

## VisibilityChange事件

当页面的可见状态发生变化时，会触发VisibilityChange事件（带有浏览器前缀）。

{% highlight javascript %}

document.addEventListener("visibilitychange", function() {
  console.log( document.visibilityState );
});

{% endhighlight %}

## 参考链接

- W3草案：[http://www.w3.org/TR/page-visibility/](http://www.w3.org/TR/page-visibility/)
- David Walsh, [Page Visibility API](http://davidwalsh.name/page-visibility)
- Joe Marini, [Using the pageVisbility API](http://www.html5rocks.com/en/tutorials/pagevisibility/intro/)
- Jatinder Mann, [Using PC Hardware more efficiently in HTML5: New Web Performance APIs, Part 2](http://blogs.msdn.com/b/ie/archive/2011/07/08/using-pc-hardware-more-efficiently-in-html5-new-web-performance-apis-part-2.aspx)


