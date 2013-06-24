---
title: history对象
layout: page
category: bom 
date: 2012-12-22
modifiedOn: 2013-06-24
---

## 概述

浏览器窗口有一个history对象，用来保存浏览历史。

比如，返回前一个浏览的页面，可以使用下面的方法：

{% highlight javascript %}

window.history.back();

{% endhighlight %}

它的效果等同于点击浏览器的倒退按钮。

如果倒退之后，再想回到倒退之前浏览的页面，则可以使用forward()方法。

{% highlight javascript %}

window.history.forward();

{% endhighlight %}

根据当前所处的页面，返回浏览历史中的其他页面，可以使用go()方法。back()相当于go(-1)。

{% highlight javascript %}

window.history.go(-1);

{% endhighlight %}

forward()相当于go(1)。

{% highlight javascript %}

window.history.go(1);

{% endhighlight %}

当前窗口的浏览历史总长度，保存在length属性。

{% highlight javascript %}

var numberOfEntries = window.history.length;

{% endhighlight %}

## pushState方法和replaceState方法

HTML5为history对象添加了两个新方法，history.pushState() 和 history.replaceState()，用来在浏览历史中添加和修改记录。

pushState方法接受三个参数，依次为：

- state对象：一个与当前网址相关的对象。如果不输入这个值，此处填null。
- title：新页面的标题，但是所有浏览器目前都忽略这个值。如果不输入这个值，此处填null。
- url：新的网址，必须与当前页面处在同一个域。

假定当前网址是1.html，我们使用pushState方法在浏览记录中添加一个新记录。

{% highlight javascript %}

var stateObj = { foo: "bar" };

history.pushState(stateObj, "page 2", "2.html");

{% endhighlight %}

添加这个新记录后，浏览器并不会跳转到2.html，甚至也不会检查2.html是否存在，它只是成为浏览历史中的最新记录。假定这时你访问了google.com，然后点击了倒退按钮，页面的url将显示2.html，但是内容还是原来的1.html。你再点击一次倒退按钮，url将显示1.html，内容不变。

如果 pushState 的url参数，设置了一个当前网页的#号值（即hash），并不会触发hashchange事件。

replaceState 的参数与 pushState 一模一样，它修改浏览历史中当前页面的值。

假定当前网页是http://example.com/example.html。

{% highlight javascript %}

history.pushState({page: 1}, "title 1", "?page=1");
history.pushState({page: 2}, "title 2", "?page=2");
history.replaceState({page: 3}, "title 3", "?page=3");
history.back(); // url显示为http://example.com/example.html?page=1
history.back(); // url显示为http://example.com/example.html
history.go(2);  // url显示为http://example.com/example.html?page=3

{% endhighlight %}

## popstate事件

每当浏览历史（即history对象）出现变化时，就会触发popstate事件。这就是说，不管是点击倒退按钮，还是使用pushState和replaceState方法，这个事件都会触发。

可以为popstate事件指定回调函数。这个回调函数的参数是一个event事件对象，它的state属性指向pushState和replaceState方法为当前url所提供的state对象（也就是这两个方法的第一个参数）。

{% highlight javascript %}

window.onpopstate = function(event) {
  alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
};

{% endhighlight %}

上面代码中的event.state，就是通过pushState和replaceState方法，为当前url绑定的state对象。

这个state对象也可以直接通过history对象读取。

{% highlight javascript %}

var currentState = history.state;

{% endhighlight %}

## 参考链接

- MOZILLA DEVELOPER NETWORK，[Manipulating the browser history](https://developer.mozilla.org/en-US/docs/DOM/Manipulating_the_browser_history)
- MOZILLA DEVELOPER NETWORK，[window.onpopstate](https://developer.mozilla.org/en-US/docs/DOM/window.onpopstate)
- Johnny Simpson, [Controlling History: The HTML5 History API And ‘Selective’ Loading](http://www.inserthtml.com/2013/06/history-api/)
