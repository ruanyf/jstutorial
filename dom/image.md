---
title: Image对象
category: dom
layout: page
date: 2016-09-04
modifiedOn: 2016-09-04
---

## 概述

`Image`是一个浏览器的原生构造函数，返回一个`HTMLImageElement`对象的实例，即`<img>`标签的实例。

```javascript
var img = new Image();
img instanceof Image // true
img instanceof HTMLImageElement // true
```

以下方法得到的节点对象，都是`HTMLImageElement`的实例，具有同样的属性和方法。

- `document.images`的成员
- 节点选取方法得到的`<img>`节点
- `document.createElement('img')`生成的`<img>`节点

```javascript
document.images[0] instanceof HTMLImageElement
// true

var img = document.getElementById('myImg');
img instanceof HTMLImageElement
// true

var img = document.createElement('img');
img instanceof HTMLImageElement
// true
```

`Image.src`属性对应`<img>`节点的`src`属性，即图像来源。

```javascript
var img = new Image();
img.src = 'picture.jpg';
```

`Image`构造函数可以接受两个参数，分别是`<img>`节点的宽和高。

```javascript
var myImage = new Image(100, 200);
myImage.src = 'picture.jpg';
```

上面代码中，新生成的`Image`标签的宽度是100像素，高度是200像素。

注意，新生成的`Image`实例，并不属于文档的一部分。如果想让它显示在文档中，必须手动插入文档。

```javascript
var img = new Image();
// 等同于 var img = document.createElement('img');

img.src = 'image1.png';
img.alt = 'alt';
document.body.appendChild(img);
```

## 属性

`Image`实例具有以下属性。

- alt：对应`<img>`的`alt`属性，表示图像的说明文字
- `complete`：返回一个布尔值，表示图表是否已经加载完成
- crossOrigin：图像跨域的`CORS`设置
- height：图像的高度，可读写
- isMap：图像是否为服务器端的`image-map`，可读写
- onload：指定一个图像加载完成后的回调函数。
- naturalHeight：图像的原始高度，只读
- naturalWidth：图像的原始宽度，只读
- src：`<img>`的`src`属性，即图像的来源，可读写
- useMap：设置图像的`usemap`属性
- width：图像的宽度，可读写

下面是`complete`属性的一个例子。

```javascript
document.addEventListener("DOMContentLoaded", function (event) {
  var addImageOrientationClass = function(img) {
    if(img.naturalHeight > img.naturalWidth) {
      img.classList.add('portrait');
    }
  }

  var images = document.querySelectorAll('.container img');
  for(var i = 0; i < images.length; i++) {
    if(images[i].complete) {
      addImageOrientationClass(images[i]);
    } else {
    images[i].addEventListener('load', function(evt) {
        addImageOrientationClass(evt.target);
      });
    }
  }
});
```

上面的代码，选取了容器里面所有的`<img>`元素，然后检查它的高度是否大于宽度，如果是的，就为它加上一个`portrait`类。

下面是`onload`属性的一个例子。

```javascript
var img = new Image();
img.src = "nastya.jpg";
img.onload = function() {
  // ...
};
```
