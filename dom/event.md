---
title: DOM 事件
layout: page
category: dom
date: 2013-11-15
modifiedOn: 2013-11-15
---

## 概述

DOM定义了一些事件，允许开发者指定它们的回调函数。

指定回调事件的方法有三种。

**（1）HTML属性定义**

HTML语言允许在元素的属性中，直接定义某些事件的回调代码。

{% highlight html %}

<body onclick="console.log('触发事件')">

{% endhighlight %}

**（2）Element对象的事件属性**

Element对象有事件属性，可以定义回调函数。

{% highlight javascript %}

document.querySelector('div').onclick = function(){
	console.log('触发事件')
};

{% endhighlight %}

**（3）addEventListener方法**

通过Element对象的addEventListener方法，也可以定义事件的回调函数。

{% highlight javascript %}

document.querySelector('div').addEventListener('click',function(){
			console.log('fire/trigger addEventListener')
}, false);

{% endhighlight %}

addEventListener方法有三个参数，第一个是事件名称，第二个是回调函数，第三个是一个布尔值，表示回调函数是否在捕获阶段（capture）触发，如果设为false，则回调函数只在冒泡阶段被触发。

IE 8及以下版本不支持该方法。

与addEventListener配套的，还有一个removeEventListener方法，用来移除某一类事件的回调函数。

{% highlight javascript %}

element.removeEventListener(event, callback, use-capture);

{% endhighlight %}

注意，removeEventListener的回调函数与addEventListener的回调函数，必须是同一个函数，否则无效。

**（4）简评**

上面三种方法之中，第一种违反了HTML与JavaScript代码相分离的原则，不建议使用；第二种的缺点是，同一个事件只能定义一个回调函数，也就是说，如果定义两次onclick属性，后一次定义会覆盖前一次；第三种是推荐使用的方法，不仅可以多个回调函数，而且可以统一接口。

## 事件的传播

当一个事件发生以后，它会在不同的DOM对象之间传播（propagation）。这种传播分成三个阶段：

- **第一阶段**：从文档的根元素（html元素）传导到目标元素，称为“捕获阶段”（capture phase）。

- **第二阶段**：在目标元素上触发，称为“目标阶段”（target phase）。

- **第三阶段**：从目标元素传导回文档的根元素（html元素），称为“冒泡阶段”（bubbling phase）。

这种三阶段的传播模型，会使得一个事件在多个元素上触发。比如，假设div元素之中嵌套一个p元素。

{% highlight html %}

<div>
    <p>Click Me</p>
</div> 

{% endhighlight %}

如果对这两个元素的click事件都设定回调函数，则click事件会被触发四次。

{% highlight javascript %}

var phases = {
  1: 'capture',
  2: 'target',
  3: 'bubble'
};

var div = document.querySelector('div');
var p = document.querySelector('p');

div.addEventListener('click', callback, true);
p.addEventListener('click', callback, true);
div.addEventListener('click', callback, false);
p.addEventListener('click', callback, false);

function callback(event) {
  var tag = event.currentTarget.tagName;
  var phase = phases[event.eventPhase];
  console.log("Tag: '" + tag + "'. EventPhase: '" + phase + "'");
}

// 点击以后的结果
// Tag: 'DIV'. EventPhase: 'capture'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'DIV'. EventPhase: 'bubble' 

{% endhighlight %}

上面代码表示，click事件被触发了四次。

1. 捕获阶段：事件从div向p传播时，触发div的click事件；
2. 目标阶段：事件从div到达p时，触发p的click事件；
3. 目标阶段：事件离开p时，触发p的click事件；
4. 冒泡阶段：事件从p传回div时，再次触发div的click事件。

注意，用户点击网页的时候，浏览器总是假定click事件的目标对象，就是嵌套最深的那个元素（嵌套在div元素中的p元素）。

由于事件会在冒泡阶段向上传播到父元素，因此可以把子元素的回调函数定义在父元素上，由父元素的回调函数统一处理多个子元素的事件。这种方法叫做事件的代表（delegation）。

{% highlight javascript %}

var ul = document.querySelector('ul');

ul.addEventListener('click', function(event) {

  if (event.target.tagName === 'LI') {
    // some code
  }

});

{% endhighlight %}

上面代码的click事件的回调函数是定义在ul元素上的，但是实际上，它处理的是子元素li的click事件。这样做的好处是，只要定义一个回调函数，就能处理多个子元素的事件，而且以后再添加子元素，回调函数依然有效。

如果希望事件到某个节点为止，不再传播，可以使用事件对象的stopPropagation方法。

{% highlight javascript %}

p.addEventListener('click', function(event) {
 event.stopPropagation();
});

{% endhighlight %}

使用上面的代码以后，click事件在冒泡阶段到达p元素以后，就不再向上（父元素的方向）传播了。

但是，stopPropagation方法不会阻止p元素上的其他click事件的回调函数。如果想要不再触发那些回调函数，可以使用stopImmediatePropagation方法。

{% highlight javascript %}

p.addEventListener('click', function(event) {
 event.stopImmediatePropagation();
});

p.addEventListener('click', function(event) {
 // 不会被触发
});

{% endhighlight %}

## 事件的类型

DOM支持多种事件。

### 用户界面事件

（1）Load事件

Load事件在资源加载完成时触发。能够触发它的元素包括图像（image）、样式表（style sheet）、脚本（script）、视频（ideo）、音频（audio）、Ajax请求（XMLHttpRequest）、Ajax文件上传（XMLHttpRequestUpload）、文档（document）和窗口（window）。

{% highlight javascript %}

image.addEventListener('load', function(event) {
  image.classList.add('finished');
});

{% endhighlight %}

上面代码在图片元素加载完成后，为它的calss属性添加一个值“finished”。

（2）unload事件

该事件在卸载某个资源时触发。window、body、frameset等元素都可能触发该事件。

（3）beforeunload事件

该事件在用户关闭网页时触发。它可以用来防止用户不当心关闭网页。

该事件的特别之处在于，它会自动跳出一个确认对话框，让用户确认是否关闭网页。如果用户点击“取消”按钮，网页就不会关闭。beforeunload事件的回调函数所返回的字符串，会显示在确认对话框之中。

{% highlight javascript %}

window.onbeforeunload = function() {
  if (textarea.value != textarea.defaultValue) {
    return '你确认要离开吗？';
  }
};

{% endhighlight %}

上面代码表示，当用户关闭网页，会跳出一个确认对话框，上面显示“你确认要离开吗？”。

（4）resize事件

改变浏览器窗口大小时会触发该事件。能够触发它的元素包括window、body、frameset。

（5）error事件

资源加载出错时触发该事件。它主要发生在需要加载资源的元素（比如图片、视频、脚本等）、以及Ajax请求（XMLHttpRequest）、Ajax文件上传（ XMLHttpRequestUpload）等对象。

{% highlight javascript %}

image.addEventListener('error', function(event) {
  image.style.display = 'none';
});

{% endhighlight %}

上面代码表示，当image对象加载出错，就设置它的样式为不显示。

有时候，图片加载会在脚本运行之前就完成，尤其是当脚本放置在网页底部的时候，因此有可能上面这行代码根本不会被执行。所以，比较可靠的方式，是将error事件的回调函数放在img元素的HTML属性中。

{% highlight javascript %}

<img src="/wrong/url" onerror="this.style.display='none';" />

{% endhighlight %}

error事件有一个特殊的性质，就是不会冒泡。这样设计是正确的，防止引发父元素的error事件回调函数。

（6）abort事件

资源在加载成功前停止加载时触发该事件，主要发生在element、XMLHttpRequest、XMLHttpRequestUpload对象。

（7）scroll事件

用户滚动窗口或某个元素时触发该事件，主要发生在element、document、window对象。

（8）contextmenu事件

用户鼠标右击某个元素时触发，主要发生在element对象。

### 焦点事件

<table class="responsive">
<thead>
<tr>
	<th>事件名称</th>
	<th>涵义</th>
	<th>事件的目标</th>
</tr>
</thead>
<tbody>
<tr>
	<td>blur</td>
	<td>元素丧失焦点</td>
	<td>Element（除了body和frameset元素），Document</td>
</tr>
<tr>
	<td>focus</td>
	<td>元素获得焦点</td>
	<td>Element（除了body和frameset元素），Document</td>
</tr>
<tr>
	<td>focusin</td>
	<td>元素即将获得焦点，在focus之前触发</td>
	<td>Element</td>
</tr>
<tr>
	<td>focusout</td>
	<td>元素即将丧失焦点，在blur之前触发</td>
	<td>Element</td>
</tr>
</tbody>
</table>

### 鼠标事件

### CSS事件

（1）transitionEnd事件

CSS变动的过渡（transition）结束后，触发该事件。

{% highlight javascript %}

div.addEventListener('webkitTransitionEnd', onTransitionEnd);
div.addEventListener('mozTransitionEnd', onTransitionEnd);
div.addEventListener('msTransitionEnd', onTransitionEnd);
div.addEventListener('transitionEnd', onTransitionEnd);

function onTransitionEnd() {
  console.log('Transition end');
}

{% endhighlight %}

目前，该事件需要添加浏览器前缀。另外，它与其他CSS事件一样，也存在向上传播的冒泡阶段。

（2）animationiteration事件

当CSS动画结束一次循环，就会触发该事件。

{% highlight javascript %}

div.addEventListener('animationiteration', function() {
  console.log('完成一次动画');
});

{% endhighlight %}

（3）animationEnd事件

animation动画结束时触发该事件。

## event对象

当事件发生以后，会生成一个事件对象event，在DOM中传递，也被作为参数传给回调函数。

event对象有以下属性。

- type：返回一个字符串，表示事件的名称。
- target：返回一个Element节点，表示事件起源的那个节点。
- currentTarget：返回一个Element节点，表示触发回调函数的那个节点。
- bubbles：返回一个布尔值，表示事件触发时，是否处在“冒泡”阶段。
- cancelable：返回一个布尔值，表示该事件的默认行为是否可以被preventDefault方法阻止。
- defaultPrevented：返回一个布尔值，表示是否已经调用过preventDefault方法。
- isTrusted：返回一个布尔值，表示事件是否可信任，即事件是从设备上触发，还是JavaScript方法模拟的。
- eventPhase：返回一个数字，表示事件目前所处的阶段，0为事件开始从DOM表层向目标元素传播，1为捕获阶段，2为事件到达目标元素，3为冒泡阶段。
- timestamp：返回一个数字，

除了上面这些属性，特定事件还会有一些独特的属性。比如，click事件的event对象就有clientX和clientY属性，表示事件发生的位置相对于视口左上角的水平坐标和垂直坐标。

event对象有以下方法。

（1）preventDefault方法

该方法阻止事件所对应的浏览器默认行为。比如点击a元素后，浏览器跳转到指定页面，或者按一下空格键，页面向下滚动一段距离。

{% highlight javascript %}

anchor.addEventListener('click', function(event) {
  event.preventDefault();
  // some code
});

{% endhighlight %}

（2）stopPropagation方法

该方法阻止事件在DOM中继续传播，防止再触发定义在别的节点上的回调函数，但是不包括在当前节点上新定义的事件回调函数。

（3）stopImmediatePropagation方法

该方法的作用与stopPropagation方法相同，唯一的区别是还阻止当前节点上后继定义的事件回调函数。

## 自定义事件

浏览器允许用户通过CustomEvent构造函数，定义自己的事件对象。

{% highlight javascript %}

var myEvent = new CustomEvent("myevent", {
  detail: {
    name: "张三"
  },
  bubbles: true,
  cancelable: false
});

{% endhighlight %}

构造函数CustomEvent接受两个参数，第一个是事件名称，第二个是事件的属性对象。

定义事件对象以后，就可以用addEventListener方法为时事件指定回调函数，用dispatchEvent方法触发该时间。

{% highlight javascript %}

element.addEventListener('myevent', function(event) {
  console.log('Hello ' + event.detail.name);
});

element.dispatchEvent(myEvent);

{% endhighlight %}

IE 8及以下版本不支持CustomEvent构造函数。

## 参考链接

- Wilson Page, [An Introduction To DOM Events](http://coding.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/)
