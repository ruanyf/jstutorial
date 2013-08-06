---
layout: page
title: PhantomJS
date: 2012-12-08
category: tool
modifiedOn: 2013-08-07
---

## 概述

有时，我们需要浏览器处理网页，但并不需要浏览，比如生成网页的截图、抓取网页数据等等。[PhantomJS](http://phantomjs.org/)的功能，就是提供一个浏览器环境的命令行接口，你可以把它看作一个“虚拟浏览器”，除了不能浏览，其他与正常浏览器一样。它的内核是V8引擎，不提供图形界面，只能在命令行下使用，我们可以用它完成一些特殊的用途。

PhantomJS是二进制程序，需要[安装](http://phantomjs.org/download.html)后使用。使用下面的命令，查看是否安装成功。

{% highlight javascript %}

phantomjs --version

{% endhighlight %}

## Javascript运行环境

phantomjs提供了一个完整的Javascript运行环境。键入phantomjs，就进入了该环境。

{% highlight bash %}

$ phantomjs

{% endhighlight %}

这时会跳出一个phantom提示符，就可以输入Javascript命令了。

{% highlight bash %}

phantomjs> 1+2
3

phantomjs> function add(a,b) { return a+b; }
undefined

phantomjs> add(1,2)
3

phantomjs> 

{% endhighlight %}

按ctrl+c可以退出该环境。

下面，我们把上面的add()函数写成一个文件add.js文件。

{% highlight javascript %}

// add.js

function add(a,b){ return a+b; }

console.log(add(1,2));

phantom.exit();

{% endhighlight %}

上面的代码中，console.log()的作用是在终端窗口显示，phantom.exit()则表示退出phantomjs环境。一般来说，不管什么样的程序，这一行都不能少。

现在，运行该程序：

{% highlight bash %}

$ phantomjs add.js

{% endhighlight %}

终端窗口就会显示结果为3。

## 网页的加载与截图

### 加载

下面，我们用PhantomJS加载网页。

新建一个文本文件page.js，写入下面的代码：

{% highlight javascript %}

// page.js

var page = require('webpage').create();

page.open('http://slashdot.org', function (s) {
    console.log(s);
    phantom.exit();
});

{% endhighlight %}

第一行require('webpage').create() 表示加载网页模块，并创建一个实例。

第二行open()方法，接受两个参数。第一个参数是网页的网址，这里我们打开的是著名新闻网站[Slashdot](http://slashdot.org)，第二个参数是回调函数，当网页打开后，该函数将会运行，它的参数是状态提示（status），如果打开成功，该参数的值就是success。运行page.js，屏幕将会显示success。

### 接受参数

修改page.js，使得它可以从命令行接受参数。

system模块可以加载操作系统变量，system.args就是参数数组。

{% highlight javascript %}

var page = require('webpage').create(),
    system = require('system'),
    t, address;

// 如果命令行没有给出网址
if (system.args.length === 1) {
    console.log('Usage: page.js <some URL>');
    phantom.exit();
}

t = Date.now();
address = system.args[1];
page.open(address, function (status) {
    if (status !== 'success') {
        console.log('FAIL to load the address');
    } else {
        t = Date.now() - t;
        console.log('Loading time ' + t + ' ms');
    }
    phantom.exit();
});

{% endhighlight %}

使用方法如下：

{% highlight javascript %}

phantomjs page.js http://www.google.com

{% endhighlight %}

### 截图

最简单的生成网页截图的方法如下：

{% highlight javascript %}

var page = require('webpage').create();
page.open('http://google.com', function () {
    page.render('google.png');
    phantom.exit();
});

{% endhighlight %}

page对象代表一个网页实例；open方法表示打开某个网址，它的第一个参数是目标网址，第二个参数是网页载入成功后，运行的回调函数;render方法则是渲染页面，然后以图片格式输出，该方法的参数就是输出的图片文件名。

除了简单截图以外，还可以设置各种截图参数。

{% highlight javascript %}

var page = require('webpage').create();
page.open('http://google.com', function () {
    page.zoomFactor = 0.25;
    console.log(page.renderBase64());
    phantom.exit();
});

{% endhighlight %}

zoomFactor表示将截图缩小至原图的25%大小；renderBase64方法则是表示将截图（PNG格式）编码成Base64格式的字符串输出。

下面的例子则是使用了更多参数。

{% highlight javascript %}

// page.js

var page = require('webpage').create();

page.settings.userAgent = 'WebKit/534.46 Mobile/9A405 Safari/7534.48.3';

page.settings.viewportSize = { width: 400, height: 600 };

page.open('http://slashdot.org', function (status) {

	if (status !== 'success') {
        console.log('Unable to load!');
        phantom.exit();
    } else {

		var title = page.evaluate(function () {
			var posts = document.getElementsByClassName("article");
			posts[0].style.backgroundColor = "#FFF";
			return document.title;
		});

		page.clipRect = { top: 0, left: 0, width: 600, height: 700 };
		page.render(title + "1.png");
		page.clipRect = { left: 0, top: 600, width: 400, height: 600 };
        page.render(title + '2.png');
		phantom.exit();

	}

});

{% endhighlight %}

上面代码中的几个属性和方法解释如下：

- settings.userAgent：指定HTTP请求的userAgent头信息，上面例子是手机浏览器的userAgent。
- settings.viewportSize：指定浏览器窗口的大小，这里是400x600。
- evaluate()：用来在网页上运行Javascript代码。在这里，我们抓取第一条新闻，然后修改背景颜色，并返回该条新闻的标题。
- clipRect：用来指定网页截图的大小，这里的截图左上角从网页的(0. 0)坐标开始，宽600像素，高700像素。如果不指定这个值，就表示对整张网页截图。
- render()：根据clipRect的范围，在当前目录下生成以第一条新闻的名字命名的截图。

### 抓取图片

使用官方网站提供的[rasterize.js](https://github.com/ariya/phantomjs/blob/master/examples/rasterize.js)，可以抓取网络上的图片，将起保存在本地。

{% highlight javascript %}

phantomjs rasterize.js http://ariya.github.com/svg/tiger.svg tiger.png

{% endhighlight %}

使用[rasterize.js](https://github.com/ariya/phantomjs/blob/master/examples/rasterize.js)，还可以将网页保存为pdf文件。

{% highlight javascript %}

phantomjs rasterize.js 'http://en.wikipedia.org/w/index.php?title=Jakarta&printable=yes' jakarta.pdf

{% endhighlight %}

## 生成网页

phantomjs可以生成网页，使用content方法指定网页的HTML代码。

{% highlight javascript %}

var page = require('webpage').create();
page.viewportSize = { width: 400, height : 400 };
page.content = '<html><body><canvas id="surface"></canvas></body></html>';
phantom.exit();

{% endhighlight %}

官方网站有一个[例子](https://github.com/ariya/phantomjs/blob/master/examples/colorwheel.js)，通过创造svg图片，然后截图保存成png文件。

![](https://lh3.googleusercontent.com/-xSIzxPtJULw/TVzeP4NPMDI/AAAAAAAAB10/k-c8jB6I5Cg/s288/colorwheel.png)

## 参考链接

- [Testing JavaScript with PhantomJS](http://net.tutsplus.com/tutorials/javascript-ajax/testing-javascript-with-phantomjs/)
- [Phantom Quick Start](https://github.com/ariya/phantomjs/wiki/Quick-Start)
- Ariya Hidayat, [Web Page Clipping with PhantomJS](http://ariya.ofilabs.com/2013/04/web-page-clipping-with-phantomjs.html)
- BenjaminBenBen, [Using PhantomJS WebServer](http://benjaminbenben.com/2013/07/28/phantomjs-webserver/)
