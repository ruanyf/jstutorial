---
title: RequireJS和AMD规范
layout: page
category: tool
date: 2013-05-05
modifiedOn: 2013-11-30
---

## 概述

RequireJS是一个工具库，主要用于客户端的模块管理。它可以让客户端的代码分成一个个模块，实现异步或动态加载，从而提高代码的性能和可维护性。它的模块管理遵守[AMD规范](https://github.com/amdjs/amdjs-api/wiki/AMD)（Asynchronous Module Definition）。

RequireJS的基本思想是，通过define方法，将代码定义为模块；通过require方法，实现代码的模块加载。

首先，将require.js嵌入网页，然后就能在网页中进行模块化编程了。

{% highlight javascript %}

 <script data-main="scripts/main" src="scripts/require.js"></script>

{% endhighlight %}

上面代码的data-main属性不可省略，用于指定主代码所在的脚本文件，在上例中为scripts子目录下的main.js文件。用户自定义的代码就放在这个main.js文件中。

### define方法：定义模块

define方法用于定义模块，RequireJS要求每个模块放在一个单独的文件里。

按照是否依赖其他模块，可以分成两种情况讨论。第一种情况是定义独立模块，即所定义的模块不依赖其他模块；第二种情况是定义非独立模块，即所定义的模块依赖于其他模块。

**（1）独立模块**

如果被定义的模块是一个独立模块，不需要依赖任何其他模块，可以直接用define方法生成。

{% highlight javascript %}

define({
    method1: function() {},
    method2: function() {},
});

{% endhighlight %}

上面代码生成了一个拥有method1、method2两个方法的模块。

另一种等价的写法是，把对象写成一个函数，该函数的返回值就是输出的模块。

{% highlight javascript %}

define(function () {
	return {
	    method1: function() {},
		method2: function() {},
    };
});
 
{% endhighlight %}

后一种写法的自由度更高一点，可以在函数体内写一些模块初始化代码。

值得指出的是，define定义的模块可以返回任何值，不限于对象。

**（2）非独立模块**

如果被定义的模块需要依赖其他模块，则define方法必须采用下面的格式。

{% highlight javascript %}

define(['module1', 'module2'], function(m1, m2) {
   ...
});

{% endhighlight %}

define方法的第一个参数是一个数组，它的成员是当前模块所依赖的模块。比如，['module1', 'module2']表示我们定义的这个新模块依赖于module1模块和module2模块，只有先加载这两个模块，新模块才能正常运行。一般情况下，module1模块和module2模块指的是，当前目录下的module1.js文件和module2.js文件，等同于写成['./module1', './module2']。

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

上面代码表示新模块返回一个对象，该对象的method方法就是外部调用的接口，menthod方法内部调用了m1模块的methodA方法和m2模块的methodB方法。

需要注意的是，回调函数必须返回一个对象，这个对象就是你定义的模块。

如果依赖的模块很多，参数与模块一一对应的写法非常麻烦。

{% highlight javascript %}

define(
    [       'dep1', 'dep2', 'dep3', 'dep4', 'dep5', 'dep6', 'dep7', 'dep8'],
    function(dep1,   dep2,   dep3,   dep4,   dep5,   dep6,   dep7,   dep8){
        ...
    }
);

{% endhighlight %}

为了避免像上面代码那样繁琐的写法，RequireJS提供一种更简单的写法。

{% highlight javascript %}

define(
    function (require) {
        var dep1 = require('dep1'),
            dep2 = require('dep2'),
            dep3 = require('dep3'),
            dep4 = require('dep4'),
            dep5 = require('dep5'),
            dep6 = require('dep6'),
            dep7 = require('dep7'),
            dep8 = require('dep8');

            ...
    }

});

{% endhighlight %}

下面是一个define实际运用的例子。

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

上面代码定义的模块依赖math和graph两个库，然后返回一个具有plot接口的对象。

另一个实际的例子是，通过判断浏览器是否为IE，而选择加载zepto或jQuery。

{% highlight javascript %}

define(('__proto__' in {} ? ['zepto'] : ['jquery']), function($) {
    return $;
});
 
{% endhighlight %}

上面代码定义了一个中间模块，该模块先判断浏览器是否支持__proto__属性（除了IE，其他浏览器都支持），如果返回true，就加载zepto库，否则加载jQuery库。

### require方法：调用模块

require方法用于调用模块。它的参数与define方法类似。

{% highlight javascript %}

require(['foo', 'bar'], function ( foo, bar ) {
        foo.doSomething();
});

{% endhighlight %}

上面方法表示加载foo和bar两个模块，当这两个模块都加载成功后，执行一个回调函数。该回调函数就用来完成具体的任务。

require方法的第一个参数，是一个表示依赖关系的数组。这个数组可以写得很灵活，请看下面的例子。

{% highlight javascript %}

require( [ window.JSON ? undefined : 'util/json2' ], function ( JSON ) {
  JSON = JSON || window.JSON;

  console.log( JSON.parse( '{ "JSON" : "HERE" }' ) );
});

{% endhighlight %}

上面代码加载JSON模块时，首先判断浏览器是否原生支持JSON对象。如果是的，则将undefined传入回调函数，否则加载util目录下的json2模块。

require方法也可以用在define方法内部。

{% highlight javascript %}

define(function (require) {
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

上面代码所定义的模块，内部加载了foo和bar两个模块，在没有加载完成前，isReady属性值为false，加载完成后就变成了true。因此，可以根据isReady属性的值，决定下一步的动作。

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

上面代码的define方法返回一个promise对象，可以在该对象的then方法，指定下一步的动作。

如果服务器端采用JSONP模式，则可以直接在require中调用，方法是指定JSONP的callback参数为define。

{% highlight javascript %}

require( [ 
    "http://someapi.com/foo?callback=define"
], function (data) {
    console.log(data);
});

{% endhighlight %}

require方法允许添加第三个参数，即错误处理的回调函数。

{% highlight javascript %}

require(
    [ "backbone" ], 
    function ( Backbone ) {
        return Backbone.View.extend({ /* ... */ });
    }, 
    function (err) {
		// ...
    }
);

{% endhighlight %}

require方法的第三个参数，即处理错误的回调函数，接受一个error对象作为参数。

require对象还允许指定一个全局性的Error事件的监听函数。所有没有被上面的方法捕获的错误，都会被触发这个监听函数。

{% highlight javascript %}

requirejs.onError = function (err) {
    // ...
};

{% endhighlight %}

### AMD模式小结

define和require这两个定义模块、调用模块的方法，合称为AMD模式。它的模块定义的方法非常清晰，不会污染全局环境，能够清楚地显示依赖关系。

AMD模式可以用于浏览器环境，并且允许非同步加载模块，也可以根据需要动态加载模块。

## 配置require.js：config方法

require方法本身也是一个对象，它带有一个config方法，用来配置require.js运行参数。config方法接受一个对象作为参数。

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

config方法的参数对象有以下主要成员：

**（1）paths**

paths参数指定各个模块的位置。这个位置可以是同一个服务器上的相对位置，也可以是外部网址。可以为每个模块定义多个位置，如果第一个位置加载失败，则加载第二个位置，上面的示例就表示如果CDN加载失败，则加载服务器上的备用脚本。需要注意的是，指定本地文件路径时，可以省略文件最后的js后缀名。

{% highlight javascript %}

require(["jquery"], function($) {
    // ...
});

{% endhighlight %}

上面代码加载jquery模块，因为jquery的路径已经在paths参数中定义了，所以就会到事先设定的位置下载。

**（2）baseUrl**

baseUrl参数指定本地模块位置的基准目录，即本地模块的路径是相对于哪个目录的。该属性通常由require.js加载时的data-main属性指定。

**（3）shim**

有些库不是AMD兼容的，这时就需要指定shim属性的值。shim可以理解成“垫片”，用来帮助require.js加载非AMD规范的库。

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

## 插件

RequireJS允许使用插件，加载各种格式的数据。完整的插件清单可以查看[官方网站](https://github.com/jrburke/requirejs/wiki/Plugins)。

下面是插入文本数据所使用的text插件的例子。

{% highlight javascript %}

define([
    'backbone',
    'text!templates.html'
], function( Backbone, template ){
   // ...
});

{% endhighlight %}

上面代码加载的第一个模块是backbone，第二个模块则是一个文本，用'text!'表示。该文本作为字符串，存放在回调函数的template变量中。

## 优化器r.js

RequireJS提供一个基于node.js的命令行工具r.js，用来压缩多个js文件。它的主要作用是将多个模块文件压缩合并成一个脚本文件，以减少网页的HTTP请求数。

第一步是安装r.js（假设已经安装了node.js）。

{% highlight bash %}

npm install -g requirejs

{% endhighlight %}

然后，使用的时候，直接在命令行键入以下格式的命令。

{% highlight bash %}

node r.js -o <arguments>

{% endhighlight %}

&lt;argument&gt;表示命令运行时，所需要的一系列参数，比如像下面这样：

{% highlight bash %}

node r.js -o baseUrl=. name=main out=main-built.js

{% endhighlight %}

除了直接在命令行提供参数设置，也可以将参数写入一个文件，假定文件名为build.js。

{% highlight javascript %}

({
    baseUrl: ".",
    name: "main",
    out: "main-built.js"
})

{% endhighlight %}

然后，在命令行下用r.js运行这个参数文件，就OK了，不需要其他步骤了。

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

上面代码将多个模块压缩合并成一个main.js。

参数文件的主要成员解释如下：

- **appDir**：项目目录，相对于参数文件的位置。

- **baseUrl**：js文件的位置。

- **dir**：输出目录。

- **modules**：一个包含对象的数组，每个对象就是一个要被优化的模块。

- **fileExclusionRegExp**：凡是匹配这个正则表达式的文件名，都不会被拷贝到输出目录。

- **optimizeCss**: 自动压缩CSS文件，可取的值包括“none”, “standard”, “standard.keepLines”, “standard.keepComments”, “standard.keepComments.keepLines”。

- **removeCombined**：如果为true，合并后的原文件将不保留在输出目录中。

- **paths**：各个模块的相对路径，可以省略js后缀名。

- **shim**：配置依赖性关系。如果某一个模块不是AMD模式定义的，就可以用shim属性指定模块的依赖性关系和输出值。

- **generateSourceMaps**：是否要生成source map文件。

更详细的解释可以参考[官方文档](https://github.com/jrburke/r.js/blob/master/build/example.build.js)。

运行优化命令后，可以前往dist目录查看优化后的文件。

下面是另一个build.js的例子。

{% highlight javascript %}

({
    mainConfigFile : "js/main.js",
    baseUrl: "js",
    removeCombined: true,
    findNestedDependencies: true,
    dir: "dist",
    modules: [
        {
            name: "main",
            exclude: [
                "infrastructure"
            ]
        },
        {
            name: "infrastructure"
        }
    ]
})

{% endhighlight %}

上面代码将模块文件压缩合并成两个文件，第一个是main.js（指定排除infrastructure.js），第二个则是infrastructure.js。

## 参考链接

- NaorYe, [Optimize (Concatenate and Minify) RequireJS Projects](http://www.webdeveasy.com/optimize-requirejs-projects/)
- Jonathan Creamer, [Deep dive into Require.js](http://tech.pro/tutorial/1300/deep-dive-into-requirejs)
- Addy Osmani, [Writing Modular JavaScript With AMD, CommonJS & ES Harmony](http://addyosmani.com/writing-modular-js/) 
- Jim Cowart, [Five Helpful Tips When Using RequireJS](http://tech.pro/blog/1561/five-helpful-tips-when-using-requirejs) 
- Jim Cowart, [Using r.js to Optimize Your RequireJS Project](http://tech.pro/blog/1639/using-rjs-to-optimize-your-requirejs-project)
