---
title: Koa 框架
layout: page
category: nodejs
date: 2015-04-17
modifiedOn: 2015-04-17
---

Koa是一个类似于Express的Web开发框架，开发人员也是同一组人，但是使用了Generator函数，进行了架构的重新设计。

## 中间件

Koa的中间件很像Express的中间件，也是对HTTP请求进行处理的函数，但是必须是一个Generator函数。而且，Koa的中间件是一个级联式（Cascading）的结构，也就是说，属于是层层调用，第一个中间件调用第二个中间件，第二个调用第三个，以此类推。上游的中间件必须等到下游的中间件返回结果，才会继续执行，这点很像递归。

中间件通过当前应用的use方法注册。

```javascript
app.use(function* (next){
  var start = new Date; // （1）
  yield next;  // （2）
  var ms = new Date - start; // （3）
  console.log('%s %s - %s', this.method, this.url, ms); // （4）
});
```

上面代码中，`app.use`方法的参数就是中间件，它是一个Generator函数，最大的特征就是function命令与参数之间，必须有一个星号。Generator函数的参数next，表示下一个中间件。

Generator函数内部使用yield命令，将程序的执行权转交给下一个中间件，即`yield next`，要等到下一个中间件返回结果，才会继续往下执行。上面代码中，Generator函数体内部，第一行赋值语句首先执行，开始计时，第二行yield语句将执行权交给下一个中间件，当前中间件就暂停执行。等到后面的中间件全部执行完成，执行权就回到原来暂停的地方，继续往下执行，这时才会执行第三行，计算这个过程一共花了多少时间，第四行将这个时间打印出来。

下面是一个两个中间件级联的例子。

```javascript
app.use(function *() {
  this.body = "header\n";
  yield saveResults();
  this.body += "footer\n";
});

function saveResults*() {
  this.body += "Results Saved!\n";
}
```

上面代码中，第一个中间件调用第二个中间件saveResults，它们都向`this.body`写入内容。最后，`this.body`的输出如下。

```javascript
header
Results Saved!
footer
```

由于Koa要求中间件唯一的参数就是next，导致如果要传入其他参数，必须另外写一个返回Generator函数的函数。

```javascript
function logger(format) {
  return function *(next){
    var str = format
      .replace(':method', this.method)
      .replace(':url', this.url);

    console.log(str);

    yield next;
  }
}

app.use(logger(':method :url'));
```

上面代码中，真正的中间件是logger函数的返回值，而logger函数是可以接受参数的。

## 错误处理机制

Koa提供内置的错误处理机制，任何中间件抛出的错误都会被捕捉到，引发向客户端返回一个500错误，而不会导致进程停止，因此也就不需要forever这样的模块重启进程。

```javascript
app.use(function *() {
  throw new Error();
});
```

上面代码中，中间件内部抛出一个错误，并不会导致Koa应用挂掉。Koa内置的错误处理机制，会捕捉到这个错误。

当然，也可以额外部署自己的错误处理机制。

```javascript
app.use(function *() {
  try {
    yield saveResults();
  } catch (err) {
    this.throw(400, '数据无效');
  }
});
```

上面代码自行部署了try...catch代码块，一旦产生错误，就用`this.throw`方法抛出。该方法可以将指定的状态码和错误信息，返回给客户端。

## 源码解读

每一个网站就是一个app，它由`lib/application`定义。

```javascript
function Application() {
  if (!(this instanceof Application)) return new Application;
  this.env = process.env.NODE_ENV || 'development';
  this.subdomainOffset = 2;
  this.middleware = [];
  this.context = Object.create(context);
  this.request = Object.create(request);
  this.response = Object.create(response);
}

var app = Application.prototype;

exports = module.exports = Application;
```

`app.use()`用于注册中间件，即将Generator函数放入中间件数组。

```javascript
app.use = function(fn){
  if (!this.experimental) {
    // es7 async functions are allowed
    assert(fn && 'GeneratorFunction' == fn.constructor.name, 'app.use() requires a generator function');
  }
  debug('use %s', fn._name || fn.name || '-');
  this.middleware.push(fn);
  return this;
};
```

`app.listen()`就是`http.createServer(app.callback()).listen(...)`的缩写。

```javascript
app.listen = function(){
  debug('listen');
  var server = http.createServer(this.callback());
  return server.listen.apply(server, arguments);
};

app.callback = function(){
  var mw = [respond].concat(this.middleware);
  var fn = this.experimental
    ? compose_es7(mw)
    : co.wrap(compose(mw));
  var self = this;

  if (!this.listeners('error').length) this.on('error', this.onerror);

  return function(req, res){
    res.statusCode = 404;
    var ctx = self.createContext(req, res);
    onFinished(res, ctx.onerror);
    fn.call(ctx).catch(ctx.onerror);
  }
};
```

上面代码中，`app.callback()`会返回一个函数，用来处理HTTP请求。它的第一行`mw = [respond].concat(this.middleware)`，表示将respond函数（这也是一个Generator函数）放入`this.middleware`，现在mw就变成了`[respond, S1, S2, S3]`。

`compose(mw)`将中间件数组转为一个层层调用的Generator函数。

```javascript
function compose(middleware){
  return function *(next){
    if (!next) next = noop();

    var i = middleware.length;

    while (i--) {
      next = middleware[i].call(this, next);
    }

    yield *next;
  }
}

function *noop(){}
```

上面代码中，下一个generator函数总是上一个Generator函数的参数，从而保证了层层调用。

`var fn = co.wrap(gen)`则是将Generator函数包装成一个自动执行的函数，并且返回一个Promise。

```javascript
//co package
co.wrap = function (fn) {
  return function () {
    return co.call(this, fn.apply(this, arguments));
  };
};
```

由于`co.wrap(compose(mw))`执行后，返回的是一个Promise，所以可以对其使用catch方法指定捕捉错误的回调函数`fn.call(ctx).catch(ctx.onerror)`。

将所有的上下文变量都放进context对象。

```javascript
app.createContext = function(req, res){
  var context = Object.create(this.context);
  var request = context.request = Object.create(this.request);
  var response = context.response = Object.create(this.response);
  context.app = request.app = response.app = this;
  context.req = request.req = response.req = req;
  context.res = request.res = response.res = res;
  request.ctx = response.ctx = context;
  request.response = response;
  response.request = request;
  context.onerror = context.onerror.bind(context);
  context.originalUrl = request.originalUrl = req.url;
  context.cookies = new Cookies(req, res, this.keys);
  context.accept = request.accept = accepts(req);
  context.state = {};
  return context;
};
```

真正处理HTTP请求的是下面这个Generator函数。

```javascript
function *respond(next) {
  yield *next;

  // allow bypassing koa
  if (false === this.respond) return;

  var res = this.res;
  if (res.headersSent || !this.writable) return;

  var body = this.body;
  var code = this.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    this.body = null;
    return res.end();
  }

  if ('HEAD' == this.method) {
    if (isJSON(body)) this.length = Buffer.byteLength(JSON.stringify(body));
    return res.end();
  }

  // status body
  if (null == body) {
    this.type = 'text';
    body = this.message || String(code);
    this.length = Buffer.byteLength(body);
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  this.length = Buffer.byteLength(body);
  res.end(body);
}
```

## 参考链接

- [Koa Guide](https://github.com/koajs/koa/blob/master/docs/guide.md)
- William XING, [Is Koa.js right for me?](http://william.xingyp.com/is-koa-js-right-for-me/)
