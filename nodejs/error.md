# Error 对象

## 概述

Node的异步操作的特性，使得抛出（`throw`）错误不可行，因为捕捉错误的代码可能已经执行完毕，无法再捕捉错误了。这时，唯一的办法就是将`Error`对象传给下一个回调函数。

Express的错误中间件。

```javascript
app.use(function(err, req, res, next) {
  console.error(err.stack);

  // 401, 403, 404 错误不发邮件
  if (!err.statusCode || err.statusCode === 500) {
    emails.error({ err: err, req: req });
  }

  res.send(err.statusCode || 500, err.message);
});
```

## 自定义错误

可以用下面的方法，自定义自己的错误对象。

```javascript
var assert = require('assert');
var util = require('util');

function NotFound(message) {
  Error.call(this);
  this.message = message;
}

util.inherits(NotFound, Error);

var error = new NotFound('/home 没有找到');
```

上面代码中，`error`同时是`NotFound`和`Error`的实例。

## stack属性

ECMAScript规格只规定，Error对象的实例必须有`message`属性，但是各个JavaScript实现往往还添加了堆栈信息。

- V8引擎是`error.stack`
- Firefox也是`error.stack`，但有自己的格式
- IE不提供`stack`属性

以下介绍V8引擎的API，它在Node和Chrome浏览器之中可以使用。

## Error.stackTraceLimit

V8默认将调用堆栈限制在10条记录，但是可以在运行时，通过改变`Error.stackTraceLimit`属性调整这个值。

```javascript
Error.stackTraceLimit = 0; // 不显示任何堆栈
Error.stackTraceLimit = Infinity; // 堆栈数目不存在任何限制
```

## Error.captureStackTrace()

`Error.captureStackTrace`方法用来在指定对象上，为`stack`属性设立一个取值器（getter），返回`Error.captureStackTrace`方法运行时的堆栈。

```javascript
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack // 返回代码调用堆栈
```

上面方法的第二行在`myObject`对象上，新建一个`stack`属性，值等于这时`Error.captureStackTrace`的调用堆栈。

`Error.captureStackTrace`还可以接受第二个参数，是一个处在调用堆栈上的函数。它的作用是将堆栈上，这个函数及其以上的调用记录都隐藏起来不显示。

```javascript
function createError(msg, status){
  var err = new Error(msg);
  err.status = status;
  Error.captureStackTrace(err);
  return err;
}

var err = createError('test', 500);
throw err;

// Error: test
//     at createError (/home/admin/x.js:6:9)
//     at Object.<anonymous> (/home/admin/x.js:10:11)
//     at Module._compile (module.js:409:26)
//     ...
```

上面代码中，堆栈信息最上面一行会显示`createError`，表示这个错误是在执行`createError`函数时产生的。现在，为`Error.captureStackTrace`方法加入第二个参数`createError`，就可以把这一行隐藏。

```javascript
function createError(msg, status) {
  var err = new Error(msg);
  err.status = status;
  Error.captureStackTrace(err, createError);
  return err;
}

var err = createError('test', 500);
throw err;

// Error: test
//     at Object.<anonymous> (/home/admin/x.js:10:11)
//     at Module._compile (module.js:409:26)
//     ...
```

这个错误通常用于自定义错误。

```javascript
function NotFound(message) {
  Error.call(this);
  Error.captureStackTrace(this, NotFound);
  this.message = message;
  this.statusCode = 404;
}
```

上面代码定义了一个`NotFound`对象，它继承了`Error`对象。需要的时候，就可以抛出这个对象的实例。

## Error.prepareStackTrace()

`Error.prepareStackTrace`方法的作用是，定制`err.stack`的返回值。

```javascript
Error.prepareStackTrace = function () {
  return 'MyStackObject';
}

try {
  throw new Error();
} catch (e) {
  console.log(e.stack);
}
// "MyStackObject"
```

上面代码定制`err.stack`返回一个字符串`MyStackObject`。

`Error.prepareStackTrace`方法可以接受两个参数，第一个是错误对象实例，第二个是表示堆栈的数组，它的每个成员都是一个堆栈记录对象，有一些方法可以在这个对象上调用。

```javascript
function a () {
  b();
}

function b () {
  var err = new Error;

  Error.prepareStackTrace = function (err, stack) {
    return stack;
  };

  Error.captureStackTrace(err, b);

  err.stack.forEach(function (frame) {
    console.error(' call: %s:%d - %s'
      , frame.getFileName()
      , frame.getLineNumber()
      , frame.getFunctionName());
  });
}

a();
//  call: /home/admin/x.js:2 - a
//  call: /home/admin/x.js:22 - null
//  call: module.js:409 - Module._compile
//  call: module.js:416 - Module._extensions..js
//  call: module.js:343 - Module.load
//  call: module.js:300 - Module._load
//  call: module.js:441 - Module.runMain
//  call: node.js:139 - startup
//  call: node.js:968 - null
```

上面代码中，`Error.prepareStackTrace`方法定制了`err.stack`，返回一个数组。该数组的每个成员都有`getFileName()`、`getLineNumber()`、`getFunctionName()`等方法，可以用来获取文件名、行号、函数名。

## 参考链接

- Guillermo Rauch, [A String is not an Error](http://www.devthought.com/2011/12/22/a-string-is-not-an-error/)
