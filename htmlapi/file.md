---
title: File对象和二进制数据
date: 2012-11-30
layout: page
category: htmlapi
modifiedOn: 2013-08-08
---

除了文本数据，JavaScript还能操作二进制数据，Blob对象就是操作接口。

在Blob对象的基础上，又衍生出一系列相关的API。File对象负责处理那些以文件形式存在的二进制数据，也就是操作本地文件；FileList对象是File对象的网页表单接口；FileReader对象负责将二进制数据读入内容；URL对象则是用于对二进制数据生成URL。

## Blob对象

Blob（Binary Large Object）对象用于操作二进制数据。File对象就是建立在Blob对象基础上的，所以继承了后者的属性和方法。

Blob对象的构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型，这两个参数都不是必需的。

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

Blob对象有两个只读属性：

- size：二进制数据的大小，单位为字节。
- type：二进制数据的MIME类型，全部为小写，如果类型未知，则该值为空字符串。

在Ajax操作中，如果xhr.responseType设为blob，接收的就是二进制数据。

## FileList对象

FileList对象针对表单的file控件。当用户通过file控件选取文件后，这个控件的files属性值就是FileList对象。它在结构上类似于数组，包含用户选取的多个文件。

{% highlight html %}

<input type="file" id="input" onchange="console.log(this.files.length)" multiple />

{% endhighlight %}

当用户选取文件后，就可以读取该文件。

{% highlight javascript %}

var selected_file = document.getElementById('input').files[0];

{% endhighlight %}

## File对象

FileList对象是一个类似数组的对象，每个成员就是一个File对象，包含了文件的一些元信息，比如文件名、上次改动时间、文件大小和文件类型。它的属性值如下：

- name：文件名，该属性只读。
- size：文件大小，单位为字节，该属性只读。
- type：文件的MIME类型，如果分辨不出类型，则为空字符串，该属性只读。

{% highlight javascript %}

var selected_file = document.getElementById('input').files[0];

var fileName = selected_file.name;
var fileSize = selected_file.size;
var fileType = selected_file.type;

{% endhighlight %}

## FileReader对象

该对象接收File对象或Blob对象作为参数，用于读取文件的实际内容，即把文件内容读入内存。它读取的文件分成几种不同的类型：Text（UTF-8）、ArrayBuffer（二进制文件）、基于base64编码的data-uri。

FileReader采用非同步方式读取文件，所以采用回调函数的方式，进行数据处理。下面的代码是如何展示文本文件的内容。

{% highlight javascript %}

var reader = new FileReader();

reader.onload = function(e){
       console.log(e.target.result);
}

reader.readAsText(blob);

{% endhighlight %}

除了上面的readAsText方法，类似的方法还有readAsArrayBuffer、readAsBinaryString和readAsDataURL，分别用于读取不同类型的数据。

FileReader对象定义了几个事件，可以用于指定回调函数，分别是onerror、onloadstart、onabort和onprogress。

### 实例：显示用户选取的本地图片

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
