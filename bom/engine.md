---
title: JavaScript 运行原理
layout: page
category: bom
date: 2013-03-10
modifiedOn: 2013-05-21
---

## 概述

JavaScript是一种解释型语言，也就是说，它不需要编译，可以由解释器实时运行。这样的好处是运行和修改都比较方便，刷新页面就可以重新解释；缺点是每次运行都要调用解释器，系统开销较大，运行速度慢于编译型语言。

目前的浏览器都将JavaScript进行一定程度的编译，生成类似字节码的中间代码，以提高运行速度。

## JavaScript虚拟机

JavaScript实际上运行在一个虚拟机（Virtual Machine）之上，我们一般也把虚拟机称为JavaScript引擎。与其他语言的虚拟机不同的是，JavaScript虚拟机并不基于字节码，而是基于源码的。只要有可能，就通过JIT（just in time）编译器直接编译运行。这样做的目的，是优化代码、提供性能，因为编译执行比一行行地解释执行要快得多。下面是目前最常见的一些JavaScript虚拟机：

- [Chakra](http://en.wikipedia.org/wiki/Chakra_(JScript_engine\))(Microsoft Internet Explorer)
- [Nitro/JavaScript Core](http://en.wikipedia.org/wiki/WebKit#JavaScriptCore) (Safari)
- [Carakan](http://dev.opera.com/articles/view/labs-carakan/) (Opera)
- [SpiderMonkey](https://developer.mozilla.org/en-US/docs/SpiderMonkey) (Firefox)
- [V8](http://en.wikipedia.org/wiki/V8_(JavaScript_engine\)) (Chrome, Chromium)

## 插入网页的方法

可以使用script标签，直接将代码嵌入网页。

{% highlight html %}

<script>
// some JavaScript code
</script>

{% endhighlight %}

也可以指定脚本文件，让script标签读取。

{% highlight html %}

<script src="example.js"></script>

{% endhighlight %}

JavaScript代码按照插入网页的顺序执行。如果有脚本文件没有下载完成，页面就会停止渲染，等待下载完成。为了避免这种“浏览器假死”，较好的做法是将script标签放在页面底部，而不是头部。i

## 单线程模型

JavaScript在浏览器中以单线程运行，也就是说，所有的操作都在一个线程里按照某种顺序运行。如果有一个操作特别耗时，后面的操作都会停在那里等待，造成浏览器堵塞，又称“假死”，使得用户体验变得非常差。

浏览器为了避免这种情况，当某个操作迟迟无法结束时，会跳出提示框，询问用户是否要停止脚本运行。而JavaScript本身也提供了一些解决方法，最常见的就是用 setTimeout 和 setInterval 方法，将某个耗时的操作放到较晚的时间运行。另外，XMLHttpRequest对象提供了异步操作，使得Ajax操作（非常耗时的操作）可以在另一个线程上完成，不影响主线程。

为了理解JavaScript对象的单线程模型，请看下面这段代码。

{% highlight javascript %}

    function init(){
        { 耗时5ms的某个操作 } 
        触发mouseClickEvent事件
        { 耗时5ms的某个操作 }
        setInterval(timerTask,"10");
        { 耗时5ms的某个操作 }
    }

    function handleMouseClick(){
          耗时8ms的某个操作 
    }

    function timerTask(){
          耗时2ms的某个操作 
    }

{% endhighlight %}

请问这段代码的运行顺序是怎样的？

- 0-15ms，运行init函数。
- 15-23ms，运行handleMouseClick函数。请注意，这个函数是在5ms时触发的，应该在那个时候就立即运行，但是由于单线程的关系，必须等到init函数完成之后再运行。
- 23-25ms，运行timerTask函数。这个函数是在10ms时触发的，规定每10ms运行一次，即在20ms、30ms、40ms等时候运行。由于20ms时，JavaScript线程还有任务在运行，因此必须延迟到前面任务完成时再运行。
- 30-32ms，运行timerTask函数。
- 40-42ms，运行timerTask函数。

可见单线程的特点就是一个时间只有一个任务运行，后面的任务必须排队等待。

现在的计算机CPU普遍是多核的，单线程就意味着只使用一核。这当然没有充分利用资源，所以HTML5提供了Web Worker，允许通过这个API实现多线程操作。
