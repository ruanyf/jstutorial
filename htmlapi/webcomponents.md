---
title: Web Components
category: htmlapi
layout: page
date: 2014-07-09
modifiedOn: 2014-07-09
---

不同的网站往往需要一些相同的模块，比如日历、调色板等等，这种模块就被称为“组件”（component）。未来的网站开发，可以像搭积木一样，把组件合在一起，就组成了一个网站。很显然，组件非常有利于代码的重复利用。

Web Components就是网页组件的规范。它不是单一的规范，而是一系列的技术组成，包括Template、Custom Element、Shadow DOM、HTML Import等。

## template标签

template标签表示网页中某些重复出现的部分的代码模板。它存在于DOM之中，但是在页面中不可见。

下面的代码用来检查，浏览器是否支持template标签。

```javascript

function supportsTemplate() {
  return 'content' in document.createElement('template');
}

if (supportsTemplate()) {
  // Good to go!
} else {
  // Use old templating techniques or libraries.
}

```

下面是一个模板的例子。

```html

<template id="profileTemplate">
  <div class="profile">
    <img src="" class="profile__img">
    <div class="profile__name"></div>
    <div class="profile__social"></div>
  </div>
</template>

```

使用的时候，需要用JavaScript在模板中插入内容，然后将其插入DOM。

```javascript

var template = document.querySelector('#profileTemplate');
template.querySelector('.profile__img').src = 'profile.jpg';
template.querySelector('.profile__name').textContent = 'Barack Obama';
template.querySelector('.profile__social').textContent = 'Follow me on Twitter';
document.body.appendChild(template.content);

```

上面的代码是将模板直接插入DOM，更好的做法是克隆template节点，然后将克隆的节点插入DOM。

```javascript

var clone = document.importNode(template.content, true);
document.body.appendChild(clone);

```

接受template插入的元素，叫做宿主元素（host）。在template之中，可以对宿主元素设置样式。

```html

<template>
<style>
  :host {
    background: #f8f8f8;
  } 
  :host(:hover) {
    background: #ccc;
  }
</style>
</template>

```

## custom element

HTML预定义的网页元素，有时并不符合我们的需要，这时可以自定义网页元素。这就叫做custom element。

下面是定义自定义元素的代码。

```javascript

var MyElementProto = Object.create(HTMLElement.prototype);

window.MyElement = document.registerElement('user-profile', {
  prototype: MyElementProto
});

```

上面代码通过document.registerElement方法，自定义了一个叫做user-profile的网页元素。document.registerElement方法的第一个参数是一个字符串，表示自定义的网页元素的名称；它的第二个参数是该元素的属性对象，其中需要指定它的原型对象是HTMLElement.prototype。

如果想让自定义元素继承某种元素，就要指定extends属性。比如，想让某个元素继承h1元素，需要写成下面这样。

```javascript

var MyElementProto = Object.create(HTMLElement.prototype);

window.MyElement = document.registerElement('another-heading', {
  prototype: MyElementProto,
  extends: 'h1' 
});

```

然后，使用的时候需要在网页元素中指定is属性。

```html

<h1 is="another-heading">
  Page title
</h1>

```

## Shadow DOM

所谓Shadow DOM指的是，浏览器将模板、样式表、属性、JavaScript代码等，封装成一个独立的DOM元素。外部的设置无法影响到其内部，而内部的设置也不会影响到外部。Chrome 35+支持Shadow DOM。

Shadow DOM需要通过createShadowRoot方法，造一个单独的root元素。

```html

<button>Hello, world!</button>

<script>
	var host = document.querySelector('button');
	var root = host.createShadowRoot();
	root.textContent = '你好，世界！';
</script>

```

上面代码指定button的文字为“你好，世界！”。

Shadow DOM更强大的作用是，可以为DOM元素指定模板和样式表。

```html

<div id="nameTag">张三</div>

<template id="nameTagTemplate">
	<style>
		.outer {
			border: 2px solid brown;
		}
	</style>

	<div class="outer">
		<div class="boilerplate">
			Hi! My name is
		</div>
		<div class="name">
			Bob
		</div>
	</div>
</template>

```

上面代码是一个div元素和模板。接下来，就是要把模板应用到div元素上。

```javascript

var shadow = document.querySelector('#nameTag').createShadowRoot();
var template = document.querySelector('#nameTagTemplate');
shadow.appendChild(template.content.cloneNode());

```

上面代码先用createShadowRoot方法，对div创造一个根元素，用来指定Shadow DOM，然后把模板元素添加为Shadow的子元素。

## Polymer.js

Web Components是非常新的技术，为了让老式浏览器也能使用，Google推出了一个函数库[Polymer.js](http://www.polymer-project.org/)。这个库不仅可以帮助开发者，定义自己的网页元素，还提供许多预先制作好的组件，可以直接使用。

### 直接使用的组件

Polymer.js提供的组件，可以直接插入网页，比如下面的google-map。。

```html

<script src="components/platform/platform.js"></script>
<link rel="import" href="google-map.html">
<google-map lat="37.790" long="-122.390"></google-map>

```

再比如，在网页中插入一个时钟，可以直接使用下面的标签。

```html

<polymer-ui-clock></polymer-ui-clock>

```

自定义标签与其他标签的用法完全相同，也可以使用CSS指定它的样式。

```css

polymer-ui-clock {
  width: 320px;
  height: 320px;
  display: inline-block;
  background: url("../assets/glass.png") no-repeat;
  background-size: cover;
  border: 4px solid rgba(32, 32, 32, 0.3);
}

```

### 安装

如果使用bower安装，至少需要安装platform和core components这两个核心部分。

```bash

bower install --save Polymer/platform
bower install --save Polymer/polymer

```

你还可以安装所有预先定义的界面组件。

```bash

bower install Polymer/core-elements
bower install Polymer/polymer-ui-elements

```

还可以只安装单个组件。

```bash

bower install Polymer/polymer-ui-accordion

```

这时，组件根目录下的bower.json，会指明该组件的依赖的模块，这些模块会被自动安装。

```javascript

{
  "name": "polymer-ui-accordion",
  "private": true,
  "dependencies": {
    "polymer": "Polymer/polymer#0.2.0",
    "polymer-selector": "Polymer/polymer-selector#0.2.0",
    "polymer-ui-collapsible": "Polymer/polymer-ui-collapsible#0.2.0"
  },
  "version": "0.2.0"
}

```

### 自定义组件

下面是一个最简单的自定义组件的例子。

```html

<link rel="import" href="../bower_components/polymer/polymer.html">
 
<polymer-element name="lorem-element">
  <template>
    <p>Lorem ipsum</p>
  </template>
</polymer-element>

```

上面代码定义了lorem-element组件。它分成三个部分。

**（1）import命令**

import命令表示载入核心模块

**（2）polymer-element标签**

polymer-element标签定义了组件的名称（注意，组件名称中必须包含连字符）。它还可以使用extends属性，表示组件基于某种网页元素。

```html

<polymer-element name="w3c-disclosure" extends="button">

```

**（3）template标签**

template标签定义了网页元素的模板。

### 组件的使用方法

在调用组件的网页中，首先加载polymer.js库和组件文件。

```html

<script src="components/platform/platform.js"></script>
<link rel="import" href="w3c-disclosure.html">

```

然后，分成两种情况。如果组件不基于任何现有的HTML网页元素（即定义的时候没有使用extends属性），则可以直接使用组件。

```html

<lorem-element></lorem-element>

```

这时网页上就会显示一行字“Lorem ipsum”。

如果组件是基于（extends）现有的网页元素，则必须在该种元素上使用is属性指定组件。

```

<button is="w3c-disclosure">Expand section 1</button>

```

## 参考链接

- Todd Motto, [Web Components and concepts, ShadowDOM, imports, templates, custom elements](http://toddmotto.com/web-components-concepts-shadow-dom-imports-templates-custom-elements/)
- Dominic Cooney, [Shadow DOM 101](http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/)
- Eric Bidelman, [HTML's New Template Tag](http://www.html5rocks.com/en/tutorials/webcomponents/template/)
- Rey Bango, [Using Polymer to Create Web Components](http://code.tutsplus.com/tutorials/using-polymer-to-create-web-components--cms-20475)
- Cédric Trévisan, Building an Accessible Disclosure Button – using Web Components](http://blog.paciellogroup.com/2014/06/accessible-disclosure-button-using-web-components/)
