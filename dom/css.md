---
title: CSS操作
layout: page
category: dom
date: 2013-07-05
modifiedOn: 2014-01-31
---

CSS与JavaScript是两个有着明确分工的领域，前者负责页面的视觉效果，后者负责与用户的行为互动。但是，它们毕竟同属网页开发的前端，因此不可避免有着交叉和互相配合。本节介绍如果通过JavaScript操作CSS。

## DOM元素的CSS操作

### HTML元素的style属性

操作DOM元素的CSS样式，最简单的方法之一就是使用DOM元素的getAttribute方法、setAttribute方法和removeAttribute方法，读写或删除HTML元素的style属性。

{% highlight javascript %}

div.setAttribute('style',
	'background-color:red;border:1px solid black;');

{% endhighlight %}

### style对象

DOM元素本身还提供style属性，用来操作CSS样式。

**（1）简介**

DOM元素的style属性指向一个对象，用来读写页面元素的行内CSS样式。

{% highlight javascript %}

var divStyle = document.querySelector('div').style; 

divStyle.backgroundColor = 'red';
divStyle.border = '1px solid black';
divStyle.width = '100px';
divStyle.height = '100px';

divStyle.backgroundColor // red
divStyle.border // 1px solid black 
divStyle.height // 100px
divStyle.width // 100px

{% endhighlight %}

从上面代码可以看到，style属性指向一个对象（简称style对象），该对象的属性与css规则名一一对应，但是需要改写。具体规则是将横杠从CSS规则名中去除，然后将横杠后的第一个字母大写，比如background-color写成backgroundColor。如果CSS规则名是JavaScript保留字，则规则名之前需要加上字符串“css”，比如float写成cssFloat。

注意，style对象的属性值都是字符串，而且包括单位。所以，divStyle.width不能设置为100，而要设置为'100px'。

**（2）style对象的cssText属性**

style对象的cssText可以用来读写或删除整个style属性。

{% highlight javascript %}

divStyle.cssText = 'background-color:red;border:1px solid black;height:100px;width:100px;';

{% endhighlight %}

**（3）CSS模块的侦测**

CSS的规格发展太快，新的模块层出不穷。不同浏览器的不同版本，对CSS模块的支持情况都不一样。有时候，需要知道当前浏览器是否支持某个模块，这就叫做“CSS模块的侦测”。

一个比较普遍适用的方法是，判断某个DOM元素的style对象的某个属性值是否为字符串。

{% highlight javascript %}

typeof element.style.animationName === 'string';
typeof element.style.transform === 'string';

{% endhighlight %}

如果是的话，就说明该属性在style对象中确实存在，代表浏览器支持该CSS属性。所有浏览器都能用这个方法，但是使用的时候，需要把不同浏览器的CSS规则前缀也考虑进去。

{% highlight javascript %}

typeof document.getElementById("content").style['-webkit-animation'] === 'string'

{% endhighlight %}

这种侦测方法可以写成一个函数。

{% highlight javascript %}

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

{% endhighlight %}

此外，部分浏览器（Firefox 22+, Chrome 28+, Opera 12.1+）目前部署了supports API，可以返回是否支持某条CSS规则。但是，这个API还没有成为标准。

{% highlight javascript %}

CSS.supports('transform-origin', '5px');
CSS.supports('(display: table-cell) and (display: list-item)');

{% endhighlight %}

**（4）style对象的方法**

style对象有以下三个方法，也可以用来设置、读取和删除行内CSS规则，而且不必改写CSS规则名。

- setPropertyValue(propertyName,value)：设置某个CSS属性。
- getPropertyValue(propertyName)：读取某个CSS属性。
- removeProperty(propertyName)：删除某个CSS属性。

{% highlight javascript %}

divStyle.setProperty('background-color','red');
divStyle.getPropertyValue('background-color');
divStyle.removeProperty('background-color');

{% endhighlight %}

**（5）style对象的animation-play-state属性**

animation-play-state属性用来控制暂停动画的播放。该属性需要加上浏览器前缀。

{% highlight javascript %}

element.style.webkitAnimationPlayState = "paused";
element.style.webkitAnimationPlayState = "running";

{% endhighlight %}

### CSS生成内容

“CSS生成内容”指的是通过CSS，向DOM添加的元素。主要的方法是通过“:before”和“:after”生成伪元素，然后用content属性指定伪元素的内容。

假定HTML代码如下：

{% highlight html %}

<div id="test">Test content</div>

{% endhighlight %}

相应的CSS如下：

{% highlight css %}

#test:before {
    content: 'Before ';
	color: #FF0;
}

{% endhighlight %}

DOM元素的style对象无法读写伪元素的样式，这时就要用到window对象的getComputedStyle方法。JavaScript获取获取伪元素的content属性和color属性，可以使用下面的方法。

{% highlight javascript %}

var test = document.querySelector('#test');
var result = window.getComputedStyle(test, ':before').content;
var color = window.getComputedStyle(test, ':before').color;

{% endhighlight %}

上面代码也可以使用window.getComputedStyle对象（详见下面介绍）的getPropertyValue方法获取。

{% highlight javascript %}

var test = document.querySelector('#test');

var result = window.getComputedStyle(test, ':before').getPropertyValue('content');
var color = window.getComputedStyle(test, ':before').getPropertyValue('color');

{% endhighlight %}

### CSS事件

**（1） 动画（animation）事件**

CSS的animation动画定义了三个事件，可以绑定回调函数：动画的开始、动画的结束、动画的循环。

{% highlight javascript %}

var e = document.getElementById("animation");

e.addEventListener("animationstart", listener, false);
e.addEventListener("animationend", listener, false);
e.addEventListener("animationiteration", listener, false);

{% endhighlight %}

回调函数的范例：

{% highlight javascript %}

function listener(e) {

  var l = document.createElement("li");

  switch(e.type) {

    case "animationstart":
      l.innerHTML = "Started: elapsed time is " + e.elapsedTime;
      break;

    case "animationend":
      l.innerHTML = "Ended: elapsed time is " + e.elapsedTime;
      break;

    case "animationiteration":
      l.innerHTML = "New loop started at time " + e.elapsedTime;
      break;

  }

  document.getElementById("output").appendChild(l);

}

{% endhighlight %}

上面代码的运行结果是下面的样子：

{% highlight html %}

Started: elapsed time is 0
New loop started at time 3.01200008392334
New loop started at time 6.00600004196167
Ended: elapsed time is 9.234000205993652

{% endhighlight %}

animation-play-state属性可以控制动画的状态（暂停/播放），该属性需求加上浏览器前缀。

{% highlight javascript %}

element.style.webkitAnimationPlayState = "paused";
element.style.webkitAnimationPlayState = "running";

{% endhighlight %}

**（2）过渡（transition）事件**

CSS过渡（transition）结束的时候，会触发transitionend事件。

{% highlight javascript %}

$("body").on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", function(){
   $("body").css("transition", "none");
});

{% endhighlight %}

## 样式表

### 获取样式表

document对象的styleSheets属性，包含一个类似数组的对象，里面是当前文档所有的link元素(指向样式表)和style元素。

{% highlight javascript %}

var sheets = document.styleSheets;
var sheet = document.styleSheets[0];

{% endhighlight %}

除了使用styleSheets属性获取样式表，还可以使用querySelector方法，先获取Element对象，然后再用它的sheet属性获取CSSStyleSheet对象。

{% highlight javascript %}

// 等同于document.styleSheets[0] 
document.querySelector('#linkElement').sheet 

// 等同于document.styleSheets[1]
document.querySelector('#styleElement').sheet

{% endhighlight %}

### 样式表对象

样式表对象主要有以下属性和方法。

- href（只读）
- media（只读）
- ownerNode（只读）
- parentStylesheet（只读）
- title（只读）
- type（只读）
- cssRules
- ownerRule
- insertRule()
- deleteRule()
- disabled

**（1）media属性**

media属性表示这个样式表是用于显示在屏幕（screen），还是用于打印（print），或两者都适用（all）。该属性只读。

{% highlight javascript %}

document.styleSheets[0].media.mediaText
// "all"

{% endhighlight %}

**（2）cssRules属性**

cssRules属性指向一个类似数组的对象（称为cssRules对象），该对象的每个成员就是一条CSS规则，使用该规则的cssText属性，可以得到CSS规则对应的字符串。

{% highlight javascript %}

var sheet = document.querySelector('#styleElement').sheet;

sheet.cssRules[0].cssText
// "body { background-color: red; margin: 20px; }"

sheet.cssRules[1].cssText
// "p { line-height: 1.4em; color: blue; }"

{% endhighlight %}

每条CSS规则还有一个style属性，指向一个对象，用来读写具体的CSS命令。

{% highlight javascript %}

styleSheet.cssRules[0].style.color = 'red';
styleSheet.cssRules[1].style.color = 'purple';

{% endhighlight %}

**（3）insertRule方法和deleteRule方法**

insertRule方法用于插入CSS规则，deleteRule方法用于删除CSS规则。

{% highlight javascript %}

var sheet = document.querySelector('#styleElement').sheet;

sheet.insertRule('p{color:red}',1);

sheet.deleteRule(1);

{% endhighlight %}

insertRule方法的第一个参数是表示CSS规则的字符串，第二个参数是该规则在cssRules对象的插入位置。deleteRule方法的参数是该条规则在cssRules对象中的位置。

IE 9开始支持insertRule方法，在此之前都使用addRule方法。addRule的写法与insertRule略有不同，接受三个参数。

{% highlight javascript %}

sheet.addRule('p','color:red',1);

{% endhighlight %}

上面代码将一条CSS语句插入p选择器所有语句的第二位。最后一个参数默认为-1，即新增语句插在所有语句的最后。

**（4）disabled属性**

该属性用于打开或关闭一张样式表。

{% highlight javascript %}

document.document.querySelector('#linkElement').disabled = true;

{% endhighlight %}

disabled属性只能在JavaScript中设置，不能在html语句中设置。

### 添加样式表

添加一张内置样式表，就是在文档中添加一个style节点。

{% highlight javascript %}

var style = document.createElement("style");

style.setAttribute("media", "screen");

// 或者

style.setAttribute("media", "@media only screen and (max-width : 1024px)");

style.innerHTML = 'body{color:red}';

document.head.appendChild(style);

{% endhighlight %}

添加外部样式表，就是在文档中添加一个link节点。

{% highlight javascript %}

var linkElm = document.createElement('link');
linkElm.setAttribute('rel', 'stylesheet');
linkElm.setAttribute('type', 'text/css');
linkElm.setAttribute('href', 'reset-min.css');

document.head.appendChild(linkElm);

{% endhighlight %}

## window.getComputedStyle方法

getComputedStyle方法接受一个HTML元素作为参数，返回一个包含该HTML元素的最终样式信息的对象。所谓“最终样式信息”，指的是各种CSS规则叠加后的结果。

{% highlight javascript %}

var div = document.querySelector('div');

window.getComputedStyle(div).backgroundColor

{% endhighlight %}

getComputedStyle方法只能读取CSS属性，而不能设置。它使用骆驼拼写法表示CSS规则名，比如background-color要写成backgroundColor。

getComputedStyle方法返回的颜色值一律都是rgb(#,#,#)格式。

## window.matchMedia方法

window.matchMedia方法用来检查CSS的[mediaQuery](https://developer.mozilla.org/en-US/docs/DOM/Using_media_queries_from_code)语句。各种浏览器的最新版本（包括IE 10+）都支持该方法，对于不支持该方法的老式浏览器，可以使用第三方函数库[matchMedia.js](https://github.com/paulirish/matchMedia.js/)。

### mediaQuery语句

mediaQuery有点像if语句，只要显示网页的媒介（包括浏览器和屏幕等）满足mediaQuery语句设定的条件，就会执行区块内部的语句。下面是mediaQuery语句的一个例子。

{% highlight javascript %}

@media all and (max-width: 700px) {
    body {
        background: #FF0;
    }
}

{% endhighlight %}

上面的CSS代码表示，该区块对所有媒介（media）有效，且视口必须满足最大宽度不超过700像素。如果条件满足，则body元素的背景设为#FF0。

需要注意的是，mediaQuery接受两种宽度/高度的度量，一种是上例的“视口”的宽度/高度，还有一种是“设备”的宽度/高度，下面就是一个例子。

{% highlight javascript %}

@media all and (max-device-width: 700px) {

}

{% endhighlight %}

视口的宽度/高度（width/height）使用documentElement.clientWidth/Height来衡量，单位是CSS像素；设备的宽度/高度（device-width/device-height）使用screen.width/height来衡量，单位是设备硬件的像素。

### 属性

window.matchMedia方法接受mediaQuery语句作为参数，返回一个[MediaQueryList](https://developer.mozilla.org/en-US/docs/DOM/MediaQueryList)对象。该对象有以下两个属性。

- media：查询语句的内容。
- matches：如果查询结果为真，值为true，否则为false。

{% highlight javascript %}

var result = window.matchMedia("(min-width: 600px)");

result.media // (min-width: 600px)
result.matches // true

{% endhighlight %}

下面是另外一个例子，根据mediaQuery是否匹配，运行不同的JavaScript代码。

{% highlight javascript %}

var result = window.matchMedia('@media all and (max-width: 700px)');

if(result.matches) {
    console.log('the width is less then 700px');
} else {
    console.log('the width is more then 700px');
}

{% endhighlight %}

还可以根据mediaQuery是否匹配，加载相应的CSS样式表。

{% highlight javascript %}

var result = window.matchMedia("(max-width: 700px)");

if (result.matches){
	var linkElm = document.createElement('link');
	linkElm.setAttribute('rel', 'stylesheet');
	linkElm.setAttribute('type', 'text/css');
	linkElm.setAttribute('href', 'small.css');

	document.head.appendChild(linkElm);
}

{% endhighlight %}

### 方法

window.matchMedia方法返回的MediaQueryList对象有两个方法，用来监听事件：addListener方法和removeListener方法。如果mediaQuery查询结果发生变化，就调用指定的回调函数。

{% highlight javascript %}

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

{% endhighlight %}

上面代码中，回调函数的参数是MediaQueryList对象。回调函数的调用可能存在两种情况。一种是显示宽度从700像素以上变为以下，另一种是从700像素以下变为以上，所以在回调函数内部要判断一下当前的屏幕宽度。

## 参考链接

- David Walsh, [Add Rules to Stylesheets with JavaScript](http://davidwalsh.name/add-rules-stylesheets)
- Mozilla Developer Network, [Using CSS animations](https://developer.mozilla.org/en-US/docs/CSS/Tutorials/Using_CSS_animations)
- Ryan Morr, [Detecting CSS Style Support](http://ryanmorr.com/detecting-css-style-support/)
- Mozilla Developer Network, [Testing media queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Testing_media_queries)
- Robert Nyman, [Using window.matchMedia to do media queries in JavaScript](https://hacks.mozilla.org/2012/06/using-window-matchmedia-to-do-media-queries-in-javascript/)
