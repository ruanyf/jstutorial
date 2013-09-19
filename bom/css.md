---
title: CSS
layout: page
category: bom
date: 2013-02-08
modifiedOn: 2013-09-19
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

matchMedia方法可以根据一条Media Query查询，返回一个MediaQueryList对象。

{% highlight javascript %}

var mqlObject = window.matchMedia("(min-width: 400px)");

{% endhighlight %}

上面代码针对“min-width: 400px”这条查询，返回了一个MediaQueryList对象。

### MediaQueryList对象

MediaQueryList对象可以视作对一条特定Media Query的封装。

它的matches属性，返回一个布尔值，表示当前媒介是否符合指定的Media Query查询。

{% highlight javascript %}

var mql = window.matchMedia("(min-width: 400px)");

mql.matched // true

{% endhighlight %}

上面代码的matches为true，表示当前媒介的宽度大于400像素。

MediaQueryList对象还允许指定回调函数，一旦当前媒介符合指定的Media Query查询，就调用回调函数。

{% highlight javascript %}

var mql = window.matchMedia("(min-width: 400px)");

// 指定回调函数
mql.addListener(mqCallback);

// 撤销回调函数
mql.removeListener(mqCallback);

{% endhighlight %}

回调函数的调用，可能存在两种情况。一种是媒介宽度从400像素以上变为以下，另一种是从400像素以下变为以上。所以在回调函数内部要判断一下当前的屏幕宽度。

{% highlight javascript %}

function mqCallback(mql) {
  if (mql.matches) {
    // 宽度大于等于400像素
  } else {
    // 宽度小于400像素
  }
}

{% endhighlight %}

从上面代码可以看到，回调函数调用的时候，Media Query对象会作为它的参数。

## 参考链接

- Mozilla Developer Network, [Using CSS animations](https://developer.mozilla.org/en-US/docs/CSS/Tutorials/Using_CSS_animations)
- Ryan Morr, [Detecting CSS Style Support](http://ryanmorr.com/detecting-css-style-support/)
- Mozilla Developer Network, [Testing media queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Testing_media_queries)
