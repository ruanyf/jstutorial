---
title: Ajax
layout: page
category: bom
date: 2013-02-16
modifiedOn: 2014-02-27
---

Ajax指的是一种JavaScript在浏览器中的使用方法。它通过原生的`XMLHttpRequest`对象发出HTTP请求，得到服务器返回的数据后，再进行处理。

Ajax可以是同步请求，也可以是异步请求。但是，大多数情况下，特指异步请求。因为同步的Ajax请求，对浏览器有”堵塞效应“。

## XMLHttpRequest对象

XMLHttpRequest对象用来在浏览器与服务器之间传送数据。它提供了一种方法，使得页面不用全部刷新，就可以从浏览器端获取新的数据。这意味着，通过XMLHttpRequest对象，可以每次只更新网页的一个部分，从而不打断用户正在做的事情。Ajax操作就是基于XMLHttpRequest对象的。

虽然名字里面有`XML`，但是实际上，XMLHttpRequest可以报送各种数据，包括字符串和二进制，而且除了HTTP，它还支持通过其他协议传送（比如File和FTP）。

下面是`XMLHttpRequest`对象的典型用法。

```javascript
// 新建一个XMLHttpRequest实例对象
var xhr = new XMLHttpRequest();

// 指定通信过程中状态改变时的回调函数
xhr.onreadystatechange = function(){
  // 通信成功时，状态值为4
  if (xhr.readyState === 4){
    if (xhr.status === 200){
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.onerror = function (e) {
  console.error(xhr.statusText);
};

// open方式用于指定HTTP动词、请求的网址、是否异步
xhr.open('GET', '/endpoint', true);

// 发送HTTP请求
xhr.send(null);
```

下面是发出同步请求的一个例子。

```javascript
var request = new XMLHttpRequest();
request.open('GET', '/bar/foo.txt', false);
request.send(null);

if (request.status === 200) {
  console.log(request.responseText);
}
```

## XMLHttpRequest实例的属性

### readyState

`readyState`是一个只读属性，用一个整数和对应的常量，表示XMLHttpRequest请求当前所处的状态。

- 0，对应常量`UNSENT`，表示XMLHttpRequest实例已经生成，但是`open()`方法还没有被调用。
- 1，对应常量`OPENED`，表示`send()`方法还没有被调用，仍然可以使用`setRequestHeader()`，设定HTTP请求的头信息。
- 2，对应常量`HEADERS_RECEIVED`，表示`send()`方法已经执行，并且头信息和状态码已经收到。
- 3，对应常量`LOADING`，表示正在接收服务器传来的body部分的数据，如果`responseType`属性是`text`或者空字符串，`responseText`就会包含已经收到的部分信息。
- 4，对应常量`DONE`，表示服务器数据已经完全接收，或者本次接收已经失败了。

在通信过程中，每当发生状态变化的时候，readyState属性的值就会发生改变。这个值每一次变化，都会触发readyStateChange事件。

### onreadystatechange

`onreadystatechange`属性指向一个回调函数，当`readystatechange`事件发生的时候，这个回调函数就会调用，并且XMLHttpRequest实例的`readyState`属性也会发生变化。

另外，如果使用`abort()`方法，终止XMLHttpRequest请求，`onreadystatechange`回调函数也会被调用。

```javascript
var xmlhttp = new XMLHttpRequest();
xmlhttp.open( 'GET', 'http://example.com' , true );
xmlhttp.onreadystatechange = function () {
  if ( XMLHttpRequest.DONE != xmlhttp.readyState ) {
    return;
  }
  if ( 200 != xmlhttp.status ) {
    return;
  }
  console.log( xmlhttp.responseText );
};
xmlhttp.send();
```

### response

`response`属性为只读，返回接收到的数据体（即body部分）。它的类型可以是ArrayBuffer、Blob、Document、JSON对象、或者一个字符串，这由`XMLHttpRequest.responseType`属性的值决定。

如果本次请求没有成功或者数据不完整，该属性就会等于`null`。

### responseType

`responseType`属性用来指定服务器返回数据（`xhr.response`）的类型。

- ""：字符串（默认值）
- "arraybuffer"：ArrayBuffer对象
- "blob"：Blob对象
- "document"：Document对象
- "json"：JSON对象
- "text"：字符串

text类型适合大多数情况，而且直接处理文本也比较方便，document类型适合返回XML文档的情况，blob类型适合读取二进制数据，比如图片文件。

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'blob';

xhr.onload = function(e) {
  if (this.status == 200) {
    var blob = new Blob([this.response], {type: 'image/png'});
    // 或者
    var blob = oReq.response;
  }
};

xhr.send();
```

如果将这个属性设为ArrayBuffer，就可以按照数组的方式处理二进制数据。

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  var uInt8Array = new Uint8Array(this.response);
  for (var i = 0, len = binStr.length; i < len; ++i) {
  // var byte = uInt8Array[i];
  }
};

xhr.send();
```

如果将这个属性设为“json”，支持JSON的浏览器（Firefox>9，chrome>30），就会自动对返回数据调用JSON.parse() 方法。也就是说，你从xhr.response属性（注意，不是xhr.responseText属性）得到的不是文本，而是一个JSON对象。

XHR2支持Ajax的返回类型为文档，即xhr.responseType="document" 。这意味着，对于那些打开CORS的网站，我们可以直接用Ajax抓取网页，然后不用解析HTML字符串，直接对XHR回应进行DOM操作。

### responseText

`responseText`属性为只读，返回接收到的字符串。如果本次请求没有成功或者数据不完整，该属性就会等于`null`。

### responseXML

`responseXML`属性为只读，返回接收到的Document对象。如果本次请求没有成功或者数据不完整ontaining，或者不能被解析为XML或HTML，该属性等于null。

返回的数据会被解析为`text/xml`类型的数据流。如果`responseType`设为`document`，且这个请求是异步的，则返回的数据会被解析为`text/html`数据流。

如果服务器返回的数据，没有明示`Content-Type`头信息等于`text/xml`，可以使用`overrideMimeType()`方法，指定XMLHttpRequest对象将返回的数据解析为XML。

### status

`status`属性为只读属性，表示本次请求所得到的HTTP状态码，它是一个整数。一般来说，如果通信成功的话，这个状态码是200。

### statusText

`statusText`属性为只读属性，返回一个字符串，表示服务器发送的状态提示。不同于`status`属性，该属性包含整个状态信息，比如”200 OK“。

### timeout

`timeout`属性等于一个整数，表示多少毫秒后，如果请求仍然没有得到结果，就会自动终止。如果该属性等于0，就表示没有时间限制。

```javascript
  var xhr = new XMLHttpRequest();
  xhr.ontimeout = function () {
    console.error("The request for " + url + " timed out.");
  };
  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback.apply(xhr, args);
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.timeout = timeout;
  xhr.send(null);
}
```

### 事件监听接口

XMLHttpRequest第一版，只能对`onreadystatechange`这一个事件指定回调函数。该事件对所有情况作出响应。 XMLHttpRequest第二版允许对更多的事件指定回调函数。

- onloadstart 请求发出
- onprogress 正在发送和加载数据
- onabort 请求被中止，比如用户调用了`abort()`方法
- onerror 请求失败
- onload 请求成功完成
- ontimeout 用户指定的时限到期，请求还未完成
- onloadend 请求完成，不管成果或失败

```javascript
xhr.onload = function() {
 var responseText = xhr.responseText;
 console.log(responseText);
 // process the response.
};

xhr.onerror = function() {
  console.log('There was an error!');
};
```

注意，如果发生网络错误（比如服务器无法连通），`onerror`事件无法获取报错信息，所以只能显示报错。

### withCredentials

`withCredentials`属性是一个布尔值，表示跨域请求时，用户信息（比如Cookie和认证的HTTP头信息）是否会包含在请求之中，默认为`false`。即向`example.com`发出跨域请求时，不会发送`example.com`设置在本机上的Cookie（如果有的话）。

如果你需要通过跨域AJAX发送Cookie，需要打开`withCredentials`。

```javascript
xhr.withCredentials = true;
```

为了让这个属性生效，服务器必须显式返回`Access-Control-Allow-Credentials`这个头信息。

```javascript
Access-Control-Allow-Credentials: true
```

`.withCredentials`属性打开的话，不仅会发送Cookie，还会设置远程主机指定的Cookie。注意，此时你的脚本还是遵守同源政策，无法 从`document.cookie`或者HTTP回应的头信息之中，读取这些Cookie。

## XMLHttpRequest实例的方法

### abort()

`abort`方法用来终止已经发出的HTTP请求。

### getAllResponseHeaders()

`getAllResponseHeaders`方法返回服务器发来的所有HTTP头信息。格式为字符串，每个头信息之间使用`CRLF`分隔，如果没有受到服务器回应，该属性返回`null`。

### getResponseHeader()

`getResponseHeader`方法返回HTTP头信息指定字段的值，如果还没有收到服务器回应或者指定字段不存在，则该属性为`null`。

```html
function getHeaderTime () {
  console.log(this.getResponseHeader("Last-Modified"));
}

var oReq = new XMLHttpRequest();
oReq.open("HEAD", "yourpage.html");
oReq.onload = getHeaderTime;
oReq.send();
```

如果有多个字段同名，则它们的值会被连接为一个字符串，每个字段之间使用”逗号+空格“分隔。

### open()

`XMLHttpRequest`对象的`open`方法用于指定发送HTTP请求的参数，它的使用格式如下，一共可以接受五个参数。

```javascript
void open(
   string method,
   string url,
   optional boolean async,
   optional string user,
   optional string password
);
```

- method：表示HTTP动词，比如“GET”、“POST”、“PUT”和“DELETE”。
- url: 表示请求发送的网址。
- async: 格式为布尔值，默认为`true`，表示请求是否为异步。如果设为`false`，则`send()`方法只有等到收到服务器返回的结果，才会有返回值。
- user：表示用于认证的用户名，默认为空字符串。
- password：表示用于认证的密码，默认为空字符串。

如果对使用过`open()`方法的请求，再次使用这个方法，等同于调用`abort()`。

下面发送POST请求的例子。

```javascript
xhr.open('POST', encodeURI('someURL'));
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = function() {};
xhr.send(encodeURI('dataString'));
```

上面方法中，open方法向指定URL发出POST请求，send方法送出实际的数据。

下面是一个同步AJAX请求的例子。

```javascript
var request = new XMLHttpRequest();
request.open('GET', '/bar/foo.txt', false);
request.send(null);

if (request.status === 200) {
  console.log(request.responseText);
}
```

### send()

`send`方法用于实际发出HTTP请求。如果不带参数，就表示HTTP请求只包含头信息，也就是只有一个URL，典型例子就是GET请求；如果带有参数，就表示除了头信息，还带有包含具体数据的信息体，典型例子就是POST请求。

如果请求是异步的（默认为异步），该方法在发出请求后会立即返回。如果请求为同步，该方法只有等到收到服务器回应后，才会返回。

注意，所有XMLHttpRequest的监听事件，都必须在`send()`方法调用之前设定。

该方法的参数就是发送的数据。多种格式的数据，都可以作为它的参数。

```javascript
void send();
void send(ArrayBufferView data);
void send(Blob data);
void send(Document data);
void send(String data);
void send(FormData data);
```

如果发送`Document`数据，在发送之前，数据会先被串行化。

发送二进制数据，最好使用`ArrayBufferView`或`Blob`对象，这使得通过Ajax上传文件成为可能。

下面是一个上传`ArrayBuffer`对象的例子。

```javascript
function sendArrayBuffer() {
  var xhr = new XMLHttpRequest();
  var uInt8Array = new Uint8Array([1, 2, 3]);

  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };
  xhr.send(uInt8Array.buffer);
}
```

FormData类型可以用于构造表单数据。

```javascript
var formData = new FormData();

formData.append('username', '张三');
formData.append('email', 'zhangsan@example.com');
formData.append('birthDate', 1940);

var xhr = new XMLHttpRequest();
xhr.open("POST", "/register");
xhr.send(formData);
```

上面的代码构造了一个`formData`对象，然后使用send方法发送。它的效果与点击下面表单的submit按钮是一样的。

```html
<form id='registration' name='registration' action='/register'>
    <input type='text' name='username' value='张三'>
    <input type='email' name='email' value='zhangsan@example.com'>
    <input type='number' name='birthDate' value='1940'>
    <input type='submit' onclick='return sendForm(this.form);'>
</form>
```

FormData也可以将现有表单构造生成。

```javascript
var formElement = document.querySelector("form");
var request = new XMLHttpRequest();
request.open("POST", "submitform.php");
request.send(new FormData(formElement));
```

FormData对象还可以对现有表单添加数据，这为我们操作表单提供了极大的灵活性。

```javascript
function sendForm(form) {
    var formData = new FormData(form);
    formData.append('csrf', 'e69a18d7db1286040586e6da1950128c');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', form.action, true);
    xhr.onload = function(e) {
        // ...
    };
    xhr.send(formData);

    return false;
}

var form = document.querySelector('#registration');
sendForm(form);
```

FormData对象也能用来模拟File控件，进行文件上传。

```javascript
function uploadFiles(url, files) {
  var formData = new FormData();

  for (var i = 0, file; file = files[i]; ++i) {
    formData.append(file.name, file); // 可加入第三个参数，表示文件名
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.onload = function(e) { ... };

  xhr.send(formData);  // multipart/form-data
}

document.querySelector('input[type="file"]').addEventListener('change', function(e) {
  uploadFiles('/server', this.files);
}, false);
```

FormData也可以加入JavaScript生成的文件。

```javascript
// 添加JavaScript生成的文件
var content = '<a id="a"><b id="b">hey!</b></a>';
var blob = new Blob([content], { type: "text/xml"});
formData.append("webmasterfile", blob);
```

### setRequestHeader()

`setRequestHeader`方法用于设置HTTP头信息。该方法必须在`open()`之后、`send()`之前调用。如果该方法多次调用，设定同一个字段，则每一次调用的值会被合并成一个单一的值发送。

```javascript
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('Content-Length', JSON.stringify(data).length);
xhr.send(JSON.stringify(data));
```

上面代码首先设置头信息`Content-Type`，表示发送JSON格式的数据；然后设置`Content-Length`，表示数据长度；最后发送JSON数据。

### overrideMimeType()

该方法用来指定服务器返回数据的MIME类型。该方法必须在`send()`之前调用。

传统上，如果希望从服务器取回二进制数据，就要使用这个方法，人为将数据类型伪装成文本数据。

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);

// 强制将MIME改为文本类型
xhr.overrideMimeType('text/plain; charset=x-user-defined');

xhr.onreadystatechange = function(e) {
  if (this.readyState == 4 && this.status == 200) {
    var binStr = this.responseText;
    for (var i = 0, len = binStr.length; i < len; ++i) {
      var c = binStr.charCodeAt(i);
      var byte = c & 0xff;  // 去除高位字节，留下低位字节
    }
  }
};

xhr.send();
```

上面代码中，因为传回来的是二进制数据，首先用`xhr.overrideMimeType`方法强制改变它的MIME类型，伪装成文本数据。字符集必需指定为“x-user-defined”，如果是其他字符集，浏览器内部会强制转码，将其保存成UTF-16的形式。字符集“x-user-defined”其实也会发生转码，浏览器会在每个字节前面再加上一个字节（0xF700-0xF7ff），因此后面要对每个字符进行一次与运算（&），将高位的8个位去除，只留下低位的8个位，由此逐一读出原文件二进制数据的每个字节。

这种方法很麻烦，在XMLHttpRequest版本升级以后，一般采用指定`responseType`的方法。

```javascript
var xhr = new XMLHttpRequest();
xhr.onload = function(e) {
  var arraybuffer = xhr.response;
  // ...
}
xhr.open("GET", url);
xhr.responseType = "arraybuffer";
xhr.send();
```

## XMLHttpRequest实例的事件

### readyStateChange事件

`readyState`属性的值发生改变，就会触发readyStateChange事件。

我们可以通过`onReadyStateChange`属性，指定这个事件的回调函数，对不同状态进行不同处理。尤其是当状态变为4的时候，表示通信成功，这时回调函数就可以处理服务器传送回来的数据。

### progress事件

上传文件时，XMLHTTPRequest对象的upload属性有一个progress，会不断返回上传的进度。

假定网页上有一个progress元素。

```http
<progress min="0" max="100" value="0">0% complete</progress>
```

文件上传时，对upload属性指定progress事件回调函数，即可获得上传的进度。

```javascript
function upload(blobOrFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };

  // Listen to the upload progress.
  var progressBar = document.querySelector('progress');
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      progressBar.value = (e.loaded / e.total) * 100;
      progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
    }
  };

  xhr.send(blobOrFile);
}

upload(new Blob(['hello world'], {type: 'text/plain'}));
```

### load事件、error事件、abort事件

load事件表示服务器传来的数据接收完毕，error事件表示请求出错，abort事件表示请求被中断。

```javascript
var xhr = new XMLHttpRequest();

xhr.addEventListener("progress", updateProgress);
xhr.addEventListener("load", transferComplete);
xhr.addEventListener("error", transferFailed);
xhr.addEventListener("abort", transferCanceled);

xhr.open();

function updateProgress (oEvent) {
  if (oEvent.lengthComputable) {
    var percentComplete = oEvent.loaded / oEvent.total;
    // ...
  } else {
    // 回应的总数据量未知，导致无法计算百分比
  }
}

function transferComplete(evt) {
  console.log("The transfer is complete.");
}

function transferFailed(evt) {
  console.log("An error occurred while transferring the file.");
}

function transferCanceled(evt) {
  console.log("The transfer has been canceled by the user.");
}
```

### loadend事件

`abort`、`load`和`error`这三个事件，会伴随一个`loadend`事件，表示请求结束，但不知道其是否成功。

```javascript
req.addEventListener("loadend", loadEnd);

function loadEnd(e) {
  alert("请求结束（不知道是否成功）");
}
```

## 文件上传

HTML网页的`<form>`元素能够以四种格式，向服务器发送数据。

- 使用`POST`方法，将`enctype`属性设为`application/x-www-form-urlencoded`，这是默认方法。

```html
<form action="register.php" method="post" onsubmit="AJAXSubmit(this); return false;">
</form>
```

- 使用`POST`方法，将`enctype`属性设为`text/plain`。

```html
<form action="register.php" method="post" enctype="text/plain" onsubmit="AJAXSubmit(this); return false;">
</form>
```

- 使用`POST`方法，将`enctype`属性设为`multipart/form-data`。

```html
<form action="register.php" method="post" enctype="multipart/form-data" onsubmit="AJAXSubmit(this); return false;">
</form>
```

- 使用`GET`方法，`enctype`属性将被忽略。

```html
<form action="register.php" method="get" onsubmit="AJAXSubmit(this); return false;">
</form>
```

某个表单有两个字段，分别是`foo`和`baz`，其中`foo`字段的值等于`bar`，`baz`字段的值一个分为两行的字符串。上面四种方法，都可以将这个表单发送到服务器。

第一种方法是默认方法，POST发送，Encoding type为application/x-www-form-urlencoded。

```http
Content-Type: application/x-www-form-urlencoded

foo=bar&baz=The+first+line.&#37;0D%0AThe+second+line.%0D%0A
```

第二种方法是POST发送，Encoding type为text/plain。

```javascript
Content-Type: text/plain

foo=bar
baz=The first line.
The second line.
```

第三种方法是POST发送，Encoding type为multipart/form-data。

```http
Content-Type: multipart/form-data; boundary=---------------------------314911788813839

-----------------------------314911788813839
Content-Disposition: form-data; name="foo"

bar
-----------------------------314911788813839
Content-Disposition: form-data; name="baz"

The first line.
The second line.

-----------------------------314911788813839--
```

第四种方法是GET请求。

```http
?foo=bar&baz=The%20first%20line.%0AThe%20second%20line.
```

通常，我们使用file控件实现文件上传。

```html
<form id="file-form" action="handler.php" method="POST">
  <input type="file" id="file-select" name="photos[]" multiple/>
  <button type="submit" id="upload-button">上传</button>
</form>
```

上面HTML代码中，file控件的multiple属性，指定可以一次选择多个文件；如果没有这个属性，则一次只能选择一个文件。

file对象的files属性，返回一个FileList对象，包含了用户选中的文件。

```javascript
var fileSelect = document.getElementById('file-select');
var files = fileSelect.files;
```

然后，新建一个FormData对象的实例，用来模拟发送到服务器的表单数据，把选中的文件添加到这个对象上面。

```javascript
var formData = new FormData();

for (var i = 0; i < files.length; i++) {
  var file = files[i];

  if (!file.type.match('image.*')) {
    continue;
  }

  formData.append('photos[]', file, file.name);
}
```

上面代码中的FormData对象的append方法，除了可以添加文件，还可以添加二进制对象（Blob）或者字符串。

{% highlight javascript %}

// Files
formData.append(name, file, filename);

// Blobs
formData.append(name, blob, filename);

// Strings
formData.append(name, value);    

{% endhighlight %}

append方法的第一个参数是表单的控件名，第二个参数是实际的值，第三个参数是可选的，通常是文件名。

最后，使用Ajax方法向服务器上传文件。

{% highlight javascript %}

var xhr = new XMLHttpRequest();

xhr.open('POST', 'handler.php', true);

xhr.onload = function () {
  if (xhr.status !== 200) {
    alert('An error occurred!');
  }
};

xhr.send(formData);

{% endhighlight %}

目前，各大浏览器（包括IE 10）都支持Ajax上传文件。

除了使用FormData接口上传，也可以直接使用File API上传。

```javascript

var file = document.getElementById('test-input').files[0];
var xhr = new XMLHttpRequest();

xhr.open('POST', 'myserver/uploads');
xhr.setRequestHeader('Content-Type', file.type);
xhr.send(file);

```

可以看到，上面这种写法比FormData的写法，要简单很多。

## JSONP

JSONP是非同域的服务器与客户端之间通信的常用方法，主要用于规避浏览器的同源政策，因为Ajax请求的前提是，浏览器与服务器处于同一个域名（除非使用下面介绍的CORS）。如果不满足该条件，就可以考虑使用JSONP。

首先，通过在网页中动态插入`script`元素的做法，浏览器向另一个域名的服务器发出请求。

```javascript
function addScriptTag(src) {
  var script = document.createElement('script');
  script.setAttribute("type","text/javascript");
  script.src = src;
  document.body.appendChild(script);
}

window.onload = function () {
  addScriptTag('http://example.com/ip?callback=foo');
}

function foo(data) {
  console.log('Your public IP address is: ' + data.ip);
};
```

上面代码通过动态添加`script`元素，向不在同一个域名的`example.com`发出请求。注意，请求网址的查询字符串有一个`callback`，用来指定回调函数的名字，这是JSONP的标准做法。

服务器收到这个请求以后，会将数据放在回调函数的参数位置返回。

```javascript
foo({
  "ip": "8.8.8.8"
});
```

由于`script`标签返回的内容，直接作为代码运行。这时，如果客户端定义了`foo`函数，该函数就会被立即调用。作为参数的JSON数据被视为JavaScript对象，而不是字符串，因此避免了使用`JSON.parse`的步骤。

## CORS

CORS是一个W3C标准，全称是“跨域资源共享”（Cross-origin resource sharing）。它允许客户端向另一个域名的服务器发出XMLHttpRequest请求，从而克服了Ajax只能在同一个域名下使用的限制。

整个过程都是浏览器自动完成，不需要用户参与。所以，对于开发者来说，使用CORS机制的Ajax跨域请求与同域请求没有区别，代码完全一样。但是，这需要服务器的支持，所以在使用CORS之前，要查看一下所请求的网站是否支持。

浏览器一旦发现Ajax请求是跨域的，就会自动添加一些附加的头信息，有时还会多出一次附加的请求。整个过程都不需要开发者参与，甚至代码也不用变，跟同域请求是一致的。

### HTTP请求的类型

浏览器发出CORS请求时，分成两种情况。

第一种情况是，只要同时满足以下两大条件，就属于简单请求（simple request）。

条件一，请求方法是以下三种方法之一。

- HEAD
- GET
- POST

条件二，HTTP的头信息只超出以下几种。

- Accept
- Accept-Language
- Content-Language
- Last-Event-ID
- Content-Type：它的值只限于下面三种情况
  - application/x-www-form-urlencoded
  - multipart/form-data
  - text/plain

凡是不满足上面两个条件，就属于非简单请求（not-so-simple request）。

浏览器对这两种情况的处理，是不一样的。简单来说，对于简单请求，浏览器会支持发出CORS请求；对于非简单请求，则会单独会出一次”预检“（preflight）请求。

### 简单请求

对于简单请求，浏览器直接发出CORS请求。具体来说，就是在头信息之中，增加一个`Origin`字段。

```http
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

上面代码中，`Origin`字段用来说明，这个请求来自哪个域名（包括协议、域名、端口三个部分）。服务器可以根据这个域名，决定是否同意这次跨域请求。

如果`Origin`指定的域名，不在许可范围内，服务器会报错。注意，这个错误是底层通讯协议的错误，不是HTTP协议层的错误，无法通过HTTP状态码捕获。

如果`Origin`指定的域名在许可范围内，服务器返回的响应，会多出几个HTTP头信息的字段。

```http
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

所有与CORS请求相关的字段，都以`Access-Control-`开头。

- Access-Control-Allow-Origin（必须）：该字段要么是`Origin`字段的值，要么是一个`*`，表示接受任意域名的请求。
- Access-Control-Allow-Credentials（可选）：默认情况下，Cookie不包括在CORS请求之中。这个字段用来指定Cookie是否包括在HTTP请求之中，只能设为`true`。如果不想发送Cookie，删除该字段即可。
- Access-Control-Expose-Headers（可选）：CORS请求时，`XMLHttpRequest`对象的`getResponseHeader()`方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。

CORS机制默认不发送Cookie和HTTP认证信息，除非在Ajax请求中打开`withCredentials`属性。

```javascript
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

同时，服务器返回HTTP头信息时，也必须打开`Access-Control-Allow-Credentials`选项。否则，浏览器会忽略服务器返回的回应。

```http
Access-Control-Allow-Credentials: true
```

需要注意的是，此时`Access-Control-Allow-Origin`不能指定为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名（前例是`www.google.com`）设置的Cookie才会上传，其他域名下的Cookie并不会上传，且网页代码中的`document.cookie`也无法读取`www.google.com`域名下的cookie。

### 非简单请求

如果HTTP请求的方法是`PUT`或`DELETE`，或者`Content-Type`字段的类型是`application/json`，就属于非简单请求。

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询，称为”预检“请求（preflight）。浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词。如果得到肯定的答复，就发出XMLHttpRequest请求。如果得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求。

下面是一段JavaScript脚本。

```javascript
var url = 'http://api.alice.com/cors';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader(
  'X-Custom-Header', 'value');
xhr.send();
```

上面代码中，HTTP请求的方法是`PUT`，并且发送一个自定义头信息`X-Custom-Header`。

这时，浏览器会自动发出一个”预检“请求。

```javascript
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

“预检”用的HTTP方法是OPTIONS，表示这个请求是用来询问的。头信息里面，关键的字段是`Origin`，表示网页所在的域名。

它的HTTP头信息包括这样几个特殊字段。

- Access-Control-Request-Method ：浏览器CORS请求用到的HTTP方法，这个字段是必需的。
- Access-Control-Request-Headers ：一个逗号分隔的字符串，指定CORS请求会用到的非简单字段`X-Custom-Header`。

服务器检查上面三个字段以后，确认允许跨域请求，然后做出回应。

```http
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

上面的HTTP回应中，关键的是`Access-Control-Allow-Origin`头信息，表示`http://api.bob.com`可以请求数据。

如果浏览器否定了”预检“请求，会返回一个正常的HTTP回应，但是没有任何CORS相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被`xhr`的`onerror`回调函数捕获。控制台会打印出如下的报错信息。

```bash
XMLHttpRequest cannot load http://api.alice.com.
Origin http://api.bob.com is not allowed by Access-Control-Allow-Origin.
```

一种特殊情况是，如果服务器允许所有域名的跨域请求，可以返回一个星号（`*`）通配符。

```http
Access-Control-Allow-Origin: *
```

服务器回应的其他字段如下。

- Access-Control-Allow-Methods（必需）：逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。
- Access-Control-Allow-Headers：如果浏览器请求包括`Access-Control-Request-Headers`字段，则`Access-Control-Allow-Headers`字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在”预检“中请求的字段。
- Access-Control-Allow-Credentials：与简单请求时的含义相同。
- Access-Control-Max-Age（可选）：指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。

```http
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Max-Age: 1728000
```

如果服务器通过了预检请求，则以后每次浏览器正常的HTTP请求，都会有一个`Origin`头信息；服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息。

下面是浏览器的正常CORS请求。

```http
PUT /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
X-Custom-Header: value
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

上面代码的`Origin`字段是浏览器自动添加的。

下面是服务器正常的回应。

```http
Access-Control-Allow-Origin: http://api.bob.com
Content-Type: text/html; charset=utf-8
```

### 与JSONP的比较

CORS机制与JSONP模式的使用目的相同，而且更强大。JSONP只支持GET请求，CORS可以支持所有类型的HTTP请求。在发生错误的情况下，CORS可以得到更详细的错误信息，部署更有针对性的错误处理代码。JSONP的优势在于可以用于老式浏览器，以及可以向不支持CORS的网站请求数据。

## Fetch API

### 基本用法

Ajax操作所用的XMLHttpRequest对象，已经有十多年的历史，它的API设计并不是很好，输入、输出、状态都在同一个接口管理，容易写出非常混乱的代码。Fetch API是一种新规范，用来取代XMLHttpRequest对象。它主要有两个特点，一是简化接口，将API分散在几个不同的对象上，二是返回Promise对象，避免了嵌套的回调函数。

检查浏览器是否部署了这个API的代码如下。

```javascript
if (fetch in window){
  // 支持
} else {
  // 不支持
}
```

下面是一个Fetch API的简单例子。

```javascript
var URL = 'http://some/path';

fetch(URL).then(function(response) {
  return response.json();
}).then(function(json) {
  someOperator(json);
});
```

上面代码向服务器请求JSON文件，获取后再做进一步处理。

下面比较XMLHttpRequest写法与Fetch写法的不同。

```javascript
function reqListener() {
  var data = JSON.parse(this.responseText);
  console.log(data);
}

function reqError(err) {
  console.log('Fetch Error :-S', err);
}

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.onerror = reqError;
oReq.open('get', './api/some.json', true);
oReq.send();
```

同样的操作用Fetch实现如下。

```javascript
fetch('./api/some.json')
  .then(function(response) {
    if (response.status !== 200) {
      console.log('请求失败，状态码：' + response.status);
      return;
    }
    response.json().then(function(data) {
      console.log(data);
    });
  }).catch(function(err) {
    console.log('出错：', err);
  });
```

上面代码中，因为HTTP请求返回的response对象是一个Stream对象，所以需要使用`response.json`方法转为JSON格式，不过这个方法返回的是一个Promise对象。

### fetch()

fetch方法的第一个参数可以是URL字符串，也可以是后文要讲到的Request对象实例。Fetch方法返回一个Promise对象，并将一个response对象传给回调函数。

response对象还有一个ok属性，如果返回的状态码在200到299之间（即请求成功），这个属性为true，否则为false。因此，上面的代码可以写成下面这样。

```javascript
fetch("./api/some.json").then(function(response) {
  if (response.ok) {
    response.json().then(function(data) {
      console.log(data);
    });
  } else {
    console.log("请求失败，状态码为", response.status);
  }
}, function(err) {
  console.log("出错：", err);
});
```

response对象除了json方法，还包含了HTTP回应的元数据。

```javascript
fetch('users.json').then(function(response) {
  console.log(response.headers.get('Content-Type'));
  console.log(response.headers.get('Date'));
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.type);
  console.log(response.url);
});
```

上面代码中，response对象有很多属性，其中的`response.type`属性比较特别，表示HTTP回应的类型，它有以下三个值。

- basic：正常的同域请求
- cors：CORS机制下的跨域请求
- opaque：非CORS机制下的跨域请求，这时无法读取返回的数据，也无法判断是否请求成功

如果需要在CORS机制下发出跨域请求，需要指明状态。

```javascript
fetch('http://some-site.com/cors-enabled/some.json', {mode: 'cors'})
  .then(function(response) {
    return response.text();
  })
  .then(function(text) {
    console.log('Request successful', text);
  })
  .catch(function(error) {
    log('Request failed', error)
  });
```

除了指定模式，fetch方法的第二个参数还可以用来配置其他值，比如指定cookie连同HTTP请求一起发出。

```javascript
fetch(url, {
  credentials: 'include'
})
```

发出POST请求的写法如下。

```javascript
fetch("http://www.example.org/submit.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: "firstName=Nikhil&favColor=blue&password=easytoguess"
}).then(function(res) {
  if (res.ok) {
    console.log("Perfect! Your settings are saved.");
  } else if (res.status == 401) {
    console.log("Oops! You are not authorized.");
  }
}, function(e) {
  console.log("Error submitting form!");
});
```

目前，还有一些XMLHttpRequest对象可以做到，但是Fetch API还没做到的地方，比如中途中断HTTP请求，以及获取HTTP请求的进度。这些不足与Fetch返回的是Promise对象有关。

### Headers

Fetch API引入三个新的对象（也是构造函数）：Headers, Request 和 Response。其中，Headers对象用来构造/读取HTTP数据包的头信息。

```javascript
var content = "Hello World";
var reqHeaders = new Headers();
reqHeaders.append("Content-Type", "text/plain");
reqHeaders.append("Content-Length", content.length.toString());
reqHeaders.append("X-Custom-Header", "ProcessThisImmediately");
```

Headers对象的实例，除了使用append方法添加属性，也可以直接通过构造函数一次性生成。

```javascript
reqHeaders = new Headers({
  "Content-Type": "text/plain",
  "Content-Length": content.length.toString(),
  "X-Custom-Header": "ProcessThisImmediately",
});
```

Headers对象实例还提供了一些工具方法。

```javascript
reqHeaders.has("Content-Type") // true
reqHeaders.has("Set-Cookie") // false
reqHeaders.set("Content-Type", "text/html")
reqHeaders.append("X-Custom-Header", "AnotherValue")

reqHeaders.get("Content-Length") // 11
reqHeaders.getAll("X-Custom-Header") // ["ProcessThisImmediately", "AnotherValue"]

reqHeaders.delete("X-Custom-Header")
reqHeaders.getAll("X-Custom-Header") // []
```

生成Header实例以后，可以将它作为第二个参数，传入Request方法。

```javascript
var headers = new Headers();
headers.append('Accept', 'application/json');
var request = new Request(URL, {headers: headers});

fetch(request).then(function(response) {
  console.log(response.headers);
});
```

同样地，Headers实例可以用来构造Response方法。

```javascript
var headers = new Headers({
  'Content-Type': 'application/json',
  'Cache-Control': 'max-age=3600'
});

var response = new Response(
  JSON.stringify({photos: {photo: []}}),
  {'status': 200, headers: headers}
);

response.json().then(function(json) {
  insertPhotos(json);
});
```

上面代码中，构造了一个HTTP回应。目前，浏览器构造HTTP回应没有太大用处，但是随着Service Worker的部署，不久浏览器就可以向Service Worker发出HTTP回应。

### Request对象

Request对象用来构造HTTP请求。

```javascript
var req = new Request("/index.html");
req.method // "GET"
req.url // "http://example.com/index.html"
```

Request对象的第二个参数，表示配置对象。

```javascript
var uploadReq = new Request("/uploadImage", {
  method: "POST",
  headers: {
    "Content-Type": "image/png",
  },
  body: "image data"
});
```

上面代码指定Request对象使用POST方法发出，并指定HTTP头信息和信息体。

下面是另一个例子。

```javascript
var req = new Request(URL, {method: 'GET', cache: 'reload'});
fetch(req).then(function(response) {
  return response.json();
}).then(function(json) {
  someOperator(json);
});
```

上面代码中，指定请求方法为GET，并且要求浏览器不得缓存response。

Request对象实例有两个属性是只读的，不能手动设置。一个是referrer属性，表示请求的来源，由浏览器设置，有可能是空字符串。另一个是context属性，表示请求发出的上下文，如果是image，表示是从img标签发出，如果是worker，表示是从worker脚本发出，如果是fetch，表示是从fetch函数发出的。

Request对象实例的mode属性，用来设置是否跨域，合法的值有以下三种：same-origin、no-cors（默认值）、cors。当设置为same-origin时，只能向同域的URL发出请求，否则会报错。

```javascript
var arbitraryUrl = document.getElementById("url-input").value;
fetch(arbitraryUrl, { mode: "same-origin" }).then(function(res) {
  console.log("Response succeeded?", res.ok);
}, function(e) {
  console.log("Please enter a same-origin URL!");
});
```

上面代码中，如果用户输入的URL不是同域的，将会报错，否则就会发出请求。

如果mode属性为no-cors，就与默认的浏览器行为没有不同，类似script标签加载外部脚本文件、img标签加载外部图片。如果mode属性为cors，就可以向部署了CORS机制的服务器，发出跨域请求。

```javascript
var u = new URLSearchParams();
u.append('method', 'flickr.interestingness.getList');
u.append('api_key', '<insert api key here>');
u.append('format', 'json');
u.append('nojsoncallback', '1');

var apiCall = fetch('https://api.flickr.com/services/rest?' + u);

apiCall.then(function(response) {
  return response.json().then(function(json) {
    // photo is a list of photos.
    return json.photos.photo;
  });
}).then(function(photos) {
  photos.forEach(function(photo) {
    console.log(photo.title);
  });
});
```

上面代码是向Flickr API发出图片请求的例子。

Request对象的一个很有用的功能，是在其他Request实例的基础上，生成新的Request实例。

```javascript
var postReq = new Request(req, {method: 'POST'});
```

### Response

fetch方法返回Response对象实例，它有以下属性。

- status：整数值，表示状态码（比如200）
- statusText：字符串，表示状态信息，默认是“OK”
- ok：布尔值，表示状态码是否在200-299的范围内
- headers：Headers对象，表示HTTP回应的头信息
- url：字符串，表示HTTP请求的网址
- type：字符串，合法的值有五个basic、cors、default、error、opaque。basic表示正常的同域请求；cors表示CORS机制的跨域请求；error表示网络出错，无法取得信息，status属性为0，headers属性为空，并且导致fetch函数返回Promise对象被拒绝；opaque表示非CORS机制的跨域请求，受到严格限制。

Response对象还有两个静态方法。

- Response.error() 返回一个type属性为error的Response对象实例
- Response.redirect(url, status) 返回的Response对象实例会重定向到另一个URL

### body属性

Request对象和Response对象都有body属性，表示请求的内容。body属性可能是以下的数据类型。

- ArrayBuffer
- ArrayBufferView (Uint8Array等)
- Blob/File
- string
- URLSearchParams
- FormData

```javascript
var form = new FormData(document.getElementById('login-form'));
fetch("/login", {
  method: "POST",
  body: form
})
```

上面代码中，Request对象的body属性为表单数据。

Request对象和Response对象都提供以下方法，用来读取body。

- arrayBuffer()
- blob()
- json()
- text()
- formData()

注意，上面这些方法都只能使用一次，第二次使用就会报错，也就是说，body属性只能读取一次。Request对象和Response对象都有bodyUsed属性，返回一个布尔值，表示body是否被读取过。

```javascript
var res = new Response("one time use");
console.log(res.bodyUsed); // false
res.text().then(function(v) {
  console.log(res.bodyUsed); // true
});
console.log(res.bodyUsed); // true

res.text().catch(function(e) {
  console.log("Tried to read already consumed Response");
});
```

上面代码中，第二次通过text方法读取Response对象实例的body时，就会报错。

这是因为body属性是一个stream对象，数据只能单向传送一次。这样的设计是为了允许JavaScript处理视频、音频这样的大型文件。

如果希望多次使用body属性，可以使用Response对象和Request对象的clone方法。它必须在body还没有读取前调用，返回一个前的body，也就是说，需要使用几次body，就要调用几次clone方法。

```javascript
addEventListener('fetch', function(evt) {
  var sheep = new Response("Dolly");
  console.log(sheep.bodyUsed); // false
  var clone = sheep.clone();
  console.log(clone.bodyUsed); // false

  clone.text();
  console.log(sheep.bodyUsed); // false
  console.log(clone.bodyUsed); // true

  evt.respondWith(cache.add(sheep.clone()).then(function(e) {
    return sheep;
  });
});
```

## 参考链接

- MDN, [Using XMLHttpRequest](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Using_XMLHttpRequest)
- Mathias Bynens, [Loading JSON-formatted data with Ajax and xhr.responseType='json'](http://mathiasbynens.be/notes/xhr-responsetype-json)
- Eric Bidelman, [New Tricks in XMLHttpRequest2](http://www.html5rocks.com/en/tutorials/file/xhr2/)
- Matt West, [Uploading Files with AJAX](http://blog.teamtreehouse.com/uploading-files-ajax)
- Monsur Hossain, [Using CORS](http://www.html5rocks.com/en/tutorials/cors/)
- MDN, [HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
- Matt Gaunt, [Introduction to fetch()](http://updates.html5rocks.com/2015/03/introduction-to-fetch)
- Nikhil Marathe, [This API is so Fetching!](https://hacks.mozilla.org/2015/03/this-api-is-so-fetching/)
- Ludovico Fischer, [Introduction to the Fetch API](http://www.sitepoint.com/introduction-to-the-fetch-api/)

