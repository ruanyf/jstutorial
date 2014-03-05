---
title: CSS操作
layout: page
category: dom
date: 2013-07-05
modifiedOn: 2014-01-31
---

CSS与JavaScript是两个有着明确分工的领域，前者负责页面的视觉效果，后者负责与用户的行为互动。但是，它们毕竟同属网页开发的前端，因此不可避免有着交叉和互相配合。本节介绍如果通过JavaScript操作CSS。

## DOM元素的style属性

### 简介

DOM元素的style属性用来读写页面元素的行内CSS样式。

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

style对象的cssText可以用来读写或删除整个style属性。

{% highlight javascript %}

divStyle.cssText = 'background-color:red;border:1px solid black;height:100px;width:100px;';

{% endhighlight %}

可以利用style对象，检查浏览器是否支持某个CSS属性。

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

### 读写HTML元素的style属性

使用Element对象的getAttribute方法、setAttribute方法和removeAttribute方法，也能达到读写或删除整个style属性的目的。

{% highlight javascript %}

div.setAttribute('style',
	'background-color:red;border:1px solid black;height:100px;width:100px;');

{% endhighlight %}

### style对象的方法

style对象有以下三个方法，也可以用来设置、读取和删除行内CSS规则，而且不必改写CSS规则名。

- setPropertyValue(propertyName,value)
- getPropertyValue(propertyName)
- removeProperty(propertyName)

{% highlight javascript %}

divStyle.setProperty('background-color','red');
divStyle.getPropertyValue('background-color');
divStyle.removeProperty('background-color');

{% endhighlight %}

### 特殊的CSS属性介绍

**（1）animation-play-state**

animation-play-state属性用来控制暂停动画的播放。该属性需要加上浏览器前缀。

{% highlight javascript %}

element.style.webkitAnimationPlayState = "paused";
element.style.webkitAnimationPlayState = "running";

{% endhighlight %}

## 获取伪元素的样式

style属性无法读写伪元素的样式，因为伪元素依存于特定的DOM元素，这时就要用到window对象的getComputedStyle方法。

{% highlight javascript %}

var color = window.getComputedStyle(
	document.querySelector('.element'), ':before'
).getPropertyValue('color');

var content = window.getComputedStyle(
	document.querySelector('.element'), ':before'
).getPropertyValue('content');

{% endhighlight %}

上面代码读取了伪元素.element:before的color和content属性。

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

## 参考链接

- David Walsh, [Add Rules to Stylesheets with JavaScript](http://davidwalsh.name/add-rules-stylesheets)

