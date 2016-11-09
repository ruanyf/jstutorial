# 定时器

”定时器“指的是Node的一些特定方法，可以让函数在指定时间执行。

## Event Loop

“定时器”的实现是建立在“Event Loop”机制（中文译为“事件循环”）基础上的。所谓“Event Loop”是指Node的异步回调函数的处理机制。如果遇到异步操作，Node会把这些操作交给操作系统处理，自己继续往下执行。然后，等到空闲时，不断循环检查操作系统是否返回结果。一旦得到结果，就执行对应的回调函数。

“Event Loop”由Node底层的libuv库的[`uv_run`](https://github.com/libuv/libuv/blob/master/src/unix/core.c#L321)函数实现，它的代码大致如下。

```
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
    ...

    uv__update_time(loop);
    uv__run_timers(loop);
    ran_pending = uv__run_pending(loop);
    uv__run_idle(loop);
    uv__run_prepare(loop);

    timeout = 0;
    if ((mode == UV_RUN_ONCE && !ran_pending) || mode == UV_RUN_DEFAULT)
      timeout = uv_backend_timeout(loop);

    uv__io_poll(loop, timeout);
    uv__run_check(loop);
    uv__run_closing_handles(loop);

    ...
}
```

每一轮事件循环，就会执行一次上面的代码。它的基本步骤如下。

1. 更新当前时间（`uv__update_time`）
1. 执行`setTimeout`和`setInterval`（`uv__run_timers`）
1. 执行（以前轮次的）定时器的回调函数（`uv__run_pending`）
1. 执行I/O事件的回调函数（`uv__io_poll`）
1. 执行`setImmediate`（`uv__run_check`）

这里需要注意的是，执行`setTimeout`、`setInterval`和`setImmediate`这三个方法时，它们指定的回调函数是不会在本轮事件循环执行的，而是会放入一个数组，在以后轮次的事件循环清空。

## process.nextTick()

`process.nextTick`方法用于指定在本轮Event Loop即将结束、下轮Event Loop开始前执行的回调函数。因此，`process.nextTick`的回调函数会阻塞下一个Event Loop。所以，`process.nextTick`不能出现嵌套，否则会阻塞掉整个Event Loop，不过此时Node会报错。

```javascript
var http = require('http');

function compute() {
  // performs complicated calculations continuously
  // ...
  process.nextTick(compute);
}

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
}).listen(5000, '127.0.0.1');

compute();
```

上面代码中，服务器是不会响应HTTP请求的，因为嵌套的`process.nextTick`在网络I/O之前不断执行，不会结束。

实际使用时，需要分清`process.nextTick`、`setImmediate`和`setTimeout(fn, 0)`的执行顺序。

```javascript
setImmediate(function () {console.log('setImmediate')});
process.nextTick(function () {console.log('nextTick')});
setTimeout(function () {console.log('setTimeout')}, 0);
// nextTick
// setTimeout
// setImmediate
```

上面代码中，`nextTick`之所以排在最前面，是因为它在本轮 Event Loop 的结尾执行，而`setTimeout(fn, 0)`和`setImmediate`都是在下一轮 Event Loop 执行。

`process.nextTick`的一个应用是，确保回调函数异步执行。

```javascript
function asyncReal(data, callback) {
  process.nextTick(function() {
    callback(data === 'foo');
  });
}
```

上面代码中，即使`asyncReal`同步执行，`callback`也能确保是异步执行。

另一个用途是保证某些方法在初始化之后执行。下面是一个数据流的库文件。

```javascript
var EventEmitter = require('events').EventEmitter;

function StreamLibrary(resourceName) {
  this.emit('start');
  // ... 从文件读取数据，然后触发data事件
  this.emit('data', chunkRead);
}
StreamLibrary.prototype.__proto__ = EventEmitter.prototype;
```

上面这样的写法，使用时根本不会监听到`start`事件。

```javascript
var stream = new StreamLibrary('fooResource');

stream.on('start', function() {
  console.log('Reading has started');
});

stream.on('data', function(chunk) {
  console.log('Received: ' + chunk);
});
```

上面代码中，`start`事件是监听不到的。因为`StreamLibrary`一初始化时，就会触发`start`事件，这时根本还没指定回调函数。这就需要使用`process.nextTick`改写`StreamLibrary`库。

```javascript
function StreamLibrary(resourceName) {
  var self = this;

  process.nextTick(function() {
    self.emit('start');
  });

  // ... 从文件读取数据，然后触发data事件
  this.emit('data', chunkRead);
}
```

上面代码中，只有当前Event Loop的所有代码执行完，才会触发`start`事件，这就确保这个事件可以被监听到。

## setImmediate()

`setImmediate`方法用于指定在下一轮 Event Loop 执行的回调函数。

```javascript
setImmediate(callback[, arg][, ...])
```

它的第一个参数就是指定的回调函数，其他参数则会被传入回调函数。它返回一个对象，供`clearImmediate()`使用。

`setImmediate`指定的回调函数，执行顺序是在I/O事件的回调函数之后，`setTimeout`和`setInterval`方法指定的回调函数（延迟时间非零的情况下）之前。

如果延迟时间为零，即`setImmediate`与`setTimeout(fn, 0)`哪个命令会先执行？答案是不确定。

```javascript
var x = function () {
  setTimeout(function() {
    console.log('Timeout 0')
  }, 0);
};

var y = function () {
  setImmediate(function() {
    console.log('Immediate')
  });
};

setTimeout(function () {
  x();
  y();
}, 10);
```

上面代码执行后，`Timeout 0`和`Immediate`都有可能首先输出。

考虑到`setImmediate`语义更清楚，行为更规范，建议总是使用它替代`setTimeout(fn, 0)`。

## clearImmediate()

`clearImmediate`方法用于清除`setImmediate`设置的定时器。它的参数是`setImmediate`方法返回的定时器对象。

## 参考链接

- Kishore Nallan, [Understanding process.nextTick()](http://howtonode.org/understanding-process-next-tick)
