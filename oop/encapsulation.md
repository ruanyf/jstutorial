---
title: 封装
layout: page
category: oop
date: 2012-12-14
modifiedOn: 2013-01-04
---

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
