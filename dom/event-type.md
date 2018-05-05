---
title: 事件种类
layout: page
category: dom
date: 2016-11-20
modifiedOn: 2016-11-20
---

浏览器支持大量的事件，本章介绍其中一些主要的事件。

## 鼠标事件

鼠标事件指与鼠标相关的事件，继承了`MouseEvent`接口。具体的事件主要有以下一些。

- `click`：按下鼠标（通常是按下主按钮）时触发。
- `dblclick`：在同一个元素上双击鼠标时触发。
- `mousedown`：按下鼠标键时触发。
- `mouseup`：释放按下的鼠标键时触发。
- `mousemove`：当鼠标在一个节点内部移动时触发。当鼠标持续移动时，该事件会连续触发。为了避免性能问题，建议对该事件的监听函数做一些限定，比如限定一段时间内只能运行一次。
- `mouseenter`：鼠标进入一个节点时触发，进入子节点不会触发这个事件（详见后文）。
- `mouseover`：鼠标进入一个节点时触发，进入子节点会再一次触发这个事件（详见后文）。
- `mouseout`：鼠标离开一个节点时触发，离开父节点也会触发这个事件（详见后文）。
- `mouseleave`：鼠标离开一个节点时触发，离开父节点不会触发这个事件（详见后文）。
- `contextmenu`：按下鼠标右键时（上下文菜单出现前）触发，或者按下“上下文菜单键”时触发。
- `wheel`：滚动鼠标的滚轮时触发，该事件继承的是`WheelEvent`接口。

`click`事件指的是，用户在同一个位置先完成`mousedown`动作，再完成`mouseup`动作。因此，触发顺序是，`mousedown`首先触发，`mouseup`接着触发，`click`最后触发。

`dblclick`事件则会在`mousedown`、`mouseup`、`click`之后触发。

`mouseover`事件和`mouseenter`事件，都是鼠标进入一个节点时触发。两者的区别是，`mouseenter`事件只触发一次，而只要鼠标在节点内部移动，`mouseover`事件会在子节点上触发多次。

```javascript
/* HTML 代码如下
 <ul>
   <li>item 1</li>
   <li>item 2</li>
  <li>item 3</li>
 </ul>
*/

var ul = document.querySelector('ul');

// 进入 ul 节点以后，mouseenter 事件只会触发一次
// 以后只要鼠标在节点内移动，都不会再触发这个事件
// event.target 是 ul 节点
ul.addEventListener('mouseenter', function (event) {
  event.target.style.color = 'purple';
  setTimeout(function () {
    event.target.style.color = '';
  }, 500);
}, false);

// 进入 ul 节点以后，只要在子节点上移动，mouseover 事件会触发多次
// event.target 是 li 节点
ul.addEventListener('mouseover', function (event) {
  event.target.style.color = 'orange';
  setTimeout(function () {
    event.target.style.color = '';
  }, 500);
}, false);
```

上面代码中，在父节点内部进入子节点，不会触发`mouseenter`事件，但是会触发`mouseover`事件。

`mouseout`事件和`mouseleave`事件，都是鼠标离开一个节点时触发。两者的区别是，在父元素内部离开一个子元素时，`mouseleave`事件不会触发，而`mouseout`事件会触发。

```javascript
/* HTML 代码如下
 <ul>
   <li>item 1</li>
   <li>item 2</li>
  <li>item 3</li>
 </ul>
*/

var ul = document.querySelector('ul');

// 先进入 ul 节点，然后在节点内部移动，不会触发 mouseleave 事件
// 只有离开 ul 节点时，触发一次 mouseleave
// event.target 是 ul 节点
ul.addEventListener('mouseleave', function (event) {
  event.target.style.color = 'purple';
  setTimeout(function () {
    event.target.style.color = '';
  }, 500);
}, false);

// 先进入 ul 节点，然后在节点内部移动，mouseout 事件会触发多次
// event.target 是 li 节点
ul.addEventListener('mouseout', function (event) {
  event.target.style.color = 'orange';
  setTimeout(function () {
    event.target.style.color = '';
  }, 500);
}, false);
```

上面代码中，在父节点内部离开子节点，不会触发`mouseleave`事件，但是会触发`mouseout`事件。

## MouseEvent 接口概述

`MouseEvent`接口代表了鼠标相关的事件，单击（click）、双击（dblclick）、松开鼠标键（mouseup）、按下鼠标键（mousedown）等动作，所产生的事件对象都是`MouseEvent`实例。此外，滚轮事件和拖拉事件也是`MouseEvent`实例。

`MouseEvent`接口继承了`Event`接口，所以拥有`Event`的所有属性和方法。它还有自己的属性和方法。

浏览器原生提供一个`MouseEvent`构造函数，用于新建一个`MouseEvent`实例。

```javascript
var event = new MouseEvent(type, options);
```

`MouseEvent`构造函数接受两个参数。第一个参数是字符串，表示事件名称；第二个参数是一个事件配置对象，该参数可选。除了`Event`接口的实例配置属性，该对象可以配置以下属性，所有属性都是可选的。

- `screenX`：数值，鼠标相对于屏幕的水平位置（单位像素），默认值为0，设置该属性不会移动鼠标。
- `screenY`：数值，鼠标相对于屏幕的垂直位置（单位像素），其他与`screenX`相同。
- `clientX`：数值，鼠标相对于程序窗口的水平位置（单位像素），默认值为0，设置该属性不会移动鼠标。
- `clientY`：数值，鼠标相对于程序窗口的垂直位置（单位像素），其他与`clientX`相同。
- `ctrlKey`：布尔值，是否同时按下了 Ctrl 键，默认值为`false`。
- `shiftKey`：布尔值，是否同时按下了 Shift 键，默认值为`false`。
- `altKey`：布尔值，是否同时按下 Alt 键，默认值为`false`。
- `metaKey`：布尔值，是否同时按下 Meta 键，默认值为`false`。
- `button`：数值，表示按下了哪一个鼠标按键，默认值为`0`，表示按下主键（通常是鼠标的左键）或者当前事件没有定义这个属性；`1`表示按下辅助键（通常是鼠标的中间键），`2`表示按下次要键（通常是鼠标的右键）。
- `buttons`：数值，表示按下了鼠标的哪些键，是一个三个比特位的二进制值，默认为`0`（没有按下任何键）。`1`（二进制`001`）表示按下主键（通常是左键），`2`（二进制`010`）表示按下次要键（通常是右键），`4`（二进制`100`）表示按下辅助键（通常是中间键）。因此，如果返回`3`（二进制`011`）就表示同时按下了左键和右键。
- `relatedTarget`：节点对象，表示事件的相关节点，默认为`null`。`mouseenter`和`mouseover`事件时，表示鼠标刚刚离开的那个元素节点；`mouseout`和`mouseleave`事件时，表示鼠标正在进入的那个元素节点。

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

## MouseEvent 接口的实例属性

### MouseEvent.altKey，MouseEvent.ctrlKey，MouseEvent.metaKey，MouseEvent.shiftKey

`MouseEvent.altKey`、`MouseEvent.ctrlKey`、`MouseEvent.metaKey`、`MouseEvent.shiftKey`这四个属性都返回一个布尔值，表示事件发生时，是否按下对应的键。它们都是只读属性。

- `altKey`属性：Alt 键
- `ctrlKey`属性：Ctrl 键
- `metaKey`属性：Meta 键（Mac 键盘是一个四瓣的小花，Windows 键盘是 Windows 键）
- `shiftKey`属性：Shift 键

```javascript
// HTML 代码如下
// <body onclick="showKey(event)">
function showKey(e) {
  console.log('ALT key pressed: ' + e.altKey);
  console.log('CTRL key pressed: ' + e.ctrlKey);
  console.log('META key pressed: ' + e.metaKey);
  console.log('SHIFT key pressed: ' + e.shiftKey);
}
```

上面代码中，点击网页会输出是否同时按下对应的键。

### MouseEvent.button，MouseEvent.buttons

`MouseEvent.button`属性返回一个数值，表示事件发生时按下了鼠标的哪个键。该属性只读。

- 0：按下主键（通常是左键），或者该事件没有初始化这个属性（比如`mousemove`事件）。
- 1：按下辅助键（通常是中键或者滚轮键）。
- 2：按下次键（通常是右键）。

```javascript
// HTML 代码为
// <button onmouseup="whichButton(event)">点击</button>
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

`MouseEvent.buttons`属性返回一个三个比特位的值，表示同时按下了哪些键。它用来处理同时按下多个鼠标键的情况。该属性只读。

- 1：二进制为`001`（十进制的1），表示按下左键。
- 2：二进制为`010`（十进制的2），表示按下右键。
- 4：二进制为`100`（十进制的4），表示按下中键或滚轮键。

同时按下多个键的时候，每个按下的键对应的比特位都会有值。比如，同时按下左键和右键，会返回3（二进制为011）。

### MouseEvent.clientX，MouseEvent.clientY

`MouseEvent.clientX`属性返回鼠标位置相对于浏览器窗口左上角的水平坐标（单位像素），`MouseEvent.clientY`属性返回垂直坐标。这两个属性都是只读属性。

```javascript
// HTML 代码为
// <body onmousedown="showCoords(event)">
function showCoords(evt){
  console.log(
    'clientX value: ' + evt.clientX + '\n' +
    'clientY value: ' + evt.clientY + '\n'
  );
}
```

这两个属性还分别有一个别名`MouseEvent.x`和`MouseEvent.y`。

### MouseEvent.movementX，MouseEvent.movementY

`MouseEvent.movementX`属性返回当前位置与上一个`mousemove`事件之间的水平距离（单位像素）。数值上，它等于下面的计算公式。

```javascript
currentEvent.movementX = currentEvent.screenX - previousEvent.screenX
```

`MouseEvent.movementY`属性返回当前位置与上一个`mousemove`事件之间的垂直距离（单位像素）。数值上，它等于下面的计算公式。

```javascript
currentEvent.movementY = currentEvent.screenY - previousEvent.screenY。
```

这两个属性都是只读属性。

### MouseEvent.screenX，MouseEvent.screenY

`MouseEvent.screenX`属性返回鼠标位置相对于屏幕左上角的水平坐标（单位像素），`MouseEvent.screenY`属性返回垂直坐标。这两个属性都是只读属性。

```javascript
// HTML 代码如下
// <body onmousedown="showCoords(event)">
function showCoords(evt) {
  console.log(
    'screenX value: ' + evt.screenX + '\n'
    'screenY value: ' + evt.screenY + '\n'
  );
}
```

### MouseEvent.offsetX，MouseEvent.offsetY

`MouseEvent.offsetX`属性返回鼠标位置与目标节点左侧的`padding`边缘的水平距离（单位像素），`MouseEvent.offsetY`属性返回与目标节点上方的`padding`边缘的垂直距离。这两个属性都是只读属性。

```javascript
/* HTML 代码如下
  <style>
    p {
      width: 100px;
      height: 100px;
      padding: 100px;
    }
  </style>
  <p>Hello</p>
*/
var p = document.querySelector('p');
p.addEventListener(
  'click',
  function (e) {
    console.log(e.offsetX);
    console.log(e.offsetY);
  },
  false
);
```

上面代码中，鼠标如果在`p`元素的中心位置点击，会返回`150 150`。因此中心位置距离左侧和上方的`padding`边缘，等于`padding`的宽度（100像素）加上元素内容区域一半的宽度（50像素）。

### MouseEvent.pageX，MouseEvent.pageY

`MouseEvent.pageX`属性返回鼠标位置与文档左侧边缘的距离（单位像素），`MouseEvent.pageY`属性返回与文档上侧边缘的距离（单位像素）。它们的返回值都包括文档不可见的部分。这两个属性都是只读。

```javascript
/* HTML 代码如下
  <style>
    body {
      height: 2000px;
    }
  </style>
*/
document.body.addEventListener(
  'click',
  function (e) {
    console.log(e.pageX);
    console.log(e.pageY);
  },
  false
);
```

上面代码中，页面高度为2000像素，会产生垂直滚动条。滚动到页面底部，点击鼠标输出的`pageY`值会接近2000。

### MouseEvent.relatedTarget

`MouseEvent.relatedTarget`属性返回事件的相关节点。对于那些没有相关节点的事件，该属性返回`null`。该属性只读。

下表列出不同事件的`target`属性值和`relatedTarget`属性值义。

|事件名称 |target 属性 |relatedTarget 属性 |
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
/*
  HTML 代码如下
  <div id="outer" style="height:50px;width:50px;border-width:1px solid black;">
    <div id="inner" style="height:25px;width:25px;border:1px solid black;"></div>
  </div>
*/

var inner = document.getElementById('inner');
inner.addEventListener('mouseover', function (event) {
  console.log('进入' + event.target.id + ' 离开' + event.relatedTarget.id);
}, false);
inner.addEventListener('mouseenter', function (event) {
  console.log('进入' + event.target.id + ' 离开' + event.relatedTarget.id);
});
inner.addEventListener('mouseout', function () {
  console.log('离开' + event.target.id + ' 进入' + event.relatedTarget.id);
});
inner.addEventListener("mouseleave", function (){
  console.log('离开' + event.target.id + ' 进入' + event.relatedTarget.id);
});

// 鼠标从 outer 进入inner，输出
// 进入inner 离开outer
// 进入inner 离开outer

// 鼠标从 inner进入 outer，输出
// 离开inner 进入outer
// 离开inner 进入outer
```

## MouseEvent 接口的实例方法

### MouseEvent.getModifierState()

`MouseEvent.getModifierState`方法返回一个布尔值，表示有没有按下特定的功能键。它的参数是一个表示[功能键](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState#Modifier_keys_on_Gecko)的字符串。

```javascript
document.addEventListener('click', function (e) {
  console.log(e.getModifierState('CapsLock'));
}, false);
```

上面的代码可以了解用户是否按下了大写键。

## WheelEvent 接口

### 概述

WheelEvent 接口继承了 MouseEvent 实例，代表鼠标滚轮事件的实例对象。目前，鼠标滚轮相关的事件只有一个`wheel`事件，用户滚动鼠标的滚轮，就生成这个事件的实例。

浏览器原生提供`WheelEvent()`构造函数，用来生成`WheelEvent`实例。

```javascript
var wheelEvent = new WheelEvent(type, options);
```

`WheelEvent()`构造函数可以接受两个参数，第一个是字符串，表示事件类型，对于滚轮事件来说，这个值目前只能是`wheel`。第二个参数是事件的配置对象。该对象的属性除了`Event`、`UIEvent`的配置属性以外，还可以接受以下几个属性，所有属性都是可选的。

- `deltaX`：数值，表示滚轮的水平滚动量，默认值是 0.0。
- `deltaY`：数值，表示滚轮的垂直滚动量，默认值是 0.0。
- `deltaZ`：数值，表示滚轮的 Z 轴滚动量，默认值是 0.0。
- `deltaMode`：数值，表示相关的滚动事件的单位，适用于上面三个属性。`0`表示滚动单位为像素，`1`表示单位为行，`2`表示单位为页，默认为`0`。

### 实例属性

`WheelEvent`事件实例除了具有`Event`和`MouseEvent`的实例属性和实例方法，还有一些自己的实例属性，但是没有自己的实例方法。

下面的属性都是只读属性。

- `WheelEvent.deltaX`：数值，表示滚轮的水平滚动量。
- `WheelEvent.deltaY`：数值，表示滚轮的垂直滚动量。
- `WheelEvent.deltaZ`：数值，表示滚轮的 Z 轴滚动量。
- `WheelEvent.deltaMode`：数值，表示上面三个属性的单位，`0`是像素，`1`是行，`2`是页。

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

## KeyboardEvent 接口

`KeyboardEvent`接口用来描述用户与键盘的互动。这个接口继承了`Event`接口，并且定义了自己的实例属性和实例方法。

浏览器原生提供`KeyboardEvent`构造函数，用来新建键盘事件的实例。

```javascript
new KeyboardEvent(type, options)
```

`KeyboardEvent`构造函数接受两个参数。第一个参数是字符串，表示事件类型；第二个参数是一个事件配置对象，该参数可选。除了`Event`接口提供的属性，还可以配置以下字段，它们都是可选。

- `key`：字符串，当前按下的键，默认为空字符串。
- `code`：字符串，表示当前按下的键的字符串形式，默认为空字符串。
- `location`：整数，当前按下的键的位置，默认为`0`。
- `ctrlKey`：布尔值，是否按下 Ctrl 键，默认为`false`。
- `shiftKey`：布尔值，是否按下 Shift 键，默认为`false`。
- `altKey`：布尔值，是否按下 Alt 键，默认为`false`。
- `metaKey`：布尔值，是否按下 Meta 键，默认为`false`。
- `repeat`：布尔值，是否重复按键，默认为`false`。

## KeyboardEvent 的实例属性

### KeyboardEvent.altKey，KeyboardEvent.metaKey.ctrlKey，KeyboardEvent.metaKey，KeyboardEvent.shiftKey

以下属性都是只读属性，返回一个布尔值，表示是否按下对应的键。

- `KeyboardEvent.altKey`：是否按下 Alt 键
- `KeyboardEvent.ctrlKey`：是否按下 Ctrl 键
- `KeyboardEvent.metaKey`：是否按下 meta 键（Mac 系统是一个四瓣的小花，Windows 系统是 windows 键）
- `KeyboardEvent.shiftKey`：是否按下 Shift 键

下面是一个示例。

```javascript
function showChar(e){
  console.log("ALT: " + e.altKey);
  console.log("CTRL: " + e.ctrlKey);
  console.log("Meta: " + e.metaKey);
  console.log("Meta: " + e.shiftKey);
}

document.body.addEventListener('click', showChar, false);
```

### KeyboardEvent.code

`KeyboardEvent.code`属性返回一个字符串，表示当前按下的键的字符串形式。该属性只读。

下面是一些常用键的字符串形式，其他键请查[文档](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code#Code_values)。

- 数字键0 - 9：返回`digital0` - `digital9`
- 字母键A - z：返回`KeyA` - `KeyZ`
- 功能键F1 - F12：返回 `F1` - `F12`
- 方向键：返回`ArrowDown`、`ArrowUp`、`ArrowLeft`、`ArrowRight`
- Alt 键：返回`AltLeft`或`AltRight`
- Shift 键：返回`ShiftLeft`或`ShiftRight`
- Ctrl 键：返回`ControLeft`或`ControlRight`

### KeyboardEvent.key

`KeyboardEvent.key`属性返回一个字符串，表示按下的键名。该属性只读。

如果按下的键代表可打印字符，则返回这个字符，比如数字、字母。

如果按下的键代表不可打印的特殊字符，则返回预定义的键值，比如 Backspace，Tab，Enter，Shift，Control，Alt，CapsLock，Esc，Spacebar，PageUp，PageDown，End，Home，Left，Right，Up，Down，PrintScreen，Insert，Del，Win，F1～F12，NumLock，Scroll 等。

如果同时按下一个控制键和一个符号键，则返回符号键的键名。比如，按下 Ctrl + a，则返回`a`；按下 Shift + a，则返回大写的`A`。

如果无法识别键名，返回字符串`Unidentified`。

### KeyboardEvent.location

`KeyboardEvent.location`属性返回一个整数，表示按下的键处在键盘的哪一个区域。它可能取以下值。

- 0：处在键盘的主区域，或者无法判断处于哪一个区域。
- 1：处在键盘的左侧，只适用那些有两个位置的键（比如 Ctrl 和 Shift 键）。
- 2：处在键盘的右侧，只适用那些有两个位置的键（比如 Ctrl 和 Shift 键）。
- 3：处在数字小键盘。

### KeyboardEvent.repeat

`KeyboardEvent.repeat`返回一个布尔值，代表该键是否被按着不放，以便判断是否重复这个键，即浏览器会持续触发`keydown`和`keypress`事件，直到用户松开手为止。

## KeyboardEvent 的实例方法

### KeyboardEvent.getModifierState()

`KeyboardEvent.getModifierState()`方法返回一个布尔值，表示是否按下或激活指定的功能键。它的常用参数如下。

- `Alt`：Alt 键
- `CapsLock`：大写锁定键
- `Control`：Ctrl 键
- `Meta`：Meta 键
- `NumLock`：数字键盘开关键
- `Shift`：Shift 键

```javascript
if (
  event.getModifierState('Control') +
  event.getModifierState('Alt') +
  event.getModifierState('Meta') > 1
) {
  return;
}
```

上面代码表示，只要`Control`、`Alt`、`Meta`里面，同时按下任意两个或两个以上的键就返回。

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

```javascript
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

- **dragend事件**：拖拉结束时（释放鼠标键或按下escape键）在被拖拉的节点上触发，该事件的target属性是被拖拉的节点。它与dragstart事件，在同一个节点上触发。不管拖拉是否跨窗口，或者中途被取消，dragend事件总是会触发的。

- **dragenter事件**：拖拉进入当前节点时，在当前节点上触发，该事件的target属性是当前节点。通常应该在这个事件的监听函数中，指定是否允许在当前节点放下（drop）拖拉的数据。如果当前节点没有该事件的监听函数，或者监听函数不执行任何操作，就意味着不允许在当前节点放下数据。在视觉上显示拖拉进入当前节点，也是在这个事件的监听函数中设置。

- **dragover事件**：拖拉到当前节点上方时，在当前节点上持续触发，该事件的target属性是当前节点。该事件与dragenter事件基本类似，默认会重置当前的拖拉事件的效果（DataTransfer对象的dropEffect属性）为none，即不允许放下被拖拉的节点，所以如果允许在当前节点drop数据，通常会使用preventDefault方法，取消重置拖拉效果为none。

- **dragleave事件**：拖拉离开当前节点范围时，在当前节点上触发，该事件的target属性是当前节点。在视觉上显示拖拉离开当前节点，就在这个事件的监听函数中设置。

- **drop事件**：被拖拉的节点或选中的文本，释放到目标节点时，在目标节点上触发。注意，如果当前节点不允许drop，即使在该节点上方松开鼠标键，也不会触发该事件。如果用户按下Escape键，取消这个操作，也不会触发该事件。该事件的监听函数负责取出拖拉数据，并进行相关处理。

关于拖拉事件，有以下几点注意事项。

- 拖拉过程只触发以上这些拖拉事件，尽管鼠标在移动，但是鼠标事件不会触发。

- 将文件从操作系统拖拉进浏览器，不会触发`dragstart`和`dragend`事件。

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
  event.target.style.opacity = 0.5;
  // 兼容Firefox
  event.dataTransfer.setData('text/plain', 'anything');
}, false);

document.addEventListener('dragend', function( event ) {
  // 被拖拉节点的背景色恢复正常
  event.target.style.opacity = '';
}, false);

document.addEventListener('dragover', function( event ) {
  // 防止拖拉效果被重置，允许被拖拉的节点放入目标节点
  event.preventDefault();
}, false);

document.addEventListener('dragenter', function( event ) {
  // 目标节点的背景色变紫色
  // 由于该事件会冒泡，所以要过滤节点
  if ( event.target.className == 'dropzone' ) {
    event.target.style.background = 'purple';
  }
}, false);

document.addEventListener('dragleave', function( event ) {
  // 目标节点的背景色恢复原样
  if ( event.target.className == 'dropzone' ) {
    event.target.style.background = "";
  }
}, false);

document.addEventListener('drop', function( event ) {
  // 防止事件默认行为（比如某些Elment节点上可以打开链接）
  event.preventDefault();
  if ( event.target.className === 'dropzone' ) {
    // 恢复目标节点背景色
    event.target.style.background = '';
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

dropEffect属性一般在dragenter和dragover事件的监听函数中设置，对于dragstart、drag、dragleave这三个事件，该属性不起作用。进入目标节点后，拖拉行为会初始化成用户设定的效果，用户可以通过按下Shift键和Control键，改变初始设置，在copy、move、link三种效果中切换。

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

```html
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

## 触摸操作概述

浏览器的触摸 API 由三个部分组成。

- Touch：一个触摸点
- TouchList：多个触摸点的集合
- TouchEvent：触摸引发的事件实例

`Touch`接口的实例对象用来触摸点（一根手指或者一根触摸笔），包括位置、大小、形状、压力、目标元素等属性。有时，触摸动作由多个触摸点（多根手指）组成，多个触摸点的集合由`TouchList`接口的实例对象表示。`TouchEvent`接口的实例对象代表由触摸引发的事件，只有触摸屏才会引发这一类事件。

很多时候，触摸事件和鼠标事件同时触发，即使这个时候并没有用到鼠标。这是为了让那些只定义鼠标事件、没有定义触摸事件的代码，在触摸屏的情况下仍然能用。如果想避免这种情况，可以用`event.preventDefault`方法阻止发出鼠标事件。

## Touch 接口

### Touch 接口概述

Touch 接口代表单个触摸点。触摸点可能是一根手指，也可能是一根触摸笔。

浏览器原生提供`Touch`构造函数，用来生成`Touch`实例。

```javascript
var touch = new Touch(touchOptions);
```

`Touch`构造函数接受一个配置对象作为参数，它有以下属性。

- `identifier`：必需，类型为整数，表示触摸点的唯一 ID。
- `target`：必需，类型为元素节点，表示触摸点开始时所在的网页元素。
- `clientX`：可选，类型为数值，表示触摸点相对于浏览器窗口左上角的水平距离，默认为0。
- `clientY`：可选，类型为数值，表示触摸点相对于浏览器窗口左上角的垂直距离，默认为0。
- `screenX`：可选，类型为数值，表示触摸点相对于屏幕左上角的水平距离，默认为0。
- `screenY`：可选，类型为数值，表示触摸点相对于屏幕左上角的垂直距离，默认为0。
- `pageX`：可选，类型为数值，表示触摸点相对于网页左上角的水平位置（即包括页面的滚动距离），默认为0。
- `pageY`：可选，类型为数值，表示触摸点相对于网页左上角的垂直位置（即包括页面的滚动距离），默认为0。
- `radiusX`：可选，类型为数值，表示触摸点周围受到影响的椭圆范围的 X 轴半径，默认为0。
- `radiusY`：可选：类型为数值，表示触摸点周围受到影响的椭圆范围的 Y 轴半径，默认为0。
- `rotationAngle`：可选，类型为数值，表示触摸区域的椭圆的旋转角度，单位为度数，在0到90度之间，默认值为0。
- `force`：可选，类型为数值，范围在`0`到`1`之间，表示触摸压力。`0`代表没有压力，`1`代表硬件所能识别的最大压力，默认为`0`。

### Touch 接口的实例属性

**（1）Touch.identifier**

`Touch.identifier`属性返回一个整数，表示触摸点的唯一 ID。这个值在整个触摸过程保持不变，直到触摸事件结束。

```javascript
someElement.addEventListener('touchmove', function (e) {
  for (var i = 0; i < e.changedTouches.length; i++) {
    console.log(e.changedTouches[i].identifier);
  }
}, false);
```

**（2）Touch.screenX，Touch.screenY，Touch.clientX，Touch.clientY，pageX，pageY**

`Touch.screenX`属性和`Touch.screenY`属性，分别表示触摸点相对于屏幕左上角的横坐标和纵坐标，与页面是否滚动无关。

`Touch.clientX`属性和`Touch.clientY`属性，分别表示触摸点相对于浏览器视口左上角的横坐标和纵坐标，与页面是否滚动无关。

`Touch.pageX`属性和`Touch.pageY`属性，分别表示触摸点相对于当前页面左上角的横坐标和纵坐标，包含了页面滚动带来的位移。

**（3）Touch.radiusX，Touch.radiusY，Touch.rotationAngle**

`Touch.radiusX`属性和`Touch.radiusY`属性，分别返回触摸点周围受到影响的椭圆范围的 X 轴半径和 Y 轴半径，单位为像素。乘以 2 就可以得到触摸范围的宽度和高度。

`Touch.rotationAngle`属性表示触摸区域的椭圆的旋转角度，单位为度数，在`0`到`90`度之间。

上面这三个属性共同定义了用户与屏幕接触的区域，对于描述手指这一类非精确的触摸，很有帮助。指尖接触屏幕，触摸范围会形成一个椭圆，这三个属性就用来描述这个椭圆区域。

下面是一个示例。

```javascript
div.addEventListener('touchstart', rotate);
div.addEventListener('touchmove', rotate);
div.addEventListener('touchend', rotate);

function rotate(e) {
  var touch = e.changedTouches.item(0);
  e.preventDefault();

  src.style.width = touch.radiusX * 2 + 'px';
  src.style.height = touch.radiusY * 2 + 'px';
  src.style.transform = 'rotate(' + touch.rotationAngle + 'deg)';
};
```

**（4）Touch.force**

`Touch.force`属性返回一个`0`到`1`之间的数值，表示触摸压力。`0`代表没有压力，`1`代表硬件所能识别的最大压力。

**（5）Touch.target**

`Touch.target`属性返回一个元素节点，代表触摸发生时所在的那个元素节点。即使触摸点已经离开了这个节点，该属性依然不变。

## TouchList 接口

`TouchList`接口表示一组触摸点的集合。它的实例是一个类似数组的对象，成员是`Touch`的实例对象，表示所有触摸点。用户用三根手指触摸，产生的`TouchList`实例就会包含三个成员，每根手指的触摸点对应一个`Touch`实例对象。

它的实例主要通过触摸事件的`TouchEvent.touches`、`TouchEvent.changedTouches`、`TouchEvent.targetTouches`这几个属性获取。

它的实例属性和实例方法只有两个。

- `TouchList.length`：数值，表示成员数量（即触摸点的数量）。
- `TouchList.item()`：返回指定位置的成员，它的参数是该成员的位置编号（从零开始）。

## TouchEvent 接口

### 概述

TouchEvent 接口继承了 Event 接口，表示由触摸引发的事件实例，通常来自触摸屏或轨迹板。除了被继承的属性以外，它还有一些自己的属性。

浏览器原生提供`TouchEvent()`构造函数，用来生成触摸事件的实例。

```javascript
new TouchEvent(type, options)
```

`TouchEvent()`构造函数可以接受两个参数，第一个参数是字符串，表示事件类型；第二个参数是事件的配置对象，该参数是可选的，对象的所有属性也是可选的。除了`Event`接口的配置属性，该接口还有一些自己的配置属性。

- `touches`：`TouchList`实例，代表所有的当前处于活跃状态的触摸点，默认值是一个空数组`[]`。
- `targetTouches`：`TouchList`实例，代表所有处在触摸的目标元素节点内部、且仍然处于活动状态的触摸点，默认值是一个空数组`[]`。
- `changedTouches`：`TouchList`实例，代表本次触摸事件的相关触摸点，默认值是一个空数组`[]`。
- `ctrlKey`：布尔值，表示 Ctrl 键是否同时按下，默认值为`false`。
- `shiftKey`：布尔值，表示 Shift 键是否同时按下，默认值为`false`。
- `altKey`：布尔值，表示 Alt 键是否同时按下，默认值为`false`。
- `metaKey`：布尔值，表示 Meta 键（或 Windows 键）是否同时按下，默认值为`false`。

### 实例属性

TouchEvent 接口的实例具有`Event`实例的所有属性和方法，此外还有一些它自己的实例属性，这些属性全部都是只读。

**（1）TouchEvent.altKey，TouchEvent.ctrlKey，TouchEvent.shiftKey，TouchEvent.metaKey**

- `TouchEvent.altKey`：布尔值，表示触摸时是否按下了 Alt 键。
- `TouchEvent.ctrlKey`：布尔值，表示触摸时是否按下了 Ctrl 键。
- `TouchEvent.shiftKey`：布尔值：表示触摸时是否按下了 Shift 键。
- `TouchEvent.metaKey`：布尔值，表示触摸时是否按下了 Meta 键（或 Windows 键）。

下面是一个示例。

```javascript
someElement.addEventListener('touchstart', function (e) {
  console.log('altKey = ' + e.altKey);
  console.log('ctrlKey = ' + e.ctrlKey);
  console.log('metaKey = ' + e.metaKey);
  console.log('shiftKey = ' + e.shiftKey);
}, false);
```

**（2）TouchEvent.changedTouches**

`TouchEvent.changedTouches`属性返回一个`TouchList`实例，成员是一组`Touch`实例对象，表示本次触摸事件的相关触摸点。

对于不同的时间，该属性的含义有所不同。

- `touchstart`事件：被激活的触摸点
- `touchmove`事件：发生变化的触摸点
- `touchend`事件：消失的触摸点（即不再被触碰的点）

下面是一个示例。

```javascript
someElement.addEventListener('touchmove', function (e) {
  for (var i = 0; i < e.changedTouches.length; i++) {
    console.log(e.changedTouches[i].identifier);
  }
}, false);
```

**（3）TouchEvent.touches**

`TouchEvent.touches`属性返回一个`TouchList`实例，成员是所有仍然处于活动状态（即触摸中）的触摸点。一般来说，一个手指就是一个触摸点。

下面是一个示例。

```javascript
someElement.addEventListener('touchstart', function (e) {
  switch (e.touches.length) {
    // 一根手指触摸
    case 1: handle_one_touch(e); break;
    // 两根手指触摸
    case 2: handle_two_touches(e); break;
    // 三根手指触摸
    case 3: handle_three_touches(e); break;
    // 其他情况
    default: console.log('Not supported'); break;
  }
}, false);
```

**（4）TouchEvent.targetTouches**

`TouchEvent.targetTouches`属性返回一个`TouchList`实例，成员是触摸事件的目标元素节点内部、所有仍然处于活动状态（即触摸中）的触摸点。

```javascript
function touches_in_target(ev) {
  return (ev.touches.length === ev.targetTouches.length ? true : false);
}
```

上面代码用来判断，是否所有触摸点都在目标元素内。

## 触摸事件的种类

触摸引发的事件，有以下几种。可以通过`TouchEvent.type`属性，查看到底发生的是哪一种事件。

- `touchstart`：用户开始触摸时触发，它的`target`属性返回发生触摸的元素节点。
- `touchend`：用户不再接触触摸屏时（或者移出屏幕边缘时）触发，它的`target`属性与`touchstart`事件一致的，就是开始触摸时所在的元素节点。它的`changedTouches`属性返回一个`TouchList`实例，包含所有不再触摸的触摸点（即`Touch`实例对象）。
- `touchmove`：用户移动触摸点时触发，它的`target`属性与`touchstart`事件一致。如果触摸的半径、角度、力度发生变化，也会触发该事件。
- `touchcancel`：触摸点取消时触发，比如在触摸区域跳出一个情态窗口（modal window）、触摸点离开了文档区域（进入浏览器菜单栏）、用户的触摸点太多，超过了支持的上限（自动取消早先的触摸点）。

下面是一个例子。

```javascript
var el = document.getElementsByTagName('canvas')[0];
el.addEventListener('touchstart', handleStart, false);
el.addEventListener('touchmove', handleMove, false);

function handleStart(evt) {
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
    var touch = touches[i];
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

`beforeunload`事件在窗口将要关闭，或者网页（即`document`对象）将要卸载时触发。它可以用来防止用户不小心关闭网页。

根据标准，只要在该事件的回调函数中，调用了`event.preventDefault()`，或者`event.returnValue`属性的值是一个非空的值，就会自动跳出一个确认框，让用户确认是否关闭网页。如果用户点击“取消”按钮，网页就不会关闭。`event.returnValue`属性的值，会显示在确认对话框之中。

```javascript
window.addEventListener('beforeunload', function( event ) {
  event.returnValue = '你确认要离开吗？';
});

window.addEventListener('beforeunload', function( event ) {
  event.preventDefault();
});
```

但是，浏览器的行为很不一致，Chrome就不遵守`event.preventDefault()`，还是会关闭窗口，而IE需要显式返回一个非空的字符串。而且，大多数浏览器在对话框中不显示指定文本，只显示默认文本。因此，可以采用下面的写法，取得最大的兼容性。

```javascript
window.addEventListener('beforeunload', function (e) {
  var confirmationMessage = '确认关闭窗口？';

  e.returnValue = confirmationMessage;
  return confirmationMessage;
});
```

需要特别注意的是，许多手机浏览器默认忽视这个事件，而桌面浏览器也可以这样设置，所以这个事件有可能根本不生效。所以，不能依赖它来阻止用户关闭窗口。

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

`scroll`事件在文档或文档元素滚动时触发，主要出现在用户拖动滚动条。

```javascript
window.addEventListener('scroll', callback);
```

由于该事件会连续地大量触发，所以它的监听函数之中不应该有非常耗费计算的操作。推荐的做法是使用`requestAnimationFrame`或`setTimeout`控制该事件的触发频率，然后可以结合`customEvent`抛出一个新事件。

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
  throttle('scroll', 'optimizedScroll');
})();

window.addEventListener('optimizedScroll', function() {
  console.log("Resource conscious scroll callback!");
});
```

上面代码中，`throttle`函数用于控制事件触发频率，`requestAnimationFrame`方法保证每次页面重绘（每秒60次），只会触发一次`scroll`事件的监听函数。也就是说，上面方法将`scroll`事件的触发频率，限制在每秒60次。

改用`setTimeout`方法，可以放置更大的时间间隔。

```javascript
(function() {
  window.addEventListener('scroll', scrollThrottler, false);

  var scrollTimeout;
  function scrollThrottler() {
    if (!scrollTimeout) {
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

上面代码中，`setTimeout`指定`scroll`事件的监听函数，每66毫秒触发一次（每秒15次）。

下面是一个更一般的`throttle`函数的写法。

```javascript
function throttle(fn, wait) {
  var time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  }
}

window.addEventListener('scroll', throttle(callback, 1000));
```

上面的代码将`scroll`事件的触发频率，限制在一秒一次。

`lodash`函数库提供了现成的`throttle`函数，可以直接引用。

```javascript
window.addEventListener('scroll', _.throttle(callback, 1000));
```

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
