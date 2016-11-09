---
title: Path模块
category: nodejs
layout: page
date: 2014-12-29
modifiedOn: 2014-12-29
---

## path.join()

`path.join`方法用于连接路径。该方法的主要用途在于，会正确使用当前系统的路径分隔符，Unix系统是”/“，Windows系统是”\“。

```
var path = require('path');
path.join(mydir, "foo");

```

上面代码在Unix系统下，会返回路径`mydir/foo`。

## path.resolve()

`path.resolve`方法用于将相对路径转为绝对路径。

它可以接受多个参数，依次表示所要进入的路径，直到将最后一个参数转为绝对路径。如果根据参数无法得到绝对路径，就以当前所在路径作为基准。除了根目录，该方法的返回值都不带尾部的斜杠。

```javascript

// 格式
path.resolve([from ...], to)

// 实例
path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile')

```

上面代码的实例，执行效果类似下面的命令。

```bash

$ cd foo/bar
$ cd /tmp/file/
$ cd ..
$ cd a/../subfile
$ pwd

```

更多例子。

```javascript
path.resolve('/foo/bar', './baz')
// '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/')
// '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')
// 如果当前目录是/home/myself/node，返回
// /home/myself/node/wwwroot/static_files/gif/image.gif
```

该方法忽略非字符串的参数。

## accessSync()

`accessSync`方法用于同步读取一个路径。

下面的代码可以用于判断一个目录是否存在。

```javascript
function exists(pth, mode) {
  try {
    fs.accessSync(pth, mode);
    return true;
  } catch (e) {
    return false;
  }
}
```

## path.relative

`path.relative`方法接受两个参数，这两个参数都应该是绝对路径。该方法返回第二个路径相对于第一个路径的那个相对路径。

```javascript
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')
// '../../impl/bbb'
```

上面代码中，如果当前目录是`/data/orandea/test/aaa`，进入`path.relative`返回的相对路径，就会到达`/data/orandea/impl/bbb`。

如果`path.relative`方法的两个参数相同，则返回一个空字符串。

## path.parse()

`path.parse()`方法可以返回路径各部分的信息。

```javascript
var myFilePath = '/someDir/someFile.json';
path.parse(myFilePath).base
// "someFile.json"
path.parse(myFilePath).name
// "someFile"
path.parse(myFilePath).ext
// ".json"
```
