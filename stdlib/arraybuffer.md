---
title: ArrayBuffer：类型化数组
category: stdlib
layout: page
date: 2013-09-07
modifiedOn: 2013-09-28
---

类型化数组是JavaScript操作二进制数据的一个接口。

这要从WebGL项目的诞生说起，所谓WebGL，就是指浏览器与显卡之间的通信接口，为了满足JavaScript与显卡之间大量的、实时的数据交换，它们之间的数据通信必须是二进制的，而不能是传统的文本格式。

比如，以文本格式传递一个32位整数，两端的JavaScript脚本与显卡都要进行格式转化，将非常耗时。这时要是存在一种机制，可以像C语言那样，直接操作字节，然后将4个字节的32位整数，以二进制形式原封不动地送入显卡，脚本的性能就会大幅提升。

类型化数组（Typed Array）就是在这种背景下诞生的。它很像C语言的数组，允许开发者以数组下标的形式，直接操作内存。有了类型化数组以后，JavaScript的二进制数据处理功能增强了很多，接口之间完全可以用二进制数据通信。

## 分配内存

类型化数组是建立在ArrayBuffer对象的基础上的。它的作用是，分配一段可以存放数据的连续内存区域。

{% highlight javascript %}

var buf = new ArrayBuffer(32);

{% endhighlight %}

上面代码生成了一段32字节的内存区域。

ArrayBuffer对象的**byteLength属性**，返回所分配的内存区域的字节长度。

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

ArrayBuffer对象有一个**slice方法**，允许将内存区域的一部分，拷贝生成一个新的ArrayBuffer对象。

{% highlight javascript %}

var buffer = new ArrayBuffer(8);
var newBuffer = buffer.slice(0,3);

{% endhighlight %}

上面代码拷贝buffer对象的前3个字节，生成一个新的ArrayBuffer对象。slice方法其实包含两步，第一步是先分配一段新内存，第二步是将原来那个ArrayBuffer对象拷贝过去。

slice方法接受两个参数，第一个参数表示拷贝开始的字节序号，第二个参数表示拷贝截止的字节序号。如果省略第二个参数，则默认到原ArrayBuffer对象的结尾。

除了slice方法，ArrayBuffer对象不提供任何直接读写内存的方法，只允许在其上方建立视图，然后通过视图读写。

## 视图

### 视图的生成

ArrayBuffer作为内存区域，可以存放多种类型的数据。不同数据有不同的存储方式，这就叫做“视图”。目前，JavaScript提供以下类型的视图：

- **Int8Array**：8位有符号整数，长度1个字节。
- **Uint8Array**：8位无符号整数，长度1个字节。
- **Int16Array**：16位有符号整数，长度2个字节。
- **Uint16Array**：16位无符号整数，长度2个字节。
- **Int32Array**：32位有符号整数，长度4个字节。
- **Uint32Array**：32位无符号整数，长度4个字节。
- **Float32Array**：32位浮点数，长度4个字节。
- **Float64Array**：64位浮点数，长度8个字节。

每一种视图都有一个BYTES_PER_ELEMENT常数，表示这种数据类型占据的字节数。

{% highlight javascript %}

Int8Array.BYTES_PER_ELEMENT // 1
Uint8Array.BYTES_PER_ELEMENT // 1
Int16Array.BYTES_PER_ELEMENT // 2
Uint16Array.BYTES_PER_ELEMENT // 2
Int32Array.BYTES_PER_ELEMENT // 4
Uint32Array.BYTES_PER_ELEMENT // 4
Float32Array.BYTES_PER_ELEMENT // 4
Float64Array.BYTES_PER_ELEMENT // 8

{% endhighlight %}

每一种视图都是一个构造函数，有多种方法可以生成：

**（1）在ArrayBuffer对象之上生成视图。**

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

上面代码在一段长度为8个字节的内存（b）之上，生成了三个视图：v1、v2和v3。视图的构造函数可以接受三个参数：

- 第一个参数：视图对应的底层ArrayBuffer对象，该参数是必需的。
- 第二个参数：视图开始的字节序号，默认从0开始。
- 第三个参数：视图包含的数据个数，默认直到本段内存区域结束。

因此，v1、v2和v3是重叠：v1[0]是一个32位整数，指向字节0～字节3；v2[0]是一个8位无符号整数，指向字节2；v3[0]是一个16位整数，指向字节2～字节3。只要任何一个视图对内存有所修改，就会在另外两个视图上反应出来。

**（2）直接生成。**

视图还可以不通过ArrayBuffer对象，直接分配内存而生成。

{% highlight javascript %}

var f64a = new Float64Array(8);
f64a[0] = 10;
f64a[1] = 20;
f64a[2] = f64a[0] + f64a[1];

{% endhighlight %}

上面代码生成一个8个成员的Float64Array数组（共64字节），然后依次对每个成员赋值。这时，视图构造函数的参数就是成员的个数。可以看到，视图数组的赋值操作与普通数组的操作毫无两样。

**（3）将普通数组转为视图数组。**

将一个数据类型符合要求的普通数组，传入构造函数，也能直接生成视图。

{% highlight javascript %}

var typedArray = new Uint8Array( [ 1, 2, 3, 4 ] );

{% endhighlight %}

上面代码将一个普通的数组，赋值给一个新生成的8位无符号整数的视图数组。

视图数组也可以转换回普通数组。

{% highlight javascript %}

var normalArray = Array.apply( [], typedArray );

{% endhighlight %}

###  视图的操作

建立了视图以后，就可以进行各种操作了。这里需要明确的是，视图其实就是普通数组，语法完全没有什么不同，只不过它直接针对内存进行操作，而且每个成员都有确定的数据类型。所以，视图就被叫做“类型化数组”。

**（1）数组操作**

普通数组的操作方法和属性，对类型化数组完全适用。

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

由于每个16位整数占据2个字节，所以整个ArrayBuffer对象现在分成8段。然后，由于x86体系的计算机都采用小端字节序（little endian），相对重要的字节排在后面的内存地址，相对不重要字节排在前面的内存地址，所以就得到了上面的结果。

比如，一个占据四个字节的16进制数0x12345678，决定其大小的最重要的字节是“12”，最不重要的是“78”。小端字节序将最不重要的字节排在前面，储存顺序就是78563412；大端字节序则完全相反，将最重要的字节排在前面，储存顺序就是12345678。目前，所有个人电脑几乎都是小端字节序，所以类型化数组内部也采用小端字节序读写数据，或者更准确的说，按照本机操作系统设定的字节序读写数据。

这并不意味大端字节序不重要，事实上，很多网络设备和特定的操作系统采用的是大端字节序。这就带来一个严重的问题：如果一段数据是大端字节序，类型化数组将无法正确解析，因为它只能处理小端字节序！为了解决这个问题，JavaScript引入DataView对象，可以设定字节序，下文会详细介绍。

下面是另一个例子。

```javascript

// 假定某段buffer包含如下字节 [0x02, 0x01, 0x03, 0x07]
// 计算机采用小端字节序
var uInt16View = new Uint16Array(buffer);

// 比较运算 
if (bufView[0]===258) {
     console.log("ok");
}

// 赋值运算
uInt16View[0] = 255;    // 字节变为[0xFF, 0x00, 0x03, 0x07]
uInt16View[0] = 0xff05; // 字节变为[0x05, 0xFF, 0x03, 0x07]
uInt16View[1] = 0x0210; // 字节变为[0x05, 0xFF, 0x10, 0x02]

```

总之，与普通数组相比，类型化数组的最大优点就是可以直接操作内存，不需要数据类型转换，所以速度快得多。

**（2）buffer属性**

类型化数组的buffer属性，返回整段内存区域对应的ArrayBuffer对象。该属性为只读属性。

{% highlight javascript %}

var a = new Float32Array(64);
var b = new Uint8Array(a.buffer);

{% endhighlight %}

上面代码的a对象和b对象，对应同一个ArrayBuffer对象，即同一段内存。

**（3）byteLength属性和byteOffset属性**

byteLength属性返回类型化数组占据的内存长度，单位为字节。byteOffset属性返回类型化数组从底层ArrayBuffer对象的哪个字节开始。这两个属性都是只读属性。

{% highlight javascript %}

var b = new ArrayBuffer(8);

var v1 = new Int32Array(b);
var v2 = new Uint8Array(b, 2);
var v3 = new Int16Array(b, 2, 2);

v1.byteLength // 8
v2.byteLength // 6
v3.byteLength // 4

v1.byteOffset // 0
v2.byteOffset // 2
v3.byteOffset // 2

{% endhighlight %}

注意将byteLength属性和length属性区分，前者是字节长度，后者是成员长度。

{% highlight javascript %}

var a = new Int16Array(8);

a.length // 8
a.byteLength // 16

{% endhighlight %}

**（4）set方法**

类型化数组的set方法用于复制数组，也就是将一段内容完全复制到另一段内存。

{% highlight javascript %}

var a = new Uint8Array(8);
var b = new Uint8Array(8);

b.set(a);

{% endhighlight %}

上面代码复制a数组的内容到b数组，它是整段内存的复制，比一个个拷贝成员的那种复制快得多。set方法还可以接受第二个参数，表示从b对象哪一个成员开始复制a对象。

{% highlight javascript %}

var a = new Uint16Array(8);
var b = new Uint16Array(10);

b.set(a,2)

{% endhighlight %}

上面代码的b数组比a数组多两个成员，所以从b[2]开始复制。

**（5）subarray方法**

subarray方法是对于类型化数组的一部分，再建立一个新的视图。

{% highlight javascript %}

var a = new Uint16Array(8);
var b = a.subarray(2,3);

a.byteLength // 16
b.byteLength // 2

{% endhighlight %}

subarray方法的第一个参数是起始的成员序号，第二个参数是结束的成员序号（不含该成员），如果省略则包含剩余的全部成员。所以，上面代码的a.subarray(2,3)，意味着b只包含a[2]一个成员，字节长度为2。

**（6）ArrayBuffer与字符串的互相转换**

ArrayBuffer转为字符串，或者字符串转为ArrayBuffer，有一个前提，即字符串的编码方法是确定的。假定字符串采用UTF-16编码（JavaScript的内部编码方式），可以自己编写转换函数。

```javascript

// ArrayBuffer转为字符串，参数为ArrayBuffer对象
function ab2str(buf) {
   return String.fromCharCode.apply(null, new Uint16Array(buf));
}

// 字符串转为ArrayBuffer对象，参数为字符串
function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
         bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

```

### 复合视图

由于视图的构造函数可以指定起始位置和长度，所以在同一段内存之中，可以依次存放不同类型的数据，这叫做“复合视图”。

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

## DataView视图

如果一段数据包括多种类型（比如服务器传来的HTTP数据），这时除了建立ArrayBuffer对象的复合视图以外，还可以通过DataView视图进行操作。

DataView视图提供更多操作选项，而且支持设定字节序。本来，在设计目的上，ArrayBuffer对象的各种类型化视图，是用来向网卡、声卡之类的本机设备传送数据，所以使用本机的字节序就可以了；而DataView的设计目的，是用来处理网络设备传来的数据，所以大端字节序或小端字节序是可以自行设定的。

DataView本身也是构造函数，接受一个ArrayBuffer对象作为参数，生成视图。

{% highlight javascript %}

DataView(ArrayBuffer buffer [, 字节起始位置 [, 长度]]);

{% endhighlight %}

下面是一个实例。

{% highlight javascript %}

var buffer = new ArrayBuffer(24);

var dv = new DataView(buffer);

{% endhighlight %}

DataView视图提供以下方法读取内存：

- **getInt8**：读取1个字节，返回一个8位整数。
- **getUint8**：读取1个字节，返回一个无符号的8位整数。
- **getInt16**：读取2个字节，返回一个16位整数。
- **getUint16**：读取2个字节，返回一个无符号的16位整数。
- **getInt32**：读取4个字节，返回一个32位整数。
- **getUint32**：读取4个字节，返回一个无符号的32位整数。
- **getFloat32**：读取4个字节，返回一个32位浮点数。
- **getFloat64**：读取8个字节，返回一个64位浮点数。

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

// 小端字节序
var v1 = dv.getUint16(1, true);

// 大端字节序
var v2 = dv.getUint16(3, false);

// 大端字节序
var v3 = dv.getUint16(3);

{% endhighlight %}

DataView视图提供以下方法写入内存：

- **setInt8**：写入1个字节的8位整数。
- **setUint8**：写入1个字节的8位无符号整数。
- **setInt16**：写入2个字节的16位整数。
- **setUint16**：写入2个字节的16位无符号整数。
- **setInt32**：写入4个字节的32位整数。
- **setUint32**：写入4个字节的32位无符号整数。
- **setFloat32**：写入4个字节的32位浮点数。
- **setFloat64**：写入8个字节的64位浮点数。

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

因为Uint8Array类型对于大于255的运算结果（比如0xFF+1），会自动变为0x00，所以图像处理必须要像上面这样算。这样做很麻烦，而且影响性能。如果将颜色值设为Uint8ClampedArray类型，计算就简化许多。

{% highlight javascript %}

pixels[i] *= gamma;

{% endhighlight %}

Uint8ClampedArray类型确保将小于0的值设为0，将大于255的值设为255。注意，IE 10不支持该类型。

### File

如果知道一个文件的二进制数据类型，也可以将这个文件读取为类型化数组。

{% highlight javascript %}

reader.readAsArrayBuffer(file);

{% endhighlight %}

下面以处理bmp文件为例。假定file变量是一个指向bmp文件的文件对象，首先读取文件。

{% highlight javascript %}

var reader = new FileReader();
reader.addEventListener("load", processimage, false); 
reader.readAsArrayBuffer(file); 

{% endhighlight %}

然后，定义处理图像的回调函数：先在二进制数据之上建立一个DataView视图，再建立一个bitmap对象，用于存放处理后的数据，最后将图像展示在canvas元素之中。

{% highlight javascript %}

function processimage(e) { 
 var buffer = e.target.result; 
 var datav = new DataView(buffer); 
 var bitmap = {};
 // 具体的处理步骤
}

{% endhighlight %}

具体处理图像数据时，先处理bmp的文件头。具体每个文件头的格式和定义，请参阅有关资料。

{% highlight javascript %}

bitmap.fileheader = {}; 
bitmap.fileheader.bfType = datav.getUint16(0, true); 
bitmap.fileheader.bfSize = datav.getUint32(2, true); 
bitmap.fileheader.bfReserved1 = datav.getUint16(6, true); 
bitmap.fileheader.bfReserved2 = datav.getUint16(8, true); 
bitmap.fileheader.bfOffBits = datav.getUint32(10, true);

{% endhighlight %}

接着处理图像元信息部分。

{% highlight javascript %}

bitmap.infoheader = {};
bitmap.infoheader.biSize = datav.getUint32(14, true);
bitmap.infoheader.biWidth = datav.getUint32(18, true); 
bitmap.infoheader.biHeight = datav.getUint32(22, true); 
bitmap.infoheader.biPlanes = datav.getUint16(26, true); 
bitmap.infoheader.biBitCount = datav.getUint16(28, true); 
bitmap.infoheader.biCompression = datav.getUint32(30, true); 
bitmap.infoheader.biSizeImage = datav.getUint32(34, true); 
bitmap.infoheader.biXPelsPerMeter = datav.getUint32(38, true); 
bitmap.infoheader.biYPelsPerMeter = datav.getUint32(42, true); 
bitmap.infoheader.biClrUsed = datav.getUint32(46, true); 
bitmap.infoheader.biClrImportant = datav.getUint32(50, true);

{% endhighlight %}

最后处理图像本身的像素信息。

{% highlight javascript %}

var start = bitmap.fileheader.bfOffBits;
bitmap.pixels = new Uint8Array(buffer, start); 

{% endhighlight %}

至此，图像文件的数据全部处理完成。下一步，可以根据需要，进行图像变形，或者转换格式，或者展示在Canvas网页元素之中。

## 参考链接

- Ilmari Heikkinen, [Typed Arrays: Binary Data in the Browser](http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/)
- Khronos, [Typed Array Specification](http://www.khronos.org/registry/typedarray/specs/latest/)
- Ian Elliot, [Reading A BMP File In JavaScript](http://www.i-programmer.info/projects/36-web/6234-reading-a-bmp-file-in-javascript.html)	
- Renato Mangini, [How to convert ArrayBuffer to and from String](http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String) 
