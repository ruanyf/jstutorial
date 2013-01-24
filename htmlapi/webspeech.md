---
title: Web Speech
layout: page
category: htmlapi
date: 2013-01-24
modifiedOn: 2013-01-24
---

## 概述

这个API用于浏览器接收语音输入。

它最早是由Google提出的，目的是让用户直接进行语音搜索，即对着麦克风说出你所要搜索的词，搜索结果就自动出现。Google首先部署的是input元素的speech属性（加上浏览器前缀x-webkit）。

{% highlight html %}

<input id="query" type="search" class="k-input k-textbox" 
 x-webkit-speech speech />

{% endhighlight %}

加上这个属性以后，输入框的右端会出现了一个麦克风标志，点击该标志，就会跳出语音输入窗口。

由于这个操作过于简单，Google又在它的基础上提出了Web Speech API，使得JavaScript可以操作语音输入。

目前，只有Chrome浏览器支持该API。

## SpeechRecognition对象

这个API部署在SpeechRecognition对象之上。

{% highlight javascript %}

var SpeechRecognition = window.SpeechRecognition || 
                        window.webkitSpeechRecognition || 
                        window.mozSpeechRecognition || 
                        window.oSpeechRecognition || 
                        window.msSpeechRecognition;

{% endhighlight %}

为了将来的兼容性考虑，上面的代码列出了所有浏览器的前缀。但是实际上，目前只有window.webkitSpeechRecognition是可用的。

确定浏览器支持以后，新建一个SpeechRecognition的实例对象。

{% highlight javascript %}

if (SpeechRecognition) {		
  var recognition = new SpeechRecognition();
  recognition.maxAlternatives = 5;
}

{% endhighlight %}

maxAlternatives属性等于5，表示最多返回5个语音匹配结果。

## 事件

目前，该API部署了11个事件。下面对其中的3个定义回调函数（假定speak是语音输入框）。

{% highlight javascript %}

var speak = $('#speak');

recognition.onaudiostart = function() {
  speak.val("Speak now...");
};

recognition.onnomatch = function() {
  speak.val("Try again please...");
};

recognition.onerror = function() {
  speak.val("Error. Try Again...");
};

{% endhighlight %}

首先，浏览器会询问用户是否许可浏览器获取麦克风数据。如果用户许可，就会触发audiostart事件，准备接收语音输入。如果找不到与语音匹配的值，就会触发nomatch事件；如果发生错误，则会触发error事件。

如果得到与语音匹配的值，则会触发result事件。

{% highlight javascript %}

recognition.onresult = function(event) { 

  if (event.results.length > 0) { 
    
    var results = event.results[0], 
        topResult = results[0];

    if (topResult.confidence > 0.5) {
      speechSearch(results, topResult);
    } else {
      speak.val("Try again please...");
    }
  }
};

{% endhighlight %}

result事件回调函数的参数，是一个SpeechRecognitionEvent对象。它的results属性就是语音匹配的结果，是一个数组，按照匹配度排序，最匹配的结果排在第一位。该数组的每一个成员是SpeechRecognitionResult对象，该对象的transcript属性是实际匹配的文本，confidence属性是可信度（在0与1之间）。

## 参考链接

-  Brandon Satrom, [Using voice to drive the web: Introduction to the Web Speech API](http://www.adobe.com/devnet/html5/articles/voice-to-drive-the-web-introduction-to-speech-api.html)
