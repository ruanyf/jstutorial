---
title: Object 对象与继承
layout: page
date: 2012-12-12
modifiedOn: 2013-05-04
category: oop
---

通过原型链，对象的属性分成两种：自身的属性和继承的属性。JavaScript 语言在`Object`对象上面，提供了很多相关方法，来处理这两种不同的属性。

## Object.getOwnPropertyNames()

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

## Object.prototype.hasOwnProperty()

对象实例的`hasOwnProperty`方法返回一个布尔值，用于判断某个属性定义在对象自身，还是定义在原型链上。

```javascript
Date.hasOwnProperty('length')
// true

Date.hasOwnProperty('toString')
// false
```

`hasOwnProperty`方法是JavaScript之中唯一一个处理对象属性时，不会遍历原型链的方法。

## in 运算符和 for...in 循环

`in`运算符返回一个布尔值，表示一个对象是否具有某个属性。它不区分该属性是对象自身的属性，还是继承的属性。

```javascript
'length' in Date // true
'toString' in Date // true
```

`in`运算符常用于检查一个属性是否存在。

获得对象的所有可枚举属性（不管是自身的还是继承的），可以使用`for...in`循环。

```javascript
var o1 = {p1: 123};

var o2 = Object.create(o1, {
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

上面代码依次获取`obj`对象的每一级原型对象“自身”的属性，从而获取`Obj`对象的“所有”属性，不管是否可遍历。

下面是一个例子，列出`Date`对象的所有属性。

```javascript
inheritedPropertyNames(Date)
// [
//  "caller",
//  "constructor",
//  "toString",
//  "UTC",
//  "call",
//  "parse",
//  "prototype",
//  "__defineSetter__",
//  "__lookupSetter__",
//  "length",
//  "arguments",
//  "bind",
//  "__lookupGetter__",
//  "isPrototypeOf",
//  "toLocaleString",
//  "propertyIsEnumerable",
//  "valueOf",
//  "apply",
//  "__defineGetter__",
//  "name",
//  "now",
//  "hasOwnProperty"
// ]
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

## 参考链接

- Dr. Axel Rauschmayer, [JavaScript properties: inheritance and enumerability](http://www.2ality.com/2011/07/js-properties.html)
