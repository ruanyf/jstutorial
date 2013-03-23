---
title: Error对象
layout: page
category: stdlib
date: 2013-03-23
modifiedOn: 2013-03-23
---

## 抛出错误

JavaScript的错误就是Error对象的实例。

throw命令可以用于抛出错误。

{% highlight javascript	%}

throw new Error ('Oops, there is a problem');
// Uncaught Error: Oops, there is a problem

{% endhighlight %}

如果没有相应的错误处理代码，这行命令会使得JavaScript运行中断，console中可以看到错误提示。

## try...catch结构

为了对错误进行处理，JavaScript提供了try...catch结构。

{% highlight javascript	%}

try {
   throw new Error ('Oops, there is a problem'); 
} catch ( e ) {
   console.log ( e.message + ' catched!');
}
// Oops, there is a problem catched!

{% endhighlight %}

try区块用于捕捉错误，catch区块用于处理错误。

还可以添加一个finally区块，用于放置不管是否发生错误，都要执行的代码。

{% highlight javascript	%}

try {
	    throw new Error ('Oops, there is a problem');
} catch ( e ) {
	    console.log ( e.message + ' catched!');
} finally {
	    console.log ( 'Code triggered at all times' );
}
// Oops, there is a problem catched!
// Code triggered at all times

{% endhighlight %}

如果要捕捉不同类型的错误，必须要在catch区块中进行区别判断。

{% highlight javascript	%}

try {
    throw new Error ('Oops, there is a problem');
} catch ( e ) {
    if ( e instanceof ReferenceError ) {
		// ... 
    } else if ( e instanceof TypeError ) {
		// ...
    }
} 

{% endhighlight %}

