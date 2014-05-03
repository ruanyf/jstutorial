---
title: Modernizr
category: library
layout: page
date: 2013-03-02
modifiedOn: 2013-03-02
---

## 概述

随着HTML5和CSS3加入越来越多的模块，检查各种浏览器是否支持这些模块，成了一大难题。Modernizr就是用来解决这个问题的一个JavaScript库。

首先，从modernizr.com下载这个库。下载的时候，可以选择所需要的模块。然后，将它插入HTML页面的头部，放在head标签之中。

{% highlight html %}

<!DOCTYPE html>
<html class="no-js" lang="en">

<head>
  <meta charset="utf-8">
  <script src="js/modernizr.js"></script>
</head>

</html>

{% endhighlight %}

## CSS的新增class

使用Modernizr以后，首先会把html元素的class替换掉。以chrome浏览器为例，新增的class大概是下面的样子。

{% highlight html %}

<html class="js no-touch postmessage history multiplebgs boxshadow opacity cssanimations csscolumns cssgradients csstransforms csstransitions fontface localstorage sessionstorage svg inlinesvg blobbuilder blob bloburls download formdata">

{% endhighlight %}

IE 7则是这样：

{% highlight html %}

<html class="js no-touch postmessage no-history no-multiplebgs no-boxshadow no-opacity no-cssanimations no-csscolumns no-cssgradients no-csstransforms no-csstransitions fontface localstorage sessionstorage no-svg no-inlinesvg wf-loading no-blobbuilder no-blob no-bloburls no-download no-formdata">

{% endhighlight %}

然后，就可以针对不同的CSS class，指定不同的样式。

{% highlight css %}

.button {
   background: #000;
   opacity: 0.75;
}

.no-opacity .button {
   background: #444;
}

{% endhighlight %}

## JavaScript侦测

除了提供新增的CSS class，Modernizr还提供JavaScript方法，用来侦测浏览器是否支持某个功能。

{% highlight javascript %}

Modernizr.cssgradients; //True in Chrome, False in IE7

Modernizr.fontface; //True in Chrome, True in IE7

Modernizr.geolocation; //True in Chrome, False in IE7

if (Modernizr.canvas){
	// 支持canvas
} else {
   // 不支持canvas
}

if (Modernizr.touch){
	// 支持触摸屏
} else {
   // 不支持触摸屏
}

{% endhighlight %}

## 加载器

Modernizr允许根据Javascript侦测的不同结果，加载不同的脚本文件。

{% highlight javascript %}

Modernizr.load({
  test :        Modernizr.localstorage,
  yep  :        'localStorage.js',
  nope :        'alt-storageSystem.js',
  complete :    function () { enableStorgeSaveUI();}
});

{% endhighlight %}

Modernizr.load方法用来加载脚本。它的属性如下：

- test：用来测试浏览器是否支持某个属性。
- yep：如果浏览器支持该属性，加载的脚本。
- nope：如果浏览器不支持该属性，加载的脚本。
- complete：加载完成后，运行的JavaScript代码。

可以指定在支持某个功能的情况，所要加载的JavaScript脚本和CSS样式。

{% highlight javascript %}

Modernizr.load({
  test : Modernizr.touch,
  yep :  ['js/touch.js', 'css/touchStyles.css']
});

{% endhighlight %}

## 参考链接

- Chris Griffith, [Up and running with Modernizr](http://www.adobe.com/devnet/html5/articles/up-and-running-with-modernizr.html)
