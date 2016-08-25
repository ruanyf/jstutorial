---
title: Attribute对象
category: dom
layout: page
date: 2016-08-23
modifiedOn: 2016-08-23
---

## 概述

HTML元素包括标签名和若干个键值对，这个键值对就称为“属性”（attribute）。

```html
<a id="test" href="http://www.example.com">
  链接
</a>
```

上面代码中，`a`元素包括两个属性：`id`属性和`href`属性。

HTML标签中的属性，会自动成为元素节点对象的属性。

```javascript
var a = document.getElementById('test');
a.id // "test"
a.href // "http://www.example.com/"
```

上面代码中，`a`元素标签的属性`id`和`href`，自动成为节点对象的属性。

这些属性都是可写的。

```javascript
var img = document.getElementById('myImage');
img.src = 'http://www.example.com/image.jpg';
```

上面的写法，会立刻替换掉`img`对象的`src`属性，即会显示另外一张图片。

这样修改HTML属性，常常用于添加表单的属性。

```javascript
var f = document.forms[0];
f.action = 'submit.php';
f.method = 'POST';
```

上面代码为表单添加提交网址和提交方法。

注意，这种用法虽然可以读写HTML属性，但是无法删除属性，`delete`运算符在这里不会生效。

HTML元素的属性名是大小写不敏感的，但是JavaScript对象的属性名是大小写敏感的。转换规则是，转为JavaScript属性名时，一律采用小写。如果属性名包括多个单词，则采用骆驼拼写法，即从第二个单词开始，每个单词的首字母采用大写，比如`onClick`。

有些HTML属性名是JavaScript的保留字，转为JavaScript属性时，必须改名。主要是以下两个。

- `for`属性改为`htmlFor`
- `class`属性改为`className`

另外，HTML属性值一般都是字符串，但是JavaScript属性会自动转换类型。比如，将字符串`true`转为布尔值，将`onClick`的值转为一个函数，将`style`属性的值转为一个`CSSStyleDeclaration`对象。
