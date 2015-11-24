---
title: Promise对象
layout: page
category: advanced
date: 2012-12-22
modifiedOn: 2013-11-28
---

Promise是JavaScript异步操作解决方案。介绍Promise之前，先对异步操作做一个详细介绍。

## JavaScript的异步执行

### 概述

Javascript语言的执行环境是"单线程"（single thread）。所谓"单线程"，就是指一次只能完成一件任务。如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务。

这种模式的好处是实现起来比较简单，执行环境相对单纯；坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。常见的浏览器无响应（假死），往往就是因为某一段Javascript代码长时间运行（比如死循环），导致整个页面卡在这个地方，其他任务无法执行。

JavaScript语言本身并不慢，慢的是读写外部数据，比如等待Ajax请求返回结果。这个时候，如果对方服务器迟迟没有响应，或者网络不通畅，就会导致脚本的长时间停滞。

为了解决这个问题，Javascript语言将任务的执行模式分成两种：同步（Synchronous）和异步（Asynchronous）。"同步模式"就是传统做法，后一个任务等待前一个任务结束，然后再执行，程序的执行顺序与任务的排列顺序是一致的、同步的。这往往用于一些简单的、快速的、不涉及读写的操作。

"异步模式"则完全不同，每一个任务分成两段，第一段代码包含对外部数据的请求，第二段代码被写成一个回调函数，包含了对外部数据的处理。第一段代码执行完，不是立刻执行第二段代码，而是将程序的执行权交给第二个任务。等到外部数据返回了，再由系统通知执行第二段代码。所以，程序的执行顺序与任务的排列顺序是不一致的、异步的。

以下总结了"异步模式"编程的几种方法，理解它们可以让你写出结构更合理、性能更出色、维护更方便的JavaScript程序。

### 回调函数

回调函数是异步编程最基本的方法。

假定有两个函数f1和f2，后者等待前者的执行结果。

```javascript
f1();
f2();
```

如果`f1`是一个很耗时的任务，可以考虑改写`f1`，把`f2`写成`f1`的回调函数。

```javascript
function f1(callback){
  setTimeout(function () {
    // f1的任务代码
    callback();
  }, 1000);
}
```

执行代码就变成下面这样：

```javascript
f1(f2);
```

采用这种方式，我们把同步操作变成了异步操作，f1不会堵塞程序运行，相当于先执行程序的主要逻辑，将耗时的操作推迟执行。

回调函数的优点是简单、容易理解和部署，缺点是不利于代码的阅读和维护，各个部分之间高度[耦合](http://en.wikipedia.org/wiki/Coupling_(computer_programming))（Coupling），使得程序结构混乱、流程难以追踪（尤其是回调函数嵌套的情况），而且每个任务只能指定一个回调函数。

### 事件监听

另一种思路是采用事件驱动模式。任务的执行不取决于代码的顺序，而取决于某个事件是否发生。

还是以f1和f2为例。首先，为f1绑定一个事件（这里采用的jQuery的[写法](http://api.jquery.com/on/)）。

```javascript
f1.on('done', f2);
```

上面这行代码的意思是，当f1发生done事件，就执行f2。然后，对f1进行改写：

```javascript
function f1(){
  setTimeout(function () {
    // f1的任务代码
    f1.trigger('done');
  }, 1000);
}
```

上面代码中，`f1.trigger('done')`表示，执行完成后，立即触发`done`事件，从而开始执行`f2`。

这种方法的优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以"[去耦合](http://en.wikipedia.org/wiki/Decoupling)"（Decoupling），有利于实现模块化。缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。

### 发布/订阅

"事件"完全可以理解成"信号"，如果存在一个"信号中心"，某个任务执行完成，就向信号中心"发布"（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做"[发布/订阅模式](http://en.wikipedia.org/wiki/Publish-subscribe_pattern)"（publish-subscribe pattern），又称"[观察者模式](http://en.wikipedia.org/wiki/Observer_pattern)"（observer pattern）。

这个模式有多种[实现](http://msdn.microsoft.com/en-us/magazine/hh201955.aspx)，下面采用的是Ben Alman的[Tiny Pub/Sub](https://gist.github.com/661855)，这是jQuery的一个插件。

首先，f2向"信号中心"jQuery订阅"done"信号。

{% highlight javascript %}

jQuery.subscribe("done", f2);

{% endhighlight %}

然后，f1进行如下改写：

{% highlight javascript %}

function f1(){
	setTimeout(function () {
		// f1的任务代码
		jQuery.publish("done");
	}, 1000);
}

{% endhighlight %}

jQuery.publish("done")的意思是，f1执行完成后，向"信号中心"jQuery发布"done"信号，从而引发f2的执行。

f2完成执行后，也可以取消订阅（unsubscribe）。

{% highlight javascript %}

jQuery.unsubscribe("done", f2);

{% endhighlight %}

这种方法的性质与"事件监听"类似，但是明显优于后者。因为我们可以通过查看"消息中心"，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

## 异步操作的流程控制

如果有多个异步操作，就存在一个流程控制的问题：确定操作执行的顺序，以后如何保证遵守这种顺序。

```js
function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function() { callback(arg * 2); }, 1000);
}
```

上面代码的async函数是一个异步任务，非常耗时，每次执行需要1秒才能完成，然后再调用回调函数。

如果有6个这样的异步任务，需要全部完成后，才能执行下一步的final函数。

```js
function final(value) {
  console.log('完成: ', value);
}
```

请问应该如何安排操作流程？

```js
async(1, function(value){
  async(value, function(value){
    async(value, function(value){
      async(value, function(value){
        async(value, function(value){
          async(value, final);
        });
      });
    });
  });
});
```

上面代码采用6个回调函数的嵌套，不仅写起来麻烦，容易出错，而且难以维护。

### 串行执行

我们可以编写一个流程控制函数，让它来控制异步任务，一个任务完成以后，再执行另一个。这就叫串行执行。

```js
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];
function series(item) {
  if(item) {
    async( item, function(result) {
      results.push(result);
      return series(items.shift());
    });
  } else {
    return final(results);
  }
}
series(items.shift());
```

上面代码中，函数series就是串行函数，它会依次执行异步任务，所有任务都完成后，才会执行final函数。items数组保存每一个异步任务的参数，results数组保存每一个异步任务的运行结果。

### 并行执行

流程控制函数也可以是并行执行，即所有异步任务同时执行，等到全部完成以后，才执行final函数。

```js
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];

items.forEach(function(item) {
  async(item, function(result){
    results.push(result);
    if(results.length == items.length) {
      final(results);
    }
  })
});
```

上面代码中，forEach方法会同时发起6个异步任务，等到它们全部完成以后，才会执行final函数。

并行执行的好处是效率较高，比起串行执行一次只能执行一个任务，较为节约时间。但是问题在于如果并行的任务较多，很容易耗尽系统资源，拖慢运行速度。因此有了第三种流程控制方式。

### 并行与串行的结合

所谓并行与串行的结合，就是设置一个门槛，每次最多只能并行执行n个异步任务。这样就避免了过分占用系统资源。

```js
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];
var running = 0;
var limit = 2;

function launcher() {
  while(running < limit && items.length > 0) {
    var item = items.shift();
    async(item, function(result) {
      results.push(result);
      running--;
      if(items.length > 0) {
        launcher();
      } else if(running == 0) {
        final();
      }
    });
    running++;
  }
}

launcher();
```

上面代码中，最多只能同时运行两个异步任务。变量running记录当前正在运行的任务数，只要低于门槛值，就再启动一个新的任务，如果等于0，就表示所有任务都执行完了，这时就执行final函数。

## Promise对象

### 简介

Promise对象是CommonJS工作组提出的一种规范，目的是为异步操作提供[统一接口](http://wiki.commonjs.org/wiki/Promises/A)。

那么，什么是Promises？

首先，它是一个对象，也就是说与其他JavaScript对象的用法，没有什么两样；其次，它起到代理作用（proxy），充当异步操作与回调函数之间的中介。它使得异步操作具备同步操作的接口，使得程序具备正常的同步运行的流程，回调函数不必再一层层嵌套。

简单说，它的思想是，每一个异步任务立刻返回一个Promise对象，由于是立刻返回，所以可以采用同步操作的流程。这个Promises对象有一个then方法，允许指定回调函数，在异步任务完成后调用。

比如，异步操作`f1`返回一个Promise对象，它的回调函数`f2`写法如下。

```javascript
(new Promise(f1)).then(f2);
```

这种写法对于多层嵌套的回调函数尤其方便。

```javascript
// 传统写法
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // ...
      });
    });
  });
});

// Promises的写法
(new Promise(step1))
  .then(step2)
  .then(step3)
  .then(step4);
```

从上面代码可以看到，采用Promises接口以后，程序流程变得非常清楚，十分易读。

注意，为了便于理解，上面代码的Promise对象的生成格式，做了简化，真正的语法请参照下文。

总的来说，传统的回调函数写法使得代码混成一团，变得横向发展而不是向下发展。Promises规范就是为了解决这个问题而提出的，目标是使用正常的程序流程（同步），来处理异步操作。它先返回一个Promise对象，后面的操作以同步的方式，寄存在这个对象上面。等到异步操作有了结果，再执行前期寄放在它上面的其他操作。

Promises原本只是社区提出的一个构想，一些外部函数库率先实现了这个功能。ECMAScript 6将其写入语言标准，因此目前JavaScript语言原生支持Promise对象。

### Promise接口

前面说过，Promise接口的基本思想是，异步任务返回一个Promise对象。

Promise对象只有三种状态。

- 异步操作“未完成”（pending）
- 异步操作“已完成”（resolved，又称fulfilled）
- 异步操作“失败”（rejected）

这三种的状态的变化途径只有两种。

- 异步操作从“未完成”到“已完成”
- 异步操作从“未完成”到“失败”。

这种变化只能发生一次，一旦当前状态变为“已完成”或“失败”，就意味着不会再有新的状态变化了。因此，Promise对象的最终结果只有两种。

- 异步操作成功，Promise对象传回一个值，状态变为`resolved`。
- 异步操作失败，Promise对象抛出一个错误，状态变为`rejected`。

Promise对象使用`then`方法添加回调函数。`then`方法可以接受两个回调函数，第一个是异步操作成功时（变为`resolved`状态）时的回调函数，第二个是异步操作失败（变为`rejected`）时的回调函数（可以省略）。一旦状态改变，就调用相应的回调函数。

```javascript
// po是一个Promise对象
po.then(
  console.log,
  console.error
);
```

上面代码中，Promise对象`po`使用`then`方法绑定两个回调函数：操作成功时的回调函数`console.log`，操作失败时的回调函数`console.error`（可以省略）。这两个函数都接受异步操作传回的值作为参数。

`then`方法可以链式使用。

```javascript
po
  .then(step1)
  .then(step2)
  .then(step3)
  .then(
    console.log,
    console.error
  );
```

上面代码中，`po`的状态一旦变为`resolved`，就依次调用后面每一个`then`指定的回调函数，每一步都必须等到前一步完成，才会执行。最后一个`then`方法的回调函数`console.log`和`console.error`，用法上有一点重要的区别。`console.log`只显示回调函数`step3`的返回值，而`console.error`可以显示`step1`、`step2`、`step3`之中任意一个发生的错误。也就是说，假定`step1`操作失败，抛出一个错误，这时`step2`和`step3`都不会再执行了（因为它们是操作成功的回调函数，而不是操作失败的回调函数）。Promises对象开始寻找，接下来第一个操作失败时的回调函数，在上面代码中是`console.error`。这就是说，Promises对象的错误有传递性。

从同步的角度看，上面的代码大致等同于下面的形式。

```javascript
try {
  var v1 = step1(po);
  var v2 = step2(v1);
  var v3 = step3(v2);
  console.log(v3);
} catch (error) {
  console.error(error);
}
```

### Promise对象的生成

ES6提供了原生的Promise构造函数，用来生成Promise实例。

下面代码创造了一个Promise实例。

```javascript
var promise = new Promise(function(resolve, reject) {
  // 异步操作的代码

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`。它们是两个函数，由JavaScript引擎提供，不用自己部署。

`resolve`函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从`Pending`变为`Resolved`），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；`reject`函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从`Pending`变为`Rejected`），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise实例生成以后，可以用`then`方法分别指定`Resolved`状态和`Reject`状态的回调函数。

```javascript
po.then(function(value) {
  // success
}, function(value) {
  // failure
});
```

### 用法辨析

Promise的用法，简单说就是一句话：使用`then`方法添加回调函数。但是，不同的写法有一些细微的差别，请看下面四种写法，它们的差别在哪里？

```javascript
// 写法一
doSomething().then(function () {
  return doSomethingElse();
});

// 写法二
doSomething().then(function () {
  doSomethingElse();
});

// 写法三
doSomething().then(doSomethingElse());

// 写法四
doSomething().then(doSomethingElse);
```

为了便于讲解，这四种写法都再用`then`方法接一个回调函数`finalHandler`。写法一的`finalHandler`回调函数的参数，是`doSomethingElse`函数的运行结果。

```javascript
doSomething().then(function () {
  return doSomethingElse();
}).then(finalHandler);
```

写法二的`finalHandler`回调函数的参数是`undefined`。

```javascript
doSomething().then(function () {
  doSomethingElse();
  return;
}).then(finalHandler);
```

写法三的`finalHandler`回调函数的参数，是`doSomethingElse`函数返回的回调函数的运行结果。

```javascript
doSomething().then(doSomethingElse())
  .then(finalHandler);
```

写法四与写法一只有一个差别，那就是`doSomethingElse`会接收到`doSomething()`返回的结果。

```javascript
doSomething().then(doSomethingElse)
  .then(finalHandler);
```

## Promise的应用

### 加载图片

我们可以把图片的加载写成一个`Promise`对象。

```javascript
var preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```

### Ajax操作

Ajax操作是典型的异步操作，传统上往往写成下面这样。

```javascript
function search(term, onload, onerror) {
  var xhr, results, url;
  url = 'http://example.com/search?q=' + term;

  xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onload = function (e) {
    if (this.status === 200) {
      results = JSON.parse(this.responseText);
      onload(results);
    }
  };
  xhr.onerror = function (e) {
    onerror(e);
  };

  xhr.send();
}

search("Hello World", console.log, console.error);
```

如果使用Promise对象，就可以写成下面这样。

```javascript
function search(term) {
  var url = 'http://example.com/search?q=' + term;
  var xhr = new XMLHttpRequest();
  var result;

  var p = new Promise(function (resolve, reject) {
    xhr.open('GET', url, true);
    xhr.onload = function (e) {
      if (this.status === 200) {
        result = JSON.parse(this.responseText);
        resolve(result);
      }
    };
    xhr.onerror = function (e) {
      reject(e);
    };
    xhr.send();
  });

  return p;
}

search("Hello World").then(console.log, console.error);
```

加载图片的例子，也可以用Ajax操作完成。

```javascript
function imgLoad(url) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'blob';
    request.onload = function() {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(new Error('图片加载失败：' + request.statusText));
      }
    };
    request.onerror = function() {
      reject(new Error('发生网络错误'));
    };
    request.send();
  });
}
```

### 小结

Promise对象的优点在于，让回调函数变成了规范的链式写法，程序流程可以看得很清楚。它的一整套接口，可以实现许多强大的功能，比如为多个异步操作部署一个回调函数、为多个回调函数中抛出的错误统一指定处理方法等等。

而且，它还有一个前面三种方法都没有的好处：如果一个任务已经完成，再添加回调函数，该回调函数会立即执行。所以，你不用担心是否错过了某个事件或信号。这种方法的缺点就是，编写和理解都相对比较难。

## 参考链接

- Sebastian Porto, [Asynchronous JS: Callbacks, Listeners, Control Flow Libs and Promises](http://sporto.github.com/blog/2012/12/09/callbacks-listeners-promises/)
- Rhys Brett-Bowen, [Promises/A+ - understanding the spec through implementation](http://modernjavascript.blogspot.com/2013/08/promisesa-understanding-by-doing.html)
- Matt Podwysocki, Amanda Silver, [Asynchronous Programming in JavaScript with “Promises”](http://blogs.msdn.com/b/ie/archive/2011/09/11/asynchronous-programming-in-javascript-with-promises.aspx)
- Marc Harter, [Promise A+ Implementation](https://gist.github.com//wavded/5692344)
- Bryan Klimt, [What’s so great about JavaScript Promises?](http://blog.parse.com/2013/01/29/whats-so-great-about-javascript-promises/)
- Jake Archibald, [JavaScript Promises There and back again](http://www.html5rocks.com/en/tutorials/es6/promises/)
- Mikito Takada, [7. Control flow, Mixu's Node book](http://book.mixu.net/node/ch7.html)
