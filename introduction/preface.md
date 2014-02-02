---
title: 前言
layout: page
category: introduction
date: 2013-10-06
modifiedOn: 2014-01-09
---

## 起因

我想写这本书，主要原因是自己需要。

编程时，往往需要查阅资料，确定准确用法。理想的JavaScript参考书，应该简明易懂，一目了然，告诉我有哪些注意点，提供代码范例。涉及重要概念，还应该适当讲解。可是大多数时候，现实都不是如此。找到的资料冗长难懂，抓不住重点，有时还很陈旧，跟不上语言标准和浏览器的快速发展，且大多数是英文资料。

学习过程中，我做了很多JavaScript笔记。多年累积，数量相当庞大。遇到问题，我首先查自己的笔记，如果笔记里没有，再到网上查，最后回过头把笔记补全。终于有一天，我意识到可以把笔记做成书，这就是这本教程的由来。

我是为自己写这本书的，我想用自己的语言叙述JavaScript，按照自己的方式编排章节，便于将来的查阅。当然，另一个写作动力是觉得这些内容对他人有用，毕竟我花了那么多时间，整理成书可以节省其他人的时间。

正因为脱胎于笔记，这本书跟其他JavaScript书籍有所不同。

- 它有点像教程，包含重要概念的简洁讲解，努力把复杂的问题讲得简单，希望一两分钟内就能抓住重点。

- 它又有点像参考手册，罗列主要用法和各种API接口，并给出可以立即运行的代码。所有章节按主题编排，不完全按照由浅入深的学习顺序编排，这是为了方便查阅。

- 它主要关注编程实战遇到的问题，从语言本身到浏览器接口都涉及，容易出错的一些细节尤其讲得多。

考虑到这本书有参考手册的性质，所以书名加了“参考”（reference）两个字。至于书名中的“标准”，指的是全书以JavaScript的国际标准（standard）为依据。

## 写作目标

本书主要针对Web前端开发，以ECMAScript 5作为标准，目标是所讲的内容在实际开发之中基本够用，力求5-10年之内不会过时。

全书的内容比较广泛，只要是实战中用得到的东西都有涉及（核心语法、标准库、DOM、浏览器模型、外部代码库、开发工具等等）。全书的难度为中级，比较适合对JavaScript已经有所了解、想进一步深入学习的读者，英语中称为“高级初学者”（advanced beginner），但是也照顾到入门者的需要，从最简单的开始讲起，循序渐进、由浅入深。另一方面，对于中级开发者，这本书也是有用的，它可以帮你系统地复习和巩固JavaScript语言知识，你会发现这门语言有许多地方是你以前没有注意到的。

在写作风格上，力求做到清晰易懂，具有可读性。所有章节都带有大量的代码实例，这不仅是为了便于理解和模仿，也是为了随时可以用到实际项目中，做到即学即用。

由于本书选择以ECMAScript 5为标准，意味着不支持许多老式浏览器，其中最主要的就是IE6-8。如果用一句话来表达，就是本书不支持IE 8。这样做虽然会丧失一些实用性和兼容性，但是我认为，有利于保持行文的流畅和内容的清晰，可以使读者更好地掌握JavaScript。而且从历史角度看，坚持书写符合语言标准的代码，将在长期中获得回报。如果你的项目需要支持这些老式浏览器，你可能需要检查用到的每一个语法特性的适用性，找出替代方案。

## 开源许可

本书采用创意共享[“署名—非商业性使用”](http://javascript.ruanyifeng.com/introduction/license.html)许可证（Creative Commons Attribution-NonCommercial license）。所有内容不仅可以免费阅读，还可以自由使用（比如转载），只需遵守两个条件：

- **署名**：必须保留原作者的署名。

- **非商业性使用**：除非得到正式许可，否则不得用于商业目的。

事实上，你还可以得到这本书的源码。它就放在[Github](https://github.com/ruanyf/jstutorial)上，欢迎克隆和提交Pull Request。

## 试验环境

本书采用Google的V8引擎作为JavaScript的标准实现，所有示例都以V8引擎的运行结果为准。

阅读之前，请确认已安装基于V8引擎的Chrome浏览器，它附带的“开发者工具”（Developer Tools）就是本书的标准实验环境，可以在其中的“控制台”（console）运行书中的代码。

进入“控制台”，有两种方法。

- 在Chrome浏览器中，直接按Option + Command + J（Mac）或者Ctrl + Shift + J（Windows/Linux）。

- 从“工具”（Tools）菜单中打开“开发者工具”，然后点击Console选项卡。“开发者工具”的快捷键是F12，或者Option + Command + I（Mac）以及Ctrl+Shift+I（Windows/Linux）。

进入控制台以后，就可以在提示符后输入代码，然后按Enter键，代码就会执行。如果按Shift+Enter键，就是代码换行，不会触发执行。建议阅读本书时，将代码复制到控制台进行实验。

## 参考书目

本书的写作过程中，参考了以下书籍（排名不分先后）。

- Nicholas C. Zakas, [Professional JavaScript for Web Developers](http://www.amazon.com/Professional-JavaScript-Developers-Nicholas-Zakas/dp/1118026691), 3 edition, Wrox, 2012

- Axel Rauschmayer, [The Past, Present, and Future of JavaScript](http://oreilly.com/javascript/radarreports/past-present-future-javascript.html), O'Reilly, 2012

- Cody Lindley, [JavaScript Enlightenment](http://www.javascriptenlightenment.com/), O'Reilly, 2012

- Cody Lindley, [DOM Enlightenment](http://domenlightenment.com/), O'Reilly, 2013

- Rebecca Murphey, [jQuery Fundamentals](http://github.com/rmurphey/jqfundamentals), 2011

- Aaron Frost, [JS.next: A Manager’s Guide](http://chimera.labs.oreilly.com/books/1234000001623), O'Reilly, 2013

- John Resig, Bear Bibeault, [Secrets of the JavaScript Ninja](http://www.manning.com/resig/), Manning, 2012

- Eric Elliott, [Programming JavaScript Applications](http://chimera.labs.oreilly.com/books/1234000000262), O'Reilly, 2013

- 邱俊涛, [JavaScript核心概念及实践](http://icodeit.org/jsccp/)，人民邮电出版社，2013
