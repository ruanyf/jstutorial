---
title: Events模块
layout: page
category: nodejs
date: 2014-10-20
modifiedOn: 2014-10-20
---

## 概述

### 基本用法

`Events`模块是Node对“发布/订阅”模式（publish/subscribe）的实现。一个对象通过这个模块，向另一个对象传递消息。该模块通过EventEmitter属性，提供了一个构造函数。该构造函数的实例具有on方法，可以用来监听指定事件，并触发回调函数。任意对象都可以发布指定事件，被EventEmitter实例的on方法监听到。

下面是一个实例，先建立一个消息中心，然后通过on方法，为各种事件指定回调函数，从而将程序转为事件驱动型，各个模块之间通过事件联系。

```javascript
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

ee.on('someEvent', function () {
  console.log('event has occured');
});

function f() {
  console.log('start');
  ee.emit('someEvent');
  console.log('end');
}

f()
// start
// event has occured
// end
```

上面代码在加载`events`模块后，通过`EventEmitter`属性建立了一个`EventEmitter`对象实例，这个实例就是消息中心。然后，通过`on`方法为`someEvent`事件指定回调函数。最后，通过`emit`方法触发`someEvent`事件。

上面代码也表明，`EventEmitter`对象的事件触发和监听是同步的。

### on方法

默认情况下，Node.js允许同一个事件最多可以指定10个回调函数。

{% highlight javascript %}

ee.on("someEvent", function () { console.log("event 1"); });
ee.on("someEvent", function () { console.log("event 2"); });
ee.on("someEvent", function () { console.log("event 3"); });

{% endhighlight %}

超过10个回调函数，会发出一个警告。这个门槛值可以通过setMaxListeners方法改变。

{% highlight javascript %}

ee.setMaxListeners(20);

{% endhighlight %}

### emit方法

EventEmitter实例的emit方法，用来触发事件。它的第一个参数是事件名称，其余参数都会依次传入回调函数。

{% highlight javascript %}

var EventEmitter = require('events').EventEmitter;
var myEmitter = new EventEmitter;

var connection = function(id){
  console.log('client id: ' + id);
};

myEmitter.on('connection', connection);
myEmitter.emit('connection', 6);

{% endhighlight %}

## EventEmitter接口的部署

Events模块的作用，还在于其他模块可以部署EventEmitter接口，从而也能够订阅和发布消息。

{% highlight javascript %}

var EventEmitter = require('events').EventEmitter;

function Dog(name) {
  this.name = name;
}

Dog.prototype.__proto__ = EventEmitter.prototype;
// 另一种写法
// Dog.prototype = Object.create(EventEmitter.prototype);

var simon = new Dog('simon');

simon.on('bark', function(){
  console.log(this.name + ' barked');
});

setInterval(function(){
  simon.emit('bark');
}, 500);

{% endhighlight %}

上面代码新建了一个构造函数Dog，然后让其继承EventEmitter，因此Dog就拥有了EventEmitter的接口。最后，为Dog的实例指定bark事件的监听函数，再使用EventEmitter的emit方法，触发bark事件。

Node内置模块util的inherits方法，提供了另一种继承EventEmitter的写法。

```javascript
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Radio = function(station) {

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

上面代码中，Radio是一个构造函数，它的实例继承了EventEmitter接口。下面是使用这个模块的例子。

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

## 事件类型

Events模块默认支持两个事件。

- newListener事件：添加新的回调函数时触发。
- removeListener事件：移除回调时触发。

{% highlight javascript %}

ee.on("newListener", function (evtName){
  console.log("New Listener: " + evtName);
});

ee.on("removeListener", function (evtName){
  console.log("Removed Listener: " + evtName);
});

function foo (){}

ee.on("save-user", foo);
ee.removeListener("save-user", foo);

// New Listener: removeListener
// New Listener: save-user
// Removed Listener: save-user

{% endhighlight %}

上面代码会触发两次newListener事件，以及一次removeListener事件。

## EventEmitter实例的方法

### once方法

该方法类似于on方法，但是回调函数只触发一次。

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

### removeListener方法

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

{% highlight javascript %}

var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter;

function onlyOnce () {
	console.log("You'll never see this again");
	emitter.removeListener("firstConnection", onlyOnce);
}

emitter.on("firstConnection", onlyOnce);

{% endhighlight %}

**（3）removeAllListeners方法**

该方法用于移除某个事件的所有回调函数。

{% highlight javascript %}

var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter;

// some code here

emitter.removeAllListeners("firstConnection");

{% endhighlight %}

如果不带参数，则表示移除所有事件的所有回调函数。

{% highlight javascript %}

emitter.removeAllListeners();

{% endhighlight %}

**（4）listener方法**

该方法接受一个事件名称作为参数，返回该事件所有回调函数组成的数组。

{% highlight javascript %}

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

{% endhighlight %}

上面代码显示两次回调函数组成的数组，第一次只有一个回调函数onlyOnce，第二次是一个空数组，因为removeListener方法取消了回调函数。

## 参考链接

- Hage Yaapa, [Node.js EventEmitter Tutorial](http://www.hacksparrow.com/node-js-eventemitter-tutorial.html)
