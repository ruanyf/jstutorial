---
title: JavaScript 运行原理
layout: page
category: bom
date: 2013-03-10
modifiedOn: 2013-06-13
---

## 嵌入网页的方法

### 静态嵌入

在网页中使用script标签，可以直接将JavaScript代码嵌入网页。

{% highlight html %}

<script>
// some JavaScript code
</script>

{% endhighlight %}

也可以指定外部的脚本文件，让script标签读取。

{% highlight html %}

<script src="example.js"></script>

{% endhighlight %}

下载和执行JavaScript代码时，浏览器会暂停页面渲染，等待执行完成，这是因为JavaScript代码可能会修改页面。由于这个原因，如果某段代码的下载或执行时间特别长，浏览器就会呈现“假死”状态，失去响应。为了避免这种情况，较好的做法是将script标签都放在页面底部，而不是头部。

如果有多个script标签，比如下面这样：

{% highlight html %}

<script src="1.js"></script>
<script src="2.js"></script>

{% endhighlight %}

浏览器会同时平行下载1.js和2.js，但是执行时会保证先执行1.js，然后再执行2.js，即使后者先下载完成，也是如此。也就是说，脚本的执行顺序由它们在页面中的出现顺序决定，这是为了保证脚本之间的依赖关系不受到破坏。

一个解决方法是加入defer属性。

{% highlight html %}

<script src="1.js" defer></script>
<script src="2.js" defer></script>

{% endhighlight %}

有了defer属性，浏览器下载脚本文件的时候，不会阻塞页面渲染。下载的脚本文件在DOMContentLoaded事件触发前执行，而且可以保证执行顺序就是它们在页面上出现的顺序。但是，浏览器对这个属性的支持不够理想，IE（<=9）还有一个bug，无法保证执行顺序（一旦1.js修改了页面的DOM结构，会引发2.js立即执行）。此外，对于没有src属性的script标签，以及动态生成的script标签，defer不起作用。

另一个解决方法是加入async属性。

{% highlight html %}

<script src="1.js" async></script>
<script src="2.js" async></script>

{% endhighlight %}

async属性可以保证脚本下载的同时，浏览器继续渲染。一旦渲染完成，再执行脚本文件，这就是“非同步执行”的意思。需要注意的是，一旦采用这个属性，就无法保证脚本的执行顺序。先下载完成的脚本，就会排在最前面执行。

对于来自同一个域名的资源，比如脚本文件、样式表文件、图片文件等，浏览器一般最多同时下载六个。如果是来自不同域名的资源，就没有这个限制。所以，通常把静态文件放在不同的域名之下，以加快下载速度。

另外，如果不指定协议，浏览器默认采用HTTP协议下载。

{% highlight html %}

<script src="example.js"></script>

{% endhighlight %}

上面的example.js默认就是采用http协议下载，如果要采用HTTPs协议下载，必需写明（假定服务器支持）。

{% highlight html %}

<script src="https://example.js"></script>

{% endhighlight %}

但是有时我们会希望，根据页面本身的协议来决定加载协议，这时可以采用下面的写法。

{% highlight html %}

<script src="//example.js"></script>

{% endhighlight %}

### 动态嵌入

除了用静态的script标签，将JavaScript代码插入网页，还可以动态生成script标签。

{% highlight javascript %}

['1.js', '2.js'].forEach(function(src) {
  var script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);
});

{% endhighlight %}

这种方法的好处是，动态生成的script标签不会阻塞页面渲染，也就不会造成浏览器假死。但是问题在于，这种方法无法保证脚本的执行顺序，哪个脚本文件先下载完成，就先执行哪个。

如果想避免这个问题，可以设置async属性为false。

{% highlight javascript %}

['1.js', '2.js'].forEach(function(src) {
  var script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.head.appendChild(script);
});

{% endhighlight %}

上面的代码依然不会阻塞页面渲染，而且可以保证2.js在1.js后面执行。不过需要注意的是，在这段代码后面加载的脚本文件，会因此都等待2.js执行完成后再执行。

## JavaScript虚拟机

JavaScript是一种解释型语言，也就是说，它不需要编译，可以由解释器实时运行。这样的好处是运行和修改都比较方便，刷新页面就可以重新解释；缺点是每次运行都要调用解释器，系统开销较大，运行速度慢于编译型语言。为了提高运行速度，目前的浏览器都将JavaScript进行一定程度的编译，生成类似字节码（bytecode）的中间代码，以提高运行速度。

早期，浏览器内部对JavaScript的处理过程如下：

1. 读取代码，进行词法分析（Lexical analysis），将代码分解成词元（token）。
2. 对词元进行语法分析（parsing），将代码整理成“语法树”（syntax tree）。
3. 使用“翻译器”（translator），将代码转为字节码（bytecode）。
4. 使用“字节码解释器”（bytecode interpreter），将字节码转为机器码。

逐行解释将字节码转为机器码，是很低效的。为了提高运行速度，现代浏览器改为采用“即时编译”（Just In Time compiler，缩写JIT），即字节码只在运行时编译，用到哪一行就编译哪一行，并且把编译结果缓存（inline cache）。通常，一个程序被经常用到的，只是其中一小部分代码，有了缓存的编译结果，整个程序的运行速度就会显著提升。

不同的浏览器有不同的编译策略。有的浏览器只编译最经常用到的部分，比如循环的部分；有的浏览器索性省略了字节码的翻译步骤，直接编译成机器码，比如chrome浏览器的V8引擎。

字节码不能直接运行，而是运行在一个虚拟机（Virtual Machine）之上，一般也把虚拟机称为JavaScript引擎。因为JavaScript运行时未必有字节码，所以JavaScript虚拟机并不完全基于字节码，而是部分基于源码，即只要有可能，就通过JIT（just in time）编译器直接把源码编译成机器码运行，省略字节码步骤。这一点与其他采用虚拟机（比如Java）的语言不尽相同。这样做的目的，是为了尽可能地优化代码、提高性能。下面是目前最常见的一些JavaScript虚拟机：

- [Chakra](http://en.wikipedia.org/wiki/Chakra_(JScript_engine\))(Microsoft Internet Explorer)
- [Nitro/JavaScript Core](http://en.wikipedia.org/wiki/WebKit#JavaScriptCore) (Safari)
- [Carakan](http://dev.opera.com/articles/view/labs-carakan/) (Opera)
- [SpiderMonkey](https://developer.mozilla.org/en-US/docs/SpiderMonkey) (Firefox)
- [V8](http://en.wikipedia.org/wiki/V8_(JavaScript_engine\)) (Chrome, Chromium)

## 单线程模型

### 含义

JavaScript在浏览器中以单线程运行，也就是说，所有的操作都在一个线程里按照某种顺序运行。

一个线程意味一次只能运行一个操作，其他操作都必须在后面排队等待。这被叫做JavaScript的“事件循环”模型（event loop），也就是说，JavaScript有一个运行队列，新的事件触发的操作，按照顺序插入队列，排队运行。

{% highlight javascript %}

button.onclick = function() {
      document.title = '(doing...)'+ document.title;
};

{% endhighlight %}

上面的代码表示，当按钮的点击事件发生以后，网页的标题会发生变化。在实际运行中，这个操作会被添加到“运行队列”的尾部，是否马上运行取决于它前面的操作还要耗费多少时间。

如果有一个操作特别耗时，后面的操作都会停在那里等待，造成浏览器堵塞，又称“假死”，使得用户体验变得非常差。浏览器为了避免这种情况，当某个操作迟迟无法结束时，会跳出提示框，询问用户是否要停止脚本运行。而JavaScript本身也提供了一些解决方法，最常见的就是用 setTimeout 和 setInterval 方法，将某个耗时的操作放到较晚的时间运行。另外，XMLHttpRequest对象提供了异步操作，使得Ajax操作（非常耗时的操作）可以在另一个线程上完成，不影响主线程。

### setTimeout 和 setInterval 方法

这两个方法的作用，就是改变JavaScript的正常执行顺序，推迟某些操作的执行。

{% highlight javascript %}

console.log(1);

console.log(2);

console.log(3);

{% endhighlight %}

正常情况下，上面三行语句按照顺序执行，输出1--2--3。现在，我们用setTimeout改变执行顺序。

{% highlight javascript %}

console.log(1);

setTimeout(function(){console.log(2);},1000);

console.log(3);

{% endhighlight %}

上面三行语句的输出结果就是1--3--2，其中第二行语句被推迟了1000毫秒执行，所以就变成了最后输出。

setTimout方法接收两个参数，第一个参数必须是函数，所以上面的代码将语句放在一个匿名函数里面；第二个参数是推迟执行的时间，以毫秒作为单位。setIntervel的格式与setTimeout完全一致，区别在于它不仅推迟一个操作，而且让这个操作反复执行。

{% highlight javascript %}

setTimeout(function(){console.log(2);},1000);

setInterval(function(){console.log(2);},1000);

{% endhighlight %}

上面的第一行语句是1000毫秒后输出2，第二行语句则是从现在开始，每隔1000毫秒就输出一个2。

在本质上，这两个方法都是把相应操作添加到“运行队列”的尾部，等到前面的操作都执行完，再开始执行。由于前面的操作到底需要多少时间执行完，是不确定的，所以我们没有办法保证，被推迟的操作一定会按照预定时间执行。这一点对于setInterval影响尤其大。

{% highlight javascript %}

setInterval(function(){console.log(2);},1000);

(function (){ sleeping(3000);})();

{% endhighlight %}

上面的第一行语句要求每隔1000毫秒，就输出一个2。但是，第二行语句需要3000毫秒才能完成，请问会发生什么结果？

结果就是等到第二行语句运行完成以后，立刻连续输出三个2，然后开始每隔1000毫秒，输出一个2。为了进一步理解JavaScript的单线程模型，请看下面这段代码。

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

- 0-15ms，运行init函数。
- 15-23ms，运行handleMouseClick函数。请注意，这个函数是在5ms时触发的，应该在那个时候就立即运行，但是由于单线程的关系，必须等到init函数完成之后再运行。
- 23-25ms，运行timerTask函数。这个函数是在10ms时触发的，规定每10ms运行一次，即在20ms、30ms、40ms等时候运行。由于20ms时，JavaScript线程还有任务在运行，因此必须延迟到前面任务完成时再运行。
- 30-32ms，运行timerTask函数。
- 40-42ms，运行timerTask函数。

由于setInterval无法保证每次操作之间的间隔，为了避免这种情况，可以用setTimeout替代setInterval。

{% highlight javascript %}

var recursive = function () {
    console.log("It has been one second!");
    setTimeout(recursive,1000);
}

recursive();

{% endhighlight %}

上面这样的写法，就能保证两次recursive之间的运行间隔，一定是1000毫秒。

clearTimeout 和 clearInterval 方法，用于取消 setTimeout 和 setInterval 指定的操作。

{% highlight javascript %}

var id1 = setTimeout(f,1000);
var id2 = setInterval(f,1000);

clearTimeout(id1);
clearInterval(id2);

{% endhighlight %}

除了前两个参数，setTimeout 和 setInterval 方法还可以接受更多的参数，它们会传入这两个方法指定的回调函数。

{% highlight javascript %}

function f(){
	for (var i=0;i<arguments.length;i++){
		console.log(arguments[i]);
	}
}

setTimeout(f, 1000, "a", "b", "c");
setInterval(f, 1000, "Hello World");

{% endhighlight %}

上面代码的运行结果如下：

{% highlight bash %}

a
b
c
Hello World
Hello World
Hello World
...

{% endhighlight %}

### setTimeout(f,0)的作用

可见单线程的特点就是一个时间只有一个任务运行，后面的任务必须排队等待。有时，为了将耗时的任务移到当前栈的结尾，可以使用setTimeout(function, 0)方法。

{% highlight javascript %}

console.log("栈开始");

setTimeout(function() { console.log("当前栈结束后运行");}, 0);

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
console.log("栈结束");

{% endhighlight %}

上面代码的运行结果如下：

{% highlight bash %}

栈开始
当前任务开始
a() 开始运行
b() 开始运行
传入的值为42
b() 结束运行
a() 结束运行
栈结束
当前栈结束后运行

{% endhighlight %}

可以看到，setTimeout(function, 0)将任务移到当前栈结束后运行。

现在的计算机CPU普遍是多核的，单线程就意味着只使用一核。这当然没有充分利用资源，所以HTML5提供了Web Worker，允许通过这个API实现多线程操作。

## 参考链接

- John Dalziel, [The race for speed part 2: How JavaScript compilers work](http://creativejs.com/2013/06/the-race-for-speed-part-2-how-javascript-compilers-work/)
- Jake Archibald，[Deep dive into the murky waters of script loading](http://www.html5rocks.com/en/tutorials/speed/script-loading/)
