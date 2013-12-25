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

### exitFullscreen()

exitFullscreen方法用于取消全屏（带有浏览器前缀）。

{% highlight javascript %}

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozexitFullscreen) {
    document.mozexitFullscreen();
  } else if(document.webkitexitFullscreen) {
    document.webkitexitFullscreen();
  }
}

exitFullscreen();

{% endhighlight %}

## 属性

### document.fullscreenElement

该属性返回正处于全屏状态的网页元素。

{% highlight javascript %}

var fullscreenElement =
	document.fullScreenElement ||
	document.mozFullScreenElement ||
	document.webkitFullScreenElement;

{% endhighlight %}

### document.fullscreenEnabled

该属性返回一个布尔值，表示当前是否处于全屏状态。

{% highlight javascript %}

var fullscreenEnabled =
	document.fullScreenEnabled ||
	document.mozScreenEnabled ||
	document.webkitScreenEnabled;

{% endhighlight %}

## 全屏状态的CSS

可以对全屏状态设置单独的CSS属性，配合JavaScript使用。

{% highlight css %}

:-webkit-full-screen {
  /* properties */
}
:-moz-full-screen {
  /* properties */
}

:full-screen {
  /* properties */
}

{% endhighlight %}

## 参考链接

* David Walsh, [Fullscreen API](http://davidwalsh.name/fullscreen)
