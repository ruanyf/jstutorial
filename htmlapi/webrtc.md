---
title: WebRTC
layout: page
category: bom
date: 2013-01-10
modifiedOn: 2013-10-04
---

## 概述

WebRTC是“网络实时通信”（Web Real Time Communication）的缩写。它最初是为了解决浏览器上视频通话而提出的，即两个浏览器之间直接进行视频和音频的通信，不经过服务器。后来发展到除了音频和视频，还可以传输文字和其他数据。

Google是WebRTC的主要支持者和开发者，它最初在Gmail上推出了视频聊天，后来在2011年推出了Hangouts，语序在浏览器中打电话。它推动了WebRTC标准的确立。

WebRTC主要让浏览器具备三个作用。

- 获取音频和视频
- 进行音频和视频通信
- 进行任意数据的通信

WebRTC共分成三个API，分别对应上面三个作用。

- MediaStream （又称getUserMedia）
- RTCPeerConnection
- RTCDataChannel

## getUserMedia

### 概述

navigator.getUserMedia方法目前主要用于，在浏览器中获取音频（通过麦克风）和视频（通过摄像头），将来可以用于获取任意数据流，比如光盘和传感器。

下面的代码用于检查浏览器是否支持getUserMedia方法。

{% highlight javascript %}

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

if (navigator.getUserMedia) {
    // 支持
} else {
    // 不支持
}

{% endhighlight %}

Chrome 21, Opera 18和Firefox 17，支持该方法。目前，IE还不支持，上面代码中的msGetUserMedia，只是为了确保将来的兼容。

getUserMedia方法接受三个参数。

{% highlight javascript %}

navigator.getUserMedia({
    video: true, 
    audio: true
}, onSuccess, onError);

{% endhighlight %}

getUserMedia的第一个参数是一个对象，表示要获取哪些多媒体设备，上面的代码表示获取摄像头和麦克风;onSuccess是一个回调函数，在获取多媒体设备成功时调用；onError也是一个回调函数，在取多媒体设备失败时调用。

下面是一个例子。

```javascript

var constraints = {video: true};

function onSuccess(stream) {
  var video = document.querySelector("video");
  video.src = window.URL.createObjectURL(stream);
}

function onError(error) {
  console.log("navigator.getUserMedia error: ", error);
}

navigator.getUserMedia(constraints, onSuccess, onError);

```

如果网页使用了getUserMedia方法，浏览器就会询问用户，是否同意浏览器调用麦克风或摄像头。如果用户同意，就调用回调函数onSuccess；如果用户拒绝，就调用回调函数onError。

onSuccess回调函数的参数是一个数据流对象stream。stream.getAudioTracks方法和stream.getVideoTracks方法，分别返回一个数组，其成员是数据流包含的音轨和视轨（track）。使用的声音源和摄影头的数量，决定音轨和视轨的数量。比如，如果只使用一个摄像头获取视频，且不获取音频，那么视轨的数量为1，音轨的数量为0。每个音轨和视轨，有一个kind属性，表示种类（video或者audio），和一个label属性（比如FaceTime HD Camera (Built-in)）。

onError回调函数接受一个Error对象作为参数。Error对象的code属性有如下取值，说明错误的类型。

- **PERMISSION_DENIED**：用户拒绝提供信息。
- **NOT_SUPPORTED_ERROR**：浏览器不支持硬件设备。
- **MANDATORY_UNSATISFIED_ERROR**：无法发现指定的硬件设备。

### 范例：获取摄像头

下面通过getUserMedia方法，将摄像头拍摄的图像展示在网页上。

首先，需要先在网页上放置一个video元素。图像就展示在这个元素中。

{% highlight html %}

<video id="webcam"></video>

{% endhighlight %}

然后，用代码获取这个元素。

{% highlight javascript %}

function onSuccess(stream) {
    var video = document.getElementById('webcam');
}

{% endhighlight %}

接着，将这个元素的src属性绑定数据流，摄影头拍摄的图像就可以显示了。

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

if (navigator.getUserMedia) {
	navigator.getUserMedia({video:true}, onSuccess);
} else {
	document.getElementById('webcam').src = 'somevideo.mp4';
}

{% endhighlight %}

在Chrome和Opera中，URL.createObjectURL方法将媒体数据流（MediaStream）转为一个二进制对象的URL（Blob URL），该URL可以作为video元素的src属性的值。 在Firefox中，媒体数据流可以直接作为src属性的值。Chrome和Opera还允许getUserMedia获取的音频数据，直接作为audio或者video元素的值，也就是说如果还获取了音频，上面代码播放出来的视频是有声音的。

获取摄像头的主要用途之一，是让用户使用摄影头为自己拍照。Canvas API有一个ctx.drawImage(video, 0, 0)方法，可以将视频的一个帧转为canvas元素。这使得截屏变得非常容易。

```html

<video autoplay></video>
<img src="">
<canvas style="display:none;"></canvas>

<script>
  var video = document.querySelector('video');
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  var localMediaStream = null;

  function snapshot() {
    if (localMediaStream) {
      ctx.drawImage(video, 0, 0);
      // “image/webp”对Chrome有效，
      // 其他浏览器自动降为image/png
      document.querySelector('img').src = canvas.toDataURL('image/webp');
    }
  }

  video.addEventListener('click', snapshot, false);

  navigator.getUserMedia({video: true}, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
  }, errorCallback);
</script>

```

### 范例：捕获麦克风声音

通过浏览器捕获声音，需要借助Web Audio API。

```javascript

window.AudioContext = window.AudioContext ||
                      window.webkitAudioContext;

var context = new AudioContext();

function onSuccess(stream) {
	var audioInput = context.createMediaStreamSource(stream);
	audioInput.connect(context.destination);
}

navigator.getUserMedia({audio:true}, onSuccess);

```

### 捕获的限定条件

getUserMedia方法的第一个参数，除了指定捕获对象之外，还可以指定一些限制条件，比如限定只能录制高清（或者VGA标准）的视频。

```javascript

var hdConstraints = {
  video: {
    mandatory: {
      minWidth: 1280,
      minHeight: 720
    }
  }
};

navigator.getUserMedia(hdConstraints, onSuccess, onError);

var vgaConstraints = {
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 360
    }
  }
};

navigator.getUserMedia(vgaConstraints, onSuccess, onError);

```

### MediaStreamTrack.getSources()

如果本机有多个摄像头/麦克风，这时就需要使用MediaStreamTrack.getSources方法指定，到底使用哪一个摄像头/麦克风。

```javascript

MediaStreamTrack.getSources(function(sourceInfos) {
  var audioSource = null;
  var videoSource = null;

  for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'audio') {
      console.log(sourceInfo.id, sourceInfo.label || 'microphone');

      audioSource = sourceInfo.id;
    } else if (sourceInfo.kind === 'video') {
      console.log(sourceInfo.id, sourceInfo.label || 'camera');

      videoSource = sourceInfo.id;
    } else {
      console.log('Some other kind of source: ', sourceInfo);
    }
  }

  sourceSelected(audioSource, videoSource);
});

function sourceSelected(audioSource, videoSource) {
  var constraints = {
    audio: {
      optional: [{sourceId: audioSource}]
    },
    video: {
      optional: [{sourceId: videoSource}]
    }
  };

  navigator.getUserMedia(constraints, onSuccess, onError);
}

```

上面代码表示，MediaStreamTrack.getSources方法的回调函数，可以得到一个本机的摄像头和麦克风的列表，然后指定使用最后一个摄像头和麦克风。

## RTCPeerConnectionl，RTCDataChannel

### RTCPeerConnectionl

RTCPeerConnection的作用是在浏览器之间建立数据的“点对点”（peer to peer）通信，也就是将浏览器获取的麦克风或摄像头数据，传播给另一个浏览器。这里面包含了很多复杂的工作，比如信号处理、多媒体编码/解码、点对点通信、数据安全、带宽管理等等。

不同客户端之间的音频/视频传递，是不用通过服务器的。但是，两个客户端之间建立联系，需要通过服务器。服务器主要转递两种数据。

- 通信内容的元数据：打开/关闭对话（session）的命令、媒体文件的元数据（编码格式、媒体类型和带宽）等。
- 网络通信的元数据：IP地址、NAT网络地址翻译和防火墙等。

WebRTC协议没有规定与服务器的通信方式，因此可以采用各种方式，比如WebSocket。通过服务器，两个客户端按照Session Description Protocol（SDP协议）交换双方的元数据。

下面是一个示例。

```javascript

var signalingChannel = createSignalingChannel();
var pc;
var configuration = ...;

// run start(true) to initiate a call
function start(isCaller) {
    pc = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        signalingChannel.send(JSON.stringify({ "candidate": evt.candidate }));
    };

    // once remote stream arrives, show it in the remote video element
    pc.onaddstream = function (evt) {
        remoteView.src = URL.createObjectURL(evt.stream);
    };

    // get the local stream, show it in the local video element and send it
    navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
        selfView.src = URL.createObjectURL(stream);
        pc.addStream(stream);

        if (isCaller)
            pc.createOffer(gotDescription);
        else
            pc.createAnswer(pc.remoteDescription, gotDescription);

        function gotDescription(desc) {
            pc.setLocalDescription(desc);
            signalingChannel.send(JSON.stringify({ "sdp": desc }));
        }
    });
}

signalingChannel.onmessage = function (evt) {
    if (!pc)
        start(false);

    var signal = JSON.parse(evt.data);
    if (signal.sdp)
        pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    else
        pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
};

```

RTCPeerConnection带有浏览器前缀，Chrome浏览器中为webkitRTCPeerConnection，Firefox浏览器中为mozRTCPeerConnection。Google维护一个函数库[adapter.js](https://apprtc.appspot.com/js/adapter.js)，用来抽象掉浏览器之间的差异。

### RTCDataChannel

RTCDataChannel的作用是在点对点之间，传播任意数据。它的API与WebSockets的API相同。

下面是一个示例。

```javascript

var pc = new webkitRTCPeerConnection(servers,
  {optional: [{RtpDataChannels: true}]});

pc.ondatachannel = function(event) {
  receiveChannel = event.channel;
  receiveChannel.onmessage = function(event){
    document.querySelector("div#receive").innerHTML = event.data;
  };
};

sendChannel = pc.createDataChannel("sendDataChannel", {reliable: false});

document.querySelector("button#send").onclick = function (){
  var data = document.querySelector("textarea#send").value;
  sendChannel.send(data);
};

```

Chrome 25、Opera 18和Firefox 22支持RTCDataChannel。

### 外部函数库

由于这两个API比较复杂，一般采用外部函数库进行操作。目前，视频聊天的函数库有[SimpleWebRTC](https://github.com/henrikjoreteg/SimpleWebRTC)、[easyRTC](https://github.com/priologic/easyrtc)、[webRTC.io](https://github.com/webRTC/webRTC.io)，点对点通信的函数库有[PeerJS](http://peerjs.com/)、[Sharefest](https://github.com/peer5/sharefest)。

下面是SimpleWebRTC的示例。

```javascript

var webrtc = new WebRTC({
  localVideoEl: 'localVideo',
  remoteVideosEl: 'remoteVideos',
  autoRequestMedia: true
});

webrtc.on('readyToCall', function () {
    webrtc.joinRoom('My room name');
});

```

下面是PeerJS的示例。

```javascript

var peer = new Peer('someid', {key: 'apikey'});
peer.on('connection', function(conn) {
  conn.on('data', function(data){
    // Will print 'hi!'
    console.log(data);
  });
});

// Connecting peer
var peer = new Peer('anotherid', {key: 'apikey'});
var conn = peer.connect('someid');
conn.on('open', function(){
  conn.send('hi!');
});

```

## 参考链接

- Andi Smith，[Get Started with WebRTC](http://www.netmagazine.com/tutorials/get-started-webrtc)
- Thibault Imbert, [From microphone to .WAV with: getUserMedia and Web Audio](http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/)
- Ian Devlin, [Using the getUserMedia API with the HTML5 video and canvas elements](http://html5hub.com/using-the-getusermedia-api-with-the-html5-video-and-canvas-elements/#i.bz41ehmmhd3311)
- Eric Bidelman, [Capturing Audio & Video in HTML5](http://www.html5rocks.com/en/tutorials/getusermedia/intro/)
- Sam Dutton, [Getting Started with WebRTC](http://www.html5rocks.com/en/tutorials/webrtc/basics/)
- Dan Ristic, [WebRTC data channels](http://www.html5rocks.com/en/tutorials/webrtc/datachannels/)
- Justin Uberti, Sam Dutton, [WebRTC: Plugin-free realtime communication](http://io13webrtc.appspot.com/)
- Mozilla Developer Network, [Taking webcam photos](https://developer.mozilla.org/en-US/docs/Web/Guide/API/WebRTC/Taking_webcam_photos)
- Sam Dutton, [WebRTC in the real world: STUN, TURN and signaling](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)
