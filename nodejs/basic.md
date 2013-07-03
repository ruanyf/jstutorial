---
title: Node.js 概述
layout: page
category: nodejs
date: 2013-01-14
modifiedOn: 2013-06-16
---

## 简介

Node.js是JavaScript在服务器端的一个运行环境，也是一个工具库，用来与服务器端其他软件互动。

访问官方网站[nodejs.org](http://nodejs.org)了解安装细节。安装完成以后，运行下面的命令，查看是否能正常运行。

{% highlight bash %}

node --version

{% endhighlight %}

运行node.js程序，就是使用node命令读取Javascript脚本。

{% highlight bash %}

node file.js

{% endhighlight %}

## 非同步操作

Node.js采用V8引擎处理JavaScript脚本，最大特征就是单线程运行，即一次只能运行一个任务。这导致Node.js大量采用非同步操作（asynchronous opertion），任务不是马上执行，而是插在队列的尾部，等到前面的任务运行完后再执行。

由于这种特性，某一个任务的后续操作，往往采用回调函数（callback）的形式进行定义，即指定任务完成时，执行某个函数。Node.js的任务通常是下面的写法。

{% highlight javascript %}

doSomething(aThing, function (err, newThing) {
  // . . .
});

{% endhighlight %}

doSomething表示某个任务，aThing就是运行这个任务所需的参数，function(err, newThing)则是任务完成后的回调函数。值得注意是，回调函数的格式也有约定，即第一个参数err是表示错误的对象，第二个参数newThing才是回调函数的真正参数。

如果doSomething运行出现错误，则抛出err对象，回调函数必须做相应处理。

{% highlight javascript %}

doSomething(aThing, function (err, newThing) {
			if (err) return handleError(err);
			// . . .
});

{% endhighlight %}

如果没有发生错误，err对象的值就是null。

## 加载模块

node.js采用模块化结构，按照[CommonJS规范](http://wiki.commonjs.org/wiki/CommonJS)定义和使用模块。

require命令用于指定加载模块。

{% highlight javascript %}

var otherModule = require('otherModule');

{% endhighlight %}

require接受的参数不是模块的名称，而是模块的路径。

{% highlight javascript %}

require('../otherModule');

{% endhighlight %}

然后，就可以调用模块中定义的方法了。

{% highlight javascript %}

otherModule.someFunction();

{% endhighlight %}

## 定义模块

模块的定义也是采用CommonJS规范。

在一个单独文件中，用require命令调用所依赖的模块，然后在exports对象上输出对外接口。

{% highlight javascript %}

var M1 = require( "module1" );
var M2 = require( "module2" );    

exports.newModule = function() {
    M1.methodA();
    M2.methodB();
};

{% endhighlight %}

## 实例：搭建一个HTTP服务器

使用Node.js搭建HTTP服务器非常简单。

{% highlight javascript %}

var http = require("http");

var app = http.createServer(function(request, response) {
  response.writeHead(200, {
    "Content-Type": "text/plain"
  });
  response.end("Hello world!\n");
});

app.listen(1337, "localhost");
console.log("Server running at http://localhost:1337/");

{% endhighlight %}

第一行 var http = require("http")，表示加载http模块。然后，调用http模块的createServer方法，创造一个服务器实例，将它赋给变量app。

ceateServer方法接受一个函数作为参数，该函数的request参数是一个对象，表示客户端的HTTP请求；response参数也是一个对象，表示服务器端的HTTP回应。response.writeHead方法表示，服务器端回应一个HTTP头信息；response.end方法表示，服务器端回应的具体内容，以及回应完成后关闭本次对话。

最后的app.listen(1337, "localhost")，表示启动服务器实例，监听本机的1337端口。然后，使用console.log在控制台输出一行提示信息。

将上面这几行代码保存成文件app.js，然后用node调用这个文件，服务器就开始运行了。

{% highlight bash %}

node app.js

{% endhighlight %}

这时命令行窗口将显示一行提示“Server running at http://localhost:1337/”。打开浏览器，访问http://localhost:1337，网页显示“Hello world!”。

将app.js稍加修改，就可以做出一个网站的雏形，请求不同的网址，会显示不同的内容。

{% highlight javascript %}

var http = require("http");

http.createServer(function(req, res) {

  // Homepage
  if (req.url == "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Welcome to the homepage!");
  }

  // About page
  else if (req.url == "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Welcome to the about page!");
  }

  // 404'd!
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 error! File not found.");
  }

}).listen(1337, "localhost");

{% endhighlight %}

## http模块

### POST方法

{% highlight javascript %}

var http = require('http');

http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    console.log('POSTed: ' + body);
    res.writeHead(200);
    res.end();
  });
}).listen(8080);

{% endhighlight %}

## 库管理器npm

### npm简介

npm是Node.js默认的包管理器，用来安装和管理第三方node模块。在安装node的时候，会连带一起安装。可以用下面的命令，查看npm的版本。

{% highlight bash %}

npm -version

{% endhighlight %}

再查看一下npm的默认设置。

{% highlight bash %}

npm config list -l

{% endhighlight %}

npm的版本可以在Node.js更新的时候一起更新。如果你想单独更新npm，使用下面的命令。

{% highlight bash %}

npm update -global npm

{% endhighlight %}

### 库的安装

每个库可以“全局安装”，也可以“本地安装”。两者的差异是库的安装位置，以及调用方法。“全局安装”指的是将一个库直接下载到Node.js的安装目录中，然后所有项目都可以调用这个库。“本地安装”指的是将一个库下载到当前目录，然后只有在这个目录和它的子目录之中，才能调用这个库。

默认情况下，npm install 命令是“本地安装”某个库。库文件将下载到当前目录的 node_modules 子目录。

{% highlight bash %}

npm install [package name]

{% endhighlight %}

使用global参数，可以“全局安装”某个库。

{% highlight bash %}

sudo npm install -global [package name]

{% endhighlight %}

global参数可以被简化成g参数。

{% highlight bash %}

sudo npm install -g [package name]

{% endhighlight %}

install命令总是安装最新版本的库，如果要安装特定版本的库，可以在库名后面加上@和版本号。

{% highlight bash %}

npm install package_name@version

{% endhighlight %}

一旦安装了某个库，就可以在代码中用require命令调用这个库。

{% highlight javascript %}

var backbone = require('backbone')

console.log(backbone.VERSION)

{% endhighlight %}

### 库的升级和删除

npm update 命令可以升级本地安装的包。

{% highlight bash %}

npm update [package name]

{% endhighlight %}

加上global参数，可以升级全局安装的库。

{% highlight bash %}

npm update -global [package name]

{% endhighlight %}

npm uninstall 命令，删除本地安装的库。

{% highlight bash %}

npm uninstall [package name]

{% endhighlight %}

加上global参数，可以删除全局安装的库。

{% highlight bash %}

sudo npm uninstall [package name] -global

{% endhighlight %}

### 库的查看和搜索

npm list命令，默认列出当前目录安装的所有库。如果使用global参数，就是列出全局安装的库。

{% highlight bash %}

npm list

npm -global list

{% endhighlight %}

搜索某个库，可以使用search命令。

{% highlight bash %}

npm search [search terms ...]

{% endhighlight %}

## 配置文件package.json

每个项目的根目录下面，一般都有一个package.json文件，定义了这个项目所需要的各种库，以及项目的配置（比如项目的名称、版本、许可证等元数据）。npm命令根据这个文件，自动下载这些库。所以，package.json 可以看作是npm命令的配置文件。

下面是一个虚拟的package.json文件。

{% highlight javascript %}

{
  "name":"name",
  "preferGlobal":false,
  "version":"0.0.0",
  "author":"john doe",
  "description":"",
  "bugs":{"url":"http://github.com/owner/project/issues","email":""},
  "contributors":[{"name":"John Bow","email":"johnbow@jb.com"}],
  "bin":{"http-server":"./bin/http-server"},
  "scripts":{"start":"node ./bin/http-server"},
  "main":"./lib/http-server",
  "repository":{"type":"git","url":"https://github.com/jd"},
  "keywords":["cli","http","server"],
  "dependencies":{"package":"0.1.x"},
  "analyze":false,
  "devDependencies":{"package":"0.5.x"},
  "bundledDependencies":["package"],
  "license":"MIT",
  "files":[],
  "man":{},
  "config":{},
  "engines":{"node":">=0.6"},
  "engineStrict":true,
  "os":"darwin",
  "cpu":"x64",
  "private":false,
  "publishConfig":{}
}

{% endhighlight %}

最简单的生成 package.json 文件的方式，就是使用 npm init 命令。这个命令采用互动方式，要求用户回答一些问题，然后在当前目录生成一个基本的 package.json 文件。所有问题之中，只有项目名称（name）和项目版本（version）是必填的，其他都是选填的。

有了package.json文件，直接使用npm install命令，就会在当前目录中安装文件指定的包。

{% highlight bash %}

npm install

{% endhighlight %}

如果一个库不在 package.json 文件之中，可以在安装的时候加上--save-dev，这个库就会自动被加入 package.json 文件。

## 参考链接

- Cody Lindley, [Package Managers: An Introductory Guide For The Uninitiated Front-End Developer](http://tech.pro/tutorial/1190/package-managers-an-introductory-guide-for-the-uninitiated-front-end-developer)
