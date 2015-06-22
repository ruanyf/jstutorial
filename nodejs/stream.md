---
title: stream接口
layout: page
category: nodejs
date: 2014-10-23
modifiedOn: 2014-10-23
---

## 概念

Stream是Node.js为异步读写数据提供的统一接口。无论是硬盘数据、网络数据，还是内存数据，都可以采用这个接口读写。

读写数据有两种方式。一种方式是同步处理，即先将数据全部读入内存，然后处理。它的优点是符合直觉，流程非常自然，缺点是如果遇到大文件，要花很长时间，可能要过很久才能进入数据处理的步骤。另一种方式就是Stream方式，它是系统读取外部数据实际上的方式，即每次只读入数据的一小块，像“流水”一样。所以，Stream方式就是每当系统读入了一小块数据，就会触发一个事件，发出“新数据块”的信号，只要监听这个事件，就能掌握进展，做出相应处理，这样就提高了程序的性能。

Stream方法在Node中被定义成了一个抽象接口，具有readable、writable、drain、data、end、close等事件，既可以读取数据，也可以写入数据。读写数据时，每读入（或写入）一段数据，就会触发一次data事件，全部读取（或写入）完毕，触发end事件。如果发生错误，则触发error事件。

Node内部的很多IO处理都部署了Stream接口，比如HTTP连接、文件读写、标准输入输出等。

数据流通过pipe方法，可以方便地导向其他具有Stream接口的对象。

```javascript
var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('wow.txt')
  .pipe(zlib.createGzip())
  .pipe(process.stdout);
```

上面代码先打开文本文件wow.txt，然后压缩，再导向标准输出。

```javascript
fs.createReadStream('wow.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('wow.gz'));
```

上面代码压缩文件wow.txt以后，又将其写回压缩文件。

下面代码新建一个Stream实例，然后指定写入事件和终止事件的回调函数，再将其接到标准输入之上。

```javascript
var stream = require('stream');
var Stream = stream.Stream;

var ws = new Stream;
ws.writable = true;

ws.write = function(data) {
  console.log("input=" + data);
}

ws.end = function(data) {
  console.log("bye");
}

process.stdin.pipe(ws);
```

调用上面的脚本，会产生以下结果。

```bash
$ node pipe_out.js
hello
input=hello
^d
bye
```

上面代码调用脚本下，键入hello，会输出`input=hello`。然后按下ctrl-d，会输出bye。使用管道命令，可以看得更清楚。

```bash
$ echo hello | node pipe_out.js
input=hello

bye
```

## Stream读取接口

Stream的读取接口，用来读取数据。每当系统有新的数据，该接口可以监听到data事件，从而回调函数。

```javascript
var fs = require('fs');
var readableStream = fs.createReadStream('file.txt');
var data = '';

readableStream.setEncoding('utf8');

readableStream.on('data', function(chunk) {
  data+=chunk;
});

readableStream.on('end', function() {
  console.log(data);
});
```

上面代码中，fs模块的createReadStream方法，是部署了Stream接口的文件读取方法。该方法对指定的文件，返回一个对象。该对象只要监听data事件，回调函数就能读到数据。

除了data事件，监听readable事件，也可以读到数据。

```javascript
var fs = require('fs');
var readableStream = fs.createReadStream('file.txt');
var data = '';
var chunk;

readableStream.setEncoding('utf8');

readableStream.on('readable', function() {
  while ((chunk=readableStream.read()) !== null) {
    data += chunk;
  }
});

readableStream.on('end', function() {
  console.log(data)
});
```

readable事件表示系统缓冲之中有可读的数据，使用read方法去读出数据。如果没有数据可读，read方法会返回null。

“可读数据流”除了read方法，还有以下方法。

- Readable.pause() ：暂停数据流。已经存在的数据，也不再触发data事件，数据将保留在缓存之中，此时的数据流称为静态数据流。如果对静态数据流再次调用pause方法，数据流将重新开始流动，但是缓存中现有的数据，不会再触发data事件。
- Readable.resume()：恢复暂停的数据流。
- readable.unpipe()：从管道中移除目的地数据流。如果该方法使用时带有参数，会阻止“可读数据流”进入某个特定的目的地数据流。如果使用时不带有参数，则会移除所有的目的地数据流。

## 可写数据流

“可写数据流”允许你将数据写入某个目的地。与“可读数据流”类似，它也会触发各种不同的事件。

```javascript
var fs = require('fs');
var readableStream = fs.createReadStream('file1.txt');
var writableStream = fs.createWriteStream('file2.txt');

readableStream.setEncoding('utf8');

readableStream.on('data', function(chunk) {
  writableStream.write(chunk);
});
```

上面代码中，fs模块的createWriteStream方法针对特定文件，创建了一个“可写数据流”，本质上就是对写入操作部署了Stream接口。然后，“可写数据流”的write方法，可以将数据写入文件。

“可写数据流”具有以下事件。

- error：：写入过程中出错时触发。
- pipe： “可写数据流”发现有“可读数据流”接入时触发。
- unpipe：对“可读数据流”调用unpipe方法时触发。

## pipe()

pipe方法是自动传送数据的机制，就像管道一样。

```javascript
var fs = require('fs');
var readableStream = fs.createReadStream('file1.txt');
var writableStream = fs.createWriteStream('file2.txt');

readableStream.pipe(writableStream);
```

上面代码使用pipe方法，将file1的内容写入file2。整个过程由pipe方法管理，不用手动干预，所以可以将传送数据写得很简洁。

pipe方法返回目的地的数据流，因此可以使用链式写法，将多个数据流操作连在一起。

```javascript
var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('output.txt'));
```

上面代码采用链式写法，先读取文件，然后进行压缩，最后输出。

## HTTP请求

data事件表示读取或写入了一块数据。

```javascript

req.on('data', function(buf){
  // Do something with the Buffer
});

```

使用req.setEncoding方法，可以设定字符串编码。

```javascript

req.setEncoding('utf8');
req.on('data', function(str){
    // Do something with the String
});

```

end事件，表示读取或写入数据完毕。

```javascript

var http = require('http');

http.createServer(function(req, res){
    res.writeHead(200);
    req.on('data', function(data){
        res.write(data);
    });
    req.on('end', function(){
        res.end();
    });
}).listen(3000);

```

上面代码相当于建立了“回声”服务，将HTTP请求的数据体，用HTTP回应原样发送回去。

system模块提供了pump方法，有点像Linux系统的管道功能，可以将一个数据流，原封不动得转给另一个数据流。所以，上面的例子也可以用pump方法实现。

```javascript

var http = require('http'),
    sys = require('sys');

http.createServer(function(req, res){
    res.writeHead(200);
    sys.pump(req, res);
}).listen(3000);

```

## fs模块

fs模块的createReadStream方法用于新建读取数据流，createWriteStream方法用于新建写入数据流。使用这两个方法，可以做出一个用于文件复制的脚本copy.js。

```javascript

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
});d all your errors, you wouldn't need to use domains.

```

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

## 错误处理

下面是压缩后发送文件的代码。

```javascript
http.createServer(function (req, res) {
  // set the content headers
  fs.createReadStream('filename.txt')
  .pipe(zlib.createGzip())
  .pipe(res)
})
```

上面的代码没有部署错误处理机制，一旦发生错误，就无法处理。所以，需要加上error事件的监听函数。

```javascript
http.createServer(function (req, res) {
  // set the content headers
  fs.createReadStream('filename.txt')
  .on('error', onerror)
  .pipe(zlib.createGzip())
  .on('error', onerror)
  .pipe(res)

  function onerror(err) {
    console.error(err.stack)
  }
})
```

上面的代码还是存在问题，如果客户端中断下载，写入的数据流就会收不到close事件，一直处于等待状态，从而造成内存泄漏。因此，需要使用[on-finished模块](https://github.com/jshttp/on-finished)用来处理这种情况。

```javascript
http.createServer(function (req, res) {
  var stream = fs.createReadStream('filename.txt')

  // set the content headers
  stream
  .on('error', onerror)
  .pipe(zlib.createGzip())
  .on('error', onerror)
  .pipe(res)

  onFinished(res, function () {
    // make sure the stream is always destroyed
    stream.destroy()
  })
})
```

## 参考链接

- James Halliday, [cs294-101-streams-lecture](https://github.com/substack/cs294-101-streams-lecture)
