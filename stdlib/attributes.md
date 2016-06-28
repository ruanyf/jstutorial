---
title: 属性描述对象
layout: page
category: stdlib
date: 2016-06-29
modifiedOn: 2016-06-29
---

JavaScript提供了很多内部开关，控制一个对象的属性，描述它的行为。这被称为“属性描述对象”（attributes object）。

在JavaScript内部，每个属性都有一个对应的attributes对象，保存该属性的一些元信息。

## Object.getOwnPropertyDescriptor()

`Object.getOwnPropertyDescriptor`方法可以读出属性描述对象。

```javascript
var o = { p: 'a' };

Object.getOwnPropertyDescriptor(o, 'p')
// Object { value: "a",
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

上面代码表示，使用`Object.getOwnPropertyDescriptor`方法，读取`o`对象的`p`属性的属性描述对象。

属性描述对象包含如下元信息。

- `value`：表示该属性的值，默认为`undefined`。
- `writable`：表示该属性的值（value）是否可以改变，默认为`true`。
- `enumerable`： 表示该属性是否可枚举，默认为`true`。如果设为`false`，会使得某些操作（比如`for...in`循环、`Object.keys()`）跳过该属性。
- `configurable`：表示“可配置性”，默认为true。如果设为false，将阻止某些操作改写该属性，比如，无法删除该属性，也不得改变该属性的attributes对象（value属性除外），也就是说，configurable属性控制了attributes对象的可写性。
- `get`：表示该属性的取值函数（getter），默认为`undefined`。
- `set`：表示该属性的存值函数（setter），默认为`undefined`。

## Object.defineProperty()，Object.defineProperties()

`Object.defineProperty`方法允许通过定义`attributes`对象，来定义或修改一个属性，然后返回修改后的对象。它的格式如下：

```javascript
Object.defineProperty(object, propertyName, attributesObject)
```

`Object.defineProperty`方法接受三个参数，第一个是属性所在的对象，第二个是属性名（它应该是一个字符串），第三个是属性的描述对象。比如，新建一个`o`对象，并定义它的`p`属性，写法如下。

```javascript
var o = Object.defineProperty({}, 'p', {
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false
});

o.p
// 123

o.p = 246;
o.p
// 123
// 因为writable为false，所以无法改变该属性的值
```

需要注意的是，`Object.defineProperty`方法和后面的`Object.defineProperties`方法，都有性能损耗，会拖慢执行速度，不宜大量使用。

`Object.defineProperty`的一个用途，是设置动态属性名。

```javascript
Object.defineProperty(obj, someFunction(), {value: true});
```

如果一次性定义或修改多个属性，可以使用`Object.defineProperties`方法。

```javascript
var o = Object.defineProperties({}, {
  p1: { value: 123, enumerable: true },
  p2: { value: 'abc', enumerable: true },
  p3: { get: function () { return this.p1 + this.p2 },
    enumerable:true,
    configurable:true
  }
});

o.p1 // 123
o.p2 // "abc"
o.p3 // "123abc"
```

上面代码中的`p3`属性，定义了取值函数`get`。这时需要注意的是，一旦定义了取值函数`get`（或存值函数`set`），就不能将`writable`设为`true`，或者同时定义`value`属性，否则会报错。

```javascript
var o = {};

Object.defineProperty(o, 'p', {
  value: 123,
  get: function() { return 456; }
});
// TypeError: Invalid property.
// A property cannot both have accessors and be writable or have a value,
```

上面代码同时定义了`get`属性和`value`属性，结果就报错。

`Object.defineProperty()`和`Object.defineProperties()`的第三个参数，是一个属性对象。它的`writable`、`configurable`、`enumerable`这三个属性的默认值都为`false`。

`writable`属性为`false`，表示对应的属性的值将不得改写。

```javascript
var o = {};

Object.defineProperty(o, 'p', {
  value: "bar"
});

o.p // bar

o.p = 'foobar';
o.p // bar

Object.defineProperty(o, 'p', {
  value: 'foobar',
});
// TypeError: Cannot redefine property: p
```

上面代码由于`writable`属性默认为`false`，导致无法对`p`属性重新赋值，但是不会报错（严格模式下会报错）。不过，如果再一次使用`Object.defineProperty`方法对`value`属性赋值，就会报错。

`configurable`属性为`false`，将无法删除该属性，也无法修改`attributes`对象（`value`属性除外）。

```javascript
var o = {};

Object.defineProperty(o, 'p', {
  value: 'bar',
});

delete o.p
o.p // "bar"
```

上面代码中，由于`configurable`属性默认为`false`，导致无法删除某个属性。

`enumerable`属性为`false`，表示对应的属性不会出现在`for...in`循环和`Object.keys`方法中。

```javascript
var o = {
  p1: 10,
  p2: 13,
};

Object.defineProperty(o, 'p3', {
  value: 3,
});

for (var i in o) {
  console.log(i, o[i]);
}
// p1 10
// p2 13
```

上面代码中，`p3`属性是用`Object.defineProperty`方法定义的，由于`enumerable`属性默认为`false`，所以不出现在`for...in`循环中。

## 元属性

属性描述对象的属性，被称为“元属性”，因为它可以看作是控制属性的属性。

### 可枚举性（enumerable）

可枚举性（enumerable）用来控制所描述的属性，是否将被包括在`for...in`循环之中。具体来说，如果一个属性的`enumerable`为`false`，下面三个操作不会取到该属性。

- `for..in`循环
- `Object.keys`方法
- `JSON.stringify`方法

因此，`enumerable`可以用来设置“秘密”属性。

```javascript
var o = {a: 1, b: 2};

o.c = 3;
Object.defineProperty(o, 'd', {
  value: 4,
  enumerable: false
});

o.d
// 4

for( var key in o ) console.log( o[key] );
// 1
// 2
// 3

Object.keys(o)  // ["a", "b", "c"]

JSON.stringify(o // => "{a:1,b:2,c:3}"
```

上面代码中，`d`属性的`enumerable`为`false`，所以一般的遍历操作都无法获取该属性，使得它有点像“秘密”属性，但还是可以直接获取它的值。

至于`for...in`循环和`Object.keys`方法的区别，在于前者包括对象继承自原型对象的属性，而后者只包括对象本身的属性。如果需要获取对象自身的所有属性，不管enumerable的值，可以使用`Object.getOwnPropertyNames`方法，详见下文。

考虑到`JSON.stringify`方法会排除`enumerable`为`false`的值，有时可以利用这一点，为对象添加注释信息。

```javascript
var car = {
  id: 123,
  color: 'red',
  ownerId: 12
};

var owner = {
  id: 12,
  name: 'Jack'
};

Object.defineProperty(car, 'ownerInfo', {value: owner, enumerable: false});
car.ownerInfo // {id: 12, name: "Jack"}

JSON.stringify(car) //  "{"id": 123,"color": "red","ownerId": 12}"
```

上面代码中，`owner`对象作为注释，加入`car`对象。由于`ownerInfo`属性不可枚举，所以`JSON.stringify`方法最后输出`car`对象时，会忽略`ownerInfo`属性。

这提示我们，如果你不愿意某些属性出现在JSON输出之中，可以把它的`enumerable`属性设为`false`。

### 可配置性（configurable）

可配置性（configurable）决定了是否可以修改属性的描述对象。也就是说，当configurable为false的时候，value、writable、enumerable和configurable都不能被修改了。

```javascript

var o = Object.defineProperty({}, 'p', {
        value: 1,
        writable: false, 
        enumerable: false, 
        configurable: false
});

Object.defineProperty(o,'p', {value: 2})
// TypeError: Cannot redefine property: p

Object.defineProperty(o,'p', {writable: true})
// TypeError: Cannot redefine property: p

Object.defineProperty(o,'p', {enumerable: true})
// TypeError: Cannot redefine property: p

Object.defineProperties(o,'p',{configurable: true})
// TypeError: Cannot redefine property: p

```

上面代码首先生成对象o，并且定义属性p的configurable为false。然后，逐一改动value、writable、enumerable、configurable，结果都报错。

需要注意的是，writable只有在从false改为true会报错，从true改为false则是允许的。

```javascript

var o = Object.defineProperty({}, 'p', {
        writable: true
});

Object.defineProperty(o,'p', {writable: false})
// 修改成功

```

至于value，只要writable和configurable有一个为true，就可以改动。

```javascript

var o1 = Object.defineProperty({}, 'p', {
        value: 1,
        writable: true,
        configurable: false
});

Object.defineProperty(o1,'p', {value: 2})
// 修改成功

var o2 = Object.defineProperty({}, 'p', {
        value: 1,
        writable: false,
        configurable: true
});

Object.defineProperty(o2,'p', {value: 2}) 
// 修改成功

```

可配置性决定了一个变量是否可以被删除（delete）。

{% highlight javascript %}

var o = Object.defineProperties({}, {
        p1: { value: 1, configurable: true },
        p2: { value: 2, configurable: false }
});

delete o.p1 // true
delete o.p2 // false

o.p1 // undefined
o.p2 // 2

{% endhighlight %}

上面代码中的对象o有两个属性，p1是可配置的，p2是不可配置的。结果，p2就无法删除。

需要注意的是，当使用var命令声明变量时，变量的configurable为false。

{% highlight javascript %}

var a1 = 1;

Object.getOwnPropertyDescriptor(this,'a1')
// Object {
//	value: 1, 
//	writable: true, 
//	enumerable: true, 
//	configurable: false
// }

{% endhighlight %}

而不使用var命令声明变量时（或者使用属性赋值的方式声明变量），变量的可配置性为true。

{% highlight javascript %}

a2 = 1;

Object.getOwnPropertyDescriptor(this,'a2')
// Object {
//	value: 1, 
//	writable: true, 
//	enumerable: true, 
//	configurable: true
// }

// 或者写成

this.a3 = 1;

Object.getOwnPropertyDescriptor(this,'a3')
// Object {
//	value: 1, 
//	writable: true, 
//	enumerable: true, 
//	configurable: true
// }

{% endhighlight %}

上面代码中的`this.a3 = 1`与`a3 = 1`是等价的写法。this指的是当前的作用域，更多关于this的解释，参见《面向对象编程》一章。

这种差异意味着，如果一个变量是使用var命令生成的，就无法用delete命令删除。也就是说，delete只能删除对象的属性。

{% highlight javascript %}

var a1 = 1;
a2 = 1;

delete a1 // false
delete a2 // true

a1 // 1
a2 // ReferenceError: a2 is not defined

{% endhighlight %}

### 可写性（writable）

可写性（writable）决定了属性的值（value）是否可以被改变。

{% highlight javascript %}

var o = {}; 

Object.defineProperty(o, "a", { value : 37, writable : false });

o.a // 37
o.a = 25;
o.a // 37

{% endhighlight %}

上面代码将o对象的a属性可写性设为false，然后改变这个属性的值，就不会有任何效果。

这实际上将某个属性的值变成了常量。在ES6中，constant命令可以起到这个作用，但在ES5中，只有通过writable达到同样目的。

这里需要注意的是，当对a属性重新赋值的时候，并不会抛出错误，只是静静地失败。但是，如果在严格模式下，这里就会抛出一个错误，即使是对a属性重新赋予一个同样的值。

关于可写性，还有一种特殊情况。就是如果原型对象的某个属性的可写性为false，那么派生对象将无法自定义这个属性。

{% highlight javascript %}

var proto = Object.defineProperty({}, 'foo', {
    value: 'a',
    writable: false
});

var o = Object.create(proto);

o.foo = 'b';
o.foo // 'a'

{% endhighlight %}

上面代码中，对象proto的foo属性不可写，结果proto的派生对象o，也不可以再自定义这个属性了。在严格模式下，这样做还会抛出一个错误。但是，有一个规避方法，就是通过覆盖attributes对象，绕过这个限制，原因是这种情况下，原型链会被完全忽视。

{% highlight javascript %}

Object.defineProperty(o, 'foo', { value: 'b' });

o.foo // 'b'

{% endhighlight %}

## Object.getOwnPropertyNames()

Object.getOwnPropertyNames方法返回直接定义在某个对象上面的全部属性的名称，而不管该属性是否可枚举。

```javascript
var o = Object.defineProperties({}, {
        p1: { value: 1, enumerable: true },
        p2: { value: 2, enumerable: false }
});

Object.getOwnPropertyNames(o)
// ["p1", "p2"]
```

一般来说，系统原生的属性（即非用户自定义的属性）都是不可枚举的。

```javascript
// 比如，数组实例自带length属性是不可枚举的
Object.keys([]) // []
Object.getOwnPropertyNames([]) // [ 'length' ]

// Object.prototype对象的自带属性也都是不可枚举的
Object.keys(Object.prototype) // []
Object.getOwnPropertyNames(Object.prototype)
// ['hasOwnProperty',
//  'valueOf',
//  'constructor',
//  'toLocaleString',
//  'isPrototypeOf',
//  'propertyIsEnumerable',
//  'toString']
```

上面代码可以看到，数组的实例对象（`[]`）没有可枚举属性，不可枚举属性有length；Object.prototype对象也没有可枚举属性，但是有不少不可枚举属性。

## Object.prototype.propertyIsEnumerable()

对象实例的`propertyIsEnumerable`方法用来判断一个属性是否可枚举。

```javascript
var o = {};
o.p = 123;

o.propertyIsEnumerable('p') // true
o.propertyIsEnumerable('toString') // false
```

上面代码中，用户自定义的`p`属性是可枚举的，而继承自原型对象的`toString`属性是不可枚举的。

## 存取器（accessor）

除了直接定义以外，属性还可以用存取器（accessor）定义。其中，存值函数称为setter，使用`set`命令；取值函数称为getter，使用`get`命令。

```javascript
var o = {
  get p() {
    return 'getter';
  },
  set p(value) {
    console.log('setter: ' + value);
  }
};
```

上面代码中，`o`对象内部的`get`和`set`命令，分别定义了`p`属性的取值函数和存值函数。定义了这两个函数之后，对`p`属性取值时，取值函数会自动调用；对`p`属性赋值时，存值函数会自动调用。

```javascript
o.p // "getter"
o.p = 123 // "setter: 123"
```

注意，取值函数Getter不能接受参数，存值函数Setter只能接受一个参数（即属性的值）。另外，对象也不能与取值函数同名的属性。比如，上面的对象`o`设置了取值函数`p`以后，就不能再另外定义一个`p`属性。

存取器往往用于，某个属性的值需要依赖对象内部数据的场合。

```javascript
var o ={
  $n : 5,
  get next() { return this.$n++ },
  set next(n) {
    if (n >= this.$n) this.$n = n;
    else throw '新的值必须大于当前值';
  }
};

o.next // 5

o.next = 10;
o.next // 10
```

上面代码中，`next`属性的存值函数和取值函数，都依赖于对内部属性`$n`的操作。

存取器也可以通过`Object.defineProperty`定义。

```javascript
var d = new Date();

Object.defineProperty(d, 'month', {
  get: function () {
    return d.getMonth();
  },
  set: function (v) {
    d.setMonth(v);
  }
});
```

上面代码为`Date`的实例对象`d`，定义了一个可读写的`month`属性。

存取器也可以使用`Object.create`方法定义。

```javascript
var o = Object.create(Object.prototype, {
  foo: {
    get: function () {
      return 'getter';
    },
    set: function (value) {
      console.log('setter: '+value);
    }
  }
});
```

如果使用上面这种写法，属性`foo`必须定义一个属性描述对象。该对象的`get`和`set`属性，分别是`foo`的取值函数和存值函数。

利用存取器，可以实现数据对象与DOM对象的双向绑定。

```javascript
Object.defineProperty(user, 'name', {
  get: function () {
    return document.getElementById('foo').value;
  },
  set: function (newValue) {
    document.getElementById('foo').value = newValue;
  },
  configurable: true
});
```

上面代码使用存取函数，将DOM对象`foo`与数据对象`user`的`name`属性，实现了绑定。两者之中只要有一个对象发生变化，就能在另一个对象上实时反映出来。

## 对象的拷贝

有时，我们需要将一个对象的所有属性，拷贝到另一个对象。ES5没有提供这个方法，必须自己实现。

```javascript
var extend = function (to, from) {
  for (var property in from) {
    to[property] = from[property];
  }

  return to;
}

extend({}, {a: 1})
// {a: 1}
```

上面这个方法的问题在于，如果遇到存取器定义的属性，会只拷贝值。

```javascript
extend({}, { get a(){ return 1 } })
// {a: 1}
```

为了解决这个问题，我们可以通过`Object.defineProperty`方法来拷贝属性。

```javascript
var extend = function (to, from) {
  for (var property in from) {
    Object.defineProperty(to, property, Object.getOwnPropertyDescriptor(from, property));
  }

  return to;
}

extend({}, { get a(){ return 1 } })
// { get a(){ return 1 } })
```

这段代码还是有问题，拷贝某些属性时会失效。

```javascript
extend(document.body.style, {
  backgroundColor: "red"
});
```

上面代码的目的是，设置`document.body.style.backgroundColor`属性为`red`，但是实际上网页的背景色并不会变红。但是，如果用第一种简单拷贝的方法，反而能够达到目的。这提示我们，可以把两种方法结合起来，对于简单属性，就直接拷贝，对于那些通过描述对象设置的属性，则使用`Object.defineProperty`方法拷贝。

```javascript
var extend = function (to, from) {
  for (var property in from) {
    var descriptor = Object.getOwnPropertyDescriptor(from, property);

    if (descriptor && ( !descriptor.writable
      || !descriptor.configurable
      || !descriptor.enumerable
      || descriptor.get
      || descriptor.set)) {
      Object.defineProperty(to, property, descriptor);
    } else {
      to[property] = from[property];
    }
  }
}
```

上面的这段代码，可以很好地拷贝任意属性。

## 控制对象状态

JavaScript提供了三种方法，精确控制一个对象的读写状态，防止对象被改变。最弱一层的保护是preventExtensions，其次是seal，最强的freeze。

###  Object.preventExtensions方法

Object.preventExtensions方法可以使得一个对象无法再添加新的属性。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

Object.defineProperty(o, "p", { value: "hello" });
// TypeError: Cannot define property:p, object is not extensible.

o.p = 1;
o.p // undefined

{% endhighlight %}

如果是在严格模式下，则会抛出一个错误。

{% highlight javascript %}

(function () {
  'use strict';
  o.p = '1'
}());
// TypeError: Can't add property bar, object is not extensible

{% endhighlight %}

不过，对于使用了preventExtensions方法的对象，可以用delete命令删除它的现有属性。

{% highlight javascript %}

var o = new Object();
o.p = 1;

Object.preventExtensions(o);

delete o.p;
o.p // undefined

{% endhighlight %}

### Object.isExtensible方法

Object.isExtensible方法用于检查一个对象是否使用了preventExtensions方法。也就是说，该方法可以用来检查是否可以为一个对象添加属性。

{% highlight javascript %}

var o = new Object();

Object.isExtensible(o)
// true

Object.preventExtensions(o);
Object.isExtensible(o)
// false

{% endhighlight %}

上面代码新生成了一个o对象，对该对象使用Object.isExtensible方法，返回true，表示可以添加新属性。对该对象使用Object.preventExtensions方法以后，再使用Object.isExtensible方法，返回false，表示已经不能添加新属性了。

###  Object.seal方法

Object.seal方法使得一个对象既无法添加新属性，也无法删除旧属性。

{% highlight javascript %}

var o = { p:"hello" };

Object.seal(o);

delete o.p;
o.p // "hello"

o.x = 'world';
o.x // undefined

{% endhighlight %}

Object.seal还把现有属性的attributes对象的configurable属性设为false，使得attributes对象不再能改变。

{% highlight javascript %}

var o = { p: 'a' };

// seal方法之前
Object.getOwnPropertyDescriptor(o, 'p')
// Object {value: "a", writable: true, enumerable: true, configurable: true}

Object.seal(o);

// seal方法之后
Object.getOwnPropertyDescriptor(o, 'p') 
// Object {value: "a", writable: true, enumerable: true, configurable: false}

Object.defineProperty(o, 'p', { enumerable: false })
// TypeError: Cannot redefine property: p

{% endhighlight %}

从上面代码可以看到，使用seal方法之后，attributes对象的configurable就变成了false，然后如果想改变enumerable就会报错。

可写性（writable）有点特别。如果writable为false，使用Object.seal方法以后，将无法将其变成true；但是，如果writable为true，依然可以将其变成false。

{% highlight javascript %}

var o1 = Object.defineProperty({}, 'p', {writable: false});
Object.seal(o1);
Object.defineProperty(o1,'p',{writable:true}) 
// Uncaught TypeError: Cannot redefine property: p 

var o2 = Object.defineProperty({}, 'p', {writable: true});
Object.seal(o2);
Object.defineProperty(o2,'p',{writable:false}) 

Object.getOwnPropertyDescriptor(o2, 'p')
/* { value: '',
  writable: false,
  enumerable: true,
  configurable: false } */

{% endhighlight %}

上面代码中，同样是使用了Object.seal方法，如果writable原为false，改变这个设置将报错；如果原为true，则不会有问题。

至于属性对象的value是否可改变，是由writable决定的。

```javascript

var o = { p: 'a' };
Object.seal(o);
o.p = 'b';
o.p // 'b'

```

上面代码中，Object.seal方法对p属性的value无效，是因为此时p属性的writable为true。

### Object.isSealed方法

Object.isSealed方法用于检查一个对象是否使用了Object.seal方法。

{% highlight javascript %}

var o = { p: 'a' };

Object.seal(o);
Object.isSealed(o) // true

{% endhighlight %}

另外，这时isExtensible方法也返回false。

{% highlight javascript %}

var o = { p: 'a' };

Object.seal(o);
Object.isExtensible(o) // false

{% endhighlight %}		

### Object.freeze方法

Object.freeze方法可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。

{% highlight javascript %}

var o = {p:"hello"};

Object.freeze(o);

o.p = "world";
o.p // hello

o.t = "hello";
o.t // undefined

{% endhighlight %}

上面代码中，对现有属性重新赋值（o.p = "world"）或者添加一个新属性，并不会报错，只是默默地失败。但是，如果是在严格模式下，就会报错。

{% highlight javascript %}

var o = {p:"hello"};

Object.freeze(o);

// 对现有属性重新赋值
(function () { 'use strict'; o.p = "world";}())
// TypeError: Cannot assign to read only property 'p' of #<Object>

// 添加不存在的属性
(function () { 'use strict'; o.t = 123;}())
// TypeError: Can't add property t, object is not extensible

{% endhighlight %}

### Object.isFrozen方法

Object.isFrozen方法用于检查一个对象是否使用了Object.freeze()方法。

{% highlight javascript %}

var o = {p:"hello"};

Object.freeze(o);
Object.isFrozen(o) // true

{% endhighlight %}

### 局限性

需要注意的是，使用上面这些方法锁定对象的可写性，但是依然可以通过改变该对象的原型对象，来为它增加属性。

{% highlight javascript %}

var o = new Object();

Object.preventExtensions(o);

var proto = Object.getPrototypeOf(o);

proto.t = "hello";

o.t
// hello

{% endhighlight %}

一种解决方案是，把原型也冻结住。

{% highlight javascript %}

var o = Object.seal(
  Object.create(Object.freeze({x:1}),
    {y: {value: 2, writable: true}})
);

Object.getPrototypeOf(o).t = "hello";
o.hello // undefined

{% endhighlight %}
