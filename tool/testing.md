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

## 测试的类型

### 单元测试

单元测试（unit testing）指的是以模块为单位，对软件进行测试。通常来说，单元（unit）指的就是一个纯粹的函数，只要输入不变，必定返回同样的输出。

单元测试通常采取断言（assertion）的形式，也就是测试某个功能的返回结果，是否与预期结果一致。如果与预期不一致，就表示测试失败。

单元测试是函数正常工作、不出错的最基本、最有效的方法之一。 每一个单元测试发出一个特定的输入到所要测试的函数，看看函数是否返回预期的输出，或者采取了预期的行动。单元测试证明了所测试的代码行为符合预期。

单元测试有助于代码的模块化，因此有助于长期的重用。因为有了测试，你就知道代码是可靠的，可以按照预期运行。从这个角度说，测试可以节省开发时间。单元测试的另一个好处是，有了测试，就等于就有了代码功能的文档，有助于其他开发者了解代码的意图。

单元测试应该避免依赖性问题，比如不存取数据库、不访问网络等等，而是使用工具虚拟出运行环境。这种虚拟使得测试成本最小化，不用花大力气搭建各种测试环境。

单元测试的步骤

- 准备所有的测试条件
- 调用（触发）所要测试的函数
- 验证运行结果是否正确
- 还原被修改的记录

### 集成测试

集成测试（Integration test）指的是多个部分在一起测试，比如在一个测试数据库上，测试数据库连接模块。

### 功能测试

功能测试（Functional test）指的是，自动测试整个应用程序的某个功能，比如使用Selenium工具自动打开浏览器运行程序。

## 开发模式

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

BDD接口提供以下四个方法。

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

## 断言

断言是判断实际值与预期值是否相等的工具。

断言有assert、expext、should三种风格，或者称为三种写法。

```javascript
// assert风格
assert.equal(event.detail.item, '(item).);

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

Mocha是一个测试框架，也就是运行测试的工具。它使用下面的命令安装。

```bash
$ npm install -g mocha
```

Mocha自身不带断言库，所以还需要安装一个断言库，这里选用Chai.js。

```bash
$ npm install -g chai
```

Mocha默认执行test目录的脚本文件，所以我们将所有测试脚本放在test子目录。
