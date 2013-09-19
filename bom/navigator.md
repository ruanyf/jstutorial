---
title: Navigator对象
layout: page
category: bom
date: 2013-09-19
modifiedOn: 2013-09-19
---

Navigator对象提供浏览器的相关信息。

## userAgent属性

userAgent属性返回浏览器发出的HTTP头信息User-Agent。

下面是Chrome浏览器的User-Agent。

{% highlight javascript %}

navigator.userAgent
// "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safari/537.36"

{% endhighlight %}

通过userAgent属性识别浏览器，不是一个好办法。因为必须考虑所有的情况，非常麻烦，而且无法保证未来的适用性，更何况各种上网设备层出不穷，难以穷尽。所以，现在一般不再识别浏览器了，而是逐一测试当前浏览器，是否支持要用到的JavaScript功能。

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
