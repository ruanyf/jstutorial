---
title: npm模块管理器
layout: page
category: nodejs
date: 2014-10-24
modifiedOn: 2014-10-24
---

## 简介

npm有两层含义。一层含义是Node.js的开放式模块登记和管理系统，网址为[http://npmjs.org](http://npmjs.org)。另一层含义是Node.js默认的模块管理器，是一个命令行下的软件，用来安装和管理node模块。

npm不需要单独安装。在安装node的时候，会连带一起安装npm。node安装完成后，可以用下面的命令，查看一下npm的帮助文件。

{% highlight bash %}

# npm命令列表
$ npm help

# 各个命令的简单用法
$ npm -l

{% endhighlight %}

下面的命令分别查看npm的版本和配置。

{% highlight bash %}

$ npm -version

$ npm config list -l

{% endhighlight %}

npm的版本可以在Node更新的时候一起更新。如果你想单独更新npm，使用下面的命令。

{% highlight bash %}

npm update -global npm

{% endhighlight %}

上面的命令之所以最后一个参数是npm，是因为npm本身也是Node.js的一个模块。

## npm info

npm的info命令可以查看每个模块的具体信息。比如，查看underscore模块信息的命令是：

{% highlight bash %}

npm info underscore

{% endhighlight %}

上面命令返回一个JavaScript对象，包含了underscore模块的详细信息。

```javascript

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

上面这个JavaScript对象的每个成员，都可以直接从info命令查询。

```bash

npm info underscore description
# JavaScript's functional programming helper library.

npm info underscore homepage
# http://underscorejs.org

npm info underscore version
# 1.5.2

```

## npm install

每个模块可以“全局安装”，也可以“本地安装”。两者的差异是模块的安装位置，以及调用方法。

“全局安装”指的是将一个模块直接下载到Node的安装目录中，各个项目都可以调用。“本地安装”指的是将一个模块下载到当前目录的node_modules子目录，然后只有在当前目录和它的子目录之中，才能调用这个模块。一般来说，全局安装只适用于工具模块，比如npm和grunt。

默认情况下，npm install 命令是“本地安装”某个模块。

{% highlight bash %}

npm install [package name]

{% endhighlight %}

npm也支持直接输入github地址。

{% highlight bash %}

npm install git://github.com/package/path.git
npm install git://github.com/package/path.git#0.1.0

{% endhighlight %}

使用安装命令以后，模块文件将下载到当前目录的 node_modules 子目录。

使用global参数，可以“全局安装”某个模块。global参数可以被简化成g参数。

{% highlight bash %}

$ sudo npm install -global [package name]

$ sudo npm install -g [package name]

{% endhighlight %}

install命令总是安装模块的最新版本，如果要安装模块的特定版本，可以在模块名后面加上@和版本号。

{% highlight bash %}

$ npm install sax@latest
$ npm install sax@0.1.1
$ npm install sax@">=0.1.0 <0.2.0"

{% endhighlight %}

install命令可以使用不同参数，指定所安装的模块属于哪一种性质的依赖关系，即出现在packages.json文件的哪一项中。

- --save：模块名将被添加到dependencies
- --save-dev: 模块名将被添加到devDependencies
- --save-optional：模块名将被添加到optionalDependencies

```bash

$ npm install sax --save
$ npm install node-tap --save-dev
$ npm install dtrace-provider --save-optional

```

`--save-dev`有一个简写形式-D。

```bash

$ npm i -D gulp

```

一旦安装了某个模块，就可以在代码中用require命令调用这个模块。

{% highlight javascript %}

var backbone = require('backbone')

console.log(backbone.VERSION)

{% endhighlight %}

## npm update，npm uninstall

npm update 命令可以升级本地安装的模块。

{% highlight bash %}

npm update [package name]

{% endhighlight %}

加上global参数，可以升级全局安装的模块。

{% highlight bash %}

npm update -global [package name]

{% endhighlight %}

npm uninstall 命令，删除本地安装的模块。

{% highlight bash %}

npm uninstall [package name]

{% endhighlight %}

加上global参数，可以删除全局安装的模块。

{% highlight bash %}

sudo npm uninstall [package name] -global

{% endhighlight %}

## npm list

npm list命令，默认列出当前目录安装的所有模块。如果使用global参数，就是列出全局安装的模块。

{% highlight bash %}

npm list

npm -global list

{% endhighlight %}

## npm search

向服务器端搜索某个模块，使用search命令（可使用正则搜索）。

{% highlight bash %}

npm search [搜索词]

{% endhighlight %}

如果不加搜索词，npm search 默认返回服务器端的所有模块。

## npm run

package.json文件有一项scripts，用于指定脚本命令，供npm直接调用。

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

上面代码中，scripts指定了两项命令lint和test。命令行输入`npm run lint`，就会执行`jshint **.js`，输入`npm run test`，就会执行`mocha test/`。npm内置了两个命令简写，`npm test`等同于执行`npm run lint`，`npm start`等同于执行`npm run start`。

`npm run`会创建一个shell，执行指定的命令，并将`node_modules/.bin`加入PATH变量，这意味着本地模块可以直接运行。也就是说，`npm run lint`直接运行`jshint **.js`即可，而不用`./node_modules/.bin/jshint **.js`。

如果直接运行`npm run`不给出任何参数，就会列出scripts属性下所有命令。

```bash

Available scripts in the user-service package:  
  lint
     jshint **.js
  test
    mocha test/

```

下面是另一个package.json文件的例子。

{% highlight javascript %}

"scripts": {
  "watch": "watchify client/main.js -o public/app.js -v",
  "build": "browserify client/main.js -o public/app.js",
  "start": "npm run watch & nodemon server.js",
  "test": "node test/all.js"
},

{% endhighlight %}

上面代码在scripts项，定义了四个别名，每个别名都有对应的脚本命令。

{% highlight bash %}

npm run watch
npm run build
npm run start
npm run test

{% endhighlight %}

其中，start和test属于特殊命令，可以省略run。

{% highlight bash %}

npm start
npm test

{% endhighlight %}

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

写在scripts属性中的命令，也可以在`node_modules/.bin`目录中直接写成bash脚本。

```javascript

#!/bin/bash

cd site/main; 
browserify browser/main.js | uglifyjs -mc > static/bundle.js

```

假定上面的脚本文件名为build.sh，并且权限为可执行，就可以在scripts属性中引用该文件。

```javascript

"build-js": "bin/build.sh"

```

`npm run`为每条命令提供了pre和post两个钩子（hook）。以`npm run lint`为例，执行这条命令之前，npm会先查看有没有定义prelint和postlint两个钩子，如果有的话，就会先执行`npm run prelint`，然后执行`npm run lint`，最后执行`npm run postlint`。所有命令都是这样，包括`npm test`（即实际存在`npm run pretest`、`npm run test`、`npm run posttest`三条命令）。如果执行过程出错，就不会执行排在后面的命令，即如果pretest命令执行出错，就不会接着执行 test和posttest命令。不能在pre命令之前再加pre，即prepretest命令不起作用。另外，还可以为一些内部命令指定pre和post的钩子：install、uninstall、publish、update。

```javascript

"scripts": {
  "lint": "jshint **.js",
  "build": "browserify index.js > myproject.min.js",
  "test": "mocha test/",

  "prepublish": "npm run build # also runs npm run prebuild",    
  "prebuild": "npm run test # also runs npm run pretest",
  "pretest": "npm run lint"
}

```

`npm run`命令还可以添加参数。

```javascript

"scripts": {
  "test": "mocha test/"
}

```

上面代码指定`npm test`，实际运行`mocha test/`。可以在`npm test`命令后面加上参数，比如`npm run test -- anothertest.js`，实际运行的是`mocha test/ anothertest.js`。

## npm link

一般来说，每个项目都会在项目目录内，安装所需的模块文件。也就是说，各个模块是局部安装。但是有时候，我们希望模块是一个符号链接，连到外部文件，这时候就需要用到npm link命令。

现在模块A（moduleA）的安装目录下运行npm link命令。

{% highlight bash %}

/path/to/moduleA $ npm link

{% endhighlight %}

上面的命令会在npm的安装目录内，生成一个符号链接文件。

{% highlight bash %}

/usr/local/share/npm/lib/node_modules/moduleA -> /path/to/moduleA

{% endhighlight %}

然后，转到你需要放置该模块的项目目录，再次运行npm link命令，并指定模块名。

{% highlight bash %}

/path/to/my-project  $ npm link moduleA

{% endhighlight %}

上面命令等同于生成了本地模块的符号链接。

{% highlight bash %}

/path/to/my-project/node_modules/moduleA -> /usr/local/share/npm/lib/node_modules/moduleA

{% endhighlight %}

然后，就可以在你的项目中，加载该模块了。

{% highlight javascript %}

require('moduleA')

{% endhighlight %}

如果你的项目不再需要该模块，可以在项目目录内使用npm unlink命令，删除符号链接。

{% highlight bash %}

/path/to/my-project  $ npm unlink moduleA

{% endhighlight %}

## npm publish

在发布你的模块之前，需要先设定个人信息。

{% highlight bash %}

npm set init.author.name "xxx"
npm set init.author.email "xxx@gmail.com"
npm set init.author.url "http://xxx.com"

{% endhighlight %}

然后，请npm系统申请用户名。

{% highlight bash %}

npm adduser

{% endhighlight %}

运行上面的命令之后，屏幕上会提示输入用户名，然后是输入Email地址和密码。

上面所有的这些个人信息，全部保存在~/.npmrc文件之中。

npm模块就是一个遵循CommonJS规范的JavaScript脚本文件。此外，在模块目录中还必须有一个提供自身信息的package.json文件，一般采用npm init命令生成这个文件。

{% highlight bash %}

npm init

{% endhighlight %}

运行上面的命令，会提示回答一系列问题，结束后自动生成package.json文件。

package.json文件中的main属性，指定模块加载的入口文件，默认是index.js。在index.js文件中，除了模块代码以外，主要使用require命令加载其他模块，使用module.exports变量输出模块接口。

下面是一个例子，将HTML文件中的特殊字符转为HTML实体。

{% highlight javascript %}

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 */
module.exports = {
  escape: function(html) {
    return String(html)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  /**
   * Unescape special characters in the given string of html.
   *
   * @param  {String} html
   * @return {String}
   */
  unescape: function(html) {
    return String(html)
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
};

{% endhighlight %}

完成代码以后，再加一个README.md文件，用来给出说明文本。

最后，使用npm publish命令发布。

{% highlight bash %}

npm publish

{% endhighlight %}

## npm version

`npm version`命令用来修改项目的版本号。

`npm version patch`增加一位补丁号（比如 1.1.1 -> 1.1.2），`npm version minor`增加一位小版本号（比如 1.1.1 -> 1.2.0），`npm version major`增加一位大版本号（比如 1.1.1 -> 2.0.0）。如果在git代码仓库运行`npm version`命令，会同时进行版本commit和tag操作。

## 参考链接

- James Halliday, [task automation with npm run](http://substack.net/task_automation_with_npm_run): npm run命令（package.json文件的script属性）的用法
- Keith Cirkel, [How to Use npm as a Build Tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)
