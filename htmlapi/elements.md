---
title: 概述
category: htmlapi
layout: page
date: 2014-07-08
modifiedOn: 2014-07-08
---

## 元素与变量名

### id属性

由于历史原因，HTML元素的`id`属性的名字，会自动成为全局变量，指向该HTML元素。

```javascript
// HTML元素为
// <div id="example"></div>

example // [object HTMLDivElement]
```

上面代码中，有一个`id`属性等于`example`的`div`元素，结果就自动生成了全局变量`example`，指向这个`div`元素。

如果已有同名全局变量，则`id`元素不会自动生成全局变量。

```html
<script>
var example = 1;
</script>

<div id="example"></div>

<script>
console.log(example) // 1
</script>
```

上面代码中，已有全局变量`example`，这时`id`属性就不会自动变成全局变量。另一情况是，DOM生成以后，再对全局变量`example`赋值，这时也会覆盖`example`原来的值。

由于这种原因，默认的全局变量名（比如，`history`、`location`、`navigator`等），最好不要设为`id`属性的名字。

另外，由于原则上，网页之中不应该有同名`id`属性的HTML元素，所以，这种机制产生的全局变量不会重名。

### name属性

由于历史原因，以下HTML元素的`name`属性，也会成为全局变量。

- `<a>`
- `<applet>`
- `<area>`
- `<embed>`
- `<form>`
- `<frame>`
- `<frameset>`
- `<iframe>`
- `<img>`
- `<object>`

```javascript
// HTML代码为
// <form name="myForm" />

myForm // [object HTMLFormElement]
```

上面代码中，`form`元素的`name`属性名`myForm`，自动成为全局变量`myForm`。

如果`name`属性同名的HTML元素不止一个，或者某个元素的`id`属性与另一个元素的`name`属性同名，这时全局变量会指向一个类似数组的对象。

```javascript
// HTML代码为
// <div id="myForm" />
// <form name="myForm" />

myForm[0] // [object HTMLDivElement]
myForm[1] // [object HTMLFormElement]
```

上面代码中，全局变量`myForm`的第一个成员指向`div`元素，第二个成员指向`form`元素。

另外，如果`iframe`元素有`name`属性或`id`属性，那么生成的全局变量，不是指向`iframe`元素节点，而是指向这个`iframe`代表的子页面`window`对象。

## image元素

### alt属性，src属性

`alt`属性返回`image`元素的HTML标签的`alt`属性值，`src`属性返回`image`元素的HTML标签的`src`属性值。

```javascript
// 方法一：HTML5构造函数Image
var img1 = new Image();
img1.src = 'image1.png';
img1.alt = 'alt';
document.body.appendChild(img1);

// 方法二：DOM HTMLImageElement
var img2 = document.createElement('img');
img2.src = 'image2.jpg';
img2.alt = 'alt text';
document.body.appendChild(img2);

document.images[0].src
// image1.png
```

### complete属性

complete属性返回一个布尔值，true表示当前图像属于浏览器支持的图形类型，并且加载完成，解码过程没有出错，否则就返回false。

### height属性，width属性

这两个属性返回image元素被浏览器渲染后的高度和宽度。

### naturalWidth属性，naturalHeight属性

这两个属性只读，表示image对象真实的宽度和高度。

```javascript

myImage.addEventListener('onload', function() {
	console.log('My width is: ', this.naturalWidth);
	console.log('My height is: ', this.naturalHeight);
});

```

## audio元素，video元素

audio元素和video元素加载音频和视频时，以下事件按次序发生。

- loadstart：开始加载音频和视频。
- durationchange：音频和视频的duration属性（时长）发生变化时触发，即已经知道媒体文件的长度。如果没有指定音频和视频文件，duration属性等于NaN。如果播放流媒体文件，没有明确的结束时间，duration属性等于Inf（Infinity）。
- loadedmetadata：媒体文件的元数据加载完毕时触发，元数据包括duration（时长）、dimensions（大小，视频独有）和文字轨。
- loadeddata：媒体文件的第一帧加载完毕时触发，此时整个文件还没有加载完。
- progress：浏览器正在下载媒体文件，周期性触发。下载信息保存在元素的buffered属性中。
- canplay：浏览器准备好播放，即使只有几帧，readyState属性变为CAN_PLAY。
- canplaythrough：浏览器认为可以不缓冲（buffering）播放时触发，即当前下载速度保持不低于播放速度，readyState属性变为CAN_PLAY_THROUGH。

除了上面这些事件，audio元素和video元素还支持以下事件。

事件|触发条件
----|--------
abort|播放中断
emptied|媒体文件加载后又被清空，比如加载后又调用load方法重新加载。
ended|播放结束
error|发生错误。该元素的error属性包含更多信息。
pause|播放暂停
play|暂停后重新开始播放
playing|开始播放，包括第一次播放、暂停后播放、结束后重新播放。
ratechange|播放速率改变
seeked|搜索操作结束
seeking|搜索操作开始
stalled|浏览器开始尝试读取媒体文件，但是没有如预期那样获取数据
suspend|加载文件停止，有可能是播放结束，也有可能是其他原因的暂停
timeupdate|网页元素的currentTime属性改变时触发。
volumechange|音量改变时触发（包括静音）。
waiting|由于另一个操作（比如搜索）还没有结束，导致当前操作（比如播放）不得不等待。

