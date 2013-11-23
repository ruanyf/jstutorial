---
title: 工具方法
layout: page
category: jquery
date: 2013-02-16
modifiedOn: 2013-11-23
---

## jQuery.proxy()

jQuery.proxy()类似于ECMAScript 5的bind方法，可以绑定函数的上下文（也就是this对象）和参数，返回一个新函数。

jQuery.proxy()的主要用处是为回调函数绑定上下文对象。

{% highlight javascript %}

var o = {
	type: "object",
	test: function(event) {
		console.log(this.type);
	}
};

$("#button")
  .on("click", o.test) // 无输出
  .on("click", $.proxy(o.test, o)) // object

{% endhighlight %}

上面的代码中，第一个回调函数没有绑定上下文，所以结果为空，没有任何输出；第二个回调函数将上下文绑定为对象o，结果就为object。

这个例子的另一种等价的写法是：

{% highlight javascript %}

$("#button").on( "click", $.proxy(o, test)) 

{% endhighlight %}

上面代码的$.proxy(o, test)的意思是，将o的方法test与o绑定。

这个例子表明，proxy方法的写法主要有两种。

{% highlight javascript %}

jQuery.proxy(function, context)

// or

jQuery.proxy(context, name)

{% endhighlight %}

第一种写法是为函数（function）指定上下文对象（context），第二种写法是指定上下文对象（context）和它的某个方法名（name）。

再看一个例子。正常情况下，下面代码中的this对象指向发生click事件的DOM对象。

{% highlight javascript %}

$('#myElement').click(function() {
    $(this).addClass('aNewClass');
});

{% endhighlight %}

如果我们想让回调函数延迟运行，使用setTimeout方法，代码就会出错，因为setTimeout使得回调函数在全局环境运行，this将指向全局对象。

{% highlight javascript %}

$('#myElement').click(function() {
    setTimeout(function() {
        $(this).addClass('aNewClass');
    }, 1000);
});

{% endhighlight %}

上面代码中的this，将指向全局对象window，导致出错。

这时，就可以用proxy方法，将this对象绑定到myElement对象。

{% highlight javascript %}

$('#myElement').click(function() {
    setTimeout($.proxy(function() {
        $(this).addClass('aNewClass'); 
    }, this), 1000);
});

{% endhighlight %}

## parseJSON方法

jQuery提供parseJSON方法，用于将JSON字符串解析为JavaScript对象，作用与原生的JSON.parse()类似。但是，jQuery没有提供类似JSON.stringify()的方法，即不提供将JavaScript对象转为JSON对象的方法。

## Ajax方法

直接定义在jQuery对象上面的Ajax方法（$.ajax()），用来处理Ajax操作。调用该方法后，浏览器就会发出一个HTTP请求。

$.ajax()的用法有多种，最常见的是提供一个对象参数。

{% highlight javascript %}

$.ajax({
  url: '/url/to/json',
  type: 'GET',
  dataType: 'json',
  success: successCallback,
  error: errorCallback
})

{% endhighlight %}

上面代码的对象参数有多个属性，含义如下：

- url：服务器端网址。
- type：向服务器发送信息所使用的HTTP动词，默认为GET。
- dataType：向服务器请求的数据类型。
- success：请求成功时的回调函数。
- error：请求失败时的回调函数。

这些参数之中，url可以独立出来，作为ajax方法的第一个参数。也就是说，上面代码还可以写成下面这样。

{% highlight javascript %}

$.ajax('/url/to/json',{
  type: 'GET',
  dataType: 'json',
  success: successCallback,
  error: errorCallback
})

{% endhighlight %}

ajax方法还有两个简便写法，即get方法和post方法，它们分别表示向服务器发出GET请求和POST请求。

{% highlight javascript %}

$.get( '/data/people.html', function(html){
  $('#target').html(html);
});

$.post('/data/save', {name: 'Rebecca'}, function (resp){
  console.log(JSON.parse(resp));
});

{% endhighlight %}

get方法接受两个参数，分别为服务器端网址和请求成功后的回调函数。post方法在这两个参数中间，还有一个参数，表示发给服务器的数据。

上面的post方法对应的ajax写法如下。

{% highlight javascript %}

$.ajax({
    type: 'POST',
    url: '/data/save',
    data: {name: 'Rebecca'},
    dataType: 'json',
    success: function (resp){
      console.log(JSON.parse(resp));
    }
});

{% endhighlight %}

ajax方法的另一个简便写法是getJSON方法。当服务器端返回JSON格式的数据，可以用这个方法代替ajax方法。

{% highlight javascript %}

$.getJSON('url/to/json', {'a': 1}, function(data){
	console.log(data);
});

{% endhighlight %}

上面的代码等同于下面的写法。

{% highlight javascript %}

$.ajax({
  dataType: "json",
  url: '/url/to/data',
  data: {'a': 1},
  success: function(data){
	console.log(data);
  }
});

{% endhighlight %}

ajax方法返回的是一个deferred对象，可以用then方法为该对象指定回调函数（详细解释参见《deferred对象》一节）。

{% highlight javascript %}

$.ajax({
  url: '/data/people.json',
  dataType: 'json'
})
.then(function (resp){
  console.log(resp.people);
})

{% endhighlight %}

由于浏览器存在“同域限制”，ajax方法只能向当前网页所在的域名发出HTTP请求。但是，通过在当前网页中插入script元素，可以向不同的域名发出GET请求，这种变通方法叫做JSONP（JSON with Padding）。

ajax方法可以发出JSONP请求，方法是在对象参数中指定dataType为JSONP。

{% highlight javascript %}

$.ajax({
  url: '/data/search.jsonp',
  data: {q: 'a'},
  dataType: 'jsonp',
  success: function(resp) {
    $('#target').html('Results: ' + resp.results.length);
  }
});)

{% endhighlight %}

JSONP的通常做法是，在所要请求的URL后面加在回调函数的名称。ajax方法规定，如果所请求的网址以类似“callback=?”的形式结尾，则自动采用JSONP形式。所以，上面的代码还可以写成下面这样。

{% highlight javascript %}

$.getJSON('/data/search.jsonp?q=a&callback=?',
  function(resp) {
    $('#target').html('Results: ' + resp.results.length);
  }
);

{% endhighlight %}

