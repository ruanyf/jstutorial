---
title: 封装
layout: page
category: oop
date: 2012-12-14
modifiedOn: 2013-04-22
---

## 原型

上一节提到，构造函数可以用作对象的模板。

{% highlight javascript %}

function Animal (name) {
  this.name = name;
}

var myAnimal = new Animal('大毛');

{% endhighlight %}

构造函数有一个prototype属性，用来指向实例对象的“原型”对象。可以在原型对象上定义，所有实例对象共同拥有的属性或方法。

{% highlight javascript %}

Animal.prototype.walk = function () {
  console.log(this.name + ' is walking.');
};

{% endhighlight %}

JavaScript的每个对象都有一个原型（prototype），原型的方法可以被这个对象继承。也就是说，每个对象都可以视作从它的原型衍生出来的。

由于原型本身也是对象，所以形成了一条原型链（prototype chain）。比如，a对象是b对象的原型，b对象是c对象的原型，以此类推。因为追根溯源，最底层的对象都是从Object构造函数生成（使用new Object()命令），所以如果一层层地上溯，所有对象的原型最终都可以上溯到Object.prototype。

“原型链”的作用在于，当读取对象的某个属性时，JavaScript引擎先寻找对象本身的属性，如果找不到，就到它的原型去找，以此类推，如果直到Object.prototype还是找不到，则返回null。

## Object.getPrototypeOf方法

该方法返回一个对象的原型。

{% highlight javascript %}

Object.getPrototypeOf({}) === Object.prototype
// true

function F() {}
Object.getPrototypeOf(F) === Function.prototype
// true

var f = new F();
Object.getPrototypeOf(f) === F.prototype
// true
	
{% endhighlight %}

## Object.create方法

Object.create的作用是，以一个对象为原型，新建另一个对象。后者完全继承前者的属性。

{% highlight javascript %}

var o = { k: 1 };

var o1 = Object.create(o);

o1.p
// 1 

{% endhighlight %}

该方法的基本等同于下面的代码：

{% highlight javascript %}

if(typeof Object.create !== "function") {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

{% endhighlight %}

我们可以看到，这个方法实际上就是新建一个对象，让它的原型指向另一个对象，从而让前者继承后者的属性。

这个方法可以接受两个参数，第一个是对象的原型，第二个是描述属性的attributes对象。

{% highlight javascript %}

Object.create(proto, propDescObj）

{% endhighlight %}

用法如下：

{% highlight javascript %}

var o = Object.create(Object.prototype, {
        p1: { value: 123, enumerable: true },
        p2: { value: "abc", enumerable: true }
});

{% endhighlight %}

## isPrototypeOf方法

该方法用来判断一个对象是否是另一个对象的原型。

{% highlight javascript %}

var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);
console.log(o2.isPrototypeOf(o3)); // true
console.log(o1.isPrototypeOf(o3)); // true

{% endhighlight %}
