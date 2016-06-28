---
title: 面向对象编程概述
layout: page
category: oop
date: 2012-12-28
modifiedOn: 2014-02-04
---

## 对象是什么？

“面向对象编程”（Object Oriented Programming，缩写为OOP）是目前主流的编程范式。它的核心思想是将真实世界中各种复杂的关系，抽象为一个个对象，然后由对象之间的分工与合作，完成对真实世界的模拟。

传统的过程式编程（procedural programming）由一系列函数或一系列指令组成，而面向对象编程的程序由一系列对象组成。每一个对象都是功能中心，具有明确分工，可以完成接受信息、处理数据、发出信息等任务。因此，面向对象编程具有灵活性、代码的可重用性、模块性等特点，容易维护和开发，非常适合多人合作的大型软件项目。

那么，“对象”（object）到底是什么？

我们从两个层次来理解。

**（1）“对象”是单个实物的抽象。**

一本书、一辆汽车、一个人都可以是“对象”，一个数据库、一张网页、一个与远程服务器的连接也可以是“对象”。当实物被抽象成“对象”，实物之间的关系就变成了“对象”之间的关系，从而就可以模拟现实情况，针对“对象”进行编程。

**（2）“对象”是一个容器，封装了“属性”（property）和“方法”（method）。**

所谓“属性”，就是对象的状态；所谓“方法”，就是对象的行为（完成某种任务）。比如，我们可以把动物抽象为animal对象，“属性”记录具体是那一种动物，“方法”表示动物的某种行为（奔跑、捕猎、休息等等）。

虽然不同于传统的面向对象编程语言，但是JavaScript具有很强的面向对象编程能力。本章介绍JavaScript如何进行“面向对象编程”。

## 构造函数

“面向对象编程”的第一步，就是要生成“对象”。前面说过，“对象”是单个实物的抽象。通常需要一个模板，表示某一类实物的共同特征，然后“对象”根据这个模板生成。

典型的面向对象编程语言（比如C++和Java），存在“类”（class）这个概念。所谓“类”就是对象的模板，对象就是“类”的实例。但是，JavaScript语言的对象体系，不是基于“类”的，而是基于构造函数（constructor）和原型链（prototype）。这个小节介绍构造函数。

JavaScript语言使用构造函数（constructor）作为对象的模板。所谓“构造函数”，就是专门用来生成“对象”的函数。它提供模板，描述对象的基本结构。一个构造函数，可以生成多个对象，这些对象都有相同的结构。

构造函数是一个正常的函数，但是它的特征和用法与普通函数不一样。下面就是一个构造函数。

```javascript
var Vehicle = function () {
  this.price = 1000;
};
```

上面代码中，`Vehicle`就是构造函数，它提供模板，用来生成车辆对象。为了与普通函数区别，通常将构造函数的名字的第一个字母大写。

构造函数的特点有两个。

- 函数体内部使用了`this`关键字，代表了所要生成的对象实例。
- 生成对象的时候，必需用`new`命令，调用`Vehicle`函数。

## new命令

### 基本用法

`new`命令的作用，就是执行构造函数，返回一个实例对象。

```javascript
var Vehicle = function (){
  this.price = 1000;
};

var v = new Vehicle();
v.price // 1000
```

上面代码通过`new`命令，让构造函数`Vehicle`生成一个实例对象，保存在变量`v`中。这个新生成的实例对象，从构造函数`Vehicle`继承了`price`属性。在`new`命令执行时，构造函数内部的`this`，就代表了新生成的实例对象，`this.price`表示实例对象有一个`price`属性，它的值是1000。

使用`new`命令时，根据需要，构造函数也可以接受参数。

```javascript
var Vehicle = function (p) {
  this.price = p;
};

var v = new Vehicle(500);
```

`new`命令本身就可以执行构造函数，所以后面的构造函数可以带括号，也可以不带括号。下面两行代码是等价的。

```javascript
var v = new Vehicle();
var v = new Vehicle;
```

一个很自然的问题是，如果忘了使用new命令，直接调用构造函数会发生什么事？

这种情况下，构造函数就变成了普通函数，并不会生成实例对象。而且由于下面会说到的原因，this这时代表全局对象，将造成一些意想不到的结果。

```javascript
var Vehicle = function (){
  this.price = 1000;
};

var v = Vehicle();
v.price
// Uncaught TypeError: Cannot read property 'price' of undefined

price
// 1000
```

上面代码中，调用Vehicle构造函数时，忘了加上new命令。结果，price属性变成了全局变量，而变量v变成了undefined。

因此，应该非常小心，避免出现不使用new命令、直接调用构造函数的情况。为了保证构造函数必须与new命令一起使用，一个解决办法是，在构造函数内部使用严格模式，即第一行加上`use strict`。

```javascript
function Fubar(foo, bar){
  "use strict";

  this._foo = foo;
  this._bar = bar;
}

Fubar()
// TypeError: Cannot set property '_foo' of undefined
```

上面代码的`Fubar`为构造函数，`use strict`命令保证了该函数在严格模式下运行。由于在严格模式中，函数内部的`this`不能指向全局对象，默认等于`undefined`，导致不加`new`调用会报错（JavaScript不允许对`undefined`添加属性）。

另一个解决办法，是在构造函数内部判断是否使用`new`命令，如果发现没有使用，则直接返回一个实例对象。

```javascript
function Fubar(foo, bar){
  if (!(this instanceof Fubar)) {
    return new Fubar(foo, bar);
  }

  this._foo = foo;
  this._bar = bar;
}

Fubar(1, 2)._foo // 1
(new Fubar(1, 2))._foo // 1
```

上面代码中的构造函数，不管加不加new命令，都会得到同样的结果。

### new命令的原理

使用new命令时，它后面的函数调用就不是正常的调用，而是被new命令控制了。内部的流程是，先创造一个空对象，作为上下文对象，赋值给函数内部的this关键字。也就是说，this指的是一个新生成的空对象，所有针对this的操作，都会发生在这个空对象上。

构造函数之所以叫“构造函数”，就是说这个函数的目的，就是操作上下文对象（即this对象），将其“构造”为需要的样子。如果构造函数的return语句返回的是对象，new命令会返回return语句指定的对象；否则，就会不管return语句，返回构造后的上下文对象。

```javascript
var Vehicle = function (){
  this.price = 1000;
  return 1000;
};

(new Vehicle()) === 1000
// false
```

上面代码中，Vehicle是一个构造函数，它的return语句返回一个数值。这时，new命令就会忽略这个return语句，返回“构造”后的this对象。

但是，如果return语句返回的是一个跟this无关的新对象，new命令会返回这个新对象，而不是this对象。这一点需要特别引起注意。

```javascript
var Vehicle = function (){
  this.price = 1000;
  return { price: 2000 };
};

(new Vehicle()).price
// 2000
```

上面代码中，构造函数Vehicle的return语句，返回的是一个新对象。new命令会返回这个对象，而不是this对象。

new命令简化的内部流程，可以用下面的代码表示。

```javascript
function _new(/* constructor, param, ... */) {
  var args = [].slice.call(arguments);
  var constructor = args.shift();
  var context = Object.create(constructor.prototype);
  var result = constructor.apply(context, args);
  return (typeof result === 'object' && result != null) ? result : context;
}

var actor = _new(Person, "张三", 28);
```

## instanceof运算符

`instanceof`运算符返回一个布尔值，表示一个对象是否由某个构造函数创建。

```javascript
var v = new Vehicle();
v instanceof Vehicle // true
```

`instanceof`运算符的左边是实例对象，右边是构造函数。

在JavaScript之中，只要是对象，就有对应的构造函数。因此，`instanceof`运算符可以用来判断值的类型。

```javascript
[1, 2, 3] instanceof Array // true
({}) instanceof Object // true
```

上面代码表示数组和对象则分别是`Array`对象和`Object`对象的实例。最后那一行的空对象外面，之所以要加括号，是因为如果不加，JavaScript引擎会把一对大括号解释为一个代码块，而不是一个对象，从而导致这一行代码被解释为`{}; instanceof Object`，引擎就会报错。

注意，`instanceof`运算符只能用于对象，不适合用于原始类型的值。

```javascript
var s = 'hello';
s instanceof String // false

var s = new String('hello');
s instanceof String // true
```

上面代码中，字符串不是`String`对象的实例（因为字符串不是对象），所以返回`false`，而字符串对象是`String`对象的实例，所以返回`true`。

此外，`undefined`和`null`不是对象，所以`instanceOf`运算符总是返回`false`。

```javascript
undefined instanceof Object // false
null instanceof Object // false
```

如果存在继承关系，也就是说，`a`是`A`的实例，而`A`继承了`B`，那么`instanceof`运算符对`A`和`B`都返回`true`。

```javascript
var a = [];

a instanceof Array // true
a instanceof Object // true
```

上面代码表示，`a`是一个数组，所以它是`Array`的实例；同时，`Array`继承了`Object`，所以`a`也是`Object`的实例。

利用`instanceof`运算符，还可以巧妙地解决，调用构造函数时，忘了加`new`命令的问题。

```javascript
function Fubar (foo, bar) {
  if (this instanceof Fubar) {
    this._foo = foo;
    this._bar = bar;
  }
  else {
    return new Fubar(foo, bar);
  }
}
```

上面代码使用`instanceof`运算符，在函数体内部判断`this`关键字是否为构造函数`Fubar`的实例。如果不是，就表明忘了加`new`命令。


