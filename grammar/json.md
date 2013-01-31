---
title: JSON格式
layout: page
category: grammar
date: 2013-01-11
modifiedOn: 2013-01-31
---

## 格式规定

JSON格式（JavaScript Object Notation的缩写）是一种用于数据交换的文本格式，2001年由Douglas Crockford提出，目的是取代繁琐笨重的XML格式。

相比XML格式，JSON格式有两个显著的优点：书写简单，一目了然；符合JavaScript原生语法，可以由解释器直接处理，不用另外添加代码。所以，JSON迅速被接收，已经各大网站交换数据的标准格式，并被ECMAScript第五版接受，成为标准的一部分。

JSON格式的语法规定有如下几点：

- 每个成员的值，可以是简单值，也可以是复合值。
- 简单值分为四种：字符串、数值、布尔值和null。
- 复合值分为两种：符合JSON格式的对象、符合JSON格式的数组。
- 字符串必须使用双引号，不能使用单引号。
- 属性名也必须使用双引号。

## JSON对象

ECMAScript第五版新增了JSON对象，用来处理JSON格式数据。

### JSON.stringify()

该方法用于将对象转为JSON字符串。

{% highlight javascript %}

JSON.stringify("abc");
// ""abc""

JSON.stringify({ name: "张三" });
// {"name":"张三"}

{% endhighlight %}

如果一个值是undefined、函数或XML对象，这个值会被省略，除非该值是数组的成员，则返回null。

{% highlight javascript %}

JSON.stringify({
    f: function() { },
    a: [ function() {}, undefined ]
});
// "{"a":[null,null]}"

{% endhighlight %}

该方法还可以接受一个数组参数，表示需要转化的属性。

{% highlight javascript %}

JSON.stringify({ a:1, b:2 }, ['a']);
// "{"a":1}"

{% endhighlight %}

该方法还可以接受一个函数作为参数，用来更改默认的串行化的行为。

{% highlight javascript %}

function f(key, value) {
        if (typeof value === "number") {
            value = 2 * value;
        }
        return value;
    }

JSON.stringify({ a:1, b:2 }, f)
// "{"a":2,"b":4}"

{% endhighlight %}

上面代码中的f函数，接受两个参数，分别是被转化对象的键和值。这里需要特别注意的是，被处理的除了原有的键，还会新增一个空白的键，对应整个被转化的对象，所以处理之前，必需对键或值做一个判断。

{% highlight javascript %}

function f(key, value) {
        console.log("["+ key +"]:" + value);
		return value;
    }

JSON.stringify({ a:1, b:2 }, f)
// []:[object Object]
// [a]:1
// [b]:2
// "{"a":1,"b":2}"

{% endhighlight %}

如果经过处理，某个属性返回undefined或没有返回值，则该属性会被忽略。

{% highlight javascript %}

function f(key, value) {
  if (typeof(value) == "string") {
    return undefined;
  }
  return value;
}

JSON.stringify({ a:"abc", b:123 }, f)
// "{"b":123}"

{% endhighlight %}

这里需要注意的是，如果某个属性的值是一个对象，则会展开这个对象，先处理它的内部属性。另外，前面说过，有一个键是空键，对应整个被转化的对象。最后真正进行串行化的，实际上就是空键对应的那个值，其他的键都是用来帮助空键完成那个值。

{% highlight javascript %}

function f(key, value) {

  if ( key === ""){
	  return value;
  }
	
  if ( key === "a" ) {
    return value + 10;
  }
}

JSON.stringify({ a:1, b:2 }, f)
// "{"a":11}"

{% endhighlight %}

JSON.stringify还可以接受第三个参数，用于增加返回的JSON字符串的可读性。如果是数字，表示每个属性前面添加的空格（最多不超过10个）；如果是字符串（不超过10个字符），则该字符串会添加在每行前面。

{% highlight javascript %}

JSON.stringify({ p1:1, p2:2 }, null, 2);
// "{
  "p1": 1,
  "p2": 2
}"

JSON.stringify({ p1:1, p2:2 }, null, "|-");
// "{
|-"p1": 1,
|-"p2": 2
}"

{% endhighlight %}

如果JSON.stringify处理的对象，包含一个toJSON方法，则它会使用这个方法得到一个值，然后再转成字符串。

{% highlight javascript %}

JSON.stringify({ toJSON: function() { return "Cool" } })
// ""Cool""

{% endhighlight %}

Date对象本身就部署了toJSON方法。

{% highlight javascript %}

JSON.stringify(new Date("2011-07-29"))
// ""2011-07-29T00:00:00.000Z""

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

{% highlight javascript %}

JSON.parse("'String'") // illegal single quotes
// SyntaxError: Unexpected token ILLEGAL

JSON.parse('"String"')
// "String"

{% endhighlight %}

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

- MDN, [Using native JSON](https://developer.mozilla.org/en-US/docs/Using_native_JSON)
- MDN, [JSON.parse](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/parse)
- Dr. Axel Rauschmayer, [JavaScript’s JSON API](http://www.2ality.com/2011/08/json-api.html)
- Jim Cowart, [What You Might Not Know About JSON.stringify()](http://freshbrewedcode.com/jimcowart/2013/01/29/what-you-might-not-know-about-json-stringify/)
