---
title: 数组
date: 2012-12-11
category: grammar
layout: page
modifiedOn: 2012-12-11
---

## 数组与字典

Javascript的数组（array），其实是字典结构（dictionary，在Javascript里面就是对象）的一个变种，它的键（key）就是从0开始的连续整数。字典的键都是字符串，所以才会有下面的运行结果：

{% highlight javascript %}

 > var arr = ['a', 'b', 'c'];
 > arr['0']
 'a'
 > arr[0]
 'a'

{% endhighlight %}

适用于对象的运算符in，也适用于数组。

{% highlight javascript %}

>2 in [ 'a', 'b', 'c' ]
true
>'2' in [ 'a', 'b', 'c' ]
true

{% endhighlight %}

字典的引用可以使用“点”结构（object.key），但是数组不行，arr.0不是合法的表示方式，因为数字不是标识符（identifier）。所以，数组只能用方括号表示，但是对象即可以用“点”表示，也可以用方括号表示。

## length属性

该属性表示数组的元素个数。

添加新元素后，该属性会自动增长。

{% highlight javascript %}

> var arr = [];
> arr.length
0
> arr[0] = 'a';
> arr.length
1

{% endhighlight %}

length属性是可写的。如果人为设置一个小于当前元素个数的值，当该数组的元素会自动减少到你设置的值。

{% highlight javascript %}

> var arr = [ 'a', 'b', 'c' ];
> arr.length
3
> 2 in arr
true
> arr.length = 2;
2
> 2 in arr
false

{% endhighlight %}

如果人为设置大于当前元素个数的值，则数组的长度增加到该值，新增的位置填入空元素。

{% highlight javascript %}

> var arr = ['a'];
> arr.length = 3;
> arr
[ 'a', , ,]

{% endhighlight %}

如果人为设置不合法的值，Javascript会报错。

{% highlight javascript %}

// 设置负值
> [].length = -1
RangeError: Invalid array length

// 数组元素个数超过2的32次方
> [].length = Math.pow(2,32)
RangeError: Invalid array length

// 设置字符串
> [].length = 'abc'
RangeError: Invalid array length

{% endhighlight %}

## 数组的空位

当数组的某个位置是空元素，我们称该数组存在空位（hole）。

空位会被计入length属性，值为undefined。

{% highlight javascript %}

> var a = new Array(3);
> a
[ , ,  ]
> a.length
3
> a[0]
undefined

{% endhighlight %}

但是，执行循环操作时，空位会被跳过。

{% highlight javascript %}

> a.forEach(function (x, i) { console.log(i+". "+x) });

{% endhighlight %}

如果你不希望空位被跳过，一个技巧是人为在空位填入undefined。

{% highlight javascript %}

> var a = new Array(undefined,undefined,undefined);
> a.forEach(function (x, i) { console.log(i+". "+x) });
0. undefined
1. undefined
2. undefined

{% endhighlight %}

## EcmaScript 5 新加入的数组方法

EcmaScript 5 新加入了9个数组方法，其中有7个与函数式（functional）操作有关。

- [Array.prototype.map](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map)
- [Array.prototype.forEach](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach)
- [Array.prototype.filter](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter)
- [Array.prototype.every](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every)
- [Array.prototype.some](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some)
- [Array.prototype.reduce](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce)
- [Array.prototype.reduceRight](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduceRight)

这7个方法的参数是一个函数，该函数接受三个参数，分别是数组的当前元素elem、该元素的位置index 和整个数组arr。

map方法对所有元素依次调用一个函数，根据函数结果返回一个新数组。

{% highlight javascript %}

[1, 2, 3].map(function(elem, index, arr){
    return elem * elem;
});
//returns [1, 4, 9]

{% endhighlight %}

foreach方法对所有元素依次执行一个函数，它与map的区别在于不返回新数组。

{% highlight javascript %}

[1, 2, 3].map(function(elem, index, arr){
    console.log("array[" + index + "] = " + elem);
});
// array[0] = 1
// array[1] = 2
// array[2] = 3

{% endhighlight %}

filter方法对所有元素调用一个测试函数，通过测试的元素组成一个新数组返回。

{% highlight javascript %}

[1, 2, 3, 4, 5].filter(function(elem, index, arr){
    return elem % 2 === 0;
});
//returns [2, 4]

{% endhighlight %}

some方法对所有元素调用一个测试函数，只要有一个元素通过该测试，就返回true，否则返回false。

{% highlight javascript %}

[1, 2, 3, 4, 5].some(function(elem, index, arr){
    return elem >= 3;
});
//returns true

{% endhighlight %}

every方法对所有元素调用一个测试函数，只有所有元素通过该测试，才返回true，否则返回false。

{% highlight javascript %}

[1, 2, 3, 4, 5].every(function(elem, index, arr){
    return elem >= 3;
});
//returns false

{% endhighlight %}

reduce和reduceRight方法的作用，是将数组的每个元素累计处理为一个值。它们的不同之处在于，前者的处理顺序是从左到右，后者的处理顺序是从右到左。它们的第一个参数是一个处理函数，该函数接受四个参数，分别是用来累计的变量（即当前状态）、数组的当前元素elem、该元素的位置index 和整个数组arr。这两个方法还可以有第二个参数，表示累计变量的初值。

{% highlight javascript %}

[1, 2, 3, 4, 5].reduce(function(sum, elem, index, arr){
    return sum + elem;
});
//returns 15

[1, 2, 3, 4, 5].reduce(function(sum, elem, index, arr){
    return sum + elem;
}, 10);
//returns 25

{% endhighlight %}

9个新方法中还有2个，分别是[Array.prototype.indexOf](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf) 和[Array.prototype.lastIndexOf](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/lastIndexOf)。

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

## 参考链接

- Dr. Axel Rauschmayer, [Arrays in JavaScript](http://www.2ality.com/2012/12/arrays.html)
- Dr. Axel Rauschmayer, [JavaScript: sparse arrays vs. dense arrays](http://www.2ality.com/2012/06/dense-arrays.html)
- [What They Didn’t Tell You About ES5′s Array Extras](http://net.tutsplus.com/tutorials/javascript-ajax/what-they-didnt-tell-you-about-es5s-array-extras/)
