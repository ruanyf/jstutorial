---
title: Canvas API
layout: page
date: 2012-11-21
category: htmlapi
modifiedOn: 2013-06-10
---

## 概述

Canvas用于在网页展示图像，并且可以定制内容，基本上它是一个可以用JavaScript操作的位图（bitmap）。

Canvas API用于网页实时生成图像，JavaScript通过API来操作图像内容。这样做的优点是：减少HTTP请求数，减少下载的数据，加快网页载入时间，可以对图像进行实时处理。

使用前，首先需要新建一个canvas网页元素。

{% highlight html %}

<canvas id="myCanvas" width="400" height="200">
	您的浏览器不支持canvas！
</canvas>

{% endhighlight %}

如果浏览器不支持这个API，则就会显示canvas标签中间的文字——“您的浏览器不支持canvas！”。

然后，使用JavaScript获取canvas的DOM对象。

{% highlight javascript %}

var canvas = document.getElementById('myCanvas');

{% endhighlight %}

接着，检查浏览器是否支持Canvas API，方法是看有没有部署getContext方法。

{% highlight javascript %}

if (canvas.getContext) {
	// some code here
}

{% endhighlight %}

使用getContext('2d')方法，初始化平面图像的上下文环境。

{% highlight javascript %}

var ctx = canvas.getContext('2d');

{% endhighlight %}

现在就在canvas中间生成平面图像了。

## 绘图方法

（1）填充颜色

设置填充颜色。

{% highlight javascript %}

ctx.fillStyle = "#000000"; // 设置填充色为黑色

{% endhighlight %}

（2）绘制矩形

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

（3）绘制路径

{% highlight javascript %}

ctx.beginPath(); // 开始路径绘制

ctx.moveTo(20, 20); // 设置路径起点

ctx.lineTo(200, 20); // 绘制一条到200, 20的直线

ctx.lineWidth = 1.0; // 设置线宽

ctx.strokeStyle = "#CC0000"; // 设置线的颜色

ctx.stroke(); // 进行线的着色，这时整条线才变得可见

{% endhighlight %}

moveto和lineto方法可以多次使用。最后，还可以使用closePath方法，自动绘制一条当前点到起点的直线，形成一个封闭图形，省却使用以此lineto方法。

（4）绘制圆形和扇形

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

（5）绘制文本

fillText方法用于添加文本，strokeText方法用于添加空心字。使用之前，需设定字体、对齐方向、颜色等属性。

{% highlight javascript %}

ctx.font = "Bold 20px Arial"; // 设置字体

ctx.textAlign = "left"; // 设置对齐方式

ctx.fillStyle = "#008600"; // 设置填充颜色

ctx.fillText("Hello!", 10, 50); // 设置字体内容，以及在画布上的位置

ctx.strokeText('Hello!", 10, 100); // 绘制空心字

{% endhighlight %}

fillText方法不支持文本断行，即所有文本出现在一行内。所以，如果你要生成多行文本，只有调用多次fillText方法。

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

## 图像处理方法

### 插入图像

canvas允许将图像文件插入画布，做法是读取图片后，使用drawImage方法在画布内进行重绘。

{% highlight javascript %}

var img = new Image();

img.src = "image.png";

ctx.drawImage(img, 0, 0); // 设置对应的图像对象，以及它在画布上的位置

{% endhighlight %}

由于图像的载入需要时间，drawImage方法只能在图像完全载入后才能调用，因此上面的代码需要改写。

{% highlight javascript %}

var image = new Image(); 

image.onload = function() { 

	if (image.width != canvas.width)
        canvas.width = image.width;
    if (image.height != canvas.height)
        canvas.height = image.height;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

} 

image.src = "image.png";

{% endhighlight %}

drawImage()方法接受三个参数，第一个参数是图像文件的DOM元素（即img标签），第二个和第三个参数是图像左上角在Canvas元素中的坐标，上例中的（0, 0）就表示将图像左上角放置在Canvas元素的左上角。

### 读取Canvas的内容

getImageData方法可以用来读取Canvas的内容，返回一个对象，包含了每个像素的信息。

{% highlight javascript %}

var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

{% endhighlight %}

imageData对象有一个data属性，它的值是一个一维数组。该数组的值，依次是每个像素的红、绿、蓝、alpha通道值，因此该数组的长度等于 图像的像素宽度 x 图像的像素高度 x 4，每个值的范围是0–255。这个数组不仅可读，而且可写，因此通过操作这个数组的值，就可以达到操作图像的目的。修改这个数组以后，使用putImageData方法将数组内容重新回Canvas。

{% highlight javascript %}

context.putImageData(imageData, 0, 0);

{% endhighlight %}

### 像素处理

假定filter是一个处理像素的函数，那么整个对Canvas的处理流程，可以用下面的代码表示。

{% highlight javascript %}

if (canvas.width > 0 && canvas.height > 0) {

	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    filter(imageData);

    context.putImageData(imageData, 0, 0);

}

{% endhighlight %}

以下是几种常见的处理方法。

（1）灰度效果

灰度图（grayscale）就是取红、绿、蓝三个像素值的算术平均值，这实际上将图像转成了黑白形式。假定d[i]是像素数组中一个象素的红色值，则d[i+1]为绿色值，d[i+2]为蓝色值，d[i+3]就是alpha通道值。转成灰度的算法，就是将红、绿、蓝三个值相加后除以3，再将结果写回数组。

{% highlight javascript %}

grayscale = function (pixels) {

	var d = pixels.data;

    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      d[i] = d[i + 1] = d[i + 2] = (r+g+b)/3;
    }

    return pixels;

};

{% endhighlight %}

（2）复古效果

复古效果（sepia）则是将红、绿、蓝三个像素，分别取这三个值的某种加权平均值，使得图像有一种古旧的效果。

{% highlight javascript %}

sepia = function (pixels) {

    var d = pixels.data;

    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      d[i]     = (r * 0.393)+(g * 0.769)+(b * 0.189); // red
      d[i + 1] = (r * 0.349)+(g * 0.686)+(b * 0.168); // green
      d[i + 2] = (r * 0.272)+(g * 0.534)+(b * 0.131); // blue
    }

    return pixels;

};

{% endhighlight %}

（3）红色蒙版效果

红色蒙版指的是，让图像呈现一种偏红的效果。算法是将红色通道设为红、绿、蓝三个值的平均值，而将绿色通道和蓝色通道都设为0。

{% highlight javascript %}

red = function (pixels) {
	
    var d = pixels.data;

    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      d[i] = (r+g+b)/3;        // 红色通道取平均值
      d[i + 1] = d[i + 2] = 0; // 绿色通道和蓝色通道都设为0
    }

    return pixels;

};

{% endhighlight %}

（4）亮度效果

亮度效果（brightness）是指让图像变得更亮或更暗。算法将红色通道、绿色通道、蓝色通道，同时加上一个正值或负值。

{% highlight javascript %}

brightness = function (pixels, delta) {

    var d = pixels.data;

    for (var i = 0; i < d.length; i += 4) {
          d[i] += delta;     // red
          d[i + 1] += delta; // green
          d[i + 2] += delta; // blue   
    }

	return pixels;

};

{% endhighlight %}

（5）反转效果

反转效果（invert）是值图片呈现一种色彩颠倒的效果。算法为红、绿、蓝通道都取各自的相反值（255-原值）。

{% highlight javascript %}

invert = function (pixels) {

	var d = pixels.data;

	for (var i = 0; i < d.length; i += 4) {
		d[i] = 255 - d[i];
		d[i+1] = 255 - d[i + 1];
		d[i+2] = 255 - d[i + 2];
	}

	return pixels;

};

{% endhighlight %}

### 将Canvas转化为图像文件

对图像数据做出修改以后，可以使用toDataURL方法，将Canvas数据重新转化成一般的图像文件形式。

{% highlight javascript %}

function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}

{% endhighlight %}

上面的代码将Canvas数据，转化成PNG data URI。

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

## 参考链接

- David Walsh, [JavaScript Canvas Image Conversion](http://davidwalsh.name/convert-canvas-image)
- Matt West, [Getting Started With The Canvas API](http://blog.teamtreehouse.com/getting-started-with-the-canvas-api)
- John Robinson, [How You Can Do Cool Image Effects Using HTML5 Canvas](http://www.storminthecastle.com/2013/04/06/how-you-can-do-cool-image-effects-using-html5-canvas/)
