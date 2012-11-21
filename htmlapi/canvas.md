---
title: Canvas API
layout: page
date: 2012-11-21
---

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
