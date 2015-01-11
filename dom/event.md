---
title: DOM 事件
layout: page
category: dom
date: 2013-11-15
modifiedOn: 2013-12-19
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

div.onclick = function(event){
	console.log('触发事件');
};

{% endhighlight %}

**（3）addEventListener方法，removeEventListener方法**

通过Element对象的addEventListener方法，也可以定义事件的回调函数。

{% highlight javascript %}

button.addEventListener('click', 
		function(){console.log('Hello world');}, 
		false);

{% endhighlight %}

addEventListener方法有三个参数，依次为

- 事件名称，上面代码中为click。
- 回调函数，上面代码中为在控制台显示“Hello world”。
- 布尔值，表示回调函数是否在捕获阶段（capture）触发，默认为false，表示回调函数只在冒泡阶段被触发。

IE 8及以下版本不支持该方法。

与addEventListener配套的，还有一个removeEventListener方法，用来移除某一类事件的回调函数。

{% highlight javascript %}

element.removeEventListener(event, callback, use-capture);

{% endhighlight %}

注意，removeEventListener的回调函数与addEventListener的回调函数，必须是同一个函数，否则无效。

**（4）简评**

上面三种方法之中，第一种违反了HTML与JavaScript代码相分离的原则，不建议使用；第二种的缺点是，同一个事件只能定义一个回调函数，也就是说，如果定义两次onclick属性，后一次定义会覆盖前一次；第三种是推荐使用的方法，不仅可以多个回调函数，而且可以统一接口。

## 事件的传播

### 传播的三个阶段

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

事件传播的最上层对象是window，接着依次是document，html（document.documentElement）和body（document.dody）。也就是说，如果body元素中有一个div元素，点击该元素。事件的传播顺序，在捕获阶段依次为window、document、html、body、div，在冒泡阶段依次为div、body、html、document、window。

### 事件的代理

由于事件会在冒泡阶段向上传播到父元素，因此可以把子元素的回调函数定义在父元素上，由父元素的回调函数统一处理多个子元素的事件。这种方法叫做事件的代理（delegation）。

{% highlight javascript %}

var ul = document.querySelector('ul');

ul.addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'li') {
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

**（1）load事件，error事件**

浏览网页就是一个加载各种资源的过程，比如图像（image）、样式表（style sheet）、脚本（script）、视频（video）、音频（audio）、Ajax请求（XMLHttpRequest）等等。

如果加载成功就触发load事件，如果加载失败就触发error事件。这两个事件发生的对象，除了上面列出的各种资源，还包括文档（document）、窗口（window）、Ajax文件上传（XMLHttpRequestUpload）。

{% highlight javascript %}

image.addEventListener('load', function(event) {
  image.classList.add('finished');
});

image.addEventListener('error', function(event) {
  image.style.display = 'none';
});

{% endhighlight %}

上面代码在图片元素加载完成后，为图片元素的class属性添加一个值“finished”。如果加载失败，就把图片元素的样式设置为不显示。

有时候，图片加载会在脚本运行之前就完成，尤其是当脚本放置在网页底部的时候，因此有可能使得load和error事件的回调函数根本不会被执行。所以，比较可靠的方式，是用complete属性先判断一下是否加载完成。

{% highlight javascript %}

function loaded() {
  // code after image loaded
}

if (image.complete) {
  loaded();
} else {
  image.addEventListener('load', loaded);
}

{% endhighlight %}

由于DOM没有机制判断是否发生加载错误，所以上面的方法不适用error事件的回调函数，它最好放在img元素的HTML属性中。

{% highlight javascript %}

<img src="/wrong/url" onerror="this.style.display='none';" />

{% endhighlight %}

error事件有一个特殊的性质，就是不会冒泡。这样的设计是正确的，防止引发父元素的error事件回调函数。

**（2）unload事件**

该事件在卸载某个资源时触发。window、body、frameset等元素都可能触发该事件。

如果在window对象上定义了该事件，网页就不会被浏览器缓存。

**（3）beforeunload事件**

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

如果定义了该事件的回调函数，网页不会被浏览器缓存。

**（4）resize事件**

改变浏览器窗口大小时会触发resize事件。能够触发它的元素包括window、body、frameset。

{% highlight javascript %}

var resizeMethod = function(){
    if (document.body.clientWidth < 768) {
        console.log('移动设备');
    }
};

window.addEventListener("resize", resizeMethod, true);

{% endhighlight %}

**（5）abort事件**

资源在加载成功前停止加载时触发该事件，主要发生在element、XMLHttpRequest、XMLHttpRequestUpload对象。

**（6）scroll事件**

用户滚动窗口或某个元素时触发该事件，主要发生在element、document、window对象。

**（7）contextmenu事件**

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

### 表单事件

（1）change事件

一些特定的表单元素（比如文本框和输入框）失去焦点、并且值发生变化时触发。

（2）reset事件

表单重置（reset）时触发。

（3）submit事件

表单提交（submit）时触发。

（4）select事件

用户在文本框或输入框中选中文本时触发。

### 鼠标事件

**（1）click事件**

用户在网页元素（element、document、window对象）上，单击鼠标（或者按下回车键）时触发click事件。

“鼠标单击”定义为在同一个位置完成一次mousedown动作和mouseup动作。它们的触发顺序是：mousedown首先触发，mouseup接着触发，click最后触发。

下面的代码是利用click事件进行CSRF攻击（Cross-site request forgery）的一个例子。

{% highlight html %}

<a href="http://www.harmless.com/" onclick="
  var f = document.createElement('form');
  f.style.display = 'none';
  this.parentNode.appendChild(f);
  f.method = 'POST';
  f.action = 'http://www.example.com/account/destroy';
  f.submit();
  return false;">伪装的链接</a>

{% endhighlight %}

**（2）dblclick事件**

用户在element、document、window对象上用鼠标双击时触发。该事件会在mousedown、mouseup、click之后触发。

（3）mousedown事件

用户按下鼠标按钮时触发。

（4）mouseup事件

用户放开鼠标按钮时触发。

（5）mouseenter事件

鼠标进入某个HTML元素或它的子元素时触发。该事件与mouseover事件相似，区别在于mouseenter事件不会冒泡，而且当鼠标移出子元素的边界、当仍在父元素之中时，它不会在父元素上触发。

（6）mouseleave事件

鼠标移出某个HTML元素以及它的所有子元素时触发。该事件与mouseout事件类似，区别在于mouseleave事件不会冒泡，而且要等到鼠标离开该元素本身和它的所有子元素时才触发。

（7）mousemove事件

鼠标在某个元素上方移动时触发。当鼠标持续移动时，该事件会连续触发。为了避免性能问题，建议对该事件的回调函数做一些限定，比如限定一段时间内只能运行一次代码。

（8）mouseout事件

鼠标移出某个HTML元素时触发。它与mouseleave事件类似，区别在于mouseout事件会冒泡，而且它会在从该元素移入某个子元素时触发。

```javascript

someEl.addEventListener('mouseout', function() {
    // mouse was hovering over this element, but no longer is
});

```

（9）mouseover事件

鼠标在某个元素上方时触发，即悬停时触发。

```javascript

someEl.addEventListener('mouseover', function() {
    // mouse is hovering over this element
});

```

（10）wheel事件

用户滚动鼠标的滚轮时触发。

### 键盘事件

（1）keydown事件

用户按下某个键时触发，此时用户还没放开这个键。它的触发时间早于系统输入法接收到用户的动作。键盘上的任何键都可以触发该事件。

（2）keypress事件

用户按下能够字符键时触发。如果用户一直按着，这个事件就持续触发。

```javascript

someElement.addEventListener('keypress', function(event) {
    // ...
});

```

（3）keyup事件

用户松开某个键时触发。它总是发生在相应的keydown和keypress事件之后。

```javascript

someElement.addEventListener('keyup', function(event) {
    // ...
});

```

下面是捕捉用户按下Ctrl+H键的代码。

```javascript

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.which === 72) {
    // open help widget
  }
});

```

### 触摸事件

（1）touchstart事件

用户开始触摸时触发。

（2）touchend事件

用户结束触摸时触发。

（3）touchmove事件

用户在触摸设备表面移动时触发。

（4）touchenter事件

触摸点进入设定在DOM上的互动区域时触发。

（5）toucheleave事件

触摸点离开设定在DOM上的互动区域时触发。

（6）touchcancel事件

触摸因为某些原因被中断时触发。

### window、body、frame对象的特有事件

**（1）beforeprint，afterprint**

beforeprint事件在文档打印或打印预览前触发，afterprint事件在之后触发。

**（2）beforeunload**

文档关闭前触发。

**（3）hashchange**

URL的hash部分发生变化时触发。

**（4）messsage**

message事件在一个worker子线程通过postMessage方法发来消息时触发，详见《Web Worker》一节。

**（5）offline，online**

offline事件在浏览器离线时触发，online事件在浏览器重新连线时触发。

**（6）pageshow，pagehide**

默认情况下，浏览器会在当前会话（session）缓存页面，当用户点击“前进/后退”按钮时，浏览器就会缓存中加载页面。pageshow事件在每次网页从缓存加载时触发，这种情况下load事件不会触发，因为网页在缓存中的样子通常是load事件的回调函数运行后的样子，所以不必重复执行。同理，如果是从缓存中加载页面，网页内初始化的JavaScript脚本也不会执行。

如果网页是第一次加载（即不在缓存中），那么首先会触发load事件，然后再触发pageshow事件。也就是说，pageshow事件是每次网页加载都会运行的。pageshow事件的event对象有一个persisted属性，返回一个布尔值。如果是第一次加载，这个值为false；如果是从缓存中加载，这个值为true。

{% highlight html %}

<body onload="onLoad();" onpageshow="if (event.persisted) onPageShow();"> 

{% endhighlight %}

上面代码表示，通过判断persisted属性，做到网页第一次加载时，不运行onPageShow函数，其后如果是从缓存中加载，就运行onPageShow函数。

pagehide事件与pageshow事件类似，当用户通过“前进/后退”按钮，离开当前页面时触发。它与unload事件的区别在于，使用unload事件之后，页面不会保存在缓存中，而使用pagehide事件，页面会保存在缓存中。pagehide事件的event对象有一个persisted属性，将这个属性设为true，就表示页面要保存在缓存中；设为false，表示网页不保存在缓存中，这时如果设置了unload事件的回调函数，该函数将在pagehide事件后立即运行。

### document对象的特有事件

（1）readystatechange

readystatechange事件在readyState属性发生变化时触发。它的发生对象是document和XMLHttpRequest对象。

（2）DOMContentLoaded

DOMContentLoaded事件在网页解析完成时触发，此时各种外部资源（resource）还没有被完全下载。也就是说，这个事件比load事件，发生时间早得多。

注意，DOMContentLoaded事件的回调函数，应该部署在所有连接外部样式表的link元素前面。因为，抓取外部样式表的时候，页面是阻塞的，所有脚本都不会执行。如果DOMContentLoaded事件的回调函数，放在外部样式表的后面定义，就会造成所有外部样式表加载完毕之后，回调函数才执行。

### 拖拉事件

（1）drag

drag事件在源对象被拖拉过程中触发。

（2）dragstart，dragend

dragstart事件在用户开始用鼠标拖拉某个对象时触发，dragend事件在结束拖拉时触发。

（3）dragenter，dragleave

dragenter事件在源对象拖拉进目标对象后，在目标对象上触发。dragleave事件在源对象离开目标对象后，在目标对象上触发。

（4）dragover事件

dragover事件在源对象拖拉过另一个对象上方时，在后者上触发。

（5）drop事件

当源对象被拖拉到目标对象上方，用户松开鼠标时，在目标对象上触发drop事件。

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

**（2）animationstart事件，animationend事件，animationiteration事件**

animation动画开始时，触发animationstart事件；结束时，触发animationend事件。

{% highlight javascript %}

var anim = document.getElementById("anim");
anim.addEventListener("animationstart", AnimationListener, false);

{% endhighlight %}

当CSS动画开始新一轮循环时，就会触发animationiteration事件。也就是说，除了CSS动画的第一轮播放，其他每轮的开始时，都会触发该事件。

{% highlight javascript %}

div.addEventListener('animationiteration', function() {
  console.log('完成一次动画');
});

{% endhighlight %}

这三个事件，除了Firefox浏览器不需要前缀，Chrome、Opera和IE都需要浏览器前缀，且大小写不一致。

- animationstart：写为animationstart、webkitAnimationStart、oanimationstart和MSAnimationStart。
- animationiteration：写为animationiteration、webkitAnimationIteration、oanimationiteration和MSAnimationIteration。
- animationend：写为animationend、webkitAnimationEnd、oanimationend和MSAnimationEnd。

下面是一个解决浏览器前缀的函数。

{% highlight javascript %}

var pfx = ["webkit", "moz", "MS", "o", ""];

function PrefixedEvent(element, type, callback) {
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.addEventListener(pfx[p]+type, callback, false);
	}
}

// 用法

PrefixedEvent(anim, "AnimationStart", AnimationListener);
PrefixedEvent(anim, "AnimationIteration", AnimationListener);
PrefixedEvent(anim, "AnimationEnd", AnimationListener);

{% endhighlight %}

这三个事件的回调函数，接受一个事件对象作为参数。该事件对象除了标准属性以外，还有两个与动画相关的属性。

- animationName：动画的名称。
- elapsedTime：从动画开始播放，到事件发生时所持续的秒数。

## event对象

当事件发生以后，会生成一个事件对象event，在DOM中传递，也被作为参数传给回调函数。但是，IE8及以下版本，这个事件对应是不作为参数传递的，而是通过window对象的event属性读取，所以要获取这个对象，往往写成下面这样。

```javascript

function myEventHandler(event) {
    var actualEvent = event || window.event;

    // handle actualEvent
}

```

除外，IE8及以下版本，事件对象的target属性叫做srcElement属性。

```javascript

function myEventHandler(event) {
  var actualEvent = event || window.event;
  var actualTarget = actualEvent.target || actualEvent.srcElement;

  // handle actualEvent & actualTarget
}

```

老式的IE浏览器还有其他一些不兼容之处。如果不需要支持IE8，代码可以简单很多。

### event对象的属性

- type：返回一个字符串，表示事件的名称。
- target：返回一个Element节点，表示事件起源的那个节点。
- currentTarget：返回一个Element节点，表示触发回调函数的那个节点。通常，事件回调函数中的this关键字的指向，与currentTarget是一致的。
- bubbles：返回一个布尔值，表示事件触发时，是否处在“冒泡”阶段。
- cancelable：返回一个布尔值，表示该事件的默认行为是否可以被preventDefault方法阻止。
- defaultPrevented：返回一个布尔值，表示是否已经调用过preventDefault方法。
- isTrusted：返回一个布尔值，表示事件是否可信任，即事件是从设备上触发，还是JavaScript方法模拟的。
- eventPhase：返回一个数字，表示事件目前所处的阶段，0为事件开始从DOM表层向目标元素传播，1为捕获阶段，2为事件到达目标元素，3为冒泡阶段。
- timestamp：返回一个数字，
- keyCode：返回按键对应的ASCII码。
- ctrlKey：返回一个布尔值，表示是否按下ctrl键。
- button：返回一个整数，表示用户按下了鼠标的哪个键。

除了上面这些属性，特定事件还会有一些独特的属性。比如，click事件的event对象就有clientX和clientY属性，表示事件发生的位置相对于视口左上角的水平坐标和垂直坐标。

### click事件

当用户点击以后，event对象会包含以下属性。

- pageX，pageY：点击位置相对于html元素的坐标，单位为CSS像素。
- clientX，clientY：点击位置相对于视口（viewport）的坐标，单位为CSS像素。
- screenX，screenY：点击位置相对于设备显示屏幕的坐标，单位为设备硬件的像素。

一般来说，为了确定点击位置，大部分时候应该使用pageX/Y属性，只有小部分时候，才考虑使用clientX/Y属性，而screenX/Y属性很少使用。

### event对象的方法

**（1）preventDefault方法**

该方法阻止事件所对应的浏览器默认行为。比如点击a元素后，浏览器跳转到指定页面，或者按一下空格键，页面向下滚动一段距离。

{% highlight javascript %}

anchor.addEventListener('click', function(event) {
  event.preventDefault();
  // some code
});

{% endhighlight %}

如果事件回调函数最后返回布尔值false，即使用return false语言，则浏览器也不会触发默认行为，与preventDefault有等同效果。

**（2）stopPropagation方法**

该方法阻止事件在DOM中继续传播，防止再触发定义在别的节点上的回调函数，但是不包括在当前节点上新定义的事件回调函数。

```javascript

someEl.addEventListener('some-event', function(event) {
    event.stopPropagation();
});

```

**（3）stopImmediatePropagation方法**

该方法的作用与stopPropagation方法相同，唯一的区别是还阻止当前节点上后继定义的事件回调函数。

```javascript

someEl.addEventListener('some-event', function(event) {
    event.stopImmediatePropagation();
});

```

## 自定义事件

除了浏览器预定义的那些事件，用户还可以自定义事件，然后手动触发。下面是jQuery触发自定义事件的写法，相当简单。

```javascript

$('some-element').trigger('my-custom-event');

```

上面代码触发了自定义事件，该事件会层层向上冒泡。在冒泡过程中，如果有一个元素定义了该事件的回调函数，该回调函数就会触发。

使用浏览器原生方法创造自定义事件，也很简单。

```javascript

var event = document.createEvent('Event');
event.initEvent('my-custom-event', true, true, {foo:'bar'});
someElement.dispatchEvent(event);

```

document.createEvent方法除了自定义事件以外，还能触发浏览器的默认事件。比如，模仿并触发click事件的写法如下。

{% highlight javascript %}

var simulateDivClick = document.createEvent('MouseEvents');

// initMouseEvent(type,bubbles,cancelable,view,detail,screenx,screeny,clientx,clienty,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget)
simulateDivClick.initMouseEvent('click',true,true,document.defaultView,0,0,0,0,0,false,false,false,0,null,null);

divElement.dispatchEvent(simulateDivClick);

{% endhighlight %}

但是，document.createEvent方法不是标准，只是浏览器还继续支持。目前的标准方法，是使用CustomEvent构造函数，自定义事件对象。除了IE以外的其他浏览器，都支持这种方法。

{% highlight javascript %}

var myEvent = new CustomEvent("myevent", {
  detail: {
    foo: "bar"
  },
  bubbles: true,
  cancelable: false
});

{% endhighlight %}

构造函数CustomEvent接受两个参数，第一个是事件名称，第二个是事件的属性对象。上面的写法与第一种写法是等价的。

定义事件对象以后，就可以用addEventListener方法为该事件指定回调函数，用dispatchEvent方法触发该事件。

{% highlight javascript %}

element.addEventListener('myevent', function(event) {
  console.log('Hello ' + event.detail.name);
});

element.dispatchEvent(myEvent);

{% endhighlight %}

## 参考链接

- Wilson Page, [An Introduction To DOM Events](http://coding.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/)
- Mozilla Developer Network, [Using Firefox 1.5 caching](https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching)
- Craig Buckler, [How to Capture CSS3 Animation Events in JavaScript](http://www.sitepoint.com/css3-animation-javascript-event-handlers/)
- Ray Nicholus, [You Don't Need jQuery!: Events](http://blog.garstasio.com/you-dont-need-jquery/events/)
