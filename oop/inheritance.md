---
title: 继承
layout: page
date: 2012-12-12
modifiedOn: 2013-05-04
category: oop
---

## 概述

JavaScript的所有对象，都有自己的继承链。也就是说，每个对象都继承另一个对象，该对象称为“原型”（prototype）对象。只有`null`除外，它没有自己的原型对象。

A对象是B对象的原型，那么B对象可以拿到A对象的所有属性和方法，这就是原型对象的重要性。

`Object.getPrototypof`方法用于获取当前对象的原型对象。

```javascript
var p = Object.getPrototypeOf(obj);
```

上面代码中，对象`p`就是对象`obj`的原型对象。

`Object.create`方法用于生成一个新的对象，继承原型对象。

```javascript
var obj = Object.create(p);
```

上面代码中，从原型对象`p`生成一个新的对象`obj`。

`__proto__`属性（前后各两个下划线），可以改写某个对象的原型对象。

```javascript
var obj = {};
var p = {};

obj.__proto__ = p;
Object.getPrototypeOf(obj) === p // true
```

上面代码通过`__proto__`属性，将`p`对象设为`obj`对象的原型。

下面是一个实际的例子。

```javascript
var a = {x: 1};
var b = {__proto__: a};
b.x // 1
```

上面代码中，`b`对象通过`__proto__`属性，将自己的原型对象设为`a`对象，因此`b`对象可以拿到`a`对象的所有属性和方法。`b`对象本身并没有`x`属性，但是JavaScript引擎通过`__proto__`属性，找到它的原型对象`a`，然后读取`a`的`x`属性。

原型对象自己的`__proto__`属性，也可以指向其他对象，从而一级一级地形成“原型链”（prototype chain）。

```javascript
var a = { x: 1 };
var b = { __proto__: a };
var c = { __proto__: b };

c.x // 1
```

## 构造函数的继承

这个小节介绍，如何让一个构造函数，继承另一个构造函数。

假定有一个`Shape`构造函数。

```javascript
function Shape() {
  this.x = 0;
  this.y = 0;
}

Shape.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};
```

`Rectangle`构造函数继承`Shape`。

```javascript
function Rectangle() {
  Shape.call(this); // 调用父类构造函数
}
// 另一种写法
function Rectangle() {
  this.base = Shape;
  this.base();
}

// 子类继承父类的方法
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();

rect instanceof Rectangle  // true
rect instanceof Shape  // true

rect.move(1, 1) // 'Shape moved.'
```

上面代码表示，构造函数的继承分成两部分，一部分是子类调用父类的构造方法，另一部分是子类的原型指向父类的原型。

上面代码中，子类是整体继承父类。有时，只需要单个方法的继承，这时可以采用下面的写法。

```javascript
ClassB.prototype.print = function() {
  ClassA.prototype.print.call(this);
  // some code
}
```

上面代码中，子类B的`print`方法先调用父类A的`print`方法，再部署自己的代码。这就等于继承了父类A的`print`方法。

## `__proto__`属性

`__proto__`属性指向当前对象的原型对象，即构造函数的prototype属性。

```javascript
var obj = new Object();

obj.__proto__ === Object.prototype
// true

obj.__proto__ === obj.constructor.prototype
// true
```

上面代码首先新建了一个对象`obj`，它的`__proto__`属性，指向构造函数（`Object`或`obj.constructor`）的prototype属性。所以，两者比较以后，返回`true`。

因此，获取实例对象`obj`的原型对象，有三种方法。

- `obj.__proto__`
- `obj.constructor.prototype`
- `Object.getPrototypeOf(obj)`

第三种方法的用法如下。

```javascript
var o = new Object();

o.__proto__ === Object.getPrototypeOf(o)
// true
```

可以使用Object.getPrototypeOf方法，检查浏览器是否支持`__proto__`属性，老式浏览器不支持这个属性。

```javascript
Object.getPrototypeOf({ __proto__: null }) === null
```

上面代码将一个对象的`__proto__`属性设为`null`，然后使用`Object.getPrototypeOf`方法获取这个对象的原型，判断是否等于`null`。如果当前环境支持`__proto__`属性，两者的比较结果应该是`true`。

有了`__proto__`属性，就可以很方便得设置实例对象的原型了。假定有三个对象`machine`、`vehicle`和`car`，其中`machine`是`vehicle`的原型，`vehicle`又是`car`的原型，只要两行代码就可以设置。

```javascript
vehicle.__proto__ = machine;
car.__proto__ = vehicle;
```

下面是一个实例，通过`__proto__`属性与`constructor.prototype`属性两种方法，分别读取定义在原型对象上的属性。

```javascript
Array.prototype.p = 'abc';
var a = new Array();

a.__proto__.p // abc
a.constructor.prototype.p // abc
```

显然，`__proto__`看上去更简洁一些。

通过构造函数生成实例对象时，实例对象的`__proto__`属性自动指向构造函数的prototype对象。

```javascript
var f = function (){};
var a = {};

f.prototype = a;
var o = new f();

o.__proto__ === a
// true
```

## 属性的继承

属性分成两种。一种是对象自身的原生属性，另一种是继承自原型的继承属性。

### 对象的原生属性

对象本身的所有属性，可以用Object.getOwnPropertyNames方法获得。

```javascript
Object.getOwnPropertyNames(Date)
// ["parse", "arguments", "UTC", "caller", "name", "prototype", "now", "length"]
```

对象本身的属性之中，有的是可以枚举的（enumerable），有的是不可以枚举的。只获取那些可以枚举的属性，使用Object.keys方法。

```javascript
Object.keys(Date) // []
```

判断对象是否具有某个属性，使用hasOwnProperty方法。

```javascript
Date.hasOwnProperty('length')
// true

Date.hasOwnProperty('toString')
// false
```

### 对象的继承属性

用Object.create方法创造的对象，会继承所有原型对象的属性。

```javascript
var proto = { p1: 123 };
var o = Object.create(proto);

o.p1 // 123
o.hasOwnProperty("p1") // false
```

### 获取所有属性

判断一个对象是否具有某个属性（不管是自身的还是继承的），使用in运算符。

```javascript
"length" in Date // true
"toString" in Date // true
```

获得对象的所有可枚举属性（不管是自身的还是继承的），可以使用for-in循环。

```javascript
var o1 = {p1: 123};

var o2 = Object.create(o1,{
  p2: { value: "abc", enumerable: true }
});

for (p in o2) {console.info(p);}
// p2
// p1
```

为了在`for...in`循环中获得对象自身的属性，可以采用hasOwnProperty方法判断一下。

```javascript
for ( var name in object ) {
  if ( object.hasOwnProperty(name) ) {
    /* loop code */
  }
}
```

获得对象的所有属性（不管是自身的还是继承的，以及是否可枚举），可以使用下面的函数。

```javascript
function inheritedPropertyNames(obj) {
  var props = {};
  while(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(p) {
      props[p] = true;
    });
    obj = Object.getPrototypeOf(obj);
  }
  return Object.getOwnPropertyNames(props);
}
```

用法如下：

```javascript
inheritedPropertyNames(Date)
// ["caller", "constructor", "toString", "UTC", "call", "parse", "prototype", "__defineSetter__", "__lookupSetter__", "length", "arguments", "bind", "__lookupGetter__", "isPrototypeOf", "toLocaleString", "propertyIsEnumerable", "valueOf", "apply", "__defineGetter__", "name", "now", "hasOwnProperty"]
```

## 对象的拷贝

如果要拷贝一个对象，需要做到下面两件事情。

- 确保拷贝后的对象，与原对象具有同样的prototype原型对象。
- 确保拷贝后的对象，与原对象具有同样的属性。

下面就是根据上面两点，编写的对象拷贝的函数。

```javascript
function copyObject(orig) {
  var copy = Object.create(Object.getPrototypeOf(orig));
  copyOwnPropertiesFrom(copy, orig);
  return copy;
}

function copyOwnPropertiesFrom(target, source) {
  Object
  .getOwnPropertyNames(source)
  .forEach(function(propKey) {
    var desc = Object.getOwnPropertyDescriptor(source, propKey);
    Object.defineProperty(target, propKey, desc);
  });
  return target;
}
```

## 多重继承

JavaScript不提供多重继承功能，即不允许一个对象同时继承多个对象。但是，可以通过变通方法，实现这个功能。

```javascript
function M1(prop) {
  this.hello = prop;
}

function M2(prop) {
  this.world = prop;
}

function S(p1, p2) {
  this.base1 = M1;
  this.base1(p1);
  this.base2 = M2;
  this.base2(p2);
}
S.prototype = new M1();

var s = new S(111, 222);
s.hello // 111
s.world // 222
```

上面代码中，子类`S`同时继承了父类`M1`和`M2`。当然，从继承链来看，`S`只有一个父类`M1`，但是由于在`S`的实例上，同时执行`M1`和`M2`的构造函数，所以它同时继承了这两个类的方法。

## 参考链接

- Dr. Axel Rauschmayer, [JavaScript properties: inheritance and enumerability](http://www.2ality.com/2011/07/js-properties.html)
