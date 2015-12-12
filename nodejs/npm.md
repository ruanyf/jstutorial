---
title: npm模块管理器
layout: page
category: nodejs
date: 2014-10-24
modifiedOn: 2014-10-24
---

## 简介

npm有两层含义。一层含义是Node.js的开放式模块登记和管理系统，网址为[http://npmjs.org](http://npmjs.org)。另一层含义是Node.js默认的模块管理器，是一个命令行下的软件，用来安装和管理node模块。

npm不需要单独安装。在安装node的时候，会连带一起安装npm。但是，node附带的npm可能不是最新版本，最好用下面的命令，更新到最新版本。

```bash
$ npm install npm@latest -g
```

上面的命令之所以最后一个参数是npm，是因为npm本身也是Node.js的一个模块。

Node安装完成后，可以用下面的命令，查看一下npm的帮助文件。

```bash
# npm命令列表
$ npm help

# 各个命令的简单用法
$ npm -l
```

下面的命令分别查看npm的版本和配置。

```bash
$ npm -v
$ npm config list -l
```

## npm init

`npm init`用来初始化生成一个新的`package.json`文件。它会向用户提问一系列问题，如果你觉得不用修改默认配置，一路回车就可以了。

如果使用了`-f`（代表force）、`-y`（代表yes），则跳过提问阶段，直接生成一个新的`package.json`文件。

```bash
$ npm init -y
```

## npm set

`npm set`用来设置环境变量。

```bash
$ npm set init-author-name 'Your name'
$ npm set init-author-email 'Your email'
$ npm set init-author-url 'http://yourdomain.com'
$ npm set init-license 'MIT'
```

上面命令等于为`npm init`设置了默认值，以后执行`npm init`的时候，`package.json`的作者姓名、邮件、主页、许可证字段就会自动写入预设的值。这些信息会存放在用户主目录的` ~/.npmrc`文件，使得用户不用每个项目都输入。如果某个项目有不同的设置，可以针对该项目运行`npm config`。

```bash
$ npm set save-exact true
```

上面命令设置加入模块时，`package.json`将记录模块的确切版本，而不是一个可选的版本范围。

## npm info

`npm info`命令可以查看每个模块的具体信息。比如，查看underscore模块的信息。

```bash
$ npm info underscore
{ name: 'underscore',
  description: 'JavaScript\'s functional programming helper library.',
  'dist-tags': { latest: '1.5.2', stable: '1.5.2' },
  repository:
   { type: 'git',
     url: 'git://github.com/jashkenas/underscore.git' },
  homepage: 'http://underscorejs.org',
  main: 'underscore.js',
  version: '1.5.2',
  devDependencies: { phantomjs: '1.9.0-1' },
  licenses:
   { type: 'MIT',
     url: 'https://raw.github.com/jashkenas/underscore/master/LICENSE' },
  files:
   [ 'underscore.js',
     'underscore-min.js',
     'LICENSE' ],
  readmeFilename: 'README.md'}
```

上面命令返回一个JavaScript对象，包含了underscore模块的详细信息。这个对象的每个成员，都可以直接从info命令查询。

```bash
$ npm info underscore description
JavaScript's functional programming helper library.

$ npm info underscore homepage
http://underscorejs.org

$ npm info underscore version
1.5.2
```

## npm search

`npm search`命令用于搜索npm仓库，它后面可以跟字符串，也可以跟正则表达式。

```bash
$ npm search <搜索词>
```

下面是一个例子。

```bash
$ npm search node-gyp
// NAME                  DESCRIPTION
// autogypi              Autogypi handles dependencies for node-gyp projects.
// grunt-node-gyp        Run node-gyp commands from Grunt.
// gyp-io                Temporary solution to let node-gyp run `rebuild` under…
// ...
```

## npm list

`npm list`命令以树型结构列出当前项目安装的所有模块，以及它们依赖的模块。

```bash
$ npm list
```

加上global参数，会列出全局安装的模块。

```bash
$ npm list -global
```

`npm list`命令也可以列出单个模块。

```bash
$ npm list underscore
```

## npm install

Node模块采用`npm install`命令安装。每个模块可以“全局安装”，也可以“本地安装”。两者的差异是模块的安装位置，以及调用方法。

“全局安装”指的是将一个模块直接下载到Node的安装目录中，各个项目都可以调用。“本地安装”指的是将一个模块下载到当前目录的node_modules子目录，然后只有在当前目录和它的子目录之中，才能调用这个模块。一般来说，全局安装只适用于工具模块，比如npm和grunt。

默认情况下，`npm install`命令是“本地安装”某个模块。

```bash
$ npm install <package name>
```

npm也支持直接输入github地址。

```bash
$ npm install git://github.com/package/path.git
$ npm install git://github.com/package/path.git#0.1.0
```

运行上面命令后，模块文件将下载到当前目录的`node_modules`子目录。

使用global参数，可以“全局安装”某个模块。global参数可以被简化成g参数。

```bash
$ sudo npm install -global [package name]
$ sudo npm install -g [package name]
```

install命令总是安装模块的最新版本，如果要安装模块的特定版本，可以在模块名后面加上@和版本号。

```bash
$ npm install sax@latest
$ npm install sax@0.1.1
$ npm install sax@">=0.1.0 <0.2.0"
```

如果使用`--save-exact`参数，会在package.json文件指定安装模块的确切版本。

```bash
$ npm install readable-stream --save --save-exact
```

install命令可以使用不同参数，指定所安装的模块属于哪一种性质的依赖关系，即出现在packages.json文件的哪一项中。

- --save：模块名将被添加到dependencies，可以简化为参数`-S`。
- --save-dev: 模块名将被添加到devDependencies，可以简化为参数`-D`。

```bash
$ npm install sax --save
$ npm install node-tap --save-dev
# 或者
$ npm install sax -S
$ npm install node-tap -D
```

如果要安装beta版本的模块，需要使用下面的命令。

```bash
# 安装最新的beta版
$ npm install <module-name>@beta (latest beta)

# 安装指定的beta版
$ npm install <module-name>@1.3.1-beta.3
```

`npm install`默认会安装dependencies字段和devDependencies字段中的所有模块，如果使用production参数，可以只安装dependencies字段的模块。

```bash
$ npm install --production
# 或者
$ NODE_ENV=production npm install
```

一旦安装了某个模块，就可以在代码中用require命令调用这个模块。

```javascript
var backbone = require('backbone')

console.log(backbone.VERSION)
```

## 模块标签

Npm允许为模块的某个版本，新建一个标签。

```bash
$ npm dist-tag add <pkg>@<version> [<tag>]
```

同一种方法是发布的时候，加上标签。

```bash
$ npm publish --tag=beta
```

有了标签以后，就可以指定安装该标签的版本，或者该标签的依赖。

```bash
# 安装模块
$ npm install <name>@<tag>

# 安装依赖
$ npm install --tag <tag>
```

常见的标签有`latest`、`stable`、`next`等。

Npm默认会为最新一次发布的版本，新建`latest`标签。然后，下载的时候，默认是下载带有`latest`标签的版本。但是，这可能并不是我们想要的行为。比如，当前最新版本是4.2版，然后发布了一个3.6版，`latest`的标签就会打在3.6版上面，用户`npm install`安装的就是这个版本。

为了避免这个问题，可以为3.6版加上`previous`标签。

```bash
# 发布
$ npm publish --tag=previous

# 安装
$ npm install <package>@previous
```

`package.json`文件可以设置默认标签。

```javascript
{
  "publishConfig": {
    "tag": "next"
  }
}
```

上面的`publishConfig`设置了最新发布的默认标签是`next`。`publishConfig`属性设置的值，可以在publish过程中使用。

## 语义版本（SemVer）

npm采用”语义版本“管理软件包。所谓语义版本，就是指版本号为`a.b.c`的形式，其中a是大版本号，b是小版本号，c是补丁号。

一个软件发布的时候，默认就是 1.0.0 版。如果以后发布补丁，就增加最后一位数字，比如1.0.1；如果增加新功能，且不影响原有的功能，就增加中间的数字（即小版本号），比如1.1.0；如果引入的变化，破坏了向后兼容性，就增加第一位数字（即大版本号），比如2.0.0。

npm允许使用特殊符号，指定所要使用的版本范围，假定当前版本是1.0.4。

- 只接受补丁包：1.0 或者 1.0.x 或者 ~1.0.4
- 只接受小版本和补丁包：1 或者 1.x 或者 &#94;1.0.4
- 接受所有更新：* or x

对于~和&#94;，要注意区分。前者表示接受当前小版本（如果省略小版本号，则是当前大版本）的最新补丁包，后者表示接受当前大版本的最新小版本和最新补丁包。

```javascript
~2.2.1 // 接受2.2.1，不接受2.3.0
^2.2.1 // 接受2.2.1和2.3.0

~2.2 // 接受2.2.0和2.2.1，不接受2.3.0
^2.2 // 接受2.2.0、2.2.1和2.3.0

~2 // 接受2.0.0、2.1.0、2.2.0、2.2.1和2.3.0
^2 // 接受2.0.0、2.1.0、2.2.0、2.2.1和2.3.0
```

还可以使用数学运算符（比如&gt;, &lt;, =, &gt;= or &lt;=等），指定版本范围。

```javascript
>2.1
1.0.0 - 1.2.0
>1.0.0-alpha
>=1.0.0-rc.0 <1.0.1
^2 <2.2 || > 2.3
```

注意，如果使用连字号，它的两端必须有空格。如果不带空格，会被npm理解成预发布的tag，比如1.0.0-rc.1。

## npm update，npm uninstall

npm update 命令可以升级本地安装的模块。

```bash
$ npm update [package name]
```

加上global参数，可以升级全局安装的模块。

```bash
$ npm update -global [package name]
```

npm uninstall 命令，删除本地安装的模块。

```bash
$ npm uninstall [package name]
```

加上global参数，可以删除全局安装的模块。

```bash
$ sudo npm uninstall [package name] -global
```

## npm shrinkwrap

对于一个项目来说，通常不会写死依赖的npm模块的版本。比如，开发时使用某个模块的版本是1.0，那么等到用户安装时，如果该模块升级到1.1，往往就会安装1.1。

但是，对于开发者来说，有时最好锁定所有依赖的版本，防止模块升级带来意想不到的问题。但是，由于模块自己还依赖别的模块，这一点往往很难做到。举例来说，项目依赖A模块，A模块依赖B模块。即使写死A模块的版本，但是B模块升级依然可能导致不兼容。

`npm shrinkwrap`命令就是用来彻底锁定所有模块的版本。

```javascript
$ npm shrinkwrap
```

运行上面这个命令以后，会在项目目录下生成一个npm-shrinkwrap.json文件，里面包含当前项目用到的所有依赖（包括依赖的依赖，以此类推），以及它们的准确版本，也就是当前正在使用的版本。

只要存在`npm-shrinkwrap.json`文件，下一次用户使用`npm install`命令安装依赖的时候，就会安装所有版本完全相同的模块。

如果执行`npm shrinkwrap`的时候，加上参数dev，还可以记录devDependencies字段中模块的准确版本。

```javascript
$ npm shrinkwrap --dev
```

## npm prune

`npm prune`命令与`npm shrinkwrap`配套使用。使用`npm shrinkwrap`的时候，有时可能存在某个已经安装的模块不在`dependencies`字段内的情况，这时`npm shrinkwrap`就会报错。

`npm prune`命令可以移除所有不在`dependencies`字段内的模块。如果指定模块名，则移除指定的模块。

```bash
$ npm prune
$ npm prune <package name>
```

## npm run

npm不仅可以用于模块管理，还可以用于执行脚本。`package.json`文件有一个`scripts`字段，可以用于指定脚本命令，供npm直接调用。

```javascript
{
  "name": "myproject",
  "devDependencies": {
    "jshint": "latest",
    "browserify": "latest",
    "mocha": "latest"
  },
  "scripts": {
    "lint": "jshint **.js",
    "test": "mocha test/"
  }
}
```

上面代码中，`scripts`字段指定了两项命令`lint`和`test`。命令行输入`npm run-script lint`或者`npm run lint`，就会执行`jshint **.js`，输入`npm run-script test`或者`npm run test`，就会执行`mocha test/`。`npm run`是`npm run-script`的缩写，一般都使用前者，但是后者可以更好地反应这个命令的本质。

`npm run`命令会自动在环境变量`$PATH`添加`node_modules/.bin`目录，所以`scripts`字段里面调用命令时不用加上路径，这就避免了全局安装NPM模块。

npm内置了两个命令简写，`npm test`等同于执行`npm run test`，`npm start`等同于执行`npm run start`。

`npm run`会创建一个shell，执行指定的命令，并将`node_modules/.bin`加入PATH变量，这意味着本地模块可以直接运行。也就是说，`npm run lint`直接运行`jshint **.js`即可，而不用`./node_modules/.bin/jshint **.js`。

如果直接运行`npm run`不给出任何参数，就会列出scripts属性下所有命令。

```bash
$ npm run
Available scripts in the user-service package:
  lint
     jshint **.js
  test
    mocha test/
```

下面是另一个`package.json`文件的例子。

```javascript
"scripts": {
  "watch": "watchify client/main.js -o public/app.js -v",
  "build": "browserify client/main.js -o public/app.js",
  "start": "npm run watch & nodemon server.js",
  "test": "node test/all.js"
},
```

上面代码在`scripts`项，定义了四个别名，每个别名都有对应的脚本命令。

```bash
$ npm run watch
$ npm run build
$ npm run start
$ npm run test
```

其中，`start`和`test`属于特殊命令，可以省略`run`。

```bash
$ npm start
$ npm test
```

如果希望一个操作的输出，是另一个操作的输入，可以借用Linux系统的管道命令，将两个操作连在一起。

```javascript
"build-js": "browserify browser/main.js | uglifyjs -mc > static/bundle.js"
```

但是，更方便的写法是引用其他`npm run`命令。

```javascript
"build": "npm run build-js && npm run build-css"
```

上面的写法是先运行`npm run build-js`，然后再运行`npm run build-css`，两个命令中间用`&&`连接。如果希望两个命令同时平行执行，它们中间可以用`&`连接。

下面是一个流操作的例子。

```javascript
"devDependencies": {
  "autoprefixer": "latest",
  "cssmin": "latest"
},

"scripts": {
  "build:css": "autoprefixer -b 'last 2 versions' < assets/styles/main.css | cssmin > dist/main.css"
}
```

写在`scripts`属性中的命令，也可以在`node_modules/.bin`目录中直接写成bash脚本。下面是一个bash脚本。

```javascript
#!/bin/bash

cd site/main
browserify browser/main.js | uglifyjs -mc > static/bundle.js
```

假定上面的脚本文件名为build.sh，并且权限为可执行，就可以在scripts属性中引用该文件。

```javascript
"build-js": "bin/build.sh"
```

### 参数

`npm run`命令还可以添加参数。

```javascript
"scripts": {
  "test": "mocha test/"
}
```

上面代码指定`npm test`，实际运行`mocha test/`。如果要通过`npm test`命令，将参数传到mocha，则参数之前要加上两个连词线。

```bash
$ npm run test -- anothertest.js
# 等同于
$ mocha test/ anothertest.js
```

上面命令表示，mocha要运行所有`test`子目录的测试脚本，以及另外一个测试脚本`anothertest.js`。

`npm run`本身有一个参数`-s`，表示关闭npm本身的输出，只输出脚本产生的结果。

```bash
// 输出npm命令头
$ npm run test

// 不输出npm命令头
$ npm run -s test
```

### scripts脚本命令最佳实践

`scripts`字段的脚本命令，有一些最佳实践，可以方便开发。首先，安装`npm-run-all`模块。

```bash
$ npm install npm-run-all --save-dev
```

这个模块用于运行多个`scripts`脚本命令。

```bash
# 继发执行
$ npm-run-all build:html build:js
# 等同于
$ npm run build:html && npm run build:js

# 并行执行
$ npm-run-all --parallel watch:html watch:js
# 等同于
$ npm run watch:html & npm run watch:js

# 混合执行
$ npm-run-all clean lint --parallel watch:html watch:js
# 等同于
$ npm-run-all clean lint
$ npm-run-all --parallel watch:html watch:js

# 通配符
$ npm-run-all --parallel watch:*
```

（1）start脚本命令

`start`脚本命令，用于启动应用程序。

```javascript
"start": "npm-run-all --parallel dev serve"
```

上面命令并行执行`dev`脚本命令和`serve`脚本命令，等同于下面的形式。

```bash
$ npm run dev & npm run serve
```

（2）dev脚本命令

`dev`脚本命令，规定开发阶段所要做的处理，比如构建网页资源。

```javascript
"dev": "npm-run-all dev:*"
```

上面命令用于继发执行所有`dev`的子命令。

```javascript
"predev:sass": "node-sass --source-map src/css/hoodie.css.map --output-style nested src/sass/base.scss src/css/hoodie.css"
```

上面命令将sass文件编译为css文件，并生成source map文件。

```javascript
"dev:sass": "node-sass --source-map src/css/hoodie.css.map --watch --output-style nested src/sass/base.scss src/css/hoodie.css"
```

上面命令会监视sass文件的变动，只要有变动，就自动将其编译为css文件。

```javascript
"dev:autoprefix": "postcss --use autoprefixer --autoprefixer.browsers \"> 5%\" --output src/css/hoodie.css src/css/hoodie.css"
```

上面命令为css文件加上浏览器前缀，限制条件是只考虑市场份额大于5%的浏览器。

（3）serve脚本命令

`serve`脚本命令用于启动服务。

```javascript
"serve": "live-server dist/ --port=9090"
```

上面命令启动服务，用的是[live-server](http://npmjs.com/package/live-server)模块，将服务启动在9090端口，展示`dist`子目录。

`live-server`模块有三个功能。

- 启动一个HTTP服务器，展示指定目录的`index.html`文件，通过该文件加载各种网络资源，这是`file://`协议做不到的。
- 添加自动刷新功能。只要指定目录之中，文件有任何变化，它就会刷新页面。
- `npm run serve`命令执行以后，自动打开浏览器。、

以前，上面三个功能需要三个模块来完成：`http-server`、`live-reload`和`opener`，现在只要`live-server`一个模块就够了。

（4）test脚本命令

`test`脚本命令用于执行测试。

```javascript
"test": "npm-run-all test:*",
"test:lint": "sass-lint --verbose --config .sass-lint.yml src/sass/*"
```

上面命令规定，执行测试时，运行`lint`脚本，检查脚本之中的语法错误。

（5）prod脚本命令

`prod`脚本命令，规定进入生产环境时需要做的处理。

```javascript
"prod": "npm-run-all prod:*",
"prod:sass": "node-sass --output-style compressed src/sass/base.scss src/css/prod/hoodie.min.css",
"prod:autoprefix": "postcss --use autoprefixer --autoprefixer.browsers "> 5%" --output src/css/prod/hoodie.min.css src/css/prod/hoodie.min.css"
```

上面命令将sass文件转为css文件，并加上浏览器前缀。

（6）help脚本命令

`help`脚本命令用于展示帮助信息。

```javascript
"help": "markdown-chalk --input DEVELOPMENT.md"
```

上面命令之中，`markdown-chalk`模块用于将指定的markdown文件，转为彩色文本显示在终端之中。

（7）docs脚本命令

`docs`脚本命令用于生成文档。

```javascript
"docs": "kss-node --source src/sass --homepage ../../styleguide.md"
```

上面命令使用`kss-node`模块，提供源码的注释生成markdown格式的文档。

### pre- 和 post- 脚本

`npm run`为每条命令提供了`pre-`和`post-`两个钩子（hook）。以`npm run lint`为例，执行这条命令之前，npm会先查看有没有定义prelint和postlint两个钩子，如果有的话，就会先执行`npm run prelint`，然后执行`npm run lint`，最后执行`npm run postlint`。

```javascript
{
  "name": "myproject",
  "devDependencies": {
    "eslint": "latest"
    "karma": "latest"
  },
  "scripts": {
    "lint": "eslint --cache --ext .js --ext .jsx src",
    "test": "karma start --log-leve=error karma.config.js --single-run=true",
    "pretest": "npm run lint",
    "posttest": "echo 'Finished running tests'"
  }
}
```

上面代码是一个`package.json`文件的例子。如果执行`npm test`，会按下面的顺序执行相应的命令。

1. pretest
1. test
1. posttest

如果执行过程出错，就不会执行排在后面的脚本，即如果prelint脚本执行出错，就不会接着执行lint和postlint脚本。

下面是一些常见的`pre-`和`post-`脚本。

- prepublish：发布一个模块前执行。
- postpublish：发布一个模块后执行。
- preinstall：安装一个模块前执行。
- postinstall：安装一个模块后执行。
- preuninstall：卸载一个模块前执行。
- postuninstall：卸载一个模块后执行。
- preversion：更改模块版本前执行。
- postversion：更改模块版本后执行。
- pretest：运行`npm test`命令前执行。
- posttest：运行`npm test`命令后执行。
- prestop：运行`npm stop`命令前执行。
- poststop：运行`npm stop`命令后执行。
- prestart：运行`npm start`命令前执行。
- poststart：运行`npm start`命令后执行。
- prerestart：运行`npm restart`命令前执行。
- postrestart：运行`npm restart`命令后执行。

对于最后一个`npm restart`命令，如果没有设置restart脚本，prerestart和postrestart会依次执行stop和start脚本。

如果start脚本没有配置，`npm start`命令默认执行下面的脚本，前提是模块的根目录存在一个server.js文件。

```bash
$ node server.js
```

另外，不能在pre脚本之前再加pre，即preprelint脚本不起作用。

下面是一个例子。

```javascript
"scripts": {
  "lint": "standard",
  "test": "node test/my-tests.js",
  "posttest": "npm run lint",
  "predeploy": "npm test",
  "deploy": "surge ./path/to/dist"
}
```

以上都是npm相关操作的钩子，如果安装某些模块，还能支持Git相关的钩子。下面以[husky](https://github.com/typicode/husky)模块为例。

```bash
$ npm install husky --save-dev
```

安装以后，就能在`package.json`添加`precommit`、`prepush`等钩子。

```javascript
{
    "scripts": {
        "lint": "eslint yourJsFiles.js",
        "precommit": "npm run test && npm run lint",
        "prepush": "npm run test && npm run lint",
        "...": "..."
    }
}
```

类似作用的模块还有`pre-commit`、`precommit-hook`等。

### 内部变量

scripts字段可以使用一些内部变量，主要是package.json的各种字段。

比如，package.json的内容是`{"name":"foo", "version":"1.2.5"}`，那么变量`npm_package_name`的值是foo，变量`npm_package_version`的值是1.2.5。

```javascript
{
  "scripts":{
    "bundle": "mkdir -p build/$npm_package_version/"
  }
}
```

运行`npm run bundle`以后，将会生成`build/1.2.5/`子目录。

`config`字段也可以用于设置内部字段。

```javascript
  "name": "fooproject",
  "config": {
    "reporter": "xunit"
  },
  "scripts": {
    "test": "mocha test/ --reporter $npm_package_config_reporter"
  }
```

上面代码中，变量`npm_package_config_reporter`对应的就是reporter。

### 通配符

npm的通配符的规则如下。

- `*` 匹配0个或多个字符
- `?` 匹配1个字符
- `[...]` 匹配某个范围的字符。如果该范围的第一个字符是`!`或`^`，则匹配不在该范围的字符。
- `!(pattern|pattern|pattern)` 匹配任何不符合给定的模式
- `?(pattern|pattern|pattern)` 匹配0个或1个给定的模式
- `+(pattern|pattern|pattern)` 匹配1个或多个给定的模式
- `*(a|b|c)` 匹配0个或多个给定的模式
- `@(pattern|pat*|pat?erN)` 只匹配给定模式之一
- `**` 如果出现在路径部分，表示0个或多个子目录。

## npm link

一般来说，每个项目都会在项目目录内，安装所需的模块文件。也就是说，各个模块是局部安装。但是有时候，我们希望模块是一个符号链接，连到外部文件，这时候就需要用到npm link命令。

为了理解npm link，请设想这样一个场景。你开发了一个模块myModule，目录为src/myModule，你自己的项目myProject要用到这个模块，项目目录为src/myProject。每一次，你更新myModule，就要用`npm publish`命令发布，然后切换到项目目录，使用`npm update`更新模块。这样显然很不方便，如果我们可以从项目目录建立一个符号链接，直接连到模块目录，就省去了中间步骤，项目可以直接使用最新版的模块。

先在模块目录（src/myModule）下运行npm link命令。

{% highlight bash %}

src/myModule$ npm link

{% endhighlight %}

上面的命令会在npm的全局模块目录内（比如/usr/local/lib/node_modules/），生成一个符号链接文件，该文件的名字就是package.json文件中指定的文件名。

{% highlight bash %}

/usr/local/lib/node_modules/myModule -> src/myModule

{% endhighlight %}

然后，切换到你需要放置该模块的项目目录，再次运行npm link命令，并指定模块名。

{% highlight bash %}

src/myProject$ npm link myModule

{% endhighlight %}

上面命令等同于生成了本地模块的符号链接。

{% highlight bash %}

src/myProject/node_modules/myModule -> /usr/local/lib/node_modules/myModule

{% endhighlight %}

然后，就可以在你的项目中，加载该模块了。

{% highlight javascript %}

var myModule = require('myModule');

{% endhighlight %}

这样一来，myModule的任何变化，都可以直接在myProject中调用。但是，同时也出现了风险，任何在myProject目录中对myModule的修改，都会反映到模块的源码中。

npm link命令有一个简写形式，显示连接模块的本地目录。

```javascript
$ src/myProject$ npm link ../myModule
```

上面的命令等同于下面几条命令。

```javascript
$ src/myProject$ cd ../myModule
$ src/myModule$ npm link
$ src/myModule$ cd ../myProject
$ src/myProject$ npm link myModule
```

如果你的项目不再需要该模块，可以在项目目录内使用npm unlink命令，删除符号链接。

{% highlight bash %}

src/myProject$ npm unlink myModule

{% endhighlight %}

一般来说，npm公共模块都安装在系统目录（比如/usr/local/lib/），普通用户没有写入权限，需要用到sudo命令。这不是很方便，我们可以在没有root的情况下，用好npm。

首先在主目录下新建配置文件.npmrc，然后在该文件中将prefix变量定义到主目录下面。

```bash
prefix = /home/yourUsername/npm
```

然后在主目录下新建npm子目录。

```bash
$ mkdir ~/npm
```

此后，全局安装的模块都会安装在这个子目录中，npm也会到`~/npm/bin`目录去寻找命令。因此，`npm link`就不再需要
root权限了。

最后，将这个路径在.bash_profile文件（或.bashrc文件）中加入PATH变量。

```bash
export PATH=~/npm/bin:$PATH
```

## npm adduser

`npm adduser`用于在npmjs.com注册一个用户。

```bash
$ npm adduser
Username: YOUR_USER_NAME
Password: YOUR_PASSWORD
Email: YOUR_EMAIL@domain.com
```

## npm publish

`npm publish`用于将当前模块发布到`npmjs.com`。执行之前，需要向`npmjs.com`申请用户名。

```bash
$ npm adduser
```

如果已经注册过，就使用下面的命令登录。

```bash
$ npm login
```

最后，使用npm publish命令发布。

```bash
$ npm publish
```

如果当前模块是一个beta版，比如`1.3.1-beta.3`，那么发布的时候需要使用`tag`参数。

```bash
$ npm publish --tag beta
```

如果发布私有模块，模块初始化的时候，需要加上`scope`参数。只有npm的付费用户才能发布私有模块。

```bash
$ npm init --scope=<yourscope>
```

## npm version

`npm version`命令用来修改项目的版本号。当你完成代码修改，要发布新版本的时候，就用这个命令更新一下软件的版本。

```bash
$ npm version <update_type> -m "<message>"
```

`npm version`命令的update_type参数有三个选项：patch、minor、major。

- `npm version patch`增加一位补丁号（比如 1.1.1 -> 1.1.2）
- `npm version minor`增加一位小版本号（比如 1.1.1 -> 1.2.0）
- `npm version major`增加一位大版本号（比如 1.1.1 -> 2.0.0）。

下面是一个例子。

```bash
$ npm version patch -m "Version %s - xxxxxx"
```

上面命令的%s表示新的版本号。

除了增加版本号，`npm version`命令还会为这次修改，新增一个git commit记录，以及一个新的git tag。

由于更新npm网站的唯一方法，就是发布一个新的版本。因此，除了第一次发布，这个命令与`npm publish`几乎是配套的，先使用它，再使用`npm publish`。

```bash
$ npm version patch -m "Version %s - add sweet badges"$
$ git push && git push --tags (or git push origin master --tags)
$ npm publish
```

## npm deprecate

如果想废弃某个版本的模块，可以使用`npm deprecate`命令。

```bash
$ npm deprecate my-thing@"< 0.2.3" "critical bug fixed in v0.2.3"
```

运行上面的命令以后，小于0.2.3版本的模块的`package.json`都会写入一行警告，用户安装这些版本时，这行警告就会在命令行显示。

## 参考链接

- James Halliday, [task automation with npm run](http://substack.net/task_automation_with_npm_run): npm run命令（package.json文件的script属性）的用法
- Keith Cirkel, [How to Use npm as a Build Tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)
- justjs, [npm link: developing your own npm modules without tears](http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears)
- hoodie-css, [Development Environment Help](https://github.com/hoodiehq/hoodie-css/blob/feature/build-automation/DEVELOPMENT.md)
- Stephan Bönnemann, [How to make use of npm’s package distribution tags to create release channels](https://medium.com/greenkeeper-blog/one-simple-trick-for-javascript-package-maintainers-to-avoid-breaking-their-user-s-software-and-to-6edf06dc5617#.5omqgsg45)
