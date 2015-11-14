---
title: jQuery.Deferred对象
category: jquery
date: 2012-12-07
layout: page
modifiedOn: 2013-12-19
---

## 概述

deferred对象代表了将要完成的某种操作，并提供了一些方法，帮助用户使用。它是jQuery对Promises接口的实现。jQuery的所有Ajax操作函数，默认返回的就是一个deferred对象。

简单说，Promises是异步操作的通用接口，扮演代理人（proxy）的角色，将异步操作包装成具有同步操作特性的特殊对象。异步操作的典型例子就是Ajax操作、网页动画、web worker等等。

由于JavaScript单线程的特点，如果某个操作耗时很长，其他操作就必需排队等待。为了避免整个程序失去响应，通常的解决方法是将那些排在后面的操作，写成“回调函数”（callback）的形式。这样做虽然可以解决问题，但是有一些显著缺点：

- 回调函数往往写成函数参数的形式，形成所谓的“持续传递风格”（即参数就是下一步操作，Continuation-passing style），导致函数的输入和输出非常混乱，整个程序的可阅读性差；
- 回调函数往往只能指定一个，如果有多个操作，就需要改写回调函数。
- 除了正常的报错机制，错误还可能通过回调函数的形式返回，增加了除错和调试的难度。
- 正常的函数输入和输出可以区分得很清楚，回调函数使得函数的输出不再重要。

Promises就是为了解决这些问题而提出的，它的主要目的就是取代回调函数，成为非同步操作的解决方案。它的核心思想就是让非同步操作返回一个对象，其他操作都针对这个对象来完成。比如，假定ajax操作返回一个Promise对象。

{% highlight javascript %}

var promise = get('http://www.example.com');

{% endhighlight %}

然后，Promise对象有一个then方法，可以用来指定回调函数。一旦非同步操作完成，就调用指定的回调函数。

{% highlight javascript %}

promise.then(function (content) {
  console.log(content)
})

{% endhighlight %}

可以将上面两段代码合并起来，这样程序的流程看得更清楚。

{% highlight javascript %}

get('http://www.example.com').then(function (content) {
  console.log(content)
})

{% endhighlight %}

在1.7版之前，jQuery的Ajax操作采用回调函数。

{% highlight javascript %}

$.ajax({
    url:"/echo/json/",
    success: function(response)
    {
       console.info(response.name);
    }
});

{% endhighlight %}

1.7版之后，Ajax操作直接返回Promise对象，这意味着可以用then方法指定回调函数。

{% highlight javascript %}

$.ajax({
    url: "/echo/json/",
}).then(function (response) {
    console.info(response.name);
});

{% endhighlight %}

## deferred对象的方法

### 基本用法

**（1）生成deferred对象**

第一步是通过$.Deferred()方法，生成一个deferred对象。

{% highlight javascript %}

var deferred = $.Deferred();

{% endhighlight %}

**（2）deferred对象的状态**

deferred对象有三种状态。

- pending：表示操作还没有完成。
- resolved：表示操作成功。
- rejected：表示操作失败。

state方法用来返回deferred对象当前状态。

{% highlight javascript %}

$.Deferred().state() // 'pending'
$.Deferred().resolve().state() // 'resolved'
$.Deferred().reject().state() // 'rejected'

{% endhighlight %}

**（3）改变状态的方法**

resolve方法将deferred对象的状态从pending改为resolved，reject方法则将状态从pending改为rejected。

{% highlight javascript %}

var deferred = $.Deferred();

deferred.resolve("hello world");

{% endhighlight %}

resolve方法的参数，用来传递给回调函数。

**（4）绑定回调函数**

deferred对象在状态改变时，会触发回调函数。 

done方法指定状态变为resolved（操作成功）时的回调函数；fail方法指定状态变为rejected（操作失败）时的回调函数；always方法指定，不管状态变为resolved或rejected，都会触发的方法。

{% highlight javascript %}

var deferred = $.Deferred();

deferred.done(function(value) {
   console.log(value);
}).resolve('hello world');
// hello world

{% endhighlight %}

上述三种方法都返回的原有的deferred对象，因此可以采用链式写法，在后面再链接别的方法（包括done和fail在内）。

{% highlight javascript %}

$.Deferred().done(f1).fail(f2).always(f3);

{% endhighlight %}

### notify() 和 progress()

progress()用来指定一个回调函数，当调用notify()方法时，该回调函数将执行。它的用意是提供一个接口，使得在非同步操作执行过程中，可以执行某些操作，比如定期返回进度条的进度。

{% highlight javascript %}

	var userProgress = $.Deferred();
    var $profileFields = $("input");
    var totalFields = $profileFields.length
        
    userProgress.progress(function (filledFields) {
        var pctComplete = (filledFields/totalFields)*100;
        $("#progress").html(pctComplete.toFixed(0));
    }); 

    userProgress.done(function () {
        $("#thanks").html("Thanks for completing your profile!").show();
    });
    
    $("input").on("change", function () {
        var filledFields = $profileFields.filter("[value!='']").length;
        userProgress.notify(filledFields);
        if (filledFields == totalFields) {
            userProgress.resolve();
        }
    });

{% endhighlight %}

### then方法

**（1）概述**

then方法的作用也是指定回调函数，它可以接受三个参数，也就是三个回调函数。第一个参数是resolve时调用的回调函数（相当于done方法），第二个参数是reject时调用的回调函数（相当于fail方法），第三个参数是progress()方法调用的回调函数。

{% highlight javascript %}

deferred.then( doneFilter [, failFilter ] [, progressFilter ] )

{% endhighlight %}

**（2）返回值**

在jQuery 1.8之前，then()只是.done().fail()写法的语法糖，两种写法是等价的。在jQuery 1.8之后，then()返回一个新的promise对象，而done()返回的是原有的deferred对象。如果then()指定的回调函数有返回值，该返回值会作为参数，传入后面的回调函数。

{% highlight javascript %}

var defer = jQuery.Deferred();

defer.done(function(a,b){
            return a * b;
}).done(function( result ) {
            console.log("result = " + result);
}).then(function( a, b ) {
            return a * b;
}).done(function( result ) {
            console.log("result = " + result);
}).then(function( a, b ) {
            return a * b;
}).done(function( result ) {
            console.log("result = " + result);
});

defer.resolve( 2, 3 );

{% endhighlight %}

在jQuery 1.8版本之前，上面代码的结果是：

{% highlight javascript %}

result = 2 
result = 2 
result = 2 

{% endhighlight %}

在jQuery 1.8版本之后，返回结果是

{% highlight javascript %}

result = 2 
result = 6 
result = NaN 

{% endhighlight %}

这一点需要特别引起注意。

{% highlight javascript %}

$.ajax( url1, { dataType: "json" } )
.then(function( data ) {
    return $.ajax( url2, { data: { user: data.userId } } );
}).done(function( data ) {
  // 从url2获取的数据
});

{% endhighlight %}

上面代码最后那个done方法，处理的是从url2获取的数据，而不是从url1获取的数据。

**（3）对返回值的修改**

利用then()会修改返回值这个特性，我们可以在调用其他回调函数之前，对前一步操作返回的值进行处理。

{% highlight javascript %}

var post = $.post("/echo/json/")
	.then(function(p){
        return p.firstName;
	});

post.done(function(r){ console.log(r); });

{% endhighlight %}

上面代码先使用then()方法，从返回的数据中取出所需要的字段（firstName），所以后面的操作就可以只处理这个字段了。

有时，Ajax操作返回json字符串里面有一个error属性，表示发生错误。这个时候，传统的方法只能是通过done()来判断是否发生错误。通过then()方法，可以让deferred对象调用fail()方法。

{% highlight javascript %}

var myDeferred = $.post('/echo/json/', {json:JSON.stringify({'error':true})})
    .then(function (response) {
            if (response.error) {
                return $.Deferred().reject(response);
            }
            return response;
        },function () {
            return $.Deferred().reject({error:true});
        }
    );

myDeferred.done(function (response) {
        $("#status").html("Success!");
    }).fail(function (response) {
        $("#status").html("An error occurred");
    });

{% endhighlight %}

上面代码中，不管是通信出错，或者服务器返回一个错误，都会调用reject方法，返回一个新的deferred对象，状态为rejected，因此就会触发fail方法指定的回调函数。

关于error的处理，jQuery的deferred对象与其他实现Promises规范的函数库有一个重大不同。就是说，如果deferred对象执行过程中，抛出一个非Promises对象的错误，那么将不会被后继的then方法指定的rejected回调函数捕获，而会一直传播到应用程序层面。为了代码行为与Promises规范保持一致，建议出错时，总是使用reject方法返回错误。

{% highlight javascript %}

d = $.Deferred()  
d.then(function(){  
  throw new Error('err')
}).fail(function(){
  console.log('fail')
})
d.resolve()
// Error: err
		
{% endhighlight %}

上面代码中，then的回调函数抛出一个错误，按照Promises规范，应该被fail方法的回调函数捕获，但是jQuery的部署是上升到应用程序的层面。

**（4）回调函数的返回值**

如果回调函数返回deferred对象，则then方法的返回值将是对应这个返回值的promise对象。

{% highlight javascript %}

var d1 = $.Deferred();

var promise = $.when('Hello').then(function(h){  
  return $.when(h,d1);
})

promise.done(function (s1,s2) {
	console.log(s1);
	console.log(s2);
})

d1.resolve('World')
// Hello
// World

{% endhighlight %}

上面代码中，done方法的回调函数，正常情况下只能接受一个参数。但是由于then方法的回调函数，返回一个when方法生成的deferred对象，导致它可以接受两个参数。

### pipe方法

pipe方法接受一个函数作为参数，表示在调用then方法、done方法、fail方法、always方法指定的回调函数之前，先运行pipe方法指定的回调函数。它通常用来对服务器返回的数据做初步处理。

### 与Promise A+规格的差异

Promise事实上的标准是社区提出的Promise A+规格，jQuery的实现并不完全符合Promise A+，主要是对错误的处理。

```javascript

var promise2 = promise1.then(function () {
    throw new Error("boom!");
});

```

上面代码在回调函数中抛出一个错误，Promise A+规定此时Promise实例的状态变为reject，该错误被下一个catch方法指定的回调函数捕获。但是，jQuery的Deferred对象此时不会改变状态，亦不会触发回调函数，该错误一般情况下会被window.onerror捕获。换句话说，在Deferred对象中，总是必须使用reject方法来改变状态。

## promise对象

**（1）概念**

一般情况下，从外部改变第三方完成的异步操作（比如Ajax）的状态是毫无意义的。为了防止用户这样做，可以在deferred对象的基础上，返回一个针对它的promise对象。

简单说，promise对象就是不能改变状态的deferred对象，也就是deferred的只读版。或者更通俗地理解成，promise是一个对将要完成的任务的承诺，排除了其他人破坏这个承诺的可能性，只能等待承诺方给出结果。

你可以通过promise对象，为原始的deferred对象添加回调函数，查询它的状态，但是无法改变它的状态，也就是说promise对象不允许你调用resolve和reject方法。

**（2）生成promise对象**

deferred对象的promise方法，用来生成对应的promise对象。

{% highlight javascript %}

function getPromise(){
    return $.Deferred().promise();
}

try{
    getPromise().resolve("a");
} catch(err) {
    console.log(err);
}
// TypeError

{% endhighlight %}

上面代码对promise对象，调用resolve方法，结果报错。

jQuery的`ajax()`方法返回的就是一个Promise对象。此外，Animation类操作也可以使用`promise`方法。

```javascript
$('body').toggle('blinds').promise().then(
  function(){
    $('body').toggle('blinds')
  }
)
```

## 辅助方法

deferred对象还有一系列辅助方法，使它更方便使用。

### $.when()方法

$.when()接受多个deferred对象作为参数，当它们全部运行成功后，才调用resolved状态的回调函数，但只要其中有一个失败，就调用rejected状态的回调函数。它相当于将多个非同步操作，合并成一个。实质上，when方法为多个deferred对象，返回一个单一的promise对象。

{% highlight javascript %}

$.when(
    $.ajax( "/main.php" ),
    $.ajax( "/modules.php" ),
    $.ajax( "/lists.php" )
).then(successFunc, failureFunc);

{% endhighlight %}

上面代码表示，要等到三个ajax操作都结束以后，才执行then方法指定的回调函数。

when方法里面要执行多少个操作，回调函数就有多少个参数，对应前面每一个操作的返回结果。

{% highlight javascript %}

$.when(
    $.ajax( "/main.php" ),
    $.ajax( "/modules.php" ),
    $.ajax( "/lists.php" )
).then(function (resp1, resp2, resp3){
	console.log(resp1);
	console.log(resp2);
	console.log(resp3);
});

{% endhighlight %}

上面代码的回调函数有三个参数，resp1、resp2和resp3，依次对应前面三个ajax操作的返回结果。

如果when方法的参数不是deferred或promise对象，则直接作为回调函数的参数。

{% highlight javascript %}

d = $.Deferred()  
$.when(d, 'World').done(function (s1, s2){
	console.log(s1);
	console.log(s2);
})

d.resolve('Hello') 
// Hello 
// World

{% endhighlight %}

上面代码中，when的第二个参数是一个字符串，则直接作为回调函数的第二个参数。

此外，如果when方法的参数都不是deferred或promise对象，那么when方法的回调函数将立即运行。

## 使用实例

### wait方法

我们可以用deferred对象写一个wait方法，表示等待多少毫秒后再执行。

{% highlight javascript %}

$.wait = function(time) {
  return $.Deferred(function(dfd) {
    setTimeout(dfd.resolve, time);
  });
}

{% endhighlight %}

使用方法如下。

{% highlight javascript %}

$.wait(5000).then(function() {
  console.log("Hello from the future!");
});

{% endhighlight %}

### 改写setTimeout

在上面的wait方法的基础上，还可以改写setTimeout方法，让其返回一个deferred对象。

{% highlight javascript %}

function doSomethingLater(fn, time) {
  var dfd = $.Deferred();
  setTimeout(function() {
    dfd.resolve(fn());
  }, time || 0);
  return dfd.promise();
}

var promise = doSomethingLater(function (){
  console.log( '已经延迟执行' );
}, 100);

{% endhighlight %}

### 自定义操作使用deferred接口

我们可以利用deferred接口，使得任意操作都可以用done()和fail()指定回调函数。

{% highlight javascript %}

Twitter = {
  search:function(query) {
    var dfd = $.Deferred();
    $.ajax({
     url:"http://search.twitter.com/search.json",
     data:{q:query},
     dataType:'jsonp',
     success:dfd.resolve
    });
    return dfd.promise();
  }
}

{% endhighlight %}

使用方法如下。

{% highlight javascript %}

Twitter.search('javaScript').then(function(data) {
  alert(data.results[0].text);
});

{% endhighlight %}

deferred对象的另一个优势是可以附加多个回调函数。下面的例子使用了上面所改写的setTimeout函数。

{% highlight javascript %}

function doSomething(arg) {
  var dfd = $.Deferred();
  setTimeout(function() {
    dfd.reject("Sorry, something went wrong.");
  });
  return dfd;
}

doSomething("uh oh").done(function() {
  console.log("Won't happen, we're erroring here!");
}).fail(function(message) {
  console.log(message);
});

{% endhighlight %}

## 参考链接

- Matt Baker, [jQuery.Deferred is the most important client-side tool you have](http://eng.wealthfront.com/2012/12/jquerydeferred-is-most-important-client.html)
- [Fun With jQuery Deferred](http://www.intridea.com/blog/2011/2/8/fun-with-jquery-deferred)
- Bryan Klimt, [What’s so great about JavaScript Promises?](http://blog.parse.com/2013/01/29/whats-so-great-about-javascript-promises/)
- José F. Romaniello, [Understanding JQuery.Deferred and Promise](http://joseoncode.com/2011/09/26/a-walkthrough-jquery-deferred-and-promise/)
- Julian Aubourg, Addy Osmani, [Creating Responsive Applications Using jQuery Deferred and Promises](http://msdn.microsoft.com/en-us/magazine/gg723713.aspx)
- Graham Jenson, [JQuery Promises and Deferreds: I promise this will be short](http://maori.geek.nz/post/i_promise_this_will_be_short)
- Q module document, [Coming from jQuery](https://github.com/kriskowal/q/wiki/Coming-from-jQuery) 
