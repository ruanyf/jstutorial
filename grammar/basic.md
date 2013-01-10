---
title: 语法概述
layout: page
category: grammar
date: 2012-12-14
modifiedOn: 2013-01-04
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

- 如果值的类型是null，返回object。

{% highlight javascript %}

> typeof null
  "object"

{% endhighlight %}

- 如果值的类型是布尔值，返回boolean。

{% highlight javascript %}

> typeof false
  "boolean"

{% endhighlight %}

- 如果值的类型是数值，返回number。

{% highlight javascript %}

> typeof 123
  "number"

{% endhighlight %}

- 如果值的类型是字符串，返回string。

{% highlight javascript %}

> typeof "123"
  "string"

{% endhighlight %}

- 如果值的类型是函数，返回function。

{% highlight javascript %}

> typeof print
  "function"

{% endhighlight %}

- 如果值的类型不属于上面任何一种情况，返回object。

{% highlight javascript %}

typeof window // object

typeof {}; // object

typeof []; // object

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

### 布尔运算符

- ! 取反运算
- && 且运算
- OR 或运算

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

## 严格模式

为了减少Javascript语法上一些不合理、不严谨的地方，ECMAscript 5提出了“严格模式”运行。

将下面的语句放在函数的开始处，函数就将以“严格模式”运行。

{% highlight javascript %}

 "use strict";

{% endhighlight %}

老版本的Javascript解释器，会把这行命令当作一个普通字符串，而忽略它。

## 参考链接

- Dr. Axel Rauschmayer, [A quick overview of JavaScript](http://www.2ality.com/2011/10/javascript-overview.html)

