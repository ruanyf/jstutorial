---
title: Node应用程序开发
category: nodejs
layout: page
date: 2015-10-23
modifiedOn: 2015-10-23
---

## 启动

通常，我们在Shell启动Node脚本。

```bash
$ node /path/to/your/script.js
```

但是，这个Shell随着你退出Shell就自动结束了。

为了长期运行，Node应用程序可以在后台运行。

```bash
$ node /path/to/your/script.js &
```

但是，在退出Shell以后，如果Node进程要在`console`输出内容，但`console`已经关了（即`STDOUT`已经不存在），这时进程就会退出。也没有办法重新启动。

为了让Node进程在后台长期启动，需要一个daemon（即常驻的服务进程）。有几种方法可以实现。

（1）forever

`forever`是一个Node应用程序，用于一个子进程意外退出时，自动重启。

```bash
# 启动进程
$ forever start example.js

# 列出所有forever启动的正在运行的进程
$ forever list

# 停止进程
$ forever stop example.js
# 或者
$ forever stop 0

# 停止所有正在运行的进程
$ forever stopall
```
