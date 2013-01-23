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

## 格式

打开Source map文件，它大概是这个样子：

{% highlight javascript %}

　　{
　　　　version : 3,
　　　　file: "out.js",
　　　　sourceRoot : "",
　　　　sources: ["foo.js", "bar.js"],
　　　　names: ["src", "maps", "are", "fun"],
　　　　mappings: "AAgBC,SAAQ,CAAEA"
　　}

{% endhighlight %}

整个文件就是一个JavaScript对象，可以被解释器读取。它主要有以下几个属性：

- version：Source map的版本，目前为3。
- file：转换后的文件名。
- sourceRoot：转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。
- sources：转换前的文件。该项是一个数组，表示可能存在多个文件合并。
- names：转换前的所有变量名和属性名。
- mappings：记录位置信息的字符串。

## mappings属性

转换前后的代码一一对应的关键，就是map文件的mappings属性。这是一个很长的字符串，它分成三层。

第一层是行对应，以分号（;）表示，每个分号对应转换后源码的一行。所以，第一个分号前的内容，就对应源码的第一行，以此类推。

第二层是位置对应，以逗号（,）表示，每个逗号对应转换后源码的一个位置。所以，第一个逗号前的内容，就对应该行源码的第一个位置，以此类推。

第三层是位置转换，以[VLQ编码](http://en.wikipedia.org/wiki/Variable-length_quantity)表示，代表该位置对应的转换前的源码位置。

举例来说，假定mappings属性的内容如下：

{% highlight javascript %}

mappings:"AAAAA,BBBBB;CCCCC"

{% endhighlight %}

它表示，转换后的源码分成两行，第一行有两个位置，第二行有一个位置。

每个位置使用五位，表示五个字段。从左边算起，

- 第一位，表示这个位置在（转换后的代码的）的第几列。
- 第二位，表示这个位置属于sources属性中的哪一个文件。
- 第三位，表示这个位置属于转换前代码的第几行。
- 第四位，表示这个位置属于转换前代码的第几列。
- 第五位，表示这个位置属于names属性中的哪一个变量。

有几点需要说明。首先，所有的值都是以0作为基数的。其次，第五位不是必需的，如果该位置没有对应names属性中的变量，可以省略第五位。再次，每一位都采用VLQ编码表示；由于VLQ编码是变长的，所以每一位可以由多个字符构成。

如果某个位置是AAAAA，由于A在VLQ编码中表示0，因此这个位置的五个位实际上都是0。它的意思是，该位置在转换后代码的第0列，对应sources属性中第0个文件，属于转换前代码的第0行第0列，对应names属性中的第0个变量。
