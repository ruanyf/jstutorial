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
'key = "value"'
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

由于HTML语言的属性值使用双引号，所以很多项目约定JavaScript语言的字符串只使用单引号，本教程就遵守这个约定。当然，只使用双引号也完全可以。重要的是，坚持使用一种风格，不要两种风格混合。

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

上面代码表示，加了反斜杠以后，原来写在一行的字符串，可以分成多行书写。但是，输出的时候还是单行，效果与写在同一行完全一样。注意，反斜杠的后面必须是换行符，而不能有其他字符（比如空格），否则会报错。

连接运算符（`+`）可以连接多个单行字符串，将长字符串拆成多行书写，输出的时候也是单行。

```javascript
var longString = 'Long '
  + 'long '
  + 'long '
  + 'string';
```

如果想输出多行字符串，有一种利用多行注释的变通方法。

```javascript
(function () { /*
line 1
line 2
line 3
*/}).toString().split('\n').slice(1, -1).join('\n')
// "line 1
// line 2
// line 3"
```

上面的例子中，输出的字符串就是多行。

### 转义

反斜杠（\）在字符串内有特殊含义，用来表示一些特殊字符，所以又称为转义符。

需要用反斜杠转义的特殊字符，主要有下面这些：

- `\0` null（\u0000）
- `\b` 后退键（\u0008）
- `\f` 换页符（\u000C）
- `\n` 换行符（\u000A）
- `\r` 回车键（\u000D）
- `\t` 制表符（\u0009）
- `\v` 垂直制表符（\u000B）
- `\'` 单引号（\u0027）
- `\"` 双引号（\u0022）
- \\ 反斜杠（\u005C）

上面这些字符前面加上反斜杠，都表示特殊含义。

```javascript
console.log('1\n2')
// 1
// 2
```

上面代码中，`\n`表示换行，输出的时候就分成了两行。

反斜杠还有三种特殊用法。

（1）`\HHH`

反斜杠后面紧跟三个八进制数（`000`到`377`），代表一个字符。`HHH`对应该字符的Unicode码点，比如`\251`表示版权符号。显然，这种方法只能输出256种字符。

（2）`\xHH`

`\x`后面紧跟两个十六进制数（`00`到`FF`），代表一个字符。`HH`对应该字符的Unicode码点，比如`\xA9`表示版权符号。这种方法也只能输出256种字符。

（3）`\uXXXX`

`\u`后面紧跟四个十六进制数（`0000`到`FFFF`），代表一个字符。`HHHH`对应该字符的Unicode码点，比如`\u00A9`表示版权符号。

下面是这三种字符特殊写法的例子。

```javascript
'\251' // "©"
'\xA9' // "©"
'\u00A9' // "©"

'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
```

如果在非特殊字符前面使用反斜杠，则反斜杠会被省略。

```javascript
'\a'
// "a"
```

上面代码中，`a`是一个正常字符，前面加反斜杠没有特殊含义，反斜杠会被自动省略。

如果字符串的正常内容之中，需要包含反斜杠，则反斜杠前面需要再加一个反斜杠，用来对自身转义。

```javascript
"Prev \\ Next"
// "Prev \ Next"
```

### 字符串与数组

字符串可以被视为字符数组，因此可以使用数组的方括号运算符，用来返回某个位置的字符（位置编号从0开始）。

```javascript
var s = 'hello';
s[0] // "h"
s[1] // "e"
s[4] // "o"

// 直接对字符串使用方括号运算符
'hello'[1] // "e"
```

如果方括号中的数字超过字符串的长度，或者方括号中根本不是数字，则返回`undefined`。

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

字符串也无法直接使用数组的方法，必须通过`call`方法间接使用。

```javascript
var s = 'hello';

s.join(' ') // TypeError: s.join is not a function

Array.prototype.join.call(s, ' ') // "h e l l o"
```

上面代码中，如果直接对字符串使用数组的`join`方法，会报错不存在该方法。但是，可以通过`call`方法，间接对字符串使用`join`方法。

不过，由于字符串是只读的，那些会改变原数组的方法，比如`push()`、`sort()`、`reverse()`、`splice()`都对字符串无效，只有将字符串显式转为数组后才能使用，参见《标准库》一章的数组部分。

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

JavaScript使用Unicode字符集。也就是说，在JavaScript引擎内部，所有字符都用Unicode表示。

JavaScript不仅以Unicode储存字符，还允许直接在程序中使用Unicode编号表示字符，即将字符写成`\uxxxx`的形式，其中`xxxx`代表该字符的Unicode编码。比如，`\u00A9`代表版权符号。

```javascript
var s = '\u00A9';
s // "©"
```

解析代码的时候，JavaScript会自动识别一个字符是字面形式表示，还是Unicode形式表示。输出给用户的时候，所有字符都会转成字面形式。

```javascript
var f\u006F\u006F = 'abc';
foo // "abc"
```

上面代码中，第一行的变量名`foo`是Unicode形式表示，第二行是字面形式表示。JavaScript会自动识别。

我们还需要知道，每个字符在JavaScript内部都是以16位（即2个字节）的UTF-16格式储存。也就是说，JavaScript的单位字符长度固定为16位长度，即2个字节。

但是，UTF-16有两种长度：对于`U+0000`到`U+FFFF`之间的字符，长度为16位（即2个字节）；对于`U+10000`到`U+10FFFF`之间的字符，长度为32位（即4个字节），而且前两个字节在`0xD800`到`0xDBFF`之间，后两个字节在`0xDC00`到`0xDFFF`之间。举例来说，`U+1D306`对应的字符为`𝌆，`它写成UTF-16就是`0xD834 0xDF06`。浏览器会正确将这四个字节识别为一个字符，但是JavaScript内部的字符长度总是固定为16位，会把这四个字节视为两个字符。

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
function b64Encode(str) {
  return btoa(encodeURIComponent(str));
}

function b64Decode(str) {
  return decodeURIComponent(atob(str));
}

b64Encode('你好') // "JUU0JUJEJUEwJUU1JUE1JUJE"
b64Decode('JUU0JUJEJUEwJUU1JUE1JUJE') // "你好"
```

## 参考链接

- Mathias Bynens, [JavaScript’s internal character encoding: UCS-2 or UTF-16?](http://mathiasbynens.be/notes/javascript-encoding)
- Mathias Bynens, [JavaScript has a Unicode problem](http://mathiasbynens.be/notes/javascript-unicode)
- Mozilla Developer Network, [Window.btoa](https://developer.mozilla.org/en-US/docs/Web/API/Window.btoa)
