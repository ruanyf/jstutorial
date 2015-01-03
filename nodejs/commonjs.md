---
title: CommonJS规范
layout: page
category: nodejs
date: 2013-06-04
modifiedOn: 2013-08-13
---

## 概述

CommonJS是服务器端模块的规范，Node.js采用了这个规范。

根据CommonJS规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在该模块内部定义的变量，无法被其他模块读取，除非定义为global对象的属性。

```javascript

global.warning = true;

```

上面代码的waining变量，可以被所有模块读取。当然，这样做是不推荐，输出模块变量的最好方法是使用module.exports对象。

```javascript

var i = 1;
var max = 30;

module.exports = function () {
  for (i -= 1; i++ < max; ) {
    console.log(i);
  }
  max *= 1.1;
};

```

上面代码通过module.exports对象，定义了一个函数，该函数就是模块外部与内部通信的桥梁。

加载模块使用require方法，该方法读取一个文件并执行，最后返回文件内部的module.exports对象。假定有一个一个简单的模块example.js。

{% highlight javascript %}

// example.js

console.log("evaluating example.js");

var invisible = function () {
  console.log("invisible");
}

exports.message = "hi";

exports.say = function () {
  console.log(message);
}

{% endhighlight %}

使用require方法，加载example.js。

{% highlight javascript %}

// main.js

var example = require('./example.js');

{% endhighlight %}

这时，变量example就对应模块中的module.exports对象，于是就可以通过这个变量，使用example.js模块提供的各个方法。

require方法默认读取js文件，所以可以省略js后缀名，所以上面的代码往往写成下面这样。

{% highlight javascript %}

var example = require('./example');

{% endhighlight %}

js文件名前面需要加上路径，可以是相对路径（相对于使用require方法的文件），也可以是绝对路径。如果省略路径，node.js会认为，你要加载一个核心模块，或者已经安装在本地 node_modules 目录中的模块。如果加载的是一个目录，node.js会首先寻找该目录中的 package.json 文件，加载该文件 main 属性提到的模块，否则就寻找该目录下的 index.js 文件。

下面的例子是使用一行语句，定义一个最简单的模块。

{% highlight javascript %}

// addition.js

exports.do = function(a, b){ return a + b };

{% endhighlight %}

上面的语句定义了一个加法模块，做法就是在exports对象上定义一个do方法，那就是供外部调用的方法。使用的时候，只要用require函数调用即可。

{% highlight javascript %}

var add = require('./addition');

add.do(1,2)
// 3

{% endhighlight %}

再看一个复杂一点的例子。

{% highlight javascript %}

// foobar.js

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

有时，不需要exports返回一个对象，只需要它返回一个函数。这时，就要写成module.exports。

{% highlight javascript %}

module.exports = function () {
  console.log("hello world")
}

{% endhighlight %}

## AMD规范与CommonJS规范的兼容性

CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD规范则是非同步加载模块，允许指定回调函数。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范。

AMD规范使用define方法定义模块，下面就是一个例子：

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

define(function (require, exports, module){
    var someModule = require("someModule");
    var anotherModule = require("anotherModule");    

    someModule.doTehAwesome();
    anotherModule.doMoarAwesome();

    exports.asplode = function (){
        someModule.doTehAwesome();
        anotherModule.doMoarAwesome();
    };
});

{% endhighlight %}

## 参考链接

- Addy Osmani, [Writing Modular JavaScript With AMD, CommonJS & ES Harmony](http://addyosmani.com/writing-modular-js/)
- Pony Foo, [A Gentle Browserify Walkthrough](http://blog.ponyfoo.com/2014/08/25/a-gentle-browserify-walkthrough)
