---
title: JavaScript解释器
layout: page
category: advanced
date: 2016-07-06
createdOn: 2016-07-06
---

JavaScript解释器的作用，是执行JavaScript源码。它通常可以包含四个组成部分。

- 词法分析器（Lexical Analyser）
- 句法解析器（Syntax Parser）
- 字节码生成器（Bytecode generator）
- 字节码解释器（Bytecode interpreter）

## 词法分析器

词法分析器的作用，是将一行行的源码拆解成一个个词义单位（token）。所谓“词义单位”，指的是语法上不可能再分的、最小的单个字符或字符组合。

首先，词法分析器会扫描（scanning）代码，提取词义单位；然后，会进行评估（evaluating），判断词义单位属于哪一类的值。

```javascript
var sum = 30;

// 词法分析后的结果
[
  "var" : "keyword",
  "sum" : "identifier",
  "="   : "assignment",
  "30"  : "integer",
  ";"   : "eos" (end of statement)
]
```

上面代码中，源代码经过词法分析后，返回一组词义单位，以及它们各自的词类。

## 句法解析器

句法解析器的作用，是将上一步生成的数组，根据语法规则，转为抽象语法树（Abstract Syntax Tree，简称AST）。如果源码符合语法规则，这一步就会顺利完成，生成一个抽象语法树；如果源码存在语法错误，这一步就会终止，抛出一个“语法错误”。

```javascript
{
  operation: "=",
  left: {
    keyword: "var",
    right: "sum"
  }
  right: "30"
}
```

上面代码中，抽象语法树的一个节点是赋值操作符（=），它两侧的词义单位，分别成左侧子节点和右侧子节>点。

通常，这一步是整个JavaScript代码执行过程中最慢的。

## 字节码生成器

字节码生成器的作用，是将抽象语法树转为JavaScript引擎可以执行的二进制代码。目前，还没有统一的JavaScript字节码的格式标准，每种JavaScript引擎都有自己的字节码格式。最简单的做法，就是将语义单位翻成对应的二进制命令。

## 字节码解释器

字节码解释器的作用是读取并执行字节码。
