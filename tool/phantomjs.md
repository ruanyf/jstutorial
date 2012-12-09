---
layout: page
title: PhantomJS
date: 2012-12-08
category: tool
---

## 概述

有时，我们需要浏览器处理网页，但并不需要浏览，比如生成网页的截图。[PhantomJS](http://phantomjs.org/)的功能，就是提供浏览器环境的命令行接口。它的内核是V8引擎，与Chrome浏览器一样，但是不能用来浏览器，也不提供图形界面，只能在命令行下使用。我们可以用它完成一些特殊的用途。

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

## 实例：加载网页

下面，我们用PhantomJS加载网页。新建一个文本文件page.js，写入下面的代码：

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

接着，我们修改page.js，使它可以抓取网页截图。

{% highlight javascript %}

// page.js

var page = require('webpage').create();

page.open('http://slashdot.org', function () {
		var title = page.evaluate(function () {
        var posts = document.getElementsByClassName("article");
        posts[0].style.backgroundColor = "#FFF";
        return document.title;
    });
    page.clipRect = { top: 0, left: 0, width: 600, height: 700 };
    page.render(title + ".png");
    phantom.exit();
});

{% endhighlight %}

上面代码中的几个属性和方法解释如下：

- evaluate()：用来在网页上运行Javascript代码。在这里，我们抓取第一条新闻，然后修改背景颜色，并返回该条新闻的标题；
- clipRect：用来指定网页截图的大小，这里的截图左上角从网页的(0. 0)坐标开始，宽600像素，高700像素;
- render()：根据clipRect的范围，在当前目录下生成以第一条新闻的名字命名的截图。

## 参考链接

- [Testing JavaScript with PhantomJS](http://net.tutsplus.com/tutorials/javascript-ajax/testing-javascript-with-phantomjs/)
- [Phantom Quick Start](https://github.com/ariya/phantomjs/wiki/Quick-Start)
