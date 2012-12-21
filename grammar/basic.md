---
title: 语法概述
layout: page
category: grammar
date: 2012-12-14
modifiedOn: 2012-12-15
---

## typeof 运算符

该运算符返回一个值的类型，可能有以下结果：

- Undefined: undefined

{% highlight javascript %}

> typeof undefined
  "undefined"

{% endhighlight %}

- Null: object

{% highlight javascript %}

> typeof null
  "object"

{% endhighlight %}

- Boolean: boolean

{% highlight javascript %}

> typeof false
  "boolean"

{% endhighlight %}

- Number: number

{% highlight javascript %}

> typeof 123
  "number"

{% endhighlight %}

- String: string

{% highlight javascript %}

> typeof "123"
  "string"

{% endhighlight %}

- Function: function

{% highlight javascript %}

> typeof print
  "function"

{% endhighlight %}

- 其他值： object

{% highlight javascript %}

> typeof window
  "object"

{% endhighlight %}

