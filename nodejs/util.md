# util

`util`是 Node 提供的内置对象，提供一些常用的帮助函数。

## util.promisify()

Node 8 提供了`util.promisify`方法，用于将那些接受回调函数的函数，转变为 Promise。

举例来说，`fs.readFile()`是一个接受回调函数的方法，用法如下。

```javascript
fs.readFile('path/to/file', 'utf8', (err, data) => {
  // ...
});
```

上面代码中，`fs.readFile`的第一个参数`path/to/file`和第二个参数`utf8`是运行所需要的，第三个参数是一个回调函数。该函数的参数符合 Node 的惯例，分别是运行中的错误`err`和运行结果`data`。

`util.promisify`可以将这个方法转为 Promise。转化后的参数就是`fs.readFile`的前两个参数。一旦 Promise 成功，就会传回`data`，否则传回`err`。

```javascript
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

const filePath = process.argv[2];

readFileAsync(filePath, 'utf8')
.then((text) => {
  console.log('CONTENT:', text);
})
.catch((err) => {
  console.log('ERROR:', err);
});
```

将上面的代码存为`echo.js`，用法如下。

```bash
$ node echo.js echo.js
CONTENT: const {promisify} = require('util');
···

$ node echo.js unknown.txt
ERROR: { Error: ENOENT: no such file or directory, ··· }
```

由于`util.promisify`返回的函数，执行后会返回 Promise，所以可以用于`async...await`语法。

```javascript
async function main() {
  try {
    const text = await readFileAsync(filePath, {encoding: 'utf8'});
    console.log('CONTENT:', text);
  } catch (err) {
    console.log('ERROR:', err);
  }
}

main();
```

有些异步方法会向回调函数提供多于一个的参数，比如`dns.lookup()`。

```javascript
dns.lookup('nodejs.org', function (err, address, family) {
  // ...
});
```

上面代码中，`dns.lookup`的第二个参数是一个回调函数，它接受三个参数：`err`、`address`、`family`。

`util.promisify`转变`dns.lookup`后，Promise 只会接收一个对象，`address`和`family`都会变成这个对象的参数。

```javascript
const util = require('util');
const dns = require('dns');
const lookupAsync = util.promisify(dns.lookup);

lookupAsync('nodejs.org')
  .then(obj => console.log(obj));
  // { address: '104.20.23.46', family: 4 }
```

如果一个函数具有`util.promisify.custom`属性，那么`util.promisify`会返回该属性指向的函数。

```javascript
const util = require('util');

function foo() {
  return 'abc';
}

async function fooAsync() {
  return 'abc';
}

foo[util.promisify.custom] = fooAsync;

util.promisify(foo) === fooAsync // true
```

上面代码中，`foo`函数的`util.promisify.custom`属性指向`fooAsync`，所以`util.promisify(foo)`会返回`fooAsync`。

目前，有两个内置函数部署了`util.promisify.custom`属性。

- `setImmediate[util.promisify.custom]`
- `setTimeout[util.promisify.custom]`

之所以是这两个函数，因为它们的回调函数位置是不规则的，都是参数列表的第一位。

```javascript
setImmediate(callback, ...args);
setTimeout(callback, delay, ...args);
```

`util.promisify`封装它们的例子如下。

```javascript
const {promisify} = require('util');
const delay = promisify(setTimeout);
delay(3000).then(() => console.log('done'));
```

## 参考链接

- [Node.js 8: util.promisify()](http://2ality.com/2017/05/util-promisify.html), by Axel Rauschmayer

