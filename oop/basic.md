---
title: 面向对象编程概述
layout: page
category: oop
date: 2012-12-28
modifiedOn: 2014-02-04
---

## 简介

### 对象和面向对象编程

“面向对象编程”（Object Oriented Programming，缩写为OOP）是目前主流的编程范式。它的核心思想是将真实世界中各种复杂的关系，抽象为一个个对象，然后由对象之间的分工与合作，完成对真实世界的模拟。

传统的计算机程序由一系列函数或一系列指令组成，而面向对象编程的程序由一系列对象组成。每一个对象都是功能中心，具有明确分工，可以完成接受信息、处理数据、发出信息等任务。因此，面向对象编程具有灵活性、代码的可重用性、模块性等特点，容易维护和开发，非常适合多人合作的大型软件项目。

那么，“对象”（object）到底是什么？

我们从两个层次来理解。

**（1）“对象”是单个实物的抽象。**

一本书、一辆汽车、一个人都可以是“对象”，一个数据库、一张网页、一个与远程服务器的连接也可以是“对象”。当实物被抽象成“对象”，实物之间的关系就变成了“对象”之间的关系，从而就可以模拟现实情况，针对“对象”进行编程。

**（2）“对象”是一个容器，封装了“属性”（property）和“方法”（method）。**

所谓“属性”，就是对象的状态；所谓“方法”，就是对象的行为（完成某种任务）。比如，我们可以把动物抽象为animal对象，“属性”记录具体是那一种动物，“方法”表示动物的某种行为（奔跑、捕猎、休息等等）。

虽然不同于传统的面向对象编程语言，但是JavaScript具有很强的面向对象编程能力。本章介绍JavaScript如何进行“面向对象编程”。

### 构造函数

“面向对象编程”的第一步，就是要生成对象。

前面说过，“对象”是单个实物的抽象。所以，通常需要一个模板，表示某一类实物的共同特征，然后“对象”根据这个模板生成。

典型的面向对象编程语言（比如C++和Java），存在“类”（class）这样一个概念。所谓“类”就是对象的模板，对象就是“类”的实例。JavaScript语言没有“类”，而改用构造函数（constructor）作为对象的模板。

所谓“构造函数”，就是专门用来生成“对象”的函数。它提供模板，作为对象的基本结构。一个构造函数，可以生成多个对象，这些对象都有相同的结构。

构造函数是一个正常的函数，但是它的特征和用法与普通函数不一样。下面就是一个构造函数：

```javascript

var Vehicle = function() {
	this.price = 1000;
};

```

上面代码中，Vehicle就是构造函数，它提供模板，用来生成车辆对象。

构造函数的最大特点就是，函数体内部使用了this关键字，代表了所要生成的对象实例。生成对象的时候，必需用new命令，调用Vehicle函数。

### new命令

new命令的作用，就是执行构造函数，返回一个实例对象。

{% highlight javascript %}

var Vehicle = function() {
	this.price = 1000;
};

var v = new Vehicle();
v.price // 1000

{% endhighlight %}

上面代码通过new命令，让构造函数Vehicle生成一个实例对象，保存在变量v中。这个新生成的实例对象，从构造函数Vehicle继承了price属性。在new命令执行时，构造函数内部的this，就代表了新生成的实例对象，this.price表示实例对象有一个price属性，它的值是1000。

new命令本身就可以执行构造函数，所以后面的构造函数可以带括号，也可以不带括号。下面两行代码是等价的。

{% highlight javascript %}

var v = new Vehicle();
var v = new Vehicle;

{% endhighlight %}

我们修改构造函数，使其可以带一个参数。

{% highlight javascript %}

var Vehicle = function(p) {
	this.price = p;
};

{% endhighlight %}

这时使用new命令，就需要同时提供参数值。

{% highlight javascript %}

var v = new Vehicle(500);

{% endhighlight %}

一个很自然的问题是，如果忘了使用new命令，直接调用构造函数会发生什么事？

这种情况下，构造函数就变成了普通函数，并不会生成实例对象。而且由于下面会说到的原因，this这时代表全局对象，将造成一些意想不到的结果。因此，应该避免出现不使用new命令、直接调用构造函数的情况。

为了保证构造函数必须与new命令一起使用，一个解决办法是，在构造函数内部使用严格模式，即第一行加上“use strict”。

```javascript

function Fubar (foo, bar) {
  "use strict"

  this._foo = foo;
  this._bar = bar;
}

Fubar()
// TypeError: Cannot set property '_foo' of undefined

```

上面代码的Fubar为构造函数，use strict命令保证了该函数在严格模式下运行。由于在严格模式中，函数内部的this不能指向全局对象，默认等于undefined，导致不加new调用会报错（JavaScript不允许对undefined添加属性）。

另一个解决办法，是在构造函数内部判断是否使用new命令，如果发现没有使用，则直接返回一个实例对象。

```javascript

function Fubar (foo, bar) {
  if (!(this instanceof Fubar)) {
    return new Fubar(foo, bar);
  } 

  this._foo = foo;
  this._bar = bar;
}

```

上面代码中的构造函数，不管加不加new命令，都会得到同样的结果。

### instanceof运算符

instanceof运算符用来确定一个对象是否为某个构造函数的实例。

{% highlight javascript %}

var v = new Vehicle();

v instanceof Vehicle
// true

{% endhighlight %}

instanceof运算符的左边放置对象，右边放置构造函数。在JavaScript之中，只要是对象，就有对应的构造函数。因此，instanceof运算符可以用来判断值的类型。

{% highlight javascript %}

[1, 2, 3] instanceof Array // true

({}) instanceof Object // true

{% endhighlight %}

上面代码表示数组和对象则分别是Array对象和Object对象的实例。最后那一行的空对象外面，之所以要加括号，是因为如果不加，JavaScript引擎会把一对大括号解释为一个代码块，而不是一个对象，从而导致这一行代码被解释为“{}; instanceof Object”，引擎就会报错。 

需要注意的是，由于原始类型的值不是对象，所以不能使用instanceof运算符判断类型。

{% highlight javascript %}

"" instanceof String // false

1 instanceof Number // false

{% endhighlight %}

上面代码中，字符串不是String对象的实例（因为字符串不是对象），数值1也不是Number对象的实例（因为数值1不是对象）。

如果存在继承关系，也就是某个对象可能是多个构造函数的实例，那么instanceof运算符对这些构造函数都返回true。

{% highlight javascript %}

var a = [];

a instanceof Array // true
a instanceof Object // true

{% endhighlight %}

上面代码表示，a是一个数组，所以它是Array的实例；同时，a也是一个对象，所以它也是Object的实例。

利用instanceof运算符，还可以巧妙地解决，调用构造函数时，忘了加new命令的问题。

```javascript

function Fubar (foo, bar) {

  if (this instanceof Fubar) {
    this._foo = foo;
    this._bar = bar;
  }
  else return new Fubar(foo, bar);
}

```

上面代码使用instanceof运算符，在函数体内部判断this关键字是否为构造函数Fubar的实例。如果不是，就表明忘了加new命令。

## this关键字

### 涵义

构造函数内部需要用到this关键字。那么，this关键字到底是什么意思呢？

简单说，this就是指函数当前的运行环境。在JavaScript语言之中，所有函数都是在某个运行环境之中运行，this就是这个环境。对于JavaScipt语言来说，一切皆对象，运行环境也是对象，所以可以理解成，所有函数总是在某个对象之中运行，this就指向这个对象。这本来并不会让用户糊涂，但是JavaScript支持运行环境动态切换，也就是说，this的指向是动态的，没有办法事先确定到底指向哪个对象，这才是最让初学者感到困惑的地方。

举例来说，有一个函数f，它同时充当a对象和b对象的方法。JavaScript允许函数f的运行环境动态切换，即一会属于a对象，一会属于b对象，这就要靠this关键字来办到。

{% highlight javascript %}

function f(){ console.log(this.x); };

var a = {x:'a'};
a.m = f;

var b = {x:'b'};
b.m = f;

a.m() // a
b.m() // b

{% endhighlight %}

上面代码中，函数f可以打印出当前运行环境中x变量的值。当f属于a对象时，this指向a；当f属于b对象时，this指向b，因此打印出了不同的值。由于this的指向可变，所以可以手动切换运行环境，以达到某种特定的目的。

前面说过，所谓“运行环境”就是对象，this指函数运行时所在的那个对象。如果一个函数在全局环境中运行，this就是指顶层对象（浏览器中为window对象）；如果一个函数作为某个对象的方法运行，this就是指那个对象。

可以近似地认为，this是所有函数运行时的一个隐藏参数，决定了函数的运行环境。

### 使用场合

this的使用可以分成以下几个场合。

**（1）全局环境**

在全局环境使用this，它指的就是顶层对象window。

{% highlight javascript %}

this === window // true 

function f() {
	console.log(this === window); // true
}

{% endhighlight %}

上面代码说明，不管是不是在函数内部，只要是在全局环境下运行，this就是指全局对象window。

**（2）构造函数**

构造函数中的this，指的是实例对象。

{% highlight javascript %}

var O = function(p) {
	this.p = p;
};

O.prototype.m = function() {
    return this.p;
};

{% endhighlight %}

上面代码定义了一个构造函数O。由于this指向实例对象，所以在构造函数内部定义this.p，就相当于定义实例对象有一个p属性；然后m方法可以返回这个p属性。

{% highlight javascript %}

var o = new O("Hello World!");

o.p // "Hello World!"
o.m() // "Hello World!"

{% endhighlight %}

**（3）对象的方法**

当a对象的方法被赋予b对象，该方法就变成了普通函数，其中的this就从指向a对象变成了指向b对象。这就是this取决于运行时所在的对象的含义，所以要特别小心。如果将某个对象的方法赋值给另一个对象，会改变this的指向。

{% highlight javascript %}

var o1 = new Object();
o1.m = 1;
o1.f = function (){ console.log(this.m);};

o1.f() // 1

var o2 = new Object();
o2.m = 2;
o2.f = o1.f

o2.f() // 2

{% endhighlight %}

从上面代码可以看到，f是o1的方法，但是如果在o2上面调用这个方法，f方法中的this就会指向o2。这就说明JavaScript函数的运行环境完全是动态绑定的，可以在运行时切换。

如果不想改变this的指向，可以将o2.f改写成下面这样。

{% highlight javascript %}

o2.f = function (){ o1.f() };

o2.f() // 1

{% endhighlight %}

上面代码表示，由于f方法这时是在o1下面运行，所以this就指向o1。

有时，某个方法位于多层对象的内部，这时如果为了简化书写，把该方法赋值给一个变量，往往会得到意想不到的结果。

{% highlight javascript %}

var a = {
		b : {
			m : function() {
				console.log(this.p);
			},
			p : 'Hello'
		}
};

var hello = a.b.m;
hello() // undefined

{% endhighlight %}

上面代码表示，m属于多层对象内部的一个方法。为求简写，将其赋值给hello变量，结果调用时，this指向了全局对象。为了避免这个问题，可以只将m所在的对象赋值给hello，这样调用时，this的指向就不会变。

{% highlight javascript %}

var hello = a.b;
hello.m() // Hello

{% endhighlight %}

**（4）Node.js**

在Node.js中，this的指向又分成两种情况。全局环境中，this指向全局对象global；模块环境中，this指向module.exports。

```javascript

// 全局环境
this === global // true

// 模块环境
this === module.exports // true

```

### 使用注意点

**（1）避免多层this**

由于this的指向是不确定的，所以切勿在函数中包含多层的this。

{% highlight javascript %}

var o = {
	f1: function() {
		console.log(this); 
		var f2 = function() {
			console.log(this);
		}();
	}
}

o.f1()
// Object
// Window

{% endhighlight %}

上面代码包含两层this，结果运行后，第一层指向该对象，第二层指向全局对象。一个解决方法是在第二层改用一个指向外层this的变量。

{% highlight javascript %}

var o = {
	f1: function() {
		console.log(this); 
		var that = this;
		var f2 = function() {
			console.log(that);
		}();
	}
}

o.f1()
// Object
// Object

{% endhighlight %}

上面代码定义了变量that，固定指向外层的this，然后在内层使用that，就不会发生this指向的改变。

**（2）避免数组处理方法中的this**

数组的map和foreach方法，允许提供一个函数作为参数。这个函数内部不应该使用this。

{% highlight javascript %}

var o = {
	v: 'hello',
    p: [ 'a1', 'a2' ],
    f: function f() {
        this.p.forEach(function (item) {
            console.log(this.v+' '+item);
        });
    }
}

o.f()
// undefined a1
// undefined a2

{% endhighlight %}

上面代码中，foreach方法的参数函数中的this，其实是指向window对象，因此取不到o.v的值。

解决这个问题的一种方法，是使用中间变量。

{% highlight javascript %}

var o = {
	v: 'hello',
    p: [ 'a1', 'a2' ],
    f: function f() {
		var that = this;
        this.p.forEach(function (item) {
            console.log(that.v+' '+item);
        });
    }
}

o.f()
// hello a1
// hello a2

{% endhighlight %}

另一种方法是将this当作foreach方法的第二个参数，固定它的运行环境。

{% highlight javascript %}

var o = {
	v: 'hello',
    p: [ 'a1', 'a2' ],
    f: function f() {
        this.p.forEach(function (item) {
            console.log(this.v+' '+item);
        }, this);
    }
}

o.f()
// hello a1
// hello a2

{% endhighlight %}

**（3）避免回调函数中的this**

回调函数中的this往往会改变指向，最好避免使用。

{% highlight javascript %}

var o = new Object();

o.f = function (){
    console.log(this === o);
}

o.f() // true

{% endhighlight %}

上面代码表示，如果调用o对象的f方法，其中的this就是指向o对象。

但是，如果将f方法指定给某个按钮的click事件，this的指向就变了。

{% highlight javascript %}

$("#button").on("click", o.f);

{% endhighlight %}

点击按钮以后，控制台会显示false。原因是此时this不再指向o对象，而是指向按钮的DOM对象，因为f方法是在按钮对象的环境中被调用的。这种细微的差别，很容易在编程中忽视，导致难以察觉的错误。

为了解决这个问题，可以采用下面的一些方法对this进行绑定，也就是使得this固定指向某个对象，减少不确定性。

## 固定this的方法

this的动态切换，固然为JavaScript创造了巨大的灵活性，但也使得编程变得困难和模糊。有时，需要把this固定下来，避免出现意想不到的情况。JavaScript提供了call、apply、bind这三个方法，来切换/固定this的指向。

### call方法

函数的call方法，可以改变指定该函数内部this的指向，然后再调用该函数。

```javascript

var o = {};

var f = function (){
  return this;
};

f() === this // true
f.call(o) === o // true

```

上面代码中，在全局环境运行函数f时，this指向全局环境；call方法指定，在对象o的环境中运行函数f，则this指向对象o。

再看一个例子。

{% highlight javascript %}

var n = 123;
var o = { n : 456 };

function a() {
  console.log(this.n);
}

a.call() // 123
a.call(null) // 123
a.call(undefined) // 123
a.call(window) // 123
a.call(o) // 456

{% endhighlight %}

上面代码中，a函数中的this关键字，如果指向全局对象，返回结果为123。如果使用call方法，将this关键字指向o对象，返回结果为456。如果this所要指向的那个对象，设定为null或undefined，则等同于指向全局对象。

call方法的完整使用格式如下。

```javascript

func.call(thisValue, arg1, arg2, ...)

```

它的第一个参数就是this所要指向的那个对象，后面的参数则是函数调用时所需的参数。

```javascript

function add(a,b) {
  return a+b;
}

add.call(this,1,2) // 3

```

上面代码中，call方法指定函数add在当前环境（对象）中运行，并且参数为1和2，因此函数add运行后得到3。

### apply方法

apply方法的作用与call方法类似，也是改变this指向，然后再调用该函数。它的使用格式如下。

{% highlight javascript %}

func.apply(thisValue, [arg1, arg2, ...])

{% endhighlight %}

apply方法的第一个参数也是this所要指向的那个对象，如果设为null或undefined，则等同于指定全局对象。第二个参数则是一个数组，该数组的所有成员依次作为参数，传入原函数。原函数的参数，在call方法中必须一个个添加，但是在apply方法中，必须以数组形式添加。

请看下面的例子。

{% highlight javascript %}

function f(x,y){ console.log(x+y); }

f.call(null,1,1) // 2
f.apply(null,[1,1]) // 2

{% endhighlight %}

上面的f函数本来接受两个参数，使用apply方法以后，就变成可以接受一个数组作为参数。

利用这一点，可以做一些有趣的应用。

**（1）找出数组最大元素**

JavaScript不提供找出数组最大元素的函数。结合使用apply方法和Math.max方法，就可以返回数组的最大元素。

{% highlight javascript %}

var a = [10, 2, 4, 15, 9];

Math.max.apply(null, a)
// 15

{% endhighlight %}

**（2）将数组的空元素变为undefined**

通过apply方法，利用Array构造函数将数组的空元素变成undefined。

{% highlight javascript %}

Array.apply(null, ["a",,"b"])
// [ 'a', undefined, 'b' ]

{% endhighlight %}

空元素与undefined的差别在于，数组的foreach方法会跳过空元素，但是不会跳过undefined。因此，遍历内部元素的时候，会得到不同的结果。

{% highlight javascript %}

var a = ["a",,"b"];

function print(i) {
	console.log(i);
}

a.forEach(print)
// a
// b

Array.apply(null,a).forEach(print)
// a
// undefined
// b

{% endhighlight %}

**（3）转换类似数组的对象**

另外，利用数组对象的slice方法，可以将一个类似数组的对象（比如arguments对象）转为真正的数组。

{% highlight javascript %}

Array.prototype.slice.apply({0:1,length:1})
// [1]

Array.prototype.slice.apply({0:1})
// []

Array.prototype.slice.apply({0:1,length:2})
// [1, undefined]

Array.prototype.slice.apply({length:1})
// [undefined]

{% endhighlight %}

上面代码的apply方法的参数都是对象，但是返回结果都是数组，这就起到了将对象转成数组的目的。从上面代码可以看到，这个方法起作用的前提是，被处理的对象必须有length属性，以及相对应的数字键。

**（4）绑定回调函数的对象**

上一节按钮点击事件的例子，可以改写成

{% highlight javascript %}

var o = new Object();

o.f = function (){
    console.log(this === o);
}

var f = function (){
	o.f.apply(o);
	// 或者 o.f.call(o);
};

$("#button").on("click", f);

{% endhighlight %}

点击按钮以后，控制台将会显示true。由于apply方法（或者call方法）不仅绑定函数执行时所在的对象，还会立即执行函数，因此不得不把绑定语句写在一个函数体内。更简洁的写法是采用下面介绍的bind方法。

### bind方法

bind方法就是单纯地将函数体内的this绑定到某个对象，然后返回一个新函数。它的使用格式如下。

{% highlight javascript %}

func.bind(thisValue, arg1, arg2,...)

{% endhighlight %}

它比call方法和apply方法更进一步的是，除了绑定this以外，还可以绑定原函数的参数。

请看下面的例子。

{% highlight javascript %}

var o1 = new Object();
o1.p = 123;
o1.m = function (){
	console.log(this.p);
};

o1.m() // 123 

var o2 = new Object();
o2.p = 456;
o2.m = o1.m;

o2.m() // 456

o2.m = o1.m.bind(o1);
o2.m() // 123

{% endhighlight %}

上面代码使用bind方法将o1.m方法绑定到o1以后，在o2对象上调用o1.m的时候，o1.m函数体内部的this.p就不再到o2对象去寻找p属性的值了。

如果bind方法的第一个参数是null或undefined，等于将this绑定到全局对象，函数运行时this指向全局对象（在浏览器中为window）。

{% highlight javascript %}

function add(x,y) { return x+y; }

var plus5 = add.bind(null, 5);

plus5(10) // 15

{% endhighlight %}

上面代码除了将add函数的运行环境绑定为全局对象，还将add函数的第一个参数绑定为5，然后返回一个新函数。以后，每次运行这个新函数，就只需要提供另一个参数就够了。

bind方法有一些使用注意点。

**（1）每一次返回一个新函数**

bind方法每运行一次，就返回一个新函数，这会产生一些问题。比如，监听事件的时候，不能写成下面这样。

{% highlight javascript %}

element.addEventListener('click', o.m.bind(o));

{% endhighlight %}

上面代码表示，click事件绑定bind方法生成的一个匿名函数。这样会导致无法取消绑定，所以，下面的代码是无效的。

{% highlight javascript %}

element.removeEventListener('click', o.m.bind(o));

{% endhighlight %}

正确的方法是写成下面这样：

{% highlight javascript %}

var listener = o.m.bind(o);
element.addEventListener('click', listener);
//  ...
element.removeEventListener('click', listener);

{% endhighlight %}

**（2）bind方法的自定义代码**

对于那些不支持bind方法的老式浏览器，可以自行定义bind方法。

{% highlight javascript %}

if(!('bind' in Function.prototype)){
    Function.prototype.bind = function(){
        var fn = this;
		var context = arguments[0];
		var args = Array.prototype.slice.call(arguments, 1);
        return function(){
            return fn.apply(context, args);
        }
    }
}

{% endhighlight %}

**（3）jQuery的proxy方法**

除了用bind方法绑定函数运行时所在的对象，还可以使用jQuery的$.proxy方法，它与bind方法的作用基本相同。

{% highlight javascript %}

$("#button").on("click", $.proxy(o.f, o));

{% endhighlight %}

上面代码表示，$.proxy方法将o.f方法绑定到o对象。

**（4）结合call方法使用**

利用bind方法，可以改写一些JavaScript原生方法的使用形式，以数组的slice方法为例。

{% highlight javascript %}

[1,2,3].slice(0,1) 
// [1]

// 等同于

Array.prototype.slice.call([1,2,3], 0, 1)
// [1]

{% endhighlight %}

上面的代码中，数组的slice方法从[1, 2, 3]里面，按照指定位置和长度切分出另一个数组。这样做的本质是在[1, 2, 3]上面调用Array.prototype.slice方法，因此可以用call方法表达这个过程，得到同样的结果。

call方法实质上是调用Function.prototype.call方法，因此上面的表达式可以用bind方法改写。

{% highlight javascript %}

var slice = Function.prototype.call.bind(Array.prototype.slice);

slice([1, 2, 3], 0, 1) // [1]

{% endhighlight %}

可以看到，利用bind方法，将[1, 2, 3].slice(0, 1)变成了slice([1, 2, 3], 0, 1)的形式。这种形式的改变还可以用于其他数组方法。

{% highlight javascript %}

var push = Function.prototype.call.bind(Array.prototype.push);
var pop = Function.prototype.call.bind(Array.prototype.pop);

var a = [1 ,2 ,3];
push(a, 4)
a // [1, 2, 3, 4]

pop(a)
a // [1, 2, 3]

{% endhighlight %}

如果再进一步，将Function.prototype.call方法绑定到Function.prototype.bind对象，就意味着bind的调用形式也可以被改写。

{% highlight javascript %}

function f(){
	console.log(this.v);
}

var o = { v: 123 };

var bind = Function.prototype.call.bind(Function.prototype.bind);

bind(f,o)() // 123

{% endhighlight %}

上面代码表示，将Function.prototype.call方法绑定Function.prototype.bind以后，bind方法的使用形式从f.bind(o)，变成了bind(f, o)。

## 参考链接

- Jonathan Creamer, [Avoiding the "this" problem in JavaScript](http://tech.pro/tutorial/1192/avoiding-the-this-problem-in-javascript)
- Erik Kronberg, [Bind, Call and Apply in JavaScript](https://variadic.me/posts/2013-10-22-bind-call-and-apply-in-javascript.html)
- Axel Rauschmayer, [JavaScript’s this: how it works, where it can trip you up](http://www.2ality.com/2014/05/this.html)
