---
title: Javascript的历史
layout: page
category: introduction
date: 2013-01-10
modifiedOn: 2013-01-13
---

## 诞生

1995年，Netscape公司的Navigator浏览器主载了90%的市场，急需一种可以让网页控制浏览器行为的语言。管理层对浏览器脚本语言的设想是：

- 功能不需要太强，语法较为简单，容易学习和部署。
- 语法接近Java，并且可以支持Java程序。

这些设想直接排除了使用现存语言，比如perl、python和TCL。

Netscape公司雇佣了Brendan Eich开发这种语言。1995年5月，Brendan Eich只用了10天，就设计完成了这种语言的第一版。它的语法有多个来源：

- C语言的基本语法。
- Scheme语言（Lisp语言的一种方言）的函数式用法，包括闭包。
- Self语言（Smalltalk的一种变种）的原型继承模式。

## 起名

它的最初名字叫做Mocha，9月份的时候改为LiveScript。12月，Netscape公司与Sun公司（Java语言的发明者和所有者）签署授权协议，后者同意将这种语言叫做Javascript。

之所以起这个名字，并不是因为Javascript本身与Java语言有多么深的关系（事实上，两者关系并不深），而是因为Netscape公司已经决定，使用Java语言开发网络应用程序，Javascript可以像胶水一样，将各个部分连接起来。当然，后来的历史是Java语言的浏览器插件（applet）失败了，Javascript反而发扬光大。

## 发布

1995年12月，Netscape公司与Sun公司一起发布了JavaScript。

1996年3月，Navigator 2.0浏览器正式内置了Javascript脚本语言。

## 标准化

1996年8月，微软模仿Javascript，在IE 3.0内置了JScript。网景公司面临丧失浏览器脚本语言的主导权的局面。

1996年11月，网景公司决定将Javascript提交给国际标准化组织ECMA，希望Javascript能够成为国际标准，以此抵抗微软。

1997年7月，ECMA组织发布262号标准文件（ECMA-262），规定了浏览器脚本语言的标准，并将这种语言称为ECMAScript。因此，ECMAScript和Javascript的关系是，前者是后者的规格，后者是前者的一种实现。

1999年12月，ECMAScript第3版推出，成为Javascript的通行标准，得到了广泛支持。

2008年7月，由于太过激进，ECMA开会决定，中止ECMAScript第4版的开发，将其中一些比较温和的设想扩大范围，放入ECMAScript第五版，而其他激进的设想放入更以后的Javascript版本。由于会议的气氛，新项目代号起名为Harmony（和谐）。

2009年9月，Harmony项目中比较成熟的部分，作为ECMAScript第5版正式发布。剩下的没有完成的部分，定名为Javascript.next继续开发。

2011年6月，ECMAscript 5.1发布，并且成为ISO国际标准（ISO/IEC 16262:2011）。

目前，ECMA的第39号技术专家委员会（Technical Committee 39，简称TC39）负责制订该标准，成员包括Michosoft、Mozilla、Google等。TC39的计划是，ECMAScript第五版与第三版基本保持兼容，较大的语法修正和新功能加入，将由Javascript.next完成。预计在2013年的年底，Javascript.next将完成，发布成为ECMAScript第六版。 

同时，TC39也预计，ECMAScript第五版将在2013年的年中成为Javascript开发的主流标准，并在今后五年中一直保持这个位置。

## 大事记

1997年，DHTML（Dynamic HTML，动态HTML）发布，允许动态改变网页内容。这标志着DOM模式（Document Object Model，文档对象模型）正式应用。

1999年，IE 5部署了XMLHttpRequest接口，允许Javascript发出HTTP请求，为后来大行其道的ajax应用创造了条件。

2001年，Douglas Crockford提出了JSON格式，用于取代XML格式，进行服务器和网页之间的数据交换。Javascript可以原生支持这种格式，不需要额外部署。

2004年，Dojo框架诞生，为不同浏览器提供了同一接口，并为主要功能提供了便利的调用接口。这标志着Javascript编程框架的时代开始来临。

2005年，Ajax方法（Asynchronous Javascript and XML）正式诞生，标志是2月份发布的Google Maps项目大量采用该方法。它几乎成了新一代网站的标准方法，促成了Web 2.0时代的来临。

2005年，Apache基金会发布了CouchDB数据库。这是一个基于JSON格式的数据库，可以用Javascript函数定义视图和索引。它在本质上有别于传统的关系型数据库，标识着NoSQL类型的数据库诞生。

2006年，jQuery函数库诞生，它为操纵网页DOM结构提供了非常强大易用的接口，成为了使用最广泛的函数库，并且让Javascript语言的应用难度大大降低，推动了这种语言的流行。

2007年，Webkit引擎在iPhone手机中得到部署。它最初基于KDE项目，2003年苹果公司首先采用，2005年开源。这标志着Javascript语言开始能在手机中使用了，意味着有可能写出在桌面电脑和手机中都能使用的程序。

2008年，V8编译器诞生。这是Google公司为Chrome浏览器而开发的，它的特点是让Javascript的运行变得非常快。这提高了Javascript的性能，推动了语法的改进和标准化，改变外界对Javascript不佳的印象。同时，V8是开源的，任何人想要一种快速的嵌入式脚本语言，都可以采用V8，这拓展了Javascript的应用领域。

2009年，Node.js项目诞生，标志着Javascript可以用于服务器端编程，从此网站的前端和后端可以使用同一种语言开发。并且，Node.js可以承受很大的并发流量，使得开发某些互联网大规模的实时应用变得容易。

## 参考链接

- Axel Rauschmayer, [The Past, Present, and Future of JavaScript](http://oreilly.com/javascript/radarreports/past-present-future-javascript.csp)


