---
title: this 关键字
layout: page
category: oop
date: 2016-06-28
modifiedOn: 2016-06-28
---

## 涵义

`this`关键字是一个非常重要的语法点。毫不夸张地说，不理解它的含义，大部分开发任务都无法完成。

首先，`this`总是返回一个对象，简单说，就是返回属性或方法“当前”所在的对象。

```javascript
this.property
```

上面代码中，`this`就代表`property`属性当前所在的对象。

下面是一个实际的例子。

```javascript
var person = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};

person.describe()
// "姓名：张三"
```

上面代码中，`this.name`表示`describe`方法所在的当前对象的`name`属性。调用`person.describe`方法时，`describe`方法所在的当前对象是`person`，所以就是调用`person.name`。

由于对象的属性可以赋给另一个对象，所以属性所在的当前对象是可变的，即`this`的指向是可变的。

```javascript
var A = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};

var B = {
  name: '李四'
};

B.describe = A.describe;
B.describe()
// "姓名：李四"
```

上面代码中，`A.describe`属性被赋给`B`，于是`B.describe`就表示`describe`方法所在的当前对象是`B`，所以`this.name`就指向`B.name`。

稍稍重构这个例子，`this`的动态指向就能看得更清楚。

```javascript
function f() {
  return '姓名：'+ this.name;
}

var A = {
  name: '张三',
  describe: f
};

var B = {
  name: '李四',
  describe: f
};

A.describe() // "姓名：张三"
B.describe() // "姓名：李四"
```

上面代码中，函数`f`内部使用了`this`关键字，随着`f`所在的对象不同，`this`的指向也不同。

只要函数被赋给另一个变量，`this`的指向就会变。

```javascript
var A = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};

var name = '李四';
var f = A.describe;
f() // "姓名：李四"
```

上面代码中，`A.describe`被赋值给变量`f`，内部的`this`就会指向`f`运行时所在的对象（本例是顶层对象）。

再看一个网页编程的例子。

```html
<input type="text" name="age" size=3 onChange="validate(this, 18, 99);">

<script>
function validate(obj, lowval, hival){
  if ((obj.value < lowval) || (obj.value > hival))
    console.log('Invalid Value!');
}
</script>
```

上面代码是一个文本输入框，每当用户输入一个值，就会调用`onChange`回调函数，验证这个值是否在指定范围。回调函数传入`this`，就代表传入当前对象（即文本框），然后就可以从`this.value`上面读到用户的输入值。

总结一下，JavaScript语言之中，一切皆对象，运行环境也是对象，所以函数都是在某个对象之中运行，`this`就是这个对象（环境）。这本来并不会让用户糊涂，但是JavaScript支持运行环境动态切换，也就是说，`this`的指向是动态的，没有办法事先确定到底指向哪个对象，这才是最让初学者感到困惑的地方。

如果一个函数在全局环境中运行，那么`this`就是指顶层对象（浏览器中为`window`对象）。

```javascript
function f() {
  return this;
}

f() === window // true
```

上面代码中，函数`f`在全局环境运行，它内部的`this`就指向顶层对象`window`。

可以近似地认为，`this`是所有函数运行时的一个隐藏参数，指向函数的运行环境。

## 使用场合

`this`的使用可以分成以下几个场合。

**（1）全局环境**

在全局环境使用`this`，它指的就是顶层对象`window`。

```javascript
this === window // true

function f() {
  console.log(this === window); // true
}
```

上面代码说明，不管是不是在函数内部，只要是在全局环境下运行，`this`就是指顶层对象`window`。

**（2）构造函数**

构造函数中的`this`，指的是实例对象。

```javascript
var Obj = function (p) {
  this.p = p;
};

Obj.prototype.m = function() {
  return this.p;
};
```

上面代码定义了一个构造函数`Obj`。由于`this`指向实例对象，所以在构造函数内部定义`this.p`，就相当于定义实例对象有一个`p`属性；然后`m`方法可以返回这个p属性。

```javascript
var o = new Obj('Hello World!');

o.p // "Hello World!"
o.m() // "Hello World!"
```

**（3）对象的方法**

当A对象的方法被赋予B对象，该方法中的`this`就从指向A对象变成了指向B对象。所以要特别小心，将某个对象的方法赋值给另一个对象，会改变`this`的指向。

请看下面的代码。

```javascript
var obj ={
  foo: function () {
    console.log(this);
  }
};

obj.foo() // obj
```

上面代码中，`obj.foo`方法执行时，它内部的`this`指向`obj`。

但是，只有这一种用法（直接在`obj`对象上调用`foo`方法），`this`指向`obj`；其他用法时，`this`都指向代码块当前所在对象（浏览器为`window`对象）。

```javascript
// 情况一
(obj.foo = obj.foo)() // window

// 情况二
(false || obj.foo)() // window

// 情况三
(1, obj.foo)() // window
```

上面代码中，`obj.foo`先运算再执行，即使它的值根本没有变化，`this`也不再指向`obj`了。

可以这样理解，在JavaScript引擎内部，`obj`和`obj.foo`储存在两个内存地址，简称为`M1`和`M2`。只有`obj.foo()`这样调用时，是从`M1`调用`M2`，因此`this`指向`obj`。但是，上面三种情况，都是直接取出`M2`进行运算，然后就在全局环境执行运算结果（还是`M2`），因此`this`指向全局环境。

上面三种情况等同于下面的代码。

```javascript
// 情况一
(obj.foo = function () {
  console.log(this);
})()

// 情况二
(false || function () {
  console.log(this);
})()

// 情况三
(1, function () {
  console.log(this);
})()
```

同样的，如果某个方法位于多层对象的内部，这时为了简化书写，把该方法赋值给一个变量，往往会得到意料之外的结果。

```javascript
var a = {
  b: {
    m: function() {
      console.log(this.p);
    },
    p: 'Hello'
  }
};

var hello = a.b.m;
hello() // undefined
```

上面代码中，`m`是多层对象内部的一个方法。为求简便，将其赋值给`hello`变量，结果调用时，`this`指向了顶层对象。为了避免这个问题，可以只将`m`所在的对象赋值给`hello`，这样调用时，`this`的指向就不会变。

```javascript
var hello = a.b;
hello.m() // Hello
```

**（4）Node**

在Node中，`this`的指向又分成两种情况。全局环境中，`this`指向全局对象`global`；模块环境中，`this`指向module.exports。

```javascript
// 全局环境
this === global // true

// 模块环境
this === module.exports // true
```

## 使用注意点

**（1）避免多层this**

由于`this`的指向是不确定的，所以切勿在函数中包含多层的`this`。

```javascript
var o = {
  f1: function () {
    console.log(this);
    var f2 = function () {
      console.log(this);
    }();
  }
}

o.f1()
// Object
// Window
```

上面代码包含两层`this`，结果运行后，第一层指向该对象，第二层指向全局对象。实际执行的是下面的代码。

```javascript
var temp = function () {
  console.log(this);
};

var o = {
  f1: function () {
    console.log(this);
    var f2 = temp();
  }
}
```

一个解决方法是在第二层改用一个指向外层`this`的变量。

```javascript
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
```

上面代码定义了变量`that`，固定指向外层的`this`，然后在内层使用`that`，就不会发生`this`指向的改变。

事实上，使用一个变量固定`this`的值，然后内层函数调用这个变量，是非常常见的做法，有大量应用，请务必掌握。

JavaScript 提供了严格模式，也可以硬性避免这种问题。在严格模式下，如果函数内部的`this`指向顶层对象，就会报错。

```javascript
var counter = {
  count: 0
};
counter.inc = function () {
  'use strict';
  this.count++
};
var f = counter.inc;
f()
// TypeError: Cannot read property 'count' of undefined
```

上面代码中，`inc`方法通过`'use strict'`声明采用严格模式，这时内部的`this`一旦指向顶层对象，就会报错。

**（2）避免数组处理方法中的this**

数组的`map`和`foreach`方法，允许提供一个函数作为参数。这个函数内部不应该使用`this`。

```javascript
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
      console.log(this.v + ' ' + item);
    });
  }
}

o.f()
// undefined a1
// undefined a2
```

上面代码中，`foreach`方法的回调函数中的`this`，其实是指向`window`对象，因此取不到`o.v`的值。原因跟上一段的多层`this`是一样的，就是内层的`this`不指向外部，而指向顶层对象。

解决这个问题的一种方法，是使用中间变量。

```javascript
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
```

另一种方法是将`this`当作`foreach`方法的第二个参数，固定它的运行环境。

```javascript
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
      console.log(this.v + ' ' + item);
    }, this);
  }
}

o.f()
// hello a1
// hello a2
```

**（3）避免回调函数中的this**

回调函数中的`this`往往会改变指向，最好避免使用。

```javascript
var o = new Object();

o.f = function () {
  console.log(this === o);
}

o.f() // true
```

上面代码表示，如果调用`o`对象的f方法，其中的`this`就是指向`o`对象。

但是，如果将`f`方法指定给某个按钮的`click`事件，this的指向就变了。

```javascript
$('#button').on('click', o.f);
```

点击按钮以后，控制台会显示`false`。原因是此时`this`不再指向`o`对象，而是指向按钮的DOM对象，因为`f`方法是在按钮对象的环境中被调用的。这种细微的差别，很容易在编程中忽视，导致难以察觉的错误。

为了解决这个问题，可以采用下面的一些方法对`this`进行绑定，也就是使得`this`固定指向某个对象，减少不确定性。

## 绑定 this 的方法

`this`的动态切换，固然为JavaScript创造了巨大的灵活性，但也使得编程变得困难和模糊。有时，需要把`this`固定下来，避免出现意想不到的情况。JavaScript提供了`call`、`apply`、`bind`这三个方法，来切换/固定`this`的指向。

### function.prototype.call()

函数实例的`call`方法，可以指定函数内部`this`的指向（即函数执行时所在的作用域），然后在所指定的作用域中，调用该函数。

```javascript
var obj = {};

var f = function () {
  return this;
};

f() === this // true
f.call(obj) === obj // true
```

上面代码中，在全局环境运行函数`f`时，`this`指向全局环境；`call`方法可以改变`this`的指向，指定`this`指向对象`obj`，然后在对象`obj`的作用域中运行函数`f`。

`call`方法的参数，应该是一个对象。如果参数为空、`null`和`undefined`，则默认传入全局对象。

```javascript
var n = 123;
var obj = { n: 456 };

function a() {
  console.log(this.n);
}

a.call() // 123
a.call(null) // 123
a.call(undefined) // 123
a.call(window) // 123
a.call(obj) // 456
```

上面代码中，`a`函数中的`this`关键字，如果指向全局对象，返回结果为`123`。如果使用`call`方法将`this`关键字指向`obj`对象，返回结果为`456`。可以看到，如果`call`方法没有参数，或者参数为`null`或`undefined`，则等同于指向全局对象。

如果`call`方法的参数是一个原始值，那么这个原始值会自动转成对应的包装对象，然后传入`call`方法。

```javascript
var f = function () {
  return this;
};

f.call(5)
// Number {[[PrimitiveValue]]: 5}
```

上面代码中，`call`的参数为`5`，不是对象，会被自动转成包装对象（`Number`的实例），绑定`f`内部的`this`。

`call`方法还可以接受多个参数。

```javascript
func.call(thisValue, arg1, arg2, ...)
```

`call`的第一个参数就是`this`所要指向的那个对象，后面的参数则是函数调用时所需的参数。

```javascript
function add(a, b) {
  return a + b;
}

add.call(this, 1, 2) // 3
```

上面代码中，`call`方法指定函数`add`内部的`this`绑定当前环境（对象），并且参数为`1`和`2`，因此函数`add`运行后得到`3`。

`call`方法的一个应用是调用对象的原生方法。

```javascript
var obj = {};
obj.hasOwnProperty('toString') // false

// 覆盖掉继承的 hasOwnProperty 方法
obj.hasOwnProperty = function () {
  return true;
};
obj.hasOwnProperty('toString') // true

Object.prototype.hasOwnProperty.call(obj, 'toString') // false
```

上面代码中，`hasOwnProperty`是`obj`对象继承的方法，如果这个方法一旦被覆盖，就不会得到正确结果。`call`方法可以解决这个方法，它将`hasOwnProperty`方法的原始定义放到`obj`对象上执行，这样无论`obj`上有没有同名方法，都不会影响结果。

### function.prototype.apply()

`apply`方法的作用与`call`方法类似，也是改变`this`指向，然后再调用该函数。唯一的区别就是，它接收一个数组作为函数执行时的参数，使用格式如下。

```javascript
func.apply(thisValue, [arg1, arg2, ...])
```

`apply`方法的第一个参数也是`this`所要指向的那个对象，如果设为null或undefined，则等同于指定全局对象。第二个参数则是一个数组，该数组的所有成员依次作为参数，传入原函数。原函数的参数，在`call`方法中必须一个个添加，但是在`apply`方法中，必须以数组形式添加。

请看下面的例子。

```javascript
function f(x,y){
  console.log(x+y);
}

f.call(null,1,1) // 2
f.apply(null,[1,1]) // 2
```

上面的f函数本来接受两个参数，使用apply方法以后，就变成可以接受一个数组作为参数。

利用这一点，可以做一些有趣的应用。

**（1）找出数组最大元素**

JavaScript不提供找出数组最大元素的函数。结合使用apply方法和Math.max方法，就可以返回数组的最大元素。

```javascript
var a = [10, 2, 4, 15, 9];

Math.max.apply(null, a)
// 15
```

**（2）将数组的空元素变为`undefined`**

通过`apply`方法，利用Array构造函数将数组的空元素变成undefined。

```javascript
Array.apply(null, ["a",,"b"])
// [ 'a', undefined, 'b' ]
```

空元素与`undefined`的差别在于，数组的`forEach`方法会跳过空元素，但是不会跳过`undefined`。因此，遍历内部元素的时候，会得到不同的结果。

```javascript
var a = ['a', , 'b'];

function print(i) {
  console.log(i);
}

a.forEach(print)
// a
// b

Array.apply(null, a).forEach(print)
// a
// undefined
// b
```

**（3）转换类似数组的对象**

另外，利用数组对象的`slice`方法，可以将一个类似数组的对象（比如`arguments`对象）转为真正的数组。

```javascript
Array.prototype.slice.apply({0:1,length:1})
// [1]

Array.prototype.slice.apply({0:1})
// []

Array.prototype.slice.apply({0:1,length:2})
// [1, undefined]

Array.prototype.slice.apply({length:1})
// [undefined]
```

上面代码的`apply`方法的参数都是对象，但是返回结果都是数组，这就起到了将对象转成数组的目的。从上面代码可以看到，这个方法起作用的前提是，被处理的对象必须有length属性，以及相对应的数字键。

**（4）绑定回调函数的对象**

上一节按钮点击事件的例子，可以改写成

```javascript
var o = new Object();

o.f = function () {
  console.log(this === o);
}

var f = function (){
  o.f.apply(o);
  // 或者 o.f.call(o);
};

$('#button').on('click', f);
```

点击按钮以后，控制台将会显示`true`。由于`apply`方法（或者`call`方法）不仅绑定函数执行时所在的对象，还会立即执行函数，因此不得不把绑定语句写在一个函数体内。更简洁的写法是采用下面介绍的`bind`方法。

### function.prototype.bind()

`bind`方法用于将函数体内的`this`绑定到某个对象，然后返回一个新函数。

```javascript
var print = console.log;
print(2)
// TypeError: Illegal invocation
```

上面代码中，我们将`console`对象的`log`赋给变量`print`，然后调用`print`就报错了，因为这时`log`方法内部的`this`已经不指向`console`对象了。

`bind`方法可以解决这个问题，让`log`方法绑定`console`对象。

```javascript
var print = console.log.bind(console);
print(2)
// 2
```

上面代码中，`bind`方法将`log`方法内部的`this`绑定到`console`对象，这时就可以安全地将这个方法赋值给其他变量了。

下面是一个更清晰的例子。

```javascript
var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};

counter.count // 0
counter.inc()
counter.count // 1
```

上面代码中，`counter.inc`内部的`this`，默认指向`counter`对象。如果将这个方法赋值给另一个变量，就会出错。

```javascript
var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};

var func = counter.inc;
func();
counter.count // 0
count // NaN
```

上面代码中，函数`func`是在全局环境中运行的，这时`inc`内部的`this`指向顶层对象`window`，所以`counter.count`是不会变的，反而创建了一个全局变量`count`。因为`window.count`原来等于`undefined`，进行递增运算后`undefined++`就等于`NaN`。

为了解决这个问题，可以使用`this`方法，将`inc`内部的`this`绑定到`counter`对象。

```javascript
var func = counter.inc.bind(counter);
func();
counter.count // 1
```

上面代码中，`bind`方法将`inc`方法绑定到`counter`以后，再运行`func`就会得到正确结果。

`this`绑定到其他对象也是可以的。

```javascript
var obj = {
  count: 100
};
var func = counter.inc.bind(obj);
func();
obj.count // 101
```

上面代码中，`bind`方法将`inc`方法内部的`this`，绑定到`obj`对象。结果调用`func`函数以后，递增的就是`obj`内部的`count`属性。

`bind`比`call`方法和`apply`方法更进一步的是，除了绑定`this`以外，还可以绑定原函数的参数。

```javascript
var add = function (x, y) {
  return x * this.m + y * this.n;
}

var obj = {
  m: 2,
  n: 2
};

var newAdd = add.bind(obj, 5);

newAdd(5)
// 20
```

上面代码中，`bind`方法除了绑定`this`对象，还将`add`函数的第一个参数`x`绑定成`5`，然后返回一个新函数`newAdd`，这个函数只要再接受一个参数`y`就能运行了。

如果`bind`方法的第一个参数是`null`或`undefined`，等于将`this`绑定到全局对象，函数运行时`this`指向顶层对象（在浏览器中为`window`）。

```javascript
function add(x, y) {
  return x + y;
}

var plus5 = add.bind(null, 5);
plus5(10) // 15
```

上面代码中，函数`add`内部并没有`this`，使用`bind`方法的主要目的是绑定参数`x`，以后每次运行新函数`plus5`，就只需要提供另一个参数`y`就够了。而且因为`add`内部没有`this`，所以`bind`的第一个参数是`null`，不过这里如果是其他对象，也没有影响。

对于那些不支持`bind`方法的老式浏览器，可以自行定义`bind`方法。

```javascript
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
```

`bind`方法有一些使用注意点。

**（1）每一次返回一个新函数**

`bind`方法每运行一次，就返回一个新函数，这会产生一些问题。比如，监听事件的时候，不能写成下面这样。

```javascript
element.addEventListener('click', o.m.bind(o));
```

上面代码中，`click`事件绑定`bind`方法生成的一个匿名函数。这样会导致无法取消绑定，所以，下面的代码是无效的。

```javascript
element.removeEventListener('click', o.m.bind(o));
```

正确的方法是写成下面这样：

```javascript
var listener = o.m.bind(o);
element.addEventListener('click', listener);
//  ...
element.removeEventListener('click', listener);
```

**（2）结合回调函数使用**

回调函数是JavaScript最常用的模式之一，但是一个常见的错误是，将包含`this`的方法直接当作回调函数。

```javascript
var counter = {
  count: 0,
  inc: function () {
    'use strict';
    this.count++;
  }
};

function callIt(callback) {
  callback();
}

callIt(counter.inc)
// TypeError: Cannot read property 'count' of undefined
```

上面代码中，`counter.inc`方法被当作回调函数，传入了`callIt`，调用时其内部的`this`指向`callIt`运行时所在的对象，即顶层对象`window`，所以得不到预想结果。注意，上面的`counter.inc`方法内部使用了严格模式，在该模式下，`this`指向顶层对象时会报错，一般模式不会。

解决方法就是使用`bind`方法，将`counter.inc`绑定`counter`。

```javascript
callIt(counter.inc.bind(counter));
counter.count // 1
```

还有一种情况比较隐蔽，就是某些数组方法可以接受一个函数当作参数。这些函数内部的`this`指向，很可能也会出错。

```javascript
var obj = {
  name: '张三',
  times: [1, 2, 3],
  print: function () {
    this.times.forEach(function (n) {
      console.log(this.name);
    });
  }
};

obj.print()
// 没有任何输出
```

上面代码中，`obj.print`内部`this.times`的`this`是指向`obj`的，这个没有问题。但是，`forEach`方法的回调函数内部的`this.name`却是指向全局对象，导致没有办法取到值。稍微改动一下，就可以看得更清楚。

```javascript
obj.print = function () {
  this.times.forEach(function (n) {
    console.log(this === window);
  });
};

obj.print()
// true
// true
// true
```

解决这个问题，也是通过`bind`方法绑定`this`。

```javascript
obj.print = function () {
  this.times.forEach(function (n) {
    console.log(this.name);
  }.bind(this));
};

obj.print()
// 张三
// 张三
// 张三
```

**（3）结合`call`方法使用**

利用`bind`方法，可以改写一些JavaScript原生方法的使用形式，以数组的`slice`方法为例。

```javascript
[1, 2, 3].slice(0, 1)
// [1]

// 等同于

Array.prototype.slice.call([1, 2, 3], 0, 1)
// [1]
```

上面的代码中，数组的slice方法从`[1, 2, 3]`里面，按照指定位置和长度切分出另一个数组。这样做的本质是在`[1, 2, 3]`上面调用`Array.prototype.slice`方法，因此可以用`call`方法表达这个过程，得到同样的结果。

`call`方法实质上是调用`Function.prototype.call`方法，因此上面的表达式可以用`bind`方法改写。

```javascript
var slice = Function.prototype.call.bind(Array.prototype.slice);

slice([1, 2, 3], 0, 1) // [1]
```

可以看到，利用bind方法，将`[1, 2, 3].slice(0, 1)`变成了`slice([1, 2, 3], 0, 1)`的形式。这种形式的改变还可以用于其他数组方法。

```javascript
var push = Function.prototype.call.bind(Array.prototype.push);
var pop = Function.prototype.call.bind(Array.prototype.pop);

var a = [1 ,2 ,3];
push(a, 4)
a // [1, 2, 3, 4]

pop(a)
a // [1, 2, 3]
```

如果再进一步，将`Function.prototype.call`方法绑定到`Function.prototype.bind`对象，就意味着`bind`的调用形式也可以被改写。

```javascript
function f() {
  console.log(this.v);
}

var o = { v: 123 };

var bind = Function.prototype.call.bind(Function.prototype.bind);

bind(f, o)() // 123
```

上面代码表示，将`Function.prototype.call`方法绑定`Function.prototype.bind`以后，`bind`方法的使用形式从`f.bind(o)`，变成了`bind(f, o)`。

## 参考链接

- Jonathan Creamer, [Avoiding the "this" problem in JavaScript](http://tech.pro/tutorial/1192/avoiding-the-this-problem-in-javascript)
- Erik Kronberg, [Bind, Call and Apply in JavaScript](https://variadic.me/posts/2013-10-22-bind-call-and-apply-in-javascript.html)
- Axel Rauschmayer, [JavaScript’s this: how it works, where it can trip you up](http://www.2ality.com/2014/05/this.html)
