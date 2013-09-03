---
title: Ajax
layout: page
category: bom
date: 2013-02-16
modifiedOn: 2013-08-28
---

## XMLHttpRequest对象

该对象用于从JavaScript发出HTTP请求，下面是典型用法。

{% highlight javascript %}

// 新建一个XMLHttpRequest实例对象
var xhr = new XMLHttpRequest();

// 指定通信过程中状态改变时的回调函数
xhr.onreadystatechange = function(){

	// 通信成功时，状态值为4
    var completed = 4;
    if(xhr.readyState === completed){
        if(xhr.status === 200){
            // 处理服务器发送过来的数据
        }else{
            // 处理错误
        }
    }
};

// open方式用于指定HTTP动词、请求的网址、是否异步
xhr.open('GET', '/endpoint', true);

// 发送HTTP请求
xhr.send(null);

{% endhighlight %}

### Open方法

open方法用于指定发送HTTP请求的参数，它有三个参数如下：
- 发送方法，一般来说为“GET”、“POST”、“PUT”和“DELETE”中的一个值。
- 网址。
- 是否异步，true表示异步，false表示同步。

### readyState属性和readyStateChange事件

在通信过程中，每当发生状态变化的时候，readyState属性的值就会发生改变。

这个值每一次变化，都会触发readyStateChange事件。我们可以指定这个事件的回调函数，对不同状态进行不同处理。尤其是当状态变为4的时候，表示通信成功，这时回调函数就可以处理服务器传送回来的数据。

### send方法

send方法用于实际发出HTTP请求。如果不带参数，就表示HTTP请求只包含头信息，也就是只有一个URL，典型例子就是GET请求；如果带有参数，就表示除了头信息，还带有包含具体数据的信息体，典型例子就是POST请求。

在XHR 2之中，send方法可以发送许多类型的数据。

{% highlight javascript %}

void send();
void send(ArrayBuffer data);
void send(Blob data);
void send(Document data);
void send(DOMString data);
void send(FormData data);

{% endhighlight %}

Blob类型可以用来发送二进制数据，这使得通过Ajax上传文件成为可能。

FormData类型可以用于构造表单数据。

{% highlight javascript %}

var formData = new FormData();

formData.append('username', '张三');
formData.append('email', 'zhangsan@example.com');
formData.append('birthDate', 1940);

xhr.send(formData);

{% endhighlight %}

上面的代码构造了一个formData对象，然后使用send方法发送。它的效果与点击下面表单的submit按钮是一样的。

{% highlight html %}

<form id='registration' name='registration' action='/register'>
    <input type='text' name='username' value='张三'>
    <input type='email' name='email' value='zhangsan@example.com'>
    <input type='number' name='birthDate' value='1940'>
    <input type='submit' onclick='return sendForm(this.form);'>
</form>

{% endhighlight %}

FormData对象还可以对现有表单添加数据，这为我们操作表单提供了极大的灵活性。

{% highlight javascript %}

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

{% endhighlight %}

### 服务器返回的信息

（1）status属性

status属性表示返回的HTTP状态码。一般来说，如果通信成功的话，这个状态码是200。

（2）responseText属性

responseText属性表示服务器返回的文本数据。

### overrideMimeType方法

该方法用来指定服务器返回数据的MIME类型。

传统上，如果希望从服务器取回二进制数据，就要使用这个方法，人为将数据类型伪装成文本数据。

{% highlight javascript %}

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

{% endhighlight %}

上面代码中，因为传回来的是二进制数据，首先用xhr.overrideMimeType方法强制改变它的MIME类型，伪装成文本数据。字符集必需指定为“x-user-defined”，如果是其他字符集，浏览器内部会强制转码，将其保存成UTF-16的形式。字符集“x-user-defined”其实也会发生转码，浏览器会在每个字节前面再加上一个字节（0xF700-0xF7ff），因此后面要对每个字符进行一次与运算（&），将高位的8个位去除，只留下低位的8个位，由此逐一读出原文件二进制数据的每个字节。

### responseType属性

XMLHttpRequest对象有一个responseType属性，用来指定服务器返回数据（xhr.response）的类型。

XHR 2允许用户自行设置这个属性，也就是指定返回数据的类型，可以设置如下的值：

- 'text'：返回类型为字符串，这是默认值。
- 'arraybuffer'：返回类型为ArrayBuffer。
- 'blob'：返回类型为Blob。
- 'document'：返回类型为Document。
- 'json'：返回类型为JSON object。

text类型适合大多数情况，而且直接处理文本也比较方便，document类型适合返回XML文档的情况，blob类型适合读取二进制数据，比如图片文件。

{% highlight javascript %}

var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'blob';

xhr.onload = function(e) {
  if (this.status == 200) {
    var blob = new Blob([this.response], {type: 'image/png'});
    // ...
  }
};

xhr.send();

{% endhighlight %}

如果将这个属性设为“json”，支持JSON的浏览器（Firefox>9，chrome>30），就会自动对返回数据调用JSON.parse() 方法。也就是说，你从xhr.response属性（注意，不是xhr.responseText属性）得到的不是文本，而是一个JSON对象。

## JSONP

越来越多的服务器返回JSON格式的数据，但是从数据性质上来看，它属于字符串。这时就需要用JSON.parse方法将文本数据转为JSON对象。为了方便起见，许多服务器也支持指定回调函数的名称，直接将JSON数据放入回调函数的参数，如此一来就省略将字符串解析为JSON对象的步骤。这种方法就被称为JSONP。

请看下面的例子，假定访问 http://example.com/ip ，返回如下JSON数据：

{% highlight javascript %}

{"ip":"8.8.8.8"}

{% endhighlight %}

现在服务器端允许使用callback参数指定回调函数。访问 http://example.com/ip?callback=foo ，返回的数据变成：

{% highlight javascript %}

foo({"ip":"8.8.8.8"})

{% endhighlight %}

这时，如果客户端定义了foo函数，该函数就会被立即调用，而作为参数的JSON数据被视为JavaScript对象，而不是字符串，因此避免了使用JSON.parse的步骤。

{% highlight javascript %}

function foo(data) {
    alert('Your public IP address is: ' + data.ip);
};

{% endhighlight %}

## CORS

CORS的全称是“跨域资源共享”（Cross-origin resource sharing），它提出一种方法，允许网页JavaScript代码向另一个域名发出XMLHttpRequests请求，从而克服了传统上Ajax只能在同一个域名下使用的限制（same origin security policy）。

所有主流浏览器都支持该方法，不过IE8和IE9的该方法不是部署在XMLHttpRequest对象，而是部署在XDomainRequest对象。检查浏览器是否支持的代码如下：

{% highlight javascript %}

var request = new XMLHttpRequest();

if("withCredentials" in request) {
  // 发出跨域请求
}

{% endhighlight %}

CORS的原理其实很简单，就是增加一条HTTP头信息的查询，询问服务器端，当前请求的域名是否在许可名单之中，以及可以使用哪些HTTP动词。如果得到肯定的答复，就发出XMLHttpRequest请求。这种机制叫做“预检”（preflight）。

“预检”的专用HTTP头信息是Origin。假定用户正在浏览来自www.example.com的网页，该网页需要向另一个域名请求数据，这时浏览器会向该域名询问是否同意跨域请求，发出的HTTP头信息如下：

{% highlight http %}

Origin: http://www.example.com

{% endhighlight %}

这行HTTP头信息表示，请求来自www.example.com。服务端如果同意，就返回一个Access-Control-Allow-Origin头信息。

{% highlight http %}

Access-Control-Allow-Origin: http://www.example.com

{% endhighlight %}

如果不同意，服务器端会返回一个错误。

如果服务器端对所有网站都开放，可以返回一个星号（*）通配符。

{% highlight http %}

Access-Control-Allow-Origin: *

{% endhighlight %}

由于整个过程都是浏览器自动后台完成，不用用户参与，所以对于开发者来说，使用Ajax跨域请求与同域请求没有区别，代码完全一样。但是，这需要服务端的支持，所以在使用CORS之前，要查看一下所请求的网站是否支持。

CORS机制默认不发送cookie和HTTP认证信息，除非打开withCredentials属性。

{% highlight javascript %}

request.withCredentials = "true";

{% endhighlight %}

CORS机制与JSONP模式的使用目的相同，而且更强大。JSONP只支持GET请求，CORS可以支持所有类型的HTTP请求。在发生错误的情况下，CORS可以得到更详细的错误信息，部署更有针对性的错误处理代码。JSONP的优势在于可以用于老式浏览器，以及可以向不支持CORS的网站请求数据。

## 参考链接

- MDN, [Using XMLHttpRequest](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Using_XMLHttpRequest)
- Mathias Bynens, [Loading JSON-formatted data with Ajax and xhr.responseType='json'](http://mathiasbynens.be/notes/xhr-responsetype-json)
