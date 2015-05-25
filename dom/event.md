---
title: Event对象
layout: page
category: dom
date: 2013-11-15
modifiedOn: 2013-12-19
---

事件是一种异步编程的实现方式，本质上是程序各个组成部分之间传递的特定消息。DOM支持大量的事件，本节介绍DOM的事件编程。

## EventTarget接口

DOM的事件操作（监听和触发），都定义在EventTarget接口。Element节点、document节点和window对象，都部署了这个接口。此外，XMLHttpRequest、AudioNode、AudioContext等浏览器内置对象，也部署了这个接口。

该接口就是三个方法，addEventListener和removeEventListener用于绑定和移除监听函数，dispatchEvent用于触发事件。

### addEventListener()

addEventListener方法用于在当前节点或对象上，定义一个特定事件的监听函数。

```javascript
target.addEventListener(type, listener[, useCapture]);
```

上面是使用格式，addEventListener方法接受三个参数。

- type，事件名称，大小写不敏感。

- listener，监听函数。指定事件发生时，会调用该监听函数。

- useCapture，监听函数是否在捕获阶段（capture）触发（参见后文《事件的传播》部分）。该参数是一个布尔值，默认为false（表示监听函数只在冒泡阶段被触发）。老式浏览器规定该参数必写，较新版本的浏览器允许该参数可选。为了保持兼容，建议总是写上该参数。

下面是一个例子。

```javascript
function hello(){
  console.log('Hello world');
}

var button = document.getElementById("btn");
button.addEventListener('click', hello, false);
```

上面代码中，addEventListener方法为button节点，绑定click事件的监听函数hello，该函数只在冒泡阶段触发。

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

监听函数（listener）是事件发生时，程序所要执行的函数。它是事件驱动编程模式的主要编程方式。

DOM提供三种方法，可以用来为事件绑定监听函数。

### HTML标签的on-属性

HTML语言允许在元素标签的属性中，直接定义某些事件的监听代码。

```html
<body onload="doSomething()">

<div onclick="console.log('触发事件')">
```

上面代码为body节点的load事件、div节点的click事件，指定了监听函数。

使用这个方法指定的监听函数，只会在冒泡阶段触发。

注意，使用这种方法时，on-属性的值是“监听代码”，而不是“监听函数”。也就是说，一旦指定事件发生，这些代码是原样传入JavaScript引擎执行。因此如果要执行函数，必须在函数名后面加上一对圆括号。

另外，Element节点的setAttribue方法，其实设置的也是这种效果。

```javascript
el.setAttribute('onclick', 'doSomething()');
```

### Element节点的事件属性

Element节点有事件属性，可以定义监听函数。

```javascript
window.onload = doSomething;

div.onclick = function(event){
  console.log('触发事件');
};
```

使用这个方法指定的监听函数，只会在冒泡阶段触发。

### addEventListener方法

通过Element节点、document节点、window对象的addEventListener方法，也可以定义事件的监听函数。

```javascript
window.addEventListener('load', doSomething, false);
```

addEventListener方法的详细介绍，参见本节EventTarget接口的部分。

在上面三种方法中，第一种“HTML标签的on-属性”，违反了HTML与JavaScript代码相分离的原则；第二种“Element节点的事件属性”的缺点是，同一个事件只能定义一个监听函数，也就是说，如果定义两次onclick属性，后一次定义会覆盖前一次。因此，这两种方法都不推荐使用，除非是为了程序的兼容问题，因为所有浏览器都支持这两种方法。

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
<!-- 或者使用JavaScript代码  -->
<script>
  pElement.setAttribute('onclick', 'hello()');
</script>
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

当一个事件发生以后，它会在不同的DOM节点之间传播（propagation）。这种传播分成三个阶段：

- **第一阶段**：从window对象传导到目标节点，称为“捕获阶段”（capture phase）。

- **第二阶段**：在目标节点上触发，称为“目标阶段”（target phase）。

- **第三阶段**：从目标节点传导回window对象，称为“冒泡阶段”（bubbling phase）。

这种三阶段的传播模型，会使得一个事件在多个节点上触发。比如，假设div节点之中嵌套一个p节点。

```html
<div>
  <p>Click Me</p>
</div>
```

如果对这两个节点的click事件都设定监听函数，则click事件会被触发四次。

```javascript
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
```

上面代码表示，click事件被触发了四次：p节点的捕获阶段和冒泡阶段各1次，div节点的捕获阶段和冒泡阶段各1次。

1. 捕获阶段：事件从div向p传播时，触发div的click事件；
2. 目标阶段：事件从div到达p时，触发p的click事件；
3. 目标阶段：事件离开p时，触发p的click事件；
4. 冒泡阶段：事件从p传回div时，再次触发div的click事件。

注意，用户点击网页的时候，浏览器总是假定click事件的目标节点，就是点击位置的嵌套最深的那个节点（嵌套在div节点的p节点）。

事件传播的最上层对象是window，接着依次是document，html（document.documentElement）和body（document.dody）。也就是说，如果body元素中有一个div元素，点击该元素。事件的传播顺序，在捕获阶段依次为window、document、html、body、div，在冒泡阶段依次为div、body、html、document、window。

### 事件的代理

由于事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。这种方法叫做事件的代理（delegation）。

```javascript
var ul = document.querySelector('ul');

ul.addEventListener('click', function(event) {
  if (event.target.tagName.toLowerCase() === 'li') {
    // some code
  }
});
```

上面代码的click事件的监听函数定义在ul节点，但是实际上，它处理的是子节点li的click事件。这样做的好处是，只要定义一个监听函数，就能处理多个子节点的事件，而且以后再添加子节点，监听函数依然有效。

如果希望事件到某个节点为止，不再传播，可以使用事件对象的stopPropagation方法。

```javascript
p.addEventListener('click', function(event) {
  event.stopPropagation();
});
```

使用上面的代码以后，click事件在冒泡阶段到达p节点以后，就不再向上（父节点的方向）传播了。

但是，stopPropagation方法不会阻止p节点上的其他click事件的监听函数。如果想要不再触发那些监听函数，可以使用stopImmediatePropagation方法。

```javascript
p.addEventListener('click', function(event) {
 event.stopImmediatePropagation();
});

p.addEventListener('click', function(event) {
 // 不会被触发
});
```

## Event对象

事件发生以后，会生成一个事件对象，作为参数传给监听函数。浏览器原生提供一个Event对象，所有的事件都是这个对象的实例，或者说继承了`Event.prototype`对象。

Event对象本身就是一个构造函数，可以用来生成新的实例。

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

上面代码新建一个look事件实例，然后使用dispatchEvent方法触发该事件。

IE8及以下版本，事件对象不作为参数传递，而是通过window对象的event属性读取，并且事件对象的target属性叫做srcElement属性。所以，以前获取事件信息，往往要写成下面这样。

```javascript
function myEventHandler(event) {
  var actualEvent = event || window.event;
  var actualTarget = actualEvent.target || actualEvent.srcElement;
  // ...
}
```

上面的代码只是为了说明以前的程序为什么这样写，在新代码中，这样的写法不应该再用了。

以下介绍Event实例的属性和方法。

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

上面代码中，点击para节点，该节点会不可见。另外，在监听函数中，currentTarget属性实际上等同于this对象。

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

上面代码为点击单选框的事件，设置监听函数，取消默认行为。由于浏览器的默认行为是选中单选框，所以这段代码会导致无法选中单选框。

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

stopPropagation方法阻止事件在DOM中继续传播，防止再触发定义在别的节点上的监听函数，但是不包括在当前节点上新定义的事件监听函数。

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

## 鼠标事件

### 事件种类

鼠标事件指与鼠标相关的事件，主要有以下一些。

**（1）click事件**

click事件当用户在Element节点、document节点、window对象上，单击鼠标（或者按下回车键）时触发。“鼠标单击”定义为，用户在同一个位置完成一次mousedown动作和mouseup动作。它们的触发顺序是：mousedown首先触发，mouseup接着触发，click最后触发。

下面是一个设置click事件监听函数的例子。

```javascript
div.addEventListener("click", function( event ) {
  // 显示在该节点，鼠标连续点击的次数
  event.target.innerHTML = "click count: " + event.detail;
}, false);
```

下面的代码是利用click事件进行CSRF攻击（Cross-site request forgery）的一个例子。

```html
<a href="http://www.harmless.com/" onclick="
  var f = document.createElement('form');
  f.style.display = 'none';
  this.parentNode.appendChild(f);
  f.method = 'POST';
  f.action = 'http://www.example.com/account/destroy';
  f.submit();
  return false;">伪装的链接</a>
```

**（2）dblclick事件**

dblclick事件当用户在element、document、window对象上，双击鼠标时触发。该事件会在mousedown、mouseup、click之后触发。

**（3）mouseup事件，mousedown事件**

mouseup事件在释放按下的鼠标键时触发。

mousedown事件在按下鼠标键时触发。

**（4）mousemove事件**

mousemove事件当鼠标在一个节点内部移动时触发。当鼠标持续移动时，该事件会连续触发。为了避免性能问题，建议对该事件的监听函数做一些限定，比如限定一段时间内只能运行一次代码。

**（5）mouseover事件，mouseenter事件**

mouseover事件和mouseenter事件，都是鼠标进入一个节点时触发。

两者的区别是，mouseover事件会冒泡，mouseenter事件不会。子节点的mouseover事件会冒泡到父节点，进而触发父节点的mouseover事件。mouseenter事件就没有这种效果，所以进入子节点时，不会触发父节点的监听函数。

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

**（6）mouseout事件，mouseleave事件**

mouseout事件和mouseleave事件，都是鼠标离开一个节点时触发。

两者的区别是，mouseout事件会冒泡，mouseleave事件不会。子节点的mouseout事件会冒泡到父节点，进而触发父节点的mouseout事件。mouseleave事件就没有这种效果，所以离开子节点时，不会触发父节点的监听函数。

**（7）contextmenu**

contextmenu事件在一个节点上点击鼠标右键时触发，或者按下“上下文菜单”键时触发。

### MouseEvent对象

鼠标事件使用MouseEvent对象表示，它继承UIEvent对象和Event对象。浏览器提供一个MouseEvent构造函数，用于新建一个MouseEvent实例。

```javascript
event = new MouseEvent(typeArg, mouseEventInit);
```

MouseEvent构造函数的第一个参数是事件名称（可能的值包括click、mousedown、mouseup、mouseover、mousemove、mouseout），第二个参数是一个事件初始化对象。该对象可以配置以下属性。

- screenX，设置鼠标相对于屏幕的水平坐标（但不会移动鼠标），默认为0，等同于MouseEvent.screenX属性。
- screenY，设置鼠标相对于屏幕的垂直坐标，默认为0，等同于MouseEvent.screenY属性。
- clientX，设置鼠标相对于窗口的水平坐标，默认为0，等同于MouseEvent.clientX属性。
- clientY，设置鼠标相对于窗口的垂直坐标，默认为0，等同于MouseEvent.clientY属性。
- ctrlKey，设置是否按下ctrl键，默认为false，等同于MouseEvent.ctrlKey属性。
- shiftKey，设置是否按下shift键，默认为false，等同于MouseEvent.shiftKey属性。
- altKey，设置是否按下alt键，默认为false，等同于MouseEvent.altKey属性。
- metaKey，设置是否按下meta键，默认为false，等同于MouseEvent.metaKey属性。
- button，设置按下了哪一个鼠标按键，默认为0。-1表示没有按键，0表示按下主键（通常是左键），1表示按下辅助键（通常是中间的键），2表示按下次要键（通常是右键）。
- buttons，设置按下了鼠标哪些键，是一个3个比特位的二进制值，默认为0。1表示按下主键（通常是左键），2表示按下次要键（通常是右键），4表示按下辅助键（通常是中间的键）。
- relatedTarget，设置一个Element节点，在mouseenter和mouseover事件时，表示鼠标刚刚离开的那个Element节点，在mouseout和mouseleave事件时，表示鼠标正在进入的那个Element节点。默认为null，等同于MouseEvent.relatedTarget属性。

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

以下介绍MouseEvent实例的属性。

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

### clientX，clientY，movementX，movementY，screenX，screenY

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

### wheel事件

wheel事件是与鼠标滚轮相关的事件，目前只有一个wheel事件。用户滚动鼠标的滚轮，就触发这个事件。

该事件除了继承了MouseEvent、UIEvent、Event的属性，还有几个自己的属性。

- deltaX：返回一个数值，表示滚轮的水平滚动量。
- deltaY：返回一个数值，表示滚轮的垂直滚动量。
- deltaZ：返回一个数值，表示滚轮的Z轴滚动量。
- deltaMode：返回一个数值，表示滚动的单位，适用于上面三个属性。0表示像素，1表示行，2表示页。

浏览器提供一个WheelEvent构造函数，可以用来生成滚轮事件的实例。它接受两个参数，第一个是事件名称，第二个是配置对象。

```javascript
var syntheticEvent = new WheelEvent("syntheticWheel", {"deltaX": 4, "deltaMode": 0});
```

## 键盘事件

键盘事件用来描述键盘行为，主要有keydown、keypress、keyup三个事件。

- keydown：按下键盘时触发该事件。

- keypress：只要按下的键并非Ctrl、Alt、Shift和Meta，就接着触发keypress事件。

- keyup：松开键盘时触发该事件。

下面是一个例子，对文本框设置keypress监听函数，只允许输入数字。

```javascript
// HTML代码为
// <input type="text"
//   name="myInput"
//   onkeypress="return numbersOnly(this, event);"
//   onpaste="return false;"
// />

function numbersOnly(oToCheckField, oKeyEvent) {
  return oKeyEvent.charCode === 0
    || /\d/.test(String.fromCharCode(oKeyEvent.charCode));
}
```

如果用户一直按键不松开，就会连续触发键盘事件，触发的顺序如下。

1. keydown
1. keypress
1. keydown
1. keypress
1. （重复以上过程）
1. keyup

键盘事件使用KeyboardEvent对象表示，该对象继承了UIEvent和MouseEvent对象。浏览器提供KeyboardEvent构造函数，用来新建键盘事件的实例。

```javascript
event = new KeyboardEvent(typeArg, KeyboardEventInit);
```

KeyboardEvent构造函数的第一个参数是一个字符串，表示事件类型，第二个参数是一个事件配置对象，可配置以下字段。

- key，对应KeyboardEvent.key属性，默认为空字符串。
- ctrlKey，对应KeyboardEvent.ctrlKey属性，默认为false。
- shiftKey，对应KeyboardEvent.shiftKey属性，默认为false。
- altKey，对应KeyboardEvent.altKey属性，默认为false。
- metaKey，对应KeyboardEvent.metaKey属性，默认为false。

下面就是KeyboardEvent实例的属性介绍。

### altKey，ctrlKey，metaKey，shiftKey

以下属性返回一个布尔值，表示是否按下对应的键。

- altKey：alt键
- ctrlKey：ctrl键
- metaKey：meta键（mac系统是一个四瓣的小花，windows系统是windows键）
- shiftKey：shift键

```javascript
function showChar(e){
  console.log("ALT: " + e.altKey);
  console.log("CTRL: " + e.ctrlKey);
  console.log("Meta: " + e.metaKey);
  console.log("Meta: " + e.shiftKey);
}
```

### key，charCode

key属性返回一个字符串，表示按下的键名。如果同时按下一个控制键和一个符号键，则返回符号键的键名。比如，按下Ctrl+a，则返回a。如果无法识别键名，则返回字符串Unidentified。

主要功能键的键名（不同的浏览器可能有差异）：Backspace，Tab，Enter，Shift，Control，Alt，CapsLock，CapsLock，Esc，Spacebar，PageUp，PageDown，End，Home，Left，Right，Up，Down，PrintScreen，Insert，Del，Win，F1～F12，NumLock，Scroll等。

charCode属性返回一个数值，表示keypress事件按键的Unicode值，keydown和keyup事件不提供这个属性。注意，该属性已经从标准移除，虽然浏览器还支持，但应该尽量不使用。

## 进度事件

进度事件用来描述一个事件进展的过程，比如XMLHttpRequest对象发出的HTTP请求的过程、&lt;img&gt;、&lt;audio&gt;、&lt;video&gt;、&lt;style&gt;、&lt;link&gt;加载外部资源的过程。下载和上传都会发生进度事件。

进度事件有以下几种。

- abort事件：当进度事件被中止时触发。如果发生错误，导致进程中止，不会触发该事件。

- error事件：由于错误导致资源无法加载时触发。

- load事件：进度成功结束时触发。

- loadstart事件：进度开始时触发。

- loadend事件：进度停止时触发，发生顺序排在error事件\abort事件\load事件后面。

- progress事件：当操作处于进度之中，由传输的数据块不断触发。

- timeout事件：进度超过限时触发。

```javascript
image.addEventListener('load', function(event) {
  image.classList.add('finished');
});

image.addEventListener('error', function(event) {
  image.style.display = 'none';
});
```

上面代码在图片元素加载完成后，为图片元素的class属性添加一个值“finished”。如果加载失败，就把图片元素的样式设置为不显示。

有时候，图片加载会在脚本运行之前就完成，尤其是当脚本放置在网页底部的时候，因此有可能使得load和error事件的监听函数根本不会被执行。所以，比较可靠的方式，是用complete属性先判断一下是否加载完成。

```
function loaded() {
  // code after image loaded
}

if (image.complete) {
  loaded();
} else {
  image.addEventListener('load', loaded);
}
```

由于DOM没有提供像complete属性那样的，判断是否发生加载错误的属性，所以error事件的监听函数最好放在img元素的HTML属性中，这样才能保证发生加载错误时百分之百会执行。

```html
<img src="/wrong/url" onerror="this.style.display='none';" />
```

error事件有一个特殊的性质，就是不会冒泡。这样的设计是正确的，防止引发父元素的error事件监听函数。

进度事件使用ProgressEvent对象表示。ProgressEvent实例有以下属性。

- lengthComputable：返回一个布尔值，表示当前进度是否具有可计算的长度。如果为false，就表示当前进度无法测量。

- total：返回一个数值，表示当前进度的总长度。如果是通过HTTP下载某个资源，表示内容本身的长度，不含HTTP头部的长度。如果lengthComputable属性为false，则total属性就无法取得正确的值。

- loaded：返回一个数值，表示当前进度已经完成的数量。该属性除以total属性，就可以得到目前进度的百分比。

下面是一个例子。

```javascript
var xhr = new XMLHttpRequest();

xhr.addEventListener("progress", updateProgress, false);
xhr.addEventListener("load", transferComplete, false);
xhr.addEventListener("error", transferFailed, false);
xhr.addEventListener("abort", transferCanceled, false);

xhr.open();

function updateProgress (e) {
  if (e.lengthComputable) {
    var percentComplete = e.loaded / e.total;
  } else {
    console.log('不能计算进度');
  }
}

function transferComplete(e) {
  console.log('传输结束');
}

function transferFailed(evt) {
  console.log('传输过程中发生错误');
}

function transferCanceled(evt) {
  console.log('用户取消了传输');
}
```

loadend事件的监听函数，可以用来取代abort事件/load事件/error事件的监听函数。

```javascript
req.addEventListener("loadend", loadEnd, false);

function loadEnd(e) {
  console.log('传输结束，成功失败未知');
}
```

loadend事件本身不提供关于进度结束的原因，但可以用它来做所有进度结束场景都需要做的一些操作。

另外，上面是下载过程的进度事件，还存在上传过程的进度事件。这时所有监听函数都要放在XMLHttpRequest.upload对象上面。

```javascript
var xhr = new XMLHttpRequest();

xhr.upload.addEventListener("progress", updateProgress, false);
xhr.upload.addEventListener("load", transferComplete, false);
xhr.upload.addEventListener("error", transferFailed, false);
xhr.upload.addEventListener("abort", transferCanceled, false);

xhr.open();
```

浏览器提供一个ProgressEvent构造函数，用来生成进度事件的实例。

```javascript
progressEvent = new ProgressEvent(type, {
  lengthComputable: aBooleanValue,
  loaded: aNumber,
  total: aNumber
});
```

上面代码中，ProgressEvent构造函数的第一个参数是事件类型（字符串），第二个参数是配置对象，用来指定lengthComputable属性（默认值为false）、loaded属性（默认值为0）、total属性（默认值为0）。

## 拖拉事件

拖拉指的是，用户在某个对象上按下鼠标键不放，拖动它到另一个位置，然后释放鼠标键，将该对象放在那里。

拖拉的对象有好几种，包括Element节点、图片、链接、选中的文字等等。在HTML网页中，除了Element节点默认不可以拖拉，其他（图片、链接、选中的文字）都是可以直接拖拉的。为了让Element节点可拖拉，可以将该节点的draggable属性设为true。

```html
<div draggable="true">
  此区域可拖拉
</div>
```

draggable属性可用于任何Element节点，但是图片（img元素）和链接（a元素）不加这个属性，就可以拖拉。对于它们，用到这个属性的时候，往往是将其设为false，防止拖拉。

注意，一旦某个Element节点的draggable属性设为true，就无法再用鼠标选中该节点内部的文字或子节点了。

### 事件种类

当Element节点或选中的文本被拖拉时，就会持续触发拖拉事件，包括以下一些事件。

- **drag事件**：拖拉过程中，在被拖拉的节点上持续触发。

- **dragstart事件**：拖拉开始时在被拖拉的节点上触发，该事件的target属性是被拖拉的节点。通常应该在这个事件的监听函数中，指定拖拉的数据。

- **dragend事件**：拖拉结束时（释放鼠标键或按下escape键）在被拖拉的节点上触发，该事件的target属性是被拖拉的节点。它与dragStart事件，在同一个节点上触发。不管拖拉是否跨窗口，或者中途被取消，dragend事件总是会触发的。

- **dragenter事件**：拖拉进入当前节点时，在当前节点上触发，该事件的target属性是当前节点。通常应该在这个事件的监听函数中，指定是否允许在当前节点放下（drop）拖拉的数据。如果当前节点没有该事件的监听函数，或者监听函数不执行任何操作，就意味着不允许在当前节点放下数据。在视觉上显示拖拉进入当前节点，也是在这个事件的监听函数中设置。

- **dragover事件**：拖拉到当前节点上方时，在当前节点上持续触发，该事件的target属性是当前节点。该事件与dragenter事件基本类似，默认会重置当前的拖拉事件的效果（DataTransfer对象的dropEffect属性）为none，即不允许放下被拖拉的节点，所以如果允许在当前节点drop数据，通常会使用preventDefault方法，取消重置拖拉效果为none。

- **dragleave事件**：拖拉离开当前节点范围时，在当前节点上触发，该事件的target属性是当前节点。在视觉上显示拖拉离开当前节点，就在这个事件的监听函数中设置。

- **drop事件**：被拖拉的节点或选中的文本，释放到目标节点时，在目标节点上触发。注意，如果当前节点不允许drop，即使在该节点上方松开鼠标键，也不会触发该事件。如果用户按下Escape键，取消这个操作，也不会触发该事件。该事件的监听函数负责取出拖拉数据，并进行相关处理。

关于拖拉事件，有以下几点注意事项。

- 拖拉过程只触发以上这些拖拉事件，尽管鼠标在移动，但是鼠标事件不会触发。

- 将文件从操作系统拖拉进浏览器，不会触发dragStart和dragend事件。

- dragenter和dragover事件的监听函数，用来指定可以放下（drop）拖拉的数据。由于网页的大部分区域不适合作为drop的目标节点，所以这两个事件的默认设置为当前节点不允许drop。如果想要在目标节点上drop拖拉的数据，首先必须阻止这两个事件的默认行为，或者取消这两个事件。

```html
<div ondragover="return false">
<div ondragover="event.preventDefault()">
```

上面代码中，如果不取消拖拉事件或者阻止默认行为，就不可能在div节点上drop被拖拉的节点。

拖拉事件用一个DragEvent对象表示，该对象继承MouseEvent对象，因此也就继承了UIEvent和Event对象。DragEvent对象只有一个独有的属性DataTransfer，其他都是继承的属性。DataTransfer属性用来读写拖拉事件中传输的数据，详见下文《DataTransfer对象》的部分。

下面的例子展示，如何动态改变被拖动节点的背景色。

```javascript
div.addEventListener("dragstart", function(e) {
  this.style.backgroundColor = "red";
}, false);
div.addEventListener("dragend", function(e) {
  this.style.backgroundColor = "green";
}, false);
```

上面代码中，div节点被拖动时，背景色会变为红色，拖动结束，又变回绿色。

下面是一个例子，显示如何实现将一个节点从当前父节点，拖拉到另一个父节点中。

```javascript
// HTML代码为
// <div class="dropzone">
//    <div id="draggable" draggable="true">
//       该节点可拖拉
//    </div>
// </div>
// <div class="dropzone"></div>
// <div class="dropzone"></div>
// <div class="dropzone"></div>

// 被拖拉节点
var dragged;

document.addEventListener("dragstart", function( event ) {
  // 保存被拖拉节点
  dragged = event.target;
  // 被拖拉节点的背景色变透明
  event.target.style.opacity = .5;
}, false);

document.addEventListener("dragend", function( event ) {
  // 被拖拉节点的背景色恢复正常
  event.target.style.opacity = "";
}, false);

document.addEventListener("dragover", function( event ) {
  // 防止拖拉效果被重置，允许被拖拉的节点放入目标节点
  event.preventDefault();
}, false);

document.addEventListener("dragenter", function( event ) {
  // 目标节点的背景色变紫色
  // 由于该事件会冒泡，所以要过滤节点
  if ( event.target.className == "dropzone" ) {
    event.target.style.background = "purple";
  }
}, false);

document.addEventListener("dragleave", function( event ) {
  // 目标节点的背景色恢复原样
  if ( event.target.className == "dropzone" ) {
    event.target.style.background = "";
  }
}, false);

document.addEventListener("drop", function( event ) {
  // 防止事件默认行为（比如某些Elment节点上可以打开链接）
  event.preventDefault();
  if ( event.target.className == "dropzone" ) {
    // 恢复目标节点背景色
    event.target.style.background = "";
    // 将被拖拉节点插入目标节点
    dragged.parentNode.removeChild( dragged );
    event.target.appendChild( dragged );
  }
}, false);
```

### DataTransfer对象概述

所有的拖拉事件都有一个dataTransfer属性，用来保存需要传递的数据。这个属性的值是一个DataTransfer对象。

拖拉的数据保存两方面的数据：数据的种类（又称格式）和数据的值。数据的种类是一个MIME字符串，比如 text/plain或者image/jpeg，数据的值是一个字符串。一般来说，如果拖拉一段文本，则数据默认就是那段文本；如果拖拉一个链接，则数据默认就是链接的URL。

当拖拉事件开始的时候，可以提供数据类型和数据值；在拖拉过程中，通过dragenter和dragover事件的监听函数，检查数据类型，以确定是否允许放下（drop）被拖拉的对象。比如，在只允许放下链接的区域，检查拖拉的数据类型是否为text/uri-list。

发生drop事件时，监听函数取出拖拉的数据，对其进行处理。

### DataTransfer对象的属性

DataTransfer对象有以下属性。

**（1）dropEffect**

dropEffect属性设置放下（drop）被拖拉节点时的效果，可能的值包括copy（复制被拖拉的节点）、move（移动被拖拉的节点）、link（创建指向被拖拉的节点的链接）、none（无法放下被拖拉的节点）。设置除此以外的值，都是无效的。

```javascript
target.addEventListener('dragover', function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'copy';
});
```

dropEffect属性一般在dragenter和dragove事件的监听函数中设置，对于dragstart、drag、dragleave这三个事件，该属性不起作用。进入目标节点后，拖拉行为会初始化成用户设定的效果，用户可以通过按下Shift键和Control键，改变初始设置，在copy、move、link三种效果中切换。

鼠标箭头会根据dropEffect属性改变形状，提示目前正处于哪一种效果。这意味着，通过鼠标就能判断是否可以在当前节点drop被拖拉的节点。

**（2）effectAllowed**

effectAllowed属性设置本次拖拉中允许的效果，可能的值包括copy（复制被拖拉的节点）、move（移动被拖拉的节点）、link（创建指向被拖拉节点的链接）、copyLink（允许copy或link）、copyMove（允许copy或move）、linkMove（允许link或move）、all（允许所有效果）、none（无法放下被拖拉的节点）、uninitialized（默认值，等同于all）。如果某种效果是不允许的，用户就无法在目标节点中达成这种效果。

dragstart事件的监听函数，可以设置被拖拉节点允许的效果；dragenter和dragover事件的监听函数，可以设置目标节点允许的效果。

```javascript
event.dataTransfer.effectAllowed = "copy";
```

dropEffect属性和effectAllowed属性，往往配合使用。

```javascript
event.dataTransfer.effectAllowed = "copyMove";
event.dataTransfer.dropEffect = "copy";
```

上面代码中，copy是指定的效果，但是可以通过Shift或Ctrl键（根据平台而定），将效果切换成move。

只要dropEffect属性和effectAllowed属性之中，有一个为none，就无法在目标节点上完成drop操作。

**（3）files**

files属性是一个FileList对象，包含一组本地文件，可以用来在拖拉操作中传送。如果本次拖拉不涉及文件，则属性为空的FileList对象。

下面就是一个接收拖拉文件的例子。

```javascript
// HTML代码为
// <div id="output" style="min-height: 200px;border: 1px solid black;">
//   文件拖拉到这里
// </div>

var div = document.getElementById('output');

div.addEventListener("dragenter", function( event ) {
  div.textContent = '';
  event.stopPropagation();
  event.preventDefault();
}, false);

div.addEventListener("dragover", function( event ) {
  event.stopPropagation();
  event.preventDefault();
}, false);

div.addEventListener("drop", function( event ) {
  event.stopPropagation();
  event.preventDefault();
  var files = event.dataTransfer.files;
  for (var i = 0; i < files.length; i++) {
    div.textContent += files[i].name + ' ' + files[i].size + '字节\n';
  }
}, false);
```

上面代码中，通过files属性读取拖拉文件的信息。如果想要读取文件内容，就要使用FileReader对象。

```javascript
div.addEventListener('drop', function(e) {
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
```

**（4）types**

types属性是一个数组，保存每一次拖拉的数据格式，比如拖拉文件，则格式信息就为File。

下面是一个例子，通过检查dataTransfer属性的类型，决定是否允许在当前节点执行drop操作。

```javascript
function contains(list, value){
  for( var i = 0; i < list.length; ++i ){
    if(list[i] === value) return true;
  }
  return false;
}

function doDragOver(event){
  var isLink = contains( event.dataTransfer.types, "text/uri-list");
  if (isLink) event.preventDefault();
}
```

上面代码中，只有当被拖拉的节点是一个链接时，才允许在当前节点放下。

### DataTransfer对象的方法

DataTransfer对象有以下方法。

**（1）setData()**

setData方法用来设置事件所带有的指定类型的数据。它接受两个参数，第一个是数据类型，第二个是具体数据。如果指定的类型在现有数据中不存在，则该类型将写入types属性；如果已经存在，在该类型的现有数据将被替换。

```javascript
event.dataTransfer.setData("text/plain", "Text to drag");
```

上面代码为事件加入纯文本格式的数据。

如果拖拉文本框或者拖拉选中的文本，会默认将文本数据添加到dataTransfer属性，不用手动指定。

```javascript
<div draggable="true" ondragstart="
  event.dataTransfer.setData('text/plain', 'bbb')">
  aaa
</div>
```

上面代码中，拖拉数据实际上是bbb，而不是aaa。

下面是添加其他类型的数据。由于text/plain是最普遍支持的格式，为了保证兼容性，建议最后总是将数据保存一份纯文本的格式。

```javascript
var dt = event.dataTransfer;

// 添加链接
dt.setData("text/uri-list", "http://www.example.com");
dt.setData("text/plain", "http://www.example.com");
// 添加HTML代码
dt.setData("text/html", "Hello there, <strong>stranger</strong>");
dt.setData("text/plain", "Hello there, <strong>stranger</strong>");
// 添加图像的URL
dt.setData("text/uri-list", imageurl);
dt.setData("text/plain", imageurl);
```

可以一次提供多种格式的数据。

```javascript
var dt = event.dataTransfer;
dt.setData("application/x-bookmark", bookmarkString);
dt.setData("text/uri-list", "http://www.example.com");
dt.setData("text/plain", "http://www.example.com");
```

上面代码中，通过在同一个事件上面，存放三种类型的数据，使得拖拉事件可以在不同的对象上面，drop不同的值。注意，第一种格式是一个自定义格式，浏览器默认无法读取，这意味着，只有某个部署了特定代码的节点，才可能drop（读取到）这个数据。

**（2）getData()**

getData方法接受一个字符串（表示数据类型）作为参数，返回事件所带的指定类型的数据（通常是用setData方法添加的数据）。如果指定类型的数据不存在，则返回空字符串。通常只有drop事件触发后，才能取出数据。如果取出另一个域名存放的数据，将会报错。

下面是一个drop事件的监听函数，用来取出指定类型的数据。

```javascript
function onDrop(event){
  var data = event.dataTransfer.getData("text/plain");
  event.target.textContent = data;
  event.preventDefault();
}
```

上面代码取出拖拉事件的文本数据，将其替换成当前节点的文本内容。注意，这时还必须取消浏览器的默认行为，因为假如用户拖拉的是一个链接，浏览器默认会在当前窗口打开这个链接。

getData方法返回的是一个字符串，如果其中包含多项数据，就必须手动解析。

```javascript
function doDrop(event){
  var lines = event.dataTransfer.getData("text/uri-list").split("\n");
  for (let line of lines) {
    let link = document.createElement("a");
    link.href = line;
    link.textContent = line;
    event.target.appendChild(link);
  }
  event.preventDefault();
}
```

上面代码中，getData方法返回的是一组链接，就必须自行解析。

类型值指定为URL，可以取出第一个有效链接。

```javascript
var link = event.dataTransfer.getData("URL");
```

下面是一次性取出多种类型的数据。

```javascript
function doDrop(event){
  var types = event.dataTransfer.types;
  var supportedTypes = ["text/uri-list", "text/plain"];
  types = supportedTypes.filter(function (value) types.includes(value));
  if (types.length)
    var data = event.dataTransfer.getData(types[0]);
  event.preventDefault();
}
```

**（3）clearData()**

clearData方法接受一个字符串（表示数据类型）作为参数，删除事件所带的指定类型的数据。如果没有指定类型，则删除所有数据。如果指定类型不存在，则原数据不受影响。

```javascript
event.dataTransfer.clearData("text/uri-list");
```

上面代码清除事件所带的URL数据。

**（4）setDragImage()**

拖动过程中（dragstart事件触发后），浏览器会显示一张图片跟随鼠标一起移动，表示被拖动的节点。这张图片是自动创造的，通常显示为被拖动节点的外观，不需要自己动手设置。setDragImage方法可以用来自定义这张图片，它接受三个参数，第一个是img图片元素或者canvas元素，如果省略或为null则使用被拖动的节点的外观，第二个和第三个参数为鼠标相对于该图片左上角的横坐标和右坐标。

下面是一个例子。

```javascript
// HTML代码为
// <div id="drag-with-image" class="dragdemo" draggable="true">
     drag me
// </div>

var div = document.getElementById("drag-with-image");
div.addEventListener("dragstart", function(e) {
  var img = document.createElement("img");
  img.src = "http://path/to/img";
  e.dataTransfer.setDragImage(img, 0, 0);
}, false);
```

## 触摸事件

触摸API由三个对象组成。

- Touch
- TouchList
- TouchEvent

Touch对象表示触摸点（一根手指或者一根触摸笔），用来描述触摸动作，包括位置、大小、形状、压力、目标元素等属性。有时，触摸动作由多个触摸点（多根手指或者多根触摸笔）组成，多个触摸点的集合由TouchList对象表示。TouchEvent对象代表由触摸引发的事件，只有触摸屏才会引发这一类事件。

很多时候，触摸事件和鼠标事件同时触发，即使这个时候并没有用到鼠标。这是为了让那些只定义鼠标事件、没有定义触摸事件的代码，在触摸屏的情况下仍然能用。如果想避免这种情况，可以用preventDefault方法阻止发出鼠标事件。

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

  for (var i = 0; i < touches.length; i++) {
    console.log(touches[i].pageX, touches[i].pageY);
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var id = touches[i].identifier;
    var touch = touches.identifiedTouch(id);
    console.log(touch.pageX, touch.pageY);
  }
}
```

## 表单事件

### Input事件，select事件，change事件

以下事件与表单成员的值变化有关。

**（1）input事件**

input事件当&lt;input&gt;、&lt;textarea&gt;的值发生变化时触发。此外，打开contenteditable属性的元素，只要值发生变化，也会触发input事件。

input事件的一个特点，就是会连续触发，比如用户每次按下一次按键，就会触发一次input事件。

**（2）select事件**

select事件当在&lt;input&gt;、&lt;textarea&gt;中选中文本时触发。

```javascript
// HTML代码为
// <input id="test" type="text" value="Select me!" />

var elem = document.getElementById('test');
elem.addEventListener('select', function() {
  console.log('Selection changed!');
}, false);
```

**（3）Change事件**

Change事件当&lt;input&gt;、&lt;select&gt;、&lt;textarea&gt;的值发生变化时触发。它与input事件的最大不同，就是不会连续触发，只有当全部修改完成时才会触发，而且input事件必然会引发change事件。具体来说，分成以下几种情况。

- 激活单选框（radio）或复选框（checkbox）时触发。
- 用户提交时触发。比如，从下列列表（select）完成选择，在日期或文件输入框完成选择。
- 当文本框或textarea元素的值发生改变，并且丧失焦点时触发。

下面是一个例子。

```javascript
// HTML代码为
// <select size="1" onchange="changeEventHandler(event);">
//   <option>chocolate</option>
//   <option>strawberry</option>
//   <option>vanilla</option>
// </select>

function changeEventHandler(event) {
  console.log('You like ' + event.target.value + ' ice cream.');
}
```

### reset事件，submit事件

以下事件发生在表单对象上，而不是发生在表单的成员上。

**（1）reset事件**

reset事件当表单重置（所有表单成员变回默认值）时触发。

**（2）submit事件**

submit事件当表单数据向服务器提交时触发。注意，submit事件的发生对象是form元素，而不是button元素（即使它的类型是submit），因为提交的是表单，而不是按钮。

## 文档事件

### beforeunload事件，unload事件，load事件，error事件，pageshow事件，pagehide事件

以下事件与网页的加载与卸载相关。

**（1）beforeunload事件**

beforeunload事件当窗口将要关闭，或者document和网页资源将要卸载时触发。它可以用来防止用户不当心关闭网页。

该事件的默认动作就是关闭当前窗口或文档。如果在监听函数中，调用了`event.preventDefault()`，或者对事件对象的returnValue属性赋予一个非空的值，就会自动跳出一个确认框，让用户确认是否关闭网页。如果用户点击“取消”按钮，网页就不会关闭。监听函数所返回的字符串，会显示在确认对话框之中。

```javascript
window.onbeforeunload = function() {
  if (textarea.value != textarea.defaultValue) {
    return '你确认要离开吗？';
  }
};
```

上面代码表示，当用户关闭网页，会跳出一个确认对话框，上面显示“你确认要离开吗？”。

下面的两种写法，具有同样效果。

```javascript
window.addEventListener('beforeunload', function( event ) {
  event.returnValue = '你确认要离开吗？';
});

// 等同于
window.addEventListener('beforeunload', function( event ) {
  event.preventDefault();
});
```

上面代码中，事件对象的returnValue属性的值，将会成为确认框的提示文字。

只要定义了beforeunload事件的监听函数，网页不会被浏览器缓存。

**（2）unload事件**

unload事件在窗口关闭或者document对象将要卸载时触发，发生在window、body、frameset等对象上面。它的触发顺序排在beforeunload、pagehide事件后面。unload事件只在页面没有被浏览器缓存时才会触发，换言之，如果通过按下“前进/后退”导致页面卸载，并不会触发unload事件。

当unload事件发生时，document对象处于一个特殊状态。所有资源依然存在，但是对用户来说都不可见，UI互动（window.open、alert、confirm方法等）全部无效。这时即使抛出错误，也不能停止文档的卸载。

```javascript
window.addEventListener('unload', function(event) {
  console.log('文档将要卸载');
});
```

如果在window对象上定义了该事件，网页就不会被浏览器缓存。

**（3）load事件，error事件**

load事件在页面加载成功时触发，error事件在页面加载失败时触发。注意，页面从浏览器缓存加载，并不会触发load事件。

这两个事件实际上属于进度事件，不仅发生在document对象，还发生在各种外部资源上面。浏览网页就是一个加载各种资源的过程，图像（image）、样式表（style sheet）、脚本（script）、视频（video）、音频（audio）、Ajax请求（XMLHttpRequest）等等。这些资源和document对象、window对象、XMLHttpRequestUpload对象，都会触发load事件和error事件。

**（4）pageshow事件，pagehide事件**

默认情况下，浏览器会在当前会话（session）缓存页面，当用户点击“前进/后退”按钮时，浏览器就会从缓存中加载页面。

pageshow事件在页面加载时触发，包括第一次加载和从缓存加载两种情况。如果要指定页面每次加载（不管是不是从浏览器缓存）时都运行的代码，可以放在这个事件的监听函数。

第一次加载时，它的触发顺序排在load事件后面。从缓存加载时，load事件不会触发，因为网页在缓存中的样子通常是load事件的监听函数运行后的样子，所以不必重复执行。同理，如果是从缓存中加载页面，网页内初始化的JavaScript脚本（比如DOMContentLoaded事件的监听函数）也不会执行。

```javascript
window.addEventListener('pageshow', function(event) {
  console.log('pageshow: ', event);
});
```

pageshow事件有一个persisted属性，返回一个布尔值。页面第一次加载时，这个属性是false；当页面从缓存加载时，这个属性是true。

```javascript
window.addEventListener('pageshow', function(event){
  if (event.persisted) {
    // ...
  }
});
```

pagehide事件与pageshow事件类似，当用户通过“前进/后退”按钮，离开当前页面时触发。它与unload事件的区别在于，如果在window对象上定义unload事件的监听函数之后，页面不会保存在缓存中，而使用pagehide事件，页面会保存在缓存中。

pagehide事件的event对象有一个persisted属性，将这个属性设为true，就表示页面要保存在缓存中；设为false，表示网页不保存在缓存中，这时如果设置了unload事件的监听函数，该函数将在pagehide事件后立即运行。

如果页面包含frame或iframe元素，则frame页面的pageshow事件和pagehide事件，都会在主页面之前触发。

### DOMContentLoaded事件，readystatechange事件

以下事件与文档状态相关。

**（1）DOMContentLoaded事件**

当HTML文档下载并解析完成以后，就会在document对象上触发DOMContentLoaded事件。这时，仅仅完成了HTML文档的解析（整张页面的DOM生成），所有外部资源（样式表、脚本、iframe等等）可能还没有下载结束。也就是说，这个事件比load事件，发生时间早得多。

```javascript
document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM生成");
});
```

注意，网页的JavaScript脚本是同步执行的，所以定义DOMContentLoaded事件的监听函数，应该放在所有脚本的最前面。否则脚本一旦发生堵塞，将推迟触发DOMContentLoaded事件。

**（2）readystatechange事件**

readystatechange事件发生在Document对象和XMLHttpRequest对象，当它们的readyState属性发生变化时触发。

```javascript
document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    // ...
  }
}
```

IE8不支持DOMContentLoaded事件，但是支持这个事件。因此，可以使用readystatechange事件，在低版本的IE中代替DOMContentLoaded事件。

### scroll事件，resize事件

以下事件与窗口行为有关。

**（1）scroll事件**

scroll事件在文档或文档元素滚动时触发。

由于该事件会连续地大量触发，所以它的监听函数之中不应该有非常耗费计算的操作。推荐的做法是使用requestAnimationFrame或setTimeout控制该事件的触发频率，然后可以结合customEvent抛出一个新事件。

```javascript
(function() {
  var throttle = function(type, name, obj) {
    var obj = obj || window;
    var running = false;
    var func = function() {
      if (running) { return; }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  // 将scroll事件重定义为optimizedScroll事件
  throttle("scroll", "optimizedScroll");
})();

window.addEventListener("optimizedScroll", function() {
  console.log("Resource conscious scroll callback!");
});
```

上面代码中，throttle函数用于控制事件触发频率，requestAnimationFrame方法保证每次页面重绘（每秒60次），只会触发一次scroll事件的监听函数。改用setTimeout方法，可以放置更大的时间间隔。

```javascript
(function() {
  window.addEventListener("scroll", scrollThrottler, false);

  var scrollTimeout;
  function scrollThrottler() {
    if ( !scrollTimeout ) {
      scrollTimeout = setTimeout(function() {
        scrollTimeout = null;
        actualScrollHandler();
      }, 66);
    }
  }

  function actualScrollHandler() {
    // ...
  }
}());
```

上面代码中，setTimeout指定scroll事件的监听函数，每66毫秒触发一次（每秒15次）。

**（2）resize事件**

resize事件在改变浏览器窗口大小时触发，发生在window、body、frameset对象上面。

```javascript
var resizeMethod = function(){
  if (document.body.clientWidth < 768) {
    console.log('移动设备');
  }
};

window.addEventListener("resize", resizeMethod, true);
```

该事件也会连续地大量触发，所以最好像上面的scroll事件一样，通过throttle函数控制事件触发频率。

### hashchange事件，popstate事件

以下事件与文档的URL变化相关。

**（1）hashchange事件**

hashchange事件在URL的hash部分（即#号后面的部分，包括#号）发生变化时触发。如果老式浏览器不支持该属性，可以通过定期检查location.hash属性，模拟该事件，下面就是代码。

```javascript
(function(window) {
  if ( "onhashchange" in window.document.body ) { return; }

  var location = window.location;
  var oldURL = location.href;
  var oldHash = location.hash;

  // 每隔100毫秒检查一下URL的hash
  setInterval(function() {
    var newURL = location.href;
    var newHash = location.hash;

    if ( newHash != oldHash && typeof window.onhashchange === "function" ) {
      window.onhashchange({
        type: "hashchange",
        oldURL: oldURL,
        newURL: newURL
      });

      oldURL = newURL;
      oldHash = newHash;
    }
  }, 100);

})(window);
```

hashchange事件对象除了继承Event对象，还有oldURL属性和newURL属性，分别表示变化前后的URL。

**（2）popstate事件**

popstate事件在浏览器的history对象的当前记录发生显式切换时触发。注意，调用history.pushState()或history.replaceState()，并不会触发popstate事件。该事件只在用户在history记录之间显式切换时触发，比如鼠标点击“后退/前进”按钮，或者在脚本中调用history.back()、history.forward()、history.go()时触发。

该事件对象有一个state属性，保存history.pushState方法和history.replaceState方法为当前记录添加的state对象。

```javascript
window.onpopstate = function(event) {
  console.log("state: " + event.state);
};
history.pushState({page: 1}, "title 1", "?page=1");
history.pushState({page: 2}, "title 2", "?page=2");
history.replaceState({page: 3}, "title 3", "?page=3");
history.back(); // state: {"page":1}
history.back(); // state: null
history.go(2);  // state: {"page":3}
```

上面代码中，pushState方法向history添加了两条记录，然后replaceState方法替换掉当前记录。因此，连续两次back方法，会让当前条目退回到原始网址，它没有附带state对象，所以事件的state属性为null，然后前进两条记录，又回到replaceState方法添加的记录。

浏览器对于页面首次加载，是否触发popstate事件，处理不一样，Firefox不触发该事件。

### cut事件，copy事件，paste事件

以下三个事件属于文本操作触发的事件。

- cut事件：在将选中的内容从文档中移除，加入剪贴板后触发。

- copy事件：在选中的内容加入剪贴板后触发。

- paste事件：在剪贴板内容被粘贴到文档后触发。

这三个事件都有一个clipboardData只读属性。该属性存放剪贴的数据，是一个DataTransfer对象，具体的API接口和操作方法，请参见《触摸事件》的DataTransfer对象章节。

### 焦点事件

焦点事件发生在Element节点和document对象上面，与获得或失去焦点相关。它主要包括以下四个事件。

- focus事件：Element节点获得焦点后触发，该事件不会冒泡。

- blur事件：Element节点失去焦点后触发，该事件不会冒泡。

- focusin事件：Element节点将要获得焦点时触发，发生在focus事件之前。该事件会冒泡。Firefox不支持该事件。

- focusout事件：Element节点将要失去焦点时触发，发生在blur事件之前。该事件会冒泡。Firefox不支持该事件。

这四个事件的事件对象，带有target属性（返回事件的目标节点）和relatedTarget属性（返回一个Element节点）。对于focusin事件，relatedTarget属性表示失去焦点的节点；对于focusout事件，表示将要接受焦点的节点；对于focus和blur事件，该属性返回null。

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

浏览器提供一个FocusEvent构造函数，可以用它生成焦点事件的实例。

```javascript
var focusEvent = new FocusEvent(typeArg, focusEventInit);
```

上面代码中，FocusEvent构造函数的第一个参数为事件类型，第二个参数是可选的配置对象，用来配置FocusEvent对象。

## 自定义事件和事件模拟

除了浏览器预定义的那些事件，用户还可以自定义事件，然后手动触发。

```javascript
// 新建事件实例
var event = new Event('build');

// 添加监听函数
elem.addEventListener('build', function (e) { ... }, false);

// 触发事件
elem.dispatchEvent(event);
```

上面代码触发了自定义事件，该事件会层层向上冒泡。在冒泡过程中，如果有一个元素定义了该事件的监听函数，该监听函数就会触发。

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

```javascript
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
```

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

### 事件的模拟

有时，需要在脚本中模拟触发某种类型的事件，这时就必须使用这种事件的构造函数。

下面是一个通过MouseEvent构造函数，模拟触发click鼠标事件的例子。

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

### 自定义事件的老式写法

老式浏览器不一定支持各种类型事件的构造函数。因此，有时为了兼容，会用到一些非标准的方法。这些方法未来会被逐步淘汰，但是目前浏览器还广泛支持。除非是为了兼容老式浏览器，尽量不要使用。

**（1）document.createEvent()**

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

**（2）event.initEvent()**

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

### 事件模拟的老式写法

事件模拟的非标准做法是，对document.createEvent方法生成的事件对象，使用对应的事件初始化方法进行初始化。比如，click事件对象属于MouseEvent对象，也属于UIEvent对象，因此要用initMouseEvent方法或initUIEvent方法进行初始化。

**（1）event.initMouseEvent()**

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

```javascript
var simulateDivClick = document.createEvent('MouseEvents');

simulateDivClick.initMouseEvent('click',true,true,
  document.defaultView,0,0,0,0,0,false,
  false,false,0,null,null
);

divElement.dispatchEvent(simulateDivClick);
```

**（2）UIEvent.initUIEvent()**

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
