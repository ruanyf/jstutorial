---
title: Web Notifications API
layout: page
category: bom
date: 2014-05-06
modifiedOn: 2014-05-06
---

## 概述

这个API用于在用户的桌面（而不是网页上）显示通知信息，桌面电脑和手机都适用，比如通知用户收到了一封Email。具体的实现形式由浏览器自行部署，对于手机来说，一般显示在顶部的通知栏。

如果网页代码调用这个API，浏览器会询问用户是否接受。只有在用户同意的情况下，通知信息才会显示。

下面的代码用于检查浏览器是否支持这个API。

```javascript

if ('Notification' in window) {
  // 支持
} else {
  // 不支持
}

```

目前，Chrome和Firefox在桌面端部署了这个API，Firefox和Blackberry在手机端部署了这个API。

## 基本用法

支持这个API的浏览器，原生提供一个构造函数Notification。这个构造函数接受两个参数，第一个参数是通知的标题，格式为字符串；第二个参数是可选的，格式为一个对象，用来设定各种设置。该对象的属性如下：

- body：字符串，用来进一步说明通知的目的。
- lang：设定通知所使用的语言，比如en-US、zh-CN。
- dir：设定语言的阅读方法，ltr表示从左到右，rtl表示从右到左，一般是继承浏览器的设置。
- tag： 字符串，用来设定通知的ID标签。
- icon：图像文件的网址，用来设定通知的图标。

上面这些属性，都可以通过实例对象读取。

下面是一个生成Notification实例对象的例子。

```javascript

var notification = new Notification('收到新邮件', {
  body: '您总共有3封未读邮件。'
});

notification.title // "收到新邮件"
notification.body // "您总共有3封未读邮件。"

```

通知框显示后，用户可以手动关闭，也可以在代码中用close方法关闭。

```javascript

notification.close();

```

## Notification对象

作为构造函数，Notification有一个permission属性，用于读取用户给于的权限。它可以取三个值。

- denied：用户不接受通知。
- granted：用户同意接受通知。
- default：用户的选择未知。

Notification.requestPermission方法，用于获取用户的同意。它可以接受一个回调函数，用于处理用户的选择。回调函数的参数可能取到的值是granted、denied和default。

```javascript

if (Notification.permission === "granted") {
    var notification = new Notification("Hi there!");
} else if (Notification.permission !== 'denied') {

	Notification.requestPermission(function (permission) {
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });

}

```

## 实例对象的事件

Notification实例对象有以下事件，可以用来指定回调函数。

- click：用户点击通知时触发。
- close：用户或者浏览器关闭通知时触发。
- error：通知发生错误时触发。
- show：通知显示时触发。

```javascript

notification.onshow = function() {
  console.log('Notification shown');
};

```

## 参考链接

- Aurelio De Rosa, [An Introduction to the Web Notifications API](http://www.sitepoint.com/introduction-web-notifications-api/)
- MDN, [Notification](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
