---
title: history对象
layout: page
category: bom 
date: 2012-12-22
modifiedOn: 2014-05-06
---

## 概述

浏览器窗口有一个history对象，用来保存浏览历史。比如，该窗口先后访问了三个地址，那么history对象就包括三项，length属性等于3。

{% highlight javascript %}

history.length // 3

{% endhighlight %}

history对象提供了一系列方法，允许在浏览历史之间移动。

- back()：移动到上一个访问页面，等同于浏览器的后退键。
- forward()：移动到下一个访问页面，等同于浏览器的前进键。
- go()：接受一个整数作为参数，移动到该整数指定的页面，比如go(1)相当于forward()，go(-1)相当于back()。

{% highlight javascript %}

history.back();
history.forward();
history.go(-2);

{% endhighlight %}

如果移动的位置超出了访问历史的边界，以上三个方法并不报错，而是默默的失败。

以下命令相当于刷新当前页面。

```javascript

history.go(0);

```

## history.pushState()，history.replaceState()

HTML5为history对象添加了两个新方法，history.pushState() 和 history.replaceState()，用来在浏览历史中添加和修改记录。所有主流浏览器都支持该方法（包括IE10）。


```javascript

if (!!(window.history && history.pushState)){
  // 支持History API
} else {
  // 不支持
}

```

上面代码可以用来检查，当前浏览器是否支持History API。如果不支持的话，可以考虑使用Polyfill库[History.js]( https://github.com/browserstate/history.js/)。

history.pushState方法接受三个参数，依次为：

- **state**：一个与指定网址相关的状态对象，popstate事件触发时，该对象会传入回调函数。如果不需要这个对象，此处可以填null。
- **title**：新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填null。
- **url**：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址。

假定当前网址是`example.com/1.html`，我们使用pushState方法在浏览记录（history对象）中添加一个新记录。

{% highlight javascript %}

var stateObj = { foo: "bar" };

history.pushState(stateObj, "page 2", "2.html");

{% endhighlight %}

添加上面这个新记录后，浏览器地址栏立刻显示`example.com/2.html`，但并不会跳转到2.html，甚至也不会检查2.html是否存在，它只是成为浏览历史中的最新记录。假定这时你访问了google.com，然后点击了倒退按钮，页面的url将显示2.html，但是内容还是原来的1.html。你再点击一次倒退按钮，url将显示1.html，内容不变。

> 注意，pushState方法不会触发页面刷新。

如果 pushState 的url参数，设置了一个当前网页的#号值（即hash），并不会触发hashchange事件。如果设置了一个非同域的网址，则会报错。

```javascript

// 报错
history.pushState(null, null, 'https://twitter.com/hello');

```

上面代码中，pushState想要插入一个非同域的网址，导致报错。这样设计的目的是，防止恶意代码让用户以为他们是在另一个网站上。

history.replaceState方法的参数与pushState方法一模一样，区别是它修改浏览历史中当前页面的值。假定当前网页是example.com/example.html。

{% highlight javascript %}

history.pushState({page: 1}, "title 1", "?page=1");
history.pushState({page: 2}, "title 2", "?page=2");
history.replaceState({page: 3}, "title 3", "?page=3");
history.back(); // url显示为http://example.com/example.html?page=1
history.back(); // url显示为http://example.com/example.html
history.go(2);  // url显示为http://example.com/example.html?page=3

{% endhighlight %}

## history.state属性

history.state属性保存当前页面的state对象。

```javascript

history.pushState({page: 1}, "title 1", "?page=1");

history.state
// { page: 1 }

```

## popstate事件

每当同一个文档的浏览历史（即history对象）出现变化时，就会触发popstate事件。需要注意的是，仅仅调用pushState方法或replaceState方法 ，并不会触发该事件，只有用户点击浏览器倒退按钮和前进按钮，或者使用JavaScript调用back、forward、go方法时才会触发。另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

使用的时候，可以为popstate事件指定回调函数。这个回调函数的参数是一个event事件对象，它的state属性指向pushState和replaceState方法为当前url所提供的状态对象（即这两个方法的第一个参数）。

{% highlight javascript %}

window.onpopstate = function(event) {
  console.log("location: " + document.location);
  console.log("state: " + JSON.stringify(event.state));
};

// 或者

window.addEventListener('popstate', function(event) {  
  console.log("location: " + document.location);
  console.log("state: " + JSON.stringify(event.state));  
}); 

{% endhighlight %}

上面代码中的event.state，就是通过pushState和replaceState方法，为当前url绑定的state对象。

这个state对象也可以直接通过history对象读取。

{% highlight javascript %}

var currentState = history.state;

{% endhighlight %}

另外，需要注意的是，当页面第一次加载的时候，在onload事件发生后，Chrome和Safari浏览器（Webkit核心）会触发popstate事件，而Firefox和IE浏览器不会。 

## 参考链接

- MOZILLA DEVELOPER NETWORK，[Manipulating the browser history](https://developer.mozilla.org/en-US/docs/DOM/Manipulating_the_browser_history)
- MOZILLA DEVELOPER NETWORK，[window.onpopstate](https://developer.mozilla.org/en-US/docs/DOM/window.onpopstate)
- Johnny Simpson, [Controlling History: The HTML5 History API And ‘Selective’ Loading](http://www.inserthtml.com/2013/06/history-api/)
- Louis Lazaris, [HTML5 History API: A Syntax Primer](http://www.impressivewebs.com/html5-history-api-syntax/)
