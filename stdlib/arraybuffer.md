---
title: 类型化数组
category: stdlib
layout: page
date: 2013-09-07
modifiedOn: 2013-09-07
---

随着二进制数据引入JavaScript，迫切需要一种方便的方法，对JavaScript的二进制数据进行操作。ArrayBuffer对象就是在这种背景下诞生的，它很像C语言的数组，划出一块连续的内存区域，允许根据数组下标，对内存进行读写。

## 分配内存

ArrayBuffer对象用来分配一段连续的内存区域，存放数据。

{% highlight javascript %}

var buf = new ArrayBuffer(32);

{% endhighlight %}

上面代码生成了一段32字节的内存区域。

ArrayBuffer对象的byteLength属性，返回它的字节长度。

{% highlight javascript %}

var buffer = new ArrayBuffer(32);
buffer.byteLength
// 32

{% endhighlight %}

如果要分配的内存区域很大，有可能分配失败（因为没有那么多的连续空余内存），所以有必要检查是否分配成功。

{% highlight javascript %}

if (buffer.byteLength === n) {
  // 成功
} else {
  // 失败
}

{% endhighlight %}

ArrayBuffer对象不允许直接读写内存，只允许通过视图读写。

## 视图

### 视图的生成

ArrayBuffer可以存放多种类型的数据，不同数据有不同的解读方式，这就叫做“视图”。目前，JavaScript提供以下类型的视图：

- Int8Array：8位有符号整数，长度1个字节。
- Uint8Array：8位无符号整数，长度1个字节。
- Int16Array：16位有符号整数，长度2个字节。
- Uint16Array：16位无符号整数，长度2个字节。
- Int32Array：32位有符号整数，长度4个字节。
- Uint32Array：32位无符号整数，长度4个字节。
- Float32Array：32位浮点数，长度4个字节。
- Float64Array：64位浮点数，长度8个字节。

上面的每一种视图都是一个构造函数，可以用以下几种方法生成视图：

（1）在ArrayBuffer对象之上生成视图。

同一个ArrayBuffer对象之上，可以根据不同的数据类型，建立多个视图。

{% highlight javascript %}

// 创建一个8字节的ArrayBuffer
var b = new ArrayBuffer(8);

// 创建一个指向b的Int32视图，开始于字节0，直到缓冲区的末尾
var v1 = new Int32Array(b);

// 创建一个指向b的Uint8视图，开始于字节2，直到缓冲区的末尾
var v2 = new Uint8Array(b, 2);

// 创建一个指向b的Int16视图，开始于字节2，长度为2
var v3 = new Int16Array(b, 2, 2);

{% endhighlight %}

（2）直接生成。

{% highlight javascript %}

var f64a = new Float64Array(8);
f64a[0] = 10;
f64a[1] = 20;
f64a[2] = f64a[0] + f64a[1];

{% endhighlight %}

上面代码新生成一个8个成员的Float64Array数组（共64字节），然后依次对每个成员赋值。可以看到，赋值操作与普通数组的操作毫无两样。

（3）将普通数组转为视图数组。

{% highlight javascript %}

var typedArray = new Uint8Array( [ 1, 2, 3, 4 ] );

{% endhighlight %}

视图数组也可以转换为普通数组。

{% highlight javascript %}

var normalArray = Array.apply( [], typedArray );

{% endhighlight %}

###  视图的操作

建立了视图以后，就可以对ArrayBuffer进行各种操作了。

（1）赋值

{% highlight javascript %}

var buffer = new ArrayBuffer(16);

var int32View = new Int32Array(buffer);

for (var i=0; i<int32View.length; i++) {
  int32View[i] = i*2;
}

{% endhighlight %}

上面代码生成一个16字节的ArrayBuffer对象，然后在它的基础上，建立了一个32位整数的视图。由于每个32位整数占据4个字节，所以一共可以写入4个整数，依次为0，2，4，6。

如果在这段数据上接着建立一个16位整数的视图，则可以读出完全不一样的结果。

{% highlight javascript %}

var int16View = new Int16Array(buffer);

for (var i=0; i<int16View.length; i++) {
  console.log("Entry " + i + ": " + int16View[i]);
}
// Entry 0: 0
// Entry 1: 0
// Entry 2: 2
// Entry 3: 0
// Entry 4: 4
// Entry 5: 0
// Entry 6: 6
// Entry 7: 0

{% endhighlight %}

由于每个16位整数占据2个字节，所以整个ArrayBuffer对象现在分成8段。然后，由于x86体系的计算机都采用小端字节序（little endian），低位字节排在前面的内存地址，高位字节排在后面的内存地址，所以就得到了上面的结果。

从这个例子可以看到，ArrayBuffer对象本质上就是数组，但是它直接根据内存地址操作数据，速度比一般数组快得多。

（2）buffer属性

视图对象的buffer属性，返回整段内存区域对应的ArrayBuffer对象。该属性为只读属性。

{% highlight javascript %}

var a = new Float32Array(64);
var b = new Uint8Array(a.buffer);

{% endhighlight %}

上面代码的a对象和b对象，对应同一个ArrayBuffer对象，即同一段内存。

（3）set方法

set方法用于复制视图对象，也就是将一段内容完全复制到另一段内存。

{% highlight javascript %}

var a = new Uint8Array(8);
var b = new Uint8Array(8);

b.set(a);

{% endhighlight %}

上面代码复制a数组的内容到b数组。

### 复合视图

每个视图构造函数都可以接收三个参数，分别是：

- 对应的ArrayBuffer对象
- 起始的字节序号（从0开始）
- 生成的对应数据类型的个数

有了这三个参数，就可以在同一个ArrayBuffer之中，建立复合的多个数据类型的视图。

{% highlight javascript %}

var buffer = new ArrayBuffer(24);

var idView = new Uint32Array(buffer, 0, 1);
var usernameView = new Uint8Array(buffer, 4, 16);
var amountDueView = new Float32Array(buffer, 20, 1);

{% endhighlight %}

上面代码将一个24字节长度的ArrayBuffer对象，分成三个部分：

- 字节0到字节3：1个32位无符号整数
- 字节4到字节19：16个8位整数
- 字节20到字节23：1个32位浮点数

这种数据结构可以用如下的C语言描述：

{% highlight c %}

struct someStruct {
  unsigned long id;
  char username[16];
  float amountDue;
};

{% endhighlight %}

## DataView对象

如果一段内存区域包含多种类型的数据，这时除了建立复合视图以外，还可以通过dataview对象进行操作。

{% highlight javascript %}

var buffer = new ArrayBuffer(24);

var dv = new DataView(buffer);

{% endhighlight %}

DataView对象提供以下方法读取内存：

- getInt8：读取1个字节，返回一个8位整数。
- getUint8：读取1个字节，返回一个无符号的8位整数。
- getInt16：读取2个字节，返回一个16位整数。
- getUint16：读取2个字节，返回一个无符号的16位整数。
- getInt32：读取4个字节，返回一个32位整数。
- getUint32：读取4个字节，返回一个无符号的32位整数。
- getFloat32：读取4个字节，返回一个32位浮点数。
- getFloat64：读取8个字节，返回一个64位浮点数。

这一系列get方法的参数都是一个字节序号，表示从哪个字节开始读取。

{% highlight javascript %}

var buffer = new ArrayBuffer(24);
var dv = new DataView(buffer);

// 从第1个字节读取一个8位无符号整数
var v1 = dv.getUint8(0);

// 从第2个字节读取一个16位无符号整数
var v2 = dv.getUint16(1); 

// 从第4个字节读取一个16位无符号整数
var v3 = dv.getUint16(3);

{% endhighlight %}

上面代码读取了ArrayBuffer对象的前5个字节，其中有一个8位整数和两个十六位整数。

如果一次读取两个或两个以上字节，就必须明确数据的存储方式，到底是小端字节序还是大端字节序。默认情况下，DataView的get方法使用大端字节序解读数据，如果需要使用小端字节序解读，必须在get方法的第二个参数指定true。

{% highlight javascript %}

var v1 = dv.getUint16(1, true);
var v2 = dv.getUint16(3, true);

{% endhighlight %}

DataView对象提供以下方法写入内存：

- setInt8：写入1个字节的8位整数。
- setUint8：写入1个字节的8位无符号整数。
- setInt16：写入2个字节的16位整数。
- setUint16：写入2个字节的16位无符号整数。
- setInt32：写入4个字节的32位整数。
- setUint32：写入4个字节的32位无符号整数。
- setFloat32：写入4个字节的32位浮点数。
- setFloat64：写入8个字节的64位浮点数。

这一系列set方法，接受两个参数，第一个参数是字节序号，表示从哪个字节开始写入，第二个参数为写入的数据。对于那些写入两个或两个以上字节的方法，需要指定第三个参数，false或者undefined表示使用大端字节序写入，true表示使用小端字节序写入。

{% highlight javascript %}

// 在第1个字节，以大端字节序写入值为25的32位整数
dv.setInt32(0, 25, false); 

// 在第5个字节，以大端字节序写入值为25的32位整数
dv.setInt32(4, 25); 

// 在第9个字节，以小端字节序写入值为2.5的32位浮点数
dv.setFloat32(8, 2.5, true); 

{% endhighlight %}

如果不确定正在使用的计算机的字节序，可以采用下面的判断方式。

{% highlight javascript %}

var littleEndian = (function() {
  var buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
})();

{% endhighlight %}

如果返回true，就是小端字节序；如果返回false，就是大端字节序。

## 应用

### Ajax

传统上，服务器通过Ajax操作只能返回文本数据。XMLHttpRequest 第二版允许服务器返回二进制数据，这时分成两种情况。如果明确知道返回的二进制数据类型，可以把返回类型（responseType）设为arraybuffer；如果不知道，就设为blob。

{% highlight javascript %}

xhr.responseType = 'arraybuffer';

{% endhighlight %}

如果知道传回来的是32位整数，可以像下面这样处理。

{% highlight javascript %}

xhr.onreadystatechange = function () {
if (req.readyState === 4 ) {
    var arrayResponse = xhr.response;
    var dataView = new DataView(arrayResponse);
    var ints = new Uint32Array(dataView.byteLength / 4);

    xhrDiv.style.backgroundColor = "#00FF00";
    xhrDiv.innerText = "Array is " + ints.length + "uints long";
    }
}

{% endhighlight %}

### Canvas

网页Canvas元素输出的二进制像素数据，就是类型化数组。

{% highlight javascript %}

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var imageData = ctx.getImageData(0,0, 200, 100);
var typedArray = imageData.data;

{% endhighlight %}

需要注意的是，上面代码的typedArray虽然是一个类型化数组，但是它的视图类型是一种针对Canvas元素的专有类型Uint8ClampedArray。这个视图类型的特点，就是专门针对颜色，把每个字节解读为无符号的8位整数，即只能取值0～255，而且发生运算的时候自动过滤高位溢出。这为图像处理带来了巨大的方便。

举例来说，如果把像素的颜色值设为Uint8Array类型，那么乘以一个gamma值的时候，就必须这样计算：

{% highlight javascript %}

u8[i] = Math.min(255, Math.max(0, u8[i] * gamma));

{% endhighlight %}

这样做很麻烦，而且影响性能。将颜色值设为Uint8ClampedArray类型，计算就简化许多。

{% highlight javascript %}

pixels[i] *= gamma;

{% endhighlight %}

Uint8ClampedArray类型确保将小于0的值设为0，将大于255的值设为255。

### File

如果知道一个文件的二进制数据类型，也可以将这个文件读取为类型化数组。

{% highlight javascript %}

reader.readAsArrayBuffer(file);

{% endhighlight %}

## 参考链接

- Ilmari Heikkinen, [Typed Arrays: Binary Data in the Browser](http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/)
