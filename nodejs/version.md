# 版本管理

## 语义版本

npm采用”语义版本“（semver）管理软件包。

所谓语义版本，就是指版本号为`a.b.c`的形式，其中`a`是大版本号，`b`是小版本号，`c`是补丁号。

一个软件发布的时候，默认就是`v1.0.0`版。如果以后发布补丁，就增加最后一位数字，比如`v1.0.1`；如果增加新功能，且不影响原有的功能，就增加中间的数字（即小版本号），比如`v1.1.0`；如果引入的变化，破坏了向后兼容性，就增加第一位数字（即大版本号），比如`v2.0.0`。

注意，如果大版本不到v1.0.0（即v0.x.y）时，不兼容变动应该修改小版本号，即从`v0.4.1`升级到`v0.5.0`。

npm允许使用特殊符号，指定所要使用的版本范围，假定当前版本是1.0.4。

- 只接受补丁包：`1.0`或者`1.0.x`或者`~1.0.4`
- 只接受小版本和补丁包：`1`或者`1.x`或者`^1.0.4`。这是`--save`或`save-dev`安装时，默认的版本范围。
- 接受所有更新：`*` or `x`

对于`~`和`^`，要注意区分。前者表示接受当前小版本（如果省略小版本号，则是当前大版本）的最新补丁包，后者表示接受当前大版本的最新小版本和最新补丁包。

```javascript
~2.2.1 // 接受2.2.1，不接受2.3.0
^2.2.1 // 接受2.2.1和2.3.0

~2.2 // 接受2.2.0和2.2.1，不接受2.3.0
^2.2 // 接受2.2.0、2.2.1和2.3.0

~2 // 接受2.0.0、2.1.0、2.2.0、2.2.1和2.3.0
^2 // 接受2.0.0、2.1.0、2.2.0、2.2.1和2.3.0
```

`npm`默认使用`^`，使用下面的命令，可以改变这个行为。

```bash
$ npm config set save-prefix='~'
```

此外，还可以使用数学运算符（比如`>`、`<`、`=`、`>=`或者`<=`等），指定版本范围。

```javascript
> 2.1
1.0.0 - 1.2.0
> 1.0.0-alpha
>= 1.0.0-rc.0 < 1.0.1
^2 < 2.2 || > 2.3
```

以上都是合法的版本指定方式。

注意，如果使用连字号，它的两端必须有空格，比如`1.0.0 - 2.0.0`。如果不带空格，会被npm理解成预发布的tag，比如`1.0.0-rc.1`。

npm官方提供一个在线工具[semver.npmjs.com](http://semver.npmjs.com/)，可以查看不同语义版本涵盖的版本范围。

## npm version

`npm version`命令用来修改项目的版本号。当你完成代码修改，要发布新版本的时候，就用这个命令更新一下软件的版本。

```bash
$ npm version <update_type> -m "<message>"
```

`npm version`命令更新`package.json`里面的版本号，并且新增一个Git commit记录，以及一个新的Git tag。`-m`参数（或者`--message`）用来指定生成Git commit时的提交说明。

注意，由于要生成Git commit，所以执行这个命令前，当前目录里面的所有变动，都必须要保存进Git，否则会报错。

`npm version`命令可以带有以下参数。

```bash
# 更改为指定的版本号
$ npm version <x.y.z>

# 更改语义版本的大版本、小版本、补丁号
# 举例来说，原版本是1.1.1
# patch 生成 1.1.2
# minor 生成 1.2.0
# major 生成 2.0.0
$ npm version <major|minor|patch>

# 更改语义版本的大版本、小版本、补丁号，并且加上预发号
# 举例来说，原版本是1.5.1
# premajor 生成 v2.0.0-0
# preminor 生成 v1.6.0-0
# prepatch 生成 v1.5.2-0
# prerelease 将原来的预发号加1
$ npm version <premajor|preminor|prepatch|prerelease>
```

下面是一个例子。

```bash
$ npm version patch -m "Version %s - xxxxxx"
```

上面命令的`%s`表示新的版本号。

如果`package.json`的`scripts`属性里面，指定了`preversion`、`version`、`postversion`命令，`npm version`命令会自动执行这些脚本。执行顺序如下。

1. 检查当前目录是否有未提交的文件变动，如果有就报错。
1. 运行`preversion`脚本。该脚本拿到的是旧版本号，典型用途就是运行测试。
1. 增加`package.json`里面的版本号。
1. 运行`version`脚本，此时拿到的是新版本号。
1. 提交commit，并在Git里面生成一个tag。
1. 运行`postversion`脚本，典型用途是推送新生成的commit和tag。

下面是一个例子。

```bash
"scripts": {
  "preversion": "npm test",
  "version": "npm run build && git add -A dist",
  "postversion": "git push && git push --tags && rm -rf build/temp"
}
```

上面代码中，增加版本号之前会运行测试，只有全部通过，才会新增版本号；版本号增加以后，会进行构建，然后将新生成的`dist`目录，加入Git的暂存区；最后，推送到远程仓库，并且删除构建所用的临时目录。

由于更新npm网站的唯一方法，就是发布一个新的版本。因此，除了第一次发布，这个命令与`npm publish`几乎是配套的，先使用它，再使用`npm publish`。

```bash
$ npm version patch -m "Version %s - add sweet badges"$
$ git push && git push --tags (or git push origin master --tags)
$ npm publish
```

## 发布流程

对于大型项目来说，发布一个大版本，大致会经过以下的流程，即预发一些预备版本。

- v0.5.0-alpha1
- v0.5.0-beta1
- v0.5.0-beta2
- v0.5.0-rc1
- v0.5.0-rc2
- v0.5.0

操作步骤如下。

```bash
# 更新版本号
$ npm version 0.5.0-alpha1

# 使用alpha1标签发布该版本
$ npm publish --tag alpha1

# 安装使用该版本
npm i <your package name>@alpha1
```

## 模块标签

npm允许为模块的某个版本，新建一个标签。

```bash
$ npm dist-tag add <pkg>@<version> [<tag>]
```

另一种方法是发布的时候，加上标签。

```bash
$ npm publish --tag=beta
```

有了标签以后，就可以指定安装该标签的版本。

```bash
$ npm install <name>@<tag>
# 或者
$ npm install --tag <tag>
```

常见的标签有`latest`、`stable`、`next`等。

npm默认会为最新一次发布的版本，新建`latest`标签。然后，下载的时候，默认是下载带有`latest`标签的版本。但是，这可能并不是我们想要的行为。比如，当前最新版本是4.2版，然后发布了一个3.6版，`latest`的标签就会打在3.6版上面，用户`npm install`安装的就是这个版本。

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

## npm outdated

`npm outdated`命令列出项目所有依赖的当前版本号与最新版本号，提示你是否需要更新。

```bash
$ npm outdated
Package      Current   Wanted   Latest  Location
glob          5.0.15   5.0.15    6.0.1  test-outdated-output
npm            3.5.1    3.5.2    3.5.1  test-outdated-output
```

每个项目依赖的模块，都会输出三个版本号。`Current`表示当前使用的版本，`Wanted`表示符合预置条件的最新版本，`Latest`表示最新发布的版本。

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

