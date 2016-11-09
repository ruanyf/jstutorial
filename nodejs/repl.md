# repl

## REPL 环境

REPL 环境是一个互动式的 Node 命令解释环境。用户从键盘输入命令，立刻就能得到执行结果。

直接执行 node 命令，就能进入 REPL 环境。

```bash
$ node
>
```

大于号（`>`）是 REPL 环境的提示符。如果想退出，在行首按下 Ctrl + D 即可。

REPL 环境的一个特点是自动加载 Node 的所有内置模块。举例来说，如果要执行`require('os').arch()`，可以直接输入`os.arch()`。

REPL 环境执行的所有命令，都保存在`~/.node_repl_history`文件之中。如果环境变量`NODE_REPL_HISTORY`设为空字符串，就会停止写入这个文件。

### _ 变量

`-`变量保存的是上一个表达式的执行结果。

```bash
> 2 + 3
5
> _
5
```

### .load 命令

在 REPL 之中，输入`.load someFile.js`会执行当前目录的脚本，可以用来设置常量。

## repl 模块

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

