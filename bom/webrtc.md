---
title: WebRTC
layout: page
category: bom
date: 2013-01-10
modifiedOn: 2013-10-04
---

## 概述

WebRTC是“网络实时通信”（Web Real Time Communication）的缩写，它主要用来让浏览器实时获取和交换视频、音频和数据。

WebRTC共分成三个API。

- MediaStream （又称getUserMedia）
- RTCPeerConnection
- RTCDataChannel

getUserMedia主要用于获取视频和音频信息，后两个API用于浏览器之间的数据交换。

## getUserMedia

### 简介

首先，检查浏览器是否支持getUserMedia方法。

{% highlight javascript %}

navigator.getUserMedia ||
  (navigator.getUserMedia = navigator.mozGetUserMedia ||
  navigator.webkitGetUserMedia || navigator.msGetUserMedia);

if (navigator.getUserMedia) {
    // do something
} else {
    alert('您的浏览器不支持getUserMedia');
}

{% endhighlight %}

Chrome 21, Opera 18和Firefox 17，支持该方法。目前，IE还不支持，上面代码中的msGetUserMedia，只是为了确保将来的兼容。

getUserMedia方法接受三个参数。

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

发生错误时，回调函数的参数是一个Error对象，它的code属性取值如下：

- **PERMISSION_DENIED**：用户拒绝提供信息。
- **NOT_SUPPORTED_ERROR**：浏览器不支持硬件设备。
- **MANDATORY_UNSATISFIED_ERROR**：无法发现指定的硬件设备。

### 展示摄像头图像

将用户的摄像头拍摄的图像展示在网页上，需要先在网页上放置一个video元素。图像就展示在这个元素中。

{% highlight html %}

<video id="webcam"></video>

{% endhighlight %}

然后，用代码获取这个元素。

{% highlight javascript %}

function onSuccess(stream) {

    var video = document.getElementById('webcam');
 
    // more code 
}

{% endhighlight %}

最后，将这个元素的src属性绑定数据流，摄影头拍摄的图像就可以显示了。

{% highlight javascript %}

function onSuccess(stream) {

    var video = document.getElementById('webcam');

    if (window.URL) {
	    video.src = window.URL.createObjectURL(stream);
	} else {
		video.src = stream;
	}

	video.autoplay = true; 
	// 或者 video.play();

}

{% endhighlight %}

它的主要用途是让用户使用摄影头为自己拍照。

### 捕获麦克风声音

通过浏览器捕获声音，相对复杂，需要借助Web Audio API。

{% highlight javascript %}

function onSuccess(stream) {

	// 创建一个“音频环境”的对象
	audioContext = window.AudioContext || window.webkitAudioContext;
    context = new audioContext(); 

	// 将声音流输入这个对象
	audioInput = context.createMediaStreamSource(stream);

	// 设置音量节点
	volume = context.createGain();
	audioInput.connect(volume);

	// 创建缓存，用来暂存声音
	var bufferSize = 2048;

	// 创建声音的缓存节点，createJavaScriptNode方法的
	// 第二个和第三个参数指的是输入和输出都是双声道。
    recorder = context.createJavaScriptNode(bufferSize, 2, 2);

	// 录音过程的回调函数，基本上是将左右两声道的声音
	// 分别放入缓存。
	recorder.onaudioprocess = function(e){
        console.log('recording');
        var left = e.inputBuffer.getChannelData(0);
        var right = e.inputBuffer.getChannelData(1);
        // we clone the samples
        leftchannel.push(new Float32Array(left));
        rightchannel.push(new Float32Array(right));
        recordingLength += bufferSize;
    }

	// 将音量节点连上缓存节点，换言之，音量节点是输入
	// 和输出的中间环节。
	volume.connect(recorder);

	// 将缓存节点连上输出的目的地，可以是扩音器，也可以
	// 是音频文件。
    recorder.connect(context.destination); 

}

{% endhighlight %}

## 实时数据交换

WebRTC的另外两个API，RTCPeerConnection用于浏览器之间点对点的连接，RTCDataChannel用于点对点的数据通信。

RTCPeerConnection带有浏览器前缀，Chrome浏览器中为webkitRTCPeerConnection，Firefox浏览器中为mozRTCPeerConnection。Google维护一个函数库[adapter.js](https://apprtc.appspot.com/js/adapter.js)，用来抽象掉浏览器之间的差异。

{% highlight javascript %}

var dataChannelOptions = {
  ordered: false, // do not guarantee order
  maxRetransmitTime: 3000, // in milliseconds
};

var peerConnection = new RTCPeerConnection();

// Establish your peer connection using your signaling channel here
var dataChannel =
  peerConnection.createDataChannel("myLabel", dataChannelOptions);

dataChannel.onerror = function (error) {
  console.log("Data Channel Error:", error);
};

dataChannel.onmessage = function (event) {
  console.log("Got Data Channel Message:", event.data);
};

dataChannel.onopen = function () {
  dataChannel.send("Hello World!");
};

dataChannel.onclose = function () {
  console.log("The Data Channel is Closed");
};

{% endhighlight %}

## 参考链接

- Andi Smith，[Get Started with WebRTC](http://www.netmagazine.com/tutorials/get-started-webrtc)
- Thibault Imbert, [From microphone to .WAV with: getUserMedia and Web Audio](http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/)
- Ian Devlin, [Using the getUserMedia API with the HTML5 video and canvas elements](http://html5hub.com/using-the-getusermedia-api-with-the-html5-video-and-canvas-elements/#i.bz41ehmmhd3311)
- Eric Bidelman, [Capturing Audio & Video in HTML5](http://www.html5rocks.com/en/tutorials/getusermedia/intro/)
- Sam Dutton, [Getting Started with WebRTC](http://www.html5rocks.com/en/tutorials/webrtc/basics/)
- Dan Ristic, [WebRTC data channels](http://www.html5rocks.com/en/tutorials/webrtc/datachannels/)
