---
title: Element对象
category: dom
layout: page
date: 2015-04-15
modifiedOn: 2015-04-15
---

Element对象就是网页中HTML标签元素的节点。

## 属性

### attributes

attributes属性返回指定元素节点的所有属性节点，返回的是一个NamedNodeMap对象，它是类似数组的对象，所有成员都是动态的，即属性的变化会实时反映在结果集。

下面代码是遍历一个元素节点的所有属性。

```javascript
var para = document.getElementsByTagName("p")[0];

if (para.hasAttributes()) {
  var attrs = para.attributes;
  var output = "";
  for(var i = attrs.length - 1; i >= 0; i--) {
    output += attrs[i].name + "->" + attrs[i].value;
  }
  result.value = output;
} else {
  result.value = "No attributes to show";
}
```

## 方法

### querySelector()，querySelectorAll()

querySelector方法接受CSS选择器作为参数，返回父元素的第一个匹配的子元素。

```javascript
var content = document.getElementById('content');
var el = content.querySelector('p');
```

上面代码返回content节点的第一个p元素。

注意，如果CSS选择器有多个组成部分，比如`div p`，querySelector方法会把父元素考虑在内。假定HTML代码如下。

```html
<div id="outer">
  <p>Hello</p>
  <div id="inner">
    <p>World</p>
  </div>
</div>
```

那么，下面代码会选中第一个p元素。

```javascript
var outer = document.getElementById('outer');
var el = outer.querySelector('div p');
```

querySelectorAll方法接受CSS选择器作为参数，返回一个NodeList对象，包含所有匹配的子元素。

```javascript
var el = document.querySelector('#test');
var matches = el.querySelectorAll('div.highlighted > p');
```

在CSS选择器有多个组成部分时，querySelectorAll方法也是会把父元素本身考虑在内。

还是以上面的HTML代码为例，下面代码会同时选中两个p元素。

```javascript
var outer = document.getElementById('outer');
var el = outer.querySelectorAll('div p');
```
