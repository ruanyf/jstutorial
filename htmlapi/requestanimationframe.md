---
title: requestAnimationFrame
layout: page
category: htmlapi
date: 2013-02-12
modifiedOn: 2013-03-24
---

## 概述

requestAnimationFrame是浏览器用于定时循环操作的一个接口，类似于setTimeout，主要用途是按帧对网页进行重绘。设置这个API的目的是为了让各种网页动画效果（DOM动画、Canvas动画、SVG动画、WebGL动画）能够有一个统一的刷新机制，从而节省系统资源，提高视觉效果。比如，使用这个API，一旦页面不处于浏览器的当前展示窗口，就会自动停止刷新，这就节省了CPU、GPU和供电。

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

Opera的工程师[Erik Möller](http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating)还提出了一个更精确的模拟方法：

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

## 实例

假定网页中有一个动画区块。

{% highlight html %}

<div id="anim">点击运行动画</div> 

{% endhighlight %}

然后，定义动画效果。

{% highlight javascript %}

var elem = document.getElementById("anim");

var startTime = undefined;
 
function render(time) {
 
  if (time === undefined)
    time = Date.now();
  if (startTime === undefined)
    startTime = time;
 
  elem.style.left = ((time - startTime)/10 % 500) + "px";
}

{% endhighlight %}

最后，定义click事件。

{% highlight javascript %}

elem.onclick = function() {

    (function animloop(){
      render();
      requestAnimFrame(animloop);
    })();

};

{% endhighlight %}

运行效果可查看[jsfiddle](http://jsfiddle.net/paul/rjbGw/3/)。

## 参考链接

- Paul Irish, [requestAnimationFrame for smart animating](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
