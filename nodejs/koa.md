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

## 参考链接

- [Koa Guide](https://github.com/koajs/koa/blob/master/docs/guide.md)
