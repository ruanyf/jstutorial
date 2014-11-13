---
title: 同域限制和window.postMessage方法
category: bom
layout: page
date: 2013-09-27
modifiedOn: 2013-09-27
---

## 概述

所谓“同域限制”指的是，出于安全考虑，浏览器只允许脚本与同样协议、同样端口、同样域名的地址进行通信。比如，www1.example.com页面上面的脚本，只能与该域名（相同协议、相同端口）进行通信，如果与www2.example.com通信，浏览器就会报错（不过可以设置两者的document.domain为相同的值）。这是为了防止恶意脚本将用户信息发往第三方网站。

window.postMessage方法就是用来在某种程度上，绕过同域限制，实现不同域名的窗口（包括iframe窗口）之间的通信。它的格式如下。

{% highlight javascript %}

targetWindow.postMessage(message, targetURL[, transferObject]);

{% endhighlight %}

上面代码的targetWindow是指向目标窗口的变量，message是要发送的信息，targetURL是指定目标窗口的网址，不符合该网址就不发送信息，transferObject则是跟随信息一起发送的Transferable对象。

下面是一个postMessage方法的实例。假定当前网页弹出一个新窗口。

{% highlight javascript %}

var popup = window.open(...popup details...);

popup.postMessage("Hello World!", "http://example.org");

{% endhighlight %}

上面代码的postMessage方法的第一个参数是实际发送的信息，第二个参数是指定发送对象的域名必须是example.org。如果对方窗口不是这个域名，信息不会发送出去。

然后，在当前网页上监听message事件。

{% highlight javascript %}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
	if (event.origin !== "http://example.org")
    return;

	if (event.data == 'Hello World') {
      event.source.postMessage('Hello', event.origin);
    } else {
      console.log(event.data);
    }

}

{% endhighlight %}

上面代码指定message事件的回调函数为receiveMessage，一旦收到其他窗口发来的信息，receiveMessage函数就会被调用。receiveMessage函数接受一个event事件对象作为参数，该对象的origin属性表示信息的来源网址，如果该网址不符合要求，就立刻返回，不再进行下一步处理。event.data属性则包含了实际发送过来的信息，event.source属性，指向当前网页发送信息的窗口对象。

最后，在popup窗口中部署下面的代码。

```javascript

// popup窗口

function receiveMessage(event) {
  event.source.postMessage("Nice to see you!", "*");
}

window.addEventListener("message", receiveMessage, false);

```

上面代码有几个地方需要注意。首先，receiveMessage函数里面没有过滤信息的来源，任意网址发来的信息都会被处理。其次，postMessage方法中指定的目标窗口的网址是一个星号，表示该信息可以向任意网址发送。通常来说，这两种做法是不推荐的，因为不够安全，可能会被恶意利用。

所有浏览器都支持这个方法，但是IE 8和IE 9只允许postMessage方法与iFrame窗口通信，不能与新窗口通信。IE 10允许与新窗口通信，但是只能使用IE特有的[MessageChannel对象](http://msdn.microsoft.com/en-us/library/windows/apps/hh441303.aspx)。

## iframe与主页面的通信

iframe中的网页，如果与主页面来自同一个域，通过设置document.domain属性，可以使用postMessage方法实现双向通信。

下面是一个LocalStorage的例子。LocalStorage只能用同一个域名的网页读写，但是如果iframe是主页面的子域名，主页面就可以通过postMessage方法，读写iframe网页设置的LocalStorage数据。

iframe页面的代码如下。

```javascript

document.domain = "domain.com";
window.onmessage = function(e) {
  if (e.origin !== "http://domain.com") {
    return;
  }
  var payload = JSON.parse(e.data);
  localStorage.setItem(payload.key, JSON.stringify(payload.data));
};

```

主页面的代码如下。

```javascript

window.onload = function() {
    var win = document.getElementsByTagName('iframe')[0].contentWindow;
    var obj = {
       name: "Jack"
    };
    win.postMessage(JSON.stringify({key: 'storage', data: obj}), "*");
};

```

上面的代码已经可以实现，主页面向iframe传入数据。如果还想读取或删除数据，可以进一步加强代码。

加强版的iframe代码如下。

```javascript

document.domain = "domain.com";
window.onmessage = function(e) {
    if (e.origin !== "http://domain.com") {
        return;
    }
    var payload = JSON.parse(e.data);
    switch(payload.method) {
        case 'set':
            localStorage.setItem(payload.key, JSON.stringify(payload.data));
            break;
        case 'get':
            var parent = window.parent;
            var data = localStorage.getItem(payload.key);
            parent.postMessage(data, "*");
            break;
        case 'remove':
            localStorage.removeItem(payload.key);
            break;
    }
};

```

加强版的主页面代码如下。

```javascript

window.onload = function() {
    var win = document.getElementsByTagName('iframe')[0].contentWindow;
    var obj = {
       name: "Jack"
    };
    // 存入对象
    win.postMessage(JSON.stringify({key: 'storage', method: "set", data: obj}), "*");
    // 读取以前存取的对象
    win.postMessage(JSON.stringify({key: 'storage', method: "get"}), "*");
    window.onmessage = function(e) {
        if (e.origin != "http://sub.domain.com") {
            return;
        }
        // 下面会输出"Jack"
        console.log(JSON.parse(e.data).name);
    };
};

```

## 参考链接

- Mozilla Developer Network, [Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/window.postMessage)
- Jakub Jankiewicz, [Cross-Domain LocalStorage](http://jcubic.wordpress.com/2014/06/20/cross-domain-localstorage/)
- David Baron, [setTimeout with a shorter delay](http://dbaron.org/log/20100309-faster-timeouts): 利用window.postMessage可以实现0毫秒触发回调函数
