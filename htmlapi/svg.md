---
title: SVG 图像
layout: page
category: htmlapi
date: 2013-02-08
modifiedOn: 2013-02-08
---

SVG是一种描述矢量图像的XML格式。也就是说，它是文本文件，但是可以在浏览器中显示出图像。由于它的XML格式的结构，使得我们可以用JavaScript和CSS操作它。

## 插入SVG文件

SVG插入HTML网页，可以用在img标签、embed标签、CSS的background-image属性，也可以插在其他DOM元素中。

{% highlight html %}

<div id="stage"></div>

{% endhighlight %}

然后，使用jQuery将其插入。

{% highlight javascript %}

$(function(){
 
$("#stage").load('interactive.svg',function(response){
 
        $(this).addClass("svgLoaded");
         
        if(!response){
            // 加载没有成功的处理代码
        }
 
    });
});

{% endhighlight %}

