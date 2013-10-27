---
title: window对象
layout: page
category: bom
date: 2013-09-19
modifiedOn: 2013-10-27
---

## 概述

JavaScript的所有对象都存在于一个运行环境之中，这个运行环境本身也是对象，称为“顶层对象”。这就是说，JavaScript的所有对象，都是“顶层对象”的下属。不同的运行环境有不同的“顶层对象”，在浏览器环境中，这个顶层对象就是window对象（w为小写）。

所有浏览器环境的全局变量，都是window对象的属性。

{% highlight javascript %}

var a = 1;
window.a // 1

{% endhighlight %}

可以简单理解成，window就是指当前的浏览器窗口。

### window.name属性

window.name属性用于设置当前浏览器窗口的名字。它有一个特点，就是浏览器刷新后，该属性保持不变。所以，可以把值存放在该属性内，然后跨页面、甚至跨域名使用。当然，这个值有可能被其他网站的页面改写。

{% highlight javascript %}

window.name = "Hello World!";
console.log(window.name);

{% endhighlight %}

各个浏览器对这个值的储存容量有所不同，但是一般来说，可以高达几MB。

该属性只能保存字符串，且当浏览器窗口关闭后，所保存的值就会消失。因此局限性比较大，但是与iFrame窗口通信时，非常有用。

## URL的编码/解码方法

JavaScript提供四个URL的编码/解码方法。

- decodeURI()
- decodeURIComponent()
- encodeURI()
- encodeURIComponent()

## Navigator属性

Window对象的Navigator属性，指向一个包含浏览器相关信息的对象。

### Navigator.userAgent属性

Navigator.userAgent属性返回浏览器的User-Agent字符串，用来标示浏览器的种类。下面是Chrome浏览器的User-Agent。

{% highlight javascript %}

navigator.userAgent
// "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safari/537.36"

{% endhighlight %}

通过userAgent属性识别浏览器，不是一个好办法。因为必须考虑所有的情况（不同的浏览器，不同的版本），非常麻烦，而且无法保证未来的适用性，更何况各种上网设备层出不穷，难以穷尽。所以，现在一般不再识别浏览器了，而是使用“功能识别”方法，即逐一测试当前浏览器是否支持要用到的JavaScript功能。

不过，通过userAgent可以大致准确地识别手机浏览器，方法就是测试是否包含“mobi”字符串。

{% highlight javascript %}

var ua = navigator.userAgent.toLowerCase();
 
if (/mobi/i.test(ua)) {
    // 手机浏览器
} else {
    // 非手机浏览器
}

{% endhighlight %}

如果想要识别所有移动设备的浏览器，可以测试更多的特征字符串。

{% highlight javascript %}

/mobi|android|touch|mini/i.test(ua)

{% endhighlight %}

## 参考链接

- Karl Dubost, [User-Agent detection, history and checklist](https://hacks.mozilla.org/2013/09/user-agent-detection-history-and-checklist/)
