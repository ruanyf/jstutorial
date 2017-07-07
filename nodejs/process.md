---
title: process对象
category: nodejs
layout: page
date: 2014-10-20
modifiedOn: 2014-10-20
---

`process`对象是 Node 的一个全局对象，提供当前 Node 进程的信息。它可以在脚本的任意位置使用，不必通过`require`命令加载。该对象部署了`EventEmitter`接口。

## 属性

`process`对象提供一系列属性，用于返回系统信息。

- `process.argv`：返回一个数组，成员是当前进程的所有命令行参数。
- `process.env`：返回一个对象，成员为当前Shell的环境变量，比如`process.env.HOME`。
- `process.installPrefix`：返回一个字符串，表示 Node 安装路径的前缀，比如`/usr/local`。相应地，Node 的执行文件目录为`/usr/local/bin/node`。
- `process.pid`：返回一个数字，表示当前进程的进程号。
- `process.platform`：返回一个字符串，表示当前的操作系统，比如`Linux`。
- `process.title`：返回一个字符串，默认值为`node`，可以自定义该值。
- `process.version`：返回一个字符串，表示当前使用的 Node 版本，比如`v7.10.0`。

`process`对象还有一些属性，用来指向 Shell 提供的接口。

### process.stdout

`process.stdout`属性返回一个对象，表示标准输出。该对象的`write`方法等同于`console.log`，可用在标准输出向用户显示内容。

```javascript
console.log = function(d) {
  process.stdout.write(d + '\n');
};
```

下面代码表示将一个文件导向标准输出。

```javascript
var fs = require('fs');

fs.createReadStream('wow.txt')
  .pipe(process.stdout);
```

上面代码中，由于`process.stdout`和`process.stdin`与其他进程的通信，都是流（stream）形式，所以必须通过`pipe`管道命令中介。

```javascript
var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('wow.txt')
  .pipe(zlib.createGzip())
  .pipe(process.stdout);
```

上面代码通过`pipe`方法，先将文件数据压缩，然后再导向标准输出。

### process.stdin

`process.stdin`返回一个对象，表示标准输入。

```javascript
process.stdin.pipe(process.stdout)
```

上面代码表示将标准输入导向标准输出。

由于stdin和stdout都部署了stream接口，所以可以使用stream接口的方法。

```javascript
process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write('data: ' + chunk);
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});
```

### stderr

`process.stderr`属性指向标准错误。

### process.argv，process.execPath，process.execArgv

`process.argv`属性返回一个数组，由命令行执行脚本时的各个参数组成。它的第一个成员总是`node`，第二个成员是脚本文件名，其余成员是脚本文件的参数。

请看下面的例子，新建一个脚本文件`argv.js`。

```javascript
// argv.js
console.log("argv: ", process.argv);
```

命令行下调用这个脚本，会得到以下结果。

```javascript
$ node argv.js a b c
[ 'node', '/path/to/argv.js', 'a', 'b', 'c' ]
```

上面代码表示，`argv`返回数组的成员依次是命令行的各个部分，真正的参数实际上是从`process.argv[2]`开始。要得到真正的参数部分，可以把`argv.js`改写成下面这样。

```javascript
// argv.js
var myArgs = process.argv.slice(2);
console.log(myArgs);
```

`process.execPath`属性返回执行当前脚本的Node二进制文件的绝对路径。

```javascript
> process.execPath
'/usr/local/bin/node'
>
```

`process.execArgv`属性返回一个数组，成员是命令行下执行脚本时，在 Node 可执行文件与脚本文件之间的命令行参数。

```bash
# script.js的代码为
# console.log(process.execArgv);
$ node --harmony script.js --version
```

### process.env

`process.env`属性返回一个对象，包含了当前Shell的所有环境变量。比如，`process.env.HOME`返回用户的主目录。

通常的做法是，新建一个环境变量`NODE_ENV`，用它确定当前所处的开发阶段，生产阶段设为`production`，开发阶段设为`develop`或`staging`，然后在脚本中读取`process.env.NODE_ENV`即可。

运行脚本时，改变环境变量，可以采用下面的写法。

```bash
$ export NODE_ENV=production && node app.js
# 或者
$ NODE_ENV=production node app.js
```

## 方法

`process`对象提供以下方法：

- `process.chdir()`：切换工作目录到指定目录。
- `process.cwd()`：返回运行当前脚本的工作目录的路径。
- `process.exit()`：退出当前进程。
- `process.getgid()`：返回当前进程的组ID（数值）。
- `process.getuid()`：返回当前进程的用户ID（数值）。
- `process.nextTick()`：指定回调函数在当前执行栈的尾部、下一次Event Loop之前执行。
- `process.on()`：监听事件。
- `process.setgid()`：指定当前进程的组，可以使用数字ID，也可以使用字符串ID。
- `process.setuid()`：指定当前进程的用户，可以使用数字ID，也可以使用字符串ID。

### process.cwd()，process.chdir()

`cwd`方法返回进程的当前目录（绝对路径），`chdir`方法用来切换目录。

```bash
> process.cwd()
'/home/aaa'

> process.chdir('/home/bbb')
> process.cwd()
'/home/bbb'
```

注意，`process.cwd()`与`__dirname`的区别。前者进程发起时的位置，后者是脚本的位置，两者可能是不一致的。比如，`node ./code/program.js`，对于`process.cwd()`来说，返回的是当前目录（`.`）；对于`__dirname`来说，返回是脚本所在目录，即`./code/program.js`。

## process.nextTick()

`process.nextTick`将任务放到当前一轮事件循环（Event Loop）的尾部。

```bash
process.nextTick(function () {
  console.log('下一次Event Loop即将开始!');
});
```

上面代码可以用`setTimeout(f,0)`改写，效果接近，但是原理不同。

```bash
setTimeout(function () {
  console.log('已经到了下一轮Event Loop！');
}, 0)
```

`setTimeout(f,0)`是将任务放到下一轮事件循环的头部，因此`nextTick`会比它先执行。另外，`nextTick`的效率更高，因为不用检查是否到了指定时间。

根据Node的事件循环的实现，基本上，进入下一轮事件循环后的执行顺序如下。

1. `setTimeout(f,0)`
1. 各种到期的回调函数
1. `process.nextTick`
push(), sort(), reverse(), and splice() 

### process.exit()

`process.exit`方法用来退出当前进程。它可以接受一个数值参数，如果参数大于0，表示执行失败；如果等于0表示执行成功。

```javascript
if (err) {
  process.exit(1);
} else {
  process.exit(0);
}
```

如果不带有参数，`exit`方法的参数默认为0。

注意，`process.exit()`很多时候是不需要的。因为如果没有错误，一旦事件循环之中没有待完成的任务，Node 本来就会退出进程，不需要调用`process.exit(0)`。这时如果调用了，进程会立刻退出，不管有没有异步任务还在执行，所以不如等 Node 自然退出。另一方面，如果发生错误，Node 往往也会退出进程，也不一定要调用`process.exit(1)`。

```javascript
function printUsageStdout() {
  process.stdout.write('...some long text ...');
}

if (true) {
  printUsageToStdout();
  process.exit(1);
}
```

上面的代码可能不会达到预期效果。因为`process.stdout`有时会变成异步，不能保证一定会在当前事件循环之中输出所有内容，而`process.exit`会使当前进程立刻退出。

更安全的方法是使用`exitcode`属性，指定退出状态，然后再抛出一个错误。

```javascript
if (true) {
  printUsageToStdout();
  process.exitCode = 1;
  throw new Error("xx condition failed");
}
```

`process.exit()`执行时，会触发`exit`事件。

### process.on()

`process`对象部署了EventEmitter接口，可以使用`on`方法监听各种事件，并指定回调函数。

```javascript
process.on('uncaughtException', function(err){
  console.error('got an error: %s', err.message);
  process.exit(1);
});

setTimeout(function(){
  throw new Error('fail');
}, 100);
```

上面代码是`process`监听Node的一个全局性事件`uncaughtException`，只要有错误没有捕获，就会触发这个事件。

`process`支持的事件还有下面这些。

- `data`事件：数据输出输入时触发
- `SIGINT`事件：接收到系统信号`SIGINT`时触发，主要是用户按`Ctrl + c`时触发。
- `SIGTERM`事件：系统发出进程终止信号`SIGTERM`时触发
- `exit`事件：进程退出前触发

```javascript
process.on('SIGINT', function () {
  console.log('Got a SIGINT. Goodbye cruel world');
  process.exit(0);
});

// 也可以忽略这个信号
process.on('SIGINT', function() {
  console.log("Ignored Ctrl-C");
});
```

使用时，向该进程发出系统信号，就会导致进程退出。

```bash
$ kill -s SIGINT [process_id]
```

`SIGTERM`信号表示内核要求当前进程停止，进程可以自行停止，也可以忽略这个信号。

```javascript
var http = require('http');

var server = http.createServer(function (req, res) {
  // ...
});

process.on('SIGTERM', function () {
  server.close(function () {
    process.exit(0);
  });
});

```

上面代码表示，进程接到`SIGTERM`信号之后，关闭服务器，然后退出进程。需要注意的是，这时进程不会马上退出，而是要回应完最后一个请求，处理完所有回调函数，然后再退出。

`exit`事件在Node进程退出前触发。

```javascript
process.on('exit', function() {
  console.log('Goodbye');
});
```

### process.kill()

`process.kill`方法用来对指定ID的线程发送信号，默认为`SIGINT`信号。

```javascript
process.kill(process.pid, 'SIGTERM');
```

上面代码用于杀死当前进程。

```javascript
process.on('SIGTERM', function(){
  console.log('terminating');
  process.exit(1);
});

setTimeout(function(){
    console.log('sending SIGTERM to process %d', process.pid);
    process.kill(process.pid, 'SIGTERM');
}, 500);

setTimeout(function(){
    console.log('never called');
}, 1000);
```

上面代码中，500毫秒后向当前进程发送SIGTERM信号（终结进程），因此1000毫秒后的指定事件不会被触发。

## 事件

### exit事件

当前进程退出时，会触发`exit`事件，可以对该事件指定回调函数。

```javascript
process.on('exit', function () {
  fs.writeFileSync('/tmp/myfile', '需要保存到硬盘的信息');
});
```

下面是一个例子，进程退出时，显示一段日志。

```javascript
process.on("exit", code =>
  console.log("exiting with code: " + code))
```

注意，此时回调函数只能执行同步操作，不能包含异步操作，因为执行完回调函数，进程就会退出，无法监听到回调函数的操作结果。

```javascript
process.on('exit', function(code) {
  // 不会执行
  setTimeout(function() {
    console.log('This will not run');
  }, 0);
});
```

上面代码在`exit`事件的回调函数里面，指定了一个下一轮事件循环，所要执行的操作。这是无效的，不会得到执行。

### beforeExit事件

beforeExit事件在Node清空了Event Loop以后，再没有任何待处理的任务时触发。正常情况下，如果没有任何待处理的任务，Node进程会自动退出，设置beforeExit事件的监听函数以后，就可以提供一个机会，再部署一些任务，使得Node进程不退出。

beforeExit事件与exit事件的主要区别是，beforeExit的监听函数可以部署异步任务，而exit不行。

此外，如果是显式终止程序（比如调用process.exit()），或者因为发生未捕获的错误，而导致进程退出，这些场合不会触发beforeExit事件。因此，不能使用该事件替代exit事件。

### uncaughtException事件

当前进程抛出一个没有被捕捉的错误时，会触发`uncaughtException`事件。

```javascript
process.on('uncaughtException', function (err) {
  console.error('An uncaught error occurred!');
  console.error(err.stack);
  throw new Error('未捕获错误');
});
```

部署`uncaughtException`事件的监听函数，是免于Node进程终止的最后措施，否则Node就要执行`process.exit()`。出于除错的目的，并不建议发生错误后，还保持进程运行。

抛出错误之前部署的异步操作，还是会继续执行。只有完成以后，Node进程才会退出。

```javascript
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

setTimeout(function() {
  console.log('本行依然执行');
}, 500);

// 下面的表达式抛出错误
nonexistentFunc();
```

上面代码中，抛出错误之后，此前setTimeout指定的回调函数亦然会执行。

### 信号事件

操作系统内核向Node进程发出信号，会触发信号事件。实际开发中，主要对SIGTERM和SIGINT信号部署监听函数，这两个信号在非Windows平台会导致进程退出，但是只要部署了监听函数，Node进程收到信号后就不会退出。

```javascript
// 读取标准输入，这主要是为了不让当前进程退出
process.stdin.resume();

process.on('SIGINT', function() {
  console.log('SIGINT信号，按Control-D退出');
});
```

上面代码部署了SIGINT信号的监听函数，当用户按下Ctrl-C后，会显示提示文字。

## 进程的退出码

进程退出时，会返回一个整数值，表示退出时的状态。这个整数值就叫做退出码。下面是常见的Node进程退出码。

- 0，正常退出
- 1，发生未捕获错误
- 5，V8执行错误
- 8，不正确的参数
- 128 + 信号值，如果Node接受到退出信号（比如SIGKILL或SIGHUP），它的退出码就是128加上信号值。由于128的二进制形式是10000000, 所以退出码的后七位就是信号值。

Bash可以使用环境变量`$?`，获取上一步操作的退出码。

```bash
$ node nonexist.js
Error: Cannot find 'nonexist.js'

$ echo $?
1
```

上面代码中，Node执行一个不存在的脚本文件，结果报错，退出码就是1。

## 参考链接

- José F. Romaniello, [Graceful shutdown in node.js](http://joseoncode.com/2014/07/21/graceful-shutdown-in-node-dot-js/)
