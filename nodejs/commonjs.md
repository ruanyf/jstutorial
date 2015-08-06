---
title: CommonJS规范
layout: page
category: nodejs
date: 2013-06-04
modifiedOn: 2013-08-13
---

## 概述

CommonJS是服务器模块的规范，Node.js采用了这个规范。

根据CommonJS规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在一个文件定义的变量（还包括函数和类），都是私有的，对其他文件是不可见的。

```javascript
var x = 5;
var addX = function(value) {
  return value + x;
};
```

上面代码中，变量x和函数addX，是当前文件私有的，其他文件不可见。

如果想在多个文件分享变量，必须定义为global对象的属性。

```javascript
global.warning = true;
```

上面代码的waining变量，可以被所有文件读取。当然，这样写法是不推荐的。

CommonJS规定，每个文件的对外接口是module.exports对象。这个对象的所有属性和方法，都可以被其他文件导入。

```javascript
var x = 5;
var addX = function(value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;
```

上面代码通过module.exports对象，定义对外接口，输出变量x和函数addX。module.exports对象是可以被其他文件导入的，它其实就是文件内部与外部通信的桥梁。

require方法用于在其他文件加载这个接口，具体用法参见《Require命令》的部分。

{% highlight javascript %}
var example = require('./example.js');

console.log(example.x); // 5
console.log(addX(1)); // 6
{% endhighlight %}

## module对象

每个模块都有一个module变量，该变量指向当前模块。module不是全局变量，而是每个模块都有的本地变量。

- module.id 模块的识别符，通常是带有绝对路径的模块文件名。
- module.filename 模块的文件名。
- module.loaded 返回一个布尔值，表示模块是否已经完成加载。
- module.parent 返回一个对象，表示调用该模块的模块。
- module.children 返回一个数组，表示该模块要用到的其他模块。

下面是一个示例文件，最后一行输出module变量。

```javascript
// example.js
var jquery = require('jquery');
exports.$ = jquery;
console.log(module);
```

执行这个文件，命令行会输出如下信息。

```javascript
{ id: '.',
  exports: { '$': [Function] },
  parent: null,
  filename: '/path/to/example.js',
  loaded: false,
  children:
   [ { id: '/path/to/node_modules/jquery/dist/jquery.js',
       exports: [Function],
       parent: [Circular],
       filename: '/path/to/node_modules/jquery/dist/jquery.js',
       loaded: true,
       children: [],
       paths: [Object] } ],
  paths:
   [ '/home/user/deleted/node_modules',
     '/home/user/node_modules',
     '/home/node_modules',
     '/node_modules' ]
}
```

### module.exports属性

module.exports属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。

```javascript
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

setTimeout(function() {
  module.exports.emit('ready');
}, 1000);
```

上面模块会在加载后1秒后，发出ready事件。其他文件监听该事件，可以写成下面这样。

```javascript
var a = require('./a');
a.on('ready', function() {
  console.log('module a is ready');
});
```

### exports变量

为了方便，Node为每个模块提供一个exports变量，指向module.exports。这等同在每个模块头部，有一行这样的命令。

{% highlight javascript %}

var exports = module.exports;

{% endhighlight %}

造成的结果是，在对外输出模块接口时，可以向exports对象添加方法。

{% highlight javascript %}

exports.area = function (r) {
  return Math.PI * r * r;
};

exports.circumference = function (r) {
  return 2 * Math.PI * r;
};

{% endhighlight %}

注意，不能直接将exports变量指向一个函数。因为这样等于切断了exports与module.exports的联系。

{% highlight javascript %}

exports = function (x){ console.log(x);};

{% endhighlight %}

上面这样的写法是无效的，因为它切断了exports与module.exports之间的链接。

下面的写法也是无效的。

```javascript
exports.hello = function() {
  return 'hello';
};

module.exports = 'Hello world';
```

上面代码中，hello函数是无法对外输出的，因为`module.exports`被重新赋值了。

如果一个模块的对外接口，就是一个函数或对象时，不能使用exports输出，只能使用module.exports输出。

{% highlight javascript %}

module.exports = function (x){ console.log(x);};

{% endhighlight %}

如果你觉得，exports与module.exports之间的区别很难分清，一个简单的处理方法，就是放弃使用exports，只使用module.exports。

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

## require命令

### 基本用法

Node.js使用CommonJS模块规范，内置的require命令用于加载模块文件。

require命令的基本功能是，读入并执行一个JavaScript文件，然后返回该模块的exports对象。如果没有发现指定模块，会报错。

```javascript
// example.js
var invisible = function () {
  console.log("invisible");
}

exports.message = "hi";

exports.say = function () {
  console.log(message);
}
```

运行下面的命令，可以输出exports对象。

```javascript
var example = require('./example.js');
example
// {
//   message: "hi",
//   say: [Function]
// }
```

如果模块输出的是一个函数，那就不能定义在exports对象上面，而要定义在`module.exports`变量上面。

```javascript
module.exports = function () {
  console.log("hello world")
}

require('./example2.js')()
```

上面代码中，require命令调用自身，等于是执行`module.exports`，因此会输出 hello world。

### 加载规则

require命令接受模块名作为参数。

（1）如果参数字符串以“/”开头，则表示加载的是一个位于绝对路径的模块文件。比如，`require('/home/marco/foo.js')`将加载/home/marco/foo.js。

（2）如果参数字符串以“./”开头，则表示加载的是一个位于相对路径（跟当前执行脚本的位置相比）的模块文件。比如，`require('./circle')`将加载当前脚本同一目录的circle.js。

（3）如果参数字符串不以“./“或”/“开头，则表示加载的是一个默认提供的核心模块（位于Node的系统安装目录中），或者一个位于各级node_modules目录的已安装模块（全局安装或局部安装）。

举例来说，脚本`/home/user/projects/foo.js`执行了`require('bar.js')`命令，Node会依次搜索以下文件。

- /home/user/projects/node_modules/bar.js
- /home/user/node_modules/bar.js
- /home/node_modules/bar.js
- /node_modules/bar.js

这样设计的目的是，使得不同的模块可以将所依赖的模块本地化。

（4）如果传入require方法的是一个目录，那么require会先查看该目录的package.json文件，然后加载main字段指定的脚本文件。否则取不到main字段，则会加载`index.js`文件或`index.node`文件。

举例来说，下面是一行普通的require命令语句。

```javascript
var utils = require( "utils" );
```

Node寻找utils脚本的顺序是，首先寻找核心模块，然后是全局安装模块，接着是项目安装的模块。

```bash
[
  '/usr/local/lib/node',
  '~/.node_modules',
  './node_modules/utils.js',
  './node_modules/utils/package.json',
  './node_modules/utils/index.js'
]
```

（5）如果指定的模块文件没有发现，Node会尝试为文件名添加.js、.json、.node后，再去搜索。.js文件会以文本格式的JavaScript脚本文件解析，.json文件会以JSON格式的文本文件解析，.node文件会议编译后二进制文件解析。

（6）如果想得到require命令加载的确切文件名，使用require.resolve()方法。

### 模块的缓存

第一次加载某个模块时，Node会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的exports属性。

```javascript
require('./example.js');
require('./example.js').message = "hello";
require('./example.js').message
// "hello"
```

上面代码中，连续三次使用require命令，加载同一个模块。第二次加载的时候，为输出的对象添加了一个message属性。但是第三次加载的时候，这个message属性依然存在，这就证明require命令并没有重新加载模块文件，而是输出了缓存。

如果想要多次执行某个模块，可以输出一个函数，然后多次调用这个函数。

缓存是根据绝对路径识别模块的，如果同样的模块名，但是保存在不同的路径，require命令还是会重新加载该模块。

### 模块的循环加载

如果发生模块的循环加载，即A加载B，B又加载A，则B将加载A的不完整版本。

```javascript
// a.js
exports.x = 'a1';
console.log('a.js: set a1');
console.log('a.js:', require('./b.js').x);
exports.x = 'a2';
console.log('a.js: set a2');

// b.js
exports.x = 'b1';
console.log('b.js: set b1');
console.log('b.js:', require('./a.js').x);
exports.x = 'b2';
console.log('b.js: set b2');

// main.js
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
```

上面代码是三个JavaScript文件。其中，a.js加载了b.js，而b.js又加载a.js。这时，Node返回a.js的不完整版本，所以执行结果如下。

```bash
$ node main.js
a.js: set a1
b.js: set b1
b.js: a1
b.js: set b2
a.js: b2
a.js: set a2
main.js  a2
main.js  b2
```

修改main.js，再次加载a.js和b.js。

```javascript
// main.js
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
```

执行上面代码，结果如下。

```bash
$ node main.js
b.js  a1
a.js  b2
main.js  a2
main.js  b2
main.js  a2
main.js  b2
```

上面代码中，第二次加载a.js和b.js时，会直接从缓存读取exports属性，所以a.js和b.js内部的console.log语句都不会执行了。

### require.main

正常的脚本调用时，require.main属性指向模块本身。

```javascript
require.main === module
// true
```

如果是在REPL环境使用require命令，则上面的表达式返回false。

通过require.main属性，可以获取模块的信息。比如，module对象有一个filename属性（正常情况下等于 __filename），可以通过require.main.filename属性，得知当前模块的入口文件。

## 参考链接

- Addy Osmani, [Writing Modular JavaScript With AMD, CommonJS & ES Harmony](http://addyosmani.com/writing-modular-js/)
- Pony Foo, [A Gentle Browserify Walkthrough](http://blog.ponyfoo.com/2014/08/25/a-gentle-browserify-walkthrough)
- Nico Reed, [What is require?]（https://docs.nodejitsu.com/articles/getting-started/what-is-require）
