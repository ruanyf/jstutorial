---
title: Cookie
layout: page
category: bom
date: 2016-04-10
modifiedOn: 2016-04-10
---

## 概述

Cookie是服务器保存在浏览器的一小段文本信息，每个Cookie的大小一般不能超过4KB。浏览器每次向服务器发出请求，就会自动附上这段信息。

Cookie保存以下几方面的信息。

- Cookie的名字
- Cookie的值
- 到期时间
- 所属域名（默认是当前域名）
- 生效的路径（默认是当前网址）

举例来说，如果当前URL是`www.example.com`，那么Cookie的路径就是根目录`/`。这意味着，这个Cookie对该域名的根路径和它的所有子路径都有效。如果路径设为`/forums`，那么这个Cookie只有在访问`www.example.com/forums`及其子路径时才有效。

浏览器可以设置不接受Cookie，也可以设置不向服务器发送Cookie。`window.navigator.cookieEnabled`属性返回一个布尔值，表示浏览器是否打开Cookie功能。

`document.cookie`属性返回当前网页的Cookie。

```javascript
// 读取当前网页的所有cookie
var allCookies = document.cookie;
```

由于`document.cookie`返回的是分号分隔的所有Cookie，所以必须手动还原，才能取出每一个Cookie的值。

```javascript
var cookies = document.cookie.split(';');

for (var i = 0; i < cookies.length; i++) {
  // cookies[i] name=value形式的单个Cookie
}
```

`document.cookie`属性是可写的，可以通过它为当前网站添加Cookie。

```javascript
document.cookie = 'fontSize=14';
```

Cookie的值必须写成`key=value`的形式。注意，等号两边不能有空格。另外，写入Cookie的时候，必须对分号、逗号和空格进行转义（它们都不允许作为Cookie的值），这可以用`encodeURIComponent`方法达到。

但是，`document.cookie`一次只能写入一个Cookie，而且写入并不是覆盖，而是添加。

```javascript
document.cookie = 'test1=hello';
document.cookie = 'test2=world';
document.cookie
// test1=hello;test2=world
```

`document.cookie`属性读写行为的差异（一次可以读出全部Cookie，但是只能写入一个Cookie），与服务器与浏览器之间的Cookie通信格式有关。浏览器向服务器发送Cookie的时候，是一行将所有Cookie全部发送。

```http
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: cookie_name1=cookie_value1; cookie_name2=cookie_value2
Accept: */*
```

上面的头信息中，`Cookie`字段是浏览器向服务器发送的Cookie。

服务器告诉浏览器需要储存Cookie的时候，则是分行指定。

```http
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: cookie_name1=cookie_value1
Set-Cookie: cookie_name2=cookie_value2; expires=Sun, 16 Jul 3567 06:23:41 GMT
```

上面的头信息中，`Set-Cookie`字段是服务器写入浏览器的Cookie，一行一个。

如果仔细看浏览器向服务器发送的Cookie，就会意识到，Cookie协议存在问题。对于服务器来说，有两点是无法知道的。

- Cookie的各种属性，比如何时过期。
- 哪个域名设置的Cookie，因为Cookie可能是一级域名设的，也可能是任意一个二级域名设的。

## Cookie的属性

除了Cookie本身的内容，还有一些可选的属性也是可以写入的，它们都必须以分号开头。

```http
Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]
```

上面的`Set-Cookie`字段，用分号分隔多个属性。它们的含义如下。

（1）value属性

`value`属性是必需的，它是一个键值对，用于指定Cookie的值。

（2）expires属性

`expires`属性用于指定Cookie过期时间。它的格式采用`Date.toUTCString()`的格式。

如果不设置该属性，或者设为`null`，Cookie只在当前会话（session）有效，浏览器窗口一旦关闭，当前Session结束，该Cookie就会被删除。

浏览器根据本地时间，决定Cookie是否过期，由于本地时间是不精确的，所以没有办法保证Cookie一定会在服务器指定的时间过期。

（3）domain属性

`domain`属性指定Cookie所在的域名，比如`example.com`或`.example.com`（这种写法将对所有子域名生效）、`subdomain.example.com`。

如果未指定，默认为设定该Cookie的域名。所指定的域名必须是当前发送Cookie的域名的一部分，比如当前访问的域名是`example.com`，就不能将其设为`google.com`。只有访问的域名匹配domain属性，Cookie才会发送到服务器。

（4）path属性

`path`属性用来指定路径，必须是绝对路径（比如`/`、`/mydir`），如果未指定，默认为请求该Cookie的网页路径。

只有`path`属性匹配向服务器发送的路径，Cookie才会发送。这里的匹配不是绝对匹配，而是从根路径开始，只要`path`属性匹配发送路径的一部分，就可以发送。比如，`path`属性等于`/blog`，则发送路径是`/blog`或者`/blogroll`，Cookie都会发送。`path`属性生效的前提是`domain`属性匹配。

（5）secure

`secure`属性用来指定Cookie只能在加密协议HTTPS下发送到服务器。

该属性只是一个开关，不需要指定值。如果通信是HTTPS协议，该开关自动打开。

（6）max-age

`max-age`属性用来指定Cookie有效期，比如`60 * 60 * 24 * 365`（即一年31536e3秒）。

（7）HttpOnly

`HttpOnly`属性用于设置该Cookie不能被JavaScript读取，详见下文的说明。

以上属性可以同时设置一个或多个，也没有次序的要求。如果服务器想改变一个早先设置的Cookie，必须同时满足四个条件：Cookie的`key`、`domain`、`path`和`secure`都匹配。也就是说，如果原始的Cookie是用如下的`Set-Cookie`设置的。

```http
Set-Cookie: key1=value1; domain=example.com; path=/blog
```

改变上面这个cookie的值，就必须使用同样的`Set-Cookie`。

```http
Set-Cookie: key1=value2; domain=example.com; path=/blog
```

只要有一个属性不同，就会生成一个全新的Cookie，而不是替换掉原来那个Cookie。

```http
Set-Cookie: key1=value2; domain=example.com; path=/
```

上面的命令设置了一个全新的同名Cookie，但是`path`属性不一样。下一次访问`example.com/blog`的时候，浏览器将向服务器发送两个同名的Cookie。

```http
Cookie: key1=value1; key1=value2
```

上面代码的两个Cookie是同名的，匹配越精确的Cookie排在越前面。

浏览器设置这些属性的写法如下。

```javascript
document.cookie = 'fontSize=14; '
  + 'expires=' + someDate.toGMTString() + '; '
  + 'path=/subdirectory; '
  + 'domain=*.example.com';
```

另外，这些属性只能用来设置Cookie。一旦设置完成，就没有办法读取这些属性的值。

删除一个Cookie的简便方法，就是设置`expires`属性等于0，或者等于一个过去的日期。

```javascript
document.cookie = 'fontSize=;expires=Thu, 01-Jan-1970 00:00:01 GMT';
```

上面代码中，名为`fontSize`的Cookie的值为空，过期时间设为1970年1月1月零点，就等同于删除了这个Cookie。

## Cookie的限制

浏览器对Cookie数量的限制，规定不一样。目前，Firefox是每个域名最多设置50个Cookie，而Safari和Chrome没有域名数量的限制。

所有Cookie的累加长度限制为4KB。超过这个长度的Cookie，将被忽略，不会被设置。

由于Cookie可能存在数量限制，有时为了规避限制，可以将cookie设置成下面的形式。

```http
name=a=b&c=d&e=f&g=h
```

上面代码实际上是设置了一个Cookie，但是这个Cookie内部使用`&`符号，设置了多部分的内容。因此，读取这个Cookie的时候，就要自行解析，得到多个键值对。这样就规避了cookie的数量限制。

## 同源政策

浏览器的同源政策规定，两个网址只要域名相同和端口相同，就可以共享Cookie。

注意，这里不要求协议相同。也就是说，`http://example.com`设置的Cookie，可以被`https://example.com`读取。

## Http-Only Cookie

设置Cookie的时候，如果服务器加上了`HttpOnly`属性，则这个Cookie无法被JavaScript读取（即`document.cookie`不会返回这个Cookie的值），只用于向服务器发送。

```http
Set-Cookie: key=value; HttpOnly
```

上面的这个Cookie将无法用JavaScript获取。进行AJAX操作时，`XMLHttpRequest`对象也无法包括这个Cookie。这主要是为了防止XSS攻击盗取Cookie。

