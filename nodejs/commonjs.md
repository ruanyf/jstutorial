---
title: CommonJS规范
layout: page
category: nodejs
date: 2013-06-04
modifiedOn: 2013-06-13
---

## 概述

CommonJS是服务器端模块的规范。

根据CommonJS规范，一个单独的文件就是一个模块。每个模块使用两个通用的组件：

- exports变量：它所包含的对象，就是对外输出的、供其他模块调用的对象。
- require函数：用于加载或输入其他模块。

举例来说，定义一个最简单的模块，只要一行语句就够了。

{% highlight javascript %}

// addition.js

exports.do = function(a, b){ return a + b };

{% endhighlight %}

上面的语句定义了一个加法模块，做法就是在exports对象上定义一个do方法，那就是供外部调用的方法。

使用的时候，只要用require函数调用即可。

{% highlight javascript %}

var add = require('./addition');

add.do(1,2)
// 3

{% endhighlight %}

require调用的时候，需要给出模块的路径，但是不用加后缀名，因为文件后缀名默认为js。

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

AMD规范允许输出的模块兼容CommonJS规范，这时define方法需要写成下面这样：

{% highlight javascript %}

define(function( require, exports, module )
    var someModule = require( "someModule" );
    var anotherModule = require( "anotherModule" );    

    someModule.doTehAwesome();
    anotherModule.doMoarAwesome();

    exports.asplode = function() {
        someModule.doTehAwesome();
        anotherModule.doMoarAwesome();
    };
});

{% endhighlight %}

## 参考链接

- Addy Osmani, [Writing Modular JavaScript With AMD, CommonJS & ES Harmony](http://addyosmani.com/writing-modular-js/)
