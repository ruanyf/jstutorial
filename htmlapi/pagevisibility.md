---
title: Page Visibility API
layout: page
date: 2012-11-20
category: htmlapi
modifiedOn: 2012-11-20
---

这个API用于判断页面是否处于浏览器的当前窗口，即是否可见。

## 属性

### hidden

如果当面不可见，该属性（document.hidden）返回true。

### visibilityState

document.visibilityState属性表示页面当前的状态，它可以取三个值。

* visibile： 页面可见。
* hidden： 页面不可见。
* prerender： 页面正处于渲染之中，不可见。

### 浏览器前缀

上面两个属性都带有浏览器前缀。使用的时候，必须进行前缀识别。

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

* W3草案：[http://www.w3.org/TR/page-visibility/](http://www.w3.org/TR/page-visibility/)
* David Walsh, [Page Visibility API](http://davidwalsh.name/page-visibility)
* Joe Marini, [Using the pageVisbility API](http://www.html5rocks.com/en/tutorials/pagevisibility/intro/)


