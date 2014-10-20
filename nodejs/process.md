---
title: process对象
category: nodejs
layout: page
date: 2014-10-20
modifiedOn: 2014-10-20
---

process对象提供node进程本身的信息。它可以通过全局变量process访问，不必使用require命令加载。

## 属性

process对象提供一系列属性，用于返回系统信息。

- **process.argv**：返回当前进程的命令行参数数组。
- **process.env**：返回一个对象，成员为当前shell的环境变量，比如process.env.HOME。
- **process.execPath**：node执行文件所在的目录，比如`/usr/lcoal/bin/node`。
- **process.installPrefix**：node的安装路径的前缀，比如`/usr/local`，则node的执行文件目录为`/usr/local/bin/node`。
- **process.pid**：当前进程的进程号。
- **process.platform**：当前系统平台，比如Linux。
- **process.stdout**：指向标准输出。
- **process.stdin**：指向标准输入。
- **process.stderr**：指向标准错误。
- **process.title**：默认值为“node”，可以自定义该值。
- **process.version**：Node的版本，比如v0.10.18。

下面是主要属性的介绍。

**（1）process.stdout**

process.stdout用来控制标准输出，也就是在命令行窗口向用户显示内容。它的write方法等同于console.log。

{% highlight javascript %}

exports.log = function() {
    process.stdout.write(format.apply(this, arguments) + '\n');
};

{% endhighlight %}

**（2）process.argv**

process.argv返回命令行脚本的各个参数组成的数组。第一个成员是node可执行文件，第二个成员是脚本文件名，其余成员是脚本文件的参数。

请看下面的例子，新建一个脚本文件argv.js。

{% highlight javascript %}

// argv.js

console.log("argv: ",process.argv);
console.log("argc: ",process.argc);

{% endhighlight %}

在命令行下调用这个脚本，会得到以下结果。

{% highlight javascript %}

node argv.js a b c
# [ 'node', '/path/to/argv.js', 'a', 'b', 'c' ]

{% endhighlight %}

上面代码表示，argv返回数组的成员依次是命令行的各个部分。要得到真正的参数部分，可以把argv.js改写成下面这样。

{% highlight javascript %}

// argv.js

var myArgs = process.argv.slice(2);
console.log(myArgs);

{% endhighlight %}

## 方法

process对象提供以下方法：

- **process.chdir()**：切换工作目录到指定目录。
- **process.cwd()**：返回运行当前脚本的工作目录的路径。
- **process.exit()**：退出当前进程。
- **process.getgid()**：返回当前进程的组ID（数值）。
- **process.getuid()**：返回当前进程的用户ID（数值）。
- **process.nextTick()**：指定回调函数在当前执行栈的尾部、下一次Event Loop之前执行。
- **process.on()**：监听事件。
- **process.setgid()**：指定当前进程的组，可以使用数字ID，也可以使用字符串ID。
- **process.setuid()**：指定当前进程的用户，可以使用数字ID，也可以使用字符串ID。

（1）process.cwd()，process.chdir()

{% highlight bash %}

> process.cwd()
'/home/aaa'

> process.chdir('/home/bbb')
> process.cwd()
'/home/bbb'

{% endhighlight %}

（2）process.nextTick()

process.nextTick()将任务放到当前执行栈的尾部。

{% highlight bash %}

process.nextTick(function () {
    console.log('下一次Event Loop即将开始!');
});

{% endhighlight %}

上面代码可以用`setTimeout(f,0)`改写，效果接近，但是原理不同。`setTimeout(f,0)`是将任务放到当前任务队列的尾部，在下一次Event Loop时执行。另外，nextTick的效率更高，因为不用检查是否到了指定时间。

{% highlight bash %}

setTimeout(function () {
   console.log('已经到了下一轮Event Loop！');
}, 0)

{% endhighlight %}

（3）process.exit()

process.exit方法用来退出当前进程，它可以接受一个数值参数。如果参数大于0，表示执行失败；如果等于0表示执行成功。

```bash

process.exit(1);

```

process.exit()执行时，会触发exit事件。

（4）process.on()

process.on方法用来监听各种事件，并指定回调函数。

```javascript

process.on('uncaughtException', function(err){
    console.log('got an error: %s', err.message);
    process.exit(1);
});

setTimeout(function(){
    throw new Error('fail');
}, 100);

```

（5）process.kill()

process.kill方法用来对指定ID的线程发送信号，默认为SIGINT信号。

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

当前进程退出时，会触发exit事件，可以对该事件指定回调函数。

{% highlight javascript %}

process.on('exit', function () {
  fs.writeFileSync('/tmp/myfile', 'This MUST be saved on exit.');
 });

{% endhighlight %}

### uncaughtException事件

当前进程抛出一个没有被捕捉的意外时，会触发uncaughtException事件。

{% highlight javascript %}

 process.on('uncaughtException', function (err) {
   console.error('An uncaught error occurred!');
   console.error(err.stack);
 });

{% endhighlight %}
