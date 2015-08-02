---
title: stream接口
layout: page
category: nodejs
date: 2014-10-23
modifiedOn: 2014-10-23
---

## Stream是什么？

Unix操作系统从很早以前，就有Stream（流）这个概念，它是不同进程之间传递数据的一种方式。管道命令Pipe就起到在不同命令之间，连接Stream的作用。

Stream把较大的数据，拆成很小的部分。只要命令部署了Stream接口，就可以把一个流的输出接到另一个流的输入。Node引入了这个概念，通过Stream为异步读写数据提供的统一接口。无论是硬盘数据、网络数据，还是内存数据，都可以采用这个接口读写。

读写数据有两种方式。一种方式是同步处理，即先将数据全部读入内存，然后处理。它的优点是符合直觉，流程非常自然，缺点是如果遇到大文件，要花很长时间，可能要过很久才能进入数据处理的步骤。另一种方式就是Stream方式，它是系统读取外部数据实际上的方式，即每次只读入数据的一小块，像“流水”一样。所以，Stream方式就是每当系统读入了一小块数据，就会触发一个事件，发出“新数据块”的信号，只要监听这个事件，就能掌握进展，做出相应处理，这样就提高了程序的性能。

Stream接口最大特点就是通过事件通信，具有readable、writable、drain、data、end、close等事件，既可以读取数据，也可以写入数据。读写数据时，每读入（或写入）一段数据，就会触发一次data事件，全部读取（或写入）完毕，触发end事件。如果发生错误，则触发error事件。

一个对象只要部署了Stream接口，就可以从读取数据，或者写入数据。Node内部很多涉及IO处理的对象，都部署了Stream接口，比如HTTP连接、文件读写、标准输入输出等。

## 基本用法

Node的I/O操作都是异步的，所以与磁盘和网络的交互，都要通过回调函数。一个典型的写文件操作，可能像下面这样。

```javascript
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
  fs.readFile(__dirname + '/data.txt', function (err, data) {
    res.end(data);
  });
});
server.listen(8000);
```

上面的代码有一个问题，那就是它必须将整个data.txt文件读入内存，然后再输入。如果data.txt非常大，就会占用大量的内容。一旦有多个并发请求，操作就会变得非常缓慢，用户不得不等很久，才能得到结果。

由于参数req和res都部署了Stream接口，可以使用`fs.createReadStream()`替代`fs.readFile()`，就能解决这个问题。

```javascript
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
  var stream = fs.createReadStream(__dirname + '/data.txt');
  stream.pipe(res);
});
server.listen(8000);
```

Stream接口的最大特点，就是数据会发出node和data事件，内置的pipe方法会处理这两个事件。

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

Stream接口分成三类。

- 可读数据流接口，用于读取数据。
- 可写数据流接口，用于写入数据。
- 双向数据流接口，用于读取和写入数据，比如Node的tcp sockets、zlib、crypto都部署了这个接口。

## 可读数据流

“可读数据流”用来产生数据。它表示数据的来源，只要一个对象提供“可读数据流”，就表示你可以从其中读取数据。

```javascript
var Readable = require('stream').Readable;

var rs = new Readable;
rs.push('beep ');
rs.push('boop\n');
rs.push(null);

rs.pipe(process.stdout);
```

上面代码产生了一个可写数据流，最后将其写入标注输出。可读数据流的push方法，用来将数据输入缓存。
`rs.push(null)`中的null，用来告诉rs，数据输入完毕。

“可读数据流”有两种状态：流动态和暂停态。处于流动态时，数据会尽快地从数据源导向用户的程序；处于暂停态时，必须显式调用`stream.read()`等指令，“可读数据流”才会释放数据。刚刚新建的时候，“可读数据流”处于暂停态。

三种方法可以让暂停态转为流动态。

- 添加data事件的监听函数
- 调用resume方法
- 调用pipe方法将数据送往一个可写数据流

如果转为流动态时，没有data事件的监听函数，也没有pipe方法的目的地，那么数据将遗失。

以下两种方法可以让流动态转为暂停态。

- 不存在pipe方法的目的地时，调用pause方法
- 存在pipe方法的目的地时，移除所有data事件的监听函数，并且调用unpipe方法，移除所有pipe方法的目的地

注意，只移除data事件的监听函数，并不会自动引发数据流进入“暂停态”。另外，存在pipe方法的目的地时，调用pause方法，并不能保证数据流总是处于暂停态，一旦那些目的地发出数据请求，数据流有可能会继续提供数据。

每当系统有新的数据，该接口可以监听到data事件，从而回调函数。

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

### read()

read方法从系统缓存读取并返回数据。如果读不到数据，则返回null。

该方法可以接受一个整数作为参数，表示所要读取数据的数量，然后会返回该数量的数据。如果读不到足够数量的数据，返回null。如果不提供这个参数，默认返回系统缓存之中的所有数据。

只在“暂停态”时，该方法才有必要手动调用。“流动态”时，该方法是自动调用的，直到系统缓存之中的数据被读光。

```javascript
var readable = getReadableStreamSomehow();
readable.on('readable', function() {
  var chunk;
  while (null !== (chunk = readable.read())) {
    console.log('got %d bytes of data', chunk.length);
  }
});
```

如果该方法返回一个数据块，那么它就触发了data事件。

### _read()

可读数据流的_read方法，可以将数据放入可读数据流。

```javascript
var Readable = require('stream').Readable;
var rs = Readable();

var c = 97;
rs._read = function () {
  rs.push(String.fromCharCode(c++));
  if (c > 'z'.charCodeAt(0)) rs.push(null);
};

rs.pipe(process.stdout);
```

运行结果如下。

```bash
$ node read1.js
abcdefghijklmnopqrstuvwxyz
```

### setEncoding()

调用该方法，会使得数据流返回指定编码的字符串，而不是缓存之中的二进制对象。比如，调用`setEncoding('utf8')`，数据流会返回UTF-8字符串，调用`setEncoding('hex')`，数据流会返回16进制的字符串。

该方法会正确处理多字节的字符，而缓存的方法`buf.toString(encoding)`不会。所以如果想要从数据流读取字符串，应该总是使用该方法。

```javascript
var readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', function(chunk) {
  assert.equal(typeof chunk, 'string');
  console.log('got %d characters of string data', chunk.length);
});
```

### resume()

resume方法会使得“可读数据流”继续释放data事件，即转为流动态。

```javascript
var readable = getReadableStreamSomehow();
readable.resume();
readable.on('end', function(chunk) {
  console.log('数据流到达尾部，未读取任务数据');
});
```

上面代码中，调用resume方法使得数据流进入流动态，只定义end事件的监听函数，不定义data事件的监听函数，表示不从数据流读取任何数据，只监听数据流到达尾部。

### pause()

pause方法使得流动态的数据流，停止释放data事件，转而进入暂停态。任何此时已经可以读到的数据，都将停留在系统缓存。

```javascript
var readable = getReadableStreamSomehow();
readable.on('data', function(chunk) {
  console.log('读取%d字节的数据', chunk.length);
  readable.pause();
  console.log('接下来的1秒内不读取数据');
  setTimeout(function() {
    console.log('数据恢复读取');
    readable.resume();
  }, 1000);
});
```

### isPaused()

该方法返回一个布尔值，表示“可读数据流”被客户端手动暂停（即调用了pause方法），目前还没有调用resume方法。

```javascript
var readable = new stream.Readable

readable.isPaused() // === false
readable.pause()
readable.isPaused() // === true
readable.resume()
readable.isPaused() // === false
```

### pipe()

pipe方法是自动传送数据的机制，就像管道一样。它从“可读数据流”读出所有数据，将其写出指定的目的地。整个过程是自动的。

```javascript
src.pipe(dst)
```

pipe方法必须在可读数据流上调用，它的参数必须是可写数据流。

```javascript
var fs = require('fs');
var readableStream = fs.createReadStream('file1.txt');
var writableStream = fs.createWriteStream('file2.txt');

readableStream.pipe(writableStream);
```

上面代码使用pipe方法，将file1的内容写入file2。整个过程由pipe方法管理，不用手动干预，所以可以将传送数据写得很简洁。

pipe方法返回目的地的数据流，因此可以使用链式写法，将多个数据流操作连在一起。

```javascript
a.pipe(b).pipe(c).pipe(d)
// 等同于
a.pipe(b);
b.pipe(c);
c.pipe(d);
```

下面是一个例子。

```javascript
var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('output.txt'));
```

上面代码采用链式写法，先读取文件，然后进行压缩，最后输出。

下面的写法模拟了Unix系统的cat命令，将标准输出写入标准输入。

```javascript
process.stdin.pipe(process.stdout);
```

当来源地的数据流读取完成，默认会调用目的地的end方法，就不再能够写入。对pipe方法传入第二个参数`{ end: false }`，可以让目的地的数据流保持打开。

```javascript
reader.pipe(writer, { end: false });
reader.on('end', function() {
  writer.end('Goodbye\n');
});
```

上面代码中，目的地数据流默认不会调用end方法，只能手动调用，因此“Goodbye”会被写入。

### unpipe()

该方法移除pipe方法指定的数据流目的地。如果没有参数，则移除所有的pipe方法目的地。如果有参数，则移除该参数指定的目的地。如果没有匹配参数的目的地，则不会产生任何效果。

```javascript
var readable = getReadableStreamSomehow();
var writable = fs.createWriteStream('file.txt');
readable.pipe(writable);
setTimeout(function() {
  console.log('停止写入file.txt');
  readable.unpipe(writable);
  console.log('手动关闭file.txt的写入数据流');
  writable.end();
}, 1000);
```

上面代码写入file.txt的时间，只有1秒钟，然后就停止写入。

### 事件

（1）readable

readable事件在数据流能够向外提供数据时触发。

```javascript
var readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // there is some data to read now
});
```

下面是一个例子。

```javascript
process.stdin.on('readable', function () {
  var buf = process.stdin.read();
  console.dir(buf);
});
```

上面代码将标准输入的数据读出。

read方法接受一个整数作为参数，表示以多少个字节为单位进行读取。

```javascript
process.stdin.on('readable', function () {
    var buf = process.stdin.read(3);
    console.dir(buf);
});
```

上面代码将以3个字节为单位进行输出内容。

（2）data

对于那些没有显式暂停的数据流，添加data事件监听函数，会将数据流切换到流动态，尽快向外提供数据。

```javascript
var readable = getReadableStreamSomehow();
readable.on('data', function(chunk) {
  console.log('got %d bytes of data', chunk.length);
});
```

（3）end

无法再读取到数据时，会触发end事件。也就是说，只有当前数据被完全读取完，才会触发end事件，比如不停地调用read方法。

```javascript
var readable = getReadableStreamSomehow();
readable.on('data', function(chunk) {
  console.log('got %d bytes of data', chunk.length);
});
readable.on('end', function() {
  console.log('there will be no more data.');
});
```

（4）close

数据源关闭时，close事件被触发。并不是所有的数据流都支持这个事件。

（5）error

当读取数据发生错误时，error事件被触发。

## 可写数据流

“可写数据流”允许你将数据写入某个目的地。它是数据写入的一种抽象，不同的数据目的地部署了这个接口以后，就可以用统一的方法写入。

以下是部署了可写数据流的一些场合。

- 客户端的http requests
- 服务器的http responses
- fs write streams
- zlib streams
- crypto streams
- tcp sockets
- child process stdin
- process.stdout, process.stderr

下面是fs模块的可写数据流的例子。

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

### write()

write方法用于向“可写数据流”写入数据。它接受两个参数，一个是写入的内容，可以是字符串，也可以是一个stream对象（比如可读数据流），另一个是写入完成后的回调函数。

它返回一个布尔值，表示本次数据是否处理完成。如果返回true，就表示可以写入新的数据了。如果等待写入的数据被缓存了，就返回false。不过，在返回false的情况下，也可以继续传入新的数据等待写入。只是这时，新的数据不会真的写入，只会缓存在内存中。为了避免内存消耗，比较好的做法还是等待该方法返回true，然后再写入。

```javascript
var fs = require('fs');
var ws = fs.createWriteStream('message.txt');

ws.write('beep ');

setTimeout(function () {
    ws.end('boop\n');
}, 1000);
```

上面代码调用end方法，数据就不再写入了。

### cork()，uncork()

cork方法可以强制等待写入的数据进入缓存。当调用uncork方法或end方法时，缓存的数据就会吐出。

### setDefaultEncoding()

setDefaultEncoding方法用于将写入的数据编码成新的格式。它返回一个布尔值，表示编码是否成功，如果返回false就表示编码失败。

### end()

end方法用于终止“可写数据流”。该方法可以接受三个参数，全部都是可选参数。第一个参数是最后所要写入的数据，可以是字符串，也可以是stream对象；第二个参数是写入编码；第三个参数是一个回调函数，finish事件触发时，会调用这个回调函数。

```javascript
var file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
```

上面代码会在数据写入结束时，在尾部写入“world！”。

调用end方法之后，再写入数据会报错。

```javascript
var file = fs.createWriteStream('example.txt');
file.end('world!');
file.write('hello, '); // 报错
```

### 事件

（1）drain事件

`writable.write(chunk)`返回false以后，当缓存数据全部写入完成，可以继续写入时，会触发drain事件。

```javascript
function writeOneMillionTimes(writer, data, encoding, callback) {
  var i = 1000000;
  write();
  function write() {
    var ok = true;
    do {
      i -= 1;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
}
```

上面代码是一个写入100万次的例子，通过drain事件得到可以继续写入的通知。

（2）finish事件

调用end方法时，所有缓存的数据释放，触发finish事件。该事件的回调函数没有参数。

```javascript
var writer = getWritableStreamSomehow();
for (var i = 0; i < 100; i ++) {
  writer.write('hello, #' + i + '!\n');
}
writer.end('this is the end\n');
writer.on('finish', function() {
  console.error('all writes are now complete.');
});
```

（3）pipe事件

“可写数据流”调用pipe方法，将数据流导向写入目的地时，触发该事件。

该事件的回调函数，接受发出该事件的“可读数据流”对象作为参数。

```javascript
var writer = getWritableStreamSomehow();
var reader = getReadableStreamSomehow();
writer.on('pipe', function(src) {
  console.error('something is piping into the writer');
  assert.equal(src, reader);
});
reader.pipe(writer);
```

（4）unpipe事件

“可读数据流”调用unpipe方法，将可写数据流移出写入目的地时，触发该事件。

该事件的回调函数，接受发出该事件的“可读数据流”对象作为参数。

```javascript
var writer = getWritableStreamSomehow();
var reader = getReadableStreamSomehow();
writer.on('unpipe', function(src) {
  console.error('something has stopped piping into the writer');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

（5）error事件

如果写入数据或pipe数据时发生错误，就会触发该事件。

该事件的回调函数，接受一个Error对象作为参数。

## HTTP请求

HTTP对象使用Stream接口，实现网络数据的读写。

```javascript
var http = require('http');

var server = http.createServer(function (req, res) {
  // req is an http.IncomingMessage, which is a Readable Stream
  // res is an http.ServerResponse, which is a Writable Stream

  var body = '';
  // we want to get the data as utf8 strings
  // If you don't set an encoding, then you'll get Buffer objects
  req.setEncoding('utf8');

  // Readable streams emit 'data' events once a listener is added
  req.on('data', function (chunk) {
    body += chunk;
  });

  // the end event tells you that you have entire body
  req.on('end', function () {
    try {
      var data = JSON.parse(body);
    } catch (er) {
      // uh oh!  bad json!
      res.statusCode = 400;
      return res.end('error: ' + er.message);
    }

    // write back something interesting to the user:
    res.write(typeof data);
    res.end();
  });
});

server.listen(1337);

// $ curl localhost:1337 -d '{}'
// object
// $ curl localhost:1337 -d '"foo"'
// string
// $ curl localhost:1337 -d 'not json'
// error: Unexpected token o
```

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
