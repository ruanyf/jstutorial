---
title: 定时器
category: advanced
layout: page
date: 2014-10-12
modifiedOn: 2014-10-12
---

JavaScript提供定时执行代码的功能，叫做定时器（timer），主要由`setTimeout()`和`setInterval()`这两个函数来完成。它们向任务队列添加定时任务。

## setTimeout()

`setTimeout`函数用来指定某个函数或某段代码，在多少毫秒之后执行。它返回一个整数，表示定时器的编号，以后可以用来取消这个定时器。

```javascript
var timerId = setTimeout(func|code, delay)
```

上面代码中，`setTimeout`函数接受两个参数，第一个参数`func|code`是将要推迟执行的函数名或者一段代码，第二个参数`delay`是推迟执行的毫秒数。

```javascript
console.log(1);
setTimeout('console.log(2)',1000);
console.log(3);
```

上面代码的输出结果就是1，3，2，因为`setTimeout`指定第二行语句推迟1000毫秒再执行。

需要注意的是，推迟执行的代码必须以字符串的形式，放入`setTimeout`，因为引擎内部使用`eval`函数，将字符串转为代码。如果推迟执行的是函数，则可以直接将函数名，放入`setTimeout`。一方面`eval`函数有安全顾虑，另一方面为了便于JavaScript引擎优化代码，`setTimeout`方法一般总是采用函数名的形式，就像下面这样。

```javascript
function f(){
  console.log(2);
}

setTimeout(f,1000);

// 或者

setTimeout(function (){console.log(2)},1000);
```

如果省略`setTimeout`的第二个参数，则该参数默认为0。

除了前两个参数，`setTimeout`还允许添加更多的参数。它们将被传入推迟执行的函数（回调函数）。

```javascript
setTimeout(function(a,b){
  console.log(a+b);
},1000,1,1);
```

上面代码中，`setTimeout`共有4个参数。最后那两个参数，将在1000毫秒之后回调函数执行时，作为回调函数的参数。

IE 9.0及以下版本，只允许`setTimeout`有两个参数，不支持更多的参数。这时有三种解决方法。第一种是在一个匿名函数里面，让回调函数带参数运行，再把匿名函数输入`setTimeout`。

```javascript
setTimeout(function() {
  myFunc("one", "two", "three");
}, 1000);
```

上面代码中，myFunc是真正要推迟执行的函数，有三个参数。如果直接放入`setTimeout`，低版本的IE不能带参数，所以可以放在一个匿名函数。

第二种解决方法是使用`bind`方法，把多余的参数绑定在回调函数上面，生成一个新的函数输入`setTimeout`。

```javascript
setTimeout(function(arg1){}.bind(undefined, 10), 1000);
```

上面代码中，`bind`方法第一个参数是`undefined`，表示将原函数的`this`绑定全局作用域，第二个参数是要传入原函数的参数。它运行后会返回一个新函数，该函数不带参数。

第三种解决方法是自定义`setTimeout`，使用`apply`方法将参数输入回调函数。

```html
<!--[if lte IE 9]><script>
(function(f){
window.setTimeout =f(window.setTimeout);
window.setInterval =f(window.setInterval);
})(function(f){return function(c,t){
var a=[].slice.call(arguments,2);return f(function(){c.apply(this,a)},t)}
});
</script><![endif]-->
```

除了参数问题，`setTimeout`还有一个需要注意的地方：如果被`setTimeout`推迟执行的回调函数是某个对象的方法，那么该方法中的`this`关键字将指向全局环境，而不是定义时所在的那个对象。

```javascript
var x = 1;

var o = {
  x: 2,
  y: function(){
    console.log(this.x);
  }
};

setTimeout(o.y,1000);
// 1
```

上面代码输出的是1，而不是2，这表示`o.y`的this所指向的已经不是o，而是全局环境了。

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

上面代码只会显示`undefined`，因为等到user.sayHi执行时，它是在全局对象中执行，所以this.login取不到值。

为了防止出现这个问题，一种解决方法是将user.sayHi放在函数中执行。

```javascript
setTimeout(function() {
  user.sayHi();
}, 1000);
```

上面代码中，sayHi是在user作用域内执行，而不是在全局作用域内执行，所以能够显示正确的值。

另一种解决方法是，使用bind方法，将绑定sayHi绑定在user上面。

```javascript
setTimeout(user.sayHi.bind(user), 1000);
```

HTML 5标准规定，`setTimeout`的最短时间间隔是4毫秒。为了节电，对于那些不处于当前窗口的页面，浏览器会将时间间隔扩大到1000毫秒。另外，如果笔记本电脑处于电池供电状态，Chrome和IE 9以上的版本，会将时间间隔切换到系统定时器，大约是15.6毫秒。

## setInterval()

`setInterval`函数的用法与`setTimeout`完全一致，区别仅仅在于`setInterval`指定某个任务每隔一段时间就执行一次，也就是无限次的定时执行。

```html
<input type="button" onclick="clearInterval(timer)" value="stop">

<script>
  var i = 1
  var timer = setInterval(function() {
    console.log(2);
  }, 1000);
</script>
```

上面代码表示每隔1000毫秒就输出一个2，直到用户点击了停止按钮。

与`setTimeout`一样，除了前两个参数，`setInterval`方法还可以接受更多的参数，它们会传入回调函数，下面是一个例子。

```javascript
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
```

如果网页不在浏览器的当前窗口（或tab），许多浏览器限制setInteral指定的反复运行的任务最多每秒执行一次。

下面是一个通过`setInterval`方法实现网页动画的例子。

```javascript
var div = document.getElementById('someDiv');
var opacity = 1;
var fader = setInterval(function() {
  opacity -= 0.1;
  if (opacity >= 0) {
    div.style.opacity = opacity;
  } else {
    clearInterval(fader);
  }
}, 100);
```

上面代码每隔100毫秒，设置一次`div`元素的透明度，直至其完全透明为止。

`setInterval`的一个常见用途是实现轮询。下面是一个轮询URL的Hash值是否发生变化的例子。

```javascript
var hash = window.location.hash;
var hashWatcher = setInterval(function() {
  if (window.location.hash != hash) {
    updatePage();
  }
}, 1000);
```

setInterval指定的是“开始执行”之间的间隔，并不考虑每次任务执行本身所消耗的时间。因此实际上，两次执行之间的间隔会小于指定的时间。比如，setInterval指定每100ms执行一次，每次执行需要5ms，那么第一次执行结束后95毫秒，第二次执行就会开始。如果某次执行耗时特别长，比如需要105毫秒，那么它结束后，下一次执行就会立即开始。

为了确保两次执行之间有固定的间隔，可以不用setInterval，而是每次执行结束后，使用setTimeout指定下一次执行的具体时间。

```javascript
var i = 1;
var timer = setTimeout(function() {
  alert(i++);
  timer = setTimeout(arguments.callee, 2000);
}, 2000);
```

上面代码可以确保，下一个对话框总是在关闭上一个对话框之后2000毫秒弹出。

根据这种思路，可以自己部署一个函数，实现间隔时间确定的setInterval的效果。

```javascript
function interval(func, wait){
  var interv = function(){
    func.call(null);
    setTimeout(interv, wait);
  };

  setTimeout(interv, wait);
}

interval(function(){
  console.log(2);
},1000);
```

上面代码部署了一个interval函数，用循环调用setTimeout模拟了setInterval。

HTML 5标准规定，setInterval的最短间隔时间是10毫秒，也就是说，小于10毫秒的时间间隔会被调整到10毫秒。

## clearTimeout()，clearInterval()

setTimeout和setInterval函数，都返回一个表示计数器编号的整数值，将该整数传入clearTimeout和clearInterval函数，就可以取消对应的定时器。

```javascript
var id1 = setTimeout(f,1000);
var id2 = setInterval(f,1000);

clearTimeout(id1);
clearInterval(id2);
```

setTimeout和setInterval返回的整数值是连续的，也就是说，第二个setTimeout方法返回的整数值，将比第一个的整数值大1。利用这一点，可以写一个函数，取消当前所有的setTimeout。

```javascript
(function() {
  var gid = setInterval(clearAllTimeouts, 0);

  function clearAllTimeouts() {
    var id = setTimeout(function() {}, 0);
    while (id > 0) {
      if (id !== gid) {
        clearTimeout(id);
      }
      id--;
    }
  }
})();
```

运行上面代码后，实际上再设置任何setTimeout都无效了。

下面是一个clearTimeout实际应用的例子。有些网站会实时将用户在文本框的输入，通过Ajax方法传回服务器，jQuery的写法如下。

```javascript
$('textarea').on('keydown', ajaxAction);
```

这样写有一个很大的缺点，就是如果用户连续击键，就会连续触发keydown事件，造成大量的Ajax通信。这是不必要的，而且很可能会发生性能问题。正确的做法应该是，设置一个门槛值，表示两次Ajax通信的最小间隔时间。如果在设定的时间内，发生新的keydown事件，则不触发Ajax通信，并且重新开始计时。如果过了指定时间，没有发生新的keydown事件，将进行Ajax通信将数据发送出去。

这种做法叫做debounce（防抖动）方法，用来返回一个新函数。只有当两次触发之间的时间间隔大于事先设定的值，这个新函数才会运行实际的任务。假定两次Ajax通信的间隔不小于2500毫秒，上面的代码可以改写成下面这样。

```javascript
$('textarea').on('keydown', debounce(ajaxAction, 2500))
```

利用setTimeout和clearTimeout，可以实现debounce方法，该方法用于防止某个函数在短时间内被密集调用。具体来说，debounce方法返回一个新版的该函数，这个新版函数调用后，只有在指定时间内没有新的调用，才会执行，否则就重新计时。

```javascript
function debounce(fn, delay){
  var timer = null; // 声明计时器
  return function(){
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function(){
      fn.apply(context, args);
    }, delay);
  };
}

// 用法示例
var todoChanges = _.debounce(batchLog, 1000);
Object.observe(models.todo, todoChanges);
```

现实中，最好不要设置太多个setTimeout和setInterval，它们耗费CPU。比较理想的做法是，将要推迟执行的代码都放在一个函数里，然后只对这个函数使用setTimeout或setInterval。

## 运行机制

`setTimeout`和`setInterval`的运行机制是，将指定的代码移出本次执行，等到下一轮Event Loop时，再检查是否到了指定时间。如果到了，就执行对应的代码；如果不到，就等到再下一轮Event Loop时重新判断。

这意味着，`setTimeout`和`setInterval`指定的代码，必须等到本轮Event Loop的所有同步任务都执行完，再等到本轮Event Loop的“任务队列”的所有任务执行完，才会开始执行。由于前面的任务到底需要多少时间执行完，是不确定的，所以没有办法保证，`setTimeout`和`setInterval`指定的任务，一定会按照预定时间执行。

```javascript
setTimeout(someTask, 100);
veryLongTask();
```

上面代码的`setTimeout`，指定100毫秒以后运行一个任务。但是，如果后面的`veryLongTask`函数（同步任务）运行时间非常长，过了100毫秒还无法结束，那么被推迟运行的`someTask`就只有等着，等到`veryLongTask`运行结束，才轮到它执行。

这一点对于`setInterval`影响尤其大。

```javascript
setInterval(function () {
  console.log(2);
}, 1000);

(function () {
  sleeping(3000);
})();
```

上面的第一行语句要求每隔1000毫秒，就输出一个2。但是，第二行语句需要3000毫秒才能完成，请问会发生什么结果？

结果就是等到第二行语句运行完成以后，立刻连续输出三个2，然后开始每隔1000毫秒，输出一个2。也就是说，`setIntervel`具有累积效应，如果某个操作特别耗时，超过了`setInterval`的时间间隔，排在后面的操作会被累积起来，然后在很短的时间内连续触发，这可能或造成性能问题（比如集中发出Ajax请求）。

## setTimeout(f,0)

### 含义

`setTimeout`的作用是将代码推迟到指定时间执行，如果指定时间为`0`，即`setTimeout(f, 0)`，那么会立刻执行吗？

答案是不会。因为上一段说过，必须要等到当前脚本的同步任务和“任务队列”中已有的事件，全部处理完以后，才会执行`setTimeout`指定的任务。也就是说，setTimeout的真正作用是，在“消息队列”的现有消息的后面再添加一个消息，规定在指定时间执行某段代码。`setTimeout`添加的事件，会在下一次`Event Loop`执行。

`setTimeout(f, 0)`将第二个参数设为`0`，作用是让`f`在现有的任务（脚本的同步任务和“消息队列”指定的任务）一结束就立刻执行。也就是说，`setTimeout(f, 0)`的作用是，尽可能早地执行指定的任务。而并不是会立刻就执行这个任务。

```javascript
setTimeout(function () {
  console.log('你好！');
}, 0);
```

上面代码的含义是，尽可能早地显示“你好！”。

`setTimeout(f, 0)`指定的任务，最早也要到下一次Event Loop才会执行。请看下面的例子。

```javascript
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
```

上面代码说明，`setTimeout(f, 0)`必须要等到当前脚本的所有同步任务结束后才会执行。

即使消息队列是空的，0毫秒实际上也是达不到的。根据[HTML 5标准](http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#timers)，`setTimeout`推迟执行的时间，最少是4毫秒。如果小于这个值，会被自动增加到4。这是为了防止多个`setTimeout(f, 0)`语句连续执行，造成性能问题。

另一方面，浏览器内部使用32位带符号的整数，来储存推迟执行的时间。这意味着`setTimeout`最多只能推迟执行2147483647毫秒（24.8天），超过这个时间会发生溢出，导致回调函数将在当前任务队列结束后立即执行，即等同于`setTimeout(f, 0)`的效果。

### 应用

`setTimeout(f, 0)`有几个非常重要的用途。它的一大应用是，可以调整事件的发生顺序。比如，网页开发中，某个事件先发生在子元素，然后冒泡到父元素，即子元素的事件回调函数，会早于父元素的事件回调函数触发。如果，我们先让父元素的事件回调函数先发生，就要用到setTimeout(f, 0)。

```javascript
var input = document.getElementsByTagName('input[type=button]')[0];

input.onclick = function A() {
  setTimeout(function B() {
    input.value +=' input';
  }, 0)
};

document.body.onclick = function C() {
  input.value += ' body'
};
```

上面代码在点击按钮后，先触发回调函数A，然后触发函数C。在函数A中，setTimeout将函数B推迟到下一轮Loop执行，这样就起到了，先触发父元素的回调函数C的目的了。

用户自定义的回调函数，通常在浏览器的默认动作之前触发。比如，用户在输入框输入文本，keypress事件会在浏览器接收文本之前触发。因此，下面的回调函数是达不到目的的。

```javascript
document.getElementById('input-box').onkeypress = function(event) {
  this.value = this.value.toUpperCase();
}
```

上面代码想在用户输入文本后，立即将字符转为大写。但是实际上，它只能将上一个字符转为大写，因为浏览器此时还没接收到文本，所以`this.value`取不到最新输入的那个字符。只有用setTimeout改写，上面的代码才能发挥作用。

```javascript
document.getElementById('my-ok').onkeypress = function() {
  var self = this;
  setTimeout(function() {
    self.value = self.value.toUpperCase();
  }, 0);
}
```

上面代码将代码放入setTimeout之中，就能使得它在浏览器接收到文本之后触发。

由于setTimeout(f,0)实际上意味着，将任务放到浏览器最早可得的空闲时段执行，所以那些计算量大、耗时长的任务，常常会被放到几个小部分，分别放到setTimeout(f,0)里面执行。

```javascript
var div = document.getElementsByTagName('div')[0];

// 写法一
for (var i = 0xA00000; i < 0xFFFFFF; i++) {
  div.style.backgroundColor = '#' + i.toString(16);
}

// 写法二
var timer;
var i=0x100000;

function func() {
  timer = setTimeout(func, 0);
  div.style.backgroundColor = '#' + i.toString(16);
  if (i++ == 0xFFFFFF) clearTimeout(timer);
}

timer = setTimeout(func, 0);
```

上面代码有两种写法，都是改变一个网页元素的背景色。写法一会造成浏览器“堵塞”，因为JavaScript执行速度远高于DOM，会造成大量DOM操作“堆积”，而写法二就不会，这就是`setTimeout(f, 0)`的好处。

另一个使用这种技巧的例子是代码高亮的处理。如果代码块很大，一次性处理，可能会对性能造成很大的压力，那么将其分成一个个小块，一次处理一块，比如写成`setTimeout(highlightNext, 50)`的样子，性能压力就会减轻。

## 正常任务与微任务

正常情况下，JavaScript的任务是同步执行的，即执行完前一个任务，然后执行后一个任务。只有遇到异步任务的情况下，执行顺序才会改变。

这时，需要区分两种任务：正常任务（task）与微任务（microtask）。它们的区别在于，“正常任务”在下一轮Event Loop执行，“微任务”在本轮Event Loop的所有任务结束后执行。

```javascript
console.log(1);

setTimeout(function() {
  console.log(2);
}, 0);

Promise.resolve().then(function() {
  console.log(3);
}).then(function() {
  console.log(4);
});

console.log(5);

// 1
// 5
// 3
// 4
// 2
```

上面代码的执行结果说明，`setTimeout(fn, 0)`在`Promise.resolve`之后执行。

这是因为`setTimeout`语句指定的是“正常任务”，即不会在当前的Event Loop执行。而Promise会将它的回调函数，在状态改变后的那一轮Event Loop指定为微任务。所以，3和4输出在5之后、2之前。

正常任务包括以下情况。

- setTimeout
- setInterval
- setImmediate
- I/O
- 各种事件（比如鼠标单击事件）的回调函数

微任务目前主要是`process.nextTick`和 Promise 这两种情况。

## 参考链接

- Ilya Kantor, [Understanding timers: setTimeout and setInterval](http://javascript.info/tutorial/settimeout-setinterval)
- Ilya Kantor, [Events and timing in-depth](http://javascript.info/tutorial/events-and-timing-depth)
- MDN, [WindowTimers.setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers.setTimeout)
- Artem Tyurin, [Being evil with setTimeout](http://agentcooper.ghost.io/being-evil-with-settimeout/)
- Jake Archibald, [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- Tamas Kadlecsik, [Node.js at Scale - Understanding the Node.js Event Loop](https://blog.risingstack.com/node-js-at-scale-understanding-node-js-event-loop/)
