---
title: os模块
category: nodejs
layout: page
date: 2015-03-16
modifiedOn: 2015-03-16
---

os模块提供与操作系统相关的方法。

## API

### os.tmpdir()

`os.tmpdir`方法返回操作系统默认的临时文件目录。

## Socket通信

下面例子列出当前系列的所有IP地址。

```javascript

var os = require('os');
var interfaces = os.networkInterfaces();

for (item in interfaces) {
  console.log('Network interface name: ' + item);
  for (att in interfaces[item]) {
    var address = interfaces[item][att];

    console.log('Family: ' + address.family);
    console.log('IP Address: ' + address.address);
    console.log('Is Internal: ' + address.internal);
    console.log('');
  }
  console.log('==================================');
}

```
