---
title: 语法概述
layout: page
category: grammar
date: 2012-12-14
modifiedOn: 2013-01-16
---

## 注释

Javascript提供两种注释：一种是单行注释，用//起头；另一种是多行注释，放在/* 和 */之间。

{% highlight javascript %}

// 单行注释

/*
 多
 行
 注
 释
*/

{% endhighlight %}

## 数据类型

Javascript的值的类型分成两大类：原始类型（primitive types）和复合类型（object types）。

原始类型分成三种。

- 数值（number）
- 字符串（string）
- 布尔值（boolean）

复合类型也分成三种。

- 对象（object）
- 数组（array）
- 函数（function）

除了上面这六种数据类型，Javascript还定义一个特殊的数据类型undefined和一个特殊的值null。

undefined表示“未定义”，即还没有确定数据类型。如果一个变量只是被声明，没有被赋值，那么它的值默认就是undefined。

{% highlight javascript %}

var v;

v
// undefined

{% endhighlight %}

null表示空对象。它不是一种单独的数据类型，而是包含在对象类型（object）之中的一种特殊值。

{% highlight javascript %}

var v = null;

v
// null

{% endhighlight %}

这里需要明确的是，Javascript中的所有数据，都可以视为对象，数组和函数只不过是特殊的对象而已，就连数值、字符串、布尔值都可以用对象方式调用。

## typeof 运算符

该运算符用来确定一个值的数据类型，可能有以下结果：

- 如果值的类型是undefined: 返回undefined。

{% highlight javascript %}

> typeof undefined
  "undefined"

{% endhighlight %}

typeof可以用来检查一个没有声明的变量，而不报错。其他语法结构都没有这个功能。

{% highlight javascript %}

v
// ReferenceError: v is not defined

typeof v
// undefined

{% endhighlight %}

- 如果值的类型是null，返回object。

{% highlight javascript %}

typeof null
// object

{% endhighlight %}

- 如果值的类型是布尔值，返回boolean。

{% highlight javascript %}

typeof false
// boolean

{% endhighlight %}

- 如果值的类型是数值，返回number。

{% highlight javascript %}

typeof 123
// number

{% endhighlight %}

- 如果值的类型是字符串，返回string。

{% highlight javascript %}

typeof "123"
// string

{% endhighlight %}

- 如果值的类型是函数，返回function。

{% highlight javascript %}

typeof print
// function

{% endhighlight %}

- 如果值的类型不属于上面任何一种情况，返回object。

{% highlight javascript %}

typeof window 
// object

typeof {}; 
// object

typeof []; 
// object

typeof null;
// object

{% endhighlight %}

## 布尔值

Javascript将下面的值，都视为false。

- undefined
- null
- false
- 0
- ""

{% highlight javascript %}

if (""){ console.info(true);}
// 没有任何输出

{% endhighlight %}

需要特别注意的是，空数组（[]）和空对象（{}）对应的布尔值，都是true。

{% highlight javascript %}

if ([]){ console.info(true);}
// true

if ({}){ console.info(true);}
// true

{% endhighlight %}

## 运算符

### 比较运算符

- == 相等
- === 严格相等
- != 不相等
- !== 严格不相等
- < 小于
- <= 小于或等于
- \> 大于
- \>= 大于或等于

### 相等运算符与严格相等运算符

相等运算符（==）比较两个“值”是否相等，严格相等运算符（===）比较它们是否为“同一个值”。

如果两个值不是同一个类型，严格相等运算符（===）直接返回false，而相等运算符（==）会将它们转化成同一个类型，再用严格相等运算符进行比较。

#### 相等运算符的比较规则：

（1） undefined和null两者，与自身或互相比较时，结果为true，与其他类型的值比较时，结果都为false。

（2）字符串与数值比较时，字符串转化成数值。

（3）布尔值与非布尔值比较时，布尔值转化成数值，再进行比较。

（4）对象与字符串或数值比较时，对象转化成原始类型的值，再进行比较。

由于这种转化会返回一些违反直觉的结果，因此不推荐使用==，建议只使用===。

{% highlight javascript %}

1 == true
// true

"2" == true
// false

2 == true
// false

2 == false
// false

"true" == true
// false

null == null
// true

undefined == null
// true

false == null
// false

0 == null
// false

{% endhighlight %}

#### 严格相等运算符的比较规则

比较不同类型的值时，严格相等运算符遵守以下规则：

（1）字符串与字符串比较时，看它们的值是否相同。

（2）布尔值与布尔值比较时，看它们的值是否相同。

（3）数字与数字比较时，看它们的值是否相同。同时，NaN与任何值都不相等（包括其自身），以及正0等于负0。

{% highlight javascript %}

	NaN !== _  // 任何值包括其自身
    
    +0 === -0

{% endhighlight %}

（4）两个复合类型的量比较时（包括对象、数组、函数），不是比较它们的值是否相等，而是比较它们是否指向同一个对象。

{% highlight javascript %}

{} === {}
// false

[] === []
// false

(function (){}) === (function (){})
// false

{% endhighlight %}

如果两个变量指向同一个复合类型的值，则它们相等。

{% highlight javascript %}

var v1 = {};
var v2 = v1;

v1 === v2
// true

{% endhighlight %}

（5）如果两个变量的值都是undefined或null，它们是相等的。

{% highlight javascript %}

var v1 = undefined;
var v2 = undefined;

v1 === v2
// true

var v1 = null;
var v2 = null;

v1 === v2
// true

{% endhighlight %}

因为变量声明后默认类型是undefined，因此两个只声明未赋值的变量是相等的。

{% highlight javascript %}

var v1;
var v2;

v1 === v2
// true

{% endhighlight %}

### 布尔运算符

(1) ! 取反运算

以下五个值取反后为true，其他都为false。

- undefined
- null
- false
- 0
- ""

(2) && 且运算

(3) OR 或运算

## 条件语句

### if 结构

{% highlight javascript %}

 if (myvar === 3) {
    // then
 } else {
   // else
 }

{% endhighlight %}

### switch结构

{% highlight javascript %}

    switch (fruit) {
        case "banana":
            // ...
            break;
        case "apple":
            // ...
            break;
        default:
            // ...
    }

{% endhighlight %}

## 循环语句

### while循环

While语句包括一个循环条件，只要该条件为真，就不断循环。

{% highlight javascript %}

while (condition){
	// some code here
}	

{% endhighlight %}

### for循环

for语句分成三步：

- 确定初始值;
- 检查循环条件，只要为真就进行后续操作;
- 后续操作完成，返回上一步，检查循环条件。

它的格式如下：

{% highlight javascript %}

for(初值; 循环条件; 下一步)

{% endhighlight %}

用法：

{% highlight javascript %}

    for (var i=0; i < arr.length; i++) {
        console.log(arr[i]);
    }

{% endhighlight %}

所有for循环，都可以改写成while循环。

{% highlight javascript %}

    var i = 0;

	while (i < arr.length) {
        console.log(arr[i]);
        i++;
    }

{% endhighlight %}

### do...while循环

do...while循环与while循环类似，唯一的区别就是先运行一次循环体，然后判断循环条件。

{% highlight javascript %}

    do {
        // ...
    } while(condition);

{% endhighlight %}

### break语句和continue语句

break用于在循环体中跳出循环，continue用于不再进行本次循环的后续操作，直接进入下一次循环。

## 参考链接

- Dr. Axel Rauschmayer, [A quick overview of JavaScript](http://www.2ality.com/2011/10/javascript-overview.html)
