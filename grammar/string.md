---
title: 字符串
layout: page
category: grammar
date: 2013-12-31
modifiedOn: 2014-01-05
---

## 概述

### 定义

字符串就是零个或多个排在一起的字符，放在单引号或双引号之中。

```javascript
'abc'
"abc"
```

单引号字符串的内部，可以使用双引号。双引号字符串的内部，可以使用单引号。

```javascript
'key="value"'
"It's a long journey"
```

上面两个都是合法的字符串。

如果要在单引号字符串的内部，使用单引号（或者在双引号字符串的内部，使用双引号），就必须在内部的单引号（或者双引号）前面加上反斜杠，用来转义。

```javascript
'Did she say \'Hello\'?'
// "Did she say 'Hello'?"

"Did she say \"Hello\"?"
// "Did she say "Hello"?"
```

字符串默认只能写在一行内，分成多行将会报错。

```javascript
'a
b
c'
// SyntaxError: Unexpected token ILLEGAL
```

上面代码将一个字符串分成三行，JavaScript就会报错。

如果长字符串必须分成多行，可以在每一行的尾部使用反斜杠。

```javascript
var longString = "Long \
long \
long \
string";

longString
// "Long long long string"
```

上面代码表示，加了反斜杠以后，原来写在一行的字符串，可以分成多行，效果与写在同一行完全一样。注意，反斜杠的后面必须是换行符，而不能有其他字符（比如空格），否则会报错。

连接运算符（`+`）可以连接多个单行字符串，用来模拟多行字符串。

```javascript
var longString = 'Long '
  + 'long '
  + 'long '
  + 'string';
```

另外，有一种利用多行注释，生成多行字符串的变通方法。

```javascript
(function () { /*
line 1
line 2
line 3
*/}).toString().split('\n').slice(1,-1).join('\n')
// "line 1 line 2 line 3"
```

### 转义

反斜杠（`\\`）在字符串内有特殊含义，用来表示一些特殊字符，所以又称为转义符。

需要用反斜杠转义的特殊字符，主要有下面这些：

- `\0` 代表没有内容的字符（\u0000）
- `\b` 后退键（\u0008）
- `\f` 换页符（\u000C）
- `\n` 换行符（\u000A）
- `\r` 回车键（\u000D）
- `\t` 制表符（\u0009）
- `\v` 垂直制表符（\u000B）
- `\'` 单引号（\u0027）
- `\"` 双引号（\u0022）
- `\\\\` 反斜杠（\u005C）
- `\XXX` 用三个八进制数（000到377）表示字符，`XXX`对应该字符的Unicode，比如`\251`表示版权符号。
- `\xXX` 用两个十六进制数（00到FF）表示字符，`XX`对应该字符的Unicode，比如`\xA9`表示版权符号。
- `\uXXXX` 用四位十六进制的Unicode编号代表某个字符，比如`\u00A9`表示版权符号。

下面是最后三种字符的特殊写法的例子。

```javascript
'\251' // "©"
'\xA9' // "©"
'\u00A9' // "©"

'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
```

如果非特殊字符前面使用反斜杠，则反斜杠会被省略。

```javascript
'\a'
// "a"
```

上面代码表示`a`是一个正常字符，前面加反斜杠没有特殊含义，则反斜杠会被自动省略。

如果字符串的正常内容之中，需要包含反斜杠，则反斜杠前需要再加一个反斜杠，用来对自身转义。

```javascript
"Prev \\ Next"
// "Prev \ Next"
```

### 字符串与数组

字符串可以被视为字符数组，因此可以使用数组的方括号运算符，用来返回某个位置的字符（从0开始）。

```javascript
var s = 'hello';

s[0] // "h"
s[1] // "e"
s[4] // "o"

// 也可以直接对字符串使用方括号运算符
'hello'[1] // "e"
```

如果方括号中的数字超过字符串的范围，或者方括号中根本不是数字，则返回`undefined`。

```javascript
'abc'[3] // undefined
'abc'[-1] // undefined
'abc'['x'] // undefined
```

但是，字符串与数组的相似性仅此而已。实际上，无法改变字符串之中的单个字符。

```javascript
var s = 'hello';

delete s[0];
s // "hello"

s[1] = 'a';
s // "hello"

s[5] = '!';
s // "hello"
```

上面代码表示，字符串内部的单个字符无法改变和增删，这些操作会默默地失败。

字符串也无法添加新属性。

```javascript
var s = 'Hello World';
s.x = 123;
s.x // undefined
```

上面代码为字符串`s`添加了一个`x`属性，结果无效，总是返回`undefined`。

上面这些行为的原因是，在JavaScript内部，变量`s`其实指向字符串`Hello World`的地址，而`Hello World`本身是一个常量，所以无法改变它，既不能新增，也不能删除。另一方面，当一个字符串被调用属性时，它会自动转为String对象的实例（参见《标准库》一章），调用结束后，该对象自动销毁。这意味着，下一次调用字符串的属性时，实际是调用一个临时生成的新对象，而不是上一次调用时生成的那个对象，所以取不到赋值在上一个对象的属性。如果想要为字符串添加属性，只有在它的原型对象`String.prototype`上定义（参见《面向对象编程》一章）。

### length属性

`length`属性返回字符串的长度，该属性也是无法改变的。

```javascript
var s = 'hello';
s.length // 5

s.length = 3;
s.length // 5

s.length = 7;
s.length // 5
```

上面代码表示字符串的`length`属性无法改变，但是不会报错。

## 字符集

JavaScript使用Unicode字符集，也就是说在JavaScript内部，所有字符都用Unicode表示。

不仅JavaScript内部使用Unicode储存字符，而且还可以直接在程序中使用Unicode，所有字符都可以写成"\uxxxx"的形式，其中xxxx代表该字符的Unicode编码。比如，`\u00A9`代表版权符号。

```javascript
var s = '\u00A9';
s // "©"
```

每个字符在JavaScript内部都是以16位（即2个字节）的UTF-16格式储存。也就是说，JavaScript的单位字符长度固定为16位长度，即2个字节。

但是，UTF-16有两种长度：对于`U+0000`到`U+FFFF`之间的字符，长度为16位（即2个字节）；对于`U+10000`到`U+10FFFF`之间的字符，长度为32位（即4个字节），而且前两个字节在`0xD800`到`0xDBFF`之间，后两个字节在`0xDC00`到`0xDFFF`之间。举例来说，`U+1D306`对应的字符为𝌆，它写成UTF-16就是`0xD834 0xDF06`。浏览器会正确将这四个字节识别为一个字符，但是JavaScript内部的字符长度总是固定为16位，会把这四个字节视为两个字符。

```javascript
var s = '\uD834\uDF06';

s // "𝌆"
s.length // 2
/^.$/.test(s) // false
s.charAt(0) // ""
s.charAt(1) // ""
s.charCodeAt(0) // 55348
s.charCodeAt(1) // 57094
```

上面代码说明，对于于`U+10000`到`U+10FFFF`之间的字符，JavaScript总是视为两个字符（字符的`length`属性为2），用来匹配单个字符的正则表达式会失败（JavaScript认为这里不止一个字符），`charAt`方法无法返回单个字符，`charCodeAt`方法返回每个字节对应的十进制值。

所以处理的时候，必须把这一点考虑在内。对于4个字节的Unicode字符，假定`C`是字符的Unicode编号，`H`是前两个字节，`L`是后两个字节，则它们之间的换算关系如下。

```javascript
// 将大于U+FFFF的字符，从Unicode转为UTF-16
H = Math.floor((C - 0x10000) / 0x400) + 0xD800
L = (C - 0x10000) % 0x400 + 0xDC00

// 将大于U+FFFF的字符，从UTF-16转为Unicode
C = (H - 0xD800) * 0x400 + L - 0xDC00 + 0x10000
```

下面的正则表达式可以识别所有UTF-16字符。

```javascript
([\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])
```

由于JavaScript引擎（严格说是ES5规格）不能自动识别辅助平面（编号大于0xFFFF）的Unicode字符，导致所有字符串处理函数遇到这类字符，都会产生错误的结果（详见《标准库》一章的`String`对象章节）。如果要完成字符串相关操作，就必须判断字符是否落在`0xD800`到`0xDFFF`这个区间。

下面是能够正确处理字符串遍历的函数。

```javascript
function getSymbols(string) {
  var length = string.length;
  var index = -1;
  var output = [];
  var character;
  var charCode;
  while (++index < length) {
    character = string.charAt(index);
    charCode = character.charCodeAt(0);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      output.push(character + string.charAt(++index));
    } else {
      output.push(character);
    }
  }
  return output;
}

var symbols = getSymbols('𝌆');

symbols.forEach(function(symbol) {
  // ...
});
```

替换（`String.prototype.replace`）、截取子字符串（`String.prototype.substring`, `String.prototype.slice`）等其他字符串操作，都必须做类似的处理。

## Base64转码

Base64是一种编码方法，可以将任意字符转成可打印字符。使用这种编码方法，主要不是为了加密，而是为了不出现特殊字符，简化程序的处理。

JavaScript原生提供两个Base64相关方法。

- btoa()：字符串或二进制值转为Base64编码
- atob()：Base64编码转为原来的编码

```javascript
var string = 'Hello World!';
btoa(string) // "SGVsbG8gV29ybGQh"
atob('SGVsbG8gV29ybGQh') // "Hello World!"
```

这两个方法不适合非ASCII码的字符，会报错。

```javascript
btoa('你好')
// Uncaught DOMException: The string to be encoded contains characters outside of the Latin1 range.
```

要将非ASCII码字符转为Base64编码，必须中间插入一个转码环节，再使用这两个方法。

```javascript
function b64Encode( str ) {
  return btoa(unescape(encodeURIComponent( str )));
}

function b64Decode( str ) {
  return decodeURIComponent(escape(atob( str )));
}

b64Encode('你好') // "5L2g5aW9"
b64Decode('5L2g5aW9') // "你好"
```

## 参考链接

- Mathias Bynens, [JavaScript’s internal character encoding: UCS-2 or UTF-16?](http://mathiasbynens.be/notes/javascript-encoding)
- Mathias Bynens, [JavaScript has a Unicode problem](http://mathiasbynens.be/notes/javascript-unicode)
- Mozilla Developer Network, [Window.btoa](https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa)
