---
title: JSON格式
layout: page
category: grammar
date: 2013-01-11
modifiedOn: 2013-01-11
---

## JSON对象

ECMAScript第五版新增了JSON对象，用来处理JSON格式数据。

## JSON.stringify()

该方法用于将对象转为JSON字符串。

{% highlight javascript %}

var str = JSON.stringify({ name: "张三" });

str
// {"name":"张三"}

{% endhighlight %}

该方法还可以接受一个数组参数，表示需要转化的属性。

{% highlight javascript %}

var str = JSON.stringify({ a:1, b:2 }, ['a']);

str
// "{"a":1}"

{% endhighlight %}

该方法还可以接受一个过滤函数作为参数，只有经过该函数返回的值，才会被转成字符串。如果返回undefined或没有返回值，则对应属性会被忽略。

这里需要注意的是，如果某个属性的值是一个对象，则会展开这个对象，先处理它的属性，然后再处理顶层对象的属性。另外一个特殊之处是，最后一个过滤的键是空键，对应的值就是整个处理后的字符串，实际上需要返回的就是这个字符串。

{% highlight javascript %}

function f(key, value) {

  if ( key === ""){
	  return value;
  }
	
  if ( key === "a" ) {
    return value + 10;
  }
}

var str = JSON.stringify({ a:1, b:2 }, f);

str
// "{"a":11}"

{% endhighlight %}

JSON.stringify还可以接受第三个参数，表示添加空格或制表符。

{% highlight javascript %}

var str = JSON.stringify({ name: "张三" }, null, 2);

str
// {
//   "name": "John"
// }

var str = JSON.stringify({ name: "John" }, null, "\t");

str
// {\n\t"name": "John"\n}

{% endhighlight %}

### JSON.parse()

该方法用于将JSON字符串转化成对象。

{% highlight javascript %}

JSON.parse('{}'); // {}
JSON.parse('true'); // true
JSON.parse('"foo"'); // "foo"
JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
JSON.parse('null'); // null

var o = JSON.parse('{"name":"张三"}');

o.name
// 张三

{% endhighlight %}

如果传入的字符串不是有效的JSON格式，JSON.parse将报错。

该方法可以接受一个过滤函数，用法与JSON.stringify类似。

{% highlight javascript %}

function f(key, value) {

  if ( key === ""){
	  return value;
  }
	
  if ( key === "a" ) {
    return value + 10;
  }
}

var o = JSON.parse('{"a":1,"b":2}', f);

o.a
// 11

o.b
// undefined

{% endhighlight %}

## 参考链接

- MDN, [JSON.parse](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/parse)
