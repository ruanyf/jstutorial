---
title: 封装
layout: page
category: oop
date: 2012-12-14
modifiedOn: 2012-12-14
---

## Object.create方法

EMCAScript 5引入了一个创造对象的新方法：Object.create。

该方法可以从原型创造出一个新的对象。它的主要功能，等同于下面的代码：

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
