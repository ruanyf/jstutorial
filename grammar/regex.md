---
title: Regex对象
layout: page
category: grammar
date: 2013-01-17
modifiedOn: 2013-01-17
---

## 正则表达式的规则

- [] 表示任选其中一个字符
- () 表示模式的分组
- | 表示任选一个模式

{% highlight javascript %}

/(cat|sat|mat)/

{% endhighlight %}

- {} 表示模式的重复

{% highlight javascript %}

/lo{2}k/

/lo{2,5}k/

{% endhighlight %}

- \- 表示范围，比如a-z，0-9，A-Z。
- ^ 不在[]内时，表示一行的起首；在[]内时，表示其中的字符一个都不出现。
- $ 表示一行的行尾。
- . 表示除换行符以外的所有字符。
- \? 表示出现1次或0次，等同于{0, 1}。
- \* 表示出现0次或多次，等同于 {0,}。
- + 表示出现1次或多次，等同于 {1,}。

### 修饰符

修饰符（modifier）表示模式的附加规则，放在最尾部。

- i 表示忽略大小写。
- m 表示多行模式，^和$会忽略换行符。
- s 表示单行模式，.匹配任意字符，包括换行符在内。

### 预定义模式

预定义模式指的是某些常见模式的简写方式。

- \w 匹配任意的字母、数字和下划线。
- \s 匹配制表符、空格符和断行符。
- \d 匹配任意数字0-9。

### 转义符

转义符（/）表示后面的字符不具有特殊含义。

{% highlight javascript %}

/\$([a-z]+)/

{% endhighlight %}

## test方法

Regex.test(Sting)用来验证字符串是否符合某个模式，返回true或false。

{% highlight javascript %}

var s = 'The cat sat on the mat.';

if(/cat/.test(s)){
    alert('We found a cat!');
} 

{% endhighlight %}
