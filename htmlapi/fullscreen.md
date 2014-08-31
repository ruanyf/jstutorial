---
layout: page
title: Fullscreen API
category: htmlapi
date: 2012-11-22
modifiedOn: 2014-01-29
---

这个API可以控制浏览器的全屏显示，目前各大浏览器的最新版本都支持这个API（包括IE11），但是使用的时候需要加上浏览器前缀。

网页全屏时会触发fullscreenchange事件。

## 方法

### requestFullscreen()

requestFullscreen方法使得浏览器全屏。

{% highlight javascript %}

function launchFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.msRequestFullscreen){ 
	element.msRequestFullscreen();  
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  }
}

{% endhighlight %}

使用的时候，可以针对整个网页，也可以针对某个网页元素（比如播放视频的video元素）。

{% highlight javascript %}

launchFullscreen(document.documentElement); 

launchFullscreen(document.getElementById("videoElement")); 

{% endhighlight %}

当放大一个元素的时候，Firefox和Chrome在行为上略有不同。Firefox自动为该元素增加一条CSS规则，将该元素放大至全屏状态，`width: 100%; height: 100%`，而Chrome则是将该元素放在屏幕的中央，保持原来大小，其他部分变黑。为了让Chrome的行为与Firefox保持一致，需要自定义一条CSS规则。

```css

:-webkit-full-screen #myvideo {
  width: 100%;
  height: 100%;
}

```

### exitFullscreen()

exitFullscreen方法用于取消全屏（带有浏览器前缀）。

{% highlight javascript %}

function exitFullscreen() {
	if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
}

exitFullscreen();

{% endhighlight %}

## 属性

### document.fullscreenElement

该属性返回正处于全屏状态的网页元素。

{% highlight javascript %}

var fullscreenElement =
	document.fullscreenElement ||
	document.mozFullScreenElement ||
	document.webkitFullscreenElement;

{% endhighlight %}

### document.fullscreenEnabled

该属性返回一个布尔值，表示当前是否处于全屏状态。

{% highlight javascript %}

var fullscreenEnabled =
	document.fullscreenEnabled ||
	document.mozFullScreenEnabled ||
	document.webkitFullscreenEnabled ||
	document.msFullscreenEnabled;

{% endhighlight %}

## 全屏状态的CSS

全屏状态下，大多数浏览器的CSS支持:full-screen伪类，只有IE11支持:fullscreen伪类。使用这个伪类，可以对全屏状态设置单独的CSS属性。

{% highlight css %}

:-webkit-full-screen {
  /* properties */
}

:-moz-full-screen {
  /* properties */
}

:-ms-fullscreen {
  /* properties */
}

:full-screen { /*pre-spec */
  /* properties */
}

:fullscreen { /* spec */
  /* properties */
}

/* deeper elements */
:-webkit-full-screen video {
  width: 100%;
  height: 100%;
}

{% endhighlight %}

## 参考链接

- David Walsh, [Fullscreen API](http://davidwalsh.name/fullscreen)
- David Storey, [Is your Fullscreen API code up to date? Find out how to make it work the same in modern browsers](http://generatedcontent.org/post/70347573294/is-your-fullscreen-api-code-up-to-date-find-out-how-to)
