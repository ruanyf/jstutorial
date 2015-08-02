# Lint工具

## 概述

Lint工具用于检查代码的语法是否正确、风格是否符合要求。

JavaScript语言的最早的Lint工具，是Douglas Crockford开发的JSLint。由于该工具所有的语法规则，都是预设的，用户无法改变。所以，很快就有人抱怨，JSLint不是让你写成正确的JavaScript，而是让你像Douglas Crockford一样写JavaScript。

JSHint可以看作是JSLint的后继者，最大特定就是允许用户自定义自己的语法规则，写在项目根目录下面的`.jshintrc`文件。

JSLint和JSHint同时检查你的语法和风格。另一个工具JSCS则是只检查语法风格。

最新的工具ESLint不仅允许你自定义语法规则，还允许用户创造插件，改变默认的JavaScript语法，比如支持ES6和JSX的语法。

## ESLint

### 基本用法

首先，安装ESLint。

```bash
$ npm i -g eslint
```

其次，在项目根目录下面新建一个`.eslintrc`文件，里面定义了你的语法规则。

```javascript
{
  "rules": {
    "indent": 2,
    "no-unused-vars": 2,
    "no-alert": 1
  },
  "env": {
    "browser": true
  }
}
```

上面的`.eslintrc`文件是JSON格式，里面首先定义，这些规则只适用于浏览器环境。如果要定义，同时适用于浏览器环境和Node环境，可以写成下面这样。

```javascript
{
  "env": {
    "browser": true,
    "node": true
  }
}
```

然后，上面的`.eslintrc`文件定义了三条语法规则。每个语法规则后面，表示这个规则的级别。

- 0：关闭该条规则。
- 1：违反这条规则，会抛出一个警告。
- 2：违反这条规则，会抛出一个错误。

接下来，新建一个`index.js`文件。

```javascript
var unusued = 'I have no purpose!';

function greet() {
    var message = 'Hello, World!';
    alert(message);
}

greet();
```

然后，运行ESLint检查该文件，结果如下。

```bash
$ eslint index.js

index.js
  1:5  error    unusued is defined but never used  no-unused-vars
  5:5  warning  Unexpected alert                   no-alert

✖ 2 problems (1 error, 1 warning)
```

上面代码检查出两个问题，一个是定义了变量却没有使用，二是存在alert。

### 预置规则

自己设置所有语法规则，是非常麻烦的。所以，ESLint提供了预设的语法样式，比较常用的Airbnb的语法规则。由于这个规则集涉及ES6，所以还需要安装Babel插件。

```bash
$ npm i -g babel-eslint eslint-config-airbnb
```

安装完成后，在`.eslintrc`文件中注明，使用Airbnb语法规则。

```bash
{
  "extends": "eslint-config-airbnb"
}
```

你也可以用自己的规则，覆盖预设的语法规则。

```javascript
{
  "extends": "eslint-config-airbnb",
  "rules": {
    "no-var": 0,
    "no-alert": 0
  }
}
```

### 语法规则

（1）indent

indent规则设定行首的缩进，默认是四个空格。下面的几种写法，可以改变这个设置。

```javascript
// 缩进为4个空格（默认值）
"indent": 2

// 缩进为2个空格
"indent": [2, 2]

// 缩进为1个tab键
"indent": [2, "tab"]

// 缩进为2个空格，
// 同时，switch...case结构的case也必须缩进，默认是不打开的
 "indent": [2, 2, {"SwitchCase": 1}]
```

（2）no-unused-vars

不允许声明了变量，却不使用。

```javascript
"no-unused-vars": [2, {"vars": "local", "args": "after-used"}]
```

上面代码中，vars字段表示只检查局部变量，允许全局变量声明了却不使用；args字段表示函数的参数，只要求使用最后一个参数，前面的参数可以不使用。

（3）no-alert

不得使用alert、confirm和prompt。

## 参考链接

- Lauritz Hilsøe, [Linting JavaScript in 2015](http://blog.lauritz.me/linting-javascript-in-2015/)
