---
title: Event对象
layout: page
category: dom
date: 2013-11-15
modifiedOn: 2013-12-19
---

事件是一种异步编程的实现方式，本质上是程序各个组成部分之间传递的特定消息。DOM支持大量的事件，本节介绍DOM的事件编程。

## EventTarget接口

DOM节点关于事件的方法（监听和触发），都定义在EventTarget接口。Element节点、document节点和window对象，都部署了这个接口。此外，XMLHttpRequest、AudioNode、AudioContext等浏览器内置对象，也部署了这个接口。

### addEventListener()

addEventListener方法用于在当前节点或对象上，定义一个特定事件的监听函数。

```javascript
target.addEventListener(type, listener[, useCapture]);
```

addEventListener方法接受三个参数。

- type，事件名称，大小写不敏感。
- listener，监听函数。指定事件发生时，会调用该监听函数。
- useCapture，回调函数是否在捕获阶段（capture）触发。该参数是一个布尔值，默认为false（表示回调函数只在冒泡阶段被触发）。在较新版本的浏览器中，该参数是可选的，为了保持兼容，建议总是写上该参数。

下面是一个例子。

```javascript
function hello(){
  console.log('Hello world');
}

var button = document.getElementById("btn");
button.addEventListener('click', hello, false);
```

可以使用addEventListener方法，为当前对象的同一个事件，添加多个监听函数。这些函数按照添加顺序触发，即先添加先触发。如果为同一个事件多次添加同一个监听函数，该函数只会执行一次，多余的添加将自动被去除（不必使用removeEventListener方法手动去除）。

```javascript
function hello(){
  console.log('Hello world');
}

document.addEventListener('click', hello, false);
document.addEventListener('click', hello, false);
```

执行上面代码，点击文档只会输出一行“Hello world”。

如果希望向监听函数传递参数，可以用匿名函数包装一下监听函数。

```javascript
function print(x) {
  console.log(x);
}

var el = document.getElementById("div1");
el.addEventListener("click", function(){print('Hello')}, false);
```

上面代码通过匿名函数，向监听函数print传递了一个参数。

### removeEventListener()

removeEventListener方法用来移除addEventListener方法添加的事件监听函数。

```javascript
div.addEventListener('click', listener, false);
div.removeEventListener('click', listener, false);
```

removeEventListener方法的参数，与addEventListener方法完全一致。它对第一个参数“事件类型”，也是大小写不敏感。

注意，removeEventListener方法移除的监听函数，必须与对应的addEventListener方法的参数完全一致，而且在同一个元素节点，否则无效。

### dispatchEvent()

dispatchEvent方法在当前节点上触发指定事件，从而触发监听函数的执行。该方法返回一个布尔值，只要有一个监听函数调用了`Event.preventDefault()`，则返回值为false，否则为true。

```javascript
target.dispatchEvent(event)
```

dispatchEvent方法的参数是一个Event对象的实例。

```javascript
para.addEventListener('click', hello, false);
var event = new Event('click');
para.dispatchEvent(event);
```

上面代码在当前节点触发了click事件。

如果dispatchEvent方法的参数为空，或者不是一个有效的事件对象，将报错。

下面代码根据dispatchEvent方法的返回值，判断事件是否被取消了。

```javascript
var canceled = !cb.dispatchEvent(event);
  if (canceled) {
    console.log('事件取消');
  } else {
    console.log('事件未取消');
  }
}
```

## 监听函数

监听函数是事件发生时，程序所要执行的函数。它是事件驱动编程模式的主要编程方式。

DOM允许指定各种事件的回调函数，使用的方法有三种。

### HTML标签的on-属性

HTML语言允许在元素标签的属性中，直接定义某些事件的监听代码。

{% highlight html %}

<body onload="doSomething()">

<div onclick="console.log('触发事件')">

{% endhighlight %}

上面代码为body节点的load事件、div节点的click事件，指定了回调函数。

使用这个方法指定的监听函数，只会在冒泡阶段触发。

注意，使用这种方法时，on-属性的值是“监听代码”，而不是“监听函数”。也就是说，一旦指定事件发生，这些代码是原样传入JavaScript引擎执行。因此如果要执行函数，必须在函数名后面加上一对圆括号。

另外，Element节点的setAttribue方法，其实设置的也是这种效果。

```javascript
el.setAttribute('onclick', 'doSomething()');
```

### Element节点的事件属性

Element节点有事件属性，可以定义回调函数。

{% highlight javascript %}

window.onload = doSomething;

div.onclick = function(event){
  console.log('触发事件');
};

{% endhighlight %}

使用这个方法指定的监听函数，只会在冒泡阶段触发。

### addEventListener方法

通过Element节点、document节点、window对象的addEventListener方法，也可以定义事件的回调函数。

{% highlight javascript %}

window.addEventListener('load', doSomething, false);

{% endhighlight %}

addEventListener方法的详细介绍，参见本节EventTarget接口的部分。

在上面三种方法中，第一种“HTML标签的on-属性”，违反了HTML与JavaScript代码相分离的原则；第二种“Element节点的事件属性”的缺点是，同一个事件只能定义一个回调函数，也就是说，如果定义两次onclick属性，后一次定义会覆盖前一次。因此，这两种方法都不推荐使用，除非是为了程序的兼容问题，因为所有浏览器都支持这两种方法。

addEventListener是推荐的指定监听函数的方法。它有如下优点：

- 可以针对同一个事件，添加多个监听函数。

- 能够指定在哪个阶段（捕获阶段还是冒泡阶段）触发回监听函数。

- 除了DOM节点，还可以部署在window、XMLHttpRequest等对象上面，等于统一了整个JavaScript的监听函数接口。

### this对象的指向

实际编程中，监听函数内部的this对象，常常需要指向触发事件的那个Element节点。

addEventListener方法指定的监听函数，内部的this对象总是指向触发事件的那个节点。

```javascript
// HTML代码为
// <p id="para">Hello</p>

var id = 'doc';
var para = document.getElementById('para');

function hello(){
  console.log(this.id);
}

para.addEventListener('click', hello, false);
```

执行上面代码，点击p节点会输出para。这是因为监听函数被“拷贝”成了节点的一个属性，使用下面的写法，会看得更清楚。

```javascript
para.onclick = hello;
```

如果将监听函数部署在Element节点的on-属性上面，this不会指向触发事件的元素节点。

```html
<p id="para" onclick="hello()">Hello</p>
// 或者使用JavaScript代码
pElement.setAttribute('onclick', 'hello()');
```

执行上面代码，点击p节点会输出doc。这是因为这里只是调用hello函数，而hello函数实际是在全局作用域执行，相当于下面的代码。

```javascript
para.onclick = function(){
  hello();
}
```

一种解决方法是，不引入函数作用域，直接在on-属性写入所要执行的代码。因为on-属性是在当前节点上执行的。

```html
<p id="para" onclick="console.log(id)">Hello</p>
<!-- 或者 -->
<p id="para" onclick="console.log(this.id)">Hello</p>
```

上面两行，最后输出的都是para。

总结一下，以下写法的this对象都指向Element节点。

```javascript
// JavaScript代码
element.onclick = print
element.addEventListener('click', print, false)
element.onclick = function () {console.log(this.id);}

// HTML代码
<element onclick="console.log(this.id)">
```

以下写法的this对象，都指向全局对象。

```javascript
// JavaScript代码
element.onclick = function (){ doSomething() };
element.setAttribute('onclick', 'doSomething()');

// HTML代码
<element onclick="doSomething()">
```

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

## Event对象

事件发生以后，会生成一个事件对象，在DOM中传递，作为参数传给回调函数。浏览器原生提供一个Event对象，所有的事件对象都是这个对象的实例，或者说继承了`Event.prototype`对象。Event本身就是一个构造函数，可以用来生成新的事件。

```javascript
event = new Event(typeArg, eventInit);
```

Event构造函数接受两个参数。第一个参数是字符串，表示事件的名称；第二个参数是一个对象，表示事件对象的配置。该参数可以有以下两个属性。

- bubbles：布尔值，可选，默认为false，表示事件对象是否冒泡。

- cancelable：布尔值，可选，默认为false，表示事件是否可以被取消。

```javascript
var ev = new Event("look", {"bubbles":true, "cancelable":false});

document.dispatchEvent(ev);
```

上面代码新建一个look事件，然后使用dispatchEvent方法触发该事件。

IE8及以下版本，事件对象不作为参数传递，而是通过window对象的event属性读取，并且事件对象的target属性叫做srcElement属性。所以获取事件信息，往往写成下面这样。

```javascript
function myEventHandler(event) {
  var actualEvent = event || window.event;
  var actualTarget = actualEvent.target || actualEvent.srcElement;
  // ...
}
```

## Event实例的属性

### bubbles，eventPhase

以下属性与事件的阶段有关。

**（1）bubbles**

bubbles属性返回一个布尔值，表示当前事件是否会冒泡。该属性为只读属性，只能在新建事件时改变。除非显式声明，Event构造函数生成的事件，默认是不冒泡的。

```javascript
function goInput(e) {
  if (!e.bubbles) {
    passItOn(e);
  } else {
    doOutput(e);
  }
}
```

上面代码根据事件是否冒泡，调用不同的函数。

**（2）eventPhase**

eventPhase属性返回一个整数值，表示事件目前所处的节点。

```javascript
var phase = event.eventPhase;
```

- 0，事件目前没有发生。
- 1，事件目前处于捕获阶段，即处于从祖先节点向目标节点的传播过程中。该过程是从Window对象到Document节点，再到HTMLHtmlElement节点，直到目标节点的父节点为止。
- 2，事件到达目标节点，即target属性指向的那个节点。
- 3，事件处于冒泡阶段，即处于从目标节点向祖先节点的反向传播过程中。该过程是从父节点一直到Window对象。只有bubbles属性为true时，这个阶段才可能发生。

### cancelable，defaultPrevented

以下属性与事件的默认行为有关。

**（1）cancelable**

cancelable属性返回一个布尔值，表示事件是否可以取消。该属性为只读属性，只能在新建事件时改变。除非显式声明，Event构造函数生成的事件，默认是不可以取消的。

```javascript
var bool = event.cancelable;
```

如果要取消某个事件，需要在这个事件上面调用preventDefault方法，这会阻止浏览器对某种事件部署的默认行为。

**（2）defaultPrevented**

defaultPrevented属性返回一个布尔值，表示该事件是否调用过preventDefault方法。

```javascript
if (e.defaultPrevented) {
  // ...
}
```

### currentTarget，target

以下属性与事件的目标节点有关。

**（1）currentTarget**

currentTarget属性返回事件当前所在的节点，即正在执行的监听函数所绑定的那个节点。作为比较，target属性返回事件发生的节点。如果监听函数在捕获阶段和冒泡阶段触发，那么这两个属性返回的值是不一样的。

```javascript
function hide(e){
  console.log(this === e.currentTarget);  // true
  e.currentTarget.style.visibility = "hidden";
}

para.addEventListener('click', hide, false);
```

上面代码中，点击para节点，该节点会不可见。另外，在回调函数中，currentTarget属性实际上等同于this对象。

**（2）target**

target属性返回触发事件的那个节点，即事件最初发生的节点。如果监听函数不在该节点触发，那么它与currentTarget属性返回的值是不一样的。

```javascript
function hide(e){
  console.log(this === e.target);  // 有可能不是true
  e.target.style.visibility = "hidden";
}

// HTML代码为
// <p id="para">Hello <em>World</em></p>
para.addEventListener('click', hide, false);
```

上面代码中，如果在para节点的em子节点上面点击，则`e.target`指向em子节点，导致em子节点（即World部分）会不可见，且输出false。

在IE6—IE8之中，该属性的名字不是target，而是srcElement，因此经常可以看到下面这样的代码。

```javascript
function hide(e) {
  var target = e.target || e.srcElement;
  target.style.visibility = 'hidden';
}
```

### type，detail，timeStamp，isTrusted

以下属性与事件对象的其他信息相关。

**（1）type**

type属性返回一个字符串，表示事件类型，具体的值同addEventListener方法和removeEventListener方法的第一个参数一致，大小写不敏感。

```javascript
var string = event.type;
```

**（2）detail**

detail属性返回一个数值，表示事件的某种信息。具体含义与事件类型有关，对于鼠标事件，表示鼠标按键在某个位置按下的次数，比如对于dblclick事件，detail属性的值总是2。

```javascript
function giveDetails(e) {
  this.textContent = e.detail;
}

el.onclick = giveDetails;
```

**（3）timeStamp**

timeStamp属性返回一个毫秒时间戳，表示事件发生的时间。

```javascript
var number = event.timeStamp;
```

**（4）isTrusted**

isTrusted属性返回一个布尔值，表示该事件是否可以信任。

```javascript
var bool = event.isTrusted;
```

Firefox浏览器中，用户触发的事件会返回true，脚本触发的事件返回false；IE浏览器中，除了使用createEvent方法生成的事件，所有其他事件都返回true；Chrome浏览器不支持该属性。

## Event实例的方法

### preventDefault()

preventDefault方法取消浏览器对当前事件的默认行为，比如点击链接后，浏览器跳转到指定页面，或者按一下空格键，页面向下滚动一段距离。该方法生效的前提是，事件的cancelable属性为true，如果为false，则调用该方法没有任何效果。

该方法不会阻止事件的进一步传播（stopPropagation方法可用于这个目的）。只要在事件的传播过程中（捕获阶段、目标阶段、冒泡阶段皆可），使用了preventDefault方法，该事件的默认方法就不会执行。

```javascript
// HTML代码为
// <input type="checkbox" id="my-checkbox" />

var cb = document.getElementById('my-checkbox');

cb.addEventListener(
  'click',
  function (e){ e.preventDefault(); },
  false
);
```

上面代码为点击单选框的事件，设置回调函数，取消默认行为。由于浏览器的默认行为是选中单选框，所以这段代码会导致无法选中单选框。

利用这个方法，可以为文本输入框设置校验条件。如果用户的输入不符合条件，就无法将字符输入文本框。

```javascript
function checkName(e) {
  if (e.charCode < 97 || e.charCode > 122) {
    e.preventDefault();
  }
}
```

上面函数设为文本框的keypress监听函数后，将只能输入小写字母，否则输入事件的默认事件（写入文本框）将被取消。

如果监听函数最后返回布尔值false（即return false），浏览器也不会触发默认行为，与preventDefault方法有等同效果。

### stopPropagation()

stopPropagation方法阻止事件在DOM中继续传播，防止再触发定义在别的节点上的监听函数，但是不包括在当前节点上新定义的事件回调函数。

```javascript
function stopEvent(e) {
  e.stopPropagation();
}

el.addEventListener('click', stopEvent, false);
```

将上面函数指定为监听函数，会阻止事件进一步冒泡到el节点的父节点。

### stopImmediatePropagation()

stopImmediatePropagation方法阻止同一个事件的其他监听函数被调用。

如果同一个节点对于同一个事件指定了多个监听函数，这些函数会根据添加的顺序依次调用。只要其中有一个监听函数调用了stopImmediatePropagation方法，其他的监听函数就不会再执行了。

```javascript
function l1(e){
  e.stopImmediatePropagation();
}

function l2(e){
  console.log('hello world');
}

el.addEventListener('click', l1, false);
el.addEventListener('click', l2, false);
```

上面代码在el节点上，为click事件添加了两个监听函数l1和l2。由于l1调用了stopImmediatePropagation方法，所以l2不会被调用。

## UI事件（UIEvent对象）

UIEvent对象代表用户界面的事件。它继承了Event对象，所有UIEvent实例同时也是Event实例。

浏览器提供一个UIEvent构造函数，用于新建一个UIEvent实例。

```javascript
event = new UIEvent(typeArg, UIEventInit);
```

UIEvent构造函数接受两个参数，第一个是事件名称，第二个是事件的描述对象（可以设置bubbles、cancelable、detail、view等字段），该参数可省略。

UI事件由以下八类事件组成。

- 鼠标事件（MouseEvent对象）
- 滚轮事件（WheelEvent对象）
- 拖拉事件（DragEvent对象）
- 触摸事件（TouchEvent对象）
- 焦点事件（FocusEvent对象）
- 键盘事件（KeyboardEvent对象）
- 输入事件（InputEvent对象）
- 作文事件（CompositionEvent对象）

以下逐一详细介绍。

## 鼠标事件（MouseEvent对象）

鼠标事件指与鼠标相关的事件，主要有以下一些。

- click事件：在一个节点上，按下然后放开一个鼠标键时触发。
- dblclick事件：在一个节点上，双击鼠标时触发。
- mouseup事件：在一个节点上，释放按下的鼠标键时触发。
- mousedown事件：在一个节点上，按下鼠标键时触发。
- mousemove事件：鼠标在一个节点内部移动时触发。
- mouseover事件：鼠标进入一个节点或其子element节点时触发。
- mouseout事件：鼠标离开一个节点或其子element节点时触发。
- mouseenter事件：鼠标进入一个节点时触发，该事件与mouseover的最大区别是，该事件不会冒泡，所以进入子节点时，不会触发父节点的监听函数。
- mouseleave事件：鼠标离开一个节点时触发，该事件与mouseout事件的最大区别是，该事件不会冒泡，所以离开子节点时，不会触发父节点的监听函数。
- contextmenu事件：在一个节点上点击鼠标右键触发（上下文菜单显示前），或者按下“上下文菜单”键时触发。

下面是一个设置click事件监听函数的例子。

```javascript
div.addEventListener("click", function( event ) {
  // 显示在该节点，鼠标连续点击的次数
  event.target.innerHTML = "click count: " + event.detail;
}, false);
```

下面的例子是mouseenter事件与mouseover事件的区别。

```javascript
// HTML代码为
// <ul id="test">
//   <li>item 1</li>
//   <li>item 2</li>
//   <li>item 3</li>
// </ul>

var test = document.getElementById("test");

// 进入test节点以后，该事件只会触发一次
test.addEventListener("mouseenter", function( event ) {
  event.target.style.color = "purple";
  setTimeout(function() {
    event.target.style.color = "";
  }, 500);
}, false);

// 接入test节点以后，只要在子Element节点上移动，该事件会触发多次
test.addEventListener("mouseover", function( event ) {
  event.target.style.color = "orange";
  setTimeout(function() {
    event.target.style.color = "";
  }, 500);
}, false);
```

上面代码中，由于mouseover事件会冒泡，所以子节点的mouseover事件会触发父节点的监听函数。

鼠标事件使用MouseEvent对象表示，它继承UIEvent对象和Event对象。浏览器提供一个MouseEvent构造函数，用于新建一个MouseEvent实例。

```javascript
event = new MouseEvent(typeArg, mouseEventInit);
```

MouseEvent构造函数的第一个参数是事件名称（可能的值包括click、mousedown、mouseup、mouseover、mousemove、mouseout），第二个参数是一个事件初始化对象。该对象可以配置以下属性。

- screenX，设置鼠标相对于屏幕的水平坐标（但不会移动鼠标），默认为0，等同于Event.screenX属性。
- screenY，设置鼠标相对于屏幕的垂直坐标，默认为0，等同于Event.screenY属性。
- clientX，设置鼠标相对于窗口的水平坐标，默认为0，等同于Event.clientX属性。
- clientY，设置鼠标相对于窗口的垂直坐标，默认为0，等同于Event.clientY属性。
- ctrlKey，设置是否按下ctrl键，默认为false，等同于Event.ctrlKey属性。
- shiftKey，设置是否按下shift键，默认为false，等同于Event.shiftKey属性。
- altKey，设置是否按下alt键，默认为false，等同于Event.altKey属性。
- metaKey，设置是否按下meta键，默认为false，等同于Event.metaKey属性。
- button，设置按下了哪一个鼠标按键，默认为0。-1表示没有按键，0表示按下主键（通常是左键），1表示按下辅助键（通常是中间的键），2表示按下次要键（通常是右键）。
- buttons，设置按下了鼠标哪些键，是一个3个比特位的二进制值，默认为0。1表示按下主键（通常是左键），2表示按下次要键（通常是右键），4表示按下辅助键（通常是中间的键）。
- relatedTarget，设置一个Element节点，在mouseenter和mouseover事件时，表示鼠标刚刚离开的那个Element节点，在mouseout和mouseleave事件时，表示鼠标正在进入的那个Element节点。默认为null，等同于event.relatedTarget属性。

以下属性也是可配置的，都继承自UIEvent构造函数和Event构造函数。

- bubbles，布尔值，设置事件是否冒泡，默认为false，等同于Event.bubbles属性。
- cancelable，布尔值，设置事件是否可取消，默认为false，等同于Event.cancelable属性。
- view，设置事件的视图，一般是window或document.defaultView，等同于Event.view属性。
- detail，设置鼠标点击的次数，等同于Event.detail属性。

下面是一个例子。

```javascript
function simulateClick() {
  var event = new MouseEvent('click', {
    'bubbles': true,
    'cancelable': true
  });
  var cb = document.getElementById('checkbox');
  cb.dispatchEvent(event);
}
```

上面代码生成一个鼠标点击事件，并触发该事件。

## MouseEvent实例的属性

### altKey，ctrlKey，metaKey，shiftKey

以下属性返回一个布尔值，表示鼠标事件发生时，是否按下某个键。

- altKey属性：alt键
- ctrlKey属性：key键
- metaKey属性：Meta键（Mac键盘是一个四瓣的小花，Windows键盘是Windows键）
- shiftKey属性：Shift键

```javascript
// HTML代码为
// <body onclick="showkey(event);">

function showKey(e){
  console.log("ALT key pressed: " + e.altKey);
  console.log("CTRL key pressed: " + e.ctrlKey);
  console.log("META key pressed: " + e.metaKey);
  console.log("META key pressed: " + e.shiftKey);
}
```

上面代码中，点击网页会输出是否同时按下Alt键。

### button，buttons

以下属性返回事件的鼠标键信息。

**（1）button**

button属性返回一个数值，表示按下了鼠标哪个键。

- -1：没有按下键。
- 0：按下主键（通常是左键）。
- 1：按下辅助键（通常是中键或者滚轮键）。
- 2：按下次键（通常是右键）。

```javascript
// HTML代码为
// <button onmouseup="whichButton(event);">点击</button>

var whichButton = function (e) {
  switch (e.button) {
    case 0:
      console.log('Left button clicked.');
      break;
    case 1:
      console.log('Middle button clicked.');
      break;
    case 2:
      console.log('Right button clicked.');
      break;
    default:
      console.log('Unexpected code: ' + e.button);
  }
}
```

**（2）buttons**

buttons属性返回一个3个比特位的值，表示同时按下了哪些键。它用来处理同时按下多个鼠标键的情况。

- 1：二进制为001，表示按下左键。
- 2：二进制为010，表示按下右键。
- 4：二进制为100，表示按下中键或滚轮键。

同时按下多个键的时候，每个按下的键对应的比特位都会有值。比如，同时按下左键和右键，会返回3（二进制为011）。

### clientX，clientY，movementX，movementY，screenX

以下属性与事件的位置相关。

**（1）clientX，clientY**

clientX属性返回鼠标位置相对于浏览器窗口左上角的水平坐标，单位为像素，与页面是否横向滚动无关。

clientY属性返回鼠标位置相对于浏览器窗口左上角的垂直坐标，单位为像素，与页面是否纵向滚动无关。

```javascript
// HTML代码为
// <body onmousedown="showCoords(event)">

function showCoords(evt){
  console.log(
    "clientX value: " + evt.clientX + "\n" +
    "clientY value: " + evt.clientY + "\n"
  );
}
```

**（2）movementX，movementY**

movementX属性返回一个水平位移，单位为像素，表示当前位置与上一个mousemove事件之间的水平距离。在数值上，等于currentEvent.movementX = currentEvent.screenX - previousEvent.screenX。

movementY属性返回一个垂直位移，单位为像素，表示当前位置与上一个mousemove事件之间的垂直距离。在数值上，等于currentEvent.movementY = currentEvent.screenY - previousEvent.screenY。

**（3）screenX，screenY**

screenX属性返回鼠标位置相对于屏幕左上角的水平坐标，单位为像素。

screenY属性返回鼠标位置相对于屏幕左上角的垂直坐标，单位为像素。

```javascript
// HTML代码为
// <body onmousedown="showCoords(event)">

function showCoords(evt){
  console.log(
    "screenX value: " + evt.screenX + "\n"
    + "screenY value: " + evt.screenY + "\n"
  );
}
```

### relatedTarget

relatedTarget属性返回事件的次要相关节点。对于那些没有次要相关节点的事件，该属性返回null。

下表列出不同事件的target属性和relatedTarget属性含义。

|事件名称 |target属性 |relatedTarget属性 |
|---------|-----------|------------------|
|focusin |接受焦点的节点 |丧失焦点的节点 |
|focusout |丧失焦点的节点 |接受焦点的节点 |
|mouseenter |将要进入的节点 |将要离开的节点 |
|mouseleave |将要离开的节点 |将要进入的节点 |
|mouseout |将要离开的节点 |将要进入的节点 |
|mouseover |将要进入的节点 |将要离开的节点 |
|dragenter |将要进入的节点 |将要离开的节点 |
|dragexit |将要离开的节点 |将要进入的节点 |

下面是一个例子。

```javascript
// HTML代码为
// <div id="outer" style="height:50px;width:50px;border-width:1px solid black;">
//   <div id="inner" style="height:25px;width:25px;border:1px solid black;"></div>
// </div>

var inner = document.getElementById("inner");

inner.addEventListener("mouseover", function (){
  console.log('进入' + event.target.id + " 离开" + event.relatedTarget.id);
});
inner.addEventListener("mouseenter", function (){
  console.log('进入' + event.target.id + " 离开" + event.relatedTarget.id);
});
inner.addEventListener("mouseout", function (){
  console.log('离开' + event.target.id + " 进入" + event.relatedTarget.id);
});
inner.addEventListener("mouseleave", function (){
  console.log('离开' + event.target.id + " 进入" + event.relatedTarget.id);
});

// 鼠标从outer进入inner，输出
// 进入inner 离开outer
// 进入inner 离开outer

// 鼠标从inner进入outer，输出
// 离开inner 进入outer
// 离开inner 进入outer
```

## 触摸事件

触摸API由三个对象组成。

- Touch
- TouchList
- TouchEvent

TouchEvent对象代表由触摸引发的事件，只有触摸屏才会引发这一类事件。触摸动作由Touch对象来描述，每一个触摸动作都包括位置、大小、形状、压力、目标元素等属性。触摸动作的集合由TouchList对象表示。

很多发生触摸的时候，触摸事件和鼠标事件同时触发，即使这个时候并没有用到鼠标。这是为了让那些只定义鼠标事件、没有定义触摸事件的代码，在触摸屏的情况下仍然能用。如果想避免这种情况，可以用preventDefault方法阻止发出鼠标事件。

### Touch对象

Touch对象代表一个触摸点。触摸点可能是一根手指，也可能是一根触摸笔。它有以下属性。

**（1）identifier**

identifier属性表示Touch实例的独一无二的识别符。它在整个触摸过程中保持不变。

```javascript
var id = touchItem.identifier;
```

TouchList对象的identifiedTouch方法，可以根据这个属性，从一个集合里面取出对应的Touch对象。

**（2）screenX，screenY，clientX，clientY，pageX，pageY**

screenX属性和screenY属性，分别表示触摸点相对于屏幕左上角的横坐标和纵坐标，与页面是否滚动无关。

clientX属性和clientY属性，分别表示触摸点相对于浏览器视口左上角的横坐标和纵坐标，与页面是否滚动无关。

pageX属性和pageY属性，分别表示触摸点相对于当前页面左上角的横坐标和纵坐标，包含了页面滚动带来的位移。

**（3）radiusX，radiusY，rotationAngle**

radiusX属性和radiusY属性，分别返回触摸点周围受到影响的椭圆范围的X轴和Y轴，单位为像素。

rotationAngle属性表示触摸区域的椭圆的旋转角度，单位为度数，在0到90度之间。

上面这三个属性共同定义了用户与屏幕接触的区域，对于描述手指这一类非精确的触摸，很有帮助。指尖接触屏幕，触摸范围会形成一个椭圆，这三个属性就用来描述这个椭圆区域。

**（4）force**

force属性返回一个0到1之间的数值，表示触摸压力。0代表没有压力，1代表硬件所能识别的最大压力。

**（5）target**

target属性返回一个Element节点，代表触摸发生的那个节点。

### TouchList对象

TouchList对象是一个类似数组的对象，成员是与某个触摸事件相关的所有触摸点。比如，用户用三根手指触摸，产生的TouchList对象就有三个成员，每根手指对应一个Touch对象。

TouchList实例的length属性，返回TouchList对象的成员数量。

TouchList实例的identifiedTouch方法和item方法，分别使用id属性和索引值（从0开始）作为参数，取出指定的Touch对象。

### TouchEvent对象

TouchEvent对象继承Event对象和UIEvent对象，表示触摸引发的事件。除了被继承的属性以外，它还有一些自己的属性。

**（1）键盘相关属性**

以下属性都为只读属性，返回一个布尔值，表示触摸的同时，是否按下某个键。

- altKey 是否按下alt键
- ctrlKey 是否按下ctrl键
- metaKey 是否按下meta键
- shiftKey 是否按下shift键

**（2）changedTouches**

changedTouches属性返回一个TouchList对象，包含了由当前触摸事件引发的所有Touch对象（即相关的触摸点）。

对于touchstart事件，它代表被激活的触摸点；对于touchmove事件，代表发生变化的触摸点；对于touchend事件，代表消失的触摸点（即不再被触碰的点）。

```javascript
var touches = touchEvent.changedTouches;
```

**（3）targetTouches**

targetTouches属性返回一个TouchList对象，包含了触摸的目标Element节点内部，所有仍然处于活动状态的触摸点。

```javascript
var touches = touchEvent.targetTouches;
```

**（4）touches**

touches属性返回一个TouchList对象，包含了所有仍然处于活动状态的触摸点。

```javascript
var touches = touchEvent.touches;
```

### 触摸事件的种类

触摸引发的事件，有以下几类。可以通过TouchEvent.type属性，查看到底发生的是哪一种事件。

- touchstart：用户接触触摸屏时触发，它的target属性返回发生触摸的Element节点。

- touchend：用户不再接触触摸屏时（或者移出屏幕边缘时）触发，它的target属性与touchstart事件的target属性是一致的，它的changedTouches属性返回一个TouchList对象，包含所有不再触摸的触摸点（Touch对象）。

- touchmove：用户移动触摸点时触发，它的target属性与touchstart事件的target属性一致。如果触摸的半径、角度、力度发生变化，也会触发该事件。

- touchcancel：触摸点取消时触发，比如在触摸区域跳出一个情态窗口（modal window）、触摸点离开了文档区域（进入浏览器菜单栏区域）、用户放置更多的触摸点（自动取消早先的触摸点）。

下面是一个例子。

```javascript
var el = document.getElementsByTagName("canvas")[0];
el.addEventListener("touchstart", handleStart, false);
el.addEventListener("touchmove", handleMove, false);

function handleStart(evt) {
  // 阻止浏览器继续处理触摸事件，
  // 也阻止发出鼠标事件
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i=0; i < touches.length; i++) {
    console.log(touches[i].pageX, touches[i].pageY);
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i=0; i < touches.length; i++) {
    var id = touches[i].identifier;
    var touch = touches.identifiedTouch(id);
    console.log(touch.pageX, touch.pageY);
  }
}
```

## 焦点事件（FocusEvent）

焦点事件与Element节点获得或失去焦点相关。它主要包括以下四个事件。

- focus：Element节点获得焦点后触发，该事件不会冒泡。
- blur：Element节点失去焦点后触发，该事件不会冒泡。
- focusin：Element节点将要获得焦点时触发，该事件会冒泡，但Firefox不支持该事件。
- focusout：Element节点将要失去焦点时触发，该事件会冒泡，但Firefox不支持该事件。

以上四个事件都会生成一个FocusEvent事件对象。该对象有以下属性。

- target：事件对象的目标节点。
- type：事件的类型，格式为字符串。
- bubbles：返回一个布尔值，表示该事件是否会冒泡。
- cancelable：返回一个布尔值，表示是否可以取消该事件。
- relatedTarget：返回一个Element节点。对于focusin事件，表示失去焦点的节点；对于focusout事件，表示将要接受焦点的节点；对于focus和blur事件，该属性返回null。

由于focus和blur事件不会冒泡，只能在捕获阶段触发，所以addEventListener方法的第三个参数需要设为true。

```javascript
form.addEventListener("focus", function( event ) {
  event.target.style.background = "pink";
}, true);
form.addEventListener("blur", function( event ) {
  event.target.style.background = "";
}, true);
```

上面代码设置表单的文本输入框，在接受焦点时设置背景色，在失去焦点时去除背景色。

FocusEvent对象继承Event对象和UIEvent对象。浏览器提供一个FocusEvent构造函数，可以用它生成FocusEvent实例。

```javascript
var focusEvent = new FocusEvent(typeArg, focusEventInit);
```

上面代码中，FocusEvent构造函数的第一个参数为事件类型，第二个参数是可选的，它是一个对象，用来配置FocusEvent对象。UIEvent和Event构造函数的配置项，都可以在该对象设置，其中的relatedTarget字段，用来设置焦点从一个节点变化到另一个节点时的来源节点和目标节点。

## 事件的类型

DOM支持多种事件。

- UIEvent/UIEvents
- MouseEvent/MouseEvents
- MutationEvent/MutationEvents
- HTMLEvents
- TextEvent
- KeyboardEvent
- CustomEvent
- Event
- ProgressEvent
- AnimationEvent（webkit浏览器为WebKitAnimationEvent）
- TransitionEvent（webkit浏览器为WebKitTransitionEvent）

有些事件类型的名称，同时存在单数形式和复数形式。这是因为DOM 2.0版采用复数形式，DOM 3.0版统一改为单数形式，浏览器为了保持兼容，就两种形式都支持。

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

## 自定义事件（标准写法）

除了浏览器预定义的那些事件，用户还可以自定义事件，然后手动触发。

```javascript
// 新建事件实例
var event = new Event('build');

// 添加监听函数
elem.addEventListener('build', function (e) { ... }, false);

// 触发事件
elem.dispatchEvent(event);
```

上面代码触发了自定义事件，该事件会层层向上冒泡。在冒泡过程中，如果有一个元素定义了该事件的回调函数，该回调函数就会触发。

由于IE不支持这个API，如果在IE中自定义事件，需要使用后文的“老式方法”。

### CustomEvent()

Event构造函数只能指定事件名，不能在事件上绑定数据。如果需要在触发事件的同时，传入指定的数据，需要使用CustomEvent构造函数生成自定义的事件对象。

```javascript
var event = new CustomEvent('build', { 'detail': 'hello' });
function eventHandler(e) {
  console.log(e.detail);
}
```

上面代码中，CustomEvent构造函数的第一个参数是事件名称，第二个参数是一个对象，该对象的detail属性会绑定在事件对象之上。

下面是另一个例子。

{% highlight javascript %}

var myEvent = new CustomEvent("myevent", {
  detail: {
    foo: "bar"
  },
  bubbles: true,
  cancelable: false
});

el.addEventListener('myevent', function(event) {
  console.log('Hello ' + event.detail.foo);
});

el.dispatchEvent(myEvent);

{% endhighlight %}

IE不支持这个方法，可以用下面的垫片函数模拟。

```javascript
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
```

### MouseEvent()

MouseEvent方法是一个构造函数，用来新建鼠标事件。

```javascript
event = new MouseEvent(typeArg, mouseEventInit);
```

MouseEvent构造函数的第一个参数是事件名称（可能的值包括click、mousedown、mouseup、mouseover、mousemove、mouseout），第二个参数是一个事件初始化对象。该对象可以配置以下属性。

- detail，鼠标点击的次数，等同于Event.detail属性。
- screenX，鼠标相对于屏幕的水平坐标，默认为0，等同于Event.screenX属性。
- screenY，鼠标相对于屏幕的垂直坐标，默认为0，等同于Event.screenY属性。
- clientX，鼠标相对于窗口的水平坐标，默认为0，等同于Event.clientX属性。
- clientY，鼠标相对于窗口的垂直坐标，默认为0，等同于Event.clientY属性。
- ctrlKey，是否按下ctrl键，默认为false，等同于Event.ctrlKey属性。
- shiftKey，是否按下shift键，默认为false，等同于Event.shiftKey属性。
- altKey，是否按下alt键，默认为false，等同于Event.altKey属性。
- metaKey，是否按下meta键，默认为false，等同于Event.metaKey属性。
- button，按下了哪一个鼠标按键，默认为0。-1表示没有按键，0表示按下主键（通常是左键），1表示按下辅助键（通常是中间的键），2表示按下次要键（通常是右键）。
- relatedTarget，等同于event.relatedTarget属性，只有鼠标事件需要用到该属性，其他事件类型都传入null。
- bubbles，布尔值，是否冒泡，默认为false，等同于Event.bubbles属性。
- cancelable，布尔值，是否可取消，默认为false，等同于Event.cancelable属性。
- view，事件的视图，一般是window或document.defaultView，等同于Event.view属性。

下面是一个例子。

```javascript
function simulateClick() {
  var event = new MouseEvent('click', {
    'bubbles': true,
    'cancelable': true
  });
  var cb = document.getElementById('checkbox');
  cb.dispatchEvent(event);
}
```

上面代码生成一个鼠标点击事件，并触发该事件。

## 自定义事件（老式写法）

以下的方法都不是标准，未来会被逐步淘汰，但是目前浏览器还广泛支持。除非是为了兼容老式浏览器，否则不要使用使用下面的这些方法。

### document.createEvent()

document.createEvent方法用来新建指定类型的事件。它所生成的Event实例，可以传入dispatchEvent方法。

```javascript
// 新建Event实例
var event = document.createEvent('Event');

// 事件的初始化
event.initEvent('build', true, true);

// 加上监听函数
document.addEventListener('build', doSomething, false);

// 触发事件
document.dispatchEvent(event);
```

createEvent方法接受一个字符串作为参数，可能的值参见下表“数据类型”一栏。使用了某一种“事件类型”，就必须使用对应的事件初始化方法。

|事件类型|事件初始化方法|
|--------|--------------|
|UIEvents|event.initUIEvent|
|MouseEvents|event.initMouseEvent|
|MutationEvents|event.initMutationEvent|
|HTMLEvents|event.initEvent|
|Event|event.initEvent|
|CustomEvent|event.initCustomEvent|
|KeyboardEvent|event.initKeyEvent|

### event.initEvent()

事件对象的initEvent方法，用来初始化事件对象，还能向事件对象添加属性。该方法的参数必须是一个使用`Document.createEvent()`生成的Event实例，而且必须在dispatchEvent方法之前调用。

```javascript
var event = document.createEvent('Event');
event.initEvent('my-custom-event', true, true, {foo:'bar'});
someElement.dispatchEvent(event);
```

initEvent方法可以接受四个参数。

- type：事件名称，格式为字符串。
- bubbles：事件是否应该冒泡，格式为布尔值。可以使用event.bubbles属性读取它的值。
- cancelable：事件是否能被取消，格式为布尔值。可以使用event.cancelable属性读取它的值。
- option：为事件对象指定额外的属性。

### event.initMouseEvent()

initMouseEvent方法用来初始化Document.createEvent方法新建的鼠标事件。该方法必须在事件新建（document.createEvent方法）之后、触发（dispatchEvent方法）之前调用。

initMouseEvent方法有很长的参数。

```javascript
event.initMouseEvent(type, canBubble, cancelable, view,
  detail, screenX, screenY, clientX, clientY,
  ctrlKey, altKey, shiftKey, metaKey,
  button, relatedTarget
);
```

上面这些参数的含义，参见MouseEvent构造函数的部分。

模仿并触发click事件的写法如下。

{% highlight javascript %}

var simulateDivClick = document.createEvent('MouseEvents');

simulateDivClick.initMouseEvent('click',true,true,
  document.defaultView,0,0,0,0,0,false,
  false,false,0,null,null
);

divElement.dispatchEvent(simulateDivClick);

{% endhighlight %}

### UIEvent.initUIEvent()

`UIEvent.initUIEvent()`用来初始化一个UI事件。该方法必须在事件新建（document.createEvent方法）之后、触发（dispatchEvent方法）之前调用。

```javascript
event.initUIEvent(type, canBubble, cancelable, view, detail)
```

该方法的参数含义，可以参见MouseEvent构造函数的部分。其中，detail参数是一个数值，含义与事件类型有关，对于鼠标事件，这个值表示鼠标按键在某个位置按下的次数。

```javascript
var e = document.createEvent("UIEvent");
e.initUIEvent("click", true, true, window, 1);
```

## 参考链接

- Wilson Page, [An Introduction To DOM Events](http://coding.smashingmagazine.com/2013/11/12/an-introduction-to-dom-events/)
- Mozilla Developer Network, [Using Firefox 1.5 caching](https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching)
- Craig Buckler, [How to Capture CSS3 Animation Events in JavaScript](http://www.sitepoint.com/css3-animation-javascript-event-handlers/)
- Ray Nicholus, [You Don't Need jQuery!: Events](http://blog.garstasio.com/you-dont-need-jquery/events/)
