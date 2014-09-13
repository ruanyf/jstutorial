---
title: Browserify：浏览器加载Node.js模块
layout: page
category: tool
date: 2014-01-02
modifiedOn: 2014-01-14
---

随着JavaScript程序逐渐模块化，在ECMAScript 6推出官方的模块处理方案之前，有两种方案在实践中广泛采用：一种是AMD模块规范，针对模块的异步加载，主要用于浏览器端；另一种是CommonJS规范，针对模块的同步加载，主要用于服务器端，即node.js环境。

Browserify是一个node.js模块，主要用于改写现有的CommonJS模块，使得浏览器端也可以使用这些模块。使用下面的命令，在全局环境下安装Browserify。

{% highlight bash %}

npm install -g browserify

{% endhighlight %}

## 实例：简单应用

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

# 或者

browserify main > compiled.js

# 或者

browserify main.js -o compiled.js

{% endhighlight %}

之所以转化后的文件叫做compiled.js，是因为该文件不仅包括了main.js，还包括了它所依赖的foo.js。两者打包在一起，保证浏览器加载时的依赖关系。

{% highlight html %}

<script src="compiled.js"></script>

{% endhighlight %}

使用上面的命令，在浏览器中运行compiled.js，控制台会显示Hi。

## 实例：backbone的应用

我们再看一个在服务器端的backbone模块转为客户端backbone模块的例子。

先安装backbone和它所依赖的jQuery模块。

{% highlight bash %}

npm install backbone jquery

{% endhighlight %}

然后，新建一个main.js文件。

{% highlight javascript %}

// main.js

var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery/dist/jquery')(window);

var AppView = Backbone.View.extend({
  render: function(){
    $('main').append('<h1>Browserify is a great tool.</h1>');
  }
});

var appView = new AppView();
appView.render();

{% endhighlight %}

接着，使用browserify将main.js转为app.js。

{% highlight bash %}

browserify main.js -o app.js

{% endhighlight %}

app.js就可以直接插入HTML网页了。

{% highlight html %}

<script src="app.js"></script>

{% endhighlight %}

注意，只要插入app.js一个文件就可以了，完全不需要再加载backbone.js和jQuery了。

## 生成模块

有时，我们只是希望将node.js的模块，移植到浏览器，使得浏览器端可以调用。这时，可以采用browserify的-r参数（--require的简写）。

{% highlight bash %}

browserify -r through -r ./my-file.js:my-module > bundle.js

{% endhighlight %}

上面代码将through和my-file.js（后面的冒号表示指定模块名为my-module）都做成了模块，可以在其他script标签中调用。

{% highlight html %}

<script src="bundle.js"></script>
<script>
  var through = require('through');
  var myModule = require('my-module');
  /* ... */
</script>

{% endhighlight %}

可以看到，-r参数的另一个作用，就是为浏览器端提供require方法。

## 脚本文件的实时生成

Browserify还可以实时生成脚本文件。

```javascript

var browserify = require('browserify');
var http = require('http');

http.createServer(function (req, res) {
    if (req.url === '/bundle.js') {
        res.setHeader('content-type', 'application/javascript');
        var b = browserify(__dirname + '/main.js').bundle();
        b.on('error', console.error);
        b.pipe(res);
    }
    else res.writeHead(404, 'not found')
});

```

## browserify-middleware模块

上面是将服务器端模块直接转为客户端脚本，然后在网页中调用这个转化后的脚本文件。还有一种思路是，在运行时动态转换模块，这就需要用到[browserify-middleware模块](https://github.com/ForbesLindesay/browserify-middleware)。

比如，网页中需要加载app.js，它是从main.js转化过来的。

{% highlight html %}

<!-- index.html -->

<script src="app.js"></script>

{% endhighlight %}

你可以在服务器端静态生成一个app.js文件，也可以让它动态生成。这就需要用browserify-middleware模块，服务器端脚本要像下面这样写。

{% highlight javascript %}

var browserify = require('browserify-middleware');
var express = require('express');
var app = express();

app.get('/app.js', browserify('./client/main.js'));

app.get('/', function(req, res){
  res.render('index.html');
});

{% endhighlight %}

## 参考链接

- Jack Franklin, [Dependency Management with Browserify](http://javascriptplayground.com/blog/2013/09/browserify/)
- Seth Vincent, [Using Browserify with Express](http://learnjs.io/blog/2013/12/22/express-and-browserify/)
- Patrick Mulder, [Browserify - Unix in the browser](http://thinkingonthinking.com/unix-in-the-browser/)
- Patrick Catanzariti, [Getting Started with Browserify](http://www.sitepoint.com/getting-started-browserify/)
