---
title: SVG 图像
layout: page
category: htmlapi
date: 2013-02-08
modifiedOn: 2013-11-27
---

SVG是“可缩放矢量图”（Scalable Vector Graphics）的缩写，是一种描述向量图形的XML格式的标记化语言。也就是说，SVG本质上是文本文件，格式采用XML，可以在浏览器中显示出矢量图像。由于结构是XML格式，使得它可以插入HTML文档，成为DOM的一部分，然后用JavaScript和CSS进行操作。

相比传统的图像文件格式（比如JPG和PNG），SVG图像的优势就是文件体积小，并且放大多少倍都不会失真，因此非常合适用于网页。

SVG图像可以用专门的图像软件生成。目前，所有主流浏览器都支持，对于低于IE 9的浏览器，可以使用第三方的[polyfills函数库](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills#svg)。

## 插入文件

SVG插入网页的方法有多种，可以直接把SVG代码写在HTML网页里面。

```html
<!DOCTYPE html>
<html>
<head></head>
<body>
<svg
  id="mysvg"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 800 600"
  preserveAspectRatio="xMidYMid meet"
>
  <circle id="mycircle" cx="400" cy="300" r="50" />
<svg>
</body>
</html>
```

SVG代码也可以写在一个独立文件中，然后用在`<img>`、`<object>`、`<embed>`、`<iframe>`等标签，以及CSS的`background-image`属性，将这个文件插入网页。

```html
<!-- 方法一 -->
<img src="circle.svg">

<!-- 方法二 -->
<object id="object" data="circle.svg" type="image/svg+xml"></object>

<!-- 方法三 -->
<embed id="embed" src="icon.svg" type="image/svg+xml">

<!-- 方法四 -->
<iframe id="iframe" src="icon.svg"></iframe>
```

上面是四种在网页中插入SVG图像的方式。

此外，SVG文件还可以插入其他DOM元素，比如`<div>`元素，请看下面的例子（使用了jQuery函数库）。

```html
<div id="stage"></div>

<script>
$('#stage').load('icon.svg', function (response) {
  $(this).addClass('svgLoaded');
  if (!response) {
    // 加载失败的处理代码
  }
});
</script>
```

## svg格式

SVG文件采用XML格式，就是普通的文本文件。下面是一个例子。

```xml
<svg width="300" height="180">
  <circle cx="30"  cy="50" r="25" />
  <circle cx="90"  cy="50" r="25" class="red" />
  <circle cx="150" cy="50" r="25" class="fancy" />
</svg>
```

上面的代码定义了三个圆，`cx`、`cy`、`r`属性分别为`x`坐标、`y`坐标和半径。利用class属性，可以为这些圆指定样式。

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

上面代码中，`fill`属性表示填充色，`stroke`属性表示描边色，`stroke-width`属性表示边框宽度。

除了`<circle>`标签表示圆，SVG文件还可以使用表示其他形状的标签。

```html
<svg>
  <!-- 直线 -->
  <line x1="0" y1="0" x2="200" y2="0" style="stroke:rgb(0,0,0);stroke-width:1"/>
  <!-- 矩形 -->
  <rect x="0" y="0" height="100" width="200" style="stroke: #70d5dd; fill: #dd524b" />
  <!-- 椭圆 -->
  <ellipse cx="60" cy="60" ry="40" rx="20" stroke="black" stroke-width="5" fill="silver"/>  <polygon fill="green" stroke="orange" stroke-width="10" points="350, 75  379,161 469,161 397,215 423,301 350,250 277,301 303,215 231,161 321,161"/><polygon>
  <!-- 多边形 -->
  <polygon points="60,20 100,40 100,80 60,100 20,80 20,40"/>
  <!-- 路径 -->
  <path id="path1" d="M160.143,196c0,0,62.777-28.033,90-17.143c71.428,28.572,73.952-25.987,84.286-21.428" style="fill:none;stroke:2;"></path>
  <!-- 文本 -->
  <text x="250" y="25">Hello World</text>
</svg>
```

上面代码中，`line`、`rect`、`ellipse`、`polygon`和`path`标签，分别表示线条、矩形、椭圆、多边形、路径和文字。

`g`标签用于将多个形状组成一组（group）。

```xml
<svg width='300' height='180'>
  <g transform='translate(5, 15)'>
    <text x="0" y="0">Howdy!</text>
    <path d="M0,50 L50,0 Q100,0 100,50"
      fill="none" stroke-width="3" stroke="black" />
  </g>
</svg>
```

SVG文件里面还可以插入图片文件。

```xml
<svg viewBox="0 0 1 1" width="100" height="100">
  <image xlink:href="path/to/image.jpg"
    width="100%" height="100%"
    preserveAspectRatio="xMidYMid slice"/>
</svg>
```

上面代码中，`viewBox`表示长宽比例，这里是1：1（即正方形），第一对`width`和`height`表示图形默认的宽和高（CSS代码可以覆盖掉这两个值），`xlink:href`表示引用图像的来源，第二对`width`和`height`表示图像占满整个SVG图形，`preserveAspectRatio`等于`xMidYMid slice`，告诉浏览器置中图片，并且删去溢出的部分，更多参数可以参考[MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio)。

## DOM 操作

如果SVG代码直接写在HTML网页之中，它就成为网页DOM的一部分，可以直接用DOM操作。

```html
<svg
  id="mysvg"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 800 600"
  preserveAspectRatio="xMidYMid meet"
>
  <circle id="mycircle" cx="400" cy="300" r="50" />
<svg>
```

上面代码插入网页之后，就可以用CSS定制样式。

```css
circle {
  stroke-width: 5;
  stroke: #f00;
  fill: #ff0;
}

circle:hover {
  stroke: #090;
  fill: #fff;
}
```

然后，可以用JavaScript代码操作SVG文件。

```javascript
var mycircle = document.getElementById('mycircle');

mycircle.addEventListener('click', function(e) {
  console.log('circle clicked - enlarging');
  mycircle.setAttributeNS(null, 'r', 60);
}, false);
```

上面代码指定，如果点击图形，就改写`circle`元素的`r`属性。

## JavaScript操作

### 获取SVG DOM

如果使用`<img>`标签插入SVG文件，就无法获取SVG DOM。使用`<object>`、`<iframe>`、`<embed>`标签，可以获取SVG DOM。

```javascript
var svgObject = document.getElementById('object').contentDocument;
var svgIframe = document.getElementById('iframe').contentDocument;
var svgEmbed = document.getElementById('embed').getSVGDocument();
```

由于SVG文件就是一般的XML文件，因此可以用DOM方法，选取页面元素。

```javascript
// 改变填充色
document.getElementById('theCircle').style.fill = 'red';

// 改变元素属性
document
.getElementById('theCircle')
.setAttribute('class', 'changedColors');

// 绑定事件回调函数
document
.getElementById('theCircle')
.addEventListener('click', function () {
  console.log('clicked')
});
```

### 读取svg源码

由于svg文件就是一个XML代码的文本文件，因此可以通过读取XML代码的方式，读取SVG源码。

假定网页中有一个SVG元素。

```html
<div id="svg-container">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve" width="500" height="440"
  >
    <!-- svg code -->
  </svg>
</div>
```

使用XMLSerializer实例的serializeToString方法，获取svg元素的代码。

```javascript
var svgString = new XMLSerializer()
  .serializeToString(document.querySelector('svg'));
```

### 将svg图像转为canvas图像

首先，需要新建一个`Image`对象，将svg图像指定到该`Image`对象的`src`属性。

```javascript
var img = new Image();
var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});

var DOMURL = self.URL || self.webkitURL || self;
var url = DOMURL.createObjectURL(svg);

img.src = url;
```

然后，当图像加载完成后，再将它绘制到`<canvas>`元素。

```javascript
img.onload = function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
};
```

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
- Tyler Sticka, [Cropping Image Thumbnails with SVG](https://cloudfour.com/thinks/cropping-image-thumbnails-with-svg/)
