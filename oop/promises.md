---
title: Promises
category: oop
layout: page
date: 2013-09-16
modifiedOn: 2013-10-12
---

## 概述

传统上，JavaScript依靠回调函数处理异步操作。这种做法的最大问题在于，它使得程序结构混乱、流程难以追踪，尤其是在出现回调函数嵌套的情况。

{% highlight javascript %}

step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // ...
            });
        });
    });
});

{% endhighlight %}

上面代码表示，某个任务需要四步操作。由于这些操作都是异步的，所以不得不写成四层的回调函数。不难看出，这种写法使得代码乱成一团，变得横向发展而不是向下发展。

Promises规范就是为了解决这个问题而提出的，目标是使用正常的程序流程（同步），来处理异步操作。简单说，它的基本思想是，如果一个操作不能立刻返回结果，就先返回一个Promise对象，后面的操作先存放在这个对象上面。等到异步操作返回了结果，Promise对象再执行前期存放在它上面的操作。

上面代码用Promises表示，可以写成下面这样：

{% highlight javascript %}

promiseStep1()
.then(promiseStep2)
.then(promiseStep3)
.then(promiseStep4);

{% endhighlight %}

上面代码的promiseStep1函数是对Step1函数的改写，主要区别是返回一个Promise对象，后面的promiseStep2、promiseStep3和promiseStep4都是如此。

所谓Promise对象，就是一个人为部署了Promises接口的对象。而Promises接口最主要的就是then方法，它表示当前面的异步操作完成后，下一步所要执行的操作。所以，promiseStep1().then(promiseStep2)就表示，Step1结束后运行Step2。

可以看到，Promises的写法比回调函数的写法，清晰得多，完全是正常的程序流程，看上去一目了然。除此之外，then方法必须返回一个新的Promise对象，这意味着可以采取链式写法。总之，Promises的好处在于，它有一整套完整的接口，使得异步操作变得更易于使用和控制。

### 主要接口

Promises只是一个规范，具体实现需要自己部署。首先，将Promise定义成构造函数。

{% highlight javascript %}

var Promise = function () {
	// ...
};

{% endhighlight %}

接下来，将具体方法部署在Promise的原型对象上面，这样就可以让所有实例共享。第一个定义的是then方法，它接受两个参数，分别是异步操作成功时和出错时的回调函数。

{% highlight javascript %}

Promise.prototype.then = function (onResolved, onRejected) {
	// ...
};

{% endhighlight %}

根据Promises规范，异步操作成功叫做resolve，出错叫做reject。resolve使得Promise对象的状态从“等待”（pending）变成“完成”（fulfilled)，reject则是从“等待”变成“未完成”（failed）。

然后，定义resolve方法和reject方法，用来完成Promise对象的状态转变。

{% highlight javascript %}

Promise.prototype.resolve = function (value) {
	// ...
};
 
Promise.prototype.reject = function (error) {
	// ...
};

{% endhighlight %}

需要注意的是，resolve方法的参数是一个值，reject方法的参数是一个错误对象。

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

可以实际使用的Promises实现，参见jQuery的deferred对象一节。

## 参考链接

- Rhys Brett-Bowen, [Promises/A+ - understanding the spec through implementation](http://modernjavascript.blogspot.com/2013/08/promisesa-understanding-by-doing.html)
- Matt Podwysocki, Amanda Silver, [Asynchronous Programming in JavaScript with “Promises”](http://blogs.msdn.com/b/ie/archive/2011/09/11/asynchronous-programming-in-javascript-with-promises.aspx)
