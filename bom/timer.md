---
title: 定时器
category: bom
layout: page
date: 2014-10-12
modifiedOn: 2014-10-12
---

JavaScript提供定时执行代码的功能，叫做定时器（timer），主要由setTimeout()和setInterval()这两个函数来完成。

## setTimeout()

setTimeout函数用来指定某个函数或某段代码，在多少毫秒之后执行。它返回一个整数，表示定时器的编号，以后可以用来取消这个定时器。

```javascript

var timerId = setTimeout(func|code, delay)

```

上面代码中，setTimeout函数接受两个参数，第一个参数`func|code`是将要推迟执行的函数名或者一段代码，第二个参数`delay`是推迟执行的毫秒数。

{% highlight javascript %}

console.log(1);
setTimeout('console.log(2)',1000);
console.log(3);

{% endhighlight %}

上面代码的输出结果就是1，3，2，因为setTimeout指定第二行语句推迟1000毫秒再执行。

需要注意的是，推迟执行的代码必须以字符串的形式，放入setTimeout，因为引擎内部使用eval函数，将字符串转为代码。如果推迟执行的是函数，则可以直接将函数名，放入setTimeout。一方面eval函数有安全顾虑，另一方面为了便于JavaScript引擎优化代码，setTimeout方法一般总是采用函数名的形式，就像下面这样。

```javascript

function f(){
  console.log(2);
}

setTimeout(f,1000);

// 或者

setTimeout(function (){console.log(2)},1000);

```

除了前两个参数，setTimeout还允许添加更多的参数。它们将被传入推迟执行的函数。

{% highlight javascript %}

setTimeout(function(a,b){
  console.log(a+b);
},1000,1,1);

{% endhighlight %}

上面代码中，setTimeout共有4个参数。最后那两个参数，将在1000毫秒之后回调函数执行时，作为回调函数的参数。

IE 9.0以下版本，只允许setTimeout有两个参数，不支持更多的参数。这时有三种解决方法，第一种是自定义setTimeout，使用apply方法将参数输入回调函数；第二种是在一个匿名函数里面，让回调函数带参数运行，再把匿名函数输入setTimeout；第三种使用bind方法，把多余的参数绑定在回调函数上面，生成一个新的函数输入setTimeout。

除了参数问题，setTimeout还有一个需要注意的地方：被setTimeout推迟执行的回调函数是在全局环境执行，这有可能不同于函数定义时的上下文环境。

{% highlight javascript %}

var x = 1;

var o = {
	x: 2,
	y: function(){
    console.log(this.x);
  }
};

setTimeout(o.y,1000);
// 1

{% endhighlight %}

上面代码输出的是1，而不是2，这表示回调函数的运行环境已经变成了全局环境。

再看一个不容易发现错误的例子。

```javascript

function User(login) {
  this.login = login;
  this.sayHi = function() {
    console.log(this.login);
  }
}
 
var user = new User('John');
 
setTimeout(user.sayHi, 1000);

```

上面代码只会显示undefined，因为等到user.sayHi执行时，它是在全局对象中执行，所以this.login取不到值。

为了防止出现这个问题，一种解决方法是将user.sayHi放在函数中执行。

```javascript

setTimeout(function() {
  user.sayHi();
}, 1000);

```

上面代码中，user.sayHi是在函数作用域内执行，而不是在全局作用域内执行，所以能够显示正确的值。

另一种更通用的解决方法，则是采用闭包，将this与当前运行环境绑定。

```javascript

document.getElementById('click-ok').onclick = function() {
  var self = this;
  setTimeout(function() { 
    self.value='OK';
  }, 100);
}

```

上面代码中，setTimeout指定的函数中的this，总是指向定义时所在的DOM节点。

## setInterval()

setInterval函数的用法与setTimeout完全一致，区别仅仅在于setInterval指定某个任务每隔一段时间就执行一次，也就是无限次的定时执行。

{% highlight html %}

<input type="button" onclick="clearInterval(timer)" value="stop">

<script>
  var i = 1
  var timer = setInterval(function() { 
    console.log(2);
  }, 1000);
</script>

{% endhighlight %}

上面代码表示每隔1000毫秒就输出一个2，直到用户点击了停止按钮。

与setTimeout一样，除了前两个参数，setInterval 方法还可以接受更多的参数，它们会传入回调函数，下面是一个例子。

{% highlight javascript %}

function f(){
	for (var i=0;i<arguments.length;i++){
		console.log(arguments[i]);
	}
}

setInterval(f, 1000, "Hello World");
// Hello World
// Hello World
// Hello World
// ...

{% endhighlight %}

如果网页不在浏览器的当前窗口（或tab），许多浏览器限制setInteral指定的反复运行的任务最多每秒执行一次。

setInterval指定的是，“开始执行”之间的间隔，因此实际上，两次执行之间的间隔会小于setInterval指定的时间。假定setInterval指定，每100毫秒执行一次，每次执行需要5毫秒，那么第一次执行结束后95毫秒，第二次执行就会开始。如果某次执行耗时特别长，比如需要105毫秒，那么它结束后，下一次执行就会立即开始。

```javascript

var i = 1;
var timer = setInterval(function() { 
  alert(i++);
}, 2000);

```

上面代码每隔2000毫秒，就跳出一个alert对话框。如果用户一直不点击“确定”，整个浏览器就处于“堵塞”状态，后面的执行就一直无法触发，将会累积起来。举例来说，第一次跳出alert对话框后，用户过了6000毫秒才点击“确定”，那么第二次、第三次、第四次执行将累积起来，它们之间不会再有等待间隔。

为了确保两次执行之间有固定的间隔，可以不用setInterval，而是每次执行结束后，使用setTimeout指定下一次执行的具体时间。上面代码用setTimeout，可以改写如下。

```javascript

var i = 1;
var timer = setTimeout(function() {
  alert(i++);
  timer = setTimeout(arguments.callee, 2000);
}, 2000);

```

上面代码可以确保两次执行的间隔是2000毫秒。

根据这种思路，可以自己部署一个函数，实现间隔时间确定的setInterval的效果。

{% highlight javascript %}

function interval(func, wait){
  var interv = function(w){
    return function(){
      setTimeout(interv, w);
      func.call(null);
    }
  }(wait);

  setTimeout(interv, wait);
}

interval(function(){
  console.log(2);
},1000);

{% endhighlight %}

上面代码部署了一个interval函数，用循环调用setTimeout模拟了setInterval。

## clearTimeout()，clearInterval()

setTimeout和setInterval函数，都返回一个表示计数器编号的整数值，将该整数传入clearTimeout和clearInterval函数，就可以取消对应的定时器。

{% highlight javascript %}

var id1 = setTimeout(f,1000);
var id2 = setInterval(f,1000);

clearTimeout(id1);
clearInterval(id2);

{% endhighlight %}

下面是一个clearTimeout实际应用的例子。有些网站会实时将用户在文本框的输入，通过Ajax方法传回服务器，用jQuery表示就是下面的写法。

{% highlight javascript %}

$('textarea').on('keydown', ajaxAction);

{% endhighlight %}

这样写有一个很大的缺点，就是如果用户连续击键，就会连续触发keydown事件，造成大量的Ajax通信。这是不必要的，而且很可能会发生性能问题。正确的做法应该是，设置一个门槛值，表示两次Ajax通信的最小间隔时间。如果在设定的时间内，发生新的keydown事件，则不触发Ajax通信，并且重新开始计时。如果过了指定时间，没有发生新的keydown事件，将进行Ajax通信将数据发送出去。

这种做法叫做debounce（防抖动）方法，用来返回一个新函数。只有当两次触发之间的时间间隔大于事先设定的值，这个新函数才会运行实际的任务。假定两次Ajax通信的间隔不小于2500毫秒，上面的代码可以改写成下面这样。

{% highlight javascript %}

$('textarea').on('keydown', debounce(ajaxAction, 2500))

{% endhighlight %}

利用setTimeout和clearTimeout，可以实现debounce方法。

{% highlight javascript %}

function debounce(fn, delay){
	var timer = null; // 声明计时器
	return function(){
		var context = this, args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function(){
			fn.apply(context, args);
		}, delay);
	};
}

{% endhighlight %}

现实中，最好不要设置太多的setTimeout和setInterval，它们耗费CPU。比较理想的做法是，将要推迟执行的代码都放在一个函数里，然后只对这个函数使用setTimeout或setInterval。

## 运行机制

setTimeout和setInterval的运行机制是，将指定的代码移出本次执行，等到下一轮Event Loop时，再检查是否到了指定时间。如果到了，就执行对应的代码；如果不到，就等到再下一轮Event Loop时重新判断。这意味着，setTimeout指定的代码，必须等到本次执行的所有代码都执行完，才会执行。

每一轮Event Loop时，都会将“任务队列”中需要执行的任务，一次执行完。setTimeout和setInterval都是把任务添加到“任务队列”的尾部。因此，它们实际上要等到当前脚本的所有同步任务执行完，然后再等到本次Event Loop的“任务队列”的所有任务执行完，才会开始执行。由于前面的任务到底需要多少时间执行完，是不确定的，所以没有办法保证，setTimeout和setInterval指定的任务，一定会按照预定时间执行。

{% highlight javascript %}

setTimeout(someTask,100);
veryLongTask();

{% endhighlight %}

上面代码的setTimeout，指定100毫秒以后运行一个任务。但是，如果后面立即运行的任务（当前脚本的同步任务））非常耗时，过了100毫秒还无法结束，那么被推迟运行的someTask就只有等着，等到前面的veryLongTask运行结束，才轮到它执行。

这一点对于setInterval影响尤其大。

{% highlight javascript %}

setInterval(function(){
  console.log(2);
},1000);

(function (){ 
  sleeping(3000);
})();

{% endhighlight %}

上面的第一行语句要求每隔1000毫秒，就输出一个2。但是，第二行语句需要3000毫秒才能完成，请问会发生什么结果？

结果就是等到第二行语句运行完成以后，立刻连续输出三个2，然后开始每隔1000毫秒，输出一个2。也就是说，setIntervel具有累积效应，如果某个操作特别耗时，超过了setInterval的时间间隔，排在后面的操作会被累积起来，然后在很短的时间内连续触发，这可能或造成性能问题（比如集中发出Ajax请求）。

为了进一步理解JavaScript的单线程模型，请看下面这段伪代码。

{% highlight javascript %}

function init(){
  { 耗时5ms的某个操作 } 
  触发mouseClickEvent事件
  { 耗时5ms的某个操作 }
  setInterval(timerTask,10);
  { 耗时5ms的某个操作 }
}

function handleMouseClick(){
   耗时8ms的某个操作 
}

function timerTask(){
   耗时2ms的某个操作 
}

{% endhighlight %}

请问调用init函数后，这段代码的运行顺序是怎样的？

- **0-15ms**：运行init函数。

- **15-23ms**：运行handleMouseClick函数。请注意，这个函数是在5ms时触发的，应该在那个时候就立即运行，但是由于单线程的关系，必须等到init函数完成之后再运行。

- **23-25ms**：运行timerTask函数。这个函数是在10ms时触发的，规定每10ms运行一次，即在20ms、30ms、40ms等时候运行。由于20ms时，JavaScript线程还有任务在运行，因此必须延迟到前面任务完成时再运行。

- **30-32ms**：运行timerTask函数。

- **40-42ms**：运行timerTask函数。

## setTimeout(f,0)

setTimeout的作用是将代码推迟到指定时间执行，如果指定时间为0，即setTimeout(f,0)，那么会立刻执行吗？

答案是不会。因为上一段说过，必须要等到当前脚本的同步任务和“任务队列”中已有的任务，全部完成后，才会执行setTimeout指定的任务。也就是说，setTimeout的真正作用是，在“任务队列”的现有任务的后面再添加一个任务，规定定时触发某段代码。

setTimeout(f,0)只是让所指定的任务，在现有的任务一结束就立刻执行。也就是说，setTimeout(f,0)的作用是，尽可能早地执行指定的任务。

{% highlight javascript %}

setTimeout(function() { 
  console.log("Timeout");
}, 0);

function a(x) { 
	console.log("a() 开始运行");
	b(x);
	console.log("a() 结束运行");
}

function b(y) { 
	console.log("b() 开始运行");
	console.log("传入的值为" + y);
	console.log("b() 结束运行");
}

console.log("当前任务开始");
a(42);
console.log("当前任务结束");

// 当前任务开始
// a() 开始运行
// b() 开始运行
// 传入的值为42
// b() 结束运行
// a() 结束运行
// 当前任务结束
// Timeout 

{% endhighlight %}

上面代码说明，setTimeout(f,0)必须要等到当前脚本的所有同步任务结束后才会执行。

{% highlight javascript %}

setTimeout(function (){
  console.log("你好！");
}, 0);

{% endhighlight %}

上面代码的含义是，尽可能早地显示“你好！”。

跟据[HTML 5标准](http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#timers)，setTimeOut推迟执行的时间，最少是4毫秒。如果小于这个值，会被自动增加到4。

另一方面，浏览器内部使用32位带符号的整数，来储存推迟执行的时间。这意味着setTimeout最多只能推迟执行2147483647毫秒（24.8天），超过这个时间会发生溢出，导致回调函数将在当前任务队列结束后立即执行，即等同于setTimeout(f,0)的效果。

## 参考链接

- Ilya Kantor, [Understanding timers: setTimeout and setInterval](http://javascript.info/tutorial/settimeout-setinterval)
