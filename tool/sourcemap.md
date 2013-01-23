---
title: Source Map
layout: page
category: tool
date: 2013-01-23
modifiedOn: 2013-01-23
---

## 概述

随着JavaScript脚本变得越来越复杂，大部分源码（尤其是各种函数库和框架）都要经过转换，才能投入生产环境。

常见的源码转换，主要是以下三种情况：

- 压缩，减小体积。比如jQuery 1.9的源码，压缩前是252KB，压缩后是32KB。
- 多个文件合并，减少HTTP请求数。
- 其他语言编译成JavaScript。最常见的例子就是CoffeeScript。

这三种情况，都使得实际运行的代码不同于开发代码，除错（debug）变得困难重重。

通常，JavaScript的解释器会告诉你，第几行第几列代码出错。但是，这对于转换后的代码毫无用处。举例来说，jQuery 1.9压缩后只有3行，每行3万个字符，所有内部变量都改了名字。你看着报错信息，感到毫无头绪，根本不知道它所对应的原始位置。

这就是Source map想要解决的问题。

简单说，Source map就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。

有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。这无疑给开发者带来了很大方便。

目前，暂时只有Chrome浏览器支持这个功能。在Developer Tools的Setting设置中，确认选中"Enable source maps"。

## 生成和启用

生成Source Map的最常用方法，是使用Google的[Closure编译器](https://developers.google.com/closure/compiler/)。

生成命令的格式如下：

{% highlight java %}

java -jar compiler.jar \ 
　　--js script.js \
　　--create_source_map ./script-min.js.map \
　　--source_map_format=V3 \
　　--js_output_file script-min.js

{% endhighlight %}

各个参数的意义如下：

- js： 转换前的代码文件
- create_source_map： 生成的source map文件
- source_map_format：source map的版本，目前一律采用V3。
- js_output_file： 转换后的代码文件。

其他的生成方法可以参考[这篇文章](http://net.tutsplus.com/tutorials/tools-and-tips/source-maps-101/)。

启用Source map的方法很简单，只要在转换后的代码尾部，加上一行就可以了。

{% highlight java %}

//@ sourceMappingURL=/path/to/file.js.map

{% endhighlight %}

map文件可以放在网络上，也可以放在本地文件系统。
