---
layout: page
title: Fullscreen API
category: htmlapi
date: 2012-11-22
modifiedOn: 2012-11-22
---

这个API可以控制浏览器的全屏显示。

## 方法

### requestFullScreen()

这个方法使得浏览器全屏，它目前在不同浏览器中带有前缀。

{% highlight javascript %}

// Find the right method, call on correct element
function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}

{% endhighlight %}

使用的时候，可以针对整个网页，也可以针对某个网页元素。

{% highlight javascript %}

// Launch fullscreen for browsers that support it!
launchFullScreen(document.documentElement); // the whole page
launchFullScreen(document.getElementById("videoElement")); // any individual element

{% endhighlight %}

### cancelFullScreen()

这个方法用于取消全屏（带有浏览器前缀）。

{% highlight javascript %}

function cancelFullscreen() {
  if(document.cancelFullScreen) {
    document.cancelFullScreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
}

{% endhighlight %}

取消全屏的时候，直接调用这个方法就可以了。

{% highlight javascript %}

// Cancel fullscreen for browsers that support it!
cancelFullscreen();

{% endhighlight %}

## 属性

### fullScreenElement

查看某个网页元素是否现在处于全屏状态。

{% highlight javascript %}

var fullscreenElement =
	document.fullScreenElement ||
	document.mozFullScreenElement ||
	document.webkitFullScreenElement;

{% endhighlight %}

### fullscreenEnabled

查看某个元素的全屏是否可用。

{% highlight javascript %}

var fullscreenEnabled =
	document.fullScreenEnabled ||
	document.mozScreenEnabled ||
	document.webkitScreenEnabled;

{% endhighlight %}


## 参考链接

* David Walsh, [Fullscreen API](http://davidwalsh.name/fullscreen)
