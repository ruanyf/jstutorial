---
title: JavaScript模块化编程
layout: page
category: oop
date: 2014-04-06
modifiedOn: 2014-04-06
---

## 使用构造函数封装私有变量

可以利用构造函数，封装私有变量。

{% highlight javascript %}

function StringBuilder() {
    var buffer = [];

    this.add = function (str) {
        buffer.push(str);
    };

    this.toString = function () {
        return buffer.join('');
    };

}

{% endhighlight %}

这种方法将私有变量封装在构造函数中，违反了构造函数与实例对象相分离的原则。并且，非常耗费内存。

{% highlight javascript %}

function StringBuilder() {
    this._buffer = [];
}

StringBuilder.prototype = {
    constructor: StringBuilder,
    add: function (str) {
        this._buffer.push(str);
    },
    toString: function () {
        return this._buffer.join('');
    }
};

{% endhighlight %}

这种方法将私有变量放入实例对象中，好处是看上去更自然，但是它的私有变量可以从外部读写，不是很安全。

## IIFE封装私有变量

{% highlight javascript %}

var obj = function () {  // open IIFE

    // public
    var self = {
        publicMethod: function (...) {
            privateData = ...;
            privateFunction(...);
        },
        publicData: ...
    };

    // private
    var privateData = ...;
    function privateFunction(...) {
        privateData = ...;
        self.publicData = ...;
        self.publicMethod(...);
    }

    return self;
}(); // close IIFE

{% endhighlight %}

