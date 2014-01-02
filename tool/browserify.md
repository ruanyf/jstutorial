---
title: Browserify：浏览器加载Node.js模块
layout: page
category: tool
date: 2014-01-02
modifiedOn: 2014-01-02
---

随着JavaScript程序逐渐模块化，在ECMAScript 6推出官方的模块处理方案之前，有两种方案在实践中广泛采用：一种是AMD模块规范，针对模块的异步加载，主要用于浏览器端；另一种是CommonJS规范，针对模块的同步加载，主要用于服务器端，即node.js环境。

Browserify是一个node.js模块，主要用于改写现有的CommonJS模块，使其可以在浏览器端运行。使用下面的命令，在全局环境下安装Browserify。

{% highlight bash %}

npm install -g browserify

{% endhighlight %}

## 实例

先看一个例子。假定有一个很简单的CommonJS模块文件foo.js。

{% highlight javascript %}

// foo.js

module.exports = function(x) {
    console.log(x);
};

{% endhighlight %}

然后，还有一个main.js文件，用来加载foo模块。

{% highlight javascript %}

// main.js

var foo = require("./foo");
foo("Hi");

{% endhighlight %}

使用Browserify，将main.js转化为浏览器可以加载的脚本compiled.js。

{% highlight bash %}

browserify main.js > compiled.js

{% endhighlight %}

之所以转化后的文件叫做compiled.js，是因为该文件不仅包括了main.js，还包括了它所依赖的foo.js。两者打包在一起，保证浏览器加载时的依赖关系。

{% highlight html %}

<script src="compiled.js"></script>

{% endhighlight %}

使用上面的命令，在浏览器中运行compiled.js，控制台会显示Hi。

## 参考链接

- Jack Franklin, [Dependency Management with Browserify](http://javascriptplayground.com/blog/2013/09/browserify/)
