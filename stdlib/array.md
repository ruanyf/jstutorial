---
title: Array 对象
layout: page
category: stdlib
date: 2013-05-04
modifiedOn: 2013-05-04
---

## 概述

Array 本身既是一个对象，也是一个构造函数。可以用它生成新的数组。

{% highlight javascript %}

var a1 = new Array();
a1
// 没有任何显示

var a2 = new Array(1);
a2
// [undefined × 1]

var a3 = new Array(1,2);
a3
// [1, 2]

{% endhighlight %}

## Array对象实例的方法

- pop 删除并返回数组的最后一个元素
- reverse 颠倒数组中元素的顺序
- unshift 向数组的开头添加一个或多个元素，并返回添加后的数组长度

### valueOf 方法和 toString 方法

valueOf 方法返回数组本身。

{% highlight javascript %}

var a = [1,2,3];

a.valueOf()
// [1,2,3]

{% endhighlight %}

toString 方法返回数组的字符串形式。

{% highlight javascript %}

var a = [1,2,3];

a.toString()
// "1,2,3"

var a = [1,2,3,[4,5,6]];

a.toString()
// "1,2,3,4,5,6"

{% endhighlight %}

### concat方法

该方法用于连接多个数组，返回连接后的数组。

{% highlight javascript %}

["hello"].concat(["world"])
// ["hello", "world"]

{% endhighlight %}

对于对象，也可以使用这个方法。

{% highlight javascript %}

[].concat.call({ a: 1 }, [2])
// [{a:1}, 2]

{% endhighlight %}

### push方法

该方法用于在数组的末端添加一个或多个元素，并返回添加后的数组的长度。

{% highlight javascript %}

var a = new Array();

a.push(1);
// 1

a.push("a");
// 2

a
// [1,"a"]

{% endhighlight %}

它还可以向对象添加元素，添加后的对象变成“类似数组的”对象，即新加入元素的键对应数组的索引，并且对象有一个length属性。

{% highlight javascript %}

var a = { a: 1 };

[].push.call(a, 2);
a
// {a:1, 0:2, length: 1}

[].push.call(a, [3]);
a
// {a:1, 0:2, 1:[3], length: 2}

{% endhighlight %}

### join方法

该方法将所有数组元素组成一个字符串返回，默认用逗号分隔。

{% highlight javascript %}

var a = [1,2,3,4];

a.join()
// "1,2,3,4"

a.join("|")
// "1|2|3|4"

{% endhighlight %}

### slice方法

该方法用于从数组中返回指定位置的元素，原数组不变。它的第一个参数为起始位置，第二个参数为终止位置。

{% highlight javascript %}

var a = ["a","b","c","d","e","f","g","h","i"];

a.slice(5,9)
// ["f", "g", "h", "i"]

a
// ["a","b","c","d","e","f","g","h","i"];

{% endhighlight %}

### splice方法

该方法用于删除元素，并可以在被删除的位置添加入新的数组元素。它的返回值是被删除的元素。

{% highlight javascript %}

var a = ["a","b","c","d","e","f","g","h","i"];

a.splice(5,2)
// ["f", "g"]

a
["a", "b", "c", "d", "e", "h", "i"]

{% endhighlight %}

它的第一个参数是删除的起始位置，第二个参数是被删除的元素个数。如果后面还有更多的参数，则表示这些就是要被插入数组的新元素。

{% highlight javascript %}

var a = ["a","b","c","d","e","f","g","h","i"];

a.splice(5,2,1,2)
// ["f", "g"]

a
// ["a", "b", "c", "d", "e", 1, 2, "h", "i"]

{% endhighlight %}

如果是单纯地插入元素，splice方法的第二个参数可以设为0。

{% highlight javascript %}

var a = [1,1,1];

a.splice(1,0,2)
// []

a
// [1, 2, 1, 1]

{% endhighlight %}

### sort方法

该方法对数组元素进行排序，默认是按照字典顺序排序。排序后，原数组将被改变。

{% highlight javascript %}

var a = ["d","c","b","a"];
a.sort()
// ["a", "b", "c", "d"]

var a = [4,3,2,1];
a.sort()
// [1, 2, 3, 4]

var a = [11,101];
a.sort()
// [101, 11]

{% endhighlight %}

sort方法可以接受一个参数，表示按照自定义方法进行排序。该参数是一个函数，本身又接受两个参数，表示进行比较的两个元素。如果返回值大于0，表示第一个元素排在第二个元素后面；其他情况下，都是第一个元素排在第二个元素前面。

{% highlight javascript %}

var a = [10111,1101,111];
a.sort()
// [10111, 1101, 111]

function f(a,b){
	return a-b;
}

a.sort(f)
// [111, 1101, 10111]

{% endhighlight %}
