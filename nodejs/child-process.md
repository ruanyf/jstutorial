---
title: Child Process模块
layout: page
category: nodejs
date: 2014-05-24
modifiedOn: 2014-05-24
---

child_process模块用于新建子进程。子进程的运行结果储存在系统缓存之中（最大200KB），等到子进程运行结束以后，主进程再用回调函数读取子进程的运行结果。

```javascript

var childProcess = require('child_process');

var ls = childProcess.exec('ls -l', function (error, stdout, stderr) {
   if (error) {
     console.log(error.stack);
     console.log('Error code: '+error.code);
   }
   console.log('Child Process STDOUT: '+stdout);
});

```

上面代码的exec方法用于新建一个子进程，然后缓存它的运行结果，运行结束后调用回调函数。exec方法的第一个参数是所要执行的shell命令，第二个参数是回调函数，该函数接受三个参数，分别是发生的错误、标准输出的显示结果、标准错误的显示结果。

由于标准输出和标准错误都是流对象（stream），可以监听data事件，因此上面的代码也可以写成下面这样。

```javascript

var exec = require('child_process').exec;
var child = exec('ls -l');

child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
});
child.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
});
child.on('close', function(code) {
    console.log('closing code: ' + code);
});

```

上面的代码还表明，子进程本身有close事件，可以设置回调函数。
