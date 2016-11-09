---
title: Http模块
category: nodejs
layout: page
date: 2015-05-30
modifiedOn: 2015-05-30
---

## http.STATUS_CODES

`http.STATUS_CODES`是一个对象，属性名都是状态码，属性值则是该状态码的简短解释。

```javascript
require('http').STATUS_CODES['301']
// "Moved Permanently"
```

## 基本用法

### 处理GET请求

`http`模块主要用于搭建HTTP服务。使用Node搭建HTTP服务器非常简单。

```javascript
var http = require('http');

http.createServer(function (request, response){
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write("Hello World");
  response.end();
}).listen(8080, '127.0.0.1');

console.log('Server running on port 8080.');

// 另一种写法
function onRequest(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}

http.createServer(onRequest).listen(process.env.PORT);
```

上面代码第一行`var http = require("http")`，表示加载`http`模块。然后，调用`http`模块的`createServer`方法，创造一个服务器实例。

`ceateServer`方法接受一个函数作为参数，该函数的`request`参数是一个对象，表示客户端的HTTP请求；`response`参数也是一个对象，表示服务器端的HTTP回应。`response.writeHead`方法用来写入HTTP回应的头信息；`response.end`方法用来写入HTTP回应的具体内容，以及回应完成后关闭本次对话。最后的`listen(8080)`表示启动服务器实例，监听本机的8080端口。

将上面这几行代码保存成文件`app.js`，然后执行该脚本，服务器就开始运行了。

```bash
$ node app.js
```

这时命令行窗口将显示一行提示“Server running at port 8080.”。打开浏览器，访问http://localhost:8080，网页显示“Hello world!”。

上面的例子是收到请求后生成网页，也可以事前写好网页，存在文件中，然后利用`fs`模块读取网页文件，将其返回。

```javascript
var http = require('http');
var fs = require('fs');

http.createServer(function (request, response){
  fs.readFile('data.txt', function readData(err, data) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end(data);
  });

  // 或者

  fs.createReadStream(`${__dirname}/index.html`).pipe(response);
}).listen(8080, '127.0.0.1');

console.log('Server running on port 8080.');
```

下面的修改则是根据不同网址的请求，显示不同的内容，已经相当于做出一个网站的雏形了。

```javascript
var http = require('http');

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
```

### request 对象

`createServer`方法的回调函数的第一个参数是一个`request`对象，拥有以下属性。

- `url`：发出请求的网址。
- `method`：HTTP请求的方法。
- `headers`：HTTP请求的所有HTTP头信息。

下面的例子是获取请求的路径名。

```javascript
var url = require('url');
var pathname = url.parse(request.url).pathname;
```

`setEncoding()`方法用于设置请求的编码。

```javascript
request.setEncoding("utf8");
```

`addListener()`方法用于为请求添加监听事件的回调函数。

```javascript
var querystring = require('querystring');
var postData = '';

request.addListener('data', function (postDataChunk) {
  postData += postDataChunk;
});

request.addListener('end', function () {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write("You've sent the text: " + querystring.parse(postData).text);
  response.end();
});
```

### 处理异步操作

遇到异步操作时，会先处理后面的请求，等到当前请求有了结果以后，再返回结果。

```javascript
var exec = require("child_process").exec;

exec('ls -lah', function (error, stdout, stderr) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write(stdout);
  response.end();
});
```

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

## 发出请求

### get()

get方法用于发出get请求。

```javascript
function getTestPersonaLoginCredentials(callback) {
  return http.get({
    host: 'personatestuser.org',
    path: '/email'
  }, function(response) {
    var body = '';

    response.on('data', function(d) {
      body += d;
    });

    response.on('end', function() {
      var parsed = JSON.parse(body);
      callback({
        email: parsed.email,
        password: parsed.pass
      });
    });
  });
},
```

### request()

request方法用于发出HTTP请求，它的使用格式如下。

```javascript
http.request(options[, callback])
```

request方法的options参数，可以是一个对象，也可以是一个字符串。如果是字符串，就表示这是一个URL，Node内部就会自动调用`url.parse()`，处理这个参数。

options对象可以设置如下属性。

- host：HTTP请求所发往的域名或者IP地址，默认是localhost。
- hostname：该属性会被`url.parse()`解析，优先级高于host。
- port：远程服务器的端口，默认是80。
- localAddress：本地网络接口。
- socketPath：Unix网络套接字，格式为host:port或者socketPath。
- method：指定HTTP请求的方法，格式为字符串，默认为GET。
- path：指定HTTP请求的路径，默认为根路径（/）。可以在这个属性里面，指定查询字符串，比如`/index.html?page=12`。如果这个属性里面包含非法字符（比如空格），就会抛出一个错误。
- headers：一个对象，包含了HTTP请求的头信息。
- auth：一个代表HTTP基本认证的字符串`user:password`。
- agent：控制缓存行为，如果HTTP请求使用了agent，则HTTP请求默认为`Connection: keep-alive`，它的可能值如下：
  - undefined（默认）：对当前host和port，使用全局Agent。
  - Agent：一个对象，会传入agent属性。
  - false：不缓存连接，默认HTTP请求为`Connection: close`。
- keepAlive：一个布尔值，表示是否保留socket供未来其他请求使用，默认等于false。
- keepAliveMsecs：一个整数，当使用KeepAlive的时候，设置多久发送一个TCP KeepAlive包，使得连接不要被关闭。默认等于1000，只有keepAlive设为true的时候，该设置才有意义。

request方法的callback参数是可选的，在response事件发生时触发，而且只触发一次。

`http.request()`返回一个`http.ClientRequest`类的实例。它是一个可写数据流，如果你想通过POST方法发送一个文件，可以将文件写入这个ClientRequest对象。

下面是发送POST请求的一个例子。

```javascript
var postData = querystring.stringify({
  'msg' : 'Hello World!'
});

var options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length
  }
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(postData);
req.end();
```

注意，上面代码中，`req.end()`必须被调用，即使没有在请求体内写入任何数据，也必须调用。因为这表示已经完成HTTP请求。

发送过程的任何错误（DNS错误、TCP错误、HTTP解析错误），都会在request对象上触发error事件。

## Server()

`Server`方法用于新建一个服务器实例。

```javascript
var http = require('http');
var fs = require('fs');

var server = new http.Server();
server.listen(8000);

server.on('request', function (request, response) {
  // 解析请求的URL
  var url = require('url').parse(request.url);
  if (url.pathname === '/test/1') {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
    response.write('Hello');
    response.end();
  } else if (url.pathname === '/test/2') {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
    response.write(request.method + ' ' + request.url +
      ' HTTP/' + request.httpVersion + '\r\n');
    for (var h in request.headers) {
      response.write(h + ': ' + request.headers[h] + '\r\n');
    }
    response.write('\r\n');
    request.on('data', function(chunk) { response.write(chunk); });
    request.on('end', function(chunk) { response.end(); });
  } else {
    var filename = url.pathname.substring(1);
    var type;
    switch(filename.substring(filename.lastIndexOf('.') + 1))  {
      case 'html':
      case 'htm':      type = 'text/html; charset=UTF-8'; break;
      case 'js':       type = 'application/javascript; charset=UTF-8'; break;
      case 'css':      type = 'text/css; charset=UTF-8'; break;
      case 'txt' :     type = 'text/plain; charset=UTF-8'; break;
      case 'manifest': type = 'text/cache-manifest; charset=UTF-8'; break;
      default:         type = 'application/octet-stream'; break;
    }
    fs.readFile(filename, function (err, content) {
      if (err) {
        response.writeHead(404, {
          'Content-Type': 'text/plain; charset=UTF-8'});
        response.write(err.message);
        response.end();
      } else {
        response.writeHead(200, {'Content-Type': type});
        response.write(content);
        response.end();
      }
    });
  }
});
```

`listen`方法用于启动服务器，它可以接受多种参数。

```javascript
var server = new http.Server();

// 端口
server.listen(8000);

// 端口，主机
server.listen(8000, 'localhost');

// 对象
server.listen({
  port: 8000,
  host: 'localhost',
})
```

以上三种写法都是合法的。

## 搭建HTTPs服务器

搭建HTTPs服务器需要有SSL证书。对于向公众提供服务的网站，SSL证书需要向证书颁发机构购买；对于自用的网站，可以自制。

自制SSL证书需要OpenSSL，具体命令如下。

```bash
$ openssl genrsa -out key.pem
$ openssl req -new -key key.pem -out csr.pem
$ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
$ rm csr.pem
```

上面的命令生成两个文件：ert.pem（证书文件）和 key.pem（私钥文件）。有了这两个文件，就可以运行HTTPs服务器了。

Node内置Https支持。

```javascript
var server = https.createServer({
  key: privateKey,
  cert: certificate,
  ca: certificateAuthorityCertificate
}, app);
```

Node.js提供一个https模块，专门用于处理加密访问。

```javascript
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
```

上面代码显示，HTTPs服务器与HTTP服务器的最大区别，就是createServer方法多了一个options参数。运行以后，就可以测试是否能够正常访问。

{% highlight bash %}

curl -k https://localhost:8000

{% endhighlight %}

## 模块属性

（1）HTTP请求的属性

- headers：HTTP请求的头信息。
- url：请求的路径。

## 模块方法

（1）http模块的方法

- createServer(callback)：创造服务器实例。

（2）服务器实例的方法

- listen(port)：启动服务器监听指定端口。

（3）HTTP回应的方法

- setHeader(key, value)：指定HTTP头信息。
- write(str)：指定HTTP回应的内容。
- end()：发送HTTP回应。
