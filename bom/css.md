---
title: CSS
layout: page
category: bom
date: 2013-02-08
modifiedOn: 2013-01-18
---

## CSS模块的侦测

CSS的规格发展太快，新的模块层出不穷。不同浏览器的不同版本，对CSS模块的支持情况都不一样。有时候，需要知道当前浏览器是否支持某个模块，这就叫做“CSS模块的侦测”。

目前，部分浏览器（Firefox 22+, Chrome 28+, Opera 12.1+）部署了supports API，可以返回是否支持某条CSS规则。但是，这个API还没有成为标准。

{% highlight javascript %}

CSS.supports('transform-origin', '5px');
CSS.supports('(display: table-cell) and (display: list-item)');

{% endhighlight %}

一个比较普遍适用的方法是，判断某个DOM元素的style对象的某个属性值是否为字符串。

{% highlight javascript %}

typeof element.style.animationName === 'string';
typeof element.style.transform === 'string';

{% endhighlight %}

如果是的话，就说明该属性在style对象中确实存在，代表浏览器支持该CSS属性。所有浏览器都能用这个方法，但是使用的时候，需要把不同浏览器的CSS规则前缀也考虑进去。

{% highlight javascript %}

typeof document.getElementById("content").style['-webkit-animation'] === 'string'

{% endhighlight %}

## CSS生成内容

“CSS生成内容”指的是通过CSS，向DOM树添加的元素。主要的方法是通过“:before”和“:after”生成伪元素，然后用content属性指定伪元素的内容。

假定HTML代码如下：

{% highlight html %}

<div id="test">Test content</div>

{% endhighlight %}

相应的CSS：

{% highlight css %}

#test:before {
    content: 'Before ';
}

{% endhighlight %}

JavaScript获取获取伪元素的content内容，可以使用下面的方法。

{% highlight javascript %}

var test = document.querySelector('#test');
var result   = getComputedStyle(test, ':before').content;

{% endhighlight %}

## 动画（animation）

CSS的animation动画定义了三个事件，可以绑定回调函数：动画的开始、动画的结束、动画的循环。

{% highlight javascript %}

var e = document.getElementById("animation");

e.addEventListener("animationstart", listener, false);
e.addEventListener("animationend", listener, false);
e.addEventListener("animationiteration", listener, false);

{% endhighlight %}

回调函数的范例：

{% highlight javascript %}

function listener(e) {

  var l = document.createElement("li");

  switch(e.type) {

    case "animationstart":
      l.innerHTML = "Started: elapsed time is " + e.elapsedTime;
      break;

    case "animationend":
      l.innerHTML = "Ended: elapsed time is " + e.elapsedTime;
      break;

    case "animationiteration":
      l.innerHTML = "New loop started at time " + e.elapsedTime;
      break;

  }

  document.getElementById("output").appendChild(l);

}

{% endhighlight %}

上面代码的运行结果是下面的样子：

{% highlight html %}

Started: elapsed time is 0
New loop started at time 3.01200008392334
New loop started at time 6.00600004196167
Ended: elapsed time is 9.234000205993652

{% endhighlight %}

animation-play-state属性可以控制动画的状态（暂停/播放），该属性需求加上浏览器前缀。

{% highlight javascript %}

element.style.webkitAnimationPlayState = "paused";
element.style.webkitAnimationPlayState = "running";

{% endhighlight %}

## 过渡（transition）

过渡结束的时候，会触发transitionend事件。

{% highlight javascript %}

 $("body").on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", function(){
      // Remove the transition property
      $("body").css("transition", "none");
    });

{% endhighlight %}

## Media Query

Media Query可以根据显示媒介的参数，设置相应的CSS规则。MediaQueryList是JavaScript操作Media Query的接口。

浏览器Chrome 9+、Firefox 6+、IE 10+、Opera 12.1+和Safari 5.1+，支持该接口。对于不支持该接口的老式浏览器，可以使用第三方函数库[matchMedia.js](https://github.com/paulirish/matchMedia.js/)。

### window.matchMedia方法

window.matchMedia方法用来检查CSS的[mediaQuery](https://developer.mozilla.org/en-US/docs/DOM/Using_media_queries_from_code)语句。各种浏览器的最新版本（包括IE 10+）都支持该方法。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

result.media // (min-width: 600px)
result.matches // true

{% endhighlight %}

matchMedia返回一个[MediaQueryList](https://developer.mozilla.org/en-US/docs/DOM/MediaQueryList)对象。该对象有以下两个属性。

- media：查询语句的内容。
- matches：如果查询结果为真，值为true，否则为false。

该方法的一个简单用法，就是根据查询结果加载相应的CSS样式表。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

if (result.matches){
  document.write('<link rel="stylesheet" 
                  href="small.css">');
}

{% endhighlight %}

window.matchMedia方法返回的MediaQueryList对象，还可以监听事件。如果mediaQuery查询结果发生变化，就调用指定的回调函数。

{% highlight javascript %}

var mql = window.matchMedia("(min-width: 400px)");

// 指定回调函数
mql.addListener(mqCallback);

// 撤销回调函数
mql.removeListener(mqCallback);

{% endhighlight %}

回调函数的调用，可能存在两种情况。一种是显示屏宽度从400像素以上变为以下，另一种是从400像素以下变为以上。所以在回调函数内部要判断一下当前的屏幕宽度。

{% highlight javascript %}

function mqCallback(mql) {
  if (mql.matches) {
    // 宽度大于等于400像素
  } else {
    // 宽度小于400像素
  }
}

{% endhighlight %}

从上面代码可以看到，回调函数调用的时候，MediaQueryList对象会作为它的参数。

## 参考链接

- Mozilla Developer Network, [Using CSS animations](https://developer.mozilla.org/en-US/docs/CSS/Tutorials/Using_CSS_animations)
- Ryan Morr, [Detecting CSS Style Support](http://ryanmorr.com/detecting-css-style-support/)
- Mozilla Developer Network, [Testing media queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Testing_media_queries)
- Robert Nyman, [Using window.matchMedia to do media queries in JavaScript](https://hacks.mozilla.org/2012/06/using-window-matchmedia-to-do-media-queries-in-javascript/)
