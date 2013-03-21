---
title: 数组
date: 2012-12-11
category: grammar
layout: page
modifiedOn: 2013-03-21
---

## 定义

数组（array）是按次序排列的一组值。

{% highlight javascript %}

var arr = ['a', 'b', 'c'];

{% endhighlight %}

上面代码中的“a”、“b”、“c”就构成一个数组，两端的方括号是数组的标志。

在Javascript语言中，数组与“对象”的区别在于，“对象”的每个值都有对应的键名，而数组不需要指定键名，它的键名是默认的：0，1，2...。

{% highlight javascript %}

var arr = ['a', 'b', 'c'];

arr[0]
// "a"

arr[1]
// "b"

arr [2]
// "c"

{% endhighlight %}

但是本质上，数组也属于对象，是字典结构（dictionary）的一个变种。前面说过，数组的键是从0开始的连续整数，但是对象的键都是字符串，所以才会有下面的运行结果：

{% highlight javascript %}

 var arr = ['a', 'b', 'c'];
 
 arr['0']
 // 'a'
 
 arr[0]
 // 'a'

{% endhighlight %}

检查某个键是否存在的运算符in，适用于对象，也适用于数组。

{% highlight javascript %}

2 in [ 'a', 'b', 'c' ]
// true

'2' in [ 'a', 'b', 'c' ]
// true

{% endhighlight %}

使用for-in循环，可以遍历数组的所有元素。

{% highlight javascript %}

var a = [1,2,3,4];

for (var i in a){
	console.log(a[i]);
}
// 1
// 2
// 3
// 4

{% endhighlight %}

另一种遍历的做法是for循环结合length属性。

{% highlight javascript %}

var a = [1,2,3,4];

for (var i = 0;i < a.length;i++){
	console.log(a[i]);
}
// 1
// 2
// 3
// 4

{% endhighlight %}

字典成员的引用可以使用“点”结构（object.key），也可以用方括号表示。但是数组成员不能使用点结构表示，arr.0不合法，因为数字不是标识符（identifier）。所以，数组成员只能用方括号表示。

除了直接使用方括号创建，数组还是使用JavaScript内置的Array对象创建。

{% highlight javascript %}

var a = new Array();
a
// []

a.length
// 0

var a = new Array(1);
a
// [undefined × 1]

a.length
// 1

var a = new Array(2);
a
// [undefined × 2]

a.length
// 2

var a = new Array(1,2);
a
// [1,2]

a.length
// 2

var a = new Array ("a","b","c");
a
// ["a", "b", "c"]

{% endhighlight %}

## length属性

该属性表示数组的元素个数。

{% highlight javascript %}

var arr = ['a', 'b', 'c'];
arr.length
// 3

{% endhighlight %}

添加新元素后，该属性会自动增长。

{% highlight javascript %}

var arr = [];

arr.length
// 0

arr[0] = 'a';

arr.length
// 1

{% endhighlight %}

length属性是可写的。如果人为设置一个小于当前元素个数的值，该数组的元素会自动减少到你设置的值。

{% highlight javascript %}

var arr = [ 'a', 'b', 'c' ];

arr.length
// 3

2 in arr
// true

arr.length = 2;

2 in arr
// false

{% endhighlight %}

如果人为设置大于当前元素个数的值，则数组的长度增加到该值，新增的位置填入空元素。

{% highlight javascript %}

var arr = ['a'];

arr.length = 3;

arr
// [ 'a', , ,]

{% endhighlight %}

如果人为设置length为不合法的值，Javascript会报错。

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

var a = new Array();

a["p"] = "abc";

a.p
// "abc"

a.length
// 0

{% endhighlight %}

另外，如果使用delete命令删除一个值，不影响length属性的值。

var a = [1,2,3];
a.length
// 3

delete a[1]
// true

a.length
// [1, undefined × 1, 3]

{% endhighlight %}

## 数组的空位

当数组的某个位置是空元素，我们称该数组存在空位（hole）。

{% highlight javascript %}

var a = [1,,1];

a
// [1, undefined × 1, 1]

{% endhighlight %}

另一种情况是使用delete命令删除一个值。

{% highlight javascript %}

var a = [1,2,3];

delete a[1]
// true

a
// [1, undefined × 1, 3]

{% endhighlight %}

空位会被计入length属性，值为undefined。

{% highlight javascript %}

var a = new Array(3);

a
// [ , ,  ]

a.length
// 3

a[0]
// undefined

{% endhighlight %}

但是，执行循环操作时，空位会被跳过。

{% highlight javascript %}

var a = new Array(3);

a.forEach(function (x, i) { console.log(i+". "+x) });
// 不产生任何输出 

{% endhighlight %}

如果你不希望空位被跳过，一个技巧是在空位显式填入undefined。

{% highlight javascript %}

var a = new Array(undefined,undefined,undefined);

a.forEach(function (x, i) { console.log(i+". "+x) });
// 0. undefined
// 1. undefined
// 2. undefined

{% endhighlight %}

## 数组的方法

- pop 删除并返回数组的最后一个元素
- reverse 颠倒数组中元素的顺序
- unshift 向数组的开头添加一个或多个元素，并返回添加后的数组长度
- valueOf 返回数组对象的原始值

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

## EcmaScript 5 新加入的数组方法

EcmaScript 5在数组原型（Array.prototype）上，新增了9个方法，其中有7个与函数式（functional）操作有关：map、forEach、filter、every、some、reduce、reduceRight。

这7个方法可以直接在数组上使用，它们的参数是一个函数。这个作为参数的函数本身又接受三个参数，分别是数组的当前元素elem、该元素的位置index和整个数组arr。

### map

map方法对所有元素依次调用一个函数，根据函数结果返回一个新数组。

{% highlight javascript %}

[1, 2, 3].map(function(elem, index, arr){
    return elem * elem;
});
// 返回[1, 4, 9]

{% endhighlight %}

map

### forEach

forEach方法对所有元素依次执行一个函数，它与map的区别在于不返回新数组。

{% highlight javascript %}

[1, 2, 3].forEach(function(elem, index, arr){
    console.log("array[" + index + "] = " + elem);
});
// array[0] = 1
// array[1] = 2
// array[2] = 3

{% endhighlight %}

### filter

filter方法对所有元素调用一个测试函数，操作结果为true的元素组成一个新数组返回。

{% highlight javascript %}

[1, 2, 3, 4, 5].filter(function(elem, index, arr){
    return elem % 2 === 0;
});
// 返回 [2, 4]

{% endhighlight %}

### some

some方法对所有元素调用一个测试函数，只要有一个元素通过该测试，就返回true，否则返回false。

{% highlight javascript %}

[1, 2, 3, 4, 5].some(function(elem, index, arr){
    return elem >= 3;
});
// 返回true

{% endhighlight %}

### every

every方法对所有元素调用一个测试函数，只有所有元素通过该测试，才返回true，否则返回false。

{% highlight javascript %}

[1, 2, 3, 4, 5].every(function(elem, index, arr){
    return elem >= 3;
});
// 返回false

{% endhighlight %}

### reduce 和 reduceRight

reduce和reduceRight方法的作用，是将数组的每个元素累计处理为一个值。它们的不同之处在于，前者的处理顺序是从左到右，后者的处理顺序是从右到左。它们的第一个参数是一个处理函数，该函数接受四个参数，分别是用来累计的变量（即当前状态）、数组的当前元素elem、该元素的位置index 和整个数组arr。这两个方法还可以有第二个参数，表示累计变量的初值。

{% highlight javascript %}

[1, 2, 3, 4, 5].reduce(function(sum, elem, index, arr){
    return sum + elem;
});
// 返回15

[1, 2, 3, 4, 5].reduce(function(sum, elem, index, arr){
    return sum + elem;
}, 10);
// 返回25

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

- Dr. Axel Rauschmayer, [Arrays in JavaScript](http://www.2ality.com/2012/12/arrays.html)
- Dr. Axel Rauschmayer, [JavaScript: sparse arrays vs. dense arrays](http://www.2ality.com/2012/06/dense-arrays.html)
- [What They Didn’t Tell You About ES5′s Array Extras](http://net.tutsplus.com/tutorials/javascript-ajax/what-they-didnt-tell-you-about-es5s-array-extras/)
