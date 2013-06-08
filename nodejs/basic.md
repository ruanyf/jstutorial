---
title: Node.js 概述
layout: page
category: nodejs
date: 2013-01-14
modifiedOn: 2013-06-08
---

## 简介

Node.js既是Javascript在服务器端的一个运行环境，又是一个工具库，用来与服务器端其他软件互动。

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

## 包管理器npm

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

搜索某个包，可以使用下面的命令。

{% highlight bash %}

npm search [search terms ...]

{% endhighlight %}

在当前目录下，安装某个包。

{% highlight bash %}

npm install [package name]

{% endhighlight %}

也可以全局性地安装一个包，然后所有项目都可以使用。

{% highlight bash %}

sudo npm install -global jshint

{% endhighlight %}

列出安装的所有包，如果不使用global参数，就是列出当前用户安装的包。

{% highlight bash %}

npm list

npm -global list

{% endhighlight %}

升级已经安装的包。

{% highlight bash %}

npm update backbone
npm update jshint -global

{% endhighlight %}

删除某个已安装的包。

{% highlight bash %}

npm uninstall backbone
sudo npm uninstall jshint -global

{% endhighlight %}

一旦安装了某个包，就可以在代码中用require命令调用这个包。假定已经安装了backbone，可以写一个test.js文件。

{% highlight javascript %}

var backbone = require('backbone')
console.log(backbone.VERSION)

{% endhighlight %}

然后，就可以运行该文件了。

{% highlight bash %}

node test.js

{% endhighlight %}

## 配置文件package.json

package.json文件存放一个项目的配置，一般放在根目录下面，格式为json。

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

使用npm init命令，可以互动式地生成一个package.json文件。

一旦在package.json命令中，指定了包的依赖关系，就可以用npm install安装指定的包。

## 参考链接

- Cody Lindley, [Package Managers: An Introductory Guide For The Uninitiated Front-End Developer](http://tech.pro/tutorial/1190/package-managers-an-introductory-guide-for-the-uninitiated-front-end-developer)
