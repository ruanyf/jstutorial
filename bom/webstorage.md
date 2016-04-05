---
title: Web Storage：浏览器端数据储存机制
layout: page
category: bom
date: 2012-12-28
modifiedOn: 2013-12-16
---

## 概述

这个API的作用是，使得网页可以在浏览器端储存数据。它分成两类：sessionStorage和localStorage。

sessionStorage保存的数据用于浏览器的一次会话，当会话结束（通常是该窗口关闭），数据被清空；localStorage保存的数据长期存在，下一次访问该网站的时候，网页可以直接读取以前保存的数据。除了保存期限的长短不同，这两个对象的属性和方法完全一样。

它们很像cookie机制的强化版，能够动用大得多的存储空间。目前，每个域名的存储上限视浏览器而定，Chrome是2.5MB，Firefox和Opera是5MB，IE是10MB。其中，Firefox的存储空间由一级域名决定，而其他浏览器没有这个限制。也就是说，在Firefox中，`a.example.com`和`b.example.com`共享5MB的存储空间。另外，与Cookie一样，它们也受同域限制。某个网页存入的数据，只有同域下的网页才能读取。

通过检查window对象是否包含sessionStorage和localStorage属性，可以确定浏览器是否支持这两个对象。

{% highlight javascript %}

function checkStorageSupport() {
 
  // sessionStorage
  if (window.sessionStorage) {
    return true;
  } else {
    return false;
  }
   
  // localStorage
  if (window.localStorage) {
    return true;
  } else {
    return false;
  }
}

{% endhighlight %}

## 操作方法

### 存入/读取数据

sessionStorage和localStorage保存的数据，都以“键值对”的形式存在。也就是说，每一项数据都有一个键名和对应的值。所有的数据都是以文本格式保存。

存入数据使用setItem方法。它接受两个参数，第一个是键名，第二个是保存的数据。

{% highlight javascript %}

sessionStorage.setItem("key","value");

localStorage.setItem("key","value");

{% endhighlight %}

读取数据使用getItem方法。它只有一个参数，就是键名。

{% highlight javascript %}

var valueSession = sessionStorage.getItem("key");

var valueLocal = localStorage.getItem("key");

{% endhighlight %}

### 清除数据

removeItem方法用于清除某个键名对应的数据。

{% highlight javascript %}

sessionStorage.removeItem('key');

localStorage.removeItem('key');

{% endhighlight %}

clear方法用于清除所有保存的数据。

{% highlight javascript %}

sessionStorage.clear();

localStorage.clear(); 

{% endhighlight %}

### 遍历操作

利用length属性和key方法，可以遍历所有的键。

{% highlight javascript %}

for(var i = 0; i < localStorage.length; i++){
    console.log(localStorage.key(i));
}

{% endhighlight %}

其中的key方法，根据位置（从0开始）获得键值。

{% highlight javascript %}

localStorage.key(1);

{% endhighlight %}

## storage事件

当储存的数据发生变化时，会触发storage事件。我们可以指定这个事件的回调函数。

{% highlight javascript %}

window.addEventListener("storage",onStorageChange);

{% endhighlight %}

回调函数接受一个event对象作为参数。这个event对象的key属性，保存发生变化的键名。

{% highlight javascript %}

function onStorageChange(e) {
     console.log(e.key);    
}

{% endhighlight %}

除了key属性，event对象的属性还有三个：

- oldValue：更新前的值。如果该键为新增加，则这个属性为null。
- newValue：更新后的值。如果该键被删除，则这个属性为null。
- url：原始触发storage事件的那个网页的网址。

值得特别注意的是，该事件不在导致数据变化的当前页面触发。如果浏览器同时打开一个域名下面的多个页面，当其中的一个页面改变sessionStorage或localStorage的数据时，其他所有页面的storage事件会被触发，而原始页面并不触发storage事件。可以通过这种机制，实现多个窗口之间的通信。所有浏览器之中，只有IE浏览器除外，它会在所有页面触发storage事件。

## 参考链接

- Ryan Stewart，[Introducing the HTML5 storage APIs](http://www.adobe.com/devnet/html5/articles/html5-storage-apis.html)
- [Getting Started with LocalStorage](http://codular.com/localstorage)
- Feross Aboukhadijeh, [Introducing the HTML5 Hard Disk Filler™ API](http://feross.org/fill-disk/)
- Ben Summers, [Inter-window messaging using localStorage](http://bens.me.uk/2013/localstorage-inter-window-messaging)
- Stack Overflow, [Why does Internet Explorer fire the window “storage” event on the window that stored the data?](http://stackoverflow.com/questions/18265556/why-does-internet-explorer-fire-the-window-storage-event-on-the-window-that-st)
