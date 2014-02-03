---
title: 错误处理机制
layout: page
category: grammar
date: 2013-08-30
modifiedOn: 2013-12-07
---

## Error对象

一旦代码解析或运行时发生错误，JavaScript引擎就会自动产生并抛出一个Error对象的实例，然后整个程序就中断在发生错误的地方。

Error对象的实例有两个最基本的属性：

- **name**：错误名称
- **message**：错误提示信息

利用这两个属性，可以对发生什么错误有一个大概的了解。

{% highlight javascript %}

if (error.name){
	console.log(error.name + ": " + error.message);
}

{% endhighlight %}

上面代码表示，显示错误的名称以及出错提示信息。 

除了Error对象，JavaScript还定义了其他6种错误，也就是说，存在Error的6个衍生对象。

- **EvalError**：执行代码时发生的错误。
- **RangeError**：当一个数值型变量或参数超出有效范围时发生的错误。
- **ReferenceError**：引用一个不存在的变量时发生的错误。
- **SyntaxError**：解析代码时发生的语法错误。
- **TypeError**：变量或参数的类型无效时发生的错误。
- **URIError**：向encodeURI() 或者 decodeURI() 传入无效参数时发生的错误。

这6种衍生错误，连同原始的Error对象，都是构造函数。开发者可以使用它们，人为生成错误对象的实例。

{% highlight javascript %}

new Error("出错了！");
new RangeError("出错了，变量超出有效范围！");
new TypeError("出错了，变量类型无效！");

{% endhighlight %}

上面代码表示新建错误对象的实例，实质就是手动抛出错误。可以看到，错误对象的构造函数接受一个参数，代表错误提示信息（message）。

除了JavaScript内建的7种错误对象，还可以定义自己的错误对象。

{% highlight javascript %}

function UserError(message) {
   this.message = message || "默认信息";
   this.name = "UserError";
}

UserError.prototype = new Error();
UserError.prototype.constructor = UserError;

{% endhighlight %}

上面代码自定义一个错误对象UserError，让它继承Error对象。然后，就可以生成这种自定义的错误了。

{% highlight javascript %}

new UserError("这是自定义的错误！");

{% endhighlight %}

## throw语句

throw语句的作用是中断程序执行，抛出一个意外或错误。它接受一个表达式作为参数。

{% highlight javascript %}

throw "Error！"; 
throw 42;
throw true;
throw {toString: function() { return "Error!"; } };

{% endhighlight %}

上面代码表示，throw可以接受各种值作为参数。JavaScript引擎一旦遇到throw语句，就会停止执行后面的语句，并将throw语句的参数值，返回给用户。

如果只是简单的错误，返回一条出错信息就可以了，但是如果遇到复杂的情况，就需要在出错以后进一步处理。这时最好的做法是使用throw语句手动抛出一个Error对象。

{% highlight javascript %}

throw new Error('出错了!');

{% endhighlight %}

上面语句新建一个Error对象，然后将这个对象抛出，整个程序就会中断在这个地方。

throw语句还可以抛出用户自定义的错误。

{% highlight javascript %}

function UserError(message) {
   this.message = message || "默认信息";
   this.name = "UserError";
}

UserError.prototype.toString = function (){
  return this.name + ': "' + this.message + '"';
}

throw new UserError("出错了！");

{% endhighlight %}

## try...catch结构

为了对错误进行处理，需要使用try...catch结构。

{% highlight javascript %}

try {
    throw new Error('出错了!');
} catch (e) {
    console.log(e.name + ": " + e.message);  // Error: 出错了！
    console.log(e.stack);  // 不是标准属性，但是浏览器支持
}

{% endhighlight %}

try代码块用来运行某段可能出错的代码，一旦出错（包括用throw语句抛出错误），就被catch代码块捕获。catch接受一个参数，表示try代码块传入的错误对象。

catch代码块之中，还可以再抛出错误，甚至使用嵌套的try...catch结构。

{% highlight javascript %}

try {
   throw n; // 这里抛出一个整数
} catch (e) {
   if (e <= 50) {
      // 针对1-50的错误的处理
   } else {
      // 大于50的错误无法处理，再抛出一个错误
      throw e;
   }
}

{% endhighlight %}

为了捕捉不同类型的错误，catch代码块之中可以加入判断语句。

{% highlight javascript %}

try {
  foo.bar();
} catch (e) {
  if (e instanceof EvalError) {
    console.log(e.name + ": " + e.message);
  } else if (e instanceof RangeError) {
    console.log(e.name + ": " + e.message);
  }
  // ... 
}

{% endhighlight %}

try...catch结构是JavaScript语言受到Java语言影响的一个明显的例子。这种结构多多少少是对结构化编程原则一种破坏，处理不当就会变成类似goto语句的效果，应该谨慎使用。

## finally代码块

try...catch结构允许在最后添加一个finally代码块，表示不管是否出现错误，都必需在最后运行的语句。

{% highlight javascript %}

openFile();

try {
   writeFile(Data);
} catch(e) {
    handleError(e);
} finally {
   closeFile();
}

{% endhighlight %}

上面代码首先打开一个文件，然后在try代码块中写入文件，如果没有发生错误，则运行finally代码块关闭文件；一旦发生错误，则先使用catch代码块处理错误，再使用finally代码块关闭文件。

下面的例子充分反应了try...catch...finally这三者之间的执行顺序。

{% highlight javascript %}

function f() {
    try {
        console.log(0);
        throw "bug";
    } catch(e) {
        console.log(1);
        return true; // 这句会延迟到finally代码块结束再执行
        console.log(2); // 不会运行
    } finally {
        console.log(3);
        return false; // 这句会覆盖掉前面那句return
        console.log(4); // 不会运行
    }
    
    console.log(5); // 不会运行
}

var result = f(); 
// 0
// 1
// 3

result
// false

{% endhighlight %}

某些情况下，甚至可以省略catch代码块，只使用finally代码块。

{% highlight javascript %}

openFile();

try {
   writeFile(Data);
} finally {
   closeFile();
}

{% endhighlight %}
