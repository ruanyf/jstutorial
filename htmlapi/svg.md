---
title: SVG 图像
layout: page
category: htmlapi
date: 2013-02-08
modifiedOn: 2013-11-27
---

SVG是“可缩放矢量图”（Scalable Vector Graphics）的缩写，是一种描述向量图形的XML格式的标记化语言。

也就是说，SVG本质上是文本文件，格式采用XML，可以在浏览器中显示出矢量图像。由于结构是XML格式，使得它可以插入HTML文档，成为DOM的一部分，然后用JavaScript和CSS进行操作。

相比传统的图像文件格式（比如JPG和PNG），SVG图像的优势就是文件体积小，放大多少倍都不会失真，因为非常合适用于网页。

SVG图像可以用Adobe公司的Illustrator软件、开源软件Inkscape等生成。目前，所有主流浏览器都支持，对于低于IE 9的浏览器，可以使用第三方的[polyfills函数库](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills#svg)。

## 插入SVG文件

SVG插入HTML网页，可以用在img标签、embed标签、CSS的background-image属性，也可以插在其他DOM元素中。

{% highlight html %}

<img src="circle.svg">
<object id="object" data="circle.svg" type="image/svg+xml"></object>
<embed id="embed" src="icon.svg" type="image/svg+xml">
<iframe id="iframe" src="icon.svg"></iframe>

{% endhighlight %}

上面是四种插入SVG图像的方式。

下面是在其他DOM元素中插入SVG文件的一个例子。先在HTML网页中建立一个容器。

{% highlight html %}

<div id="stage"></div>

{% endhighlight %}

然后，使用jQuery将SVG图像插入网页元素。

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

## svg格式

下面是一个简单的SVG文件。

```html

<svg>
  <line x1="0" y1="0" x2="200" y2="0" style="stroke:rgb(0,0,0);stroke-width:1"/></line>
</svg>

```

上面代码画出一根线条，x1和y1是起点的横坐标和纵坐标，x2是终点的横坐标和纵坐标。


```html

<svg>   
	<circle cx="60" cy="60" r="50" stroke="black" stroke-width="5" fill="silver"/>
</svg>

```

上面代码画出一个圆。cx和cy是圆心的坐标，r是圆的半径。

{% highlight html %}

<svg>
    <rect x="0" y="0" height="100" width="200" style="stroke: #70d5dd; fill: #dd524b" />
</svg>

{% endhighlight %}

上面代码画出一个长100像素、宽200像素的矩形。

```html

<svg>
 <ellipse cx="60" cy="60" ry="40" rx="20" stroke="black" stroke-width="5" fill="silver"/></ellipse>
</svg>

```

上面代码画出一个椭圆。

```html

<svg>
	<polygon fill="green" stroke="orange" stroke-width="10" points="350, 75  379,161 469,161 397,215 423,301 350,250 277,301 303,215 231,161 321,161"/><polygon>
</svg>

```

上面代码画出一个多边形。

```html

<text x="0" y="34" style="font-family: Helvetica,Arial,sans-serif;font-weight:bold;font-size:34; fill :#000; ">webdesigntuts+</text>

```

上面代码用来生成文字。

```html

<svg>  	
	<path id="path1" d="M160.143,196c0,0,62.777-28.033,90-17.143c71.428,28.572,73.952-25.987,84.286-21.428" style="fill:none;stroke:2;"></path>  
</svg>

```

上面代码绘制一条路径。

## svg操作

如果使用img标签插入SVG文件，则无法获取SVG DOM。其他使用object、iframe、embed标签的获取方法如下。

{% highlight javascript %}

var svgObject = document.getElementById("object").contentDocument;
var svgIframe = document.getElementById("iframe").contentDocument;
var svgEmbed = document.getElementById("embed").getSVGDocument(); 

{% endhighlight %}

由于svg文件就是一般的XML文件，因此可以用DOM方法，选取页面元素。

改变填充色。

{% highlight javascript %}

document.getElementById("theCircle").style.fill = "red";

{% endhighlight %}

改变元素属性。

{% highlight javascript %}

document.getElementById("theCircle").setAttribute("class", "changedColors");

{% endhighlight %}

绑定事件回调函数。

{% highlight javascript %}

document.getElementById("theCircle").addEventListener("click", function() {
   console.log("clicked")
});

{% endhighlight %}

## svg文件处理

### 读取svg源码

由于svg文件就是一个XML代码的文本文件，因此可以通过读取XML代码的方式，读取svg源码。

假定网页中有一个svg元素。

{% highlight html %}

<div id="svg-container">
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="500" height="440">
		<!-- svg code -->
	</svg>
</div>

{% endhighlight %}

使用XMLSerializer实例的serializeToString方法，获取svg元素的代码。

{% highlight javascript %}

var svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));

{% endhighlight %}

### 将svg图像转为canvas图像

首先，需要新建一个img对象，将svg图像指定到该img对象的src属性。

{% highlight javascript %}

var img = new Image();
var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});

var DOMURL = self.URL || self.webkitURL || self;
var url = DOMURL.createObjectURL(svg);

img.src = url;

{% endhighlight %}

然后，当图像加载完成后，再将它绘制到canvas元素。

{% highlight javascript %}

img.onload = function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
};

{% endhighlight %}

## 参考链接

- Jon McPartland, [An introduction to SVG animation](http://bigbitecreative.com/introduction-svg-animation/)
- Alexander Goedde, [SVG - Super Vector Graphics](http://tavendo.com/blog/post/super-vector-graphics/)
- Joseph Wegner, [Learning SVG](http://flippinawesome.org/2014/02/03/learning-svg/)
- biovisualize, [Direct svg to canvas to png conversion](http://bl.ocks.org/biovisualize/8187844)
