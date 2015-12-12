# repl模块

## 概述

`repl`模块用于在程序内提供REPL在线环境。

```javascript
var repl = require('repl');
function a(i) {
  var context = repl.start('repl> ').context;
  context.pi  = 3.14;
  context.arg = i;
}
a(3)

// repl> pi
// 3.14
// repl> arg
// 3
// repl>
```

上面代码通过`repl.start`方法，启动REPL环境。`repl.start`方法还可以通过参数，定制提示符。REPL实例对象的`context`对象的属性，可以在REPL环境内读取。
