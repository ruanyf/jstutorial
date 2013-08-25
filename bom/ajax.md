---
title: Ajax
layout: page
category: bom
date: 2013-02-16
modifiedOn: 2013-08-25
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

### responseType属性

XMLHttpRequest对象有一个responseType属性，用来指定服务器返回数据（xhr.response）的类型。

XHR 2允许用户自行设置这个属性，也就是指定返回数据的类型，可以设置如下的值：
- 'text'：返回类型为字符串，这时默认值。
- 'arraybuffer'：返回类型为ArrayBuffer。
- 'blob'：返回类型为Blob。
- 'document'：返回类型为Document。
- 'json'：返回类型为JSON object。

text类型适合大多数情况，而且直接处理文本也比较方便，document类型适合返回XML文档的情况，blob类型适合读取二进制数据，比如图片文件。

如果将这个属性设为“json”，支持JSON的浏览器（Firefox>9，chrome>30），就会自动对返回数据调用JSON.parse() 方法。也就是说，你从xhr.response属性（注意，不是xhr.responseText属性）得到的不是文本，而是一个JSON对象。

## JSON-P

越来越多的服务器返回JSON格式的数据，但是从数据性质上来看，它属于字符串。这时就需要用JSON.parse方法将文本数据转为JSON对象。为了方便起见，许多服务器也支持指定回调函数的名称，直接将JSON数据放入回调函数的参数，如此一来就省略将字符串解析为JSON对象的步骤。这种方法就被称为JSON-P。

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

## 参考链接

- MDN, [Using XMLHttpRequest](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/Using_XMLHttpRequest)
- Mathias Bynens, [Loading JSON-formatted data with Ajax and xhr.responseType='json'](http://mathiasbynens.be/notes/xhr-responsetype-json)
