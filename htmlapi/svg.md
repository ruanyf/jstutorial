---
title: SVG 图像
layout: page
category: htmlapi
date: 2013-02-08
modifiedOn: 2013-11-27
---

SVG是“可缩放矢量图”（Scalable Vector Graphics）的缩写，是一种描述向量图形的XML格式的标记化语言。也就是说，SVG本质上是文本文件，格式采用XML，可以在浏览器中显示出矢量图像。由于结构是XML格式，使得它可以插入HTML文档，成为DOM的一部分，然后用JavaScript和CSS进行操作。

相比传统的图像文件格式（比如JPG和PNG），SVG图像的优势就是文件体积小，并且放大多少倍都不会失真，因此非常合适用于网页。

SVG图像可以用Adobe公司的Illustrator软件、开源软件Inkscape等生成。目前，所有主流浏览器都支持，对于低于IE 9的浏览器，可以使用第三方的[polyfills函数库](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills#svg)。

## 插入SVG文件

SVG插入网页的方法有多种，可以用在img、object、embed、iframe等标签，以及CSS的background-image属性。

{% highlight html %}

<img src="circle.svg">
<object id="object" data="circle.svg" type="image/svg+xml"></object>
<embed id="embed" src="icon.svg" type="image/svg+xml">
<iframe id="iframe" src="icon.svg"></iframe>

{% endhighlight %}

上面是四种在网页中插入SVG图像的方式。

此外，SVG文件还可以插入其他DOM元素，比如div元素，请看下面的例子（使用了jQuery函数库）。

{% highlight html %}

<div id="stage"></div>

<script>
$("#stage").load('icon.svg',function(response){
  $(this).addClass("svgLoaded");
  if(!response){
    // 加载失败的处理代码
  }
});
</script>

{% endhighlight %}

## svg格式

SVG文件采用XML格式，就是普通的文本文件。

```xml

<svg width="300" height="180">
  <circle cx="30"  cy="50" r="25" />
  <circle cx="90"  cy="50" r="25" class="red" />
  <circle cx="150" cy="50" r="25" class="fancy" />
</svg>

```

上面的svg文件，定义了三个圆，它们的cx、cy、r属性分别为x坐标、y坐标和半径。利用class属性，可以为这些圆指定样式。

```css

.red {
  fill: red; /* not background-color! */
}

.fancy {
  fill: none;
  stroke: black; /* similar to border-color */
  stroke-width: 3pt; /* similar to border-width */
}

```

上面代码中，fill属性表示填充色，stroke属性表示描边色，stroke-width属性表示边线宽度。

除了circle标签表示圆，SVG文件还可以使用表示其他形状的标签。

```html

<svg>
  <line x1="0" y1="0" x2="200" y2="0" style="stroke:rgb(0,0,0);stroke-width:1"/></line>
  <rect x="0" y="0" height="100" width="200" style="stroke: #70d5dd; fill: #dd524b" />
  <ellipse cx="60" cy="60" ry="40" rx="20" stroke="black" stroke-width="5" fill="silver"/></ellipse>
	<polygon fill="green" stroke="orange" stroke-width="10" points="350, 75  379,161 469,161 397,215 423,301 350,250 277,301 303,215 231,161 321,161"/><polygon>
	<path id="path1" d="M160.143,196c0,0,62.777-28.033,90-17.143c71.428,28.572,73.952-25.987,84.286-21.428" style="fill:none;stroke:2;"></path>  
</svg>

```

上面代码中，line、rect、ellipse、polygon和path标签，分别表示线条、矩形、椭圆、多边形和路径。

g标签用于将多个形状组成一组，表示group。

```xml

<svg width="300" height="180">
  <g transform="translate(5, 15)">
    <text x="0" y="0">Howdy!</text>
    <path d="M0,50 L50,0 Q100,0 100,50"
      fill="none" stroke-width="3" stroke="black" />
  </g>
</svg>

```

## SVG文件的JavaScript操作

### 获取SVG DOM

如果使用img标签插入SVG文件，则无法获取SVG DOM。使用object、iframe、embed标签，可以获取SVG DOM。

{% highlight javascript %}

var svgObject = document.getElementById("object").contentDocument;
var svgIframe = document.getElementById("iframe").contentDocument;
var svgEmbed = document.getElementById("embed").getSVGDocument(); 

{% endhighlight %}

由于svg文件就是一般的XML文件，因此可以用DOM方法，选取页面元素。

{% highlight javascript %}

// 改变填充色
document.getElementById("theCircle").style.fill = "red";

// 改变元素属性
document.getElementById("theCircle").setAttribute("class", "changedColors");

// 绑定事件回调函数
document.getElementById("theCircle").addEventListener("click", function() {
   console.log("clicked")
});

{% endhighlight %}

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

```javascript

var img = new Image();
var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});

var DOMURL = self.URL || self.webkitURL || self;
var url = DOMURL.createObjectURL(svg);

img.src = url;

```

然后，当图像加载完成后，再将它绘制到canvas元素。

{% highlight javascript %}

img.onload = function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
};

{% endhighlight %}

## 实例

假定我们要将下面的表格画成图形。

Date |Amount
-----|------
2014-01-01 | $10
2014-02-01 | $20
2014-03-01 | $40
2014-04-01 | $80

上面的图形，可以画成一个坐标系，Date作为横轴，Amount作为纵轴，四行数据画成一个数据点。

```xml

<svg width="350" height="160">
  <g class="layer" transform="translate(60,10)">
    <circle r="5" cx="0"   cy="105" />
    <circle r="5" cx="90"  cy="90"  />
    <circle r="5" cx="180" cy="60"  />
    <circle r="5" cx="270" cy="0"   />

    <g class="y axis">
      <line x1="0" y1="0" x2="0" y2="120" />
      <text x="-40" y="105" dy="5">$10</text>
      <text x="-40" y="0"   dy="5">$80</text>
    </g>
    <g class="x axis" transform="translate(0, 120)">
      <line x1="0" y1="0" x2="270" y2="0" />
      <text x="-30"   y="20">January 2014</text>
      <text x="240" y="20">April</text>
    </g>
  </g>
</svg>

```

## 参考链接

- Jon McPartland, [An introduction to SVG animation](http://bigbitecreative.com/introduction-svg-animation/)
- Alexander Goedde, [SVG - Super Vector Graphics](http://tavendo.com/blog/post/super-vector-graphics/)
- Joseph Wegner, [Learning SVG](http://flippinawesome.org/2014/02/03/learning-svg/)
- biovisualize, [Direct svg to canvas to png conversion](http://bl.ocks.org/biovisualize/8187844)
