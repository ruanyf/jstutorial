---
title: SVG 图像
layout: page
category: htmlapi
date: 2013-02-08
modifiedOn: 2013-04-19
---

SVG是Scalable Vector Graphics（可缩放向量图形）的缩写，是一种描述向量图形的XML格式。也就是说，它本质上是文本文件，格式采用XML，但是可以在浏览器中显示出图像。由于结构是XML格式，使得它可以HTML文档，成为DOM的一部分，可以用JavaScript和CSS操作它。

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

