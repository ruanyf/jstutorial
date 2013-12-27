---
title: 工具方法
layout: page
category: jquery
date: 2013-02-16
modifiedOn: 2013-12-27
---

jQuery函数库提供了一个jQuery对象（简写为$），这个对象本身是一个构造函数，可以用来生成jQuery对象的实例。有了实例以后，就可以调用许多针对实例的方法，它们定义jQuery.prototype对象上面（简写为$.fn）。

除了实例对象的方法以外，jQuery对象本身还提供一些方法（即直接定义jQuery对象上面），不需要生成实例就能使用。由于这些方法类似“通用工具”的性质，所以我们把它们称为“工具方法”（utilities）。

## 常用工具方法

（1）$.trim

$.trim方法用于移除字符串头部和尾部多余的空格。

{% highlight javascript %}

$.trim('   Hello   ') // Hello

{% endhighlight %}

（2）$.each

$.each方法用于遍历数组和对象，然后返回原始对象。它接受两个参数，分别是数据集合和回调函数。

{% highlight javascript %}

$.each([ 52, 97 ], function( index, value ) {
  console.log( index + ": " + value );
});
// 0: 52 
// 1: 97 

var obj = {
  p1: "hello",
  p2: "world"
};
$.each( obj, function( key, value ) {
  console.log( key + ": " + value );
});
// p1: hello
// p2: world

{% endhighlight %}

需要注意的，jQuery对象实例也有一个each方法（$.fn.each），两者的作用差不多。

（3）$.inArray

$.inArray方法返回一个值在数组中的位置（从0开始）。如果该值不在数组中，则返回-1。

{% highlight javascript %}

var a = [1,2,3,4];
$.inArray(4,a) // 3

{% endhighlight %}

（4）$.extend

$.extend方法用于将多个对象合并进第一个对象。

{% highlight javascript %}

var o1 = {p1:'a',p2:'b'};
var o2 = {p1:'c'};

$.extend(o1,o2);
o1.p1 // "c"

{% endhighlight %}

$.extend的另一种用法是生成一个新对象，用来继承原有对象。这时，它的第一个参数应该是一个空对象。

{% highlight javascript %}

var o1 = {p1:'a',p2:'b'};
var o2 = {p1:'c'};

var o = $.extend({},o1,o2);
o
// Object {p1: "c", p2: "b"}

{% endhighlight %}

默认情况下，extend方法生成的对象是“浅拷贝”，也就是说，如果某个属性是对象或数组，那么只会生成指向这个对象或数组的指针，而不会复制值。如果想要“深拷贝”，可以在extend方法的第一个参数传入布尔值true。

{% highlight javascript %}

var o1 = {p1:['a','b']};

var o2 = $.extend({},o1);
var o3 = $.extend(true,{},o1);

o1.p1[0]='c';

o2.p1 // ["c", "b"]
o3.p1 // ["a", "b"] 

{% endhighlight %}

上面代码中，o2是浅拷贝，o3是深拷贝。结果，改变原始数组的属性，o2会跟着一起变，而o3不会。

**（5）$.proxy**

$.proxy方法类似于ECMAScript 5的bind方法，可以绑定函数的上下文（也就是this对象）和参数，返回一个新函数。

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

**（6）$.parseJSON**

$.parseJSON方法用于将JSON字符串解析为JavaScript对象，作用与原生的JSON.parse()类似。但是，jQuery没有提供类似JSON.stringify()的方法，即不提供将JavaScript对象转为JSON对象的方法。

## 判断数据类型的方法

jQuery提供一系列工具方法，用来判断数据类型，以弥补JavaScript原生的typeof运算符的不足。以下方法对参数进行判断，返回一个布尔值。

- jQuery.isArray()：是否为数组。
- jQuery.isEmptyObject()：是否为空对象（不含可枚举的属性）。
- jQuery.isFunction()：是否为函数。
- jQuery.isNumeric()：是否为数组。
- jQuery.isPlainObject()：是否为使用“{}”或“new Object”生成的对象，而不是浏览器原生提供的对象。
- jQuery.isWindow()：是否为window对象。
- jQuery.isXMLDoc()：判断一个DOM节点是否处于XML文档之中。

下面是一些例子。

{% highlight javascript %}

$.isEmptyObject({}) // true
$.isPlainObject(document.location) // false
$.isWindow(window) // true
$.isXMLDoc(document.body) // false

{% endhighlight %}

## 数据储存方法

$.data方法可以用来在DOM节点上储存数据。

{% highlight javascript %}

// 存入数据
$.data(document.body, "foo", 52 );

// 读取数据
$.data(document.body, "foo");

// 读取所有数据
$.data(document.body);

{% endhighlight %}

上面代码在网页元素body上储存了一个键值对，键名为“foo”，键值为52。

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

