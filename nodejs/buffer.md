---
title: Buffer对象
layout: page
category: nodejs
date: 2015-06-07
modifiedOn: 2015-06-07
---

## 概述

`Buffer`对象是Node处理二进制数据的一个接口。它是Node原生提供的全局对象，可以直接使用，不需要`require('buffer')`。

JavaScript比较擅长处理字符串，对于处理二进制数据（比如TCP数据流），就不太擅长。`Buffer`对象就是为了解决这个问题而设计的。它是一个构造函数，生成的实例代表了V8引擎分配的一段内存，是一个类似数组的对象，成员都为0到255的整数值，即一个8位的字节。

```javascript
// 生成一个256字节的Buffer实例
var bytes = new Buffer(256);

// 遍历每个字节，写入内容
for (var i = 0; i < bytes.length; i++) {
  bytes[i] = i;
}

// 生成一个buffer的view
// 从240字节到256字节
var end = bytes.slice(240, 256);

end[0] // 240
end[0] = 0;
end[0] // 0
```

上面代码演示了如何生成`Buffer`对象实例，以及它的赋值和取值。

除了直接赋值，`Buffer`实例还可以拷贝生成。

```javascript
var bytes = new Buffer(8);

for (var i = 0; i < bytes.length; i++) {
  bytes[i] = i;
}

var more = new Buffer(4);
bytes.copy(more, 0, 4, 8);
more[0] // 4
```

上面代码中，`copy`方法将`bytes`实例的4号成员到7号成员的这一段，都拷贝到了`more`实例从0号成员开始的区域。

`Buffer`对象与字符串的互相转换，需要指定编码格式。目前，Buffer对象支持以下编码格式。

- ascii
- utf8
- utf16le：UTF-16的小端编码，支持大于U+10000的四字节字符。
- ucs2：utf16le的别名。
- base64
- hex：将每个字节转为两个十六进制字符。

## 与二进制数组的关系

`TypedArray`构造函数可以接受`Buffer`实例作为参数，生成一个二进制数组。比如，`new Uint32Array(new Buffer([1, 2, 3, 4]))`，生成一个4个成员的二进制数组。注意，新数组的成员有四个，而不是只有单个成员（`[0x1020304]`或者`[0x4030201]`）。另外，这时二进制数组所对应的内存是从Buffer对象拷贝的，而不是共享的。二进制数组的`buffer`属性，保留指向原Buffer对象的指针。

二进制数组的操作，与Buffer对象的操作基本上是兼容的，只有轻微的差异。比如，二进制数组的`slice`方法返回原内存的拷贝，而Buffer对象的`slice`方法创造原内存的一个视图（view）。

## Buffer构造函数

`Buffer`作为构造函数，可以用`new`命令生成一个实例，它可以接受多种形式的参数。

```javascript
// 参数是整数，指定分配多少个字节内存
var hello = new Buffer(5);

// 参数是数组，数组成员必须是整数值
var hello = new Buffer([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
hello.toString() // 'Hello'

// 参数是字符串（默认为utf8编码）
var hello = new Buffer('Hello');
hello.length // 5
hello.toString() // "Hello"

// 参数是字符串（不省略编码）
var hello = new Buffer('Hello', 'utf8');

// 参数是另一个Buffer实例，等同于拷贝后者
var hello1 = new Buffer('Hello');
var hello2 = new Buffer(hello1);
```

下面是读取用户命令行输入的例子。

```javascript
var fs = require('fs');
var buffer = new Buffer(1024);

var readSize = fs.readSync(fs.openSync('/dev/tty', 'r'), buffer, 0, bufferSize);
var chunk = buffer.toString('utf8', 0, readSize);

console.log('INPUT: ' + chunk);
```

运行上面的程序结果如下。

```bash
# 输入任意内容，然后按回车键
foo
INPUT: foo
```

## 类的方法

### Buffer.isEncoding()

Buffer.isEncoding方法返回一个布尔值，表示Buffer实例是否为指定编码。

```javascript
Buffer.isEncoding('utf8')
// true
```

### Buffer.isBuffer()

Buffer.isBuffer方法接受一个对象作为参数，返回一个布尔值，表示该对象是否为Buffer实例。

```javascript
Buffer.isBuffer(Date) // false
```

### Buffer.byteLength()

Buffer.byteLength方法返回字符串实际占据的字节长度，默认编码方式为utf8。

```javascript
Buffer.byteLength('Hello', 'utf8') // 5
```

### Buffer.concat()

Buffer.concat方法将一组Buffer对象合并为一个Buffer对象。

```javascript
var i1 = new Buffer('Hello');
var i2 = new Buffer(' ');
var i3 = new Buffer('World');
Buffer.concat([i1, i2, i3]).toString()
// 'Hello World'
```

需要注意的是，如果Buffer.concat的参数数组只有一个成员，就直接返回该成员。如果有多个成员，就返回一个多个成员合并的新Buffer对象。

Buffer.concat方法还可以接受第二个参数，指定合并后Buffer对象的总长度。

```javascript
var i1 = new Buffer('Hello');
var i2 = new Buffer(' ');
var i3 = new Buffer('World');
Buffer.concat([i1, i2, i3], 10).toString()
// 'Hello Worl'
```

省略第二个参数时，Node内部会计算出这个值，然后再据此进行合并运算。因此，显式提供这个参数，能提供运行速度。

## 实例属性

### length

length属性返回Buffer对象所占据的内存长度。注意，这个值与Buffer对象的内容无关。

```javascript
buf = new Buffer(1234);
buf.length // 1234

buf.write("some string", 0, "ascii");
buf.length // 1234
```

上面代码中，不管写入什么内容，length属性总是返回Buffer对象的空间长度。如果想知道一个字符串所占据的字节长度，可以将其传入Buffer.byteLength方法。

length属性是可写的，但是这会导致未定义的行为，不建议使用。如果想修改Buffer对象的长度，建议使用slice方法返回一个新的Buffer对象。

## 实例方法

### write()

`write`方法可以向指定的Buffer对象写入数据。它的第一个参数是所写入的内容，第二个参数（可省略）是所写入的起始位置（默认从0开始），第三个参数（可省略）是编码方式，默认为`utf8`。

```javascript
var buf = new Buffer(5);
buf.write('He');
buf.write('l', 2);
buf.write('lo', 3);
console.log(buf.toString());
// "Hello"
```

### slice()

slice方法返回一个按照指定位置、从原对象切割出来的Buffer实例。它的两个参数分别为切割的起始位置和终止位置。

```javascript
var buf = new Buffer('just some data');
var chunk = buf.slice(5, 9);
chunk.toString()
// "some"
```

### toString()

`toString`方法将Buffer实例，按照指定编码（默认为`utf8`）转为字符串。

```javascript
var hello = new Buffer('Hello');
hello // <Buffer 48 65 6c 6c 6f>
hello.toString() // "Hello"
```

`toString`方法可以只返回指定位置内存的内容，它的第二个参数表示起始位置，第三个参数表示终止位置，两者都是从0开始计算。

```javascript
var buf = new Buffer('just some data');
console.log(buf.toString('ascii', 5, 9));
// "some"
```

### toJSON()

toJSON方法将Buffer实例转为JSON对象。如果JSON.stringify方法调用Buffer实例，默认会先调用toJSON方法。

```javascript
var buf = new Buffer('test');
var json = JSON.stringify(buf);
json // '[116,101,115,116]'

var copy = new Buffer(JSON.parse(json));
copy // <Buffer 74 65 73 74>
```
