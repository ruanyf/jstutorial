---
title: JavaScript 编程风格
layout: page
category: grammar
date: 2013-06-02
modifiedOn: 2013-06-02
---

所谓"编程风格"（programming style），指的是编写代码的样式规则。不同的程序员，往往有不同的编程风格。

有人说，编译器的规范叫做"语法规则"（grammar），这是程序员必须遵守的；而编译器忽略的部分，就叫"编程风格"（programming style），这是程序员可以自由选择的。这种说法不完全正确，程序员固然可以自由选择编程风格，但是好的编程风格有助于写出质量更高、错误更少、更易于维护的程序。

所以，"编程风格"的选择不应该基于个人爱好、熟悉程度、打字量等因素，而要考虑如何尽量使代码清晰易读、减少出错。你选择的，不是你喜欢的风格，而是一种能够清晰表达你的意图的风格。这一点，对于Javascript这种语法自由度很高的语言尤其重要。

## 大括号的位置

绝大多数的编程语言，都用大括号（{}）表示区块（block）。起首的大括号的位置，有许多不同的写法。

最流行的有两种。一种是起首的大括号另起一行：

{% highlight javascript %}

　　block
　　{
　　　　...
　　}

{% endhighlight %}

另一种是起首的大括号跟在关键字的后面：

{% highlight javascript %}

　　block {
　　　　...
　　}

{% endhighlight %}

一般来说，这两种写法都可以接受。但是，Javascript要使用后一种，因为Javascript会自动添加句末的分号，导致一些难以察觉的错误。

{% highlight javascript %}

　　return
　　{
　　　　key:value;
　　};

{% endhighlight %}

上面的代码的原意，是要返回一个对象，但实际上返回的是undefined，因为Javascript自动在return语句后面添加了分号。为了避免这一类错误，需要写成下面这样：

{% highlight javascript %}

　　return {
　　　　key : value;
　　};

{% endhighlight %}

因此，表示区块起首的大括号，不要另起一行。

## 圆括号

圆括号（parentheses）在Javascript中有两种作用，一种表示调用函数，另一种表示不同的值的组合（grouping）。我们可以用空格，区分这两种不同的括号。

使用圆括号时，建议遵守以下规则

1. 调用函数的时候，函数名与左括号之间没有空格。
2. 函数名与参数序列之间，没有空格。
3. 所有其他语法元素与左括号之间，都有一个空格。

按照上面的规则，下面的写法都是不规范的：

{% highlight javascript %}

　　foo (bar)
　　return(a+b);
　　if(a === 0) {...}
　　function foo (b) {...}
　　function(x) {...}

{% endhighlight %}

## 缩进

空格和Tab键，都可以产生缩进效果（intent）。Tab键可以节省击键次数，但不同的文本编辑器对Tab的显示不尽相同，有的显示四个空格，有的显示两个空格，所以有人觉得，空格键可以使得显示效果更统一。

无论你选择哪一种方法，都是可以接受的，要做的就是始终坚持这一种选择。不要一会使用tab键，一会使用空格键。

## 行尾的分号

分号表示语句的结束。大多数情况下，如果你省略了句尾的分号，Javascript会自动添加。

{% highlight javascript %}

var a = 1

{% endhighlight %}

等同于

{% highlight javascript %}

var a = 1;

{% endhighlight %}

因此，有人提倡省略句尾的分号。但麻烦的是，如果句尾的最后一个字符与下一行的第一个字符，可以连在一起解释，JavaScript就不会自动添加分号，这会产生一些难以察觉的错误。

{% highlight javascript %}

x = y
　　(function (){
　　　　...
　　})();

{% endhighlight %}

上面的代码等同于

{% highlight javascript %}

　　x = y(function (){...})();

{% endhighlight %}

因此，不要省略句末的分号。

## with语句

with可以减少代码的书写，但是会造成混淆。

{% highlight javascript %}

　　with (o) {
　　　　foo = bar;
　　}

{% endhighlight %}

上面的代码，可以有四种运行结果：

{% highlight javascript %}

　　o.foo = bar;
　　o.foo = o.bar;
　　foo = bar;
　　foo = o.bar;

{% endhighlight %}

这四种结果都可能发生，取决于不同的变量是否有定义。因此，不要使用with语句。

## 相等和严格相等

Javascript有两个表示"相等"的运算符："相等"（==）和"严格相等"（===）。

因为"相等"运算符会自动转换变量类型，造成很多意想不到的情况：

{% highlight javascript %}

　　0 == ''// true
　　1 == true // true
　　2 == true // false
　　0 == '0' // true
　　false == 'false' // false
　　false == '0' // true
　　" \t\r\n " == 0 // true

{% endhighlight %}

因此，不要使用"相等"（==）运算符，只使用"严格相等"（===）运算符。

## 语句的合并
有些程序员追求简洁，喜欢合并不同目的的语句。比如，原来的语句是

{% highlight javascript %}

　　a = b;
　　if (a) {...}

{% endhighlight %}

他喜欢写成下面这样:

{% highlight javascript %}

　　if (a = b) {...}

{% endhighlight %}

虽然语句少了一行，但是可读性大打折扣，而且会造成误读，让别人误以为这行代码的意思是：

{% highlight javascript %}

　　if （a === b）{...}

{% endhighlight %}

另外一种情况是，有些程序员喜欢在同一行中赋值多个变量：

{% highlight javascript %}

　　var a = b = 0;

{% endhighlight %}

他以为，这行代码等同于

{% highlight javascript %}

　　var a = 0, b = 0;

{% endhighlight %}

实际上不是，它的真正效果是下面这样：

{% highlight javascript %}

　　b = 0;

　　var a = b;

{% endhighlight %}

因此，不要将不同目的的语句，合并成一行。

## 变量声明

Javascript会自动将变量声明"提升"（hoist）到代码块（block）的头部。

{% highlight javascript %}

　　if (!o) {
　　　　var o = {};
　　}

{% endhighlight %}

等同于

{% highlight javascript %}

　　var o;
　　if (!o) {
　　　　o = {};
　　}

{% endhighlight %}

为了避免可能出现的问题，不如把变量声明都放在代码块的头部。

{% highlight javascript %}

　　for (var i ...) {...}

{% endhighlight %}

最好写成：

{% highlight javascript %}

　　var i;

　　for (i ...) {...}

{% endhighlight %}

因此，所有变量声明都放在函数的头部，所有函数都在使用之前定义。

## 全局变量

JavaScript最大的语法缺点，可能就是全局变量对于任何一个代码块，都是可读可写。这对代码的模块化和重复使用，非常不利。

因此，避免使用全局变量；如果不得不使用，用大写字母表示变量名，比如UPPER_CASE。

## new命令

JavaScript使用new命令，从构造函数生成一个新对象。

{% highlight javascript %}

　　var o = new myObject();

{% endhighlight %}

这种做法的问题是，一旦你忘了加上new，myObject()内部的this关键字就会指向全局对象，导致所有绑定在this上面的变量，都变成全部变量。

因此，不要使用new命令，改用Object.create()命令。如果不得不使用new，为了防止出错，最好在视觉上把构造函数与其他函数区分开来。构造函数的函数名，采用首字母大写（InitialCap）；其他函数名，一律首字母小写。

## 自增和自减运算符

自增（++）和自减（--）运算符，放在变量的前面或后面，返回的值不一样，很容易发生错误。

事实上，所有的++运算符都可以用"+= 1"代替。

{% highlight javascript %}

　　++x
{% endhighlight %}

等同于

{% highlight javascript %}

　　x += 1;

{% endhighlight %}

代码变得更清晰了。有一个很可笑的例子，某个Javascript函数库的源代码中出现了下面的片段：

{% highlight javascript %}

　　++x;
　　++x;

{% endhighlight %}

这个程序员忘了，还有更简单、更合理的写法：

{% highlight javascript %}

　　x += 2;

{% endhighlight %}

因此，不要使用自增（++）和自减（--）运算符，用+=和-=代替。

## 区块

如果循环和判断的代码体只有一行，Javascript允许该区块（block）省略大括号。

下面的代码

{% highlight javascript %}

　　if (a) b(); c();

{% endhighlight %}

原意可能是

{% highlight javascript %}

　　if (a) { b(); c();}

{% endhighlight %}

但是，实际效果是

{% highlight javascript %}

　　if (a) { b();} c();

{% endhighlight %}

因此，总是使用大括号表示区块。

## switch...case结构

switch...case结构要求，在每一个case的最后一行必须是break语句，否则会接着运行下一个case。这样不仅容易忘记，还会造成代码的冗长。

而且，switch...case不使用大括号，不利用代码形式的统一。此外，这种结构类似于goto语句，容易造成程序流程的混乱，使得代码结构混乱不堪，不符合面向对象编程的原则。

{% highlight javascript %}

function doAction(action) {
  switch (action) {
    case 'hack':
      return 'hack';
    break;

    case 'slash':
      return 'slash';
    break;

    case 'run':
      return 'run';
    break;

    default:
      throw new Error('Invalid action.');
    break;
  }
}

{% endhighlight %}

上面的代码建议改写成对象结构。

{% highlight javascript %}

function doAction(action) {
  var actions = {
    'hack': function () {
      return 'hack';
    },

    'slash': function () {
      return 'slash';
    },

    'run': function () {
      return 'run';
    }
  };
 
  if (typeof actions[action] !== 'function') {
    throw new Error('Invalid action.');
  }

  return actions[action]();
}

{% endhighlight %}

因此，避免使用switch...case结构，用对象结构代替。

## eval函数

eval函数的作用是，将一段字符串当作语句执行。问题是eval不提供单独的作用域，而是直接在全局作用域运行。这会造成eval中的语句创建或修改全局变量，使得恶意代码有机可乘。

更好的替代方法是：（1）将字符串传入Function() 构造函数。（2）将字符串传入 setTimeout() 或 setInterval() ，作为回调函数。

因此，避免使用eval函数。

## 参考链接

* Eric Elliott, Programming JavaScript Applications, [Chapter 2. JavaScript Style Guide](http://chimera.labs.oreilly.com/books/1234000000262/ch02.html), O'reilly, 2013.


