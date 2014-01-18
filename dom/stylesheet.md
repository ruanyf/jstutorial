---
title: 样式表操作
layout: page
category: dom
date: 2013-07-05
modifiedOn: 2014-01-18
---

本节介绍JavaScript如何操作CSS样式。

## 样式表

### 获取样式表

document对象的styleSheets属性，包含一个类似数组的对象，里面是当前文档所有的link元素(指向样式表)和style元素。

{% highlight javascript %}

var sheets = document.styleSheets;

var sheet = document.styleSheets[0];

{% endhighlight %}

除了使用styleSheets属性获取样式表，还可以使用querySelector方法，先获取Element对象，然后再用它的sheet属性获取CSSStyleSheet对象。

{% highlight javascript %}

// 等同于document.styleSheets[0] 
document.querySelector('#linkElement').sheet 

// 等同于document.styleSheets[1]
document.querySelector('#styleElement').sheet

{% endhighlight %}

样式表对象主要有以下属性和方法。

- href（只读）
- media（只读）
- ownerNode（只读）
- parentStylesheet（只读）
- title（只读）
- type（只读）
- cssRules
- ownerRule
- insertRule()
- deleteRule()
- disabled

**（1）media属性**

media属性表示这个样式表是用于显示在屏幕（screen），还是用于打印（print），或两者都适用（all）。该属性只读。

{% highlight javascript %}

document.styleSheets[0].media.mediaText
// "all"

{% endhighlight %}

**（2）cssRules属性**

cssRules属性指向一个类似数组的对象（称为cssRules对象），该对象的每个成员就是一条CSS规则，使用该规则的cssText属性，可以得到CSS规则对应的字符串。

{% highlight javascript %}

var sheet = document.querySelector('#styleElement').sheet;

sheet.cssRules[0].cssText
// "body { background-color: red; margin: 20px; }"

sheet.cssRules[1].cssText
// "p { line-height: 1.4em; color: blue; }"

{% endhighlight %}

每条CSS规则还有一个style属性，指向一个对象，用来读写具体的CSS命令。

{% highlight javascript %}

styleSheet.cssRules[0].style.color = 'red';
styleSheet.cssRules[1].style.color = 'purple';

{% endhighlight %}

**（3）insertRule方法和deleteRule方法**

insertRule方法用于插入CSS规则，deleteRule方法用于删除CSS规则。

{% highlight javascript %}

var sheet = document.querySelector('#styleElement').sheet;

sheet.insertRule('p{color:red}',1);

sheet.deleteRule(1);

{% endhighlight %}

insertRule方法的第一个参数是表示CSS规则的字符串，第二个参数是该规则在cssRules对象的插入位置。deleteRule方法的参数是该条规则在cssRules对象中的位置。

IE 9开始支持insertRule方法，在此之前都使用addRule方法。addRule的写法与insertRule略有不同，接受三个参数。

{% highlight javascript %}

sheet.addRule('p','color:red',1);

{% endhighlight %}

上面代码将一条CSS语句插入p选择器所有语句的第二位。最后一个参数默认为-1，即新增语句插在所有语句的最后。

**（4）disabled属性**

该属性用于打开或关闭一张样式表。

{% highlight javascript %}

document.document.querySelector('#linkElement').disabled = true;

{% endhighlight %}

disabled属性只能在JavaScript中设置，不能在html语句中设置。

### 添加样式表

添加一张内置样式表，就是在文档中添加一个style节点。

{% highlight javascript %}

var style = document.createElement("style");

style.setAttribute("media", "screen");

// 或者
style.setAttribute("media", "@media only screen and (max-width : 1024px)");

style.innerHTML = 'body{color:red}';

document.head.appendChild(style);

{% endhighlight %}

添加外部样式表，就是在文档中添加一个link节点。

{% highlight javascript %}

var linkElm = document.createElement('link');
linkElm.setAttribute('rel', 'stylesheet');
linkElm.setAttribute('type', 'text/css');
linkElm.setAttribute('href', 'reset-min.css');

document.head.appendChild(linkElm);

{% endhighlight %}

## window.matchMedia方法

window.matchMedia方法用来检查CSS的[mediaQuery](https://developer.mozilla.org/en-US/docs/DOM/Using_media_queries_from_code)语句。各种浏览器的最新版本（包括IE 10+）都支持该方法。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

result.media // (min-width: 600px)
result.matches // true

{% endhighlight %}

matchMedia返回一个[MediaQueryList](https://developer.mozilla.org/en-US/docs/DOM/MediaQueryList)对象。该对象有以下两个属性。

- media：查询语句的内容。
- matches：如果查询结果为真，值为true，否则为false。

该方法的一个简单用法，就是根据查询结果加载相应的CSS样式表。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

if (result.matches){
  document.write('<link rel="stylesheet" 
                  href="small.css">');
}

{% endhighlight %}

window.matchMedia方法返回的MediaQueryList对象，还可以监听事件。如果mediaQuery查询结果发生变化，就调用指定的回调函数。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

result.addListener(function(e){
        if(e.matches){
                console.log('进入移动设备模式');
        }
});

{% endhighlight %}

## 参考链接

- David Walsh, [Add Rules to Stylesheets with JavaScript](http://davidwalsh.name/add-rules-stylesheets)
- Robert Nyman, [Using window.matchMedia to do media queries in JavaScript](https://hacks.mozilla.org/2012/06/using-window-matchmedia-to-do-media-queries-in-javascript/)
