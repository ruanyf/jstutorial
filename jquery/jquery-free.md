---
title: 如何做到 jQuery-free？
layout: page
category: jquery
date: 2013-05-11
modifiedOn: 2013-07-01
---

## 概述

jQuery是最流行的JavaScript工具库。据[统计](http://w3techs.com/technologies/details/js-jquery/all/all)，目前全世界57.3%的网站使用它。也就是说，10个网站里面，有6个使用jQuery。如果只考察使用工具库的网站，这个比例就会上升到惊人的91.7%。

jQuery如此受欢迎，以至于有被滥用的趋势。许多开发者不管什么样的项目，都一股脑使用jQuery。但是，jQuery本质只是一个中间层，提供一套统一易用的DOM操作接口，消除浏览器之间的差异。多了这一层中间层，操作的性能和效率多多少少会打一些折扣。

2006年，jQuery诞生的时候，主要是为了解决IE6与标准的不兼容问题。如今的[情况](http://en.wikipedia.org/wiki/Usage_share_of_web_browsers)已经发生了很大的变化。IE的市场份额不断下降，以ECMAScript为基础的JavaScript标准语法，正得到越来越广泛的支持，不同浏览器对标准的支持越来越好、越来越趋同。开发者直接使用JavScript标准语法，就能同时在各大浏览器运行，不再需要通过jQuery获取兼容性。

另一方面，jQuery臃肿的[体积](http://mathiasbynens.be/demo/jquery-size)也让人头痛不已。jQuery 2.0的原始大小为235KB，优化后为81KB；如果是支持IE6、7、8的jQuery 1.8.3，原始大小为261KB，优化后为91KB。即使有CDN，浏览器加载这样大小的脚本，也会产生不小的开销。

所以，对于一些不需要支持老式浏览器的小型项目来说，不使用jQuery，直接使用DOM原生接口，可能是更好的选择。开发者有必要了解，jQuery的一些常用操作所对应的DOM写法。而且，理解jQuery背后的原理，会帮助你更好地使用jQuery。要知道有一种极端的说法是，如果你不理解一样东西，就不要使用它。

下面就探讨如何用JavaScript标准语法，取代jQuery的一些主要功能，做到jQuery-free。

## 选取DOM元素

jQuery的核心是通过各种选择器，选中DOM元素，可以用querySelectorAll方法模拟这个功能。

{% highlight javascript %}

var $ = document.querySelectorAll.bind(document);

{% endhighlight %}

这里需要注意的是，querySelectorAll方法返回的是NodeList对象，它很像数组（有数字索引和length属性），但不是数组，不能使用pop、push等数组特有方法。如果有需要，可以考虑将Nodelist对象转为数组。

{% highlight javascript %}

myList = Array.prototype.slice.call(myNodeList);

{% endhighlight %}

## DOM操作

DOM本身就具有很丰富的操作方法，可以取代jQuery提供的操作方法。

尾部追加DOM元素。

{% highlight javascript %}

// jQuery写法
$(parent).append($(child));

// DOM写法
parent.appendChild(child)

{% endhighlight %}

头部插入DOM元素。

{% highlight javascript %}

// jQuery写法
$(parent).prepend($(child));

// DOM写法
parent.insertBefore(child, parent.childNodes[0])

{% endhighlight %}

删除DOM元素。

{% highlight javascript %}

// jQuery写法
$(child).remove()

// DOM写法
child.parentNode.removeChild(child)

{% endhighlight %}

## 事件的监听

jQuery的on方法，完全可以用addEventListener模拟。

{% highlight javascript %}

Element.prototype.on = Element.prototype.addEventListener;

{% endhighlight %}

为了使用方便，可以在NodeList对象上也部署这个方法。

{% highlight javascript %}

NodeList.prototype.on = function (event, fn) {

	[]['forEach'].call(this, function (el) {
		el.on(event, fn);
    });

    return this;

};

{% endhighlight %}

## 事件的触发

jQuery的trigger方法则需要单独部署，相对复杂一些。

{% highlight javascript %}

Element.prototype.trigger = function (type, data) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(type, true, true);
    event.data = data || {};
    event.eventName = type;
    event.target = this;
    this.dispatchEvent(event);
    return this;
};

{% endhighlight %}

在NodeList对象上也部署这个方法。

{% highlight javascript %}

NodeList.prototype.trigger = function (event) {

	[]['forEach'].call(this, function (el) {

		el['trigger'](event);

	});

    return this;
};

{% endhighlight %}

## document.ready

目前的最佳实践，是将JavaScript脚本文件都放在页面底部加载。这样的话，其实document.ready方法（jQuery简写为$(function)）已经不必要了，因为等到运行的时候，DOM对象已经生成了。

## attr方法

jQuery使用attr方法，读写网页元素的属性。

{% highlight javascript %}

$("#picture").attr("src", "http://url/to/image");

{% endhighlight %}

DOM元素允许直接读取属性值，写法要简洁许多。

{% highlight javascript %}

$("#picture").src = "http://url/to/image";

{% endhighlight %}

需要注意，input元素的this.value返回的是输入框中的值，链接元素的this.href返回的是绝对URL。如果需要用到这两个网页元素的属性准确值，可以用this.getAttribute('value')和this.getAttibute('href')。

## addClass方法

jQuery的addClass方法，用于为DOM元素添加一个class。

{% highlight javascript %}

$('body').addClass('hasJS');

{% endhighlight %}

DOM元素本身有一个可读写的className属性，可以用来操作class。

{% highlight javascript %}

document.body.className = 'hasJS';

// or

document.body.className += ' hasJS';

{% endhighlight %}

HTML 5还提供一个classList对象，功能更强大（IE 9不支持）。

{% highlight javascript %}

document.body.classList.add('hasJS');

document.body.classList.remove('hasJS');

document.body.classList.toggle('hasJS');

document.body.classList.contains('hasJS');

{% endhighlight %}

## CSS

jQuery的css方法，用来设置网页元素的样式。

{% highlight javascript %}

$(node).css( "color", "red" );

{% endhighlight %}

DOM元素有一个style属性，可以直接操作。

{% highlight javascript %}

element.style.color = "red”;;

// or

element.style.cssText += 'color:red';

{% endhighlight %}

## 数据储存

jQuery对象可以储存数据。

{% highlight javascript %}

$("body").data("foo", 52);

{% endhighlight %}

HTML 5有一个dataset对象，也有类似的功能（IE 10不支持），不过只能保存字符串。

{% highlight javascript %}

element.dataset.user = JSON.stringify(user);

element.dataset.score = score;

{% endhighlight %}

## Ajax

jQuery的Ajax方法，用于异步操作。

{% highlight javascript %}

$.ajax({
	type: "POST",
	url: "some.php",
	data: { name: "John", location: "Boston" }
}).done(function( msg ) {
	alert( "Data Saved: " + msg );
});

{% endhighlight %}

我们可以定义一个request函数，模拟Ajax方法。

{% highlight javascript %}

function request(type, url, opts, callback) {

	var xhr = new XMLHttpRequest();

	if (typeof opts === 'function') {
		callback = opts;
		opts = null;
	}

	xhr.open(type, url);

	var fd = new FormData();

	if (type === 'POST' && opts) {
		for (var key in opts) {
			fd.append(key, JSON.stringify(opts[key]));
		}
	}

	xhr.onload = function () {
		callback(JSON.parse(xhr.response));
	};
 
	xhr.send(opts ? fd : null);

}

{% endhighlight %}

然后，基于request函数，模拟jQuery的get和post方法。

{% highlight javascript %}

var get = request.bind(this, 'GET');

var post = request.bind(this, 'POST');

{% endhighlight %}

## 动画

jQuery的animate方法，用于生成动画效果。

{% highlight javascript %}

$foo.animate('slow', { x: '+=10px' })

{% endhighlight %}

jQuery的动画效果，很大部分基于DOM。但是目前，CSS 3的动画远比DOM强大，所以可以把动画效果写进CSS，然后通过操作DOM元素的class，来展示动画。

{% highlight javascript %}

foo.classList.add('animate')

{% endhighlight %}

如果需要对动画使用回调函数，CSS 3也定义了相应的事件。

{% highlight javascript %}

el.addEventListener("webkitTransitionEnd", transitionEnded);

el.addEventListener("transitionend", transitionEnded);

{% endhighlight %}

## 替代方案

由于jQuery体积过大，替代方案层出不穷。

其中，最有名的是[zepto.js](http://zeptojs.com/)。它的设计目标是以最小的体积，做到最大兼容jQuery的API。它的1.0版的原始大小是55KB，优化后是29KB，gzip压缩后为10KB。

如果不求最大兼容，只希望模拟jQuery的基本功能。那么，[min.js](https://github.com/remy/min.js)优化后只有200字节，而[dolla](https://github.com/lelandrichardson/dolla)优化后是1.7KB。

此外，jQuery本身也采用模块设计，可以只选择使用自己需要的模块。具体做法参见jQuery的[github网站](https://github.com/jquery/jquery)，或者使用专用的[Web界面](http://projects.jga.me/jquery-builder/)。

## 参考链接

- Remy Sharp，[I know jQuery. Now what?](http://remysharp.com/2013/04/19/i-know-jquery-now-what/)
- Hemanth.HM，[Power of Vanilla JS](http://h3manth.com/new/blog/2013/power-of-vanilla-js/)
- Burke Holland, [5 Things You Should Stop Doing With jQuery](http://flippinawesome.org/2013/05/06/5-things-you-should-stop-doing-with-jquery/)
- Burke Holland, [Out-Growing jQuery](http://tech.pro/tutorial/1385/out-growing-jquery)
- Nicolas Bevacqua, [Uncovering the Native DOM API](http://flippinawesome.org/2013/06/17/uncovering-the-native-dom-api/)
