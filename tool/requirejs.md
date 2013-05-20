---
title: RequireJS
layout: page
category: tool
date: 2013-05-05
modifiedOn: 2013-05-20
---

## 概述

RequireJS是一个工具库，主要用于客户端的模块管理，它遵守[AMD规范](https://github.com/amdjs/amdjs-api/wiki/AMD)（Asynchronous Module Definition）。

它主要提供define和require两个方法，前者用于定义模块，后者用于调用模块。

## 定义模块

define方法用于定义模块。

{% highlight javascript %}

define(['module1', 'module2'], function(m1, m2) {
   ...
});

{% endhighlight %}

define方法的第一个参数是一个数组，用于定义当前模块所依赖的模块。

## 调用模块

require方法用于调用模块。

在define方法内部，也可以调用模块。

{% highlight javascript %}

define(function(require) {
   var otherModule = require('otherModule');
});

{% endhighlight %}

## 优化器

RequireJS提供一个基于node.js的命令行工具r.js，用来压缩多个js文件。

首先，在你的项目目录中安装r.js（假设已经安装了node.js）。

{% highlight bash %}

npm install requirejs

{% endhighlight %}

使用的时候，直接在命令行键入以下格式的命令。

{% highlight bash %}

node r.js -o <arguments>

{% endhighlight %}

<argument>表示命令运行时，所需要的一系列参数。

{% highlight bash %}

node r.js -o baseUrl=. name=main out=main-built.js

{% endhighlight %}

除了直接在命令行提供，也可以将参数写入一个文件，假定文件名为build.js。

{% highlight javascript %}

({
    baseUrl: ".",
    name: "main",
    out: "main-built.js"
})

{% endhighlight %}

然后，在命令行下，提供这个参数文件。

{% highlight bash %}

node r.js -o build.js

{% endhighlight %}

下面是一个参数文件的范例，假定位置就在根目录下，文件名为build.js。

{% highlight javascript %}

({
    appDir: './',
    baseUrl: './js',
    dir: './dist',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone/backbone',
        backboneLocalstorage: 'lib/backbone/backbone.localStorage',
        text: 'lib/require/text'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        backboneLocalstorage: {
            deps: ['backbone'],
            exports: 'Store'
        }
    }
})

{% endhighlight %}

参数文件的主要成员解释如下：

- appDir：项目目录，相对于参数文件的位置。
- baseUrl：js文件的位置。
- dir：输出目录。
- modules：一个包含对象的数组，每个对象就是一个要被优化的模块。
- fileExclusionRegExp：凡是匹配这个正则表达式的文件名，都不会被拷贝到输出目录。
- optimizeCss: 自动压缩CSS文件，可取的值包括“none”, “standard”, “standard.keepLines”, “standard.keepComments”, “standard.keepComments.keepLines”。
- removeCombined：如果为true，合并后的原文件将不保留在输出目录中。
- paths：各个模块的相对路径。
- shim：配置依赖性和参数。如果某一个模块不是用defined()方法定义的，就可以用它定义模块的依赖性和输出值。

更详细的解释可以参考[官方文档](https://github.com/jrburke/r.js/blob/master/build/example.build.js)。

运行优化命令后，可以前往dist目录查看优化后的文件。

## 参考链接

- NaorYe, [Optimize (Concatenate and Minify) RequireJS Projects](http://www.webdeveasy.com/optimize-requirejs-projects/)
