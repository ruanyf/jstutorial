---
title: 数组
date: 2012-12-11
category: grammar
layout: page
modifiedOn: 2013-11-24
---

## 概述

### 数组的定义

数组（array）是按次序排列的一组值，用方括号表示。。

{% highlight javascript %}

var arr = ['a', 'b', 'c'];

{% endhighlight %}

上面代码中的“a”、“b”、“c”就构成一个数组，两端的方括号是数组的标志。

除了在定义时赋值，数组也可以先定义后赋值。

{% highlight javascript %}

var arr = [];

arr[0] = 'a';
arr[1] = 'b';
arr[2] = 'c';

{% endhighlight %}

上面的代码与前一段代码是等价的。

在Javascript语言中，数组与“对象”的区别在于，“对象”的每个值都有对应的键名，而数组不需要指定键名，它的键名是默认的数字键：0，1，2...。数组的数字键默认从0开始。

{% highlight javascript %}

var arr = ['a', 'b', 'c'];

arr[0] // "a"
arr[1] // "b"
arr[2] // "c"

{% endhighlight %}

任意一种类型的数据，都可以放入数组。

{% highlight javascript %}

var arr = [{a:1}, [1,2,3],function (){return true;}];

arr[0] // Object {a: 1}
arr[1] // [1, 2, 3]
arr[2] // function (){return true;}

{% endhighlight %}

上面数组的3个成员分别是对象、数组、函数。

如果数组的元素还是数组，就形成了多维数组。

{% highlight javascript %}

var a = [[1,2],[3,4]];
a[0][1] // 2
a[1][1] // 4

{% endhighlight %}

### 数组与对象的关系

本质上，数组也属于对象，是字典结构（dictionary）的一个变种。

{% highlight javascript %}

var arr = [1, 2, 3];

typeof arr // "object"

{% endhighlight %}

上面代码表明，由于数组只是一种特殊的对象，所以typeof运算符返回数组的类型是object。

数组的特殊性体现在，它的键都是整数，但是对象内部是以字符串来识别一个键。由于数组是一种特殊对象，因此以数值或字符串作为键名，都能读取数组的成员。

{% highlight javascript %}

var arr = ['a', 'b', 'c'];

arr['0'] // 'a'
arr[0] // 'a'

{% endhighlight %}

上面代码分别用数值和字符串作为键名，结果都能读取数组。

前面说过，对象有两种读取成员的方法：“点”结构（object.key）和方括号结构（object[key]）表示。但是，对于数字的键名，不能使用点结构，arr.0的写法不合法，因为单独的数字不能作为标识符（identifier）。所以，数组成员只能用方括号arr[0]表示。

### length属性

数组的length属性，返回数组的成员数量。

{% highlight javascript %}

['a', 'b', 'c'].length // 3

{% endhighlight %}

数组与对象的区别，除了键名以外，就是length属性。对象可以没有length属性，但是数组一定有。而且，数组的length属性是一个动态的值，等于最大的那个整数键加上1。

{% highlight javascript %}

var arr = ['a', 'b'];
arr.length // 2

arr[2] = 'c';
arr.length // 3

arr[9] = 'd';
arr.length // 10

arr[1000] = 'e';
arr.length // 1001

{% endhighlight %}

上面代码表示，数组的数字键不需要连续，length属性的值总是比最大的那个整数键大出1。

length属性是可写的。如果人为设置一个小于当前成员个数的值，该数组的成员会自动减少到length设置的值。

{% highlight javascript %}

var arr = [ 'a', 'b', 'c' ];
arr.length // 3

arr.length = 2;
arr // ["a", "b"]

{% endhighlight %}

上面代码表示，当数组的length属性设为2，即最大的整数键只能是1，那么整数键2（值为c）就已经不在数组中了，被自动删除了。

将数组清空的一个有效方法，就是将length属性设为0。

{% highlight javascript %}

var arr = [ 'a', 'b', 'c' ];

arr.length = 0;
arr // []

{% endhighlight %}

如果人为设置length大于当前元素个数，则数组的成员数量会增加到这个值，新增的位置填入空元素。

{% highlight javascript %}

var a = ['a'];

a.length = 3;
a // ["a", undefined × 2]

{% endhighlight %}

上面代码表示，当length属性设为大于数组个数时，新增的位置都填充为undefined。

如果人为设置length为不合法的值，JavaScript会报错。

{% highlight javascript %}

// 设置负值
[].length = -1
// RangeError: Invalid array length

// 数组元素个数超过2的32次方
[].length = Math.pow(2,32)
// RangeError: Invalid array length

// 设置字符串
[].length = 'abc'
// RangeError: Invalid array length

{% endhighlight %}

值得注意的是，由于数组本质上是对象的一种，所以我们可以为数组添加属性，但是这不影响length属性的值。

{% highlight javascript %}

var a = [];

a["p"] = "abc";
a.length // 0

a[2.1] = "abc";
a.length // 0

{% endhighlight %}

上面代码将数组的键分别设为字符串和小数，结果都不影响length属性。因为，length属性的值就是等于最大的数字键加1，而这个数组没有整数键，所以length属性保持为0。

### 数组的空位

当数组的某个位置是空元素（比如两个逗号之间没有任何值，或者值为undefined），我们称该数组存在空位（hole）。

{% highlight javascript %}

var a = [1,,1];

a
// [1, undefined, 1]

{% endhighlight %}

需要注意的是，如果最后一个元素后面有逗号，并不会产生空位。也就是说，有没有这个逗号，结果都是一样的。不过，这一条对IE 8及以下版本不适用。

{% highlight javascript %}

var a = [1,2,3,];

a.length // 3
a // [1, 2, 3]

{% endhighlight %}

上面代码中，原数组最后一个成员后面有一个逗号，这不影响length属性的值，与没有这个逗号时效果一样。

使用delete命令删除一个值，会形成空位。

{% highlight javascript %}

var a = [1,2,3];

delete a[1];
a
// [1, undefined, 3]

{% endhighlight %}

需要注意的是，如果使用delete命令删除一个值，不影响length属性。

{% highlight javascript %}

var a = [1,2,3];
a.length // 3

delete a[1];
a // [1, undefined, 3]
a.length // 3

delete a[2];
a // [1, undefined, undefined]
a.length // 3

{% endhighlight %}

上面代码用delete命令删除了两个键，对length属性没有影响。因为这两个键还在，只是值变为了undefined。也就是说，length属性不过滤undefined的值。

由于length属性不计入非整数键且不过滤undefined，所以使用它进行数组遍历，一定要非常小心。

{% highlight javascript %}

for (var i=0; i<a.length; i++){
	// some code
}

{% endhighlight %}

上面的写法会遗漏数组对象的非整数键，并且会包括空位。

空位通过空值生成，还是通过显式设为undefined生成，有一个细微的差别。如果通过空值生成，使用数组的forEach方法或者for...in结构进行遍历，空位就会被跳过。

{% highlight javascript %}

var a = [,,,];

a.forEach(function (x, i) { console.log(i+". "+x) })
// 不产生任何输出 

for (var i in a){console.log(i)}
// 不产生任何输出

{% endhighlight %}

如果空位是通过显式定义undefined生成，遍历的时候就不会被跳过。

{% highlight javascript %}

var a = [undefined,undefined,undefined];

a.forEach(function (x, i) { console.log(i+". "+x) });
// 0. undefined
// 1. undefined
// 2. undefined

for (var i in a){console.log(i)}
// 0
// 1
// 2

{% endhighlight %}

### in运算符，for...in循环

检查某个键是否存在的运算符in，适用于对象，也适用于数组。

{% highlight javascript %}

2 in [ 'a', 'b', 'c' ]
// true

'2' in [ 'a', 'b', 'c' ]
// true

{% endhighlight %}

使用for-in循环，可以遍历数组的所有元素。

{% highlight javascript %}

var a = [1,2,3];

for (var i in a){
	console.log(a[i]);
}
// 1
// 2
// 3

{% endhighlight %}

另一种遍历的做法是用for循环或者while循环结合length属性。

{% highlight javascript %}

var a = [1,2,3];
for(var i = 0; i < a.length; i++){
	console.log(a[i]);
}

// or

var i = 0;
while (i< a.length){
	console.log(a[i]);
	i++;
}

// or

var l = a.length;
while (l--){
	console.log(a[l]);
}

{% endhighlight %}

上面代码是三种遍历数组的写法。需要注意的是，最后一种写法是逆向遍历，即从最后一个元素向第一个元素遍历。

### Array构造函数

除了直接使用方括号创建，数组还可以使用JavaScript内置的Array构造函数创建。但是，Array构造函数的参数定义不符合直觉，使用一个参数时表示数组的长度，使用一个以上参数时表示数组的定义，所以建议总是直接采用方括号创建数组。

{% highlight javascript %}

var a = new Array();
a // []
a.length // 0

var a = new Array(1);
a // [undefined × 1]
a.length // 1

var a = new Array(2);
a // [undefined × 2]
a.length // 2

var a = new Array(1,2);
a // [1,2]
a.length // 2

{% endhighlight %}

对Array构造函数的详细介绍，参见《标准库》一章的《Array对象》。


## EcmaScript 5 新加入的数组方法

EcmaScript 5在数组原型（Array.prototype）上，新增了9个方法，其中有7个与函数式（functional）操作有关：map、forEach、filter、every、some、reduce、reduceRight。

这7个方法可以直接在数组上使用，它们的参数是一个函数。这个作为参数的函数本身又接受三个参数，分别是数组的当前元素elem、该元素的位置index和整个数组arr。

对于不支持这些方法的老式浏览器（主要是IE 8及以下版本），可以使用函数库[es5-shim](https://github.com/kriskowal/es5-shim)，或者[Underscore](http://underscorejs.org/#filter)和[Lo-Dash](http://lodash.com/docs#filter)。

### map

map方法对所有元素依次调用一个函数，根据函数结果返回一个新数组。

{% highlight javascript %}

[1, 2, 3].map(function(elem, index, arr){
    return elem * elem;
});
// [1, 4, 9]

{% endhighlight %}

map方法还可以接受第二个参数，用来绑定函数中的this关键字。

{% highlight javascript %}

var out = [];

[1, 2, 3].map(function(elem, index, arr){
    return this.push(elem * elem);
}, out);

out // [1, 4, 9]

{% endhighlight %}

### forEach

forEach方法对所有元素依次执行一个函数，它与map的区别在于不返回新数组，而是对原数组的成员执行某种操作，甚至可能改变原数组的值。

forEach方法的参数是一个函数，该函数接受三个参数，分别是当前元素、当前元素的位置（从0开始）、整个数组。

{% highlight javascript %}

[1, 2, 3].forEach(function(elem, index, arr){
    console.log("array[" + index + "] = " + elem);
});
// array[0] = 1
// array[1] = 2
// array[2] = 3

{% endhighlight %}

foreach方法

### filter

filter方法对所有元素调用一个测试函数，操作结果为true的元素组成一个新数组返回。

{% highlight javascript %}

[1,2,3,4,5].filter(function(elem){
	return (elem>3);		
})
// [4,5]

{% endhighlight %}

上面代码只保留大于3的元素，作为一个新数组返回。

filter方法接受一个返回布尔值的测试函数作为参数。该测试函数的第一个参数是当前数组成员的值。除了这个参数以外，其他参数都是可选的，分别是当前数组成员的位置和整个数组。

{% highlight javascript %}

[1, 2, 3, 4, 5].filter(function(elem, index, arr){
    return index % 2 === 0;
});
// [1, 3, 5]

{% endhighlight %}

上面代码返回原数组偶数位置的成员组成的新数组。

### some方法，every方法

some方法对所有元素调用一个测试函数，只要有一个元素通过该测试，就返回true，否则返回false。

{% highlight javascript %}

[1, 2, 3, 4, 5].some(function(elem, index, arr){
    return elem >= 3;
});
// 返回true

{% endhighlight %}

every方法对所有元素调用一个测试函数，只有所有元素通过该测试，才返回true，否则返回false。

{% highlight javascript %}

[1, 2, 3, 4, 5].every(function(elem, index, arr){
    return elem >= 3;
});
// 返回false

{% endhighlight %}

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

除了上面7个，还有2个与函数式编程无关的方法中，分别是[indexOf](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf) 和[lastIndexOf](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/lastIndexOf)。

indexOf方法返回给定元素在数组中第一次出现的位置，如果没有出现则返回-1。

{% highlight javascript %}

var array = [2, 5, 9];

var index = array.indexOf(2);
// 0

index = array.indexOf(7);
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

var array = [2, 5, 9, 2];

var index = array.lastIndexOf(2);
// index is 3

index = array.lastIndexOf(7);
// index is -1

{% endhighlight %}

### 实例

这些方法的好处在于，它们可以链式使用。

{% highlight javascript %}

var users = [{name:"tom", email:"tom@example.com"},
			 {name:"peter", email:"peter@example.com"}];

users.map(function (user){ return user.email; })
.filter(function (email) { return /^t/.test(email); })
.forEach(alert);
// 弹出tom@example.com

{% endhighlight %}

## 参考链接

- Axel Rauschmayer, [Arrays in JavaScript](http://www.2ality.com/2012/12/arrays.html)
- Axel Rauschmayer, [JavaScript: sparse arrays vs. dense arrays](http://www.2ality.com/2012/06/dense-arrays.html)
- Felix Bohm, [What They Didn’t Tell You About ES5′s Array Extras](http://net.tutsplus.com/tutorials/javascript-ajax/what-they-didnt-tell-you-about-es5s-array-extras/)
- Juriy Zaytsev, [How ECMAScript 5 still does not allow to subclass an array](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/)
