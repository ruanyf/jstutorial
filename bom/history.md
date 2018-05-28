---
title: History 对象
layout: page
category: bom
date: 2012-12-22
modifiedOn: 2014-05-06
---

## 概述

`window.history`属性指向 History 对象，它表示当前窗口的浏览历史。

History 对象保存了当前窗口访问过的所有页面网址。下面代码表示当前窗口一共访问过3个网址。

```javascript
window.history.length // 3
```

由于安全原因，浏览器不允许脚本读取这些地址，但是允许在地址之间导航。

```javascript
// 后退到前一个网址
history.back()

// 等同于
history.go(-1)
```

浏览器工具栏的“前进”和“后退”按钮，其实就是对 History 对象进行操作。

## 属性

History 对象主要有两个属性。

- `History.length`：当前窗口访问过的网址数量（包括当前网页）
- `History.state`：History 堆栈最上层的状态值（详见下文）

## 方法

### History.back()、History.forward()、History.go()

这三个方法用于在历史之中移动。

- `History.back()`：移动到上一个网址，等同于点击浏览器的后退键。对于第一个访问的网址，该方法无效果。
- `History.forward()`：移动到下一个网址，等同于点击浏览器的前进键。对于最后一个访问的网址，该方法无效果。
- `History.go()`：接受一个整数作为参数，以当前网址为基准，移动到参数指定的网址，比如`go(1)`相当于`forward()`，`go(-1)`相当于`back()`。如果参数超过实际存在的网址范围，该方法无效果；如果不指定参数，默认参数为`0`，相当于刷新当前页面。

```javascript
history.back();
history.forward();
history.go(-2);
```

`history.go(0)`相当于刷新当前页面。

```javascript
history.go(0);记录
```

注意，移动到以前访问过的页面时，页面通常是从浏览器缓存之中加载，而不是重新要求服务器发送新的网页。

### History.pushState()，

`History.pushState()`方法用于在历史中添加一条记录。

```javascript
window.history.pushState(state, title, url)
```

该方法接受三个参数，依次为：

- `state`：一个与添加的记录相关联的状态对象，主要用于`popstate`事件。该事件触发时，该对象会传入回调函数。也就是说，浏览器会将这个对象序列化以后保留在本地，重新载入这个页面的时候，可以拿到这个对象。如果不需要这个对象，此处可以填`null`。
- `title`：新页面的标题。但是，现在所有浏览器都忽视这个参数，所以这里可以填空字符串。
- `url`：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址。

假定当前网址是`example.com/1.html`，使用`pushState()`方法在浏览记录（History 对象）中添加一个新记录。

```javascript
var stateObj = { foo: 'bar' };
history.pushState(stateObj, 'page 2', '2.html');
```

添加新记录后，浏览器地址栏立刻显示`example.com/2.html`，但并不会跳转到`2.html`，甚至也不会检查`2.html`是否存在，它只是成为浏览历史中的最新记录。这时，在地址栏输入一个新的地址(比如访问`google.com`)，然后点击了倒退按钮，页面的 URL 将显示`2.html`；你再点击一次倒退按钮，URL 将显示`1.html`。

总之，`pushState()`方法不会触发页面刷新，只是导致 History 对象发生变化，地址栏会有反应。

使用该方法之后，就可以用`History.state`属性读出状态对象。

```javascript
var stateObj = { foo: 'bar' };
history.pushState(stateObj, 'page 2', '2.html');
history.state // {foo: "bar"}
```

如果`pushState`的 URL 参数设置了一个新的锚点值（即`hash`），并不会触发`hashchange`事件。反过来，如果 URL 的锚点值变了，则会在 History 对象创建一条浏览记录。

如果`pushState()`方法设置了一个跨域网址，则会报错。

```javascript
// 报错
// 当前网址为 http://example.com
history.pushState(null, '', 'https://twitter.com/hello');
```

上面代码中，`pushState`想要插入一个跨域的网址，导致报错。这样设计的目的是，防止恶意代码让用户以为他们是在另一个网站上，因为这个方法不会导致页面跳转。

### History.replaceState()

`History.replaceState()`方法用来修改 History 对象的当前记录，其他都与`pushState()`方法一模一样。

假定当前网页是`example.com/example.html`。

```javascript
history.pushState({page: 1}, 'title 1', '?page=1')
// URL 显示为 http://example.com/example.html?page=1

history.pushState({page: 2}, 'title 2', '?page=2');
// URL 显示为 http://example.com/example.html?page=2

history.replaceState({page: 3}, 'title 3', '?page=3');
// URL 显示为 http://example.com/example.html?page=3

history.back()
// URL 显示为 http://example.com/example.html?page=1

history.back()
// URL 显示为 http://example.com/example.html

history.go(2)
// URL 显示为 http://example.com/example.html?page=3
```

## popstate 事件

每当同一个文档的浏览历史（即`history`对象）出现变化时，就会触发`popstate`事件。

注意，仅仅调用`pushState()`方法或`replaceState()`方法 ，并不会触发该事件，只有用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用`History.back()`、`History.forward()`、`History.go()`方法时才会触发。另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

使用的时候，可以为`popstate`事件指定回调函数。

```javascript
window.onpopstate = function (event) {
  console.log('location: ' + document.location);
  console.log('state: ' + JSON.stringify(event.state));
};

// 或者
window.addEventListener('popstate', function(event) {
  console.log('location: ' + document.location);
  console.log('state: ' + JSON.stringify(event.state));
});
```

回调函数的参数是一个`event`事件对象，它的`state`属性指向`pushState`和`replaceState`方法为当前 URL 所提供的状态对象（即这两个方法的第一个参数）。上面代码中的`event.state`，就是通过`pushState`和`replaceState`方法，为当前 URL 绑定的`state`对象。

这个`state`对象也可以直接通过`history`对象读取。

```javascript
var currentState = history.state;
```

注意，页面第一次加载的时候，浏览器不会触发`popstate`事件。

## URLSearchParams API

URLSearchParams API 用于处理 URL 之中的查询字符串，即问号之后的部分。没有部署这个API的浏览器，可以用[url-search-params](https://github.com/WebReflection/url-search-params)这个垫片库。

```javascript
var paramsString = 'q=URLUtils.searchParams&topic=api';
var searchParams = new URLSearchParams(paramsString);
```

URLSearchParams有以下方法，用来操作某个参数。

- `has()`：返回一个布尔值，表示是否具有某个参数
- `get()`：返回指定参数的第一个值
- `getAll()`：返回一个数组，成员是指定参数的所有值
- `set()`：设置指定参数
- `delete()`：删除指定参数
- `append()`：在查询字符串之中，追加一个键值对
- `toString()`：返回整个查询字符串

```javascript
var paramsString = 'q=URLUtils.searchParams&topic=api';
var searchParams = new URLSearchParams(paramsString);

searchParams.has('topic') // true
searchParams.get('topic') // "api"
searchParams.getAll('topic') // ["api"]

searchParams.get('foo') // null，注意Firefox返回空字符串
searchParams.set('foo', 2);
searchParams.get('foo') // 2

searchParams.append('topic', 'webdev');
searchParams.toString() // "q=URLUtils.searchParams&topic=api&foo=2&topic=webdev"

searchParams.append('foo', 3);
searchParams.getAll('foo') // [2, 3]

searchParams.delete('topic');
searchParams.toString() // "q=URLUtils.searchParams&foo=2&foo=3"
```

URLSearchParams还有三个方法，用来遍历所有参数。

- `keys()`：遍历所有参数名
- `values()`：遍历所有参数值
- `entries()`：遍历所有参数的键值对

上面三个方法返回的都是`Iterator`对象。

```javascript
var searchParams = new URLSearchParams('key1=value1&key2=value2');

for (var key of searchParams.keys()) {
  console.log(key);
}
// key1
// key2

for (var value of searchParams.values()) {
  console.log(value);
}
// value1
// value2

for (var pair of searchParams.entries()) {
  console.log(pair[0]+ ', '+ pair[1]);
}
// key1, value1
// key2, value2
```

在Chrome浏览器之中，`URLSearchParams`实例本身就是`Iterator`对象，与`entries`方法返回值相同。所以，可以写成下面的样子。

```javascript
for (var p of searchParams) {
  console.log(p);
}
```

下面是一个替换当前URL的例子。

```javascript
// URL: https://example.com?version=1.0
var params = new URLSearchParams(location.search.slice(1));
params.set('version', 2.0);

window.history.replaceState({}, '', `${location.pathname}?${params}`);
// URL: https://example.com?version=2.0
```

`URLSearchParams`实例可以当作 POST 数据发送，所有数据都会 URL 编码。

```javascript
let params = new URLSearchParams();
params.append('api_key', '1234567890');

fetch('https://example.com/api', {
  method: 'POST',
  body: params
}).then(...)
```

DOM的`a`元素节点的`searchParams`属性，就是一个`URLSearchParams`实例。

```javascript
var a = document.createElement('a');
a.href = 'https://example.com?filter=api';
a.searchParams.get('filter') // "api"
```

`URLSearchParams`还可以与`URL`接口结合使用。

```javascript
var url = new URL(location);
var foo = url.searchParams.get('foo') || 'somedefault';
```

## 参考链接

- MOZILLA DEVELOPER NETWORK，[Manipulating the browser history](https://developer.mozilla.org/en-US/docs/DOM/Manipulating_the_browser_history)
- MOZILLA DEVELOPER NETWORK，[window.onpopstate](https://developer.mozilla.org/en-US/docs/DOM/window.onpopstate)
- Johnny Simpson, [Controlling History: The HTML5 History API And ‘Selective’ Loading](http://www.inserthtml.com/2013/06/history-api/)
- Louis Lazaris, [HTML5 History API: A Syntax Primer](http://www.impressivewebs.com/html5-history-api-syntax/)
- Eric Bidelman, [Easy URL manipulation with URLSearchParams](https://developers.google.com/web/updates/2016/01/urlsearchparams?hl=en)
