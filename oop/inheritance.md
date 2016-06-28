---
title: 继承
layout: page
date: 2012-12-12
modifiedOn: 2013-05-04
category: oop
---

大部分面向对象的编程语言，是在“类”（class）的基础上实现继承的。JavaScript语言不是如此，它的继承机制基于“原型对象”。

## 构造函数的继承

本节介绍如何让一个构造函数，继承另一个构造函数。

下面是一个`Shape`构造函数。

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

上面代码中，子类是整体继承父类。有时只需要单个方法的继承，这时可以采用下面的写法。

```javascript
ClassB.prototype.print = function() {
  ClassA.prototype.print.call(this);
  // some code
}
```

上面代码中，子类`B`的`print`方法先调用父类`A`的`print`方法，再部署自己的代码。这就等于继承了父类`A`的`print`方法。

## 属性的继承

属性分成两种。一种是对象自身的原生属性，另一种是继承自原型的继承属性。

### 对象的原生属性

`Object.getOwnPropertyNames`方法返回一个数组，成员是对象本身的所有属性的键名，不包含继承的属性键名。

```javascript
Object.getOwnPropertyNames(Date)
// ["parse", "arguments", "UTC", "caller", "name", "prototype", "now", "length"]
```

上面代码中，`Object.getOwnPropertyNames`方法返回`Date`所有自身的属性名。

对象本身的属性之中，有的是可以枚举的（enumerable），有的是不可以枚举的，`Object.getOwnPropertyNames`方法返回所有键名。只获取那些可以枚举的属性，使用`Object.keys`方法。

```javascript
Object.keys(Date) // []
```

### Object.prototype.hasOwnProperty()

对象实例的`hasOwnProperty`方法返回一个布尔值，用于判断某个属性定义在对象自身，还是定义在原型链上。

```javascript
Date.hasOwnProperty('length')
// true

Date.hasOwnProperty('toString')
// false
```

`hasOwnProperty`方法是JavaScript之中唯一一个处理对象属性时，不会遍历原型链的方法。

### 获取所有属性

判断一个对象是否具有某个属性（不管是自身的还是继承的），使用`in`运算符。

```javascript
"length" in Date // true
"toString" in Date // true
```

获得对象的所有可枚举属性（不管是自身的还是继承的），可以使用`for...in`循环。

```javascript
var o1 = {p1: 123};

var o2 = Object.create(o1,{
  p2: { value: "abc", enumerable: true }
});

for (p in o2) {console.info(p);}
// p2
// p1
```

为了在`for...in`循环中获得对象自身的属性，可以采用`hasOwnProperty`方法判断一下。

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
function M1() {
  this.hello = 'hello';
}

function M2() {
  this.world = 'world';
}

function S() {
  M1();
  M2();
}
S.prototype = new M1();

var s = new S();
s.hello // 'hello'
s.world // 'world'
```

上面代码中，子类`S`同时继承了父类`M1`和`M2`。当然，从继承链来看，`S`只有一个父类`M1`，但是由于在`S`的实例上，同时执行`M1`和`M2`的构造函数，所以它同时继承了这两个类的方法。

## 参考链接

- Dr. Axel Rauschmayer, [JavaScript properties: inheritance and enumerability](http://www.2ality.com/2011/07/js-properties.html)
