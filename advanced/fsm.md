---
title: JavaScript与有限状态机
layout: page
category: advanced
date: 2013-09-02
modifiedOn: 2013-09-03
---

## 概述

有限状态机（Finite-state machine）是一个非常有用的模型，可以模拟世界上大部分事物。

简单说，它有三个特征：

- 状态总数（state）是有限的。
- 任一时刻，只处在一种状态之中。
- 某种条件下，会从一种状态转变（transition）到另一种状态。

它对JavaScript的意义在于，很多对象可以写成有限状态机。

举例来说，网页上有一个菜单元素。鼠标点击，菜单显示；鼠标再次点击，菜单隐藏。如果使用有限状态机描述，就是这个菜单只有两种状态（显示和隐藏），鼠标会引发状态转变。

代码可以写成下面这样：

{% highlight javascript %}

var menu = {
　　    
　　// 当前状态
　　currentState: 'hide',
　　
　　// 绑定事件
　　initialize: function() {
　　　　var self = this;
　　　　self.on("click", self.transition);
　　},
　　
　　// 状态转换
　　transition: function(event){
　　　　switch(this.currentState) {
　　　　　　case "hide":
　　　　　　　　this.currentState = 'show';
　　　　　　　　doSomething();
　　　　　　　　break;
　　　　　　case "show":
　　　　　　　　this.currentState = 'hide';
　　　　　　　　doSomething();
　　　　　　　　break;
　　　　　　default:
　　　　　　　　console.log('Invalid State!');
　　　　　　　　break;
　　　　}
　　}
　　
};

{% endhighlight %}

可以看到，有限状态机的写法，逻辑清晰，表达力强，有利于封装事件。一个对象的状态越多、发生的事件越多，就越适合采用有限状态机的写法。

另外，JavaScript语言是一种异步操作特别多的语言，常用的解决方法是指定回调函数，但这样会造成代码结构混乱、难以测试和除错等问题。有限状态机提供了更好的办法：把异步操作与对象的状态改变挂钩，当异步操作结束的时候，发生相应的状态改变，由此再触发其他操作。这要比回调函数、事件监听、发布/订阅等解决方案，在逻辑上更合理，更易于降低代码的复杂度。

## Javascript Finite State Machine函数库

下面介绍一个有限状态机的函数库[Javascript Finite State Machine](https://github.com/jakesgordon/javascript-state-machine)。这个库非常好懂，可以帮助我们加深理解，而且功能一点都不弱。

该库提供一个全局对象StateMachine，使用该对象的create方法，可以生成有限状态机的实例。

{% highlight javascript %}

var fsm = StateMachine.create();

{% endhighlight %}

生成的时候，需要提供一个参数对象，用来描述实例的性质。比如，交通信号灯（红绿灯）可以这样描述：

{% highlight javascript %}

var fsm = StateMachine.create({
　　
　　initial: 'green',
　　
　　events: [
　　　　{ name: 'warn',  from: 'green',  to: 'yellow' },
　　　　{ name: 'stop', from: 'yellow', to: 'red' },
　　　　{ name: 'ready',  from: 'red',    to: 'yellow' },
　　　　{ name: 'go', from: 'yellow', to: 'green' }
　　]
　　
});

{% endhighlight %}

交通信号灯的初始状态（initial）为green，events属性是触发状态改变的各种事件，比如warn事件使得green状态变成yellow状态，stop事件使得yellow状态变成red状态等等。

生成实例以后，就可以随时查询当前状态。

- fsm.current ：返回当前状态。
- fsm.is(s) ：返回一个布尔值，表示状态s是否为当前状态。
- fsm.can(e) ：返回一个布尔值，表示事件e是否能在当前状态触发。
- fsm.cannot(e) ：返回一个布尔值，表示事件e是否不能在当前状态触发。

Javascript Finite State Machine允许为每个事件指定两个回调函数，以warn事件为例：

- onbefore**warn**：在warn事件发生之前触发。
- onafter**warn**（可简写成onwarn） ：在warn事件发生之后触发。

同时，它也允许为每个状态指定两个回调函数，以green状态为例：

- onleave**green** ：在离开green状态时触发。
- onenter**green**（可简写成ongreen） ：在进入green状态时触发。

假定warn事件使得状态从green变为yellow，上面四类回调函数的发生顺序如下：onbefore**warn** → onleave**green** → onenter**yellow** → onafter**warn**。

除了为每个事件和状态单独指定回调函数，还可以为所有的事件和状态指定通用的回调函数。

- onbeforeevent ：任一事件发生之前触发。
- onleavestate ：离开任一状态时触发。
- onenterstate ：进入任一状态时触发。
- onafterevent ：任一事件结束后触发。

如果事件的回调函数里面有异步操作（比如与服务器进行Ajax通信），这时我们可能希望等到异步操作结束，再发生状态改变。这就要用到transition方法。

{% highlight javascript %}

fsm.onleavegreen = function(){
　　light.fadeOut('slow', function() {
　　　　fsm.transition();
　　});
　　return StateMachine.ASYNC;
};

{% endhighlight %}

上面代码的回调函数里面，有一个异步操作（light.fadeOut）。如果不希望状态立即改变，就要让回调函数返回StateMachine.ASYNC，表示状态暂时不改变；等到异步操作结束，再调用transition方法，使得状态发生改变。

Javascript Finite State Machine还允许指定错误处理函数，当发生了当前状态不可能发生的事件时自动触发。

{% highlight javascript %}

var fsm = StateMachine.create({
　　// ...
　　error: function(eventName, from, to, args, errorCode, errorMessage) {
　　　　return 'event ' + eventName + ': ' + errorMessage;
　　},
　　// ... 
});

{% endhighlight %}

比如，当前状态是green，理论上这时只可能发生warn事件。要是这时发生了stop事件，就会触发上面的错误处理函数。

Javascript Finite State Machine的基本用法就是上面这些，更详细的介绍可以参见它的[主页](https://github.com/jakesgordon/javascript-state-machine)。

## 参考链接

- Jim Cowart, [Five Patterns to Help You Tame Asynchronous JavaScript](http://tech.pro/blog/1402/five-patterns-to-help-you-tame-asynchronous-javascript)
