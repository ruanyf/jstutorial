---
title: querystring 模块
layout: page
category: nodejs
data: 2015-06-06
modifiedOn: 2015-06-06
---

`querystring`模块主要用来解析查询字符串。

## querystring.parse()

`querystring.parse()`方法用于将一个查询字符串解析为 JavaScript 对象。

```javascript
var str = 'foo=bar&abc=xyz&abc=123';

querystring.parse(str)
// { foo: 'bar', abc: [ 'xyz', '123' ] }
```

`parse`方法一共可以接受四个参数。

```javascript
querystring.parse(str[, sep[, eq[, options]]])
```

- `str`：需要解析的查询字符串
- `sep`：多个键值对之间的分隔符，默认为`&`
- `eq`：键名与键值之间的分隔符，默认为`=`
- `options`：配置对象，它有两个属性，`decodeURIComponent`属性是一个函数，用来将编码后的字符串还原，默认是`querystring.unescape()`，`maxKeys`属性指定最多解析多少个属性，默认是`1000`，如果设为`0`就表示不限制属性的最大数量。

前面的例子省略了后面三个参数，完整的调用形式如下。

```javascript
querystring.parse(
  'w=%D6%D0%CE%C4&foo=bar',
  null,
  null,
  { decodeURIComponent: gbkDecodeURIComponent }
)
```

`parse`方法也可以用来解析一般的字符串。

```javascript
var str = 'name:Sophie;shape:fox;condition:new';

querystring.parse(str, ';', ':')
// {
//   name: 'Sophie',
//   shape: 'fox',
//   condition: 'new',
// }
```
