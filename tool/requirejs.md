---
title: RequireJS和AMD规范
layout: page
category: tool
date: 2013-05-05
modifiedOn: 2013-06-10
---

## 概述

RequireJS是一个工具库，主要用于客户端的模块管理，它遵守[AMD规范](https://github.com/amdjs/amdjs-api/wiki/AMD)（Asynchronous Module Definition）。

它主要提供define和require两个方法，前者用于定义模块，后者用于调用模块。

## define方法：定义模块

define方法用于定义模块。

（1）第一种情况：独立模块。

如果被定义的模块是一个独立模块，不需要依赖任何其他模块，则可以直接用define方法生成。

{% highlight javascript %}

define({
    method1: function() {},
    method2: function() {},
    method3: function() {}    
});

{% endhighlight %}

也可以把对象写成一个函数，该函数的返回值就是输出的模块。

{% highlight javascript %}

define(function () {
	return {
	    method1: function() {},
		method2: function() {},
    };
});
 
{% endhighlight %}

（2）第二种情况：非独立模块。

如果被定义的模块需要依赖其他模块，则define方法必须采用下面的格式。

{% highlight javascript %}

define(['module1', 'module2'], function(m1, m2) {
   ...
});

{% endhighlight %}

define方法的第一个参数是一个数组，它的成员是当前模块所依赖的模块。比如，['module1', 'module2']表示我们定义的这个新模块依赖于module1模块和module2模块，只有先加载这两个模块，新模块才能正常运行。一般情况下，module1模块和module2模块指的是，当前目录下的module1.js文件和module2.js文件。

define方法的第二个参数是一个函数，当前面数组的所有成员加载成功后，它将被调用。它的参数与数组的成员一一对应，比如function(m1, m2)就表示，这个函数的第一个参数m1对应module1模块，第二个参数m2对应module2模块。这个函数必须返回一个对象，供其他模块调用。

{% highlight javascript %}

define(['module1', 'module2'], function(m1, m2) {

    return {
        method: function() {
            m1.methodA();
			m2.methodB();
        }
    };

});

{% endhighlight %}

需要注意的是，回调函数必须返回一个对象。这个对象就是你定义的模块，这个对象的方法就是模块的外部调用接口。

下面是一个实际的例子。

{% highlight javascript %}

define(['math', 'graph'], 
    function ( math, graph ) {
		return {
            plot: function(x, y){
                return graph.drawPie(math.randomGrid(x,y));
            }
        }
    };
);

{% endhighlight %}

## require方法：调用模块

require方法用于调用模块。它的参数与define方法类似。

{% highlight javascript %}

require(['foo', 'bar'], function ( foo, bar ) {
        foo.doSomething();
});

{% endhighlight %}

require方法的回调函数，就是执行具体任务的部分。

指定依赖关系的数组，可以灵活应用，请看下面的例子。

{% highlight javascript %}

require( [ window.JSON ? undefined : 'util/json2' ], function ( JSON ) {
  JSON = JSON || window.JSON;
 
  console.log( JSON.parse( '{ "JSON" : "HERE" }' ) );
});

{% endhighlight %}

上面代码加载JSON模块时，首先判断浏览器是否原生支持JSON对象。如果是的，则将undefined传入回调函数，否则加载util目录下的json2模块。

在define方法内部，也可以调用模块。

{% highlight javascript %}

define(function(require) {
   var otherModule = require('otherModule');
});

{% endhighlight %}

下面的例子显示了如何动态加载模块。

{% highlight javascript %}

define(function ( require ) {
    var isReady = false, foobar;
 
    require(['foo', 'bar'], function (foo, bar) {
        isReady = true;
        foobar = foo() + bar();
    });
 
    return {
        isReady: isReady,
        foobar: foobar
    };
});
 
{% endhighlight %}

下面的例子是模块的输出结果是一个promise对象。

{% highlight javascript %}

define(['lib/Deferred'], function( Deferred ){
    var defer = new Deferred(); 
    require(['lib/templates/?index.html','lib/data/?stats'],
        function( template, data ){
            defer.resolve({ template: template, data:data });
        }
    );
    return defer.promise();
});

{% endhighlight %}

如果服务器端采用JSONP模式，则可以直接在require中调用，方法是指定回调函数为define。

{% highlight javascript %}

require( [ 
    "http://someapi.com/foo?callback=define"
], function (data) {
    console.log(data);
});

{% endhighlight %}

## AMD模式的优点

定义模块的方法更清晰，更少污染全局环境，能够清楚地显示依赖关系。

直接支持客户端的浏览器环境。

允许非同步加载模块，也可以根据需要动态加载模块。

## config方法：配置require.js

require方法本身也是一个对象，它带有一个config方法，用来配置require.js运行参数。

config方法接受一个对象参数。

{% highlight javascript %}

require.config({
    paths: {
        jquery: [
            '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js',
            'lib/jquery'
        ]
    }
});

{% endhighlight %}

这个对象参数的主要成员如下：

path：用来指定各个模块的位置。这个位置可以是相对位置，也可以是第三方网站上的位置。可以定义多个位置，如果第一个位置加载失败，则加载第二个位置，上面的示例就表示如果CDN加载失败，则加载服务器上的备用脚本。

{% highlight javascript %}

require.config({
  paths: {
      jquery: [
	  '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js',
	  'lib/jquery'
	  ]
  }
});

require(["mylibs/moduleX"], function(jquery, moduleX) {
    // ...
});

{% endhighlight %}

baseUrl：模块位置的基准目录，通常由require.js加载时的data-main属性指定。

shim：有些库不是AMD兼容的，这时就需要指定shim属性的值。shim可以理解成“垫片”，用来帮助require.js加载非AMD规范的库。

{% highlight javascript %}

require.config({
    paths: {
        "backbone": "vendor/backbone",
        "underscore": "vendor/underscore"
    },
    shim: {
        "backbone": {
            deps: [ "underscore" ],
            exports: "Backbone"
        },
        "underscore": {
            exports: "_"
        }
    }
});

{% endhighlight %}

上面代码中的backbone和underscore就是非AMD规范的库。shim指定它们的依赖关系（backbone依赖于underscore），以及输出符号（backbone为“Backbone”，underscore为“_”）。

## 优化器

RequireJS提供一个基于node.js的命令行工具r.js，用来压缩多个js文件。

首先，在你的项目目录中安装r.js（假设已经安装了node.js）。

{% highlight bash %}

npm install requirejs

{% endhighlight %}

使用的时候，直接在命令行键入以下格式的命令。

{% highlight bash %}

node r.js -o <arguments>

{% endhighlight %}

<argument>表示命令运行时，所需要的一系列参数。

{% highlight bash %}

node r.js -o baseUrl=. name=main out=main-built.js

{% endhighlight %}

除了直接在命令行提供，也可以将参数写入一个文件，假定文件名为build.js。

{% highlight javascript %}

({
    baseUrl: ".",
    name: "main",
    out: "main-built.js"
})

{% endhighlight %}

然后，在命令行下，提供这个参数文件。

{% highlight bash %}

node r.js -o build.js

{% endhighlight %}

下面是一个参数文件的范例，假定位置就在根目录下，文件名为build.js。

{% highlight javascript %}

({
    appDir: './',
    baseUrl: './js',
    dir: './dist',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone/backbone',
        backboneLocalstorage: 'lib/backbone/backbone.localStorage',
        text: 'lib/require/text'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        backboneLocalstorage: {
            deps: ['backbone'],
            exports: 'Store'
        }
    }
})

{% endhighlight %}

参数文件的主要成员解释如下：

- appDir：项目目录，相对于参数文件的位置。
- baseUrl：js文件的位置。
- dir：输出目录。
- modules：一个包含对象的数组，每个对象就是一个要被优化的模块。
- fileExclusionRegExp：凡是匹配这个正则表达式的文件名，都不会被拷贝到输出目录。
- optimizeCss: 自动压缩CSS文件，可取的值包括“none”, “standard”, “standard.keepLines”, “standard.keepComments”, “standard.keepComments.keepLines”。
- removeCombined：如果为true，合并后的原文件将不保留在输出目录中。
- paths：各个模块的相对路径。
- shim：配置依赖性和参数。如果某一个模块不是用defined()方法定义的，就可以用它定义模块的依赖性和输出值。

更详细的解释可以参考[官方文档](https://github.com/jrburke/r.js/blob/master/build/example.build.js)。

运行优化命令后，可以前往dist目录查看优化后的文件。

## 参考链接

- NaorYe, [Optimize (Concatenate and Minify) RequireJS Projects](http://www.webdeveasy.com/optimize-requirejs-projects/)
- Jonathan Creamer, [Deep dive into Require.js](http://tech.pro/tutorial/1300/deep-dive-into-requirejs)
- Addy Osmani, [Writing Modular JavaScript With AMD, CommonJS & ES Harmony](http://addyosmani.com/writing-modular-js/) 
