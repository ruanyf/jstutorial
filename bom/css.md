---
title: CSS
layout: page
category: bom
date: 2013-02-08
modifiedOn: 2013-04-18
---

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

## 参考链接

- MDN, [Using CSS animations](https://developer.mozilla.org/en-US/docs/CSS/Tutorials/Using_CSS_animations)
