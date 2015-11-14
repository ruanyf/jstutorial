---
title: jQuery工具方法
layout: page
category: jquery
date: 2013-02-16
modifiedOn: 2014-01-12
---

jQuery函数库提供了一个jQuery对象（简写为$），这个对象本身是一个构造函数，可以用来生成jQuery对象的实例。有了实例以后，就可以调用许多针对实例的方法，它们定义jQuery.prototype对象上面（简写为$.fn）。

除了实例对象的方法以外，jQuery对象本身还提供一些方法（即直接定义jQuery对象上面），不需要生成实例就能使用。由于这些方法类似“通用工具”的性质，所以我们把它们称为“工具方法”（utilities）。

## 常用工具方法

**（1）$.trim**

$.trim方法用于移除字符串头部和尾部多余的空格。

{% highlight javascript %}

$.trim('   Hello   ') // Hello

{% endhighlight %}


**（2）$.contains**

$.contains方法返回一个布尔值，表示某个DOM元素（第二个参数）是否为另一个DOM元素（第一个参数）的下级元素。

{% highlight javascript %}

$.contains(document.documentElement, document.body); 
// true

$.contains(document.body, document.documentElement); 
// false

{% endhighlight %}

**（3）$.each，$.map**

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

$.map方法也是用来遍历数组和对象，但是会返回一个新对象。

{% highlight javascript %}

var a = ["a", "b", "c", "d", "e"];
a = $.map(a, function (n, i){
  return (n.toUpperCase() + i);
});
// ["A0", "B1", "C2", "D3", "E4"]

{% endhighlight %}

**（4）$.inArray**

$.inArray方法返回一个值在数组中的位置（从0开始）。如果该值不在数组中，则返回-1。

{% highlight javascript %}

var a = [1,2,3,4];
$.inArray(4,a) // 3

{% endhighlight %}

**（5）$.extend**

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

**（6）$.proxy**

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

**（7）$.data，$.removeData**

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

$.removeData方法用于移除$.data方法所储存的数据。

{% highlight javascript %}

$.data(div, "test1", "VALUE-1");
$.removeData(div, "test1");

{% endhighlight %}

**（8）$.parseHTML，$.parseJSON，$.parseXML**

$.parseHTML方法用于将字符串解析为DOM对象。

$.parseJSON方法用于将JSON字符串解析为JavaScript对象，作用与原生的JSON.parse()类似。但是，jQuery没有提供类似JSON.stringify()的方法，即不提供将JavaScript对象转为JSON对象的方法。

$.parseXML方法用于将字符串解析为XML对象。

{% highlight javascript %}

var html = $.parseHTML("hello, <b>my name is</b> jQuery.");
var obj = $.parseJSON('{"name": "John"}');

var xml = "<rss version='2.0'><channel><title>RSS Title</title></channel></rss>";
var xmlDoc = $.parseXML(xml);

{% endhighlight %}

**（9）$.makeArray**

$.makeArray方法将一个类似数组的对象，转化为真正的数组。

{% highlight javascript %}

var a = $.makeArray(document.getElementsByTagName("div"));

{% endhighlight %}

**（10）$.merge**

$.merge方法用于将一个数组（第二个参数）合并到另一个数组（第一个参数）之中。

{% highlight javascript %}

var a1 = [0,1,2];
var a2 = [2,3,4];
$.merge(a1, a2);

a1
// [0, 1, 2, 2, 3, 4]

{% endhighlight %}

**（11）$.now**

$.now方法返回当前时间距离1970年1月1日00:00:00 UTC对应的毫秒数，等同于(new Date).getTime()。

{% highlight javascript %}

$.now()
// 1388212221489

{% endhighlight %}

## 判断数据类型的方法

jQuery提供一系列工具方法，用来判断数据类型，以弥补JavaScript原生的typeof运算符的不足。以下方法对参数进行判断，返回一个布尔值。

- jQuery.isArray()：是否为数组。
- jQuery.isEmptyObject()：是否为空对象（不含可枚举的属性）。
- jQuery.isFunction()：是否为函数。
- jQuery.isNumeric()：是否为数值（整数或浮点数）。
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

除了上面这些方法以外，还有一个$.type方法，可以返回一个变量的数据类型。它的实质是用Object.prototype.toString方法读取对象内部的[[Class]]属性（参见《标准库》的Object对象一节）。

{% highlight javascript %}

$.type(/test/) // "regexp"

{% endhighlight %}

## Ajax操作

### $.ajax

jQuery对象上面还定义了Ajax方法（$.ajax()），用来处理Ajax操作。调用该方法后，浏览器就会向服务器发出一个HTTP请求。

$.ajax()的用法主要有两种。

```javascript

$.ajax(url[, options])
$.ajax([options])

```

上面代码中的url，指的是服务器网址，options则是一个对象参数，设置Ajax请求的具体参数。

```javascript

$.ajax({
  async: true,
  url: '/url/to/json',
  type: 'GET',
  data : { id : 123 },
  dataType: 'json',
  timeout: 30000,
  success: successCallback,
  error: errorCallback,
  complete: completeCallback,
  statusCode: {
        404: handler404,
        500: handler500
  }
})

function successCallback(json) {
	$('<h1/>').text(json.title).appendTo('body');
}

function errorCallback(xhr, status){
	console.log('出问题了！');
}

function completeCallback(xhr, status){
	console.log('Ajax请求已结束。');
}

```

上面代码的对象参数有多个属性，含义如下：

- accepts：将本机所能处理的数据类型，告诉服务器。
- async：该项默认为true，如果设为false，则表示发出的是同步请求。
- beforeSend：指定发出请求前，所要调用的函数，通常用来对发出的数据进行修改。
- cache：该项默认为true，如果设为false，则浏览器不缓存返回服务器返回的数据。注意，浏览器本身就不会缓存POST请求返回的数据，所以即使设为false，也只对HEAD和GET请求有效。
- complete：指定当HTTP请求结束时（请求成功或请求失败的回调函数，此时已经运行完毕）的回调函数。不管请求成功或失败，该回调函数都会执行。它的参数为发出请求的原始对象以及返回的状态信息。
- contentType：发送到服务器的数据类型。
- context：指定一个对象，作为所有Ajax相关的回调函数的this对象。
- crossDomain：该属性设为true，将强制向相同域名发送一个跨域请求（比如JSONP）。
- data：向服务器发送的数据，如果使用GET方法，此项将转为查询字符串，附在网址的最后。
- dataType：向服务器请求的数据类型，可以设为text、html、script、json、jsonp和xml。
- error：请求失败时的回调函数，函数参数为发出请求的原始对象以及返回的状态信息。
- headers：指定HTTP请求的头信息。
- ifModified：如果该属性设为true，则只有当服务器端的内容与上次请求不一样时，才会发出本次请求。
- jsonp：指定JSONP请求“callback=?”中的callback的名称。
- jsonpCallback: 指定JSONP请求中回调函数的名称。
- mimeType：指定HTTP请求的mime type。
- password：指定HTTP认证所需要的密码。
- statusCode：值为一个对象，为服务器返回的状态码，指定特别的回调函数。
- success：请求成功时的回调函数，函数参数为服务器传回的数据、状态信息、发出请求的原始对象。
- timeout: 等待的最长毫秒数。如果过了这个时间，请求还没有返回，则自动将请求状态改为失败。
- type：向服务器发送信息所使用的HTTP动词，默认为GET，其他动词有POST、PUT、DELETE。
- url：服务器端网址。这是唯一必需的一个属性，其他属性都可以省略。
- username：指定HTTP认证的用户名。
- xhr：指定生成XMLHttpRequest对象时的回调函数。

这些参数之中，url可以独立出来，作为ajax方法的第一个参数。也就是说，上面代码还可以写成下面这样。

{% highlight javascript %}

$.ajax('/url/to/json',{
  type: 'GET',
  dataType: 'json',
  success: successCallback,
  error: errorCallback
})

{% endhighlight %}

作为向服务器发送的数据，data属性也可以写成一个对象。

```javascript

$.ajax({
  url: '/remote/url',
  data: {
    param1: 'value1',
    param2: 'value2',
    ...
  }
});

// 相当于
$.ajax({
    url: '/remote/url?param1=value1&param2=value2...'
}});

```

### 简便写法

ajax方法还有一些简便写法。

- $.get()：发出GET请求。
- $.getScript()：读取一个JavaScript脚本文件并执行。
- $.getJSON()：发出GET请求，读取一个JSON文件。
- $.post()：发出POST请求。
- $.fn.load()：读取一个html文件，并将其放入当前元素之中。

一般来说，这些简便方法依次接受三个参数：url、数据、成功时的回调函数。

**（1）$.get()，$.post()**

这两个方法分别对应HTTP的GET方法和POST方法。

{% highlight javascript %}

$.get('/data/people.html', function(html){
  $('#target').html(html);
});

$.post('/data/save', {name: 'Rebecca'}, function (resp){
  console.log(JSON.parse(resp));
});

{% endhighlight %}

get方法和post方法的参数相同，第一个参数是服务器网址，该参数是必需的，其他参数都是可选的。第二个参数是发送给服务器的数据，第三个参数是操作成功后的回调函数。

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

**（2）$.getJSON()**

ajax方法的另一个简便写法是getJSON方法。当服务器端返回JSON格式的数据，可以用这个方法代替$.ajax方法。

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

**（3）$.getScript()**

$.getScript方法用于从服务器端加载一个脚本文件。

{% highlight javascript %}

$.getScript('/static/js/myScript.js', function() {
	functionFromMyScript();
});

{% endhighlight %}

上面代码先从服务器加载myScript.js脚本，然后在回调函数中执行该脚本提供的函数。

getScript的回调函数接受三个参数，分别是脚本文件的内容，HTTP响应的状态信息和ajax对象实例。

{% highlight javascript %}

$.getScript( "ajax/test.js", function (data, textStatus, jqxhr){
  console.log( data ); // test.js的内容
  console.log( textStatus ); // Success
  console.log( jqxhr.status ); // 200
});

{% endhighlight %}

getScript是ajax方法的简便写法，因此返回的是一个deferred对象，可以使用deferred接口。

{% highlight javascript %}

jQuery.getScript("/path/to/myscript.js")
	.done(function() {
		// ...
	})
	.fail(function() {
		// ...
});

{% endhighlight %}

**（4）$.fn.load()**

$.fn.load不是jQuery的工具方法，而是定义在jQuery对象实例上的方法，用于获取服务器端的HTML文件，将其放入当前元素。由于该方法也属于ajax操作，所以放在这里一起讲。

{% highlight javascript %}

$('#newContent').load('/foo.html');

{% endhighlight %}

$.fn.load方法还可以指定一个选择器，将远程文件中匹配选择器的部分，放入当前元素，并指定操作完成时的回调函数。

{% highlight javascript %}

$('#newContent').load('/foo.html #myDiv h1:first',
	function(html) {
		console.log('内容更新！');
});

{% endhighlight %}

上面代码只加载foo.html中匹配“#myDiv h1:first”的部分，加载完成后会运行指定的回调函数。

```javascript

$('#main-menu a').click(function(event) {
   event.preventDefault();

   $('#main').load(this.href + ' #main *');
});

```

上面的代码将指定网页中匹配“#main *”，加载入当前的main元素。星号表示匹配main元素包含的所有子元素，如果不加这个星号，就会加载整个main元素（包括其本身），导致一个main元素中还有另一个main元素。

load方法可以附加一个字符串或对象作为参数，一起向服务器提交。如果是字符串，则采用GET方法提交；如果是对象，则采用POST方法提交。

```javascript

$( "#feeds" ).load( "feeds.php", { limit: 25 }, function() {
  console.log( "已经载入" );
});

```

上面代码将`{ limit: 25 }`通过POST方法向服务器提交。

load方法的回调函数，可以用来向用户提示操作已经完成。

```javascript

$('#main-menu a').click(function(event) {
   event.preventDefault();
 
   $('#main').load(this.href + ' #main *', function(responseText, status) {
      if (status === 'success') {
         $('#notification-bar').text('加载成功！');
      } else {
         $('#notification-bar').text('出错了！');
      }
   });
});

```

### Ajax事件

jQuery提供以下一些方法，用于指定特定的AJAX事件的回调函数。

- .ajaxComplete()：ajax请求完成。
- .ajaxError()：ajax请求出错。
- .ajaxSend()：ajax请求发出之前。
- .ajaxStart()：第一个ajax请求开始发出，即没有还未完成ajax请求。
- .ajaxStop()：所有ajax请求完成之后。
- .ajaxSuccess()：ajax请求成功之后。

下面是示例。

```javascript
$('#loading_indicator')
.ajaxStart(function (){$(this).show();})
.ajaxStop(function (){$(this).hide();});
```

下面是处理Ajax请求出错（返回404或500错误）的例子。

```javascript
$(document).ajaxError(function (e, xhr, settings, error) {
  console.log(error);
});
```

### 返回值

ajax方法返回的是一个deferred对象，可以用then方法为该对象指定回调函数（详细解释参见《deferred对象》一节）。

{% highlight javascript %}

$.ajax({
  url: '/data/people.json',
  dataType: 'json'
}).then(function (resp){
  console.log(resp.people);
})

{% endhighlight %}

### JSONP

由于浏览器存在“同域限制”，ajax方法只能向当前网页所在的域名发出HTTP请求。但是，通过在当前网页中插入script元素（\<script\>），可以向不同的域名发出GET请求，这种变通方法叫做JSONP（JSON with Padding）。

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

### 文件上传

假定网页有一个文件控件。

```html

<input type="file" id="test-input">

```

下面就是如何使用Ajax上传文件。

```javascript

var file = $('#test-input')[0].files[0];
var formData = new FormData();

formData.append('file', file);

$.ajax('myserver/uploads', {
  method: 'POST',
  contentType: false,
  processData: false,
  data: formData
});

```

上面代码是将文件作为表单数据发送。除此之外，也可以直接发送文件。

```javascript

var file = $('#test-input')[0].files[0];

$.ajax('myserver/uploads', {
  method: 'POST',
  contentType: file.type,
  processData: false,
  data: file
});

```

## 参考链接

- David Walsh, [Loading Scripts with jQuery](http://davidwalsh.name/loading-scripts-jquery)
- Nguyen Huu Phuoc, [Best jQuery practices](http://programer.tips/2014/09/best-jquery-practices.html)
