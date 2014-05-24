---
title: 浏览器的JavaScript引擎
layout: page
category: bom
date: 2013-03-10
modifiedOn: 2013-12-22
---

浏览器通过内置的JavaScript引擎，读取网页中的代码，对其处理后运行。

## JavaScript代码嵌入网页的方法

在网页中嵌入JavaScript代码有多种方法。

### 直接添加代码块

通过script标签，可以直接将JavaScript代码嵌入网页。

{% highlight html %}

<script>
// some JavaScript code
</script>

{% endhighlight %}

### 加载外部脚本

script标签也可以指定加载外部的脚本文件。

{% highlight html %}

<script src="example.js"></script>

{% endhighlight %}

如果脚本文件使用了非英语字符，还应该注明编码。

{% highlight html %}

<script charset="utf-8" src="example.js"></script>

{% endhighlight %}

加载外部脚本和直接添加代码块，这两种方法不能混用。下面代码的console.log语句直接被忽略。

```html

<script charset="utf-8" src="example.js">
	console.log('Hello World!');
</script>

```

### 行内代码

除了上面两种方法，HTML语言允许在某些元素的事件属性和a元素的href属性中，直接写入JavaScript。

{% highlight html %}

<div onclick="alert('Hello')"></div>

<a href="javascript:alert('Hello')"></a>

{% endhighlight %}

这种写法将HTML代码与JavaScript代码混写在一起，非常不利于代码管理，不建议使用。

## 外部脚本的加载

### 网页底部加载

加载外部脚本时，浏览器会暂停页面渲染，等待脚本下载并执行完成后，再继续页面渲染。这被称为“阻塞效应”。

这是因为JavaScript代码可能会修改页面，所以必须等它执行完才能接着渲染。由于这个原因，如果某段代码的下载或执行时间特别长，浏览器就会呈现“假死”状态，失去响应。为了避免这种情况，较好的做法是将script标签都放在页面底部，而不是头部。

将脚本文件都放在网页尾部加载，还有一个好处。在DOM结构生成之前就调用DOM，JavaScript会报错，如果脚本都在网页尾部加载，就不存在这个问题，因为这时DOM肯定已经生成了。

{% highlight html %}

<head>
	<script>
		console.log(document.body.innerHTML); 
	</script>
</head>

{% endhighlight %}

上面代码执行时会报错，因为此时body元素还未生成。

一种解决方法是设定DOMContentLoaded事件的回调函数。

```html

<head>
	<script>
		document.addEventListener("DOMContentLoaded", function(event) {
			console.log(document.body.innerHTML);
		 });
	</script>
</head>

```

但是，如果将脚本放在页面底部，连回调函数也不用写了。

```html

<body>
	<!-- 其他代码  -->
	<script>
		console.log(document.body.innerHTML);
	</script>
</body>

```

### load事件

当script标签指定的外部脚本文件下载和解析完成，会触发一个load事件，可以为这个事件指定回调函数。

{% highlight html %}

<script src="jquery.min.js" onload="console.log('jQuery已加载！')"></script>

{% endhighlight %}

### 多个脚本的加载

如果有多个script标签，比如下面这样：

{% highlight html %}

<script src="1.js"></script>
<script src="2.js"></script>

{% endhighlight %}

浏览器会同时平行下载1.js和2.js，但是执行时会保证先执行1.js，然后再执行2.js，即使后者先下载完成，也是如此。也就是说，脚本的执行顺序由它们在页面中的出现顺序决定，这是为了保证脚本之间的依赖关系不受到破坏。

当然，加载这两个脚本都会产生“阻塞效应”，必须等到它们都加载完成，浏览器才会继续页面渲染。

此外，对于来自同一个域名的资源，比如脚本文件、样式表文件、图片文件等，浏览器一般最多同时下载六个。如果是来自不同域名的资源，就没有这个限制。所以，通常把静态文件放在不同的域名之下，以加快下载速度。

### defer属性

为了解决脚本文件下载阻塞网页渲染的问题，一个方法是加入defer属性。

{% highlight html %}

<script src="1.js" defer></script>
<script src="2.js" defer></script>

{% endhighlight %}

有了defer属性，浏览器下载脚本文件的时候，不会阻塞页面渲染。下载的脚本文件在DOMContentLoaded事件触发前执行（即刚刚读取完&lt;/html&gt;标签），而且可以保证执行顺序就是它们在页面上出现的顺序。但是，浏览器对这个属性的支持不够理想，IE（<=9）还有一个bug，无法保证2.js一定在1.js之后执行。

对于内置而不是连接外部脚本的script标签，以及动态生成的script标签，defer属性不起作用。

### async属性

解决“阻塞效应”的另一个方法是加入async属性。

{% highlight html %}

<script src="1.js" async></script>
<script src="2.js" async></script>

{% endhighlight %}

async属性可以保证脚本下载的同时，浏览器继续渲染。一旦渲染完成，再执行脚本文件，即“异步执行”。需要注意的是，一旦采用这个属性，就无法保证脚本的执行顺序。哪个脚本先下载结束，就先执行那个脚本。IE 10支持async属性，低于这个版本的IE都不支持。

如果同时使用async和defer属性，后者不起作用，浏览器行为由async属性决定。

### 脚本的动态嵌入

除了用静态的script标签，还可以动态嵌入script标签。

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

此外，动态嵌入还有一个地方需要注意。动态嵌入必须等待CSS文件加载完成后，才会去下载外部脚本文件。静态加载就不存在这个问题，script标签指定的外部脚本文件，都是与CSS文件同时并发下载的。

### 加载使用的协议

如果不指定协议，浏览器默认采用HTTP协议下载。

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

### Event Loop

JavaScript采用单线程模型，也就是说，所有的任务都在一个线程里运行。这意味着，一次只能运行一个任务，其他任务都必须在后面排队等待。

JavaScript之所以采用单线程，而不是多线程，跟历史有关系。JavaScript从诞生起就是单线程。原因大概是不想让浏览器变得太复杂，因为多线程需要共享资源、且有可能修改彼此的运行结果，对于一种网页脚本语言来说，这就太复杂了。后来就约定俗成，JavaScript为一种单线程语言。（Worker API可以实现多线程，但是JavaScript本身始终是单线程的。）

单线程模型带来了一些问题，主要是新的任务被加在队列的尾部，只有前面的所有任务运行结束，才会轮到它执行。如果有一个任务特别耗时，后面的任务都会停在那里等待，造成浏览器失去响应，又称“假死”。为了避免“假死”，当某个操作在一定时间后仍无法结束，浏览器就会跳出提示框，询问用户是否要强行停止脚本运行。

为了解决这个问题，JavaScript采用了Event Loop机制。

想要理解Event Loop，就要从程序的运行模式讲起。运行以后的程序叫做"进程"（process），一般情况下，一个进程一次只能执行一个任务。如果有很多任务需要执行，不外乎三种解决方法。

1. **排队。**因为一个进程一次只能执行一个任务，只好等前面的任务执行完了，再执行后面的任务。

2. **新建进程。**使用fork命令，为每个任务新建一个进程。

3. **新建线程。**因为进程太耗费资源，所以如今的程序往往允许一个进程包含多个线程，由线程去完成任务。

如果某个任务很耗时，比如涉及很多I/O（输入/输出）操作，那么线程的运行大概是下面的样子。

![synchronous mode](http://image.beekka.com/blog/201310/2013102002.png)

上图的绿色部分是程序的运行时间，红色部分是等待时间。可以看到，由于I/O操作很慢，所以这个线程的大部分运行时间都在空等I/O操作的返回结果。这种运行方式称为"同步模式"（synchronous I/O）。

如果采用多线程，同时运行多个任务，那很可能就是下面这样。

![synchronous mode](http://image.beekka.com/blog/201310/2013102003.png)

上图表明，多线程不仅占用多倍的系统资源，也闲置多倍的资源，这显然不合理。

Event Loop就是为了解决这个问题而提出的。[Wikipedia](http://en.wikipedia.org/wiki/Event_loop)这样定义：

> "**Event Loop是一个程序结构，用于等待和发送消息和事件。**（a programming construct that waits for and dispatches events or messages in a program.）"

简单说，就是在程序中设置两个线程：一个负责程序本身的运行，称为"主线程"；另一个负责主线程与其他进程（主要是各种I/O操作）的通信，被称为"Event Loop线程"（可以译为"消息线程"）。

![asynchronous mode](http://image.beekka.com/blog/201310/2013102004.png)

上图主线程的绿色部分，还是表示运行时间，而橙色部分表示空闲时间。每当遇到I/O的时候，主线程就让Event Loop线程去通知相应的I/O程序，然后接着往后运行，所以不存在红色的等待时间。等到I/O程序完成操作，Event Loop线程再把结果返回主线程。主线程就调用事先设定的回调函数，完成整个任务。

可以看到，由于多出了橙色的空闲时间，所以主线程得以运行更多的任务，这就提高了效率。这种运行方式称为"[异步模式](http://en.wikipedia.org/wiki/Asynchronous_I/O)"（asynchronous I/O）。

这正是JavaScript语言的运行方式。单线程模型虽然对JavaScript构成了很大的限制，但也因此使它具备了其他语言不具备的优势。如果部署得好，JavaScript程序是不会出现堵塞的，这就是为什么node.js平台可以用很少的资源，应付大流量访问的原因。

### setTimeout方法

除了将等待I/O操作的时间移出主线程，JavaScript还提供了其他一些方法，避免“假死”。最常见的就是用 setTimeout 和 setInterval 方法，将耗时的任务移到任务队列（其实就是Event Loop）的尾部，在较晚的时间运行。

先来看setTimeout方法，它的作用是推迟某个任务的运行时间，从而改变JavaScript的正常执行顺序。

{% highlight javascript %}

console.log(1);
console.log(2);
console.log(3);

{% endhighlight %}

正常情况下，上面三行语句按照顺序执行，输出1--2--3。现在，用setTimeout改变执行顺序。

{% highlight javascript %}

console.log(1);
setTimeout(function(){console.log(2);},1000);
console.log(3);

{% endhighlight %}

上面代码的输出结果就是1--3--2，因为setTimeout方法指定第二行语句，在所有任务结束后，等待1000毫秒再执行。

setTimeout方法的前两个参数是必需的。第一个参数是回调函数，第二个参数是推迟执行的时间，单位为毫秒。除了这两个参数以外，其他参数都是可选的，将在回调函数运行时传入回调函数。

{% highlight javascript %}

setTimeout(function(a,b){console.log(a+b);},1000,1,1);

{% endhighlight %}

上面代码表示，将在1000毫秒之后执行回调函数，输出1加1的和。

IE小于9.0的版本，只允许setTimeout有两个参数，不支持更多的参数。这时有三种解决方法，第一种是自定义setTimeout，使用apply方法将参数输入回调函数；第二种是在一个匿名函数里面，让回调函数带参数运行，再把匿名函数输入setTimeout；第三种使用bind方法，把多余的参数绑定在回调函数上面，生成一个新的函数输入setTimeout。

除了参数问题，setTimeout还有一个需要注意的地方：被setTimeout推迟执行的回调函数是在全局环境执行，这有可能不同于函数定义时的上下文环境。

{% highlight javascript %}

var n = 1;

var o = {
	n: 2,
	m: function(){console.log(this.n);}
};

var timeoutID = setTimeout(o.m,1000);

{% endhighlight %}

上面代码输出的是1，而不是2，这表示回调函数的运行环境已经变成了全局环境。

### setInterval方法

setInterval方法的使用格式和需要注意的地方，与setTimeout完全一致，两者的区别仅仅在于setInterval指定某个任务每隔一段时间就执行一次。

{% highlight javascript %}

setInterval(function(){console.log(2);},1000);

{% endhighlight %}

上面代码表示每隔1000毫秒就输出一个2。

除了前两个参数，setInterval 方法还可以接受更多的参数，它们会传入回调函数。

{% highlight javascript %}

function f(){
	for (var i=0;i<arguments.length;i++){
		console.log(arguments[i]);
	}
}

setInterval(f, 1000, "Hello World");

{% endhighlight %}

上面代码的运行结果如下：

{% highlight bash %}

Hello World
Hello World
Hello World
...

{% endhighlight %}

如果网页不在浏览器的当前窗口（或tab），许多浏览器限制setInteral指定的反复运行的任务最多每秒执行一次。

### clearTimeout 和 clearInterval 方法，

setTimeout 和 setInterval 方法都返回一个表示计数器编号的整数值，将该整数传入clearTimeout 和 clearInterval 方法，就可以取消指定的操作。

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

### 运行队列

本质上，setTimeout和setInterval都是把任务添加到“运行队列”的尾部，等到前面的任务都执行完，再开始执行。由于前面的任务到底需要多少时间执行完，是不确定的，所以没有办法保证，被推迟的任务一定会按照预定时间执行。

{% highlight javascript %}

setTimeout(someTask,100);
veryLongTask();

{% endhighlight %}

上面代码的setTimeout，指定100毫秒以后运行一个任务。但是，如果后面立即运行的任务非常耗时，过了100毫秒还无法结束，那么被推迟运行的someTask就只有等着，等到前面的veryLongTask运行结束，才轮到它执行。

这一点对于setInterval影响尤其大。

{% highlight javascript %}

setInterval(function(){console.log(2);},1000);

(function (){ sleeping(3000);})();

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

由于setInterval无法保证每次操作之间的间隔，存在累积效应，为了避免这个问题，可以反复调用setTimeout，替代setInterval。

{% highlight javascript %}

var recursive = function () {
    console.log("It has been one second!");
    setTimeout(recursive,1000);
}

recursive();

{% endhighlight %}

上面这样的写法，就能保证两次recursive之间的运行间隔，一定是1000毫秒。

另一种方法是自己部署一个函数，模拟setInterval的效果。

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

interval(function(){console.log(2);},1000);

{% endhighlight %}

上面代码部署了一个interval函数，用循环调用setTimeout模拟了setInterval。

### 推迟时间的极限和setTimeout(f,0)的作用

跟据[HTML 5标准](http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#timers)，setTimeOut推迟执行的时间，最少是4毫秒。但是，实际应用中，可以看到有推迟0秒的。

{% highlight javascript %}

setTimeout(function (){console.log("你好！"), 0);

{% endhighlight %}

这种写法的含义是，当前任务队列一结束就运行setTimeout指定的回调函数。

{% highlight javascript %}

console.log("任务队列开始");

setTimeout(function() { console.log("任务队列结束后运行");}, 0);

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
console.log("任务队列结束");

{% endhighlight %}

上面代码的运行结果如下：

{% highlight bash %}

任务队列开始
当前任务开始
a() 开始运行
b() 开始运行
传入的值为42
b() 结束运行
a() 结束运行
任务队列结束
任务队列结束后运行

{% endhighlight %}

可以看到，setTimeout(function, 0)将任务移到当前任务队列结束后运行。

浏览器内部使用32位带符号的整数，来储存推迟执行的时间。这意味着setTimeout最多只能推迟执行2147483647毫秒（24.8天），超过这个时间会发生溢出，导致回调函数将在当前任务队列结束后立即执行，即等同于setTimeout(f,0)的效果。

本质上，setTimeout(f, 0)这种写法反映了JavaScript单线程运行的特点。但是，现在的计算机CPU普遍是多核的，单线程就意味着只使用一核。这当然没有充分利用资源，所以HTML5提供了Web Worker，允许通过这个API实现多线程操作。

## 参考链接

- John Dalziel, [The race for speed part 2: How JavaScript compilers work](http://creativejs.com/2013/06/the-race-for-speed-part-2-how-javascript-compilers-work/)
- Jake Archibald，[Deep dive into the murky waters of script loading](http://www.html5rocks.com/en/tutorials/speed/script-loading/)
- Mozilla Developer Network, [window.setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/window.setTimeout)
- Remy Sharp, [Throttling function calls](http://remysharp.com/2010/07/21/throttling-function-calls/)
- Ayman Farhat, [An alternative to Javascript's evil setInterval](http://www.thecodeship.com/web-development/alternative-to-javascript-evil-setinterval/)
- Ilya Grigorik, [Script-injected "async scripts" considered harmful](https://www.igvita.com/2014/05/20/script-injected-async-scripts-considered-harmful/)
