---
title: JavaScript异步编程的模式
layout: page
category: special
date: 2012-12-22
modifiedOn: 2013-11-28
---

## 概述

Javascript语言的执行环境是"单线程"（single thread）。所谓"单线程"，就是指一次只能完成一件任务。如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务，以此类推。

这种模式的好处是实现起来比较简单，执行环境相对单纯；坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。常见的浏览器无响应（假死），往往就是因为某一段Javascript代码长时间运行（比如死循环），导致整个页面卡在这个地方，其他任务无法执行。

为了解决这个问题，Javascript语言将任务的执行模式分成两种：同步（Synchronous）和异步（Asynchronous）。

"同步模式"就是上一段的模式，后一个任务等待前一个任务结束，然后再执行，程序的执行顺序与任务的排列顺序是一致的、同步的；"异步模式"则完全不同，每一个任务有一个或多个回调函数（callback），前一个任务结束后，不是执行后一个任务，而是执行回调函数，后一个任务则是不等前一个任务结束就执行，所以程序的执行顺序与任务的排列顺序是不一致的、异步的。

"异步模式"非常重要。在浏览器端，耗时很长的操作都应该异步执行，避免浏览器失去响应，最好的例子就是Ajax操作。在服务器端，"异步模式"甚至是唯一的模式，因为执行环境是单线程的，如果允许同步执行所有http请求，服务器性能会急剧下降，很快就会失去响应。

以下总结了"异步模式"编程的4种方法，理解它们可以让你写出结构更合理、性能更出色、维护更方便的JavaScript程序。

## 回调函数

回调函数是异步编程最基本的方法。

假定有两个函数f1和f2，后者等待前者的执行结果。

{% highlight javascript %}

f1();

f2();

{% endhighlight %}

如果f1是一个很耗时的任务，可以考虑改写f1，把f2写成f1的回调函数。

{% highlight javascript %}

function f1(callback){
	setTimeout(function () {
		// f1的任务代码
		callback();
	}, 1000);
}

{% endhighlight %}

执行代码就变成下面这样：

{% highlight javascript %}

f1(f2);

{% endhighlight %}

采用这种方式，我们把同步操作变成了异步操作，f1不会堵塞程序运行，相当于先执行程序的主要逻辑，将耗时的操作推迟执行。

回调函数的优点是简单、容易理解和部署，缺点是不利于代码的阅读和维护，各个部分之间高度[耦合](http://en.wikipedia.org/wiki/Coupling_(computer_programming)（Coupling），使得程序结构混乱、流程难以追踪（尤其是回调函数嵌套的情况），而且每个任务只能指定一个回调函数。

## 事件监听

另一种思路是采用事件驱动模式。任务的执行不取决于代码的顺序，而取决于某个事件是否发生。

还是以f1和f2为例。首先，为f1绑定一个事件（这里采用的jQuery的[写法](http://api.jquery.com/on/)）。

{% highlight javascript %}

f1.on('done', f2);

{% endhighlight %}

上面这行代码的意思是，当f1发生done事件，就执行f2。然后，对f1进行改写：

{% highlight javascript %}

function f1(){
	setTimeout(function () {
		// f1的任务代码
		f1.trigger('done');
	}, 1000);
}

{% endhighlight %}

f1.trigger('done')表示，执行完成后，立即触发done事件，从而开始执行f2。

这种方法的优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以"[去耦合](http://en.wikipedia.org/wiki/Decoupling)"（Decoupling），有利于实现模块化。缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。

## 发布/订阅

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

## Promises对象

### 简介

Promises对象是CommonJS工作组提出的一种规范，目的是为异步编程提供[统一接口](http://wiki.commonjs.org/wiki/Promises/A)。

那么，什么是Promises？首先，它是一个对象，也就是说与其他JavaScript对象的用法，没有什么两样；其次，它起到代理作用（proxy），使得异步操作具备同步操作（synchronous code）的接口，即充当异步操作与回调函数之间的中介，使得程序具备正常的同步运行的流程，回调函数不必再一层层包裹起来。

简单说，它的思想是，每一个异步任务返回一个Promise对象，该对象有一个then方法，允许指定回调函数。比如，f1的回调函数f2,可以写成：

{% highlight javascript %}

f1().then(f2);

{% endhighlight %}

这种写法对于嵌套的回调函数尤其有用。

{% highlight javascript %}

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

promiseStep1()
.then(promiseStep2)
.then(promiseStep3)
.then(promiseStep4);

{% endhighlight %}

上面代码的promiseStep1函数是对Step1函数的改写，主要区别是返回一个Promise对象，后面的promiseStep2、promiseStep3和promiseStep4都是如此。

可以看到传统写法使得代码混成一团，变得横向发展而不是向下发展。Promises规范就是为了解决这个问题而提出的，目标是使用正常的程序流程（同步），来处理异步操作。它先返回一个Promise对象，后面的操作以同步的方式，寄存在这个对象上面。等到异步操作有了结果，再执行前期寄放在它上面的其他操作。

then方法可以接受两个回调函数，第一个是操作成功（resolved）时的回调函数，第二个是操作失败（rejected）时的回调函数。

{% highlight javascript %}

var chainPromise = first()
	.then(second)
	.then(third)
	.then(fourth)
	.then(console.log, console.error);

{% endhighlight %}

上面代码先用then方法依次定义了三个操作成功时的回调函数second、third、fourth，最后再用then方法定义了操作成功时的回调函数console.log，以及操作失败时的回调函数console.error。

console.log和console.error这两个最后的回调函数，用法上有一点重要的区别。console.log只显示回调函数fourth的返回值，而console.error可以显示second、third、fourth这三个回调函数之中任何一个函数发生的错误。也就是说，假定second操作失败，抛出一个错误，这时third和fourth都不会再运行了，Promises对象开始寻找接下来的第一个错误回调函数，在上面代码中是console.error。总之，Promises对象的错误有传递性。

### 主要接口

Promises只是一个规范，JavaScript语言原生不提供支持。一般来说，总是选用现成的函数库。为了真正理解Promises对象，下面我们自己动手写一个Promises的实现。

首先，将Promise定义成构造函数。

{% highlight javascript %}

var Promise = function () {
  this.state = 'pending';
  this.thenables = [];
};

{% endhighlight %}

上面代码表示，Promise的实例对象的state属性默认为“未完成”状态（pending），还有一个thenables属性指向一个数组，用来存放then方法生成的内部对象。

接下来，将具体方法部署在Promise的原型对象上面，这样就可以让所有实例共享。

第一个定义的是then方法，它接受两个参数，分别是异步操作成功时的回调函数（onFulfilled）和出错时的回调函数（onRejected）。为了可以部署链式操作，它必须返回一个新的Promise对象。

{% highlight javascript %}

Promise.prototype.then = function (onFulfilled, onRejected) {
  var thenable = {};
 
  if (typeof onFulfilled == 'function') {
    thenable.fulfill = onFulfilled;
  };
 
  if (typeof onRejected == 'function') {
    thenable.reject = onRejected;
  };
 
  if (this.state != 'pending') {
    setImmediate(function () {
      this._handleThen();
    }.bind(this));
  }
 
  thenable.promise = new Promise();
  this.thenables.push(thenable);
 
  return thenable.promise;
}

{% endhighlight %}

上面代码首先定义了一个内部变量thenable对象，将then方法的参数都加入这个对象的属性。然后，检查当前状态，如果不等于“未完成”，则在当前操作结束后，立即调用_handleThen方法。接着，在thenable对象的promise属性上生成一个新的Promise对象，并在稍后返回这个对象。最后，将thenable对象加入实例对象的thenables数组。

接下来，部署用于改变实例对象状态的resolve方法和reject方法。

{% highlight javascript %}

Promise.prototype.resolve = function (value) {
  if (this.state != 'pending') return;
 
  this.state = 'fulfilled';
  this.value = value;
  this._handleThen();
  return this;
};

Promise.prototype.reject = function (reason) {
  if (this.state != 'pending') return;
 
  this.state = 'rejected';
  this.reason = reason;
  this._handleThen();
  return this;
};

{% endhighlight %}

上面代码表示，这两个方法先检查当前状态是不是“未完成”，如果不是就立即返回；然后，resolve方法将实例对象的state属性从“未完成”变为“完成”（fulfilled），reject方法将state属性从“未完成”变为“失败”（rejected）。如果“完成”，实例对象的value属性等于resolve方法的参数；如果失败，实例对象的reason属性等于reject方法的参数。接着，这两个方法调用_handleThen方法，去完成通过then方法添加的回调函数。等到全部完成后，再返回实例对象。

最后，定义_handleThen方法，用来调用回调函数。

{% highlight javascript %}

Promise.prototype._handleThen = function () {
  if (this.state == 'pending') return;
 
  if (this.thenables.length) {
    for (var i = 0; i < this.thenables.length; i++) {
      var thenPromise = this.thenables[i].promise;
      var returnedVal;
 
      try {
        switch (this.state) {
          case 'fulfilled':
            if (this.thenables[i].fulfill) {
              returnedVal = this.thenables[i].fulfill(this.value);
            } else {
              thenPromise.resolve(this.value);
            }
            break;
          case 'rejected':
            if (this.thenables[i].reject) {
              returnedVal = this.thenables[i].reject(this.reason);
            } else {
              thenPromise.reject(this.reason);
            }
            break;
        }
 
		 if (returnedVal instanceof Promise || typeof returnedVal.then == 'function') {
            returnedVal.then(thenPromise.resolve.bind(thenPromise), thenPromise.reject.bind(thenPromise));
          } else {
            this.thenables[i].promise.resolve(returnedVal);
          }
      } catch (e) {
        thenPromise.reject(e);
      }
    }
    this.thenables = [];
  }
};

{% endhighlight %}

上面代码表示，_handleThen方法只在当前状态不等于“未完成”时执行。该方法首先遍历thenables对象，读取每一个then方法添加的thenable对象。接着，如果当前状态为“完成”，则执行fulfill回调函数；如果当前状态为“失败”，则执行reject回调函数。最后，触发下一个Promise对象的resolve或者reject方法。

### 实例：Ajax操作

Ajax操作是典型的异步操作，传统上往往写成下面这样。

{% highlight javascript %}

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

search("Hello World", f1, f2);

{% endhighlight %}

可以看到上面代码的回调函数，必须直接传入。如果使用Promises，就可以写成下面这样。

{% highlight javascript %}

function search(term) {

	var url = 'http://example.com/search?q=' + term;
	var p = new Promise();
	var xhr = new XMLHttpRequest();
	var result;

	xhr.open('GET', url, true);
 
	xhr.onload = function (e) {
		if (this.status === 200) {
			results = JSON.parse(this.responseText);
			p.resolve(results);
		}
	};
 
	xhr.onerror = function (e) {
		p.reject(e);
	};
 
	xhr.send();
 
	return p;
}

search("Hello World").then(f1, f2);

{% endhighlight %}

用了Promises以后，回调函数就可以用then方法加载。

### 小结

Promises的优点在于，让回调函数变成了变成了规范的链式写法，程序流程可以看得很清楚。它的一整套接口，可以实现许多强大的功能，比如为多个异步操作部署一个回调函数、为多个回调函数中抛出的错误统一指定处理方法等等。

而且，它还有一个前面三种方法都没有的好处：如果一个任务已经完成，再添加回调函数，该回调函数会立即执行。所以，你不用担心是否错过了某个事件或信号。这种方法的缺点就是，编写和理解都相对比较难。

实际可以使用的Promises实现，参见jQuery的deferred对象一节。

## 参考链接

- Sebastian Porto, [Asynchronous JS: Callbacks, Listeners, Control Flow Libs and Promises](http://sporto.github.com/blog/2012/12/09/callbacks-listeners-promises/)
- Rhys Brett-Bowen, [Promises/A+ - understanding the spec through implementation](http://modernjavascript.blogspot.com/2013/08/promisesa-understanding-by-doing.html)
- Matt Podwysocki, Amanda Silver, [Asynchronous Programming in JavaScript with “Promises”](http://blogs.msdn.com/b/ie/archive/2011/09/11/asynchronous-programming-in-javascript-with-promises.aspx)
- Marc Harter, [Promise A+ Implementation](https://gist.github.com//wavded/5692344)
