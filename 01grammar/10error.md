---
title: 错误处理机制
layout: page
category: grammar
date: 2013-08-30
modifiedOn: 2013-12-07
---

## Error对象

JavaScript解析或执行时，一旦发生错误，引擎就会抛出一个错误对象。JavaScript原生提供一个`Error`构造函数，所有抛出的错误都是这个构造函数的实例。

```javascript
var err = new Error('出错了');
err.message // "出错了"
```

上面代码中，我们调用`Error`构造函数，生成一个`err`实例。

`Error`构造函数接受一个参数，表示错误提示，可以从实例的`message`属性读到这个参数。

代码解析或运行时发生错误，JavaScript引擎就会自动产生、并抛出一个`Error`对象的实例，然后整个程序就中断在发生错误的地方，不再往下执行。

根据语言标准，`Error`对象的实例必须有`message`属性，表示出错时的提示信息，其他属性则没有提及。大多数JavaScript引擎，对`Error`实例还提供`name`和`stack`属性，分别表示错误的名称和错误的堆栈，但它们是非标准的，不是每种实现都有。

- **message**：错误提示信息
- **name**：错误名称（非标准属性）
- **stack**：错误的堆栈（非标准属性）

利用`name`和`message`这两个属性，可以对发生什么错误有一个大概的了解。

```javascript
if (error.name){
  console.log(error.name + ": " + error.message);
}
```

上面代码表示，显示错误的名称以及出错提示信息。

`stack`属性用来查看错误发生时的堆栈。

```javascript
function throwit() {
  throw new Error('');
}

function catchit() {
  try {
    throwit();
  } catch(e) {
    console.log(e.stack); // print stack trace
  }
}

catchit()
// Error
//    at throwit (~/examples/throwcatch.js:9:11)
//    at catchit (~/examples/throwcatch.js:3:9)
//    at repl:1:5
```

上面代码显示，抛出错误首先是在`throwit`函数，然后是在`catchit`函数，最后是在函数的运行环境中。

## JavaScript的原生错误类型

Error对象是最一般的错误类型，在它的基础上，JavaScript还定义了其他6种错误，也就是说，存在Error的6个派生对象。

**（1）SyntaxError**

`SyntaxError`是解析代码时发生的语法错误。

```javascript
// 变量名错误
var 1a;

// 缺少括号
console.log 'hello');
```

**（2）ReferenceError**

`ReferenceError`是引用一个不存在的变量时发生的错误。

```javascript
unknownVariable
// ReferenceError: unknownVariable is not defined
```

另一种触发场景是，将一个值分配给无法分配的对象，比如对函数的运行结果或者this赋值。

```javascript
console.log() = 1
// ReferenceError: Invalid left-hand side in assignment

this = 1
// ReferenceError: Invalid left-hand side in assignment
```

上面代码对函数console.log的运行结果和this赋值，结果都引发了ReferenceError错误。

**（3）RangeError**

`RangeError`是当一个值超出有效范围时发生的错误。主要有几种情况，一是数组长度为负数，二是Number对象的方法参数超出范围，以及函数堆栈超过最大值。

```javascript
new Array(-1)
// RangeError: Invalid array length

(1234).toExponential(21)
// RangeError: toExponential() argument must be between 0 and 20 
```

**（4）TypeError**

`TypeError`是变量或参数不是预期类型时发生的错误。比如，对字符串、布尔值、数值等原始类型的值使用`new`命令，就会抛出这种错误，因为`new`命令的参数应该是一个构造函数。

```javascript
new 123
//TypeError: number is not a func

var obj = {};
obj.unknownMethod()
// TypeError: obj.unknownMethod is not a function 
```

上面代码的第二种情况，调用对象不存在的方法，会抛出TypeError错误。

**（5）URIError**

`URIError`是URI相关函数的参数不正确时抛出的错误，主要涉及`encodeURI()`、`decodeURI()`、`encodeURIComponent()`、`decodeURIComponent()`、`escape()`和`unescape()`这六个函数。

```javascript
decodeURI('%2')
// URIError: URI malformed
```

**（6）EvalError**

`eval`函数没有被正确执行时，会抛出`EvalError`错误。该错误类型已经不再在ES5中出现了，只是为了保证与以前代码兼容，才继续保留。

以上这6种派生错误，连同原始的Error对象，都是构造函数。开发者可以使用它们，人为生成错误对象的实例。

```javascript
new Error('出错了！');
new RangeError('出错了，变量超出有效范围！');
new TypeError('出错了，变量类型无效！');
```

上面代码新建错误对象的实例，实质就是手动抛出错误。可以看到，错误对象的构造函数接受一个参数，代表错误提示信息（message）。

## 自定义错误

除了JavaScript内建的7种错误对象，还可以定义自己的错误对象。

{% highlight javascript %}

function UserError(message) {
   this.message = message || "默认信息";
   this.name = "UserError";
}

UserError.prototype = new Error();
UserError.prototype.constructor = UserError;

{% endhighlight %}

上面代码自定义一个错误对象UserError，让它继承Error对象。然后，就可以生成这种自定义的错误了。

{% highlight javascript %}

new UserError("这是自定义的错误！");

{% endhighlight %}

## throw语句

`throw`语句的作用是中断程序执行，抛出一个意外或错误。它接受一个表达式作为参数，可以抛出各种值。

```javascript
// 抛出一个字符串
throw "Error！";

// 抛出一个数值
throw 42;

// 抛出一个布尔值
throw true;

// 抛出一个对象
throw {toString: function() { return "Error!"; } };
```

上面代码表示，`throw`可以接受各种值作为参数。JavaScript引擎一旦遇到`throw`语句，就会停止执行后面的语句，并将`throw`语句的参数值，返回给用户。

如果只是简单的错误，返回一条出错信息就可以了，但是如果遇到复杂的情况，就需要在出错以后进一步处理。这时最好的做法是使用`throw`语句手动抛出一个`Error`对象。

```javascript
throw new Error('出错了!');
```

上面语句新建一个`Error`对象，然后将这个对象抛出，整个程序就会中断在这个地方。

`throw`语句还可以抛出用户自定义的错误。

```javascript
function UserError(message) {
  this.message = message || "默认信息";
  this.name = "UserError";
}

UserError.prototype.toString = function (){
  return this.name + ': "' + this.message + '"';
}

throw new UserError("出错了！");
```

可以通过自定义一个`assert`函数，规范化`throw`抛出的信息。

```javascript
function assert(expression, message) {
  if (!expression)
    throw {name: 'Assertion Exception', message: message};
}
```

上面代码定义了一个`assert`函数，它接受一个表达式和一个字符串作为参数。一旦表达式不为真，就抛出指定的字符串。它的用法如下。

```javascript
assert(typeof myVar != 'undefined', 'myVar is undefined!');
```

`console`对象的`assert`方法，与上面函数的工作机制一模一样，所以可以直接使用。

```javascript
console.assert(typeof myVar != 'undefined', 'myVar is undefined!');
```

## try...catch结构

为了对错误进行处理，需要使用`try...catch`结构。

```javascript
try {
  throw new Error('出错了!');
} catch (e) {
  console.log(e.name + ": " + e.message);
  console.log(e.stack);
}
// Error: 出错了!
//   at <anonymous>:3:9
//   ...
```

上面代码中，`try`代码块一抛出错误（上例用的是`throw`语句），JavaScript引擎就立即把代码的执行，转到`catch`代码块。可以看作，错误可以被`catch`代码块捕获。`catch`接受一个参数，表示`try`代码块抛出的值。

```javascript
function throwIt(exception) {
  try {
    throw exception;
  } catch (e) {
    console.log('Caught: '+ e);
  }
}

throwIt(3);
// Caught: 3
throwIt('hello');
// Caught: hello
throwIt(new Error('An error happened'));
// Caught: Error: An error happened
```

上面代码中，`throw`语句先后抛出数值、字符串和错误对象。

`catch`代码块捕获错误之后，程序不会中断，会按照正常流程继续执行下去。

```javascript
try {
  throw "出错了";
} catch (e) {
  console.log(111);
}
console.log(222);
// 111
// 222
```

上面代码中，`try`代码块抛出的错误，被`catch`代码块捕获后，程序会继续向下执行。

`catch`代码块之中，还可以再抛出错误，甚至使用嵌套的`try...catch`结构。

```javascript
var n = 100;

try {
  throw n;
} catch (e) {
  if (e <= 50) {
    // ...
  } else {
    throw e;
  }
}
```

上面代码中，`catch`代码之中又抛出了一个错误。

为了捕捉不同类型的错误，`catch`代码块之中可以加入判断语句。

```javascript
try {
  foo.bar();
} catch (e) {
  if (e instanceof EvalError) {
    console.log(e.name + ": " + e.message);
  } else if (e instanceof RangeError) {
    console.log(e.name + ": " + e.message);
  }
  // ...
}
```

上面代码中，`catch`捕获错误之后，会判断错误类型（`EvalError`还是`RangeError`），进行不同的处理。

`try...catch`结构是JavaScript语言受到Java语言影响的一个明显的例子。这种结构多多少少是对结构化编程原则一种破坏，处理不当就会变成类似`goto`语句的效果，应该谨慎使用。

## finally代码块

`try...catch`结构允许在最后添加一个`finally`代码块，表示不管是否出现错误，都必需在最后运行的语句。

```javascript
function cleansUp() {
  try {
    throw new Error('出错了……');
    console.log('此行不会执行');
  } finally {
    console.log('完成清理工作');
  }
}

cleansUp()
// 完成清理工作
// Error: 出错了……
```

上面代码中，由于没有`catch`语句块，所以错误没有捕获。执行`finally`代码块以后，程序就中断在错误抛出的地方。

```javascript
function idle(x) {
  try {
    console.log(x);
    return 'result';
  } finally {
    console.log("FINALLY");
  }
}

idle('hello')
// hello
// FINALLY
// "result"
```

上面代码说明，即使有`return`语句在前，`finally`代码块依然会得到执行，且在其执行完毕后，才会显示`return`语句的值。

下面的例子说明，`return`语句的执行是排在`finally`代码之前，只是等`finally`代码执行完毕后才返回。

```javascript
var count = 0;
function countUp() {
  try {
    return count;
  } finally {
    count++;
  }
}

countUp()
// 0
count
// 1
```

上面代码说明，`return`语句的`count`的值，是在`finally`代码块运行之前，就获取完成了。

下面是`finally`代码块用法的典型场景。

```javascript
openFile();

try {
  writeFile(Data);
} catch(e) {
  handleError(e);
} finally {
  closeFile();
}
```

上面代码首先打开一个文件，然后在`try`代码块中写入文件，如果没有发生错误，则运行`finally`代码块关闭文件；一旦发生错误，则先使用`catch`代码块处理错误，再使用`finally`代码块关闭文件。

下面的例子充分反映了`try...catch...finally`这三者之间的执行顺序。

```javascript
function f() {
  try {
    console.log(0);
    throw 'bug';
  } catch(e) {
    console.log(1);
    return true; // 这句原本会延迟到finally代码块结束再执行
    console.log(2); // 不会运行
  } finally {
    console.log(3);
    return false; // 这句会覆盖掉前面那句return
    console.log(4); // 不会运行
  }

  console.log(5); // 不会运行
}

var result = f();
// 0
// 1
// 3

result
// false
```

上面代码中，`catch`代码块结束执行之前，会先执行`finally`代码块。从`catch`转入`finally`的标志，不仅有`return`语句，还有`throw`语句。

```javascript
function f() {
  try {
    throw '出错了！';
  } catch(e) {
    console.log('捕捉到内部错误');
    throw e; // 这句原本会等到finally结束再执行
  } finally {
    return false; // 直接返回
  }
}

try {
  f();
} catch(e) {
  // 此处不会执行
  console.log('caught outer "bogus"');
}

//  捕捉到内部错误
```

上面代码中，进入`catch`代码块之后，一遇到`throw`语句，就会去执行`finally`代码块，其中有`return false`语句，因此就直接返回了，不再会回去执行`catch`代码块剩下的部分了。

## 参考连接

- Jani Hartikainen, [JavaScript Errors and How to Fix Them](http://davidwalsh.name/fix-javascript-errors)
