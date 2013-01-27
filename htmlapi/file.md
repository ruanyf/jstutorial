---
title: File API
date: 2012-11-30
layout: page
category: htmlapi
modifiedOn: 2013-01-27
---

这个API用于浏览器操作本地文件。

它不是一个单一的API，而是包括了一系列对象。

## FileList对象

该对象针对表单的file控件。当用户通过file控件选取文件后，这个file控件的files属性就是这个对象。它在结构上类似于数组，包含用户选取的多个文件。

{% highlight html %}

<input type=file onchange="console.log(this.files.length)" multiple />

{% endhighlight %}

## File对象

Filelist对象的成员就是File对象，它包含了一些文件的元信息，比如文件名、上次改动时间、文件大小和文件类型。

## Blob对象

Blob（Binary Large Object）对象用于操作二进制数据。如果xhr.responseType设为blob，接收的就是二进制数据。

## FileReader对象

该对象接收File对象或Blob对象作为参数，用于读取文件的实际内容。它读取的文件分成几种不同的类型：Text（UTF-8）、ArrayBuffer（二进制文件）、基于base64编码的data-uri。下面的代码是如何展示文本文件的内容。

{% highlight javascript %}

var reader = new FileReader();

reader.onload = function(e){
       console.log(e.target.result);
}

reader.readAsText(blob);

{% endhighlight %}

除了上面的readAsText方法，类似的方法还有readAsArrayBuffer和readAsDataURL，分别用于读取不同类型的数据。

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
  e.preventDefault(); e = e || window.event;
  var files = e.dataTransfer.files;
  if(files){
    readFile(files[0]);
  }
};

{% endhighlight %}

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

var objecturl =  window.URL.createObjectURL(blob)

{% endhighlight %}

上面的代码生成的URL，类似于“blob:http%3A//test.com/666e6730-f45c-47c1-8012-ccc706f17191”。这个URL可以放置于任何通常可以放置URL的地方，比如img标签的src属性。这个URL的存在时间，等同于网页的存在时间，一旦网页刷新或卸载，这个URL就失效。

## 参考链接

* [W3C Working Draft](http://www.w3.org/TR/FileAPI/)
- Andrew Dodson, [Get Loaded with the File API](http://msdn.microsoft.com/en-gb/magazine/jj835793.aspx)
