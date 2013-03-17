---
title: Google Closure
layout: page
category: tool
date: 2013-03-17
modifiedOn: 2013-03-17
---

Google Closure是Google提供的一个JavaScript源码处理工具，主要用于压缩和合并多个JavaScript脚本文件。

Google Closure使用Java语言开发，使用之前必须先安装Java。然后，前往[官方网站](https://developers.google.com/closure/)进行下载，这里我们主要使用其中的编译器（compiler）。

首先，查看使用帮助。

{% highlight bash %}

java -jar /path/to/closure/compiler.jar --help

{% endhighlight %}

直接在脚本命令后面跟上要合并的脚本，就能完成合并。

{% highlight bash %}

java -jar /path/to/closure/compiler.jar *.js

{% endhighlight %}

使用--js参数，可以确保按照参数的先后次序合并文件。

{% highlight bash %}

java -jar /path/to/closure/compiler.jar --js script1.js --js script2.js --js script3.js

{% endhighlight %}

但是，这样的运行结果是将合并后的文件全部输出到屏幕（标准输出），因此需要使用--js_output_file参数，指定合并后的文件名。

{% highlight bash %}

java -jar /path/to/closure/compiler.jar --js script1.js --js script2.js --js script3.js --js_output_file scripts-compiled.js

{% endhighlight %}

## 参考链接

- Corey Maynard, [Using Google's Closure to Compile and Verify your JavaScript](http://coreymaynard.com/blog/using-googles-closure-to-compile-and-verify-your-j/)


