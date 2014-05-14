---
title: Array 对象
layout: page
category: stdlib
date: 2013-05-04
modifiedOn: 2013-11-29
---

## 概述

Array是JavaScript的内置对象，同时也是一个构造函数，可以用它生成新的数组。

作为构造函数时，Array可以接受参数，但是不同的参数，会使得Array产生不同的行为。

- 无参数时，返回一个空数组；

- 如果使用一个正整数作为参数，则这个正整数表示新数组的长度；

- 如果使用非数值（字符串、布尔值、对象等）作为参数，则该值是新数组的成员；

- 如果参数在一个以上，则这些参数都是新数组的成员。

{% highlight javascript %}

var a1 = new Array();
var a2 = new Array(1);
var a3 = new Array('abc');
var a4 = new Array([1]);
var a5 = new Array(1,2);

a1 // []
a2 // [undefined × 1]
a3 // ['abc']
a4 // [Array[1]]
a5 // [1, 2]

{% endhighlight %}

从上面代码可以看到，Array的构造函数行为很不一致。因此，不建议使用它生成新数组，直接使用数组的字面量是更好的方法。

## Array对象的静态方法

### isArray方法

Array.isArray方法用来判断一个值是否为数组。它可以弥补typeof运算符的不足。

{% highlight javascript %}

var a = [1,2,3];

typeof a // "object"

Array.isArray(a) // true

{% endhighlight %}

上面代码表示，typeof运算符只能显示数组的类型是Object，而Array.isArray方法可以对数组返回true。

## Array对象实例的方法

以下这些Array对象实例的方法，都是数组实例才能使用。如果不想创建实例，只是想单纯调用这些方法，可以写成 [].method.call(调用对象，参数) 的形式，或者 Array.prototype.method.call(调用对象，参数)的形式。

### valueOf方法，toString方法

valueOf方法返回数组本身。

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

### push方法，pop方法

push方法用于在数组的末端添加一个或多个元素，并返回添加后的数组的长度。

{% highlight javascript %}

var a = new Array();

a.push(1) // 1
a.push("a") // 2
a // [1,"a"]

{% endhighlight %}

上面代码使用push方法，先后往数组中添加了两个成员。

如果需要合并两个数组，可以这些写。

{% highlight javascript %}

var a = [1,2,3];
var b = [4,5,6];

Array.prototype.push.apply(a, b);

// 等同于
a.push(4,5,6)

a
// [1, 2, 3, 4, 5, 6]

{% endhighlight %}

push方法还可以用于向对象添加元素，添加后的对象变成“类似数组的”对象，即新加入元素的键对应数组的索引，并且对象有一个length属性。

{% highlight javascript %}

var a = { a: 1 };

[].push.call(a, 2);
a
// {a:1, 0:2, length: 1}

[].push.call(a, [3]);
a
// {a:1, 0:2, 1:[3], length: 2}

{% endhighlight %}

pop方法用于删除数组的最后一个元素，并返回该元素。

{% highlight javascript %}

var a = ['a', 'b', 'c'];

a.pop() // 'c'
a // ['a', 'b']

{% endhighlight %}

对空数组使用pop方法，不会报错，而是返回undefined。

{% highlight javascript %}

[].pop() // undefined

{% endhighlight %}

### join方法，concat方法

join方法以参数作为分隔符，将所有数组成员组成一个字符串返回。如果不提供参数，默认用逗号分隔。

{% highlight javascript %}

var a = [1,2,3,4];

a.join() // "1,2,3,4"
a.join('') // '1234'
a.join("|") // "1|2|3|4"

{% endhighlight %}

通过函数的call方法，join方法（即Array.prototype.join）也可以用于字符串。

{% highlight javascript %}

Array.prototype.join.call('hello', '-')
// "h-e-l-l-o"

{% endhighlight %}

concat方法将新数组的成员，添加到原数组的尾部，然后返回一个新数组，常用于连接多个数组。

{% highlight javascript %}

["hello"].concat(["world"])
// ["hello", "world"]

[1,2,3].concat(4,5,6)
// [1, 2, 3, 4, 5, 6]

{% endhighlight %}

上面代码表明，concat方法的参数可以是一个或多个数组，以及原始类型的值。

如果不提供参数，concat方法返回当前数组的一个浅拷贝。所谓“浅拷贝”，指的是如果数组成员包括复合类型的值（比如对象），则新数组拷贝的是该值的引用。

{% highlight javascript %}

var o = {a:1};
var oldArray = [o];

var newArray = oldArray.concat();

o.a = 2;
newArray[0].a // 2

{% endhighlight %}

上面代码中，原数组包含一个对象，concat方法生成的新数组包含这个对象的引用。所以，改变原对象以后，新数组跟着改变。事实上，只要原数组的成员中包含对象，concat方法不管有没有参数，总是返回该对象的引用。

concat方法也可以用于将对象合并为数组，但是必须借助call方法。

{% highlight javascript %}

[].concat.call({ a: 1 }, [2])
// [{a:1}, 2]

// 等同于

[2].concat({a:1})

{% endhighlight %}

### shift方法，unshift方法

shift方法用于删除数组的第一个元素，并返回该元素。

{% highlight javascript %}

var a = ['a', 'b', 'c'];

a.shift() // 'a'
a // ['b', 'c']

{% endhighlight %}

shift方法可以遍历并清空一个数组。

{% highlight javascript %}

var list = [1,2,3,4,5,6,7,8,9,10];

var item;

while (item = list.shift()) {
    console.log(item);
}

list // []

{% endhighlight %}

unshift方法用于在数组的第一个位置添加元素，并返回添加新元素后的数组长度。

{% highlight javascript %}

var a = ['a', 'b', 'c'];

a.unshift('x'); // 4
a // ['x', 'a', 'b', 'c']

{% endhighlight %}

### reverse方法

reverse方法用于颠倒数组中元素的顺序，使用这个方法以后，返回改变后的原数组。

{% highlight javascript %}

var a = ['a', 'b', 'c'];

a.reverse() // ["c", "b", "a"] 
a // ["c", "b", "a"] 

{% endhighlight %}

### slice方法

slice方法返回指定位置的数组成员组成的新数组，原数组不变。它的第一个参数为起始位置（从0开始），第二个参数为终止位置（但该位置的元素本身不包括在内）。如果省略第二个参数，则一直返回到原数组的最后一个成员。

{% highlight javascript %}

var a = ["a","b","c"];

a.slice(1,2) // ["b"]
a.slice(1) // ["b", "c"]
a.slice(0) // ["a","b","c"]
a.slice(-2) // ["b", "c"]
a.slice(4) // []
a.slice(2, 6) // ["c"]
a.slice(2, 1) // []

{% endhighlight %}

上面代码表示，如果slice方法的参数是负数，则从尾部开始选择的成员个数；如果参数值大于数组成员的个数，或者第二个参数小于第一个参数，则返回空数组。

slice方法的一个重要应用，是将类似数组的对象转为真正的数组。

{% highlight javascript %}

Array.prototype.slice.call({ 0: 'a', 1: 'b', length: 2 })
// ['a', 'b']

Array.prototype.slice.call(document.querySelectorAll("div"));

Array.prototype.slice.call(arguments);

{% endhighlight %}

上面代码的参数都不是数组，但是通过call方法，在它们上面调用slice方法，就可以把它们转为真正的数组。

### splice方法

splice方法用于删除元素，并可以在被删除的位置添加入新的数组元素。它的返回值是被删除的元素。需要特别注意的是，该方法会改变原数组。

splice的第一个参数是删除的起始位置，第二个参数是被删除的元素个数。如果后面还有更多的参数，则表示这些就是要被插入数组的新元素。

{% highlight javascript %}

var a = ["a","b","c","d","e","f"];

a.splice(4,2)
// ["e", "f"]

a
// ["a", "b", "c", "d"]

{% endhighlight %}

上面代码从原数组位置4开始，删除了两个数组成员。

{% highlight javascript %}

var a = ["a","b","c","d","e","f"];

a.splice(4,2,1,2)
// ["e", "f"]

a
// ["a", "b", "c", "d", 1, 2]

{% endhighlight %}

上面代码除了删除成员，还插入了两个新成员。

如果只是单纯地插入元素，splice方法的第二个参数可以设为0。

{% highlight javascript %}

var a = [1,1,1];

a.splice(1,0,2)
// []

a
// [1, 2, 1, 1]

{% endhighlight %}

如果只提供第一个参数，则实际上等同于将原数组在指定位置拆分成两个数组。

{% highlight javascript %}

var a = [1,2,3,4];

a.splice(2)
// [3, 4]

a
// [1, 2]

{% endhighlight %}

### sort方法

sort方法对数组元素进行排序，默认是按照字典顺序排序。排序后，原数组将被改变。

{% highlight javascript %}

["d","c","b","a"].sort()
// ["a", "b", "c", "d"]

[4,3,2,1].sort()
// [1, 2, 3, 4]

[11,101].sort()
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

[
    { name: "张三", age: 30 },
    { name: "李四", age: 24 },
    { name: "王五", age: 28  }
].sort(function(o1, o2) {
    return o1.age - o2.age;
})
// [
//    { name: "李四", age: 24 },
//    { name: "王五", age: 28  },
//    { name: "张三", age: 30 }
// ]

{% endhighlight %}

## ECMAScript 5 新加入的数组方法

ECMAScript 5新增了9个数组实例的方法，分别是map、forEach、filter、every、some、reduce、reduceRight、indexOf和lastIndexOf。其中，前7个与函数式（functional）操作有关。

这些方法可以在数组上使用，也可以在字符串和类似数组的对象上使用，这是它们不同于传统数组方法的一个地方。

在用法上，这些方法的参数是一个函数，这个作为参数的函数本身又接受三个参数：数组的当前元素elem、该元素的位置index和整个数组arr（详见下面的实例）。另外，上下文对象（context）可以作为第二个参数，传入forEach(), every(), some(), filter(), map()方法，用来绑定函数运行时的上下文。

对于不支持这些方法的老式浏览器（主要是IE 8及以下版本），可以使用函数库[es5-shim](https://github.com/kriskowal/es5-shim)，或者[Underscore](http://underscorejs.org/#filter)和[Lo-Dash](http://lodash.com/docs#filter)。

### map方法，forEach方法

map方法对所有元素依次调用一个函数，根据函数结果返回一个新数组。

{% highlight javascript %}

[1, 2, 3].map(function(elem, index, arr){
    return elem * elem;
});
// [1, 4, 9]

{% endhighlight %}

通过函数的call方法，map方法可以用于字符串。

{% highlight javascript %}

[].map.call('abc', function (x) { return x.toUpperCase() })
// [ 'A', 'B', 'C' ]

// 或者

'abc'.split('').map(function (x) { return x.toUpperCase() })
// [ 'A', 'B', 'C' ]

{% endhighlight %}

forEach方法对所有元素依次执行一个函数，它与map的区别在于不返回新数组，而是对原数组的成员执行某种操作，甚至可能改变原数组的值。

{% highlight javascript %}

[1, 2, 3].forEach(function(elem, index, arr){
    console.log("array[" + index + "] = " + elem);
});
// array[0] = 1
// array[1] = 2
// array[2] = 3

{% endhighlight %}

从上面代码可以看到，map和forEach的参数格式是一样的，都是一个函数。该函数接受三个参数，分别是当前元素、当前元素的位置（从0开始）、整个数组。

这两个方法都可以接受第二个参数，用来绑定函数中的this关键字。

{% highlight javascript %}

var out = [];

[1, 2, 3].map(function(elem, index, arr){
    this.push(elem * elem);
}, out);

out // [1, 4, 9]

{% endhighlight %}

上面代码表示，如果提供一个数组作为第二个参数，则函数内部的this关键字就指向这个数组。

### filter方法

filter方法依次对所有数组成员调用一个测试函数，返回结果为true的成员组成一个新数组返回。

{% highlight javascript %}

[1,2,3,4,5].filter(function(elem){
	return (elem>3);		
})
// [4,5]

{% endhighlight %}

上面代码将大于3的原数组成员，作为一个新数组返回。

filter方法的参数必须是一个返回布尔值的函数。该函数的第一个参数是当前数组成员的值，这是必需的，后两个参数是可选的，分别是当前数组成员的位置和整个数组。

{% highlight javascript %}

[1, 2, 3, 4, 5].filter(function(elem, index, arr){
    return index % 2 === 0;
});
// [1, 3, 5]

{% endhighlight %}

上面代码返回原数组偶数位置的成员组成的新数组。

### some方法，every方法

这两个方法类似“断言”（assert），用来判断数组成员是否符合某种条件。

some方法对所有元素调用一个测试函数，只要有一个元素通过该测试，就返回true，否则返回false。

{% highlight javascript %}

[1, 2, 3, 4, 5].some(function(elem, index, arr){
    return elem >= 3;
});
// 返回true

{% endhighlight %}

上面代码表示，如果存在大于等于3的数组成员，就返回true。

every方法对所有元素调用一个测试函数，只有所有元素通过该测试，才返回true，否则返回false。

{% highlight javascript %}

[1, 2, 3, 4, 5].every(function(elem, index, arr){
    return elem >= 3;
});
// 返回false

{% endhighlight %}

上面代码表示，只有所有数组成员大于等于3，才返回true。

从上面的代码可以看到，some和every的使用方法与map和forEach是一致的，参数完全一模一样。也就是说，它们也可以使用第二个参数，用来绑定函数中的this关键字。

### reduce方法，reduceRight方法

reduce和reduceRight方法的作用，是依次处理数组的每个元素，最终累计为一个值。这两个方法的差别在于，reduce对数组元素的处理顺序是从左到右，reduceRight则是从右到左，其他地方完全一样。

reduce方法的第一个参数是一个处理函数。该函数接受四个参数，分别是：

1. 用来累计的变量（即当前状态）
2. 数组的当前元素
3. 当前元素在数组中的序号（从0开始）
4. 原数组

这四个参数之中，只有前两个是必须的，后两个则是可选的。

{% highlight javascript %}

[1, 2, 3, 4, 5].reduce(function(x, y){
    return x+y;
});
// 15

{% endhighlight %}

上面代码的参数x表示累计变量，默认为0，y则是数组的当前元素。reduce方法依次将每个数组元素加入x，最终返回它们的总和15。

利用reduce方法，可以写一个数组求和的sum方法。

{% highlight javascript %}

Array.prototype.sum = function (){
    return this.reduce(function (partial, value){
        return partial + value;
    })
};

[3,4,5,6,10].sum()
// 28

{% endhighlight %}

如果要对累计变量指定初值，可以把它放在reduce方法的第二个参数。

{% highlight javascript %}

[1, 2, 3, 4, 5].reduce(function(x, y){
    return x+y;
}, 10);
// 25

{% endhighlight %}

上面代码指定参数x的初值为10，所以数组元素从10开始累加，最终结果为25。

由于reduce方法依次处理每个元素，所以实际上还可以用它来搜索某个元素。比如，下面代码是找出长度最长的数组元素。

{% highlight javascript %}

function findLongest(entries) {
  return entries.reduce(function (longest, entry) {
    return entry.length > longest.length ? entry : longest;
  }, '');
}

{% endhighlight %}

### indexOf 和 lastIndexOf

ECMAScript 5新增的9个方法之中，有2个与函数式编程无关，分别是indexOf和lastIndexOf。

indexOf方法返回给定元素在数组中第一次出现的位置，如果没有出现则返回-1。

{% highlight javascript %}

var a = ['a','b','c'];

a.indexOf('b')
// 1

a.indexOf('y')
// -1

{% endhighlight %}

indexOf方法还可以接受第二个参数，表示搜索的开始位置。

{% highlight javascript %}

['a','b','c'].indexOf('a', 1)
// -1

{% endhighlight %}

上面代码从位置1开始搜索字符a，结果为-1，表示没有搜索到。

lastIndexOf方法返回给定元素在数组中最后一次出现的位置，如果没有出现则返回-1。

{% highlight javascript %}

var a = [2, 5, 9, 2];

a.lastIndexOf(2)
// 3

a.lastIndexOf(7)
// -1

{% endhighlight %}

注意，如果数组中包含NaN，这两个方法不适用。

```javascript

[NaN].indexOf(NaN) // -1
[NaN].lastIndexOf(NaN) // -1

```

这是因为这两个方法内部，使用严格相等运算符（===）进行比较，而NaN是唯一一个不等于自身的值。

### 链式使用

上面这些数组方法之中，有不少返回的还是数组，所以可以链式使用。

{% highlight javascript %}

var users = [{name:"tom", email:"tom@example.com"},
			 {name:"peter", email:"peter@example.com"}];

users
.map(function (user){ return user.email; })
.filter(function (email) { return /^t/.test(email); })
.forEach(alert);
// 弹出tom@example.com

{% endhighlight %}

## 参考链接

- Nicolas Bevacqua, [Fun with JavaScript Native Array Functions](http://flippinawesome.org/2013/11/25/fun-with-javascript-native-array-functions/)
