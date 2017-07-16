---
title: Web Notifications API
layout: page
category: bom
date: 2014-05-06
modifiedOn: 2014-05-06
---

## 概述

Notification API 是浏览器的通知接口，用于在用户的桌面（而不是网页上）显示通知信息，桌面电脑和手机都适用，比如通知用户收到了一封 Email。具体的实现形式由浏览器自行部署，对于手机来说，一般显示在顶部的通知栏。

如果网页代码调用这个API，浏览器会询问用户是否接受。只有在用户同意的情况下，通知信息才会显示。

下面的代码用于检查浏览器是否支持这个 API。

```javascript
if (window.Notification) {
  // 支持
} else {
  // 不支持
}
```

目前，Chrome和Firefox在桌面端部署了这个API，Firefox和Blackberry在手机端部署了这个API。

```javascript

if(window.Notification && Notification.permission !== "denied") {
	Notification.requestPermission(function(status) {
		var n = new Notification('通知标题', { body: '这里是通知内容！' }); 
	});
}

```

上面代码检查当前浏览器是否支持Notification对象，并且当前用户准许使用该对象，然后调用Notification.requestPermission方法，向用户弹出一条通知。

## Notification对象的属性和方法

### Notification.permission

Notification.permission属性，用于读取用户给予的权限，它是一个只读属性，它有三种状态。

- default：用户还没有做出任何许可，因此不会弹出通知。
- granted：用户明确同意接收通知。
- denied：用户明确拒绝接收通知。

### Notification.requestPermission()

Notification.requestPermission方法用于让用户做出选择，到底是否接收通知。它的参数是一个回调函数，该函数可以接收用户授权状态作为参数。

```javascript

Notification.requestPermission(function (status) {
  if (status === "granted") {
    var n = new Notification("Hi!");
  } else {
    alert("Hi!");
  }
});

```

上面代码表示，如果用户拒绝接收通知，可以用alert方法代替。

## Notification实例对象

### Notification构造函数

Notification对象作为构造函数使用时，用来生成一条通知。

```javascript

var notification = new Notification(title, options);

```

Notification构造函数的title属性是必须的，用来指定通知的标题，格式为字符串。options属性是可选的，格式为一个对象，用来设定各种设置。该对象的属性如下：

- dir：文字方向，可能的值为 auto、ltr（从左到右）和rtl（从右到左），一般是继承浏览器的设置。
- lang：使用的语种，比如 en-US、zh-CN。
- body：通知内容，格式为字符串，用来进一步说明通知的目的。。
- tag：通知的 ID，格式为字符串。一组相同tag的通知，不会同时显示，只会在用户关闭前一个通知后，在原位置显示。
- icon：图标的 URL，用来显示在通知上。

上面这些属性，都是可读写的。

下面是一个生成Notification实例对象的例子。

```javascript
var notification = new Notification('收到新邮件', {
  body: '您总共有3封未读邮件。'
});

notification.title // "收到新邮件"
notification.body // "您总共有3封未读邮件。"
```

### 实例对象的事件

Notification 实例会触发以下事件。

- show：通知显示给用户时触发。
- click：用户点击通知时触发。
- close：用户关闭通知时触发。
- error：通知出错时触发（大多数发生在通知无法正确显示时）。

这些事件有对应的onshow、onclick、onclose、onerror方法，用来指定相应的回调函数。addEventListener方法也可以用来为这些事件指定回调函数。

```javascript

notification.onshow = function() {
  console.log('Notification shown');
};

```

### close方法

Notification实例的close方法用于关闭通知。

```javascript

var n = new Notification("Hi!");

// 手动关闭
n.close();

// 自动关闭
n.onshow = function () { 
  setTimeout(n.close.bind(n), 5000); 
}

```

上面代码说明，并不能从通知的close事件，判断它是否为用户手动关闭。

## 参考链接

- Aurelio De Rosa, [An Introduction to the Web Notifications API](http://www.sitepoint.com/introduction-web-notifications-api/)
- MDN, [Notification](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
