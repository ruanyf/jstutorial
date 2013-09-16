---
title: Promises
category: oop
layout: page
date: 2013-09-16
modifiedOn: 2013-09-16
---

## 概述

Promises是一种处理异步操作的规范。

传统上，JavaScript依靠回调函数处理异步操作。这种做法的最大问题在于，它使得程序结构混乱、流程难以追踪，尤其是在出现回调函数嵌套的情况（即回调函数内部还有回调函数）。Promises就是为了解决这个问题而提出，目标是使用正常的程序流程来定义回调函数。

简单说，Promises的基本思想是，将异步操作包装成一个Promise对象，这个对象的状态为pending，表示操作还没有完成。Promise对象有一个then方法，可以绑定回调函数。一旦异步操作完成，Promise对象的状态变为fulfilled，这时，回调函数就会运行。

也就是说，异步操作的传统写法是：

{% highlight JavaScript %}

asyncOperation(option, callback)；

{% endhighlight %}

上面代码的asyncOperation是一个异步操作，当它结束的时候，会调用回调函数callback。

Promises对象的写法是：

{% highlight JavaScript %}

asyncOperationPromise.then(callback)；

{% endhighlight %}

asyncOperationPromise是asyncOperation的包装对象，它的then方法可以绑定回调函数。

除了保持流程清晰，Promises的好处还在于，它有一整套完整的接口，使得异步操作变得更易于使用和控制。比如，它允许链式使用then方法，按顺序定义多个回调函数。

{% highlight JavaScript %}

asyncOperationPromise
.then(callback1)
.then(callback2)
.then(callback3)；

{% endhighlight %}

上面代码对异步操作asyncOperation，定义了3个回调函数。当asyncOperation完成时，首先会执行回调函数callback1，然后是callback2和callback3。

## Promises的实现

下面，我们一步步从无到有，创造一个Promises的实现。这样可以更好地理解它。

首先，定义一个Promise的构造函数，用来生成实例。

{% highlight JavaScript %}

var Promise = function() {

	var promise = {};

	return Object.create(promise);

};

{% endhighlight %}

然后，在构造函数内部，定义一个常量对象State，表示Promise的状态。

{% highlight JavaScript %}

var Promise = function() {
	var State = {
		PENDING: 0,
		FULFILLED: 1,
		REJECTED: 2
	};

	var promise = {
		state: State.PENDING
	};

	return Object.create(promise);
};

{% endhighlight %}

上面代码表示，Promise对象一共有三种状态：未完成（PENDING）、已完成（FULFILLED）和失败（REJECTED）。实例promise的状态为未完成。

接着，为promise实例定义一个changeState方法，表示状态转移。根据规格，Promise对象的状态转移只可能有两种：从“未完成”转移到“已完成”，以及从“未完成”转移到“失败”。

{% highlight JavaScript %}

var promise = {
	state: State.PENDING,

	changeState: function(state, value) {
		// 判断目标状态是否与当前状态相同
		if ( this.state === state ) {
		   throw new Error("can't transition to same state: " + state);
		}
		// 判断当前状态是否为未完成或失败
		if ( this.state === State.FULFILLED ||
		this.state === State.REJECTED ) {
			throw new Error("can't transition from current state: " + state);
		}
		// 如果目标状态为已完成，判断是否带有第二个参数
		if ( state === State.FULFILLED &&
		arguments.length < 2 ) {
			throw new Error("transition to fulfilled must have a non null value");
		}
		// 如果目标状态为失败，判断是否带有第二个参数
		if ( state == State.REJECTED &&
		arguments.length < 2 ) {
			throw new Error("transition to rejected must have a non null reason");
		}
		// 将当前状态改为目标状态
		this.state = state;
		this.value = value;
		return this.state;
	}
};

{% endhighlight %}

上面代码部署了changeState方法，该方法在检查状态转移是否合理以后，就将当前状态改为目标状态，并返回改变后的状态。

接着，部署实例的fulfill和reject方法，用来将状态转移到“已完成”或“失败”。

{% highlight JavaScript %}

var promise = {
	fulfill: function( value ) {
		this.changeState( State.FULFILLED, value );
	},
	reject: function( reason ) {
		this.changeState( State.REJECTED, reason );
	}
};

{% endhighlight %}

然后，部署实例的then方法，用来绑定回调函数。

{% highlight JavaScript %}

var promise = {
	then: function( onFulfilled, onRejected ) {
		// 初始化任务数组
		this.cache = this.cache || [];
	
		this.cache.push({
			fulfill: onFulfilled,
			reject: onRejected,
		});

		// 继续返回实例对象
		return this;
	}
};

{% endhighlight %}

上面代码表示then方法接受两个参数，第一个参数是异步操作已完成时的回调函数，另一个是异步操作失败时的回调函数，这个两个回调函数都被放入任务数组。

然后，定义resolve方法，表示任务已结束，调用相应的回调函数。

{% highlight JavaScript %}

var promise = {
	resolve: function() {
	// 如果当前状态是否为未完成
	if ( this.state === State.PENDING ) {
		return false;
	}
	// 运行任务数组中的回调函数
	while ( this.cache && this.cache.length ) {
		var obj = this.cache.shift();
		// 根据当前状态，调用相应的回调函数
		var fn = (this.state === State.FULFILLED ? obj.fulfill : obj.reject);

		if ( typeof fn != 'function' ) {
			fn = function() {};
		} 

		fn(this.value);

		}
	}
}

{% endhighlight %}

至此，一个简单的Promises实现就写好了。

## 参考链接

- Rhys Brett-Bowen, [Promises/A+ - understanding the spec through implementation](http://modernjavascript.blogspot.com/2013/08/promisesa-understanding-by-doing.html)
