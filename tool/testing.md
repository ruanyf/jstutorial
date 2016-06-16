---
title: JavaScript 程序测试
category: tool
layout: page
date: 2015-06-08
modifiedOn: 2015-06-08
---

## 为什么要写测试？

Web应用程序越来越复杂，这意味着有更多的可能出错。测试是帮助我们提高代码质量、降低错误的最好方法和工具之一。

- 测试可以确保得到预期结果。
- 加快开发速度。
- 方便维护。
- 提供用法的文档。

通过测试提供软件的质量，在开始的时候，可能会降低开发速度。但是从长期看，尤其是那种代码需要长期维护、不断开发的情况，测试会大大加快开发速度，减轻维护难度。

## 测试的类型

### 单元测试

单元测试（unit testing）指的是以软件的单元（unit）为单位，对软件进行测试。单元可以是一个函数，也可以是一个模块或组件。它的基本特征就是，只要输入不变，必定返回同样的输出。

“单元测试”这个词，本身就暗示，软件应该以模块化结构存在。每个模块的运作，是独立于其他模块的。一个软件越容易写单元测试，往往暗示着它的模块化结构越好，各模块之间的耦合就越弱；越难写单元测试，或者每次单元测试，不得不模拟大量的外部条件，很可能暗示软件的模块化结构越差，模块之间存在较强的耦合。

单元测试的要求是，每个模块都必须有单元测试，而软件由模块组成。

单元测试通常采取断言（assertion）的形式，也就是测试某个功能的返回结果，是否与预期结果一致。如果与预期不一致，就表示测试失败。

单元测试是函数正常工作、不出错的最基本、最有效的方法之一。 每一个单元测试发出一个特定的输入到所要测试的函数，看看函数是否返回预期的输出，或者采取了预期的行动。单元测试证明了所测试的代码行为符合预期。

单元测试有助于代码的模块化，因此有助于长期的重用。因为有了测试，你就知道代码是可靠的，可以按照预期运行。从这个角度说，测试可以节省开发时间。单元测试的另一个好处是，有了测试，就等于就有了代码功能的文档，有助于其他开发者了解代码的意图。

单元测试应该避免依赖性问题，比如不存取数据库、不访问网络等等，而是使用工具虚拟出运行环境。这种虚拟使得测试成本最小化，不用花大力气搭建各种测试环境。

一般来说，单元测试的步骤如下。

- 准备所有的测试条件
- 调用（触发）所要测试的函数
- 验证运行结果是否正确
- 还原被修改的记录

### 其他测试类型

（1）集成测试

集成测试（Integration test）指的是多个部分在一起测试，比如测试一个数据库连接模块，是否能够连接数据库。

（2）功能测试

功能测试（Functional test）指的是，自动测试整个应用程序的某个功能，比如使用Selenium工具自动打开浏览器运行程序。

（3）端对端测试

端对端测试（End-to-End testing）指的是全链路测试，即从开始端到终止端的测试，比如测试从用户界面、通过网络、经过应用程序处理、到达数据库，是否能够返回正确结果。端对端测试的目的是，确保整个系统能够正常运行，各个子系统之间依赖关系正常，数据能够在子系统之间、模块之间正确传递。

（4）冒烟测试

冒烟测试（smoke testing）指的是，正式的全面测试开始之前，对主要功能进行的预测试。它的主要目的是，确认主要功能能否满足需要，软件是否能运行。冒烟测试可以是手工测试，也可以是自动化测试。

这个名字最早来自对电子元件的测试，第一次对电子元件通电，看看它是否会冒烟。如果没有冒烟，说明通过了测试；如果电流达到某个临界点之后，才出现冒烟，这时可以评估是否能够接受这个临界点。

## 开发模式

测试不仅能够验证软件功能、保证代码质量，也能够影响软件开发的模式。

### TDD

TDD是“测试驱动的开发”（Test-Driven Development）的简称，指的是先写好测试，然后再根据测试完成开发。使用这种开发方式，会有很高的测试覆盖率。

TDD的开发步骤如下。

- 先写一个测试。
- 写出最小数量的代码，使其能够通过测试。
- 优化代码。
- 重复前面三步。

TDD开发的测试覆盖率通常在90%以上，这意味着维护代码和新增特性会非常容易。因为测试保证了你可以信任这些代码，修改它们不会破坏其他代码的运行。

TDD接口提供以下四个方法。

- suite()
- test()
- setup()
- teardown()

下面代码是测试计数器是否加1。

```javascript
suite('Counter', function() {
  test('tick increases count to 1', function() {
    var counter = new Counter();
    counter.tick();
    assert.equal(counter.count, 1);
  });
});
```

### BDD

BDD是“行为驱动的开发”（Behavior-Driven Development）的简称，指的是写出优秀测试的最佳实践的总称。

BDD认为，不应该针对代码的实现细节写测试，而是要针对行为写测试。BDD测试的是行为，即软件应该怎样运行。

BDD接口提供以下六个方法。

- describe()
- it()
- before()
- after()
- beforeEach()
- afterEach()

下面是测试计数器是否加1的BDD写法。

```javascript
describe('Counter', function() {
  it('should increase count by 1 after calling tick', function() {
    var counter = new Counter();
    var expectedCount = counter.count + 1;
    counter.tick();
    assert.equal(counter.count, expectedCount);
  });
});
```

下面是一个BDD开发的示例。现在，需要开发一个`Foo`类，该类的实例有一个`sayHi`方法，会对类参数说“Hi”。这就是`Foo`类的规格，根据这个规格，我们可以写出测试用例文件`foo.spec.js`。

```javascript
describe('Simple object', function() {
  var foo;

  beforeEach(function() {
    foo = new Foo('John');
  });

  it('should say hi', function() {
    expect(foo.sayHi()).toEqual('John says hi!');
  });
});
```

有了测试用例以后，我们再写出实际的脚本文件`foo.js`。

```javascript
function Foo(name) {
  this.name = name;
}

Foo.prototype.sayHi = function() {
  return this.name + ' says hi!';
};
```

为了把测试用例与脚本文件分开，我们通常把测试用例放在`test`子目录之中。然后，我们就可以使用Mocha、Jasmine等测试框架，执行测试用例，看看脚本文件是否通过测试。

### BDD术语

（1）测试套件

测试套件（test suite）指的是，一组针对软件规格的某个方面的测试用例。也可以看作，对软件的某个方面的描述（describe）。

测试套件由一个`describe`函数构成，它接受两个参数：第一个参数是字符串，表示测试套件的名字或标题，表示将要测试什么；第二个参数是函数，用来实现这个测试套件。

```javascript
describe("A suite", function() {
  // ...
});
```

（2）测试用例

测试用例（test case）指的是，针对软件一个功能点的测试，是软件测试的最基本单位。一组相关的测试用例，构成一个测试套件。测试用例由`it`函数构成，它与`describe`函数一样，接受两个参数：第一个参数是字符串，表示测试用例的标题；第二个参数是函数，用来实现这个测试用例。

```javascript
describe("A suite", function() {
  it("contains spec with an expectation", function() {
    // ...
  });
});
```

（3）断言

断言（assert）指的是对代码行为的预期。一个测试用例内部，包含一个或多个断言（assert）。

断言会返回一个布尔值，表示代码行为是否符合预期。测试用例之中，只要有一个断言为false，这个测试用例就会失败，只有所有断言都为`true`，测试用例才会通过。

```javascript
describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});
```

## 断言

断言是判断实际值与预期值是否相等的工具。

断言有assert、expect、should三种风格，或者称为三种写法。

```javascript
// assert风格
assert.equal(event.detail.item, '(item)‘);

// expect风格
expect(event.detail.item).to.equal('(item)');

// should风格
event.detail.item.should.equal('(item)');
```

Chai.js是一个很流行的断言库，同时支持上面三种风格。

（1） assert风格

```javascript
var assert = require('chai').assert;
var foo = 'bar';
var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

assert.typeOf(foo, 'string', 'foo is a string');
assert.equal(foo, 'bar', 'foo equal `bar`');
assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');
```

上面代码中，assert方法的最后一个参数是错误提示信息，只有测试没有通过时，才会显示。

（2）expect风格

```javascript
var expect = require('chai').expect;
var foo = 'bar';
var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

expect(foo).to.be.a('string');
expect(foo).to.equal('bar');
expect(foo).to.have.length(3);
expect(beverages).to.have.property('tea').with.length(3);
```

（3）should风格

```javascript
var should = require('chai').should();
var foo = 'bar';
var beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

foo.should.be.a('string');
foo.should.equal('bar');
foo.should.have.length(3);
beverages.should.have.property('tea').with.length(3);
```

## Mocha.js

### 概述

Mocha（发音“摩卡”）是现在最流行的前端测试框架之一，此外常用的测试框架还有[Jasmine](http://jasmine.github.io/)、[Tape](https://github.com/substack/tape/)、[zuul](https://github.com/defunctzombie/zuul/)等。所谓“测试框架”，就是运行测试的工具。

Mocha使用下面的命令安装。

```bash
# 全局安装
$ npm install -g mocha chai

# 项目内安装
$ npm i -D mocha chai
```

上面代码中，除了安装Mocha以外，还安装了断言库`chai`，这是因为Mocha自身不带断言库，必须安装外部断言库。

测试套件文件一般放在`test`子目录下面，配置文件`mocha.opts`也放在这个目录里面。

### 浏览器测试

使用浏览器测试时，先用`mocha init`命令在指定目录生成初始化文件。

```bash
$ mocha init <path>
```

运行上面命令，就会在该目录下生成一个`index.html`文件，以及配套的脚本和样式表。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Unit.js tests in the browser with Mocha</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="mocha.css" />
  </head>
  <body>
    <h1>Unit.js tests in the browser with Mocha</h1>
    <div id="mocha"></div>
    <script src="mocha.js"></script>
    <script>
      mocha.setup('bdd');
    </script>
    <script src="tests.js"></script>
    <script>
      mocha.run();
    </script>
  </body>
</html>
```

然后在该文件中，加入你要测试的文件（比如`app.js`）、测试脚本（`app.spec.js`）和断言库（`chai.js`）。

```html
<script src="app.js"></script>
<script src="http://chaijs.com/chai.js"></script>
<script src="app.spec.js"></script>
```

各个文件的内容如下。

```javascript
// app.js
function add(x, y){
  return x + y;
}

// app.spec.js
var expect = chai.expect;

describe('测试add函数', function () {
  it('1加1应该等于2', function () {
    expect(add(1, 1)).to.equal(2);
  });
});
```

### 命令行测试

Mocha除了在浏览器运行，还可以在命令行运行。

还是使用上面的文件，作为例子，但是要改成CommonJS格式。

```javascript
// app.js
function add(x, y){
  return x + y;
}

module.exports = add;

// app.spec.js
var expect = require('chai').expect;
var add = require('../app');

describe('测试add函数', function () {
  it('1加1应该等于2', function () {
    expect(add(1, 1)).to.equal(2);
  });
});
```

然后，在命令行下执行`mocha`，就会执行测试。

```bash
$ mocha
```

上面的命令等同于下面的形式。

```bash
$ mocha test --reporter spec --recursive --growl
```

### mocha.opts

所有Mocha的命令行参数，都可以写在`test`目录下的配置文件`mocha.opts`之中。

下面是一个典型的配置文件。

```javascript
--reporter spec
--recursive
--growl
```

上面三个设置的含义如下。

- 使用spec报告模板
- 包括子目录
- 打开桌面通知插件growl

如果希望测试非存放于test子目录的测试用例，可以在`mocha.opts`写入以下内容。

```bash
server-tests
--recursive
```

上面代码指定运行`server-tests`目录及其子目录之中的测试脚本。

### 生成规格文件

Mocha支持从测试用例生成规格文件。

```bash
$ mocha test/app.spec.js -R markdown > spec.md
```

上面命令生成单个`app.spec.js`规格。

生成HTML格式的报告，使用下面的命令。

```bash
$ mocha test/app.spec.js -R doc > spec.html
```

如果要生成整个`test`目录，对应的规格文件，使用下面的命令。

```bash
$ mocha test -R markdown > spec.md --recursive
```

只要提供测试脚本的路径，Mocha就可以运行这个测试脚本。

```javascript
$ mocha -w src/index.test.js
```

上面命令运行测试脚本`src/index.test.js`，参数`-w`表示watch，即当这个脚本一有变动，就会运行。

指定测试脚本时，可以使用通配符，同时指定多个文件。

```bash
$ mocha --reporter spec spec/{my,awesome}.js
$ mocha --ui tdd test/unit/*.js etc
```

上面代码中，参数`--reporter`指定生成的报告格式（上面代码是spec格式），`-ui`指定采用哪一种测试模式（上面代码是tdd模式）。

除了使用shell通配符，还可以使用node通配符。

```bash
$ mocha --compilers js:babel-core/register 'test/**/*.@(js|jsx)'
```

上面代码指定运行`test`目录下面任何子目录中，文件后缀名为`js`或`jsx`的测试脚本。注意，Node的通配符要放在单引号之中，因为否则星号（`*`）会先被shell解释。

如果要改用shell通配符，执行`test`目录下面任何子目录的测试脚本，要写成下面这样。

```bash
$ mocha test/**.js
```

如果测试脚本不止一个，最好将它们放在专门的目录当中。Mocha默认执行`test`目录的测试脚本，所以可以将所有测试脚本放在`test`子目录。`--recursive`参数可以指定运行子目录之中的测试脚本。

```bash
$ mocha --recursive
```

上面命令会运行`test`子目录之中的所有测试脚本。

`--grep`参数用于搜索测试用例的名称（即it方法的第一个参数），然后只执行匹配的测试用例。

```bash
$ mocha --reporter spec --grep "Fnord:" server-test/*.js
```

上面代码只测试名称中包含“Fnord：”的测试用例。

`--invert`参数表示只运行不符合条件的测试脚本。

```bash
$ mocha --grep auth --invert
```

如果测试脚本用到了ES6语法，还需要用`--compiler`参数指定babel进行转码。

```bash
$ mocha --compilers js:babel/register --recursive
```

上面命令会在运行测试脚本之前，先用Babel进行转码。`--compilers`参数的值是用冒号分隔的一个字符串，冒号左边是文件的后缀名，右边是用来处理这一类文件的模块名。上面代码表示，运行测试之前，先用`babel/register`模块，处理一下JS文件。

`--require`参数指定测试脚本默认包含的文件。下面是一个`test_helper.js`文件。

```javascript
// test/test_helper.js
import chai from 'chai';
```

使用`--require`参数，将上面这个脚本包含进所有测试脚本。

```bash
$ mocha --compilers js:babel/register --require ./test/test_helper.js  --recursive
```

### 测试脚本的写法

测试脚本中，describe方法和it方法都允许调用only方法，表示只运行某个测试套件或测试用例。

```javascript
// 例一
describe('Array', function(){
  describe.only('#indexOf()', function(){
    ...
  });
});

// 例二
describe("using only", function() {
  it.only("this is the only test to be run", function() {

  });

  it("this is not run", function() {

  });
});
```

上面代码中，只有带有`only`方法的测试套件或测试用例会运行。

describe方法和it方法还可以调用skip方法，表示跳过指定的测试套件或测试用例。

```javascript
// 例一
describe.skip('Article', function() {
  // ...
});

// 例二
describe("using only", function() {
  it.skip("this is the only test to be run", function() {

  });

  it("this is not run", function() {

  });
});
```

上面代码中，带有`skip`方法的测试套件或测试用例会被忽略。

如果测试用例包含异步操作，可以done方法显式指定测试用例的运行结束时间。

```javascript
it('logs a', function(done) {
  var f = function(){
    console.log('logs a');
    done();
  };
  setTimeout(f, 500);
});
```

上面代码中，正常情况下，函数f还没有执行，Mocha就已经结束运行了。为了保证Mocha等到测试用例跑完再结束运行，可以手动调用done方法

## Promise的测试

对于异步的测试，测试用例之中，通常必须调用`done`方法，显式表明异步操作的结束。

```javascript
var expect = require('chai').expect;

it('should do something with promises', function(done) {
  var result = asyncTest();

  result.then(function(data) {
    expect(data).to.equal('foobar');
    done();
  }, function(error) {
    assert.fail(error);
    done();
  });
});
```

上面代码之中，Promise对象的`then`方法之中，必须指定`reject`时的回调函数，并且使用`assert.fail`方法抛出错误，否则这个错误就不会被外界感知。

```javascript
result.then(function(data) {
  expect(data).to.equal(blah);
  done();
});
```

上面代码之中，如果Promise被`reject`，是不会被捕获的，因为Promise之中的错误，不会”泄漏“到外界。

Mocha内置了对Promise的支持。

```javascript
it('should fail the test', function() {
  var p = Promise.reject('Promise被reject');

  return p;
});
```

上面代码中，Mocha能够捕获`reject`的Promise。

因此，使用Mocha时，Promise的测试可以简化成下面的写法。

```javascript
var expect = require('chai').expect;

it('should do something with promises', function() {
  var result = asyncTest();

  return result.then(function(data) {
    expect(data).to.equal('foobar');
  });
});
```

## 模拟数据

单元测试时，很多时候，测试的代码会请求HTTP服务器。这时，我们就需要模拟服务器的回应，不能在单元测试时去请求真实服务器数据，否则就不叫单元测试了，而是连同服务器一起测试了。

一些工具库可以模拟服务器回应。

- [nock](https://github.com/pgte/nock)
- [sinon](http://sinonjs.org/docs/#server)
- [faux-jax](https://github.com/algolia/faux-jax)
- [MITM](https://github.com/moll/node-mitm)

## 覆盖率

测试的覆盖率需要安装istanbul模块。

```bash
$ npm i -D istanbul
```

然后，在package.json设置运行覆盖率检查的命令。

```javascript
"scripts": {
  "test:cover": "istanbul cover -x *.test.js _mocha -- -R spec src/index.test.js",
  "check-coverage": "istanbul check-coverage --statements 100 --branches 100 --functions 100 --lines 100"
}
```

上面代码中，`test:cover`是生成覆盖率报告，`check-coverage`是设置覆盖率通过的门槛。

然后，将`coverage`目录写入`.gitignore`防止连这个目录一起提交。

如果希望在`git commit`提交之前，先运行一次测试，可以安装ghooks模块，配置`pre-commit`钩子。

安装ghooks。

```bash
$ npm i -D ghooks
```

在package.json之中，配置`pre-commit`钩子。

```javascript
"config": {
  "ghooks": {
    "pre-commit": "npm run test:cover && npm run check-coverage"
  }
}
```

还可以把覆盖率检查，加入`.travis.yml`文件。

```bash
script:
  - npm run test:cover
  - npm run check-coverage
```

如果测试脚本使用ES6，`scripts`字段还需要加入Babel转码。

```javascript
"scripts": {
  "test": "mocha src/index.test.js -w --compilers js:babel/register",
  "test:cover": "istanbul cover -x *.test.js _mocha -- -R spec src/index.test.js --compilers js:babel/register"
}
```

覆盖率报告可以上传到[codecov.io](https://codecov.io/)。先安装这个模块。

```bash
$ npm i -D codecov.io
```

然后在package.json增加一个字段。

```javascript
"scripts": {
  "report-coverage": "cat ./coverage/lcov.info | codecov"
}
```

最后，在CI的配置文件`.travis.yml`之中，增加运行这个命令。

```
after_success:
  - npm run report-coverage
  - npm run semantic-release
```

## WebDriver

WebDriver是一个浏览器的自动化框架。它在各种浏览器的基础上，提供一个统一接口，将接收到的指令转为浏览器的原生指令，驱动浏览器。

WebDriver由Selenium项目演变而来。Selenium是一个测试自动化框架，它的1.0版叫做Selenium RC，通过一个代理服务器，将测试脚本转为JavaScript脚本，注入不同的浏览器，再由浏览器执行这些脚本后返回结果。WebDriver就是Selenium 2.0，它对每个浏览器提供一个驱动，测试脚本通过驱动转换为浏览器原生命令，在浏览器中执行。

### 定制测试环境

DesiredCapabilities对象用于定制测试环境。

- 定制DesiredCapabilities对象的各个属性
- 创建DesiredCapabilities实例
- 将DesiredCapabilities实例作为参数，新建一个WebDriver实例

### 操作浏览器的方法

WebDriver提供以下方法操作浏览器。

close()：退出或关闭当前浏览器窗口。

```javascript
driver.close();
```

quit()：关闭所有浏览器窗口，中止当前浏览器driver和session。

```javascript
driver.quit();
```

getTitle()：返回当前网页的标题。

```javascript
driver.getTitle();
```

getCurrentUrl()：返回当前网页的网址。

```javascript
driver.getCurrentUrl();
```

getPageSource()：返回当前网页的源码。

```javascript
// 断言是否含有指定文本
assert(driver.getPageSource().contains("Hello World"),
  "预期含有文本Hello World");
```

click()：模拟鼠标点击。

```javascript
// 例一
driver.findElement(By.locatorType("path"))
  .click();

// 例二
driver.get("https://www.google.com");
driver.findElement(By.name("q"))
  .sendKeys("webDriver");
driver.findElement(By.id("sblsbb"))
  .click();
```

clear()：清空文本输入框。

```javascript
// 例一
driver.findElement(By.locatorType("path")).clear();

// 例二
driver.get("https://www.google.com");
driver.findElement(By.name("q"))
  .sendKeys("webDriver");
driver.findElement(By.name("q"))
  .clear();
driver.findElement(By.name("q"))
  .sendKeys("testing");
```

sendKeys()：在文本输入框输入文本。

```javascript
driver.findElement(By.locatorType("path"))
  .sendKeys("your text");
```

submit()：提交表单，或者用来模拟按下回车键。

```javascript
// 例一
driver.findElement(By.locatorType("path"))
  .submit();

// 例二
driver.get("https://www.google.com");
driver.findElement(By.name("q"))
  .sendKeys("webdriver");
element.submit();
```

findElement()：返回选中的第一个元素。

```javascript
driver.get("https://www.google.com");
driver.findElement(By.id("lst-ib"));
```

findElements()：返回选中的所有元素（0个或多个）。

```javascript
// 例一
driver.findElement(By.id("searchbox"))
  .sendKeys("webdriver");
driver.findElements(By.xpath("//div[3]/ul/li"))
  .get(0)
  .click();

// 例二
driver.findElements(By.tagName("select"))
  .get(0)
  .findElements(By.tagName("option"))
  .get(3)
  .click()
  .get(4)
  .click()
  .get(5)
  .click();

// 例三：获取页面所有链接
var links = driver
  .get("https://www.google.com")
  .findElements(By.tagName("a"));
var linkSize = links.size();
var linksSrc = [];

console.log(linkSize);

for(var i=0;i<linkSize;i++) {
  linksSrc[i] = links.get(i).getAttribute("href");
}

for(int i=0;i<linkSize;i++){
  driver.navigate().to(linksSrc[i]);
  Thread.sleep(3000);
}
```

可以使用`size()`，查看到底选中了多少个元素。

### 网页元素的定位

WebDriver提供8种定位器，用于定位网页元素。

- By.id：HTML元素的id属性
- By.name：HTML元素的name属性
- By.xpath：使用XPath语法选中HTML元素
- By.cssSelector：使用CSS选择器语法
- By.className：HTML元素的class属性
- By.linkText：链接文本（只用于选中链接）
- By.tagName：HTML元素的标签名
- By.partialLinkText：部分链接文本（只用于选中链接）

下面是一个使用id定位器，选中网页元素的例子。

```javascript
driver.findElement(By.id("sblsbb")).click();
```

### 网页元素的方法

以下方法属于网页元素的方法，而不是webDriver实例的方法。需要注意的是，有些方法是某些元素特有的，比如只有文本框才能输入文字。如果在网页元素上调用不支持的方法，WebDriver不会报错，也不会给出给出任何提示，只会静静地忽略。

getAttribute()：返回网页元素指定属性的值。

```javascript
driver.get("https://www.google.com");
driver.findElement(By.xpath("//div[@id='lst-ib']"))
  .getAttribute("class");
```

getText()：返回网页元素的内部文本。

```javascript
driver.findElement(By.locatorType("path")).getText();
```

getTagName()：返回指定元素的标签名。

```javascript
driver.get("https://www.google.com");
driver.findElement(By.xpath("//div[@class='sbib_b']"))
  .getTagName();
```

isDisplayed()：返回一个布尔值，表示元素是否可见。

```javascript
driver.get("https://www.google.com");
assert(driver.findElement(By.name("q"))
  .isDisplayed(),
  '搜索框应该可选择');
```

isEnabled()：返回一个布尔值，表示文本框是否可编辑。

```javascript
driver.get("https://www.google.com");
var Element = driver.findElement(By.name("q"));
if (Element.isEnabled()) {
  driver.findElement(By.name("q"))
    .sendKeys("Selenium Essentials");
} else {
  throw new Error();
}
```

isSelected()：返回一个布尔值，表示一个元素是否可选择。

```javascript
driver.findElement(By.xpath("//select[@name='jump']/option[1]"))
  .isSelected()
```

getSize()：返回一个网页元素的宽度和高度。

```javascript
var dimensions=driver.findElement(By.locatorType("path"))
  .getSize(); 
dimensions.width;
dimensions.height;
```

getLocation()：返回网页元素左上角的x坐标和y坐标。

```javascript
var point = driver.findElement(By.locatorType("path")).getLocation();
point.x; // 等同于 point.getX();
point.y; // 等同于 point.getY();
```

getCssValue()：返回网页元素指定的CSS属性的值。

```javascript
driver.get("https://www.google.com");
var element = driver.findElement(By.xpath("//div[@id='hplogo']"));
console.log(element.getCssValue("font-size"));
console.log(element.getCssValue("font-weight"));
console.log(element.getCssValue("color"));
console.log(element.getCssValue("background-size"));
```

### 页面跳转的方法

以下方法用来跳转到某一个页面。

get()：要求浏览器跳到某个网址。

```javascript
driver.get("URL");
```

navigate().back()：浏览器回退。

```javascript
driver.navigate().back();
```

navigate().forward()：浏览器前进。

```javascript
driver.navigate().forward();
```

navigate().to()：跳转到浏览器历史中的某个页面。

```javascript
driver.navigate().to("URL");
```

navigate().refresh()：刷新当前页面。

```javascript
driver.navigate().refresh();
// 等同于
driver.navigate()
  .to(driver.getCurrentUrl());
// 等同于
driver.findElement(By.locatorType("path"))
  .sendKeys(Keys.F5);
```

### cookie的方法

getCookies()：获取cookie

```javascript
driver.get("https://www.google.com");
driver.manage().getCookies();
```

getCookieNamed() ：返回指定名称的cookie。

```javascript
driver.get("https://www.google.com");
console.log(driver.manage().getCookieNamed("NID"));
```

addCookie()：将cookie加入当前页面。

```javascript
driver.get("https://www.google.com");
driver.manage().addCookie(cookie0);
```

deleteCookie()：删除指定的cookie。

```javascript
driver.get("https://www.google.co.in");
driver.manage().deleteCookieNamed("NID");
```

### 浏览器窗口的方法

maximize()：最大化浏览器窗口。

```javascript
var driver = new FirefoxDriver();
driver.manage().window().maximize();
```

getSize()：返回浏览器窗口、图像、网页元素的宽和高。

```javascript
driver.manage().window().getSize();
```

getPosition()：返回浏览器窗口左上角的x坐标和y坐标。

```javascript
console.log("Position X: " + driver.manage().window().getPosition().x);
console.log("Position Y: " + driver.manage().window().getPosition().y);
console.log("Position X: " + driver.manage().window().getPosition().getX());
console.log("Position Y: " + driver.manage().window().getPosition().getY());
```

setSize()：定制浏览器窗口的大小。

```javascript
var d = new Dimension(320, 480);
driver.manage().window().setSize(d);
driver.manage().window().setSize(new Dimension(320, 480));
```

setPosition()：移动浏览器左上角到指定位置。

```javascript
var p = new Point(200, 200);
driver.manage().window().setPosition(p);
driver.manage().window().setPosition(new Point(300, 150));
```

getWindowHandle()：返回当前浏览器窗口。

```javascript
var parentwindow = driver.getWindowHandle();
driver.switchTo().window(parentwindow);
```

getWindowHandles()：返回所有浏览器窗口。

```javascript
var childwindows =  driver.getWindowHandles();
driver.switchTo().window(childwindow);
```

switchTo.window()：在浏览器窗口之间切换。

```javascript
driver.SwitchTo().Window(childwindow);
driver.close();
driver.SwitchTo().Window(parentWindow);
```

### 弹出窗口

以下方法处理浏览器的弹出窗口。

dismiss() ：关闭弹出窗口。

```javascript
var alert = driver.switchTo().alert();
alert.dismiss();
```

accept()：接受弹出窗口，相当于按下接受OK按钮。

```javascript
var alert = driver.switchTo().alert();
alert.accept();
```

getText()：返回弹出窗口的文本值。

```javascript
var alert = driver.switchTo().alert();
alert.getText();
```

sendKeys()：向弹出窗口发送文本字符串。

```javascript
var alert = driver.switchTo().alert();
alert.sendKeys("Text to be passed");
```

authenticateUsing()：处理HTTP认证。

```javascript
var user = new UserAndPassword("USERNAME", "PASSWORD");
alert.authenticateUsing(user);
```

### 鼠标和键盘的方法

以下方法模拟鼠标和键盘的动作。

- click()：鼠标在当前位置点击。
- clickAndHold()：按下鼠标不放
- contextClick()：右击鼠标
- doubleClick()：双击鼠标
- dragAndDrop()：鼠标拖放到目标元素
- dragAndDropBy()：鼠标拖放到目标坐标
- keyDown()：按下某个键
- keyUp()：从按下状态释放某个键
- moveByOffset()：移动鼠标到另一个坐标位置
- moveToElement()：移动鼠标到另一个网页元素
- release()：释放拖拉的元素
- sendKeys()：控制键盘输出

## 参考链接

- Jani Hartikainen, [http://www.sitepoint.com/promises-in-javascript-unit-tests-the-definitive-guide/](http://www.sitepoint.com/promises-in-javascript-unit-tests-the-definitive-guide/)
