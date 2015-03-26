---
title: fs 模块
layout: page
category: nodejs
date: 2015-02-08
modifiedOn: 2015-02-08
---

fs是filesystem的缩写，该模块提供本地文件的读写能力，基本上是POSIX文件操作命令的简单包装。但是，这个模块几乎对所有操作提供异步和同步两种操作方式，供开发者选择。

## readFileSync()

readFileSync方法用于同步读取文件，返回一个字符串。

```javascript

var text = fs.readFileSync(fileName, "utf8");

// 将文件按行拆成数组
text.split(/\r?\n/).forEach(function (line) {
  // ...
});

```

该方法的第一个参数是文件路径，第二个参数是文本文件编码，默认为utf8。

不同系统的行结尾字符不同，可以用下面的方法判断。

```javascript

// 方法一，查询现有的行结尾字符
var EOL = fileContents.indexOf("\r\n") >= 0 ? "\r\n" : "\n";

// 方法二，根据当前系统处理
var EOL = (process.platform === 'win32' ? '\r\n' : '\n')

```

## writeFileSync()

writeFileSync方法用于同步写入文件。

```

fs.writeFileSync(fileName, str, 'utf8');

```

它的第一个参数是文件路径，第二个参数是写入文件的字符串，第三个参数是文件编码，默认为utf8。

## exists(path, callback)

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

## mkdir()，writeFile()，readfile()

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

readFile方法是异步操作，所以必须小心，不要同时发起多个readFile请求。

```js
for(var i = 1; i <= 1000; i++) {
  fs.readFile('./'+i+'.txt', function() {
     // do something with the file
  });
}
```

上面代码会同时发起1000个readFile异步请求，很快就会耗尽系统资源。

## mkdirSync()，writeFileSync()，readFileSync()

这三个方法是建立目录、写入文件、读取文件的同步版本。

{% highlight javascript %}

fs.mkdirSync('./helloDirSync',0777);
fs.writeFileSync('./helloDirSync/message.txt', 'Hello Node');
var data = fs.readFileSync('./helloDirSync/message.txt','UTF-8');
console.log('file created with contents:');
console.log(data);

{% endhighlight %}

对于流量较大的服务器，最好还是采用异步操作，因为同步操作时，只有前一个操作结束，才会开始后一个操作，如果某个操作特别耗时（常常发生在读写数据时），会导致整个程序停顿。

## readdir()

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

## stat()

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

## watchfile()，unwatchfile()

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

## createReadStream()

createReadStream方法往往用于打开大型的文本文件，创建一个读取操作的数据流。所谓大型文本文件，指的是文本文件的体积很大，读取操作的缓存装不下，只能分成几次发送，每次发送会触发一个data事件，发送结束会触发end事件。

```javascript

var fs = require('fs');

function readLines(input, func) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    var last  = 0;
    while (index > -1) {
      var line = remaining.substring(last, index);
      last = index + 1;
      func(line);
      index = remaining.indexOf('\n', last);
    }

    remaining = remaining.substring(last);
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
  });
}

function func(data) {
  console.log('Line: ' + data);
}

var input = fs.createReadStream('lines.txt');
readLines(input, func);

```

## createWriteStream()

createWriteStream方法创建一个写入数据流对象，该对象的write方法用于写入数据，end方法用于结束写入操作。

```javascript

var out = fs.createWriteStream(fileName, { encoding: "utf8" });
out.write(str);
out.end();

```
