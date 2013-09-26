---
title: requestAnimationFrame
layout: page
category: htmlapi
date: 2013-02-12
modifiedOn: 2013-09-26
---

## 概述

requestAnimationFrame是浏览器用于定时循环操作的一个接口，类似于setTimeout，主要用途是按帧对网页进行重绘。

设置这个API的目的是为了让各种网页动画效果（DOM动画、Canvas动画、SVG动画、WebGL动画）能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。代码中使用这个API，就是告诉浏览器希望执行一个动画，让浏览器在下一个动画帧安排一次网页重绘。

requestAnimationFrame的优势，在于充分利用显示器的刷新机制，比较节省系统资源。显示器有固定的刷新频率（60Hz或75Hz），也就是说，每秒最多只能重绘60次或75次，requestAnimationFrame的基本思想就是与这个刷新频率保持同步，利用这个刷新频率进行页面重绘。此外，使用这个API，一旦页面不处于浏览器的当前标签，就会自动停止刷新。这就节省了CPU、GPU和电力。

不过有一点需要注意，requestAnimationFrame是在主线程上完成。这意味着，如果主线程非常繁忙，requestAnimationFrame的动画效果会大打折扣。

requestAnimationFrame使用一个回调函数作为参数。这个回调函数会在浏览器重绘之前调用。

{% highlight javascript %}

requestID = window.requestAnimationFrame(callback); 

{% endhighlight %}

目前，主要浏览器Firefox 23 / IE 10 / Chrome / Safari）都支持这个方法。可以用下面的方法，检查浏览器是否支持这个API。如果不支持，则自行模拟部署该方法。

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

上面的代码按照1秒钟60次（大约每16.7毫秒一次），来模拟requestAnimationFrame。

使用requestAnimationFrame的时候，只需反复调用它即可。

{% highlight javascript %}

function repeatOften() {
  // Do whatever
  requestAnimationFrame(repeatOften);
}

requestAnimationFrame(repeatOften);

{% endhighlight %}

## cancelAnimationFrame方法

cancelAnimationFrame方法用于取消重绘。

{% highlight javascript %}

window.cancelAnimationFrame(requestID);

{% endhighlight %}

它的参数是requestAnimationFrame返回的一个代表任务ID的整数值。

{% highlight javascript %}

var globalID;

function repeatOften() {
  $("<div />").appendTo("body");
  globalID = requestAnimationFrame(repeatOften);
}

$("#start").on("click", function() {
  globalID = requestAnimationFrame(repeatOften);
});

$("#stop").on("click", function() {
  cancelAnimationFrame(globalID);
});

{% endhighlight %}

上面代码持续在body元素下添加div元素，直到用户点击stop按钮为止。

## 实例

下面，举一个实例。

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
- Chris Coyier, [Using requestAnimationFrame](http://css-tricks.com/using-requestanimationframe/)
