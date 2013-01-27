---
title: Canvas API
layout: page
date: 2012-11-21
category: htmlapi
modifiedOn: 2013-01-26
---

## 概述

Canvas API用于网页实时生成图像。

它的优点是：减少HTTP请求数，减少下载的数据，加快网页载入时间，可以对图像进行实时处理。

它建立在canvas网页元素的基础上。

{% highlight html %}

<canvas id="myCanvas" width="400" height="200">
	您的浏览器不支持canvas！
</canvas>

{% endhighlight %}

## 新建canvas

首先获取canvas的DOM对象。

{% highlight javascript %}

var canvas = document.getElementById('myCanvas');

{% endhighlight %}

然后，检查浏览器是否支持Canvas API，方法是看有没有部署getContext方法。

{% highlight javascript %}

if (canvas.getContext) {

}

{% endhighlight %}

接下来，使用getContext('2d')方法，初始化2D图像上下文环境。

{% highlight javascript %}

var ctx = canvas.getContext('2d');

{% endhighlight %}

这样就可以生成平面图像了。

## 绘图

### 颜色

设置填充颜色。

{% highlight javascript %}

ctx.fillStyle = "#000000"; // 设置填充色为黑色

{% endhighlight %}

### 矩形

绘制实心矩形。

{% highlight javascript %}

ctx.fillRect(10,10,200,100); 

{% endhighlight %}

绘制空心矩形。

{% highlight javascript %}

ctx.strokeRect(10,10,200,100); 

{% endhighlight %}

清除某个矩形区域的内容。

{% highlight javascript %}

ctx.clearRect(100,50,50,50);  

{% endhighlight %}

### 路径

{% highlight javascript %}

ctx.beginPath(); // 开始路径绘制

ctx.moveTo(20, 20); // 设置路径起点

ctx.lineTo(200, 20); // 绘制一条到200, 20的直线

ctx.lineWidth = 1.0; // 设置线宽

ctx.strokeStyle = "#CC0000"; // 设置线的颜色

ctx.stroke(); // 进行线的着色，这时整条线才变得可见

{% endhighlight %}

moveto和lineto方法可以多次使用。最后，还可以使用closePath方法，自动绘制一条当前点到起点的直线，形成一个封闭图形，省却使用以此lineto方法。

### 圆形和扇形

绘制扇形的方法。

{% highlight javascript %}

ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

{% endhighlight %}

arc方法的x和y参数是圆心坐标，radius是半径，startAngle和endAngle则是扇形的起始角度和终止角度（以弧度表示），anticlockwise表示做图时应该逆时针画（true）还是顺时针画（false）。

绘制实心的圆形。

{% highlight javascript %}

ctx.beginPath(); 

ctx.arc(60, 60, 50, 0, Math.PI*2, true); 

ctx.fillStyle = "#000000"; 

ctx.fill();

{% endhighlight %}

绘制空心圆形。

{% highlight javascript %}

ctx.beginPath(); 

ctx.arc(60, 60, 50, 0, Math.PI*2, true); 

ctx.lineWidth = 1.0; 

ctx.strokeStyle = "#000"; 

ctx.stroke();

{% endhighlight %}

### 文本

{% highlight javascript %}

ctx.font = "Bold 20px Arial"; // 设置字体

ctx.textAlign = "left"; // 设置对齐方式

ctx.fillStyle = "#008600"; // 设置填充颜色

ctx.fillText("Hello!", 10, 50); // 设置字体内容，以及在画布上的位置

ctx.strokeText('Hello!", 10, 100); // 绘制空心字

{% endhighlight %}

fillText方法不支持文本断行，即所有文本出现在一行内。所以，如果你要生成多行文本，只有调用多次fillText方法。

### 插入图像

可以在画布内插入图像文件。

{% highlight javascript %}

var img = new Image();

img.src = "image.png";

ctx.drawImage(img, 0, 0); // 设置对应的图像对象，以及它在画布上的位置

{% endhighlight %}

由于图像的载入需要时间，drawImage方法只能在图像完全载入后才能调用，因此上面的代码需要改写。

{% highlight javascript %}

var img = new Image(); 

img.onload = function() { 
	ctx.drawImage(img, 10, 10); 
} 

img.src = "image.png";

{% endhighlight %}

### 渐变

设置渐变色。

{% highlight javascript %}

var myGradient = ctx.createLinearGradient(0, 0, 0, 160); 

myGradient.addColorStop(0, "#BABABA"); 

myGradient.addColorStop(1, "#636363");

{% endhighlight %}

createLinearGradient方法的参数是(x1, y1, x2, y2)，其中x1和y1是起点坐标，x2和y2是终点坐标。通过不同的坐标值，可以生成从上至下、从左到右的渐变等等。

使用方法如下：

{% highlight javascript %}

ctx.fillStyle = myGradient;
ctx.fillRect(10,10,200,100);

{% endhighlight %}

### 阴影

{% highlight javascript %}

ctx.shadowOffsetX = 10; // 设置水平位移

ctx.shadowOffsetY = 10; // 设置垂直位移

ctx.shadowBlur = 5; // 设置模糊度

ctx.shadowColor = "rgba(0,0,0,0.5)"; // 设置阴影颜色

ctx.fillStyle = "#CC0000"; 
ctx.fillRect(10,10,200,100);

{% endhighlight %}

## 保存和恢复上下文

save方法用于保存上下文环境，restore方法用于恢复到上一次保存的上下文环境。

{% highlight javascript %}

ctx.save(); 

ctx.shadowOffsetX = 10;
ctx.shadowOffsetY = 10;
ctx.shadowBlur = 5;
ctx.shadowColor = "rgba(0,0,0,0.5)";

ctx.fillStyle = "#CC0000";
ctx.fillRect(10,10,150,100);

ctx.restore(); 

ctx.fillStyle = "#000000";
ctx.fillRect(180,10,150,100); 

{% endhighlight %}

上面的代码一共绘制了两个矩形，前一个有阴影，后一个没有。

## 转化图像文件到Canvas

将图像文件转化到Canvas，可以使用Canvas元素的drawImage()方法。

{% highlight javascript %}

function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}

{% endhighlight %}

drawImage()方法接受三个参数，第一个参数是图像文件的DOM元素（即img标签），第二个和第三个参数是图像左上角在Canvas元素中的坐标，上例中的（0, 0）就表示将图像左上角放置在Canvas元素的左上角。

## 转化Canvas到图像文件

对图像数据做出修改以后，可以将Canvas数据重新转化成Image数据。

{% highlight javascript %}

function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}

{% endhighlight %}

上面的代码将Canvas数据，转化成PNG data URI。

## 参考链接

* David Walsh, [JavaScript Canvas Image Conversion](http://davidwalsh.name/convert-canvas-image)
- Matt West, [Getting Started With The Canvas API](http://blog.teamtreehouse.com/getting-started-with-the-canvas-api)
