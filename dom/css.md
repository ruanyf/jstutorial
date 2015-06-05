---
title: CSS操作
layout: page
category: dom
date: 2013-07-05
modifiedOn: 2014-01-31
---

CSS与JavaScript是两个有着明确分工的领域，前者负责页面的视觉效果，后者负责与用户的行为互动。但是，它们毕竟同属网页开发的前端，因此不可避免有着交叉和互相配合。本节介绍如果通过JavaScript操作CSS。

## HTML元素的style属性

操作Element节点的CSS样式，最简单的方法之一就是使用节点对象的getAttribute方法、setAttribute方法和removeAttribute方法，读写或删除HTML元素的style属性。

```javascript
div.setAttribute('style',
  'background-color:red;'
  + 'border:1px solid black;');
```

## Element节点的style属性

### 基本用法

Element节点本身还提供style属性，用来操作CSS样式。

style属性指向一个对象，用来读写页面元素的行内CSS样式。

```javascript
var divStyle = document.querySelector('div').style;

divStyle.backgroundColor = 'red';
divStyle.border = '1px solid black';
divStyle.width = '100px';
divStyle.height = '100px';

divStyle.backgroundColor // red
divStyle.border // 1px solid black
divStyle.height // 100px
divStyle.width // 100px
```

从上面代码可以看到，style对象的属性与CSS规则名一一对应，但是需要改写。具体规则是将横杠从CSS属性名中去除，然后将横杠后的第一个字母大写，比如background-color写成backgroundColor。如果CSS属性名是JavaScript保留字，则规则名之前需要加上字符串“css”，比如float写成cssFloat。

注意，style对象的属性值都是字符串，而且包括单位。所以，divStyle.width不能设置为100，而要设置为'100px'。

### cssText属性

style对象的cssText可以用来读写或删除整个style属性。

```javascript
divStyle.cssText = 'background-color:red;'
  + 'border:1px solid black;'
  + 'height:100px;'
  + 'width:100px;';
```

注意，cssText对应的是HTML元素的style属性，所以不用改写CSS属性名。

### CSS模块的侦测

CSS的规格发展太快，新的模块层出不穷。不同浏览器的不同版本，对CSS模块的支持情况都不一样。有时候，需要知道当前浏览器是否支持某个模块，这就叫做“CSS模块的侦测”。

一个比较普遍适用的方法是，判断某个DOM元素的style对象的某个属性值是否为字符串。

```javascript
typeof element.style.animationName === 'string';
typeof element.style.transform === 'string';
```

如果该CSS属性确实存在，会返回一个字符串。即使该属性实际上并未设置，也会返回一个空字符串。如果该属性不存在，则会返回undefined。

```javascript
document.body.style['maxWidth'] // ""
document.body.style['maximumWidth'] // undefined
```

需要注意的是，不管CSS属性名带不带连词线，style对象都会显示该属性存在。

```javascript
document.body.style['backgroundColor'] // ""
document.body.style['background-color'] // ""
```

所有浏览器都能用这个方法，但是使用的时候，需要把不同浏览器的CSS规则前缀也考虑进去。

```javascript
var content = document.getElementById("content");
typeof content.style['webkitAnimation'] === 'string'
```

这种侦测方法可以写成一个函数。

```javascript
function isPropertySupported(property){
  if (property in document.body.style) return true;
  var prefixes = ['Moz', 'Webkit', 'O', 'ms', 'Khtml'];
  var prefProperty = property.charAt(0).toUpperCase() + property.substr(1);

  for(var i=0; i<prefixes.length; i++){
    if((prefixes[i] + prefProperty) in document.body.style) return true;
  }

  return false;
}

isPropertySupported('background-clip')
// true
```

此外，部分浏览器（Firefox 22+, Chrome 28+, Opera 12.1+）目前部署了supports API，可以返回一个布尔值，表示是否支持某条CSS规则。但是，这个API还没有成为标准。

```javascript
CSS.supports('transform-origin', '5px');
CSS.supports('(display: table-cell) and (display: list-item)');
```

### setPropertyValue()，getPropertyValue()，removeProperty()

style对象的以下三个方法，用来读写行内CSS规则。

- setPropertyValue(propertyName,value)：设置某个CSS属性。
- getPropertyValue(propertyName)：读取某个CSS属性。
- removeProperty(propertyName)：删除某个CSS属性。

这三个方法的第一个参数，都是CSS属性名，且不用改写连词线。

```javascript
divStyle.setProperty('background-color','red');
divStyle.getPropertyValue('background-color');
divStyle.removeProperty('background-color');
```

## CSS伪元素

CSS伪元素是通过CSS向DOM添加的元素，主要方法是通过“:before”和“:after”选择器生成伪元素，然后用content属性指定伪元素的内容。

以如下HTML代码为例。

```html
<div id="test">Test content</div>
```

CSS添加伪元素的写法如下。

```css
#test:before {
  content: 'Before ';
  color: #FF0;
}
```

DOM节点的style对象无法读写伪元素的样式，这时就要用到window对象的getComputedStyle方法（详见下面介绍）。JavaScript获取伪元素，可以使用下面的方法。

```javascript
var test = document.querySelector('#test');

var result = window.getComputedStyle(test, ':before').content;
var color = window.getComputedStyle(test, ':before').color;
```

此外，也可以使用window.getComputedStyle对象的getPropertyValue方法，获取伪元素的属性。

```javascript
var result = window.getComputedStyle(test, ':before')
  .getPropertyValue('content');
var color = window.getComputedStyle(test, ':before')
  .getPropertyValue('color');
```

## StyleSheet对象

### 获取样式表

StyleSheet对象代表网页的一张样式表，它包括link节点加载的样式表和style节点内嵌的样式表。

document对象的styleSheets属性，可以返回当前页面的所有StyleSheet对象（即所有样式表）。它是一个类似数组的对象。

```javascript
var sheets = document.styleSheets;
var sheet = document.styleSheets[0];
```

此外，link节点和style节点的sheet属性，也可以获取StyleSheet对象。

```javascript
// HTML代码为
// <link id="linkElement" href="http://path/to/stylesheet">
// <style id="styleElement">
//   body{font-size: 1.2 rem;}
// </style>

// 等同于document.styleSheets[0]
document.querySelector('#linkElement').sheet

// 等同于document.styleSheets[1]
document.querySelector('#styleElement').sheet
```

### 属性

StyleSheet对象有以下属性。

**（1）media属性**

media属性表示这个样式表是用于屏幕（screen），还是用于打印（print），或两者都适用（all）。该属性只读，默认值是screen。

```javascript
document.styleSheets[0].media.mediaText
// "all"
```

**（2）disabled属性**

disabled属性用于打开或关闭一张样式表。

```javascript
document.querySelector('#linkElement').disabled = true;
```

disabled属性只能在JavaScript中设置，不能在html语句中设置。

**（3）href属性**

href属性是只读属性，返回StyleSheet对象连接的样式表地址。对于内嵌的style节点，该属性等于null。

```javascript
document.styleSheets[0].href
```

**（4）title属性**

title属性返回StyleSheet对象的title值。

**（5）type属性**

type属性返回StyleSheet对象的type值，通常是text/css。

```javascript
document.styleSheets[0].type  // "text/css"
```

**（6）parentStyleSheet属性**

CSS的@import命令允许在样式表中加载其他样式表。parentStyleSheet属性返回包括了当前样式表的那张样式表。如果当前样式表是顶层样式表，则该属性返回null。

```javascript
if (stylesheet.parentStyleSheet) {
    sheet = stylesheet.parentStyleSheet;
} else {
    sheet = stylesheet;
}
```

**（7）ownerNode属性**

ownerNode属性返回StyleSheet对象所在的DOM节点，通常是&lt;link&gt;或&lt;style&gt;。对于那些由其他样式表引用的样式表，该属性为null。

```javascript
// HTML代码为
// <link rel="StyleSheet" href="example.css" type="text/css" />

document.styleSheets[0].ownerNode // [object HTMLLinkElement]
```

**（8）cssRules属性**

cssRules属性指向一个类似数组的对象，里面每一个成员就是当前样式表的一条CSS规则。使用该规则的cssText属性，可以得到CSS规则对应的字符串。

```javascript
var sheet = document.querySelector('#styleElement').sheet;

sheet.cssRules[0].cssText
// "body { background-color: red; margin: 20px; }"

sheet.cssRules[1].cssText
// "p { line-height: 1.4em; color: blue; }"
```

每条CSS规则还有一个style属性，指向一个对象，用来读写具体的CSS命令。

```javascript
styleSheet.cssRules[0].style.color = 'red';
styleSheet.cssRules[1].style.color = 'purple';
```

### insertRule()，deleteRule()

insertRule方法用于在当前样式表的cssRules对象插入CSS规则，deleteRule方法用于删除cssRules对象的CSS规则。

```javascript
var sheet = document.querySelector('#styleElement').sheet;
sheet.insertRule('#blanc { color:white }', 0);
sheet.insertRule('p { color:red }',1);
sheet.deleteRule(1);
```

insertRule方法的第一个参数是表示CSS规则的字符串，第二个参数是该规则在cssRules对象的插入位置。deleteRule方法的参数是该条规则在cssRules对象中的位置。

IE 9开始支持insertRule方法，在此之前都使用addRule方法。addRule的写法与insertRule略有不同，接受三个参数。

```javascript
sheet.addRule('p','color:red',1);
```

上面代码将一条CSS语句插入p选择器所有语句的第二位。最后一个参数默认为-1，即新增语句插在所有语句的最后。

### 添加样式表

添加样式表有两种方式。一种是添加一张内置样式表，即在文档中添加一个&lt;style&gt;节点。

```javascript
var style = document.createElement('style');

style.setAttribute('media', 'screen');
// 或者
style.setAttribute("media", "@media only screen and (max-width : 1024px)");

style.innerHTML = 'body{color:red}';
// 或者
sheet.insertRule("header { float: left; opacity: 0.8; }", 1);

document.head.appendChild(style);
```

另一种是添加外部样式表，即在文档中添加一个link节点，然后将href属性指向外部样式表的URL。

```javascript
var linkElm = document.createElement('link');
linkElm.setAttribute('rel', 'sty规则lesheet');
linkElm.setAttribute('type', 'text/css');
linkElm.setAttribute('href', 'reset-min.css');

document.head.appendChild(linkElm);
```

## CSS规则

一条CSS规则包括两个部分：CSS选择器和样式声明。下面就是一条典型的CSS规则。

```css
.myClass {
  background-color: yellow;
}
```

### CSSRule接口

CSS规则部署了CSSRule接口，它包括了以下属性。

**（1）cssText**

cssText属性返回当前规则的文本。

```javascript
// CSS代码为
// body { background-color: darkblue; }

var stylesheet = document.styleSheets[0];
stylesheet.cssRules[0].cssText
// body { background-color: darkblue; }
```

**（2）parentStyleSheet**

parentStyleSheet属性返回定义当前规则的样式表对象。

**（3）parentRule**

parentRule返回包含当前规则的那条CSS规则。最典型的情况，就是当前规则包含在一个@media代码块之中。如果当前规则是顶层规则，则该属性返回null。

**（4）type**

type属性返回有一个整数值，表示当前规则的类型。

最常见的类型有以下几种。

- 1：样式规则，部署了CSSStyleRule接口
- 3：输入规则，部署了CSSImportRule接口
- 4：Media规则，部署了CSSMediaRule接口
- 5：字体规则，部署了CSSFontFaceRule接口

### CSSStyleRule接口

如果一条CSS规则是普通的样式规则，那么除了CSSRule接口，它还部署了CSSStyleRule接口。

CSSRule接口有以下两个属性。

**（1）selectorText属性**

selectorText属性返回当前规则的选择器。

```javascript
var stylesheet = document.styleSheets[0];
stylesheet.cssRules[0].selectorText // ".myClass"
```

**（2）style属性**

style属性返回一个对象，代表当前规则的样式声明，也就是选择器后面的大括号里面的部分。该对象部署了CSSStyleDeclaration接口，使用它的cssText属性，可以返回所有样式声明，格式为字符串。

```javascript
document.styleSheets[0].cssRules[0].style.cssText
// "background-color: gray;font-size: 120%;"
```

### CSSMediaRule接口

如果一条CSS规则是@media代码块，那么它除了CSSRule接口，还部署了CSSMediaRule接口。

该接口主要提供一个media属性，可以返回@media代码块的media规则。

### CSSStyleDeclaration对象

每一条CSS规则的样式声明部分（大括号内部的部分），都是一个CSSStyleDeclaration对象，主要包括三种情况。

- HTML元素的行内样式（&lt;elem style="..."&gt;）

- CSSStyleRule接口的style属性

- window.getComputedStyle()的返回结果

每一条CSS属性，都是CSSStyleDeclaration对象的属性。不过，连词号需要编程骆驼拼写法。

```javascript
var styleObj = document.styleSheets[0].cssRules[1].style;
styleObj.color // "red";
styleObj.fontSize // "100%"
```

除了CSS属性以外，CSSStyleDeclaration对象还包括以下属性。

- cssText：当前规则的所有样式声明文本。该属性可读写，即可用来设置当前规则。

- length：当前规则包含多少条声明。

- parentRule：包含当前规则的那条规则，同CSSRule接口的parentRule属性。

CSSStyleDeclaration对象包括以下方法。

**（1）getPropertyPriority()**

getPropertyPriority方法返回指定声明的优先级，如果有的话，就是“important”，否则就是空字符串。

```javascript
var styleObj = document.styleSheets[0].cssRules[1].style;
styleObj.getPropertyPriority('color') // ""
```

**（2）getPropertyValue()**

getPropertyValue方法返回指定声明的值。

```javascript
// CSS代码为
// color:red;

var styleObj = document.styleSheets[0].cssRules[1].style;
styleObj.getPropertyValue('color') // "red"
```

**（3）item()**

item方法返回指定位置的属性名。

```javascript
var styleObj = document.styleSheets[0].cssRules[1].style;
styleObj.item(0) // "color"
// 或者
styleObj[0] // "color"
```

**（4）removeProperty()**

removeProperty方法用于删除一条CSS属性，返回被删除的值。

```javascript
// CSS代码为
// color:red;

var styleObj = document.styleSheets[0].cssRules[1].style;
styleObj.removeProperty('color') // "red"
```

**（5）setProperty()**

setProperty方法用于设置指定的CSS属性，没有返回值。

```javascript
var styleObj = document.styleSheets[0].cssRules[1].style;
styleObj.setProperty('color', 'green', 'important');
```

下面是遍历一条CSS规则所有属性的例子。

```javascript
var styleObj = document.styleSheets[0].cssRules[0].style;
for (var i = styleObj.length - 1; i >= 0; i--) {
   var nameString = styleObj[i];
   styleObj.removeProperty(nameString);
}
```

上面删除了一条CSS规则的所有属性，更简便的方法是设置cssText属性为空字符串。

```javascript
styleObj.cssText = '';
```

## window.getComputedStyle()

getComputedStyle方法接受一个DOM节点对象作为参数，返回一个包含该节点最终样式信息的对象。所谓“最终样式信息”，指的是各种CSS规则叠加后的结果。

```javascript
var div = document.querySelector('div');
window.getComputedStyle(div).backgroundColor
```

getComputedStyle方法还可以接受第二个参数，表示指定节点的伪元素。

```javascript
var result = window.getComputedStyle(div, ':before');
```

getComputedStyle方法返回的是一个CSSStyleDeclaration对象。但是此时，这个对象是只读的，也就是只能用来读取样式信息，不能用来设置。如果想设置样式，应该使用Element节点的style属性。

```javascript
var elem = document.getElementById("elem-container");
var hValue = window.getComputedStyle(elem,null).getPropertyValue("height");
```

## window.matchMedia()

### 基本用法

window.matchMedia方法用来检查CSS的[mediaQuery](https://developer.mozilla.org/en-US/docs/DOM/Using_media_queries_from_code)语句。各种浏览器的最新版本（包括IE 10+）都支持该方法，对于不支持该方法的老式浏览器，可以使用第三方函数库[matchMedia.js](https://github.com/paulirish/matchMedia.js/)。

CSS的mediaQuery语句有点像if语句，只要显示媒介（包括浏览器和屏幕等）满足mediaQuery语句设定的条件，就会执行区块内部的语句。下面是mediaQuery语句的一个例子。

```css
@media all and (max-width: 700px) {
  body {
    background: #FF0;
  }
}
```

上面的CSS代码表示，该区块对所有媒介（media）有效，且视口的最大宽度不得超过700像素。如果条件满足，则body元素的背景设为#FF0。

需要注意的是，mediaQuery接受两种宽度/高度的度量，一种是上例的“视口”的宽度/高度，还有一种是“设备”的宽度/高度，下面就是一个例子。

```css
@media all and (max-device-width: 700px) {
  body {
    background: #FF0;
  }
}
```

视口的宽度/高度（width/height）使用documentElement.clientWidth/clientHeight来衡量，单位是CSS像素；设备的宽度/高度（device-width/device-height）使用screen.width/height来衡量，单位是设备硬件的像素。

window.matchMedia方法接受一个mediaQuery语句的字符串作为参数，返回一个[MediaQueryList](https://developer.mozilla.org/en-US/docs/DOM/MediaQueryList)对象。该对象有以下两个属性。

- media：返回所查询的mediaQuery语句字符串。

- matches：返回一个布尔值，表示当前环境是否匹配查询语句。

```javascript
var result = window.matchMedia("(min-width: 600px)");
result.media // (min-width: 600px)
result.matches // true
```

下面是另外一个例子，根据mediaQuery是否匹配当前环境，执行不同的JavaScript代码。

```javascript
var result = window.matchMedia('@media all and (max-width: 700px)');

if (result.matches) {
  console.log('页面宽度小于等于700px');
} else {
  console.log('页面宽度大于700px');
}
```

下面的例子根据mediaQuery是否匹配当前环境，加载相应的CSS样式表。

```javascript
var result = window.matchMedia("(max-width: 700px)");

if (result.matches){
  var linkElm = document.createElement('link');
  linkElm.setAttribute('rel', 'stylesheet');
  linkElm.setAttribute('type', 'text/css');
  linkElm.setAttribute('href', 'small.css');

  document.head.appendChild(linkElm);
}
```

### 监听事件

window.matchMedia方法返回的MediaQueryList对象有两个方法，用来监听事件：addListener方法和removeListener方法。如果mediaQuery查询结果发生变化，就调用指定的回调函数。

```javascript
var mql = window.matchMedia("(max-width: 700px)");

// 指定回调函数
mql.addListener(mqCallback);

// 撤销回调函数
mql.removeListener(mqCallback);

function mqCallback(mql) {
  if (mql.matches) {
    // 宽度小于等于700像素
  } else {
    // 宽度大于700像素
  }
}
```

上面代码中，回调函数的参数是MediaQueryList对象。回调函数的调用可能存在两种情况。一种是显示宽度从700像素以上变为以下，另一种是从700像素以下变为以上，所以在回调函数内部要判断一下当前的屏幕宽度。

## CSS事件

### transitionEnd事件

CSS的过渡效果（transition）结束后，触发transitionEnd事件。

```javascript
el.addEventListener("transitionend", onTransitionEnd, false);

function onTransitionEnd() {
  console.log('Transition end');
}
```

transitionEnd的事件对象具有以下属性。

- propertyName：发生transition效果的CSS属性名。

- elapsedTime：transition效果持续的秒数，不含transition-delay的时间。

- pseudoElement：如果transition效果发生在伪元素，会返回该伪元素的名称，以“::”开头。如果不发生在伪元素上，则返回一个空字符串。

实际使用transitionend事件时，需要添加浏览器前缀。

```javascript
el.addEventListener('webkitTransitionEnd '
  + 'transitionend '
  + 'msTransitionEnd '
  + 'oTransitionEnd ', function(){
  el.style.transition = 'none';
});
```

### animationstart事件，animationend事件，animationiteration事件

CSS动画有以下三个事件。

- animationstart事件：动画开始时触发。

- animationend事件：动画结束时触发。

- animationiteration事件：开始新一轮动画循环时触发。如果animation-iteration-count属性等于1，该事件不触发，即只播放一轮的CSS动画，不会触发animationiteration事件。

```javascript
div.addEventListener('animationiteration', function() {
  console.log('完成一次动画');
});
```

这三个事件的事件对象，都有animationName属性（返回产生过渡效果的CSS属性名）和elapsedTime属性（动画已经运行的秒数）。对于animationstart事件，elapsedTime属性等于0，除非animation-delay属性等于负值。

```javascript

var el = document.getElementById("animation");

el.addEventListener("animationstart", listener, false);
el.addEventListener("animationend", listener, false);
el.addEventListener("animationiteration", listener, false);

function listener(e) {
  var li = document.createElement("li");
  switch(e.type) {
    case "animationstart":
      li.innerHTML = "Started: elapsed time is " + e.elapsedTime;
      break;
    case "animationend":
      li.innerHTML = "Ended: elapsed time is " + e.elapsedTime;
      break;
    case "animationiteration":
      li.innerHTML = "New loop started at time " + e.elapsedTime;
      break;
  }
  document.getElementById("output").appendChild(li);
}
```

上面代码的运行结果是下面的样子。

```html
Started: elapsed time is 0
New loop started at time 3.01200008392334
New loop started at time 6.00600004196167
Ended: elapsed time is 9.234000205993652
```

animation-play-state属性可以控制动画的状态（暂停/播放），该属性需求加上浏览器前缀。

```javascript
element.style.webkitAnimationPlayState = "paused";
element.style.webkitAnimationPlayState = "running";
```

## 参考链接

- David Walsh, [Add Rules to Stylesheets with JavaScript](http://davidwalsh.name/add-rules-stylesheets)
- Mozilla Developer Network, [Using CSS animations](https://developer.mozilla.org/en-US/docs/CSS/Tutorials/Using_CSS_animations)
- Ryan Morr, [Detecting CSS Style Support](http://ryanmorr.com/detecting-css-style-support/)
- Mozilla Developer Network, [Testing media queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Testing_media_queries)
- Robert Nyman, [Using window.matchMedia to do media queries in JavaScript](https://hacks.mozilla.org/2012/06/using-window-matchmedia-to-do-media-queries-in-javascript/)
