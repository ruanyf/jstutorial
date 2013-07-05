---
title: 样式表操作
layout: page
category: dom
date: 2013-07-05
modifiedOn: 2013-07-05
---

## 获取样式表

document对象的styleSheets属性，包含一个类似数组的对象，里面是当前文档所有的link元素(指向样式表)和style元素。

{% highlight javascript %}

var sheets = document.styleSheets;

var sheet = document.styleSheets[0];

{% endhighlight %}

获取样式表以后，要检查一下它的media属性，确定这个样式表是用于显示（screen），还是用于打印（print），或两者都适用（all）。

{% highlight javascript %}

document.styleSheets[0].media.mediaText
// "all"

{% endhighlight %}

## 添加样式表

添加一张新样式表，就是在文档中添加一个style节点。

{% highlight javascript %}

var style = document.createElement("style");

style.setAttribute("media", "screen");
style.setAttribute("media", "@media only screen and (max-width : 1024px)");

// WebKit引擎需要添加一个空的文本节点
style.appendChild(document.createTextNode(""));

document.head.appendChild(style);

{% endhighlight %}

## 添加CSS规则

样式表对象的 addRule 方法，允许向样式表添加CSS规则。这个方法接受三个参数：CSS选择器，CSS代码，该条规则在该选择器的所有规则中的位置（从0开始）。

{% highlight javascript %}

sheet.addRule("#myList li", "float: left; background: red !important;", 1);

{% endhighlight %}

上面的代码，将一条CSS规则插入“#myList li”选择器的所有规则的第二位。默认情况下，这个位置值是“-1”，即新增规则插在所有规则的最后。

样式表对象还有一个insertRule方法，它与addRule方法的唯一差异，就是把前者的第一和第二个参数合写在一起。这个方法写起来相对省事一些，但是目前还不是所有浏览器都支持这个方法。

{% highlight javascript %}

sheet.insertRule("header { float: left; opacity: 0.8; }", 1);

{% endhighlight %}

## 参考链接

- David Walsh, [Add Rules to Stylesheets with JavaScript](http://davidwalsh.name/add-rules-stylesheets)
