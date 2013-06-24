---
title: JavaScript的历史
layout: page
category: introduction
date: 2013-01-10
modifiedOn: 2013-06-21
---

## 互联网的起源

1990年底，欧洲核能研究组织（CERN）科学家Tim Berners-Lee，在互联网的基础上，发明了万维网（World Wide Web），从此可以在网上浏览网页。

最早的网页只能在操作系统的终端里面浏览，不是很方便。1992年底，美国国家超级电脑应用中心（NCSA）开始开发一个独立的浏览器，叫做Mosaic。这是人类历史上第一个浏览器。

1994年10月，NCSA的一个主要程序员Marc Andreessen联合风险投资家Jim Clark，成立了Mosaic通信公司（Mosaic Communications），不久后改名为Netscape。这家公司的目的，就是在Mosaic的基础上，开发面向普通用户的新一代的浏览器Netscape Navigator。

1994年12月，Navigator发布了1.0版，市场份额超过90%。

## JavaScript的诞生

Netscape公司很快发现，Navigator浏览器需要一种可以嵌入网页的脚本语言，用来控制浏览器行为。

当时，网速很慢而且上网费很贵，有些操作不宜在服务器端完成。比如，如果用户忘记填写“用户名”，就点了“发送”按钮，到服务器再发现这一点就有点太晚了，最好能在用户发出数据之前，就告诉用户“请填写xx栏”。这就需要网页中嵌入小程序，让浏览器检查每一栏是否都填写了。

管理层对这种浏览器脚本语言的设想是：

- 功能不需要太强，语法较为简单，容易学习和部署。
- 随着Java的兴起，Netscape公司同意将Java嵌入浏览器。因此，脚本语言的语法要接近Java，并且可以支持Java程序。

这些设想直接排除了使用现存语言，比如perl、python和TCL。

1995年，Netscape公司雇佣了程序员Brendan Eich开发这种网页脚本语言。Brendan Eich有很强的函数式编程背景，希望以Scheme语言（函数式语言鼻祖LISP语言的一种方言）为蓝本，实现这种新语言。

1995年5月，Brendan Eich只用了10天，就设计完成了这种语言的第一版。它的语法有多个来源：

- C语言的基本语法。
- Scheme语言（Lisp语言的一种方言）的函数式用法，包括闭包。
- Self语言（Smalltalk的一种变种）的原型继承模式。

## 起名

它的最初名字叫做Mocha，9月份的时候改为LiveScript。12月，Netscape公司与Sun公司（Java语言的发明者和所有者）签署授权协议，后者同意将这种语言叫做JavaScript。

之所以起这个名字，并不是因为JavaScript本身与Java语言有多么深的关系（事实上，两者关系并不深），而是因为Netscape公司已经决定，使用Java语言开发网络应用程序，JavaScript可以像胶水一样，将各个部分连接起来。当然，后来的历史是Java语言的浏览器插件（applet）失败了，JavaScript反而发扬光大。

## 发布

1995年12月，Netscape公司与Sun公司一起发布了JavaScript。

1996年3月，Navigator 2.0浏览器正式内置了JavaScript脚本语言。

## 标准化

1996年8月，微软模仿JavaScript开发了一种相近的语言，取名为JScript（JavaScript是Netscape的注册商标，微软不能用），首先内置于IE 3.0。网景公司面临丧失浏览器脚本语言的主导权的局面。

1996年11月，网景公司决定将JavaScript提交给国际标准化组织ECMA，希望JavaScript能够成为国际标准，以此抵抗微软。

1997年7月，ECMA组织发布262号标准文件（ECMA-262），规定了浏览器脚本语言的标准，并将这种语言称为ECMAScript。这个版本就是ECMAScript 1.0版。之所以不叫JavaScript，一方面是由于商标的关系，另一方面也是想体现这门语言的制定者是ECMA，也不是网景公司。因此，ECMAScript和Javascript的关系是，前者是后者的规格，后者是前者的一种实现。日常的场合，这两个词是可以互换的。

1998年6月，ECMAScript 2.0版发布。

1999年12月，ECMAScript 3.0版发布，成为JavaScript的通行标准，得到了广泛支持。

2008年7月，由于太过激进，ECMA开会决定，中止ECMAScript 4.0版的开发，将其中一些比较温和的设想扩大范围，放入ECMAScript第五版，而其他激进的设想放入更以后的JavaScript版本，由于会议的气氛，新项目代号起名为Harmony（和谐）。

2009年9月，ECMAScript 5.0版正式发布。Harmony项目则一分为二，一些较为可行的设想定名为Javascript.next继续开发，可能将会演变成ECMAScript第6版；一些不是很成熟的设想，则被视为JavaScript.next.next，在更远的将来再考虑推出。

2011年6月，ECMAscript 5.1版发布，并且成为ISO国际标准（ISO/IEC 16262:2011）。

目前，ECMA的第39号技术专家委员会（Technical Committee 39，简称TC39）负责制订该标准，成员包括Michosoft、Mozilla、Google等。TC39的计划是，ECMAScript第五版与ECMAScript第三版基本保持兼容，较大的语法修正和新功能加入，将由Javascript.next完成。预计在2013年的年底，Javascript.next将完成，发布成为ECMAScript第六版，而Harmony将是next的超集，包含更多的功能。 

同时，TC39也预计，ECMAScript第五版将在2013年的年中成为Javascript开发的主流标准，并在今后五年中一直保持这个位置。

## 浏览器支持

Netscape公司将JavaScript标准化的同时，在内部依然使用自己的版本号。

1996年3月，Navigator 2.0内置了JavaScript 1.0。

1996年8月，Navigator 3.0内置了JavaScript 1.1。

1997年6月，Navigator 4.0内置了JavaScript 1.2。

1998年10月，Navigator 4.06内置了JavaScript 1.3。

1999年，Netscape服务器版提供JavaScript 1.4。

2000年11月，Navigator 6.0内置了JavaScript 1.5。

2005年11月，Firefox 1.5内置了JavaScript 1.6。

2006年10月，Firfox 2.0内置了JavaScript 1.7。

2008年6月，Firefox 3.0内置了JavaScript 1.8。

JavaScript 1.1版对应ECMAScript 1.0版，但是直到JavaScript 1.4版才完全兼容ECMAScript 1.0版，JavaScript 1.5版完全兼容ECMAScript 3.0版。目前的版本是JavaScript 1.8版，完全兼容ECMAScript 第五版。

截止2013年初，所有浏览器的最新版本——Chrome 24，Firefox 19，IE 10.0，Opera 12，Safari 6——都支持ECMAScript 5.1版。

## 周边大事记

1997年，DHTML（Dynamic HTML，动态HTML）发布，允许动态改变网页内容。这标志着DOM模式（Document Object Model，文档对象模型）正式应用。

1999年，IE 5部署了XMLHttpRequest接口，允许Javascript发出HTTP请求，为后来大行其道的ajax应用创造了条件。

2001年，Douglas Crockford提出了JSON格式，用于取代XML格式，进行服务器和网页之间的数据交换。Javascript可以原生支持这种格式，不需要额外部署。

2004年，Dojo框架诞生，为不同浏览器提供了同一接口，并为主要功能提供了便利的调用接口。这标志着Javascript编程框架的时代开始来临。

2005年，Ajax方法（Asynchronous Javascript and XML）正式诞生，标志是2月份发布的Google Maps项目大量采用该方法。它几乎成了新一代网站的标准方法，促成了Web 2.0时代的来临。

2005年，Apache基金会发布了CouchDB数据库。这是一个基于JSON格式的数据库，可以用Javascript函数定义视图和索引。它在本质上有别于传统的关系型数据库，标识着NoSQL类型的数据库诞生。

2006年，jQuery函数库诞生，它为操纵网页DOM结构提供了非常强大易用的接口，成为了使用最广泛的函数库，并且让Javascript语言的应用难度大大降低，推动了这种语言的流行。

2006年，Google推出 Google Web Toolkit 项目（缩写为GWT），提供Java编译成JavaScript的功能，开创了将其他语言转为JavaScript的先河。

2007年，Webkit引擎在iPhone手机中得到部署。它最初基于KDE项目，2003年苹果公司首先采用，2005年开源。这标志着Javascript语言开始能在手机中使用了，意味着有可能写出在桌面电脑和手机中都能使用的程序。

2008年，V8编译器诞生。这是Google公司为Chrome浏览器而开发的，它的特点是让Javascript的运行变得非常快。这提高了Javascript的性能，推动了语法的改进和标准化，改变外界对Javascript不佳的印象。同时，V8是开源的，任何人想要一种快速的嵌入式脚本语言，都可以采用V8，这拓展了Javascript的应用领域。

2009年，Node.js项目诞生，标志着Javascript可以用于服务器端编程，从此网站的前端和后端可以使用同一种语言开发。并且，Node.js可以承受很大的并发流量，使得开发某些互联网大规模的实时应用变得容易。

2009年，Jeremy Ashkenas发布了CoffeeScript的最初版本。CoffeeScript可以被转化为JavaScript运行，但是语法要比JavaScript简洁。这开启了其他语言转为JavaScript的风潮。

2011年，Google发布了Dart语言，目的是为了结束JavaScript语言在浏览器中的垄断，提供更合理、更强大的语法和功能。Chromium浏览器有内置的Dart虚拟机，可以运行Dart程序，但Dart程序也可以被编译成JavaScript程序运行。

2011年，微软工程师[Scott Hanselman](http://www.hanselman.com/blog/JavaScriptIsAssemblyLanguageForTheWebSematicMarkupIsDeadCleanVsMachinecodedHTML.aspx)提出，JavaScript将是互联网的汇编语言。因为它无所不在，而且正在变得越来越快。其他语言的程序可以被转成JavaScript语言，然后在浏览器中运行。

2012年，微软发布TypeScript语言。该语言被设计成JavaScript的超集，这意味着所有JavaScipt程序，都可以不经修改地在TypeScript中运行。同时，TypeScript添加了很多新的语法特性，主要目的是为了开发大型程序，然后还可以被编译成JavaScript运行。

2012年，Mozilla基金会提出[asm.js](http://asmjs.org/)规格。asm.js是JavaScript的一个子集，所有符合asm.js的程序都可以在浏览器中运行，它的特殊之处在于语法有严格限定，可以被快速编译成性能良好的机器码。这样做的目的，是为了给其他语言提供一个编译规范，使其可以被编译成高效的JavaScript代码。同时，Mozilla基金会还发起了[Emscripten](https://github.com/kripken/emscripten/wiki)项目，目标就是提供一个跨语言的编译器，能够将LLVM的位代码（bitcode）转为JavaScript代码，在浏览器中运行。因为大部分LLVM位代码都是从C / C++语言生成的，这意味着C / C++将可以在浏览器中运行。此外，Mozilla旗下还有[LLJS](http://mbebenita.github.io/LLJS/)（将JavaScript转为C代码）项目和[River Trail](https://github.com/RiverTrail/RiverTrail/wiki)（一个用于多核心处理器的ECMAScript扩展）项目。 

## 参考链接

- Axel Rauschmayer, [The Past, Present, and Future of JavaScript](http://oreilly.com/javascript/radarreports/past-present-future-javascript.csp)
- John Dalziel, [The race for speed part 4: The future for JavaScript](http://creativejs.com/2013/06/the-race-for-speed-part-4-the-future-for-javascript/)

