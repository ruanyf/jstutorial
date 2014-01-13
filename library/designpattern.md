---
title: 设计模式
category: library
layout: page
date: 2013-02-04
modifiedOn: 2013-02-04
---

"设计模式"（Design Pattern）是针对编程中经常出现的、具有共性的问题，所提出的解决方法。著名的《设计模式》一书一共提出了23种模式。

## Singleton

Singleton模式指的是一个“类”只能创造一个实例。由于JavaScript语言没有类，单个对象可以直接生成，所以实际上，没有必要部署Singleton模式。但是，还是可以做到的。

{% highlight javascript %}

var someClass = {

	_singleton: null,
				
    getSingleton: function() {

		if (!this._singleton) {
                this._singleton = {
                    // some code here
                }
            }
				
            return this._singleton;
		}
};

var instance = someClass.getSingleton();

{% endhighlight %}

生成实例的时候，调用getSingleton方法。该方法首先检查_singleton属性是否有值，如果有值就返回这个属性，如果为空则生成新的实例，并赋值给_singleton属性，然后返回这个实例。这样就保证了生成的实例都是同一个对象。

为了保证实例不被改写，可以关闭它的写入开关。

{% highlight javascript %}

Object.defineProperty(namespace, "singleton",
        { writable: false, configurable: false, value: { ... } });

{% endhighlight %}

也可以考虑使用Object.preventExtensions()、Object.seal()、Object.freeze()等方法，限制对实例进行写操作。

## 参考链接

- Dr. Axel Rauschmayer，[The Singleton pattern in JavaScript: not needed](http://www.2ality.com/2011/04/singleton-pattern-in-javascript-not.html)
