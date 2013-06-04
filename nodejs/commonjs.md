---
title: CommonJS规范
layout: page
category: nodejs
date: 2013-06-04
modifiedOn: 2013-06-04
---

## 概述

CommonJS是服务器端模块的规范。

每个模块使用两个通用的组件：

- exports变量：它所包含的对象，就是对外输出的、供其他模块调用的对象。
- require函数：用于加载或输入其他模块。

下面就是一个典型的CommonJS模块。

{% highlight javascript %}

var lib = require('package/lib');
 
function foo(){
    lib.log('hello world!');
}
 
exports.foo = foo;

{% endhighlight %}

调用该模块的方法如下：

{% highlight javascript %}

require('./foo').foo()
// "hello world!"

{% endhighlight %}

再看一个复杂一点的例子。

{% highlight javascript %}

function foobar(){
        this.foo = function(){
                console.log('Hello foo');
        }
 
        this.bar = function(){
                console.log('Hello bar');
        }
}
 
exports.foobar = foobar;

{% endhighlight %}

调用该模块的方法如下：

{% highlight javascript %}

var foobar = require('./foobar').foobar,
    test   = new foobar();
 
test.bar(); // 'Hello bar'

{% endhighlight %}

## AMD规范与CommonJS规范的兼容性

上面第一个例子，用AMD规范改写就是：

{% highlight javascript %}

define(['package/lib'], function(lib){
 
    function foo(){
        lib.log('hello world!');
    } 
 
    return {
        foo: foo
    };
});

{% endhighlight %}
