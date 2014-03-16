---
title: 同域限制和window.postMessage方法
category: bom
layout: page
date: 2013-09-27
modifiedOn: 2013-09-27
---

所谓“同域限制”指的是，出于安全考虑，浏览器只允许脚本与同样协议、同样域名、同样端口的地址进行通信。

## window.postMessage方法

浏览器限制不同窗口（包括iFrame窗口）之间的通信，除非两个窗口装载的是同一个域名下的网页。window.postMessage方法就是为了解决这个问题而制定的API，可以让不同域名的窗口互相通信。

postMessage方法的格式如下：

{% highlight javascript %}

targetWindow.postMessage(message, targetURL[, transferObject]);

{% endhighlight %}

上面代码的targetWindow是指向目标窗口的变量，message是要发送的信息，targetURL是指定目标窗口的网址，不符合该网址就不发送信息，transferObject则是跟随信息一起发送的Transferable对象。

下面是一个postMessage方法的实例。

假定当前网页弹出一个新窗口。

{% highlight javascript %}

var popup = window.open(...popup details...);

{% endhighlight %}

然后在当前网页上监听message事件。

{% highlight javascript %}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
	if (event.origin !== "http://example.org")
    return;

	console.log(event.data);
}

{% endhighlight %}

上面代码指定message事件的回调函数为receiveMessage，一旦收到其他窗口发来的信息，receiveMessage函数就会被调用。receiveMessage函数接受一个event事件对象作为参数，该对象的origin属性表示信息的来源网址，如果该网址不符合要求，就立刻返回，不再进行下一步处理。event.data属性则包含了实际发送过来的信息。

event对象的属性除了origin和data，还有一个source属性，指向向当前网页发送信息的窗口对象。

接着，在当前网页上使用postMessage方法对新窗口发送信息。

{% highlight javascript %}

popup.postMessage("Hello World!", "http://example.org");

{% endhighlight %}

上面代码的postMessage方法的第一个参数是实际发送的信息，第二个参数是指定发送对象的域名必须是http://example.org。如果对方窗口不是这个域名，信息不会发送出去。

最后，在popup窗口中部署下面的代码。

{% highlight javascript %}

// popup窗口

function receiveMessage(event) {
  event.source.postMessage("Nice to see you!", "*");
}

window.addEventListener("message", receiveMessage, false);

{% endhighlight %}

上面代码有几个地方需要注意。首先，receiveMessage函数里面没有过滤信息的来源，任意网址发来的信息都会被处理。其次，postMessage方法中指定的目标窗口的网址是一个星号，表示该信息可以向任意网址发送。通常来说，这两种做法是不推荐的，因为不够安全，可能会被恶意利用。

所有浏览器都支持这个方法，但是IE 8和IE 9只允许postMessage方法与iFrame窗口通信，不能与新窗口通信。IE 10允许与新窗口通信，但是只能使用IE特有的[MessageChannel对象](http://msdn.microsoft.com/en-us/library/windows/apps/hh441303.aspx)。

## 参考链接

- Mozilla Developer Network, [Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/window.postMessage)
