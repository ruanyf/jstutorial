---
title: Child Process模块
layout: page
category: nodejs
date: 2014-05-24
modifiedOn: 2014-05-24
---

child_process模块用于新建子进程。子进程的运行结果储存在系统缓存之中（最大200KB），等到子进程运行结束以后，主进程再用回调函数读取子进程的运行结果。

## exec()

exec方法用于执行bash命令。

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

上面代码的exec方法用于新建一个子进程，然后缓存它的运行结果，运行结束后调用回调函数。

exec方法的第一个参数是所要执行的shell命令，第二个参数是回调函数，该函数接受三个参数，分别是发生的错误、标准输出的显示结果、标准错误的显示结果。

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

上面的代码还有一个好处。监听data事件以后，可以实时输出结果，否则只有等到子进程结束，才会输出结果。所以，如果子进程运行时间较长，或者是持续运行，第二种写法更好。

下面是另一个例子，假定有一个child.js文件。

```javascript

// child.js

var exec = require('child_process').exec;
exec('node -v', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});

```

运行后，该文件的输出结果如下。

```bash

$ node child.js

stdout: v0.11.14

stderr:

```

exec方法会直接调用bash（`/bin/sh`程序）来解释命令，所以如果有用户输入的参数，exec方法是不安全的。

```javascript

var path = ";user input";
child_process.exec('ls -l ' + path, function (err, data) {
    console.log(data);
});

```

上面代码表示，在bash环境下，`ls -l; user input`会直接运行。如果用户输入恶意代码，将会带来安全风险。因此，在有用户输入的情况下，最好不使用exec方法，而是使用execFile方法。

## execFile()

execFile方法直接执行特定的程序，参数作为数组传入，不会被bash解释，因此具有较高的安全性。

```javascript

var child_process = require('child_process');

var path = ".";
child_process.execFile('/bin/ls', ['-l', path], function (err, result) {
    console.log(result)
});

```

上面代码中，假定path来自用户输入，如果其中包含了分号或反引号，ls程序不理解它们的含义，因此也就得不到运行结果，安全性就得到了提高。

## spawn()

spawn方法创建一个子进程来执行特定命令，用法与execFile方法类似，但是没有回调函数，只能通过监听事件，来获取运行结果。它适用于子进程长时间运行的情况。

```javascript

var child_process = require('child_process');

var path = ".";
var ls = child_process.spawn('/bin/ls', ['-l', path]);
ls.stdout.on('data', function (data) {
    console.log(data.toString());
});

```

spawn对象返回一个对象，代表新进程，对该对象的标准输出监听data事件，可以得到输出结果。

spawn方法与exec方法非常类似，只是使用格式略有区别。

```javascript

child_process.exec(command, [options], callback)
child_process.spawn(command, [args], [options])

```

## fork()

fork方法直接创建一个子进程，执行Node脚本，`fork('./child.js')` 相当于 `spawn('node', ['./child.js'])` 。与spawn方法不同的是，fork会在父进程与子进程之间，建立一个通信管道，用于进程之间的通信。

```javascript

var n = child_process.fork('./child.js');
n.on('message', function(m) {
  console.log('PARENT got message:', m);
});
n.send({ hello: 'world' });

```

上面代码中，fork方法返回一个代表进程间通信管道的对象，对该对象可以监听message事件，用来获取子进程返回的信息，也可以向子进程发送信息。

child.js脚本的内容如下。

```javascript

process.on('message', function(m) {
  console.log('CHILD got message:', m);
});
process.send({ foo: 'bar' });

```

上面代码中，子进程监听message事件，并向父进程发送信息。

## 参考链接

- Lift Security Team, [Avoiding Command Injection in Node.js](https://blog.liftsecurity.io/2014/08/19/Avoid-Command-Injection-Node.js): 为什么execFile()的安全性高于exec()
- Krasimir Tsonev, [Node.js: managing child processes](http://tech.pro/tutorial/2074/nodejs-managing-child-processes) 
- byvoid, [Node.js中的child_process及进程通信](https://www.byvoid.com/zhs/blog/node-child-process-ipc): exec()、execFile()、fork()、spawn()四种方法的简介
