---
title: Path模块
category: nodejs
layout: page
date: 2014-12-29
modifiedOn: 2014-12-29
---

### path.resolve()

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
