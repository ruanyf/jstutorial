---
title: Web Components
category: htmlapi
layout: page
date: 2014-07-09
modifiedOn: 2014-07-09
---

不同的网站往往需要一些相同的模块，比如日历、调色板等等，这种模块就被称为“组件”（component）。未来的网站开发，可以像搭积木一样，把组件合在一起，就组成了一个网站。很显然，组件非常有利于代码的重复利用。

Web Components就是网页组件的规范。它不是单一的规范，而是一系列的技术组成，包括template、custom element、shadowDOM等。

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

Web Components是非常新的技术，为了让老式浏览器也能使用，Google推出了一个函数库[Polymer.js](http://www.polymer-project.org/)。

```html

<polymer-element name="my-element">
  <template>
    // take it away!
  </template>
  <script>
    Polymer('my-element', {});
  </script>
</polymer-element>

<my-element></my-element>

```

## 参考链接

- Todd Motto, [Web Components and concepts, ShadowDOM, imports, templates, custom elements](http://toddmotto.com/web-components-concepts-shadow-dom-imports-templates-custom-elements/)
- Dominic Cooney, [Shadow DOM 101](http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/)
- Eric Bidelman, [HTML's New Template Tag](http://www.html5rocks.com/en/tutorials/webcomponents/template/)
