---
title: 拖放操作
layout: page
category: dom
date: 2013-09-09
modifiedOn: 2013-09-17
---

## 拖放操作

### 网页元素的draggable属性

如果网页元素的draggable属性为true，这个元素就是可以拖动的。

{% highlight html %}

<div draggable="true">Draggable Div</div>

{% endhighlight %}

在大多数浏览器中，a元素和img元素默认就是可以拖放的，但是为了保险起见，最好还是加上draggable属性。

### 事件

拖动过程会触发很多事件，主要有下面这些：

- **dragstart**：网页元素开始拖动时触发。
- **drag**：被拖动的元素在拖动过程中持续触发。
- **dragenter**：被拖动的元素进入目标元素时触发，应在目标元素监听该事件。
- **dragleave**：被拖动的元素离开目标元素时触发，应在目标元素监听该事件。
- **dragover**：被拖动元素停留在目标元素之中时持续触发，应在目标元素监听该事件。
- **drop**：被拖动元素或从文件系统选中的文件，拖放落下时触发。
- **dragend**：网页元素拖动结束时触发。

以上这些事件都可以指定回调函数。下面就是一个回调函数的例子。

{% highlight javascript %}

draggableElement.addEventListener('dragstart', function(e) {
  console.log('拖动开始！');
});

{% endhighlight %}

上面代码在网页元素被拖动时，在控制台显示“拖动开始！”。

> 需要注意的是，拖放过程中，鼠标移动事件（mousemove）不会触发。

### dataTransfer对象

拖动过程中，回调函数接受的事件参数，有一个dataTransfer属性。它指向一个对象，包含了与拖动相关的各种信息。

{% highlight javascript %}

draggableElement.addEventListener('dragstart', function(event) {
  event.dataTransfer.setData('text', 'Hello World!');
});

{% endhighlight %}

上面代码在拖动开始时，在dataTransfer对象上储存一条文本信息，内容为“Hello World”。当拖放结束时，可以用getData方法取出这条信息。

dataTransfer对象的属性：

- **dropEffect**： 拖放的操作类型，决定了浏览器如何显示鼠标形状，可能的值为 copy、move、link 和 none。

- **effectAllowed**：指定所允许的操作，可能的值为 copy、move、link、copyLink、copyMove、linkMove、all、none 和 uninitialized（默认值，等同于all，即允许一切操作）。

- **files**：包含一个FileList对象，表示拖放所涉及的文件，主要用于处理从文件系统拖入浏览器的文件。

- **types**：储存在DataTransfer对象的数据的类型。

dataTransfer对象的方法：

- **setData(format, data)**：在dataTransfer对象上储存数据。第一个参数format用来指定储存的数据类型，比如text、url、text/html等。

- **getData(format)**：从dataTransfer对象取出数据。

- **clearData(format)**：清除dataTransfer对象所储存的数据。如果指定了format参数，则只清除该格式的数据，否则清除所有数据。

- **setDragImage(imgElement, x, y)**：指定拖动过程中显示的图像。默认情况下，许多浏览器显示一个被拖动元素的半透明版本。参数imgElement必须是一个图像元素，而不是指向图像的路径，参数x和y表示图像相对于鼠标的位置。

dataTransfer对象允许在其上储存数据，这使得在被拖动元素与目标元素之间传送信息成为可能。

### 实例：拖动网页元素

首先，获取网页元素。

{% highlight javascript %}

var target = document.querySelector('#drop-target');
var dragElements = document.querySelectorAll('#drag-elements li');

// 追踪被拖动元素的变量
var elementDragged = null;

{% endhighlight %}

上面代码在获取目标元素和可能的被拖动元素以后，新建了一个变量elementDragged，用来存放实际拖动的元素。

然后，对可能的被拖动元素绑定dragstart事件和dragend事件。

{% highlight javascript %}

for (var i = 0; i < dragElements.length; i++) {

  dragElements[i].addEventListener('dragstart', function(e) {
    e.dataTransfer.setData('text', this.innerHTML);
    elementDragged = this;
  });

  dragElements[i].addEventListener('dragend', function(e) {
    elementDragged = null;
  });

};

{% endhighlight %}

接着，绑定目标元素的dragover事件，主要是为了当被拖动元素进入目标元素后，改变鼠标形状。

{% highlight javascript %}

target.addEventListener('dragover', function(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
});

{% endhighlight %}

最后，定义目标元素的drop事件，处理被拖动元素（从原来的位置删除）。

{% highlight javascript %}

target.addEventListener('drop', function(e) {
  e.preventDefault(); 
  e.stopPropagation();

  this.innerHTML = "Dropped " + e.dataTransfer.getData('text');

  document.querySelector('#drag-elements').removeChild(elementDragged);

  return false;
});

{% endhighlight %}

### 实例：拖放文件

假定我们要从文件系统拖动一个txt文本，在浏览器中展示内容。

首先，获取拖动的目标元素和内容展示区。

{% highlight javascript %}

var target = document.querySelector('#target');
var contentDiv = document.querySelector('#content');

{% endhighlight %}

然后，定义目标元素的dragover事件，主要是为了当文件进入目标元素后，改变鼠标形状。

{% highlight javascript %}

target.addEventListener('dragover', function(e) {
	e.preventDefault(); 
	e.stopPropagation();
	e.dataTransfer.dropEffect = 'copy';
});

{% endhighlight %}

接着，定义目标元素的drop事件，展示文件内容。

{% highlight javascript %}

target.addEventListener('drop', function(e) {

	e.preventDefault(); 
	e.stopPropagation();

	var fileList = e.dataTransfer.files;

	if (fileList.length > 0) {
		var file = fileList[0];
		var reader = new FileReader();
		reader.onloadend = function(e) {
			if (e.target.readyState == FileReader.DONE) {
				var content = reader.result;
				contentDiv.innerHTML = "File: " + file.name + "\n\n" + content;
			}
		}

		reader.readAsBinaryString(file);
	}
});

{% endhighlight %}

## 自定义网页元素（Custom Element）

除了HTML语言预定义的网页元素，通过JavaScript还可以自定义网页元素。举例来说，你可以自定义一个叫做super-button的网页元素。

{% highlight html %}

<super-button></super-button>

{% endhighlight %}

注意，自定义网页元素的名称中必须含有连字符（-）。这是因为标准预定义的HTML元素名称，都不含有连字符，自定义网页元素加入连字符，可以有效显示区别。

在使用自定义元素前，必须用document对象的registerElement方法登记该元素，registerElement方法返回一个这个自定义元素的构造函数。

{% highlight javascript %}

var SuperButton = document.registerElement('super-button');

document.body.appendChild(new SuperButton());

{% endhighlight %}

上面代码生成自定义网页元素的构造函数，然后通过构造函数生成一个实例，将其插入网页。

registerElement方法接受第二个参数，用来指定自定义网页元素的原型对象，默认就是HTMLElement对象的原型，即写成下面这样。

{% highlight javascript %}

var SuperButton = document.registerElement('super-button', {
  prototype: Object.create(HTMLElement.prototype)
});

{% endhighlight %}

但是，如果写成上面这样，自定义网页元素就跟普通元素没有太大区别。自定义元素的真正优势在于，可以自定义它的API。

{% highlight javascript %}

var buttonProto = Object.create(HTMLElement.prototype);

buttonProto.print = function() {
	console.log('Super Button!');
}

var SuperButton = document.registerElement('super-button', {
  prototype: buttonProto
});

var supperButton = document.querySelector('super-button');

supperButton.print();

{% endhighlight %}

上面代码在网页元素的原型对象上定义了一个print方法，然后将其指定为super-button元素的原型。因此，所有supper-button元素的实例因此都可以调用print这个方法。

registerElement方法的第二个参数，还可以延伸现有元素。

{% highlight javascript %}

var SuperButton = document.registerElement('super-button', {
  prototype: buttonProto,
  extends: 'button'
});

{% endhighlight %}

上面代码指定super-button元素延伸button元素。因此，button元素就可以通过is属性，继承super-button元素的API。

{% highlight html %}

<button is="supper-button"></button>

{% endhighlight %}

上面代码指定button元素为supper-button元素的实例。

自定义元素有一系列事件，可供指定回调函数。

- createdCallback：元素实例生成
- attachedCallback：元素实例加入DOM结构
- detachedCallback：元素实例被剥离出DOM结构
- attributeChangedCallback：元素实例的属性发生改变 

下面是一个指定回调函数的例子。

{% highlight javascript %}

supperButton.createdCallback = function () {…};

{% endhighlight %}

自定义元素（custom element）是一个非常新的API，目前只有Firefox和Chrome浏览器的最新版本支持。

## 参考链接

- Matt West, [Implementing Native Drag and Drop](http://blog.teamtreehouse.com/implementing-native-drag-and-drop)
- Peter Gasston, [A Detailed Introduction To Custom Elements](http://coding.smashingmagazine.com/2014/03/04/introduction-to-custom-elements/)
