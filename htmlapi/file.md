---
title: 文件和二进制数据的操作
date: 2012-11-30
layout: page
category: htmlapi
modifiedOn: 2013-09-04
---

除了文本数据，JavaScript还能操作二进制数据，Blob对象就是操作接口。

在Blob对象的基础上，又衍生出一系列相关的API。

- File对象：负责处理那些以文件形式存在的二进制数据，也就是操作本地文件；
- FileList对象：File对象的网页表单接口；
- FileReader对象：负责将二进制数据读入内存内容；
- URL对象：用于对二进制数据生成URL。

## Blob对象

Blob（Binary Large Object）对象代表了一段二进制数据，提供了一系列操作接口。其他操作二进制数据的API（比如File对象），都是建立在Blob对象基础上的，继承了它的属性和方法。

生成Blob对象有两种方法：一种是使用Blob构造函数，另一种是对现有的Blob对象使用slice方法切出一部分。

（1）Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型，这两个参数都不是必需的。

{% highlight javascript %}

var htmlParts = ["<a id=\"a\"><b id=\"b\">hey!<\/b><\/a>"];

var myBlob = new Blob(htmlParts, { "type" : "text\/xml" });

{% endhighlight %}

下面是一个利用Blob对象，生成可下载文件的例子。

{% highlight javascript %}

var blob = new Blob(["Hello World"]);

var a = document.createElement("a");
a.href = window.URL.createObjectURL(blob);
a.download = "hello-world.txt";
a.textContent = "Download Hello World!";

body.appendChild(a);

{% endhighlight %}

上面的代码生成了一个超级链接，点击后提示下载文本文件hello-world.txt，文件内容为“Hello World”。

（2）Blob对象的slice方法，将二进制数据按照字节分块，返回一个新的Blob对象。

{% highlight javascript %}

var newBlob = oldBlob.slice(startingByte, endindByte);

{% endhighlight %}

下面是一个使用XMLHttpRequest对象，将大文件分割上传的例子。

{% highlight javascript %}

function upload(blobOrFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };
  xhr.send(blobOrFile);
}

document.querySelector('input[type="file"]').addEventListener('change', function(e) {
  var blob = this.files[0];

  const BYTES_PER_CHUNK = 1024 * 1024; // 1MB chunk sizes.
  const SIZE = blob.size;

  var start = 0;
  var end = BYTES_PER_CHUNK;

  while(start < SIZE) {
    upload(blob.slice(start, end));

    start = end;
    end = start + BYTES_PER_CHUNK;
  }
}, false);

})();

{% endhighlight %}

（3）Blob对象有两个只读属性：

- size：二进制数据的大小，单位为字节。
- type：二进制数据的MIME类型，全部为小写，如果类型未知，则该值为空字符串。

在Ajax操作中，如果xhr.responseType设为blob，接收的就是二进制数据。

## ArrayBuffer对象

ArrayBuffer对象用来生成固定长度的二进制数据。

{% highlight javascript %}

var buf = new ArrayBuffer(32);

{% endhighlight %}

上面代码生成了一段32字节长度的存放二进制数据的区域。

ArrayBuffer对象的byteLength属性，返回它的字节长度。

{% highlight javascript %}

var buf = new ArrayBuffer(32);
buf.byteLength
// 32

{% endhighlight %}

如果要生成的ArrayBuffer对象长度很长，有可能生成失败（因为没有那么长的连续空余内存），所以有必要检查是否生成成功。

{% highlight javascript %}

if (buffer.byteLength === n) {
  // 生成成功
} else {
  // 生成失败
}

{% endhighlight %}

ArrayBuffer可以存放多种类型的数据，不同数据有不同的解读方式，这就叫做“视图”。目前，JavaScript提供以下类型的视图：

- Int8Array：8位有符号整数，长度1个字节。
- Uint8Array：8位无符号整数，长度1个字节。
- Int16Array：16位有符号整数，长度2个字节。
- Uint16Array：16位无符号整数，长度2个字节。
- Int32Array：32位有符号整数，长度4个字节。
- Uint32Array：32位无符号整数，长度4个字节。
- Float32Array：32位浮点数，长度4个字节。
- Float64Array：64位浮点数，长度8个字节。

上面的每一种视图都是一个构造函数，操作ArrayBuffer对象必须在视图的基础。在同一个ArrayBuffer对象之上，可以根据不同的数据类型，建立多个视图。

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

建立了视图以后，就可以对ArrayBuffer进行各种操作了。

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

除了在ArrayBuffer对象的基础上建立视图，还可以直接在普通数组的基础上建立类型数组。

{% highlight javascript %}

var typedArray = new Uint8Array( [ 1, 2, 3, 4 ] );

{% endhighlight %}

类型数组也可以转换为普通数组。

{% highlight javascript %}

var normalArray = Array.apply( [], typedArray );

{% endhighlight %}

## FileList对象

FileList对象针对表单的file控件。当用户通过file控件选取文件后，这个控件的files属性值就是FileList对象。它在结构上类似于数组，包含用户选取的多个文件。

{% highlight html %}

<input type="file" id="input" onchange="console.log(this.files.length)" multiple />

{% endhighlight %}

当用户选取文件后，就可以读取该文件。

{% highlight javascript %}

var selected_file = document.getElementById('input').files[0];

{% endhighlight %}

采用拖放方式，也可以得到FileList对象。

{% highlight javascript %}

var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('drop', handleFileSelect, false);

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // ...
}

{% endhighlight %}

上面代码的 handleFileSelect 是拖放事件的回调函数，它的参数evt是一个事件对象，该参数的dataTransfer.files属性就是一个FileList对象，里面包含了拖放的文件。

## File对象

File对象是FileList对象的成员，包含了文件的一些元信息，比如文件名、上次改动时间、文件大小和文件类型。它的属性值如下：

- name：文件名，该属性只读。
- size：文件大小，单位为字节，该属性只读。
- type：文件的MIME类型，如果分辨不出类型，则为空字符串，该属性只读。
- lastModifiedDate：文件的上次修改时间。

{% highlight javascript %}

var selected_file = document.getElementById('input').files[0];

var fileName = selected_file.name;
var fileSize = selected_file.size;
var fileType = selected_file.type;

{% endhighlight %}

## FileReader对象

FileReader对象接收File对象或Blob对象作为参数，用于读取文件的实际内容，即把文件内容读入内存。对于不同类型的文件，FileReader使用不同的方法读取。

- FileReader.readAsBinaryString(Blob|File) ：读取结果为二进制字符串，每个字节包含一个0到255之间的整数。
- FileReader.readAsText(Blob|File, opt_encoding) ：读取结果是一个文本字符串。默认情况下，文本编码格式是'UTF-8'，可以通过可选的格式参数，指定其他编码格式的文本。
- FileReader.readAsDataURL(Blob|File) ： 读取结果是一个基于Base64编码的 data-uri 对象。
- FileReader.readAsArrayBuffer(Blob|File) ：读取结果是一个 ArrayBuffer 对象。

FileReader采用异步方式读取文件，可以为一系列事件指定回调函数。

- onabort：读取中断或调用reader.abort()方法时触发。
- onerror：读取出错时触发。
- onload：读取成功后触发。
- onloadend：读取完成后触发，不管是否成功。触发顺序排在 onload 或 onerror 后面。
- onloadstart：读取将要开始时触发。
- onprogress：读取过程中周期性触发。

下面的代码是如何展示文本文件的内容。

{% highlight javascript %}

var reader = new FileReader();

reader.onload = function(e){
       console.log(e.target.result);
}

reader.readAsText(blob);

{% endhighlight %}

onload事件的回调函数接受一个事件对象，该对象的target.result就是文件的内容。

下面是一个使用readAsDataURL方法，为img元素添加src属性的例子。

{% highlight javascript %}

var reader = new FileReader();

reader.onload = function(e) {
	document.createElement('img').src = e.target.result;

};

reader.readAsDataURL(f);

{% endhighlight %}

下面是一个onerror事件回调函数的例子。

{% highlight javascript %}

var reader = new FileReader();
reader.onerror = errorHandler;

function errorHandler(evt) {
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case evt.target.error.ABORT_ERR:
        break;
      default:
        alert('An error occurred reading this file.');
    };
}

{% endhighlight %}

下面是一个onprogress事件回调函数的例子，主要用来显示读取进度。

{% highlight javascript %}

var reader = new FileReader();
reader.onprogress = updateProgress;

function updateProgress(evt) {
    if (evt.lengthComputable) {
      var percentLoaded = Math.round((evt.loaded / evt.totalEric Bidelman) * 100);
	  
      var progress = document.querySelector('.percent');
      if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
      }
    }
}

{% endhighlight %}

读取大文件的时候，可以利用Blob对象的slice方法，将大文件分成小段，逐一读取，这样可以加快处理速度。

## 综合实例：显示用户选取的本地图片

假设有一个表单，用于用户选取图片。

{% highlight html %}

<input type="file" name="picture" accept="image/png, image/jpeg"/>

{% endhighlight %}

一旦用户选中图片，将其显示在canvas的函数可以这样写：

{% highlight javascript %}

document.querySelector('input[name=picture]').onchange = function(e){
     readFile(e.target.files[0]);
}

function readFile(file){

  var reader = new FileReader();

  reader.onload = function(e){
    applyDataUrlToCanvas( reader.result );
  };

  reader.reaAsDataURL(file);
}

{% endhighlight %}

还可以在canvas上面定义拖放事件，允许用户直接拖放图片到上面。

{% highlight javascript %}

// stop FireFox from replacing the whole page with the file.
canvas.ondragover = function () { return false; };

// Add drop handler
canvas.ondrop = function (e) {
  e.stopPropagation();
  e.preventDefault(); 
  e = e || window.event;
  var files = e.dataTransfer.files;
  if(files){
    readFile(files[0]);
  }
};

{% endhighlight %}

所有的拖放事件都有一个dataTransfer属性，它包含拖放过程涉及的二进制数据。

还可以让canvas显示剪贴板中的图片。

{% highlight javascript %}

document.onpaste = function(e){
  e.preventDefault();
  if(e.clipboardData&&e.clipboardData.items){
    // pasted image
    for(var i=0, items = e.clipboardData.items;i<items.length;i++){
      if( items[i].kind==='file' && items[i].type.match(/^image/) ){
        readFile(items[i].getAsFile());
        break;
      }
    }
  }
  return false;
};

{% endhighlight %}

## URL对象

URL对象用于生成指向File对象或Blob对象的URL。

{% highlight javascript %}

var objecturl =  window.URL.createObjectURL(blob);

{% endhighlight %}

上面的代码会对二进制数据生成一个URL，类似于“blob:http%3A//test.com/666e6730-f45c-47c1-8012-ccc706f17191”。这个URL可以放置于任何通常可以放置URL的地方，比如img标签的src属性。需要注意的是，即使是同样的二进制数据，每调用一次URL.createObjectURL方法，就会得到一个不一样的URL。

这个URL的存在时间，等同于网页的存在时间，一旦网页刷新或卸载，这个URL就失效。除此之外，也可以手动调用URL.revokeObjectURL方法，使URL失效。

{% highlight javascript %}

window.URL.revokeObjectURL(objectURL);

{% endhighlight %}

下面是一个利用URL对象，在网页插入图片的例子。

{% highlight javascript %}

var img = document.createElement("img");

img.src = window.URL.createObjectURL(files[0]);

img.height = 60;

img.onload = function(e) {
    window.URL.revokeObjectURL(this.src);
}

body.appendChild(img);

var info = document.createElement("span");

info.innerHTML = files[i].name + ": " + files[i].size + " bytes";

body.appendChild(info);

{% endhighlight %}

还有一个本机视频预览的例子。

{% highlight javascript %}

var video = document.getElementById('video');
var obj_url = window.URL.createObjectURL(blob);
video.src = obj_url;
video.play()
window.URL.revokeObjectURL(obj_url);

{% endhighlight %}

## 参考链接

- [W3C Working Draft](http://www.w3.org/TR/FileAPI/)
- Andrew Dodson, [Get Loaded with the File API](http://msdn.microsoft.com/en-gb/magazine/jj835793.aspx)
- Mozilla Developer Network，[Using files from web applications](https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications)
- [HTML5 download attribute](http://javascript-reverse.tumblr.com/post/37056936789/html5-download-attribute)
- Eric Bidelman, [Reading files in JavaScript using the File APIs](http://www.html5rocks.com/en/tutorials/file/dndfiles/)
