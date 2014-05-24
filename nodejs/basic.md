---
title: Node.js 概述
layout: page
category: nodejs
date: 2013-01-14
modifiedOn: 2013-12-04
---

## 简介

Node.js是JavaScript在服务器端的一个运行环境，也是一个工具库，用来与服务器端其他软件互动。它的JavaScript解释器，采用了Google公司的V8引擎。

### 安装与更新

访问官方网站[nodejs.org](http://nodejs.org)了解安装细节。

安装完成以后，运行下面的命令，查看是否能正常运行。

{% highlight bash %}

node --version
// 或者
node -v

{% endhighlight %}

更新node.js版本，可以通过node.js的n模块完成。

{% highlight bash %}

sudo npm install n -g
sudo n stable

{% endhighlight %}

上面代码通过n模块，将node.js更新为最新发布的稳定版。

n模块也可以指定安装的版本。

{% highlight bash %}

sudo n 0.8.21

{% endhighlight %}

### 版本管理工具nvm

如果想在同一台机器，同时运行多个版本的node.js，就需要用到版本管理工具nvm。

首先，需要安装nvm。

{% highlight bash %}

git clone https://github.com/creationix/nvm.git ~/.nvm

{% endhighlight %}

然后使用下面的命令，激活nvm。

{% highlight bash %}

source ~/.nvm/nvm.sh

{% endhighlight %}

上面这条命令，每次使用nvm前都要输入，建议将其加入~/.bashrc文件（假定你所使用的shell是bash）。

激活nvm之后，就可以安装指定版本的node.js。

{% highlight bash %}

nvm install 0.10

{% endhighlight %}

上面这条命令，安装最新的v0.10.x版本的node.js。

安装后，就可以指定使用该版本。

{% highlight bash %}

nvm use 0.10

{% endhighlight %}

或者，直接进入该版本的REPL环境。

{% highlight bash %}

nvm run 0.10

{% endhighlight %}

如果在项目根目录下新建一个.nvmrc文件，将版本号写入其中，则nvm use命令就不再需要附加版本号。

{% highlight bash %}

nvm use

{% endhighlight %}

ls命令用于查看本地所安装的版本。

{% highlight bash %}

nvm ls

{% endhighlight %}

ls-remote命令用于查看服务器上所有可供安装的版本。

{% highlight bash %}

nvm ls-remote

{% endhighlight %}

如果要退出已经激活的nvm，使用deactivate命令。

{% highlight bash %}

nvm deactivate

{% endhighlight %}

### 基本用法

安装完成后，运行node.js程序，就是使用node命令读取JavaScript脚本。

假定当前目录有一个demo.js的脚本文件，运行时这样写。

{% highlight bash %}

node demo

// 或者

node demo.js

{% endhighlight %}

### REPL环境

在命令行键入node命令，后面没有文件名，就进入一个Node.js的REPL环境（Read–eval–print loop，"读取-求值-输出"循环），可以直接运行各种JavaScript命令。

{% highlight bash %}

node
> 1+1
2

{% endhighlight %}

如果使用参数 --use_strict，则REPL将在严格模式下运行。

{% highlight bash %}

node --use_strict

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

### 全局对象和全局变量

Node提供以下一些全局对象，它们是所有模块都可以调用的。

- **global**：表示Node所在的全局环境，类似于浏览器中的window对象。
- **process**：指向Node内置的process模块，允许开发者与当前进程互动。
- **console**：指向Node内置的console模块，提供命令行环境中的标准输入、标准输出功能。

全局函数：

- **定时器函数**：共有4个，分别是setTimeout(), clearTimeout(), setInterval(), clearInterval()。
- **require**：用于加载模块。

全局变量：

- **_filename**：指向当前运行的脚本文件名。
- **_dirname**：指向当前运行的脚本所在的目录。

除此之外，还有一些对象实际上是模块内部的局部变量，指向的对象根据模块不同而不同，但是所有模块都适用，可以看作是伪全局变量，主要为module, module.exports, exports等。

module变量指代当前模块。module.exports变量表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。

- module.id 模块的识别符，通常是模块的文件名。
- module.filename 模块的文件名。
- module.loaded 返回一个布尔值，表示模块是否已经完成加载。
- module.parent 返回使用该模块的模块。
- module.children 返回一个数组，表示该模块要用到的其他模块。

这里需要特别指出的是，exports变量实际上是一个指向module.exports对象的链接，等同在每个模块头部，有一行这样的命令。

{% highlight javascript %}

var exports = module.exports;

{% endhighlight %}

这造成的结果是，在对外输出模块接口时，可以向exports对象添加方法，但是不能直接将exports变量指向一个函数。 

{% highlight javascript %}

exports = function (x){ console.log(x);};

{% endhighlight %}

上面这样的写法是无效的，因为它切断了exports与module.exports之间的链接。但是，下面这样写是可以的。

{% highlight javascript %}

exports.area = function (r) {
  return Math.PI * r * r;
};

exports.circumference = function (r) {
  return 2 * Math.PI * r;
};

{% endhighlight %}

如果你觉得，exports与module.exports之间的区别很难分清，一个简单的处理方法，就是放弃使用exports，只使用module.exports。

## 模块化结构

### 概述

Node.js采用模块化结构，按照[CommonJS规范](http://wiki.commonjs.org/wiki/CommonJS)定义和使用模块。

模块与文件是一一对应关系，即加载一个模块，实际上就是加载对应的一个模块文件。

require方法用于指定加载模块。

{% highlight javascript %}

var circle = require('./circle.js');

{% endhighlight %}

上面代码表明，从当前目录下的circle.js文件，加载circle模块。因为require方法默认加载的就是js文件，因此可以把js后缀名省略。

{% highlight javascript %}

var circle = require('./circle');

{% endhighlight %}

下面是其他一些模块加载的例子。

{% highlight javascript %}

var http = require('http');
var express = require('express');
var routes = require('./app/routes');

{% endhighlight %}

上面代码分别用require方法加载了三个模块。如果require方法的参数只是一个模块名，不带有路径，则表示该模块为核心模块或全局模块。比如，上面代码中的http为node.js自带的核心模块，express为npm命令安装的全局模块。如果require方法的参数带有路径，则表示该模块为项目自带的本地模块，必须告诉require该模块的路径。路径可以是绝对路径（以斜杠/开头），也可以是相对路径（以非斜杠开头），表示模块文件相对于当前调用require方法的脚本文件的位置，比如上面代码的routes模块的位置，在当前脚本文件所在目录的app子目录下。

如果require方法的参数不带有路径，而且加载的也不是核心模块与原生模块，则node.js按照以下从上到下的顺序，去寻找模块文件。比如，假定有一个位于/home/aaa/projects/目录下的脚本文件，包含了一行下面这样的加载命令。

{% highlight javascript %}

var bar = require('bar.js');

{% endhighlight %}

node.js依次到下面的目录，去寻找bar.js。

- /home/aaa/projects/node_modules/bar.js
- /home/aaa/node_modules/bar.js
- /home/node_modules/bar.js
- /node_modules/bar.js

可以看到，如果没有指明模块文件所在位置，node.js会依次从当前目录向上，一级级在node_modules子目录下寻找模块文件。这样做的好处下，不同的项目可以依赖不同版本的某个模块，而不会发生版本冲突。

如果没有找到该模块，会抛出一个错误。

有时候，一个模块本身就是一个目录，目录中包含多个文件。这时候，需要在模块目录下的package.json文件中，用main属性指明模块的入口文件。下面就是一个例子，假定该模块的所有文件包含在some-library目录中。

{% highlight javascript %}

{ "name" : "some-library",
  "main" : "./lib/some-library.js" }

{% endhighlight %}

当使用require('./some-library')命令加载该模块时，实际上加载的是./some-library/lib/some-library.js文件。

如果模块目录中没有package.json文件，node.js会尝试在模块目录中寻找index.js或index.node文件进行加载。

加载模块以后，就可以调用模块中定义的方法了。

模块一旦被加载以后，就会被系统缓存。如果第二次还加载该模块，则会返回缓存中的版本，这意味着模块实际上只会执行一次。如果希望模块执行多次，则可以让模块返回一个函数，然后多次调用该函数。

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

这些模块可以不用安装就使用。

除了使用核心模块，还可以使用第三方模块，以及自定义模块。

### 自定义模块

Node.js模块采用CommonJS规范。只要符合这个规范，就可以自定义模块。

下面是一个最简单的模块，假定新建一个foo.js文件，写入以下内容。

{% highlight javascript %}

// foo.js

module.exports = function(x) {
    console.log(x);
};

{% endhighlight %}

上面代码就是一个模块，它通过module.exports变量，对外输出一个方法。

这个模块的使用方法如下。

{% highlight javascript %}

// index.js

var m = require('./foo');

m("这是自定义模块");

{% endhighlight %}

上面代码通过require命令加载模块文件foo.js（后缀名省略），将模块的对外接口输出到变量m，然后调用m。这时，在命令行下运行index.js，屏幕上就会输出“这是自定义模块”。

{% highlight bash %}

node index
# 这是自定义模块

{% endhighlight %}

module变量是整个模块文件的顶层变量，它的exports属性就是模块向外输出的接口。如果直接输出一个函数（就像上面的foo.js），那么调用模块就是调用一个函数。但是，模块也可以输出一个对象。下面对foo.js进行改写。

{% highlight javascript %}

// foo.js

var out = new Object();

function p(string) {
  console.log(string);
}

out.print = p;

module.exports = out;

{% endhighlight %}

上面的代码表示模块输出out对象，该对象有一个print属性，指向一个函数。下面是这个模块的使用方法。

{% highlight javascript %}

// index.js

var m = require('./foo');

m.print("这是自定义模块");

{% endhighlight %}

上面代码表示，由于具体的方法定义在模块的print属性上，所以必须显式调用print属性。

## fs模块

fs是filesystem的缩写，该模块提供本地文件的读写能力。

**（1）readfile方法**

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

**（2）readFileSync方法**

如果想要同步读取文件，可以使用readFileSync方法。

{% highlight javascript %}

var data = fs.readFileSync('./file.json');

{% endhighlight %}

**（3）writeFile方法**

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

**（4）readdir方法**

readdir方法用于读取目录，返回一个所包含的文件和子目录的数组。

{% highlight javascript %}

fs.readdir(process.cwd(), function (err, files) {
  if (err) {
    console.log(err);
    return;
  }

  var count = files.length;
  var results = {};
  files.forEach(function (filename) {
    fs.readFile(filename, function (data) {
      results[filename] = data;
      count--;
      if (count <= 0) {
        // 对所有文件进行处理
      }
    });
  });
});

{% endhighlight %}

**（5）fs.exists(path, callback)**

exists方法用来判断给定路径是否存在，然后不管结果如何，都会调用回调函数。

{% highlight javascript %}

fs.exists('/path/to/file', function (exists) {
  util.debug(exists ? "it's there" : "no file!");
});

{% endhighlight %}

上面代码表明，回调函数的参数是一个表示文件是否存在的布尔值。

需要注意的是，不要在open方法之前调用exists方法，open方法本身就能检查文件是否存在。

下面的例子是如果给定目录存在，就删除它。

{% highlight javascript %}

if(fs.exists(outputFolder)) {
  console.log("Removing "+outputFolder);
  fs.rmdir(outputFolder);
}

{% endhighlight %}

### Stream模式

Stream是数据处理的一种形式，可以用来取代回调函数。举例来说，传统形式的文件处理，必须先将文件全部读入内存，然后调用回调函数，如果遇到大文件，整个过程将非常耗时。Stream则是将文件分成小块读入内存，每读入一次，都会触发相应的事件。只要监听这些事件，就能掌握进展，做出相应处理，这样就提高了性能。Node内部的很多IO处理都采用Stream，比如HTTP连接、文件读写、标准输入输出。

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

http.createServer(function (request, response){
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8080, "127.0.0.1");

console.log('Server running on port 8080.');

{% endhighlight %}

上面代码第一行 var http = require("http")，表示加载http模块。然后，调用http模块的createServer方法，创造一个服务器实例，将它赋给变量http。

ceateServer方法接受一个函数作为参数，该函数的req参数是一个对象，表示客户端的HTTP请求；res参数也是一个对象，表示服务器端的HTTP回应。rese.writeHead方法表示，服务器端回应一个HTTP头信息；response.end方法表示，服务器端回应的具体内容，以及回应完成后关闭本次对话。最后的listen(8080)表示启动服务器实例，监听本机的8080端口。

将上面这几行代码保存成文件app.js，然后用node调用这个文件，服务器就开始运行了。

{% highlight bash %}

node app.js

{% endhighlight %}

这时命令行窗口将显示一行提示“Server running at port 8080.”。打开浏览器，访问http://localhost:8080，网页显示“Hello world!”。

上面的例子是当场生成网页，也可以事前写好网页，存在文件中，然后利用fs模块读取网页文件，将其返回。

{% highlight javascript %}

var http = require('http');
var fs = require('fs');

http.createServer(function (request, response){

  fs.readFile('data.txt', function readData(err, data) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end(data);
  });

}).listen(8080, "127.0.0.1");

console.log('Server running on port 8080.');

{% endhighlight %}

下面的修改则是根据不同网址的请求，显示不同的内容，已经相当于做出一个网站的雏形了。

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

回调函数的req（request）对象，拥有以下属性。

- url：发出请求的网址。
- method：HTTP请求的方法。
- headers：HTTP请求的所有HTTP头信息。

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

## events模块

### 基本用法

events模块是node.js对“发布/订阅”模式（publish/subscribe）的部署。也就说，通过events模块的EventEmitter属性，建立一个消息中心；然后通过on方法，为各种事件指定回调函数，从而将程序转为事件驱动型，各个模块之间通过事件联系。

{% highlight javascript %}

var EventEmitter = require("events").EventEmitter;
 
var ee = new EventEmitter();
ee.on("someEvent", function () {
        console.log("event has occured");
});
 
ee.emit("someEvent");

{% endhighlight %}

上面代码在加载events模块后，通过EventEmitter属性建立了一个EventEmitter对象实例，这个实例就是消息中心。然后，通过on方法为someEvent事件指定回调函数。最后，通过emit方法触发someEvent事件。

emit方法还接受第二个参数，用于向回调函数提供参数。

{% highlight javascript %}

ee.on("someEvent", function (data){
        console.log(data);
});
 
ee.emit("someEvent", data);

{% endhighlight %}

默认情况下，Node.js允许同一个事件最多可以触发10个回调函数。

{% highlight javascript %}

ee.on("someEvent", function () { console.log("event 1"); });
ee.on("someEvent", function () { console.log("event 2"); });
ee.on("someEvent", function () { console.log("event 3"); });

{% endhighlight %}

超过10个回调函数，会发出一个警告。这个门槛值可以通过setMaxListeners方法改变。 

{% highlight javascript %}

ee.setMaxListeners(20);

{% endhighlight %}

events模块的作用，还表示在其他模块可以继承这个模块，因此也就拥有了EventEmitter接口。

{% highlight javascript %}

var util = require("util");
var EventEmitter = require("events").EventEmitter;

function UserList (){
    EventEmitter.call(this);
}

util.inherits(UserList, EventEmitter);

UserList.prototype.save = function (obj) {
	// save into database
    this.emit("saved-user", obj);  
};

{% endhighlight %}

上面代码新建了一个构造函数UserList，然后让其继承EventEmitter，因此UserList就拥有了EventEmitter的接口。最后，为UserList的实例定义一个save方法，表示将数据储存进数据库，在储存完毕后，使用EventEmitter接口的emit方法，触发一个saved-user事件。

### 事件类型

events模块默认支持一些事件。

- newListener事件：添加新的回调函数时触发。
- removeListener事件：移除回调时触发。

{% highlight javascript %}

ee.on("newListener", function (evtName){
	console.log("New Listener: " + evtName);
});

ee.on("removeListener", function (evtName){
	console.log("Removed Listener: " + evtName);
});

function foo (){}

ee.on("save-user", foo);
ee.removeListener("save-user", foo);

// New Listener: removeListener
// New Listener: save-user
// Removed Listener: save-user

{% endhighlight %}

上面代码会触发两次newListener事件，以及一次removeListener事件。

### EventEmitter对象的其他方法

**（1）once方法**

该方法类似于on方法，但是回调函数只触发一次。

{% highlight javascript %}

ee.once("firstConnection", function (){
		console.log("本提示只出现一次"); 
});

{% endhighlight %}

**（2）removeListener方法**

该方法用于移除回调函数。它接受两个参数，第一个是事件名称，第二个是回调函数名称。这就是说，不能用于移除匿名函数。

{% highlight javascript %}

function onlyOnce () {
	console.log("You'll never see this again");
	ee.removeListener("firstConnection", onlyOnce);
}

ee.on("firstConnection", onlyOnce);

{% endhighlight %}

上面代码起到与once方法类似效果。

**（3）removeAllListeners方法**

该方法用于移除某个事件的所有回调函数。

{% highlight javascript %}

ee.removeAllListeners("firstConnection");

{% endhighlight %}

如果不带参数，则表示移除所有事件的所有回调函数。

{% highlight javascript %}

ee.removeAllListeners();

{% endhighlight %}

**（4）listener方法**

该方法接受一个事件名称作为参数，返回该事件所有回调函数组成的数组。

{% highlight javascript %}

function onlyOnce () {
	console.log(ee.listeners("firstConnection"));
	ee.removeListener("firstConnection", onlyOnce);
	console.log(ee.listeners("firstConnection"));
}

ee.on("firstConnection", onlyOnce)
ee.emit("firstConnection");
ee.emit("firstConnection");

// [ [Function: onlyOnce] ]
// []

{% endhighlight %}

上面代码显示两次回调函数组成的数组，第一次只有一个回调函数onlyOnce，第二次是一个空数组，因为removeListener方法取消了回调函数。

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

## cluster模块

Node.js默认单进程运行，对于多核CPU的计算机来说，这样做效率很低，因为只有一个核在运行，其他核都在闲置。cluster模块就是为了解决这个问题而提出的。

cluster模块允许设立一个主进程和若干个worker进程，由主进程监控和协调worker进程的运行。

{% highlight javascript %}

var cluster = require('cluster');
var os = require('os');

if (cluster.isMaster){
      for (var i = 0, n = os.cpus().length; i < n; i += 1){
        cluster.fork();
	  }
}else{
	  http.createServer(function(req, res) {
	    res.writeHead(200);
	    res.end("hello world\n");
	  }).listen(8000);
}

{% endhighlight %}

上面代码先判断当前进程是否为主进程（cluster.isMaster），如果是的，就按照CPU的核数，新建若干个worker进程；如果不是，说明当前进程是worker进程，则在该进程启动一个服务器程序。

## 配置文件package.json

每个项目的根目录下面，一般都有一个package.json文件，定义了这个项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）。npm install 命令根据这个配置文件，自动下载所需的模块，也就是配置项目所需的运行和开发环境。

下面是一个最简单的package.json文件，只定义两项元数据：项目名称和项目版本。

{% highlight javascript %}

{
  "name" : "xxx",
  "version" : "0.0.0",
}

{% endhighlight %}

上面代码说明，package.json文件内部就是一个json对象，该对象的每一个成员就是当前项目的一项设置。比如name就是项目名称，version是版本（遵守“大版本.次要版本.小版本”的格式）。

下面是一个更完整的package.json文件。

{% highlight javascript %}

{
	"name": "Hello World",
	"version": "0.0.1",
	"author": "张三",
	"description": "第一个node.js程序",
	"keywords":["node.js","javascript"],
	"repository": {
		"type": "git",
		"url": "https://path/to/url"
	},
	"license":"MIT",
	"engines": {"node": "0.10.x"},
	"bugs":{"url":"http://path/to/bug","email":"bug@example.com"},
	"contributors":[{"name":"李四","email":"lisi@example.com"}],
	"scripts": {
		"start": "node index.js"
	},
	"dependencies": {
		"express": "latest",
		"mongoose": "~3.8.3",
		"handlebars-runtime": "~1.0.12",
		"express3-handlebars": "~0.5.0",
		"MD5": "~1.2.0"
	},
	"devDependencies": {
		"bower": "~1.2.8",
		"grunt": "~0.4.1",
		"grunt-contrib-concat": "~0.3.0",
		"grunt-contrib-jshint": "~0.7.2",
		"grunt-contrib-uglify": "~0.2.7",
		"grunt-contrib-clean": "~0.5.0",
		"browserify": "2.36.1",
		"grunt-browserify": "~1.3.0",
	}
}

{% endhighlight %}

上面代码中，有些成员的含义很明显，但有几项需要解释一下。

**（1）engines**

engines指明了该项目所需要的node.js版本。

**（2）scripts**

scripts指定了运行脚本命令的npm命令行缩写，比如start指定了运行npm run start时，所要执行的命令。

下面的设置指定了npm run preinstall、npm run postinstall、npm run start、npm run test时，所要执行的命令。

{% highlight javascript %}

"scripts": {
    "preinstall": "echo here it comes!",
    "postinstall": "echo there it goes!",
    "start": "node index.js",
    "test": "tap test/*.js"
}

{% endhighlight %}

**（3）dependencies，devDependencies**

dependencies和devDependencies两项，分别指定了项目运行所依赖的模块、项目开发所需要的模块。

dependencies和devDependencies这两项，都指向一个对象。该对象的各个成员，分别由模块名和对应的版本要求组成。对应的版本可以加上各种限定，主要有以下几种：

- **指定版本**：比如1.2.2，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装指定版本。
- **波浪号（tilde）+指定版本**：比如~1.2.2，表示安装1.2.x的最新版本（不低于1.2.2），但是不安装1.3.x，也就是说安装时不改变大版本号和次要版本号。
- **插入号（caret）+指定版本**：比如&#710;1.2.2，表示安装1.x.x的最新版本（不低于1.2.2），但是不安装2.x.x，也就是说安装时不改变大版本号。需要注意的是，如果大版本号为0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。
- **latest**：安装最新版本。

package.json文件可以手工编写，也可以使用npm init命令自动生成。

{% highlight bash %}

npm init

{% endhighlight %}

这个命令采用互动方式，要求用户回答一些问题，然后在当前目录生成一个基本的package.json文件。所有问题之中，只有项目名称（name）和项目版本（version）是必填的，其他都是选填的。

有了package.json文件，直接使用npm install命令，就会在当前目录中安装所需要的模块。

{% highlight bash %}

npm install

{% endhighlight %}

如果一个模块不在package.json文件之中，可以单独安装这个模块，并使用相应的参数，将其写入package.json文件之中。

{% highlight bash %}

npm install express --save
npm install express --save-dev

{% endhighlight %}

上面代码表示单独安装express模块，--save参数表示将该模块写入dependencies属性，--save-dev表示将该模块写入devDependencies属性。

## 模块管理器npm

### npm简介

npm有两层含义。一层含义是Node.js的开放式模块登记和管理系统，网址为[http://npmjs.org](http://npmjs.org)。另一层含义是Node.js默认的模块管理器，是一个命令行下的软件，用来安装和管理node模块。

npm不需要单独安装。在安装node的时候，会连带一起安装npm。node安装完成后，可以用下面的命令，查看一下npm的帮助文件。

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

npm也支持直接输入github地址。

{% highlight bash %}

npm install git://github.com/package/path.git
npm install git://github.com/package/path.git#0.1.0

{% endhighlight %}

使用安装命令以后，模块文件将下载到当前目录的 node_modules 子目录。

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

### npm list：列出当前项目的模块

npm list命令，默认列出当前目录安装的所有模块。如果使用global参数，就是列出全局安装的模块。

{% highlight bash %}

npm list

npm -global list

{% endhighlight %}

### npm search：模块搜索

向服务器端搜索某个模块，使用search命令（可使用正则搜索）。

{% highlight bash %}

npm search [搜索词]

{% endhighlight %}

如果不加搜索词，npm search 默认返回服务器端的所有模块。

### npm run

在package.json文件有一项scripts，用于指定脚本命令，供npm直接调用。

{% highlight javascript %}

"scripts": {
    "watch": "watchify client/main.js -o public/app.js -v",
    "build": "browserify client/main.js -o public/app.js",
    "start": "npm run watch & nodemon server.js",
	"test": "node test/all.js"
  },

{% endhighlight %}

上面代码在scripts项，定义了三个脚本命令，并且每个命令有一个别名。使用的时候，在命令行键入npm run后面加上别名，就能调用相应的脚本命令。

{% highlight bash %}

npm run watch
npm run build
npm run start
npm run test

{% endhighlight %}

其中，start和test属于特殊命令，可以省略run。

{% highlight bash %}

npm start
npm test

{% endhighlight %}

### npm link

一般来说，每个项目都会在项目目录内，安装所需的模块文件。也就是说，各个模块是局部安装。但是有时候，我们希望模块是一个符号链接，连到外部文件，这时候就需要用到npm link命令。

现在模块A（moduleA）的安装目录下运行npm link命令。

{% highlight bash %}

/path/to/moduleA $ npm link

{% endhighlight %}

上面的命令会在npm的安装目录内，生成一个符号链接文件。

{% highlight bash %}

/usr/local/share/npm/lib/node_modules/moduleA -> /path/to/moduleA

{% endhighlight %}

然后，转到你需要放置该模块的项目目录，再次运行npm link命令，并指定模块名。

{% highlight bash %}

/path/to/my-project  $ npm link moduleA

{% endhighlight %}

上面命令等同于生成了本地模块的符号链接。

{% highlight bash %}

/path/to/my-project/node_modules/moduleA -> /usr/local/share/npm/lib/node_modules/moduleA

{% endhighlight %}

然后，就可以在你的项目中，加载该模块了。

{% highlight javascript %}

require('moduleA')

{% endhighlight %}

如果你的项目不再需要该模块，可以在项目目录内使用npm unlink命令，删除符号链接。

{% highlight bash %}

/path/to/my-project  $ npm unlink moduleA

{% endhighlight %}

### 模块的发布

在发布你的模块之前，需要先设定个人信息。

{% highlight bash %}

npm set init.author.name "xxx"
npm set init.author.email "xxx@gmail.com"
npm set init.author.url "http://xxx.com"

{% endhighlight %}

然后，请npm系统申请用户名。

{% highlight bash %}

npm adduser

{% endhighlight %}

运行上面的命令之后，屏幕上会提示输入用户名，然后是输入Email地址和密码。

上面所有的这些个人信息，全部保存在~/.npmrc文件之中。

npm模块就是一个遵循CommonJS规范的JavaScript脚本文件。此外，在模块目录中还必须有一个提供自身信息的package.json文件，一般采用npm init命令生成这个文件。

{% highlight bash %}

npm init

{% endhighlight %}

运行上面的命令，会提示回答一系列问题，结束后自动生成package.json文件。

package.json文件中的main属性，指定模块加载的入口文件，默认是index.js。在index.js文件中，除了模块代码以外，主要使用require命令加载其他模块，使用module.exports变量输出模块接口。

下面是一个例子，将HTML文件中的特殊字符转为HTML实体。

{% highlight javascript %}

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 */
module.exports = {
  escape: function(html) {
    return String(html)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  /**
   * Unescape special characters in the given string of html.
   *
   * @param  {String} html
   * @return {String}
   */
  unescape: function(html) {
    return String(html)
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
};

{% endhighlight %}

完成代码以后，再加一个README.md文件，用来给出说明文本。

最后，使用npm publish命令发布。

{% highlight bash %}

npm publish

{% endhighlight %}

## 参考链接

- Cody Lindley, [Package Managers: An Introductory Guide For The Uninitiated Front-End Developer](http://tech.pro/tutorial/1190/package-managers-an-introductory-guide-for-the-uninitiated-front-end-developer)
- Stack Overflow, [What is Node.js?](http://stackoverflow.com/questions/1884724/what-is-node-js)
- Andrew Burgess, [Using Node's Event Module](http://dev.tutsplus.com/tutorials/using-nodes-event-module--net-35941)
- James Halliday, [task automation with npm run](http://substack.net/task_automation_with_npm_run)- Romain Prieto, [Working on related Node.js modules locally](http://www.asyncdev.net/2013/12/working-on-related-node-modules-locally/)
- Alon Salant, [Export This: Interface Design Patterns for Node.js Modules](http://bites.goodeggs.com/posts/export-this/)
- Node.js Manual & Documentation, [Modules](http://nodejs.org/api/modules.html)
- Brent Ertz, [Creating and publishing a node.js module](http://quickleft.com/blog/creating-and-publishing-a-node-js-module)
- Fred K Schott, ["npm install --save" No Longer Using Tildes](http://fredkschott.com/post/2014/02/npm-no-longer-defaults-to-tildes/)
