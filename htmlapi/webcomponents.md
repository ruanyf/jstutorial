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
  // 支持
} else {
  // 不支持
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

下面的代码用于测试浏览器是否支持自定义元素。

```javascript

function supportsCustomElements() {
  return 'registerElement' in document;
}

if (supportsCustomElements()) {
  // 支持
} else {
  // 不支持
}

```

### document.registerElement方法

document.registerElement方法用来注册新的网页元素，它返回一个构造函数。

```javascript

var XFoo = document.registerElement('x-foo');

```

上面代码注册了网页元素x-foo。可以看到，document.registerElement方法的第一个参数是一个字符串，表示自定义的网页元素的名称。需要注意的是，自定义元素的名称中，必须包含连字号（-），用来与预定义的网页元素相区分。连字号可以是一个也可以是多个。

document.registerElement方法还可以接受第二个参数，表示自定义网页元素的原型对象。

```javascript

var MyElement = document.registerElement('user-profile', {
  prototype: Object.create(HTMLElement.prototype)
});

```

上面代码注册了user-profile。document.registerElement方法的第二个参数，指定它的原型对象是HTMLElement.prototype（它是浏览器内部所有网页元素的原型）。如果想让自定义元素继承某种特定的网页元素，就要指定extends属性。比如，想让自定义元素继承h1元素，需要写成下面这样。

```javascript

var MyElement = document.registerElement('another-heading', {
  prototype: Object.create(HTMLElement.prototype),
  extends: 'h1' 
});

```

另一个是自定义按钮（button）元素的例子。

```javascript

var MyButton = document.registerElement('my-button', {
  prototype: Object.create(HTMLButtonElement.prototype),
  extends: 'button'
});

```

如果要继承一个自定义元素，比如创造`x-foo-extended`继承`x-foo`，也是一样写法。

```javascript

var XFooExtended = document.registerElement('x-foo-extended', {
  prototype: Object.create(HTMLElement.prototype),
  extends: 'x-foo'
});

```

总之，如果要自定义一个元素A继承元素B，那么元素A的原型必须是元素B的原型。使用的时候，需要把它写在所继承的网页元素的is属性之中，读起来就是B元素“is”A元素。

```html

<h1 is="another-heading">
  Page title
</h1>

<button is="my-button">

```

自定义元素注册成功以后，document.registerElement方法返回一个构造函数。下一步就可以用这个构造函数，生成自定义元素的实例。

```javascript

document.body.appendChild(new XFoo());

```

上面代码中，XFoo是自定义元素的构造函数，appendChild将它的实例插入DOM。

### 添加属性和方法

自定义元素的强大之处，就是可以在它上面定义新的属性和方法。

```javascript

var XFooProto = Object.create(HTMLElement.prototype);

var XFoo = document.registerElement('x-foo', {prototype: XFooProto});

```

上面代码注册了一个x-foo标签，并且指明原型继承HTMLElement.prototype。现在，我们就可以在原型上面，添加新的属性和方法。

```javascript

// 添加属性
Object.defineProperty(XFooProto, "bar", {value: 5});

// 添加方法
XFooProto.foo = function() {
  console.log('foo() called');
};

// 另一种写法
var XFoo = document.registerElement('x-foo', {
  prototype: Object.create(HTMLElement.prototype, {
    bar: {
      get: function() { return 5; }
    },
    foo: {
      value: function() {
        console.log('foo() called');
      }
    }
  })
});

```

原型上有一些属性，可以指定回调函数，在特定事件发生时触发。

- **createdCallback**：实例生成时
- **attachedCallback**：实例插入文档时
- **detachedCallback**：实例从文档移除时
- **attributeChangedCallback(attrName, oldVal, newVal)**：添加、移除、更新属性时

下面是一个例子。

```javascript

var proto = Object.create(HTMLElement.prototype);

proto.createdCallback = function() {...};
proto.attachedCallback = function() {...};

var XFoo = document.registerElement('x-foo', {prototype: proto});

```

利用回调函数，可以方便地在自定义元素中插入HTML语句。

```javascript

var XFooProto = Object.create(HTMLElement.prototype);

XFooProto.createdCallback = function() {
  this.innerHTML = "<b>I'm an x-foo-with-markup!</b>";
};

var XFoo = document.registerElement('x-foo-with-markup', 
			{prototype: XFooProto});

```

上面代码定义了createdCallback回调函数，生成实例时，该函数运行，插入如下的HTML语句。

```html

<x-foo-with-markup>
   <b>I'm an x-foo-with-markup!</b>
</x-foo-with-markup>

```

## Shadow DOM

所谓Shadow DOM指的是，浏览器将模板、样式表、属性、JavaScript代码等，封装成一个独立的DOM元素。外部的设置无法影响到其内部，而内部的设置也不会影响到外部。Chrome 35+支持Shadow DOM。

Shadow DOM最大的好处有两个，一是可以向用户隐藏细节，直接提供组件，二是可以封装内部样式表，不会影响到外部。

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
- Eric Bidelman, [Custom Elements: defining new elements in HTML](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/)
- TJ VanToll, [Why Web Components Are Ready For Production](http://developer.telerik.com/featured/web-components-ready-production/)
