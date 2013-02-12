---
title: requestAnimationFrame
layout: page
category: htmlapi
date: 2013-02-12
modifiedOn: 2013-02-12
---

## 概述

requestAnimationFrame是浏览器用于定时循环操作的一个接口，按帧对网页进行重绘。

可以用下面的方法，检查浏览器是否支持这个API。如果不支持，则部署代码模拟它的效果。

{% highlight javascript %}

 window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

{% endhighlight %}

更精确的模拟方法如下：

{% highlight javascript %}

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+
          'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}())

{% endhighlight %}

## 调用方法

{% highlight javascript %}

window.requestAnimationFrame(function(/* time */ time){
	// time ~= +new Date // the unix time
});

{% endhighlight %}

## 参考链接

- Paul Irish, [requestAnimationFrame for smart animating](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
