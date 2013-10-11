---
title: Node.js 概述
layout: page
category: nodejs
date: 2013-01-14
modifiedOn: 2013-09-30
---

## 简介

### 什么是Node.js

Node.js是JavaScript在服务器端的一个运行环境，也是一个工具库，用来与服务器端其他软件互动。

访问官方网站[nodejs.org](http://nodejs.org)了解安装细节。安装完成以后，运行下面的命令，查看是否能正常运行。

{% highlight bash %}

node --version

{% endhighlight %}

要运行node.js程序，就是使用node命令读取Javascript脚本。

{% highlight bash %}

node file.js

{% endhighlight %}

### REPL环境

在命令行键入node命令，后面没有文件名，就进入一个Node.js的REPL环境（Read–eval–print loop，"读取-求值-输出"循环），可以直接运行各种JavaScript命令。

{% highlight bash %}

node
> 1+1
2

{% endhighlight %}

这个REPL是Node.js与用户互动的shell，各种基本的shell功能都可以在里面使用，比如使用上下方向键遍历曾经使用过的命令。特殊变量下划线（_）表示上一个命令的返回结果。

{% highlight bash %}

> 1+1
2
> _+1
3

{% endhighlight %}

在REPL中，如果运行一个表达式，会直接在命令行返回结果，如果运行一条语句则不会，因为它没有返回值。

{% highlight bash %}

> x = 1
1
> var x = 1

{% endhighlight %}

上面代码的第二条命令，没有显示任何结果。因为这是一条语句，不是表达式，所以没有返回值。

### 异步操作

Node采用V8引擎处理JavaScript脚本，最大特点就是单线程运行，一次只能运行一个任务。这导致Node大量采用异步操作（asynchronous opertion），即任务不是马上执行，而是插在任务队列的尾部，等到前面的任务运行完后再执行。

由于这种特性，某一个任务的后续操作，往往采用回调函数（callback）的形式进行定义。

{% highlight javascript %}

var isTrue = function(value, callback) {
  if (value === true) {
    callback(null, "Value was true.");
  }
  else {
    callback(new Error("Value is not true!"));
  }
}

{% endhighlight %}

上面代码就把进一步的处理，交给回调函数callback。约定俗成，callback的位置总是最后一个参数。值得注意的是，callback的格式也有约定。

{% highlight javascript %}

var callback = function (error, value) {
  if (error) {
    return console.log(error); 
  }
  console.log(value);
}

{% endhighlight %}

callback的第一个参数是一个Error对象，第二个参数才是真正的数据。如果没有发生错误，第一个参数就传入null。这种写法有一个很大的好处，就是说只要判断回调函数的第一个参数，就知道有没有出错，如果不是null，就肯定出错了。

### 全局对象

Node提供以下一些全局对象，它们是所有模块都可以调用的。

- **global**：表示Node所在的全局环境，类似于浏览器中的window对象。

- **process**：指向Node内置的process模块，允许开发者与当前进程互动。

- **console**：指向Node内置的console模块，提供命令行环境中的标准输入、标准输出功能。

- **定时器函数**：共有4个，分别是setTimeout(), clearTimeout(), setInterval(), clearInterval()。

- **require**：用于加载模块。

- **_filename**：指向当前运行的脚本文件名。

- **_dirname**：指向当前运行的脚本所在的目录。

除此之外，还有一些对象实际上是模块内部的局部变量，指向的对象根据模块不同而不同，但是所有模块都适用，可以看作是伪全局变量，主要为module, module.exports, exports等。

### 模块化结构

Node.js采用模块化结构，按照[CommonJS规范](http://wiki.commonjs.org/wiki/CommonJS)定义和使用模块。

require命令用于指定加载模块。

{% highlight javascript %}

var someModule = require('moduleName');

{% endhighlight %}

require接受的参数除了模块的名称，还包括模块的路径。

{% highlight javascript %}

var someModule = require('/path/to/moduleName');

{% endhighlight %}

加载模块以后，就可以调用模块中定义的方法了。

{% highlight javascript %}

someModule.someFunction();

{% endhighlight %}

### 核心模块

Node.js自带一系列的核心模块，下面就是其中的一部分：

- **http**：提供HTTP服务器功能。
- **url**：解析URL。
- **fs**：与文件系统交互。
- **querystring**：解析URL的查询字符串。
- **child_process**：新建子进程。
- **util**：提供一系列实用小工具。
- **path**：处理文件路径。
- **crypto**：提供加密和解密功能，基本上是对OpenSSL的包装。

除了使用核心模块，还可以使用第三方模块，以及自定义模块。

### 自定义模块

Node.js模块采用CommonJS规范。只要符合这个规范，就可以自定义模块。

下面是一个简单的例子。新建一个文件mymodule.js，写入下面的代码。

{% highlight javascript %}

// mymodule.js

function p(string) {
  console.log(string);
}

exports.print = p;

{% endhighlight %}

上面的代码定义了一个p方法，然后将模块的对外接口print指向该方法。

在其他文件中使用该模块的时候，要先用require命令加载模块文件，然后调用它的接口。

{% highlight javascript %}

// index.js

var m = require('./mymodule');

m.print("这是自定义模块");

{% endhighlight %}
 
现在，就可以在命令行下运行index.js。

{% highlight bash %}

node index.js
# 这是自定义模块

{% endhighlight %}

## fs模块

fs是filesystem的缩写，该模块提供本地文件的读写能力。

{% highlight javascript %}

var fs = require('fs');

fs.readFile('example_log.txt', function (err, logData) {

  if (err) throw err;

  var text = logData.toString();

});

{% endhighlight %}

上面代码使用readFile方法读取文件。readFile方法的第一个参数是文件名，第二个参数是回调函数。这两个参数中间，还可以插入一个可选参数，表示文件的编码。

{% highlight javascript %}

fs.readFile('example_log.txt', 'utf8', function (err, logData) {
	// ...
});

{% endhighlight %}

可用的文件编码包括“ascii”、“utf8”和“base64”。如果这个参数没有提供，默认是utf8。

如果想要同步读取文件，可以使用readFileSync方法。

{% highlight javascript %}

var data = fs.readFileSync('./file.json');

{% endhighlight %}

写入文件要使用writeFile方法。

{% highlight javascript %}

fs.writeFile('./file.txt', data, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('Saved successfully.');
  });

{% endhighlight %}

readdir方法用于读取目录，返回一个所包含的文件和子目录的数组。

{% highlight javascript %}

fs.readdir(process.cwd(), function (err, files) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(files);
});

{% endhighlight %}

### Stream模式

Stream是数据处理的一种形式，可以用来取代回调函数。举例来说，传统形式的文件处理，必须先将文件全部读入内容，然后调用回调函数，如果遇到大文件，整个过程将非常耗时。Stream则是将文件分成小块读入内存，每读入一次，都会触发相应的事件。只要监听这些事件，就能掌握进展，做出相应处理，这样就提高了性能。Node内部的很多IO处理都采用Stream，比如HTTP连接、文件读写、标准输入输出。

Stream既可以读取数据，也可以写入数据。读写数据时，每读入（或写入）一段数据，就会触发一次data事件，全部读取（或写入）完毕，触发end事件。如果发生错误，则触发error事件。

fs模块的createReadStream方法用于新建读取数据流，createWriteStream方法用于新建写入数据流。使用这两个方法，可以做出一个用于文件复制的脚本copy.js。

{% highlight javascript %}

// copy.js

var fs = require('fs');
console.log(process.argv[2], '->', process.argv[3]);

var readStream = fs.createReadStream(process.argv[2]);
var writeStream = fs.createWriteStream(process.argv[3]);

readStream.on('data', function (chunk) {
  writeStream.write(chunk);
});

readStream.on('end', function () {
  writeStream.end();
});

readStream.on('error', function (err) {
  console.log("ERROR", err);
});

writeStream.on('error', function (err) {
  console.log("ERROR", err);
});

{% endhighlight %}

上面代码非常容易理解，使用的时候直接提供源文件路径和目标文件路径，就可以了。

{% highlight bash %}

node cp.js src.txt dest.txt

{% endhighlight %}

Streams对象都具有pipe方法，起到管道作用，将一个数据流输入另一个数据流。所以，上面代码可以重写成下面这样：

{% highlight javascript %}

var fs = require('fs');
console.log(process.argv[2], '->', process.argv[3]);

var readStream = fs.createReadStream(process.argv[2]);
var writeStream = fs.createWriteStream(process.argv[3]);

readStream.on('open', function () {
  readStream.pipe(writeStream);
});

readStream.on('end', function () {
  writeStream.end();
});

{% endhighlight %}

## http模块

### 实例：搭建一个HTTP服务器

使用Node.js搭建HTTP服务器非常简单。

{% highlight javascript %}

var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080);

console.log('Server running on port 8080.');

{% endhighlight %}

第一行 var http = require("http")，表示加载http模块。然后，调用http模块的createServer方法，创造一个服务器实例，将它赋给变量app。

ceateServer方法接受一个函数作为参数，该函数的req参数是一个对象，表示客户端的HTTP请求；res参数也是一个对象，表示服务器端的HTTP回应。rese.writeHead方法表示，服务器端回应一个HTTP头信息；response.end方法表示，服务器端回应的具体内容，以及回应完成后关闭本次对话。最后的listen(8080)表示启动服务器实例，监听本机的1337端口。

将上面这几行代码保存成文件app.js，然后用node调用这个文件，服务器就开始运行了。

{% highlight bash %}

node app.js

{% endhighlight %}

这时命令行窗口将显示一行提示“Server running at port 8080.”。打开浏览器，访问http://localhost:8080，网页显示“Hello world!”。

将app.js稍加修改，就可以做出一个网站的雏形，请求不同的网址，会显示不同的内容。

{% highlight javascript %}

var http = require("http");

http.createServer(function(req, res) {

  // 主页
  if (req.url == "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Welcome to the homepage!");
  }

  // About页面
  else if (req.url == "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Welcome to the about page!");
  }

  // 404错误
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 error! File not found.");
  }

}).listen(8080, "localhost");

{% endhighlight %}

### 处理POST请求

当客户端采用POST方法发送数据时，服务器端可以对data和end两个事件，设立监听函数。

{% highlight javascript %}

var http = require('http');

http.createServer(function (req, res) {
  var content = "";

  req.on('data', function (chunk) {
    content += chunk;
  });

  req.on('end', function () {
    res.writeHead(200, {"Content-Type": "text/plain"});
	res.write("You've sent: " + content);
    res.end();
  });

}).listen(8080);

{% endhighlight %}

data事件会在数据接收过程中，每收到一段数据就触发一次，接收到的数据被传入回调函数。end事件则是在所有数据接收完成后触发。

### 发出请求：request方法

request方法用于发出HTTP请求。

{% highlight javascript %}

var http = require('http');

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {
  host: 'www.random.org',
  path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
};

callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log(str);
  });
}

var req = http.request(options, callback);

req.write("hello world!");
req.end();

{% endhighlight %}

request对象的第一个参数是options对象，用于指定请求的域名和路径，第二个参数是请求完成后的回调函数。

如果使用POST方法发出请求，只需在options对象中设定即可。

{% highlight javascript %}

var options = {
  host: 'www.example.com',
  path: '/',
  port: '80',
  method: 'POST'
};

{% endhighlight %}

指定HTTP头信息，也是在options对象中设定。

{% highlight javascript %}

var options = {
  headers: {'custom': 'Custom Header Demo works'}
};

{% endhighlight %}

### 搭建HTTPs服务器

搭建HTTPs服务器需要有SSL证书。对于向公众提供服务的网站，SSL证书需要向证书颁发机构购买；对于自用的网站，可以自制。

自制SSL证书需要OpenSSL，具体命令如下。

{% highlight bash %}

openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem

{% endhighlight %}

上面的命令生成两个文件：ert.pem（证书文件）和 key.pem（私钥文件）。有了这两个文件，就可以运行HTTPs服务器了。

{% highlight javascript %}

var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

var a = https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);

{% endhighlight %}

上面代码显示，HTTPs服务器与HTTP服务器的最大区别，就是createServer方法多了一个options参数。运行以后，就可以测试是否能够正常访问。

{% highlight bash %}

curl -k https://localhost:8000

{% endhighlight %}

## process模块

process模块用来与当前进程互动，可以通过全局变量process访问，不必使用require命令加载。

### 属性

process对象提供一系列属性，用于返回系统信息。

- **process.pid**：当前进程的进程号。
- **process.version**：Node的版本，比如v0.10.18。
- **process.platform**：当前系统平台，比如Linux。
- **process.title**：默认值为“node”，可以自定义该值。
- **process.argv**：当前进程的命令行参数数组。
- **process.env**：指向当前shell的环境变量，比如process.env.HOME。
- **process.execPath**：运行当前进程的可执行文件的绝对路径。
- **process.stdout**：指向标准输出。
- **process.stdin**：指向标准输入。
- **process.stderr**：指向标准错误。

下面是主要属性的介绍。

**(1)stdout**

process.stdout用来控制标准输出，也就是在命令行窗口向用户显示内容。它的write方法等同于console.log。

{% highlight javascript %}

exports.log = function() {
    process.stdout.write(format.apply(this, arguments) + '\n');
};

{% endhighlight %}

**（2）argv**

process.argv返回命令行脚本的各个参数组成的数组。

先新建一个脚本文件argv.js。

{% highlight javascript %}

// argv.js

console.log("argv: ",process.argv);
console.log("argc: ",process.argc);

{% endhighlight %}

在命令行下调用这个脚本，会得到以下结果。

{% highlight javascript %}

node argv.js a b c
# [ 'node', '/path/to/argv.js', 'a', 'b', 'c' ]

{% endhighlight %}

上面代码表示，argv返回数组的成员依次是命令行的各个部分。要得到真正的参数部分，可以把argv.js改写成下面这样。

{% highlight javascript %}

// argv.js

var myArgs = process.argv.slice(2);
console.log(myArgs);

{% endhighlight %}

### 方法

process对象提供以下方法：

- **process.exit()**：退出当前进程。
- **process.cwd()**：返回运行当前脚本的工作目录的路径。_
- **process.chdir()**：改变工作目录。
- **process.nextTick()**：将一个回调函数放在下次事件循环的顶部。

process.chdir()改变工作目录的例子。

{% highlight bash %}

process.cwd()
# '/home/aaa'

process.chdir('/home/bbb')

process.cwd()
# '/home/bbb'

{% endhighlight %}

process.nextTick()的例子，指定下次事件循环首先运行的任务。

{% highlight bash %}

process.nextTick(function () {
    console.log('Next event loop!');
});

{% endhighlight %}

上面代码可以用setTimeout改写，但是nextTick的效果更高、描述更准确。

{% highlight bash %}

setTimeout(function () {
   console.log('Next event loop!');
}, 0)

{% endhighlight %}

### 事件

**（1）exit事件**

当前进程退出时，会触发exit事件，可以对该事件指定回调函数。

{% highlight javascript %}

process.on('exit', function () {
  fs.writeFileSync('/tmp/myfile', 'This MUST be saved on exit.');
 });

{% endhighlight %}

**（2）uncaughtException事件**

当前进程抛出一个没有被捕捉的意外时，会触发uncaughtException事件。

{% highlight javascript %}

 process.on('uncaughtException', function (err) {
   console.error('An uncaught error occurred!');
   console.error(err.stack);
 });

{% endhighlight %}

## child_process模块

child_process模块用于新建子进程。子进程的运行结果储存在系统缓存之中（最大200KB），等到子进程运行结束以后，主进程再用回调函数读取子进程的运行结果。

{% highlight javascript %}

var childProcess = require('child_process')；

var ls = childProcess.exec('ls -l', function (error, stdout, stderr) {
   if (error) {
     console.log(error.stack);
     console.log('Error code: '+error.code);
   }
   console.log('Child Process STDOUT: '+stdout);
});

ls.on('exit', function (code) {
   console.log('Child process exited with exit code '+code);
});

{% endhighlight %}

上面代码的exec方法会新建一个子进程，然后缓存它的运行结果，运行结束后调用回调函数。由于上面运行的是ls命令，它会自然结束，所以不会触发exit事件，因此上面代码最后监听exit事件的部分，其实是多余的。

## 模块管理器npm

### npm简介

npm是Node.js默认的模块管理器，用来安装和管理node模块。在安装node的时候，会连带一起安装npm。node安装完成后，可以用下面的命令，查看一下npm的帮助文件。

{% highlight bash %}

# npm命令列表
npm help

# 各个命令的简单用法
npm -l

{% endhighlight %}

下面的命令分别查看npm的版本和配置。

{% highlight bash %}

npm -version

npm config list -l

{% endhighlight %}

npm的版本可以在Node更新的时候一起更新。如果你想单独更新npm，使用下面的命令。

{% highlight bash %}

npm update -global npm

{% endhighlight %}

上面的命令之所以最后一个参数是npm，是因为npm本身也是Node.js的一个模块。

### 查看模块信息

npm的info命令可以查看每个模块的具体信息。比如，查看underscore模块信息的命令是：

{% highlight bash %}

npm info underscore

{% endhighlight %}

上面命令返回一个JavaScript对象，包含了underscore模块的详细信息。

{% highlight javascript %}

{ name: 'underscore',
  description: 'JavaScript\'s functional programming helper library.',
  'dist-tags': { latest: '1.5.2', stable: '1.5.2' },
  repository: 
   { type: 'git',
     url: 'git://github.com/jashkenas/underscore.git' },
  homepage: 'http://underscorejs.org',
  main: 'underscore.js',
  version: '1.5.2',
  devDependencies: { phantomjs: '1.9.0-1' },
  licenses: 
   { type: 'MIT',
     url: 'https://raw.github.com/jashkenas/underscore/master/LICENSE' },
  files: 
   [ 'underscore.js',
     'underscore-min.js',
     'LICENSE' ],
  readmeFilename: 'README.md'}

{% endhighlight %}

上面这个JavaScript对象的每个成员，都可以直接从info命令查询。

{% highlight bash %}

npm info underscore description
# JavaScript's functional programming helper library.

npm info underscore homepage
# http://underscorejs.org

npm info underscore version
# 1.5.2

{% endhighlight %}

### 模块的安装

每个模块可以“全局安装”，也可以“本地安装”。两者的差异是模块的安装位置，以及调用方法。

“全局安装”指的是将一个模块直接下载到Node的安装目录中，各个项目都可以调用。“本地安装”指的是将一个模块下载到当前目录的node_modules子目录，然后只有在当前目录和它的子目录之中，才能调用这个模块。一般来说，全局安装只适用于工具模块，比如npm和grunt。

默认情况下，npm install 命令是“本地安装”某个模块。

{% highlight bash %}

npm install [package name]

{% endhighlight %}

使用上面的命令，模块文件将下载到当前目录的 node_modules 子目录。

使用global参数，可以“全局安装”某个模块。

{% highlight bash %}

sudo npm install -global [package name]

{% endhighlight %}

global参数可以被简化成g参数。

{% highlight bash %}

sudo npm install -g [package name]

{% endhighlight %}

install命令总是安装模块的最新版本，如果要安装模块的特定版本，可以在模块名后面加上@和版本号。

{% highlight bash %}

npm install package_name@version

{% endhighlight %}

一旦安装了某个模块，就可以在代码中用require命令调用这个模块。

{% highlight javascript %}

var backbone = require('backbone')

console.log(backbone.VERSION)

{% endhighlight %}

### 模块的升级和删除

npm update 命令可以升级本地安装的模块。

{% highlight bash %}

npm update [package name]

{% endhighlight %}

加上global参数，可以升级全局安装的模块。

{% highlight bash %}

npm update -global [package name]

{% endhighlight %}

npm uninstall 命令，删除本地安装的模块。

{% highlight bash %}

npm uninstall [package name]

{% endhighlight %}

加上global参数，可以删除全局安装的模块。

{% highlight bash %}

sudo npm uninstall [package name] -global

{% endhighlight %}

### 模块的查看和搜索

npm list命令，默认列出当前目录安装的所有模块。如果使用global参数，就是列出全局安装的模块。

{% highlight bash %}

npm list

npm -global list

{% endhighlight %}

向服务器端搜索某个模块，使用search命令（可使用正则搜索）。

{% highlight bash %}

npm search [搜索词]

{% endhighlight %}

如果不加搜索词，npm search 默认返回服务器端的所有模块。

## 配置文件package.json

每个项目的根目录下面，一般都有一个package.json文件，定义了这个项目所需要的各种模块，以及项目的配置（比如项目的名称、版本、许可证等元数据）。npm install 命令根据这个文件，自动下载所需的模块。所以，package.json 可以看作是npm命令的配置文件。

package.json文件的内容，就是一个json对象，该对象的每一个成员就是当前项目的一项设置。最简单的package.json只有两个成员：项目名称和项目版本。

{% highlight javascript %}

{
  "name" : "xxx",
  "version" : "0.0.0",
}

{% endhighlight %}

上面代码的name就是项目名称，version是项目版本，遵守“主要版本.次要版本.补丁号”的格式。

更详细的package.json文件如下。

{% highlight javascript %}

{
  "name":"name",
  "preferGlobal":false,
  "version":"0.0.0",
  "author":"your_name",
  "description":"",
  "bugs":{"url":"http://yoururl.com/","email":""},
  "contributors":[{"name":"xxx","email":"xxx@example.com"}],
  "bin":{"http-server":"./bin/http-server"},
  "scripts":{"start":"node ./bin/http-server"},
  "main":"./lib/http-server",
  "repository":{"type":"git","url":"https://github.com/xxx"},
  "keywords":["cli","http","server"],
  "dependencies":{"package":"0.1.x"},
  "analyze":false,
  "devDependencies":{"package":"0.5.x"},
  "bundledDependencies":["package"],
  "license":"MIT",
  "files":[],
  "man":{},
  "config":{},
  "engines":{"node":">=0.6"},
  "engineStrict":true,
  "os":"darwin",
  "cpu":"x64",
  "private":false,
  "publishConfig":{}
}

{% endhighlight %}

上面代码的主要成员有这样几个：

- **description**：项目描述。
- **keywords**：项目关键词。
- **author**：项目作者。
- **contributors**：项目贡献者。
- **homepage**：项目主页的URL。
- **repository**：项目代码库的网址。
- **main**：项目的加载点，指明当用户根据模块名加载模块时，所要调用的具体脚本名。
- **dependencies**：项目运行依赖的模块。
- **devDependencies**：项目开发依赖的模块，使用npm install --dev命令时一并安装。

package.json 文件可以手动编写，也可以使用 npm init 命令手动生成。

{% highlight bash %}

npm init

{% endhighlight %}

这个命令采用互动方式，要求用户回答一些问题，然后在当前目录生成一个基本的 package.json 文件。所有问题之中，只有项目名称（name）和项目版本（version）是必填的，其他都是选填的。下面是一个实例。

{% highlight bash %}

name: (getBackboneVersion) get-backbone-version
version: (0.0.0) 0.1.0
description: get backbone version used
entry point: (getBackboneVersion.js) getBackboneVersion.js
test command: n/a
git repository: n/a
keywords: backbone, version
author: cody lindley
license: (BSD) MIT

{% endhighlight %}

有了package.json文件，直接使用npm install命令，就会在当前目录中安装文件指定的包。

{% highlight bash %}

npm install

{% endhighlight %}

如果一个库不在 package.json 文件之中，可以在安装的时候加上--save-dev，这个库就会自动被加入 package.json 文件。

## 参考链接

- Cody Lindley, [Package Managers: An Introductory Guide For The Uninitiated Front-End Developer](http://tech.pro/tutorial/1190/package-managers-an-introductory-guide-for-the-uninitiated-front-end-developer)
- Stack Overflow, [What is Node.js?](http://stackoverflow.com/questions/1884724/what-is-node-js)
