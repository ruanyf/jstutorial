---
title: 导论
layout: page
category: introduction
date: 2013-10-06
modifiedOn: 2014-01-09
---

## 内容简介

本教程全面介绍JavaScript核心语法（ECMAScript 5.1版本），从最简单的开始讲起，循序渐进、由浅入深，力求清晰易懂。所有章节都带有大量的代码实例，便于理解和模仿，可以用到实际项目中，即学即用。

更新的ES6 / ES7语法请参考我写的[《ECMAScript 6入门》](http://es6.ruanyifeng.com/)。

## JavaScript是什么？

JavaScript是一种轻量级的脚本语言，可以部署在多种环境，最常见的部署环境就是浏览器。所谓“脚本语言”，指的是它不具备开发操作系统的能力，而是只用来编写控制其他大型应用程序的“脚本”。

本质上，JavaScript语言是一种“对象模型”。各种部署环境通过这个模型，描述自己的功能和操作接口，从而通过JavaScript控制这些功能。

JavaScript的核心部分相当精简，只包括两个部分：基本的语法构造（比如操作符、控制结构、语句）和标准库（就是一系列具有各种功能的对象比如`Array`、`Date`、`Math`等）。

除此之外，各种部署环境提供额外的API（即只能在某个环境使用的接口），以便JavaScript调用。如果部署环境是浏览器，提供的额外API可以分成三大类：浏览器控制类、DOM类、Web类。浏览器控制类的接口用来操作浏览器，DOM类的接口用来操作网页的各种元素，Web类的接口用来实现互联网的各种功能。如果部署环境是服务器，则会提供各种操作系统的API，比如文件操作API、网络通信API等等，现在最流行的JavaScript服务器环境是Node。

本教程主要介绍JavaScript语言和网页开发的基本知识，可以分成以下五大部分。

- 基本语法
- 标准库
- 浏览器API
- DOM
- Web API

服务器环境的编程，将有单独的Node教程。

## 为什么学习JavaScript？

JavaScript语言有一些显著特点，使得它非常值得学习。它既适合当作学习编程的入门语言，也适合当作日常开发的工作语言。它是目前最有希望、前途最光明的计算机语言之一。

### 操控浏览器的能力

JavaScript的发明目的，就是作为浏览器的内置脚本语言，为网页开发者提供操控浏览器的能力。它是目前唯一一种通用的浏览器脚本语言，所有浏览器都支持。它可以让网页呈现各种特殊效果，为用户提供良好的互动体验。

目前，全世界几乎所有网页都使用JavaScript。如果不用，网站的易用性和使用效率将大打折扣，无法成为操作便利、对用户友好的网站。

对于一个互联网开发者来说，如果你想提供漂亮的网页、令用户满意的上网体验、各种基于浏览器的便捷功能、前后端之间紧密高效的联系，JavaScript是必不可少的工具。

### 广泛的使用领域

近年来，JavaScript的使用范围，慢慢超越了浏览器，正在向通用的系统语言发展。

**（1）浏览器的平台化**

随着HTML 5的出现，浏览器本身的功能越来越强，不再仅仅能浏览网页，而是越来越像一个平台，JavaScript因此得以调用许多系统功能，比如操作本地文件、操作图片、调用摄像头和麦克风等等。这使得JavaScript可以完成许多以前无法想象的事情。

**（2）Node.js**

Node.js项目使得JavaScript可以用于开发服务器端的大型项目，网站的前后端都用JavaScript开发已经成为了现实。有些嵌入式平台（Raspberry Pi）能够安装Node.js，于是JavaScript就能为这些平台开发应用程序。

**（3）数据库操作**

JavaScript甚至也可以用来操作数据库。NoSQL数据库这个概念，本身就是在JSON（JavaScript Object Notation，JavaScript对象表示法）格式的基础上诞生的，大部分NoSQL数据库允许JavaScript直接操作。基于SQL语言的开源数据库PostgreSQL支持JavaScript作为操作语言，可以部分取代SQL查询语言。

**（4）跨移动平台**

JavaScript也正在成为手机应用的开发语言。一般来说，安卓平台使用Java语言开发，iOS平台使用Objective-C或Swift语言开发。许多人正在努力，让JavaScript成为各个平台的通用开发语言。

PhoneGap项目就是将JavaScript和HTML5打包在一个容器之中，使得它能同时在iOS和安卓上运行。Facebook的React Native项目则是将JavaScript写的组件，编译成原生组件，从而使它们具备优秀的性能。

Mozilla基金会的手机操作系统Firefox OS，更是直接将JavaScript作为操作系统的平台语言。

**（5）内嵌脚本语言**

越来越多的应用程序，将JavaScript作为内嵌的脚本语言，比如Adobe公司的著名PDF阅读器Acrobat、Linux桌面环境GNOME 3。

**（6）跨平台的桌面应用程序**

Chromium OS、Windows 8等操作系统直接支持JavaScript编写应用程序。Mozilla的Open Web Apps项目、Google的[Chrome App项目](http://developer.chrome.com/apps/about_apps)、Github的[Electron项目](http://electron.atom.io/)、以及[TideSDK项目](http://www.tidesdk.org/)，都可以用来编写运行于Windows、Mac OS和Android等多个桌面平台的程序，不依赖浏览器。

**（7）小结**

可以预期，JavaScript最终将能让你只用一种语言，就开发出适应不同平台（包括桌面端、服务器端、手机端）的程序。根据2013年9月的[统计](http://adambard.com/blog/top-github-languages-for-2013-so-far/)，JavaScript是本年度代码托管网站Github上使用量排名第一的语言。

著名程序员Jeff Atwood甚至提出了一条[“Atwood定律”](http://www.codinghorror.com/blog/2007/07/the-principle-of-least-power.html)：

> “所有可以用JavaScript编写的程序，最终都会出现JavaScript的版本。”(Any application that can be written in JavaScript will eventually be written in JavaScript.)

### 易学性

相比学习其他语言，学习JavaScript有一些有利条件。

**（1）学习环境无处不在**

只要有浏览器，就能运行JavaScript程序；只要有文本编辑器，就能编写JavaScript程序。这意味着，几乎所有电脑都原生提供JavaScript学习环境，不用另行安装复杂的IDE（集成开发环境）和编译器。

**（2）简单性**

相比其他脚本语言（比如Python或Ruby），JavaScript的语法相对简单一些，本身的语法特性并不是特别多。而且，那些语法中的复杂部分，也不是必需要学会。你完全可以只用简单命令，完成大部分的操作。

**（3）与主流语言的相似性**

JavaScript的语法很类似C/C++和Java，如果学过这些语言（事实上大多数学校都教），JavaScript的入门会非常容易。

必须说明的是，虽然核心语法不难，但是JavaScript的复杂性体现在另外两个方面。

首先，它涉及大量的外部API。JavaScript要发挥作用，必须与其他组件配合，这些外部组件五花八门，数量极其庞大，几乎涉及网络应用的各个方面，掌握它们绝非易事。

其次，JavaScript语言有一些设计缺陷。某些地方相当不合理，另一些地方则会出现怪异的运行结果。学习JavaScript，很大一部分时间是用来搞清楚哪些地方有陷阱。Douglas Crockford写过一本有名的书，名字就叫[《JavaScript: The Good Parts》](http://javascript.crockford.com/)，言下之意就是这门语言不好的地方很多，必须写一本书才能讲清楚。另外一些程序员则感到，为了更合理地编写JavaScript程序，就不能用JavaScript来写，而必须发明新的语言，比如CoffeeScript、TypeScript、Dart这些新语言的发明目的，多多少少都有这个因素。

尽管如此，目前看来，JavaScript的地位还是无法动摇。加之，语言标准的快速进化，使得JavaScript功能日益增强，而语法缺陷和怪异之处得到了弥补。所以，JavaScript还是值得学习，况且它的入门真的不难。

### 强大的性能

JavaScript的性能优势体现在以下方面。

**（1）灵活的语法，表达力强。**

JavaScript既支持类似C语言清晰的过程式编程，也支持灵活的函数式编程。可以用来写并发处理（concurrent）。这些语法特性已经被证明非常强大，可以用于许多场合，尤其适用非同步编程。

JavaScript的所有值都是对象，这为程序员提供了灵活性和便利性。因为你可以很方便地、按照需要随时创造数据结构，不用进行麻烦的预定义。

JavaScript的标准还在快速进化中，并不断合理化，并添加更适用的语法特性。

**（2）支持编译运行。**

JavaScript语言本身，虽然是一种解释型语言，但是在现代浏览器中，JavaScript都是编译后运行。程序会被高度优化，运行效率接近二进制程序。而且，JavaScript引擎正在快速发展，性能将越来越好。

**（3）事件驱动和非阻塞式设计。**

JavaScript程序可以采用事件驱动（event-driven）和非阻塞式（non-blocking）设计，在服务器端适合高并发环境，普通的硬件就可以承受很大的访问量。

### 开放性

JavaScript是一种开放的语言。它的标准是国际标准，写得非常详尽明确；主要的设计和实现都是开放的，而且质量很高；不属于任何公司或个人，不存在版权和专利的问题。

行业内的主要公司都支持它，单单是解释器就有好几个品种，兼容性很好，不做调整或只做很小的调整，它编写的程序就能在所有浏览器上运行。

### 社区支持和就业机会

全世界程序员都在使用JavaScript，它有着极大的社区、广泛的文献和图书、丰富的代码资源。绝大部分你需要用到的功能，都有多个开源函数库可供选用。

作为项目负责人，你不难招聘到数量众多的JavaScript程序员；作为开发者，你也不难找到一份JavaScript的工作。

## 实验环境

JavaScript的上手非常方便，只要电脑安装了浏览器，就可以用来实验了。只要打开Chrome浏览器的“开发者工具”（Developer Tools），就可以在它的“控制台”（console）运行JavaScript代码。

进入“控制台”，有两种方法。

- 快捷键。在Chrome浏览器中，直接按`Option + Command + J`（Mac）或者`Ctrl + Shift + J`（Windows/Linux）。

- 菜单。从“工具”（Tools）菜单中打开“开发者工具”，然后点击Console选项卡。“开发者工具”的快捷键是F12，或者`Option + Command + I`（Mac）以及`Ctrl + Shift + I`（Windows/Linux）。

进入控制台以后，就可以在提示符后输入代码，然后按`Enter`键，代码就会执行。如果按`Shift + Enter`键，就是代码换行，不会触发执行。建议阅读本教程时，将代码复制到控制台进行实验。

将下面的程序复制到“控制台”，按下回车后，就可以看到运行结果。

```javascript
function greetMe(yourName) {
  console.log('Hello ' + yourName);
}

greetMe('World')
// Hello World
```

## 自序

我想写这本教程，主要原因是自己需要。

编程时，往往需要查阅资料，确定准确用法。理想的JavaScript参考书，应该简明易懂，一目了然，告诉我有哪些注意点，提供代码范例。涉及重要概念，还应该适当讲解。可是大多数时候，现实都不是如此。找到的资料冗长难懂，抓不住重点，有时还很陈旧，跟不上语言标准和浏览器的快速发展，且大多数是英文资料。

学习过程中，我做了很多JavaScript笔记。多年累积，数量相当庞大。遇到问题，我首先查自己的笔记，如果笔记里没有，再到网上查，最后回过头把笔记补全。终于有一天，我意识到可以把笔记做成书，这就是这本教程的由来。

我是为自己写这本书的，我想用自己的语言叙述JavaScript，按照自己的方式编排章节，便于将来的查阅。当然，另一个写作动力是觉得这些内容对他人有用，毕竟我花了那么多时间，整理成书可以节省其他人的时间。

正因为脱胎于笔记，这本教程跟其他JavaScript书籍有所不同。

- 它有点像教程，包含重要概念的简洁讲解，努力把复杂的问题讲得简单，希望一两分钟内就能抓住重点。

- 它又有点像参考手册，罗列主要用法和各种API接口，并给出可以立即运行的代码。所有章节按主题编排，不完全按照由浅入深的学习顺序编排，这是为了方便查阅。

- 它主要关注编程实战遇到的问题，从语言本身到浏览器接口都涉及，容易出错的一些细节尤其讲得多。

## 许可证

本教程采用创意共享[“署名—非商业性使用”](http://javascript.ruanyifeng.com/introduction/license.html)许可证（Creative Commons Attribution-NonCommercial license）。所有内容不仅可以免费阅读，还可以自由使用（比如转载），只需遵守两个条件：

- **署名**：必须保留原作者的署名。

- **非商业性使用**：除非得到正式许可，否则不得用于商业目的。

事实上，你还可以得到这本教程的源码。它就放在[Github](https://github.com/ruanyf/jstutorial)上，欢迎克隆和提交Pull Request。

## 参考书目

写作过程中，我参考了以下书籍（排名不分先后）。

- Nicholas C. Zakas, [Professional JavaScript for Web Developers](http://www.amazon.com/Professional-JavaScript-Developers-Nicholas-Zakas/dp/1118026691), 3 edition, Wrox, 2012
- Axel Rauschmayer, [The Past, Present, and Future of JavaScript](http://oreilly.com/javascript/radarreports/past-present-future-javascript.html), O'Reilly, 2012
- Cody Lindley, [JavaScript Enlightenment](http://www.javascriptenlightenment.com/), O'Reilly, 2012
- Cody Lindley, [DOM Enlightenment](http://domenlightenment.com/), O'Reilly, 2013
- Rebecca Murphey, [jQuery Fundamentals](http://github.com/rmurphey/jqfundamentals), 2011
- Aaron Frost, [JS.next: A Manager’s Guide](http://chimera.labs.oreilly.com/books/1234000001623), O'Reilly, 2013
- John Resig, Bear Bibeault, [Secrets of the JavaScript Ninja](http://www.manning.com/resig/), Manning, 2012

- Eric Elliott, [Programming JavaScript Applications](http://chimera.labs.oreilly.com/books/1234000000262), O'Reilly, 2013
- 邱俊涛, [JavaScript核心概念及实践](http://icodeit.org/jsccp/)，人民邮电出版社，2013
