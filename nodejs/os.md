---
title: os模块
category: nodejs
layout: page
date: 2015-03-16
modifiedOn: 2015-03-16
---

os模块提供与操作系统相关的方法。

## API

### os.EOL

`os.EOL`属性是一个常量，返回当前操作系统的换行符（Windows系统是`\r\n`，其他系统是`\n`）。

```javascript
const fs = require(`fs`);

// bad
fs.readFile('./myFile.txt', 'utf8', (err, data) => {
  data.split('\r\n').forEach(line => {
    // do something
  });
});

// good
const os = require('os');
fs.readFile('./myFile.txt', 'utf8', (err, data) => {
  data.split(os.EOL).forEach(line => {
    // do something
  });
});
```

### os.arch()

`os.arch`方法返回当前计算机的架构。

```javascript
require(`os`).arch()
// "x64"
```

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
