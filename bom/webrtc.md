---
title: WebRTC
layout: page
category: bom
date: 2013-01-10
modifiedOn: 2013-02-15
---

## 概述

WebRTC是“网络实时通信”（Web Real Time Communication）的缩写，它主要用来让浏览器获取多媒体设备的实时信息，比如摄像头和麦克风。

它的主要方法是getUserMedia。首先，检查浏览器是否支持这个方法。

{% highlight javascript %}

navigator.getUserMedia ||
  (navigator.getUserMedia = navigator.mozGetUserMedia ||
  navigator.webkitGetUserMedia || navigator.msGetUserMedia);

if (navigator.getUserMedia) {
    // do something
} else {
    alert('getUserMedia is not supported in this browser.');
}

{% endhighlight %}

需要注意的是，IE还不支持这个API，所以上面代码中的msGetUserMedia，只是为了确保将来的兼容。

## getUserMedia方法

这个方法接受三个参数。

{% highlight javascript %}

getUserMedia(streams, success, error);

{% endhighlight %}

含义如下：

- streams，一个对象，表示包括哪些多媒体设备。
- success，回调函数，获取多媒体设备成功时调用。
- error，回调函数，获取多媒体设备失败时调用。

用法如下：

{% highlight javascript %}

navigator.getUserMedia({
    video: true, 
    audio: true
}, onSuccess, onError);

{% endhighlight %}

上面的代码用来获取摄像头和麦克风的实时信息。

如果网页使用了getUserMedia，浏览器就会询问用户，是否许可提供信息。如果用户拒绝，就调用回调函数onError。

## 展示摄像头图像

将用户的摄像头拍摄的图像展示在网页上，需要先在网页上放置一个video元素。图像就展示在这个元素中。

{% highlight html %}

<video id="webcam"></video>

{% endhighlight %}

然后，用代码获取这个元素。

{% highlight javascript %}

function onSuccess() {

    var video = document.getElementById('webcam');
 
    // more code 
}

{% endhighlight %}

最后，将这个元素的src属性绑定数据流，摄影头拍摄的图像就可以显示了。

{% highlight javascript %}

function onSuccess(stream) {

    var video = document.getElementById('webcam');
     
    video.src = stream;

	video.autoplay = true;

}

{% endhighlight %}

它的主要用途是让用户使用摄影头为自己拍照。

## 参考链接

- Andi Smith，[Get Started with WebRTC](http://www.netmagazine.com/tutorials/get-started-webrtc)


