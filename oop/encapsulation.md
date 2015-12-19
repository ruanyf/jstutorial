---
title: 封装
layout: page
category: oop
date: 2012-12-14
modifiedOn: 2013-11-23
---

## prototype对象

### 构造函数的缺点

JavaScript通过构造函数生成新对象，因此构造函数可以视为对象的模板。实例对象的属性和方法，可以定义在构造函数内部。

```javascript
function Cat (name, color) {
  this.name = name;
  this.color = color;
}

var cat1 = new Cat('大毛', '白色');

cat1.name // '大毛'
cat1.color // '白色'
```

上面代码的`Cat`函数是一个构造函数，函数内部定义了`name`属性和`color`属性，所有实例对象都会生成这两个属性。但是，这样做是对系统资源的浪费，因为同一个构造函数的对象实例之间，无法共享属性。

```javascript
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.meow = function () {
    console.log('mew, mew, mew...');
  };
}

var cat1 = new Cat('大毛', '白色');
var cat2 = new Cat('二毛', '黑色');

cat1.meow === cat2.meow
// false
```

上面代码中，`cat1`和`cat2`是同一个构造函数的实例。但是，它们的`meow`方法是不一样的，就是说每新建一个实例，就会新建一个`meow`方法。这既没有必要，又浪费系统资源，因为所有`meow`方法都是同样的行为，完全应该共享。

### prototype属性的作用

在JavaScript语言中，每一个对象都有一个对应的原型对象，被称为prototype对象。定义在原型对象上的所有属性和方法，都能被派生对象继承。这就是JavaScript继承机制的基本设计。

除了这种方法，JavaScript还提供了另一种定义实例对象的方法。我们知道，构造函数是一个函数，同时也是一个对象，也有自己的属性和方法，其中有一个prototype属性指向另一个对象，一般称为prototype对象。该对象非常特别，只要定义在它上面的属性和方法，能被所有实例对象共享。也就是说，构造函数生成实例对象时，自动为实例对象分配了一个prototype属性。

{% highlight javascript %}

function Animal (name) {
  this.name = name;
}

Animal.prototype.color = "white";

var cat1 = new Animal('大毛');
var cat2 = new Animal('二毛');

cat1.color // 'white'
cat2.color // 'white'

{% endhighlight %}

上面代码对构造函数Animal的prototype对象，添加了一个color属性。结果，实例对象cat1和cat2都带有该属性。

更特别的是，只要修改prototype对象，变动就立刻会体现在实例对象。

{% highlight javascript %}

Animal.prototype.color = "yellow";

cat1.color // 'yellow'
cat2.color // 'yellow'

{% endhighlight %}

上面代码将prototype对象的color属性的值改为yellow，两个实例对象的color属性的值立刻就跟着变了。这是因为实例对象其实没有color属性，都是读取prototype对象的color属性。也就是说，当实例对象本身没有某个属性或方法的时候，它会到构造函数的prototype对象去寻找该属性或方法。这就是prototype对象的特殊之处。

如果实例对象自身就有某个属性或方法，它就不会再去prototype对象寻找这个属性或方法。

{% highlight javascript %}

cat1.color = 'black';

cat2.color // 'yellow'
Animal.prototype.color // "yellow";

{% endhighlight %}

上面代码将实例对象cat1的color属性改为black，就使得它不用再去prototype对象读取color属性，后者的值依然为yellow。

总而言之，prototype对象的作用，就是定义所有实例对象共享的属性和方法，所以它也被称为实例对象的原型，而实例对象可以视作从prototype对象衍生出来的。

{% highlight javascript %}

Animal.prototype.walk = function () {
  console.log(this.name + ' is walking.');
};

{% endhighlight %}

上面代码在Animal.protype对象上面定义了一个walk方法，这个方法将可以在所有Animal实例对象上面调用。

### 原型链

由于JavaScript的所有对象都有构造函数，而所有构造函数都有prototype属性（其实是所有函数都有prototype属性），所以所有对象都有自己的prototype原型对象。

因此，一个对象的属性和方法，有可能是定义它自身上面，也有可能定义在它的原型对象上面（就像上面代码中的walk方法）。由于原型本身也是对象，又有自己的原型，所以形成了一条原型链（prototype chain）。比如，a对象是b对象的原型，b对象是c对象的原型，以此类推。因为追根溯源，最源头的对象都是从Object构造函数生成（使用new Object()命令），所以如果一层层地上溯，所有对象的原型最终都可以上溯到Object.prototype。那么，Object.prototype有没有原型呢？回答可以是有，也可以是没有，因为Object.prototype的原型是没有任何属性和方法的null。

{% highlight javascript %}

Object.getPrototypeOf(Object.prototype)
// null

{% endhighlight %}

上面代码表示Object.prototype对象的原型是null，由于null没有任何属性，所以原型链到此为止。

“原型链”的作用在于，当读取对象的某个属性时，JavaScript引擎先寻找对象本身的属性，如果找不到，就到它的原型去找，如果还是找不到，就到原型的原型去找。以此类推，如果直到最顶层的Object.prototype还是找不到，则返回undefined。

举例来说，如果让某个函数的prototype属性指向一个数组，就意味着该函数可以用作数组的构造函数，因为它生成的实例对象都可以通过prototype属性调用数组方法。

{% highlight javascript %}

function MyArray (){}

MyArray.prototype = new Array();
MyArray.prototype.constructor = MyArray;

var mine = new MyArray();
mine.push(1, 2, 3);

mine.length // 3
mine instanceof Array // true

{% endhighlight %}

上面代码的mine是MyArray的实例对象，由于MyArray的prototype属性指向一个数组，使得mine可以调用数组方法（这些方法其实定义在数组的prototype对象上面）。至于最后那行instanceof表达式，我们知道instanceof运算符用来比较一个对象是否为某个构造函数的实例，最后一行表示mine为Array的实例。

{% highlight javascript %}

mine instanceof Array

// 等同于

(Array === MyArray.prototype.constructor) ||
(Array === Array.prototype.constructor) ||
(Array === Object.prototype.constructor )

{% endhighlight %}

上面代码说明了instanceof运算符的实质，它依次与实例对象的所有原型对象的constructor属性（关于该属性的介绍，请看下一节）进行比较，只要有一个符合就返回true，否则返回false。

### constructor属性

prototype对象有一个constructor属性，默认指向prototype对象所在的构造函数。

```javascript
function P() {}

P.prototype.constructor === P
// true
```

由于constructor属性定义在prototype对象上面，意味着可以被所有实例对象继承。

```javascript
function P() {}

var p = new P();

p.constructor
// function P() {}

p.constructor === P.prototype.constructor
// true

p.hasOwnProperty('constructor')
// false
```

上面代码表示p是构造函数P的实例对象，但是p自身没有contructor属性，该属性其实是读取原型链上面的`P.prototype.constructor`属性。

constructor属性的作用是分辨prototype对象到底定义在哪个构造函数上面。

```javascript
function F(){};

var f = new F();

f.constructor === F // true
f.constructor === RegExp // false
```

上面代码表示，使用constructor属性，确定变量f的构造函数是F，而不是RegExp。

## Object.getPrototypeOf方法

Object.getPrototypeOf方法返回一个对象的原型。

{% highlight javascript %}

// 空对象的原型是Object.prototype
Object.getPrototypeOf({}) === Object.prototype
// true

// 函数的原型是Function.prototype
function f() {}
Object.getPrototypeOf(f) === Function.prototype
// true

// 假定F为构造函数，f为F的实例对象
// 那么，f的原型是F.prototype
var f = new F();
Object.getPrototypeOf(f) === F.prototype
// true

{% endhighlight %}

## Object.create方法

`Object.create`方法用于生成新的对象，可以替代`new`命令。它接受一个对象作为参数，返回一个新对象，后者完全继承前者的属性，即前者成为后者的原型。

```javascript
var o1 = { p: 1 };
var o2 = Object.create(o1);

o2.p // 1
```

上面代码中，`Object.create`方法在`o1`的基础上生成了`o2`。此时，`o1`成了`o2`的原型，也就是说，`o2`继承了`o1`所有的属性的方法。

`Object.create`方法基本等同于下面的代码，如果老式浏览器不支持`Object.create`方法，可以用下面代码自己部署。

```javascript
if (typeof Object.create !== "function") {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}
```

上面代码表示，`Object.create`方法实质是新建一个构造函数`F`，然后让`F`的`prototype`属性指向作为原型的对象`o`，最后返回一个`F`的实例，从而实现让实例继承`o`的属性。

下面三种方式生成的新对象是等价的。

```javascript
var o1 = Object.create({});
var o2 = Object.create(Object.prototype);
var o3 = new Object();
```

如果想要生成一个不继承任何属性（比如toString和valueOf方法）的对象，可以将Object.create的参数设为null。

{% highlight javascript %}

var o = Object.create(null);

o.valueOf()
// TypeError: Object [object Object] has no method 'valueOf'

{% endhighlight %}

上面代码表示，如果对象o的原型是null，它就不具备一些定义在Object.prototype对象上面的属性，比如valueOf方法。

使用Object.create方法的时候，必须提供对象原型，否则会报错。

{% highlight javascript %}

Object.create()
// TypeError: Object prototype may only be an Object or null

{% endhighlight %}

Object.create方法生成的新对象，动态继承了原型。在原型上添加或修改任何方法，会立刻反映在新对象之上。

{% highlight javascript %}

var o1 = { p: 1 };
var o2 = Object.create(o1);

o1.p = 2;
o2.p
// 2

{% endhighlight %}

上面代码表示，修改对象原型会影响到新生成的对象。

除了对象的原型，Object.create方法还可以接受第二个参数，表示描述属性的attributes对象，跟用在Object.defineProperties方法的格式是一样的。它所描述的对象属性，会添加到新对象。

{% highlight javascript %}

var o = Object.create(Object.prototype, {
  p1: { value: 123, enumerable: true },
  p2: { value: "abc", enumerable: true }
});

o.p1 // 123
o.p2 // "abc"

{% endhighlight %}

由于Object.create方法不使用构造函数，所以不能用instanceof运算符判断，对象是哪一个构造函数的实例。这时，可以使用下面的isPrototypeOf方法，判读原型是哪一个对象。

## isPrototypeOf方法

isPrototypeOf方法用来判断一个对象是否是另一个对象的原型。

{% highlight javascript %}

var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);

o2.isPrototypeOf(o3) // true
o1.isPrototypeOf(o3) // true

{% endhighlight %}

上面代码表明，只要某个对象处在原型链上，isProtypeOf都返回true。
