---
layout: page
title: Fullscreen API：全屏操作
category: htmlapi
date: 2012-11-22
modifiedOn: 2014-01-29
---

全屏API可以控制浏览器的全屏显示，让一个Element节点（以及子节点）占满用户的整个屏幕。目前各大浏览器的最新版本都支持这个API（包括IE11），但是使用的时候需要加上浏览器前缀。

## 方法

### requestFullscreen()

Element节点的requestFullscreen方法，可以使得这个节点全屏。

```javascript
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

launchFullscreen(document.documentElement);
launchFullscreen(document.getElementById("videoElement"));
```

放大一个节点时，Firefox和Chrome在行为上略有不同。Firefox自动为该节点增加一条CSS规则，将该元素放大至全屏状态，`width: 100%; height: 100%`，而Chrome则是将该节点放在屏幕的中央，保持原来大小，其他部分变黑。为了让Chrome的行为与Firefox保持一致，可以自定义一条CSS规则。

```css
:-webkit-full-screen #myvideo {
  width: 100%;
  height: 100%;
}
```

### exitFullscreen()

document对象的exitFullscreen方法用于取消全屏。该方法也带有浏览器前缀。

```javascript
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
```

用户手动按下ESC键或F11键，也可以退出全屏键。此外，加载新的页面，或者切换tab，或者从浏览器转向其他应用（按下Alt-Tab），也会导致退出全屏状态。

## 属性

### document.fullscreenElement

fullscreenElement属性返回正处于全屏状态的Element节点，如果当前没有节点处于全屏状态，则返回null。

```javascript
var fullscreenElement =
  document.fullscreenElement ||
  document.mozFullScreenElement ||
  document.webkitFullscreenElement;
```

### document.fullscreenEnabled

fullscreenEnabled属性返回一个布尔值，表示当前文档是否可以切换到全屏状态。

```javascript
var fullscreenEnabled =
  document.fullscreenEnabled ||
  document.mozFullScreenEnabled ||
  document.webkitFullscreenEnabled ||
  document.msFullscreenEnabled;

if (fullscreenEnabled) {
  videoElement.requestFullScreen();
} else {
  console.log('浏览器当前不能全屏');
}
```

## 全屏事件

以下事件与全屏操作有关。

- fullscreenchange事件：浏览器进入或离开全屏时触发。

- fullscreenerror事件：浏览器无法进入全屏时触发，可能是技术原因，也可能是用户拒绝。

```javascript
document.addEventListener("fullscreenchange", function( event ) {
  if (document.fullscreenElement) {
    console.log('进入全屏');
  } else {
    console.log('退出全屏');
  }
});
```

上面代码在发生fullscreenchange事件时，通过fullscreenElement属性判断，到底是进入全屏还是退出全屏。

## 全屏状态的CSS

全屏状态下，大多数浏览器的CSS支持`:full-screen`伪类，只有IE11支持`:fullscreen`伪类。使用这个伪类，可以对全屏状态设置单独的CSS属性。

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
