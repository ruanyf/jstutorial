---
title: JavaScript 运行原理
layout: page
category: bom
date: 2013-03-10
modifiedOn: 2013-03-23
---

## 概述

JavaScript是一种解释型语言，也就是说，它不需要编译，可以由解释器实时运行。这样的好处是运行和修改都比较方便，刷新页面就可以重新解释；缺点是每次运行都要调用解释器，系统开销较大，运行速度慢于编译型语言。

目前的浏览器都将JavaScript进行一定程度的编译，生成类似字节码的中间代码，以提高运行速度。

## JavaScript虚拟机

JavaScript实际上运行在一个虚拟机（Virtual Machine）之上，我们一般也把虚拟机称为JavaScript引擎。与其他语言的虚拟机不同的是，JavaScript虚拟机并不基于字节码，而是基于源码的。只要有可能，就通过JIT（just in time）编译器直接编译运行。这样做的目的，是优化代码、提供性能，因为编译执行比一行行地解释执行要快得多。下面是目前最常见的一些JavaScript虚拟机：

- [Chakra](http://en.wikipedia.org/wiki/Chakra_(JScript_engine\))(Microsoft Internet Explorer)
- [Nitro/JavaScript Core](http://en.wikipedia.org/wiki/WebKit#JavaScriptCore) (Safari)
- [Carakan](http://dev.opera.com/articles/view/labs-carakan/) (Opera)
- [SpiderMonkey](https://developer.mozilla.org/en-US/docs/SpiderMonkey) (Firefox)
- [V8](http://en.wikipedia.org/wiki/V8_(JavaScript_engine\)) (Chrome, Chromium)
