---
title: File API
date: 2012-11-30
layout: page
category: htmlapi
---

这个API用于操作用户通过表单选取的本地文件。

它提供多个操作对象。

## FileList

该对象针对表单的file控件。当用户通过file控件选取文件后，可以通过files属性读取这些文件。

{% highlight html %}

<input type=file onchange="console.log(this.files.length)" multiple />

{% endhighlight %}

## 参考链接

* [W3C Working Draft](http://www.w3.org/TR/FileAPI/)
