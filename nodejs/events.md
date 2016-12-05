---
title: Events模块
layout: page
category: nodejs
date: 2014-10-20
modifiedOn: 2014-10-20
---

回调函数模式让 Node 可以处理异步操作。但是，为了适应回调函数，异步操作只能有两个状态：开始和结束。对于那些多状态的异步操作（状态1，状态2，状态3，……），回调函数就会无法处理，你不得不将异步操作拆开，分成多个阶段。每个阶段结束时，调用下一个回调函数。

为了解决这个问题，Node 提供 Event Emitter 接口。通过事件，解决多状态异步操作的响应问题。

## 概述

Event Emitter 是一个接口，可以在任何对象上部署。这个接口由`events`模块提供。

```javascript
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
```

`events`模块的`EventEmitter`是一个构造函数，可以用来生成事件发生器的实例`emitter`。

然后，事件发生器的实例方法`on`用来监听事件，实例方法`emit`用来发出事件。

```javascript
emitter.on('someEvent', function () {
  console.log('event has occured');
});

function f() {
  console.log('start');
  emitter.emit('someEvent');
  console.log('end');
}

f()
// start
// event has occured
// end
```

上面代码中，`EventEmitter`对象实例`emitter`就是消息中心。通过`on`方法为`someEvent`事件指定回调函数，通过`emit`方法触发`someEvent`事件。

上面代码还表明，`EventEmitter`对象的事件触发和监听是同步的，即只有事件的回调函数执行以后，函数`f`才会继续执行。

## Event Emitter 接口的部署

Event Emitter 接口可以部署在任意对象上，使得这些对象也能订阅和发布消息。

```javascript
var EventEmitter = require('events').EventEmitter;

function Dog(name) {
  this.name = name;
}

Dog.prototype.__proto__ = EventEmitter.prototype;
// 另一种写法
// Dog.prototype = Object.create(EventEmitter.prototype);

var simon = new Dog('simon');

simon.on('bark', function () {
  console.log(this.name + ' barked');
});

setInterval(function () {
  simon.emit('bark');
}, 500);
```

上面代码新建了一个构造函数`Dog`，然后让其继承`EventEmitter`，因此`Dog`就拥有了`EventEmitter`的接口。最后，为`Dog`的实例指定`bark`事件的监听函数，再使用`EventEmitter`的`emit`方法，触发`bark`事件。

Node 内置模块`util`的`inherits`方法，提供了另一种继承 Event Emitter 接口的方法。

```javascript
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Radio = function (station) {
    var self = this;

    setTimeout(function() {
      self.emit('open', station);
    }, 0);
    setTimeout(function() {
      self.emit('close', station);
    }, 5000);

    this.on('newListener', function(listener) {
      console.log('Event Listener: ' + listener);
    });
};

util.inherits(Radio, EventEmitter);
module.exports = Radio;
```

上面代码中，`Radio`是一个构造函数，它的实例继承了EventEmitter接口。下面是使用这个模块的例子。

```javascript
var Radio = require('./radio.js');

var station = {
  freq: '80.16',
  name: 'Rock N Roll Radio',
};

var radio = new Radio(station);

radio.on('open', function(station) {
  console.log('"%s" FM %s 打开', station.name, station.freq);
  console.log('♬ ♫♬');
});

radio.on('close', function(station) {
  console.log('"%s" FM %s 关闭', station.name, station.freq);
});
```

## Event Emitter 的实例方法

Event Emitter 的实例方法如下。

- `emitter.on(name, f)` 对事件`name`指定监听函数`f`
- `emitter.addListener(name, f)` `addListener`是`on`方法的别名
- `emitter.once(name, f)` 与`on`方法类似，但是监听函数`f`是一次性的，使用后自动移除
- `emitter.listeners(name)` 返回一个数组，成员是事件`name`所有监听函数
- `emitter.removeListener(name, f)` 移除事件`name`的监听函数`f`
- `emitter.removeAllListeners(name)` 移除事件`name`的所有监听函数

### emit()

`EventEmitter`实例对象的`emit`方法，用来触发事件。它的第一个参数是事件名称，其余参数都会依次传入回调函数。

```javascript
var EventEmitter = require('events').EventEmitter;
var myEmitter = new EventEmitter();

var connection = function (id) {
  console.log('client id: ' + id);
};

myEmitter.on('connection', connection);
myEmitter.emit('connection', 6);
// client id: 6
```

### once()

该方法类似于`on`方法，但是回调函数只触发一次。

```javascript
var EventEmitter = require('events').EventEmitter;
var myEmitter = new EventEmitter;

myEmitter.once('message', function(msg){
  console.log('message: ' + msg);
});

myEmitter.emit('message', 'this is the first message');
myEmitter.emit('message', 'this is the second message');
myEmitter.emit('message', 'welcome to nodejs');
```

上面代码触发了三次message事件，但是回调函数只会在第一次调用时运行。

下面代码指定，一旦服务器连通，只调用一次的回调函数。

{% highlight javascript %}

server.once('connection', function (stream) {
  console.log('Ah, we have our first user!');
});

{% endhighlight %}

该方法返回一个EventEmitter对象，因此可以链式加载监听函数。

### removeListener()

该方法用于移除回调函数。它接受两个参数，第一个是事件名称，第二个是回调函数名称。这就是说，不能用于移除匿名函数。

```javascript
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

emitter.on('message', console.log);

setInterval(function(){
  emitter.emit('message', 'foo bar');
}, 300);

setTimeout(function(){
  emitter.removeListener('message', console.log);
}, 1000);
```

上面代码每300毫秒触发一次message事件，直到1000毫秒后取消监听。

另一个例子是使用removeListener方法模拟once方法。

```javascript
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

function onlyOnce () {
	console.log("You'll never see this again");
	emitter.removeListener("firstConnection", onlyOnce);
}

emitter.on("firstConnection", onlyOnce);
```

### setMaxListeners()

Node默认允许同一个事件最多可以指定10个回调函数。

```javascript
emitter.on('someEvent', function () { console.log('event 1'); });
emitter.on('someEvent', function () { console.log('event 2'); });
emitter.on('someEvent', function () { console.log('event 3'); });
```

超过10个回调函数，会发出一个警告。这个门槛值可以通过`setMaxListeners`方法改变。

```javascript
emitter.setMaxListeners(20);
```

### removeAllListeners()

该方法用于移除某个事件的所有回调函数。

```javascript
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

// some code here

emitter.removeAllListeners("firstConnection");
```

如果不带参数，则表示移除所有事件的所有回调函数。

{% highlight javascript %}

emitter.removeAllListeners();

{% endhighlight %}

### listeners()

`listeners`方法接受一个事件名称作为参数，返回该事件所有回调函数组成的数组。

```javascript
var EventEmitter = require('events').EventEmitter;

var ee = new EventEmitter;

function onlyOnce () {
  console.log(ee.listeners("firstConnection"));
  ee.removeListener("firstConnection", onlyOnce);
  console.log(ee.listeners("firstConnection"));
}

ee.on("firstConnection", onlyOnce)
ee.emit("firstConnection");
ee.emit("firstConnection");

// [ [Function: onlyOnce] ]
// []
```

上面代码显示两次回调函数组成的数组，第一次只有一个回调函数`onlyOnce`，第二次是一个空数组，因为`removeListener`方法取消了回调函数。

## 错误捕获

事件处理过程中抛出的错误，可以使用`try...catch`捕获。

```javascript
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

emitter.on('beep', function () {
  console.log('beep');
});

emitter.on('beep', function () {
  throw Error('oops!');
});

emitter.on('beep', function () {
  console.log('beep again');
});

console.log('before emit');

try {
  emitter.emit('beep');
} catch(err) {
  console.error('caught while emitting:', err.message);
}

console.log('after emit');
```

上面的代码，`beep`一共绑定了三个监听函数。其中，第二个监听函数会抛出错误。执行上面的代码，会得到下面的结果。

```bash
before emit
beep
caught while emitting: oops!
after emit
```

可以看到，第二个监听函数抛出的错误被`try...catch`代码块捕获了。一旦被捕获，该事件后面的监听函数都不会再执行了。

如果不使用`try...catch`，可以让进程监听`uncaughtException`事件。

```javascript
process.on('uncaughtException', function (err) {
  console.error('uncaught exception:', err.stack || err);
  // 关闭资源
  closeEverything(function(err) {
    if (err)
      console.error('Error while closing everything:', err.stack || err);
    // 退出进程
    process.exit(1);
  });
});
```

## 事件类型

Events模块默认支持两个事件。

- `newListener`事件：添加新的回调函数时触发。
- `removeListener`事件：移除回调时触发。

```javascript
ee.on("newListener", function (evtName) {
  console.log("New Listener: " + evtName);
});

ee.on("removeListener", function (evtName) {
  console.log("Removed Listener: " + evtName);
});

function foo() {}

ee.on("save-user", foo);
ee.removeListener("save-user", foo);

// New Listener: removeListener
// New Listener: save-user
// Removed Listener: save-user
```

上面代码会触发两次newListener事件，以及一次removeListener事件。

## 参考链接

- Hage Yaapa, [Node.js EventEmitter Tutorial](http://www.hacksparrow.com/node-js-eventemitter-tutorial.html)
