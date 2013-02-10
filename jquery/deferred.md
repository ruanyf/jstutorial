---
title: jQuery.Deferred对象
category: jquery
date: 2012-12-07
layout: page
modifiedOn: 2013-02-04
---

## 概述

deferred对象是jQuery非同步操作的接口，你可以将它看作一个将来完成的任务。事实上，它扮演代理人（proxy）的角色，用来沟通那些还未完成或者已经完成的非同步操作，典型例子就是Ajax操作、网页动画、web worker等等。

deferred对象最简单的应用是，指定非同步操作成功或失败后的回调函数（callback）。根据deferred的术语，成功叫做resolve，失败叫做reject。

jQuery的所有Ajax操作函数，默认返回的就是一个deferred对象。

## deferred对象的方法

### $.deferred()方法

作用是生成一个deferred对象。

{% highlight javascript %}

var deferred = $.deferred();

{% endhighlight %}

### done() 和 fail() 

这两个方法都用来绑定回调函数。done()指定非同步操作成功后的回调函数，fail()指定失败后的回调函数。

{% highlight javascript %}

var deferred = $.Deferred();

deferred.done(function(value) {
   alert(value);
});

{% endhighlight %}

### resolve() 和 reject()

这两个方法用来改变deferred对象的状态。resolve()将状态改为非同步操作成功，reject()改为操作失败。

{% highlight javascript %}

var deferred = $.Deferred();

deferred.done(function(value) {
   alert(value);
});

deferred.resolve("hello world");

{% endhighlight %}

### state方法

该方法用来返回deferred对象目前的状态。

{% highlight javascript %}

var deferred = new $.Deferred();
deferred.state();  // "pending"
deferred.resolve();
deferred.state();  // "resolved"

{% endhighlight %}

该方法的返回值有三个：

- pending：表示操作还没有完成。
- resolved：表示操作成功。
- rejected：表示操作失败。

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

### then()

then()的作用也是指定回调函数，它可以接受三个参数，也就是三个回调函数。第一个参数是resolve时调用的回调函数，第二个参数是reject时调用的回调函数，第三个参数是progress()方法调用的回调函数。

{% highlight javascript %}

deferred.then( doneFilter [, failFilter ] [, progressFilter ] )

{% endhighlight %}

### always()

always()也是指定回调函数，不管是resolve或reject都要调用。

## promise对象

大多数情况下，我们不想让用户从外部更改deferred对象的状态。这时，你可以在deferred对象的基础上，返回一个针对它的promise对象。我们可以把后者理解成，promise是deferred的只读版，或者更通俗地理解成promise是一个对将要完成的任务的承诺。

你可以通过promise对象，为原始的deferred对象添加回调函数，查询它的状态，但是无法改变它的状态，也就是说promise对象不允许你调用resolve和reject方法。jQuery的ajax() 方法返回的就是一个promise对象。

{% highlight javascript %}

function getPromise(){
    return $.Deferred().promise();
}

try{
    getPromise().resolve("a");
}
catch(err){
    alert(err);
}

{% endhighlight %}

promise对象有一个then方法，允许指定当任务成功或失败后的回调函数。一般来说，如果我们要为一个任务指定回调函数，往往需要把回调函数直接传入这个任务。

{% highlight javascript %}

task(param, {
  success: function() {},
  error: function() {}
});

{% endhighlight %}

但是，如果这个任务返回的是promise对象，我们就可以用then方法指定回调函数。

{% highlight javascript %}

task(param).then(
  successFunc() {},
  errorFunc() {}
);

{% endhighlight %}

有了这个接口，可以方便地为多个操作连续指定回调函数，当调用第一个回调函数成功后，再依次调用第二个回调函数。

{% highlight javascript %}

task(param).then(f1).then(f2).then(f3);

{% endhighlight %}

除了Ajax操作，Animation类操作也可以使用promise对象。

{% highlight javascript %}

var promise = $('div.alert').fadeIn().promise();

{% endhighlight %}

## $.when()方法

$.when()接受多个deferred对象作为参数，当它们全部运行成功后，才调用resolved状态的回调函数，但只要其中有一个失败，就调用rejected状态的回调函数。它相当于将多个非同步操作，合并成一个。

{% highlight javascript %}

$.when(
    $.ajax( "/main.php" ),
    $.ajax( "/modules.php" ),
    $.ajax( "/lists.php" )
).then( successFunc, failureFunc );

{% endhighlight %}

## deferred对象的pipe()方法

pipe()方法用来在调用回调函数之前，修改非同步操作传回的值。

{% highlight javascript %}

var post = $.post("/echo/json/",
        {
            json: JSON.stringify({firstName: "Jose", lastName: "Romaniello"})
        }
    ).pipe(function(p){
        return "Saved " + p.firstName;
    });

post.done(function(r){ alert(r); });

{% endhighlight %}

举例来说，有时Ajax操作返回一个json字符串，里面有一个error属性，表示发生错误。这个时候，传统的方法只能是通过done()来判断是否发生错误。通过pipe()方法，可以让deferred对象调用fail()方法。

{% highlight javascript %}

var myXhrDeferred = $.post('/echo/json/', {json:JSON.stringify({'error':true})})
    .pipe(
        //done filter
        function (response) {
            if (response.error) {
                //If our response indicates an error
                //we'll return a rejected deferred with the response data
                return $.Deferred().reject(response);
            }
            return response;
        },
        //fail filter
        function () {
            //If the request failed (failing http status code)
            //we'll call this an error too — we pass back a
            //deferred that's rejected here as well.
            return $.Deferred().reject({error:true});
        }
    );

//Now our done and fail callbacks will run based on whether the JSON response returns error:true
myXhrDeferred
    .done(function (response) {
        $("#status").html("Success!");
    })
    .fail(function (response) {
        $("#status").html("An error occurred");
    });

{% endhighlight %}

## 实例

### setTimeout()的改写

我们可以用deferred对象改写setTimeout()

{% highlight javascript %}

$.wait = function(time) {
  return $.Deferred(function(dfd) {
    setTimeout(dfd.resolve, time);
  });
}

{% endhighlight %}

使用方法如下：

{% highlight javascript %}

$.wait(5000).then(function() {
  alert("Hello from the future!");
});

{% endhighlight %}

### 自定义操作使用deferred接口

我们可以利用deferred接口，使得任意操作都可以用done()和fail()指定回调函数。

{% highlight javascript %}

Twitter = {
  search:function(query) {
    var dfr = $.Deferred();
    $.ajax({
     url:"http://search.twitter.com/search.json",
     data:{q:query},
     dataType:'jsonp',
     success:dfr.resolve
    });
    return dfr.promise();
  }
}

{% endhighlight %}

使用方法如下：

{% highlight javascript %}

Twitter.search('intridea').then(function(data) {
  alert(data.results[0].text);
});

{% endhighlight %}

deferred对象的另一个优势是可以附加多个回调函数。

{% highlight javascript %}

function doSomething(arg) {
  var dfr = $.Deferred();
  setTimeout(function() {
    dfr.reject("Sorry, something went wrong.");
  });
  return dfr;
}

doSomething("uh oh").done(function() {
  alert("Won't happen, we're erroring here!");
}).fail(function(message) {
  alert(message)
});

{% endhighlight %}

## 参考链接

+ [jQuery.Deferred is the most important client-side tool you have](http://eng.wealthfront.com/2012/12/jquerydeferred-is-most-important-client.html)
+ [Fun With jQuery Deferred](http://www.intridea.com/blog/2011/2/8/fun-with-jquery-deferred)
- Bryan Klimt, [What’s so great about JavaScript Promises?](http://blog.parse.com/2013/01/29/whats-so-great-about-javascript-promises/)
- José F. Romaniello, [Understanding JQuery.Deferred and Promise](http://joseoncode.com/2011/09/26/a-walkthrough-jquery-deferred-and-promise/)
