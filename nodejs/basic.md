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

Node.js采用模块化结构，按照[CommonJS规范](http://wiki.commonjs.org/wiki/CommonJS)定义和使用模块。模块与文件是一一对应关系，即加载一个模块，实际上就是加载对应的一个模块文件。

require方法用于指定加载模块。

{% highlight javascript %}

var circle = require('./circle.js');

{% endhighlight %}

上面代码表明，从当前目录下的circle.js文件，加载circle模块。因为require方法默认加载的就是js文件，因此可以把js后缀名省略。

{% highlight javascript %}

var circle = require('./circle');

{% endhighlight %}

require方法的参数是模块文件的名字。它分成两种情况，第一种情况是参数中含有文件路径（比如上例），这时路径是相对于当前脚本所在的目录，第二种情况是参数中不含有文件路径（比如下例）。

{% highlight javascript %}

var bar = require('bar');

{% endhighlight %}

如果require方法的参数不带有路径，则node.js依次按照以下顺序，去寻找模块文件。

node.js依次到下面的目录，去寻找bar模块。

- ./node_modules/bar
- ../node_modules/bar
- ../../node_modules/bar
- /node_modules/bar

可以看到，如果没有指明模块所在位置，Node会依次从当前目录向上，一级级在node_modules子目录下寻找模块。如果没有找到该模块，会抛出一个错误。这样做的好处是，不同的项目可以在自己的目录中，安装同一个模块的不同版本，而不会发生版本冲突。

有时候，一个模块本身就是一个目录，目录中包含多个文件。这时候，Node在package.json文件中，寻找main属性所指明的模块入口文件。

{% highlight javascript %}

{ 
	"name" : "bar",
	"main" : "./lib/bar.js" 
}

{% endhighlight %}

上面代码中，模块的启动文件为lib子目录下的bar.js。当使用require('bar')命令加载该模块时，实际上加载的是`bar/lib/some-library.js`文件。下面写法会起到同样效果。

```javascript

var bar = require('bar/lib/bar.js')

```

如果模块目录中没有package.json文件，node.js会尝试在模块目录中寻找index.js或index.node文件进行加载。

模块一旦被加载以后，就会被系统缓存。如果第二次还加载该模块，则会返回缓存中的版本，这意味着模块实际上只会执行一次。如果希望模块执行多次，则可以让模块返回一个函数，然后多次调用该函数。

### 核心模块

如果只是在服务器运行JavaScript代码，用处并不大，因为服务器脚本语言已经有很多种了。Node.js的用处在于，它本身还提供了一系列功能模块，与操作系统互动。这些核心的功能模块，不用安装就可以使用，下面是它们的清单。

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

Node模块采用CommonJS规范。只要符合这个规范，就可以自定义模块。

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

fs是filesystem的缩写，该模块提供本地文件的读写能力，基本上是POSIX文件操作命令的简单包装。但是，这个模块几乎对所有操作提供异步和同步两种操作方式，供开发者选择。

### mkdir()，writeFile()，readfile()

mkdir方法用于新建目录。

```javascript

var fs = require('fs');

fs.mkdir('./helloDir',0777, function (err) {
  if (err) throw err;
});

```

mkdir接受三个参数，第一个是目录名，第二个是权限值，第三个是回调函数。

writeFile方法用于写入文件。

```javascript

var fs = require('fs');

fs.writeFile('./helloDir/message.txt', 'Hello Node', function (err) {
  if (err) throw err;
  console.log('文件写入成功');
});

```

readfile方法用于读取文件内容。

{% highlight javascript %}

var fs = require('fs');

fs.readFile('./helloDir/message.txt','UTF-8' ,function (err, data) {
  if (err) throw err;
  console.log(data);
});

{% endhighlight %}

上面代码使用readFile方法读取文件。readFile方法的第一个参数是文件名，第二个参数是文件编码，第三个参数是回调函数。可用的文件编码包括“ascii”、“utf8”和“base64”。如果没有指定文件编码，返回的是原始的缓存二进制数据，这时需要调用buffer对象的toString方法，将其转为字符串。

```javascript

var fs = require('fs');
fs.readFile('example_log.txt', function (err, logData) {
  if (err) throw err;
  var text = logData.toString();
});

```

### mkdirSync()，writeFileSync()，readFileSync()

这三个方法是建立目录、写入文件、读取文件的同步版本。

{% highlight javascript %}

fs.mkdirSync('./helloDirSync',0777);
fs.writeFileSync('./helloDirSync/message.txt', 'Hello Node');
var data = fs.readFileSync('./helloDirSync/message.txt','UTF-8');
console.log('file created with contents:');
console.log(data);

{% endhighlight %}

对于流量较大的服务器，最好还是采用异步操作，因为同步操作时，只有前一个操作结束，才会开始后一个操作，如果某个操作特别耗时（常常发生在读写数据时），会导致整个程序停顿。

### readdir()

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

### exists(path, callback)

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

### stat()

stat方法的参数是一个文件或目录，它产生一个对象，该对象包含了该文件或目录的具体信息。我们往往通过该方法，判断正在处理的到底是一个文件，还是一个目录。

```javascript

var fs = require('fs');

fs.readdir('/etc/', function (err, files) {
  if (err) throw err;

  files.forEach( function (file) {
    fs.stat('/etc/' + file, function (err, stats) {
      if (err) throw err;

      if (stats.isFile()) {
        console.log("%s is file", file);
      }
      else if (stats.isDirectory ()) {
      console.log("%s is a directory", file);
      }    
    console.log('stats:  %s',JSON.stringify(stats));
    });
  });
});

```

### watchfile()，unwatchfile()

watchfile方法监听一个文件，如果该文件发生变化，就会自动触发回调函数。

```javascript

var fs = require('fs');

fs.watchFile('./testFile.txt', function (curr, prev) {
  console.log('the current mtime is: ' + curr.mtime);
  console.log('the previous mtime was: ' + prev.mtime);
});

fs.writeFile('./testFile.txt', "changed", function (err) {
  if (err) throw err;

  console.log("file write complete");   
});

```
unwatchfile方法用于解除对文件的监听。

## http模块

### 基本用法

http模块主要用于搭建HTTP服务。使用Node.js搭建HTTP服务器非常简单。

{% highlight javascript %}

var http = require('http');

http.createServer(function (request, response){
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8080, "127.0.0.1");

console.log('Server running on port 8080.');

{% endhighlight %}

上面代码第一行`var http = require("http")`，表示加载http模块。然后，调用http模块的createServer方法，创造一个服务器实例，将它赋给变量http。

ceateServer方法接受一个函数作为参数，该函数的request参数是一个对象，表示客户端的HTTP请求；response参数也是一个对象，表示服务器端的HTTP回应。response.writeHead方法表示，服务器端回应一个HTTP头信息；response.end方法表示，服务器端回应的具体内容，以及回应完成后关闭本次对话。最后的listen(8080)表示启动服务器实例，监听本机的8080端口。

将上面这几行代码保存成文件app.js，然后用node调用这个文件，服务器就开始运行了。

{% highlight bash %}

$ node app.js

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

对上面代码稍加修改，就可以做出文件上传的功能。

```javascript

"use strict"; 

var http = require('http'); 
var fs = require('fs'); 
var destinationFile, fileSize, uploadedBytes; 

http.createServer(function (request, response) { 
  response.writeHead(200); 
  destinationFile = fs.createWriteStream("destination.md"); 
  request.pipe(destinationFile); 
  fileSize = request.headers['content-length']; 
  uploadedBytes = 0; 
  
  request.on('data', function (d) { 
    uploadedBytes += d.length; 
    var p = (uploadedBytes / fileSize) * 100; 
    response.write("Uploading " + parseInt(p, 0) + " %\n"); 
  }); 
  
  request.on('end', function () { 
    response.end("File Upload Complete"); 
  });
}).listen(3030, function () { 
  console.log("server started"); 
});

```

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

## Buffer对象

Buffer对象是Node.js用来处理二进制数据的一个接口。它是一个构造函数，它的实例代表了V8引擎分配的一段内存。

Buffer对象可以用new命令生成一个实例，它的参数就是存入内存的数据。

```javascript

var hello = new Buffer('Hello');

console.log(hello);
// <Buffer 48 65 6c 6c 6f>

console.log(hello.toString());
// "Hello"

```

上面代码表示，hello是一个Buffer，内容为储存在内存中的五个字符的二进制数据，使用toString方法可以看到对应的字符串。

toString方法可以只返回指定位置内存的内容，它的第二个参数表示起始位置，第三个参数表示终止位置，两者都是从0开始计算。

```javascript

var buf = new Buffer('just some data');
console.log(buf.toString('ascii', 4, 9));
// "some"

```

除了使用字符串参数，生成Buffer实例，还可以使用十六进制数据。

```javascript

var hello = new Buffer([0x48, 0x65, 0x6c, 0x6c, 0x6f]);

```

构造函数Buffer的参数，如果是一个数值，就表示所生成的实例占据内存多少个字节。

```javascript

var buf = new Buffer(5);
buf.write('He');
buf.write('l', 2);
buf.write('lo', 3);
console.log(buf.toString());
// "Hello"

```

Buffer实例的write方法，可以向所指定的内存写入数据。它的第一个参数是所写入的内容，第二个参数是所写入的起始位置（从0开始）。所以，上面代码最后写入内存的内容是Hello。

Buffer实例的length属性，返回Buffer实例所占据的内存长度。如果想知道一个字符串所占据的字节长度，可以将其传入Buffer.byteLength方法。

Buffer实例的slice方法，返回一个按照指定位置、从原对象切割出来的Buffer实例。它的两个参数分别为切割的起始位置和终止位置。

```javascript

var buf = new Buffer('just some data');
var chunk = buf.slice(4, 9);
console.log(chunk.toString());
// "some"

```

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

## 异常处理

Node是单线程运行环境，一旦抛出的异常没有被捕获，就会引起整个进程的崩溃。所以，Node的异常处理对于保证系统的稳定运行非常重要。

### try...catch结构

最常用的捕获异常的方式，就是使用try...catch结构。但是，这个结构无法捕获异步运行的代码抛出的异常。

```javascript

try {
    process.nextTick(function () {
        throw new Error("error");
    });
} catch (err) {
    //can not catch it
    console.log(err);
}

try {
    setTimeout(function(){
        throw new Error("error");
    },1)
} catch (err) {
    //can not catch it
    console.log(err);
}


```

上面代码抛出的两个异常，都无法被catch代码块捕获。

### uncaughtException事件

当一个异常未被捕获，就会触发uncaughtException事件，可以对这个事件注册回调函数，从而捕获异常。

```javascript

process.on('uncaughtException', function(err) {
    console.error('Error caught in uncaughtException event:', err);
});


try {
    setTimeout(function(){
        throw new Error("error");
    },1)
} catch (err) {
    //can not catch it
    console.log(err);
}


```

只要给uncaughtException配置了回调，Node进程不会异常退出，但异常发生的上下文已经丢失，无法给出异常发生的详细信息。而且，异常可能导致Node不能正常进行内存回收，出现内存泄露。所以，当uncaughtException触发后，最好记录错误日志，然后结束Node进程。

```javascript

process.on('uncaughtException', function(err) {
  logger(err);
  process.exit(1);
});

```

### 正确的编码习惯

由于异步中的异常无法被外部捕获，所以异常应该作为第一个参数传递给回调函数，Node的编码规则就是这么规定的。

```javascript

fs.readFile('/t.txt', function (err, data) {
  if (err) throw err;
  console.log(data);
});

```

## 参考链接

- Cody Lindley, [Package Managers: An Introductory Guide For The Uninitiated Front-End Developer](http://tech.pro/tutorial/1190/package-managers-an-introductory-guide-for-the-uninitiated-front-end-developer)
- Stack Overflow, [What is Node.js?](http://stackoverflow.com/questions/1884724/what-is-node-js)
- Andrew Burgess, [Using Node's Event Module](http://dev.tutsplus.com/tutorials/using-nodes-event-module--net-35941)
- James Halliday, [task automation with npm run](http://substack.net/task_automation_with_npm_run)- Romain Prieto, [Working on related Node.js modules locally](http://www.asyncdev.net/2013/12/working-on-related-node-modules-locally/)
- Alon Salant, [Export This: Interface Design Patterns for Node.js Modules](http://bites.goodeggs.com/posts/export-this/)
- Node.js Manual & Documentation, [Modules](http://nodejs.org/api/modules.html)
- Brent Ertz, [Creating and publishing a node.js module](http://quickleft.com/blog/creating-and-publishing-a-node-js-module)
- Fred K Schott, ["npm install --save" No Longer Using Tildes](http://fredkschott.com/post/2014/02/npm-no-longer-defaults-to-tildes/)
- Satans17, [Node稳定性的研究心得](http://satans17.github.io/2014/05/04/node%E7%A8%B3%E5%AE%9A%E6%80%A7%E7%9A%84%E7%A0%94%E7%A9%B6%E5%BF%83%E5%BE%97/)
