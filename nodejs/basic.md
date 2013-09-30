---
title: Node.js 概述
layout: page
category: nodejs
date: 2013-01-14
modifiedOn: 2013-09-30
---

## 简介

### 什么是Node.js

Node.js是JavaScript在服务器端的一个运行环境，也是一个工具库，用来与服务器端其他软件互动。

访问官方网站[nodejs.org](http://nodejs.org)了解安装细节。安装完成以后，运行下面的命令，查看是否能正常运行。

{% highlight bash %}

node --version

{% endhighlight %}

要运行node.js程序，就是使用node命令读取Javascript脚本。

{% highlight bash %}

node file.js

{% endhighlight %}

### REPL环境

在命令行键入node命令，后面没有文件名，就进入一个Node.js的REPL环境（Read–eval–print loop，"读取-求值-输出"循环），可以直接运行各种JavaScript命令。

{% highlight bash %}

node
> 1+1
2

{% endhighlight %}

这个REPL是Node.js与用户互动的shell，各种基本的shell功能都可以在里面使用，比如使用上下方向键遍历曾经使用过的命令。特殊变量下划线（_）表示上一个命令的返回结果。

{% highlight bash %}

> 1+1
2
> _+1
3

{% endhighlight %}

在REPL中，如果运行一个表达式，会直接在命令行返回结果，如果运行一条语句则不会，因为它没有返回值。

{% highlight bash %}

> x = 1
1
> var x = 1

{% endhighlight %}

上面代码的第二条命令，没有显示任何结果。因为这是一条语句，不是表达式，所以没有返回值。

### 异步操作

Node.js采用V8引擎处理JavaScript脚本，最大特征就是单线程运行，即一次只能运行一个任务。这导致Node.js大量采用异步操作（asynchronous opertion），即任务不是马上执行，而是插在队列的尾部，等到前面的任务运行完后再执行。

由于这种特性，某一个任务的后续操作，往往采用回调函数（callback）的形式进行定义。

{% highlight javascript %}

doSomething(options, function (err, newOptions) {
  // . . .
});

{% endhighlight %}

上面代码的doSomething表示处理某个任务，options就是处理这个任务所需的参数，function(err, newOptions)则是任务完成后的回调函数。

值得注意的是，回调函数的格式也有约定。第一个参数err是一个Error对象，第二个参数newOptions才是回调函数的真正参数。如果doSomething运行出现错误，则抛出Error对象，回调函数必须做相应处理。

{% highlight javascript %}

doSomething(options, function (err, newOptions) {
			if (err) return handleError(err);
			// . . .
});

{% endhighlight %}

如果没有发生错误，参数err的值就是null。

### 模块化结构

Node.js采用模块化结构，按照[CommonJS规范](http://wiki.commonjs.org/wiki/CommonJS)定义和使用模块。

require命令用于指定加载模块。

{% highlight javascript %}

var someModule = require('moduleName');

{% endhighlight %}

require接受的参数除了模块的名称，还包括模块的路径。

{% highlight javascript %}

var someModule = require('/path/to/moduleName');

{% endhighlight %}

加载模块以后，就可以调用模块中定义的方法了。

{% highlight javascript %}

someModule.someFunction();

{% endhighlight %}

### 核心模块

Node.js自带一系列的核心模块，下面就是其中的一部分：

- **http**：提供HTTP服务器功能。
- **url**：解析URL。
- **fs**：与文件系统交互。
- **querystring**：解析URL的查询字符串。
- **child_process**：新建子进程。
- **util**：提供一系列实用小工具。

除了使用核心模块，还可以使用第三方模块，以及自定义模块。

### 自定义模块

Node.js模块采用CommonJS规范。只要符合这个规范，就可以自定义模块。

下面是一个简单的例子。新建一个文件mymodule.js，写入下面的代码。

{% highlight javascript %}

// mymodule.js

function p(string) {
  console.log(string);
}

exports.print = p;

{% endhighlight %}

上面的代码定义了一个p方法，然后将模块的对外接口print指向该方法。

在其他文件中使用该模块的时候，要先用require命令加载模块文件，然后调用它的接口。

{% highlight javascript %}

// index.js

var m = require('./mymodule');

m.print("这是自定义模块");

{% endhighlight %}
 
现在，就可以在命令行下运行index.js。

{% highlight bash %}

node index.js
# 这是自定义模块

{% endhighlight %}

## fs模块

fs是filesystem的缩写，该模块提供本地文件的读写能力。

{% highlight javascript %}

var fs = require('fs');

fs.readFile('example_log.txt', function (err, logData) {

  if (err) throw err;

  var text = logData.toString();

});

{% endhighlight %}

## http模块

### 实例：搭建一个HTTP服务器

使用Node.js搭建HTTP服务器非常简单。

{% highlight javascript %}

var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080);

console.log('Server running on port 8080.');

{% endhighlight %}

第一行 var http = require("http")，表示加载http模块。然后，调用http模块的createServer方法，创造一个服务器实例，将它赋给变量app。

ceateServer方法接受一个函数作为参数，该函数的req参数是一个对象，表示客户端的HTTP请求；res参数也是一个对象，表示服务器端的HTTP回应。rese.writeHead方法表示，服务器端回应一个HTTP头信息；response.end方法表示，服务器端回应的具体内容，以及回应完成后关闭本次对话。最后的listen(8080)表示启动服务器实例，监听本机的1337端口。

将上面这几行代码保存成文件app.js，然后用node调用这个文件，服务器就开始运行了。

{% highlight bash %}

node app.js

{% endhighlight %}

这时命令行窗口将显示一行提示“Server running at port 8080.”。打开浏览器，访问http://localhost:8080，网页显示“Hello world!”。

将app.js稍加修改，就可以做出一个网站的雏形，请求不同的网址，会显示不同的内容。

{% highlight javascript %}

var http = require("http");

http.createServer(function(req, res) {

  // 主页
  if (req.url == "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Welcome to the homepage!");
  }

  // About页面
  else if (req.url == "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Welcome to the about page!");
  }

  // 404错误
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 error! File not found.");
  }

}).listen(8080, "localhost");

{% endhighlight %}

### POST方法

当客户端采用POST方法发送数据时，服务器端可以对data和end两个事件，设立监听函数。

{% highlight javascript %}

var http = require('http');

http.createServer(function (req, res) {
  var content = "";

  req.on('data', function (chunk) {
    content += chunk;
  });

  req.on('end', function () {
    res.writeHead(200, {"Content-Type": "text/plain"});
	res.write("You've sent: " + content);
    res.end();
  });

}).listen(8080);

{% endhighlight %}

data事件会在数据接收过程中，每收到一段数据就触发一次，接收到的数据被传入回调函数。end事件则是在所有数据接收完成后触发。

## 模块管理器npm

### npm简介

npm是Node.js默认的模块管理器，用来安装和管理node模块。在安装node的时候，会连带一起安装npm。node安装完成后，可以用下面的命令，查看一下npm的帮助文件。

{% highlight bash %}

# npm命令列表
npm help

# 各个命令的简单用法
npm -l

{% endhighlight %}

下面的命令分别查看npm的版本和配置。

{% highlight bash %}

npm -version

npm config list -l

{% endhighlight %}

npm的版本可以在Node更新的时候一起更新。如果你想单独更新npm，使用下面的命令。

{% highlight bash %}

npm update -global npm

{% endhighlight %}

上面的命令之所以最后一个参数是npm，是因为npm本身也是Node.js的一个模块。

### 模块的安装

每个模块可以“全局安装”，也可以“本地安装”。两者的差异是模块的安装位置，以及调用方法。

“全局安装”指的是将一个模块直接下载到Node的安装目录中，各个项目都可以调用。“本地安装”指的是将一个模块下载到当前目录的node_modules子目录，然后只有在当前目录和它的子目录之中，才能调用这个模块。一般来说，全局安装只适用于工具模块，比如npm和grunt。

默认情况下，npm install 命令是“本地安装”某个模块。

{% highlight bash %}

npm install [package name]

{% endhighlight %}

使用上面的命令，模块文件将下载到当前目录的 node_modules 子目录。

使用global参数，可以“全局安装”某个模块。

{% highlight bash %}

sudo npm install -global [package name]

{% endhighlight %}

global参数可以被简化成g参数。

{% highlight bash %}

sudo npm install -g [package name]

{% endhighlight %}

install命令总是安装模块的最新版本，如果要安装模块的特定版本，可以在模块名后面加上@和版本号。

{% highlight bash %}

npm install package_name@version

{% endhighlight %}

一旦安装了某个模块，就可以在代码中用require命令调用这个模块。

{% highlight javascript %}

var backbone = require('backbone')

console.log(backbone.VERSION)

{% endhighlight %}

### 模块的升级和删除

npm update 命令可以升级本地安装的模块。

{% highlight bash %}

npm update [package name]

{% endhighlight %}

加上global参数，可以升级全局安装的模块。

{% highlight bash %}

npm update -global [package name]

{% endhighlight %}

npm uninstall 命令，删除本地安装的模块。

{% highlight bash %}

npm uninstall [package name]

{% endhighlight %}

加上global参数，可以删除全局安装的模块。

{% highlight bash %}

sudo npm uninstall [package name] -global

{% endhighlight %}

### 模块的查看和搜索

npm list命令，默认列出当前目录安装的所有模块。如果使用global参数，就是列出全局安装的模块。

{% highlight bash %}

npm list

npm -global list

{% endhighlight %}

向服务器端搜索某个模块，使用search命令（可使用正则搜索）。

{% highlight bash %}

npm search [搜索词]

{% endhighlight %}

如果不加搜索词，npm search 默认返回服务器端的所有模块。

## 配置文件package.json

每个项目的根目录下面，一般都有一个package.json文件，定义了这个项目所需要的各种模块，以及项目的配置（比如项目的名称、版本、许可证等元数据）。npm install 命令根据这个文件，自动下载所需的模块。所以，package.json 可以看作是npm命令的配置文件。

下面是一个虚拟的package.json文件。

{% highlight javascript %}

{
  "name":"name",
  "preferGlobal":false,
  "version":"0.0.0",
  "author":"your_name",
  "description":"",
  "bugs":{"url":"http://yoururl.com/","email":""},
  "contributors":[{"name":"xxx","email":"xxx@example.com"}],
  "bin":{"http-server":"./bin/http-server"},
  "scripts":{"start":"node ./bin/http-server"},
  "main":"./lib/http-server",
  "repository":{"type":"git","url":"https://github.com/xxx"},
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

可以看到，package.json文件就是一个json对象，每一项设置就是json对象的一个成员。

最简单的生成 package.json 文件的方式，就是使用 npm init 命令。

{% highlight bash %}

npm init

{% endhighlight %}

这个命令采用互动方式，要求用户回答一些问题，然后在当前目录生成一个基本的 package.json 文件。所有问题之中，只有项目名称（name）和项目版本（version）是必填的，其他都是选填的。

{% highlight bash %}

name: (getBackboneVersion) get-backbone-version
version: (0.0.0) 0.1.0
description: get backbone version used
entry point: (getBackboneVersion.js) getBackboneVersion.js
test command: n/a
git repository: n/a
keywords: backbone, version
author: cody lindley
license: (BSD) MIT

{% endhighlight %}

有了package.json文件，直接使用npm install命令，就会在当前目录中安装文件指定的包。

{% highlight bash %}

npm install

{% endhighlight %}

如果一个库不在 package.json 文件之中，可以在安装的时候加上--save-dev，这个库就会自动被加入 package.json 文件。

## 参考链接

- Cody Lindley, [Package Managers: An Introductory Guide For The Uninitiated Front-End Developer](http://tech.pro/tutorial/1190/package-managers-an-introductory-guide-for-the-uninitiated-front-end-developer)
