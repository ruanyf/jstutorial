---
title: JavaScript语言的历史
category: introduction
layout: page
date: 2015-11-21
modifiedOn: 2015-11-21
---

## JavaScript的诞生

JavaScript 因为互联网而生，紧随着浏览器的出现而问世。回顾它的历史，就要从浏览器的历史讲起。

1990年底，欧洲核能研究组织（CERN）科学家Tim Berners-Lee，在全世界最大的电脑网络——互联网的基础上，发明了万维网（World Wide Web），从此可以在网上浏览网页文件。最早的网页只能在操作系统的终端里浏览，也就是说只能使用命令行操作，网页都是在字符窗口中显示，这当然非常不方便。

1992年底，美国国家超级电脑应用中心（NCSA）开始开发一个独立的浏览器，叫做Mosaic。这是人类历史上第一个浏览器，从此网页可以在图形界面的窗口浏览。

1994年10月，NCSA的一个主要程序员Marc Andreessen联合风险投资家Jim Clark，成立了Mosaic通信公司（Mosaic Communications），不久后改名为Netscape。这家公司的方向，就是在Mosaic的基础上，开发面向普通用户的新一代的浏览器Netscape Navigator。

1994年12月，Navigator发布了1.0版，市场份额一举超过90%。

Netscape 公司很快发现，Navigator浏览器需要一种可以嵌入网页的脚本语言，用来控制浏览器行为。当时，网速很慢而且上网费很贵，有些操作不宜在服务器端完成。比如，如果用户忘记填写“用户名”，就点了“发送”按钮，到服务器再发现这一点就有点太晚了，最好能在用户发出数据之前，就告诉用户“请填写用户名”。这就需要在网页中嵌入小程序，让浏览器检查每一栏是否都填写了。

管理层对这种浏览器脚本语言的设想是：功能不需要太强，语法较为简单，容易学习和部署。那一年，正逢Sun公司的Java语言问世，市场推广活动非常成功。Netscape公司决定与Sun公司合作，浏览器支持嵌入Java小程序（后来称为Java applet）。但是，浏览器脚本语言是否就选用Java，则存在争论。后来，还是决定不使用Java，因为网页小程序不需要Java这么“重”的语法。但是，同时也决定脚本语言的语法要接近Java，并且可以支持Java程序。这些设想直接排除了使用现存语言，比如Perl、Python和TCL。

1995年，Netscape公司雇佣了程序员Brendan Eich开发这种网页脚本语言。Brendan Eich有很强的函数式编程背景，希望以Scheme语言（函数式语言鼻祖LISP语言的一种方言）为蓝本，实现这种新语言。

1995年5月，Brendan Eich只用了10天，就设计完成了这种语言的第一版。它是一个大杂烩，语法有多个来源：

- 基本语法：借鉴C语言和Java语言。
- 数据结构：借鉴Java语言，包括将值分成原始值和对象两大类。
- 函数的用法：借鉴Scheme语言和Awk语言，将函数当作第一等公民，并引入闭包。
- 原型继承模型：借鉴Self语言（Smalltalk的一种变种）。
- 正则表达式：借鉴Perl语言。
- 字符串和数组处理：借鉴Python语言。

为了保持简单，这种脚本语言缺少一些关键的功能，比如块级作用域、模块、子类型（subtyping）等等，但是可以利用现有功能找出解决办法。这种功能的不足，直接导致了后来JavaScript的一个显著特点：对于其他语言，你需要学习语言的各种功能，而对于JavaScript，你常常需要学习各种解决问题的模式。而且由于来源多样，从一开始就注定，JavaScript的编程风格是函数式编程和面向对象编程的一种混合体。

Netscape 公司的这种浏览器脚本语言，最初名字叫做 Mocha，1995年9月改为LiveScript。12月，Netscape公司与Sun公司（Java语言的发明者和所有者）达成协议，后者允许将这种语言叫做JavaScript。这样一来，Netscape公司可以借助Java语言的声势，而Sun公司则将自己的影响力扩展到了浏览器。

之所以起这个名字，并不是因为JavaScript本身与Java语言有多么深的关系（事实上，两者关系并不深），而是因为Netscape公司已经决定，使用Java语言开发网络应用程序，JavaScript可以像胶水一样，将各个部分连接起来。当然，后来的历史是Java语言的浏览器插件失败了，JavaScript反而发扬光大。

1995年12月4日，Netscape 公司与 Sun 公司联合发布了 JavaScript 语言。当时的意图是将 JavaScript 作为 Java 的补充，用来操作网页。

1996年3月，Navigator 2.0 浏览器正式内置了 JavaScript 脚本语言。

## JavaScript与ECMAScript的关系

1996年8月，微软模仿JavaScript开发了一种相近的语言，取名为JScript（JavaScript是Netscape的注册商标，微软不能用），首先内置于IE 3.0。Netscape公司面临丧失浏览器脚本语言的主导权的局面。

1996年11月，Netscape公司决定将JavaScript提交给国际标准化组织ECMA（European Computer Manufacturers Association），希望JavaScript能够成为国际标准，以此抵抗微软。ECMA的39号技术委员会（Technical Committee 39）负责制定和审核这个标准，成员由业内的大公司派出的工程师组成，目前共25个人。该委员会定期开会，所有的邮件讨论和会议记录，都是公开的。

1997年7月，ECMA组织发布262号标准文件（ECMA-262）的第一版，规定了浏览器脚本语言的标准，并将这种语言称为ECMAScript。这个版本就是ECMAScript 1.0版。之所以不叫JavaScript，一方面是由于商标的关系，Java是Sun公司的商标，根据一份授权协议，只有Netscape公司可以合法地使用JavaScript这个名字，且JavaScript已经被Netscape公司注册为商标，另一方面也是想体现这门语言的制定者是ECMA，不是Netscape，这样有利于保证这门语言的开放性和中立性。因此，ECMAScript和JavaScript的关系是，前者是后者的规格，后者是前者的一种实现。在日常场合，这两个词是可以互换的。

ECMAScript只用来标准化JavaScript这种语言的基本语法结构，与部署环境相关的标准都由其他标准规定，比如DOM的标准就是由W3C组织（World Wide Web Consortium）制定的。

ECMA-262标准后来也被另一个国际标准化组织ISO（International Organization for Standardization）批准，标准号是ISO-16262。

## JavaScript与Java的关系

JavaScript和Java是两种不一样的语言，但是它们之间存在联系。

JavaScript的基本语法和对象体系，是模仿Java而设计的。但是，JavaScript没有采用Java的静态类型。正是因为JavaScript与Java有很大的相似性，所以这门语言才从一开始的LiveScript改名为JavaScript。基本上，JavaScript这个名字的原意是“很像Java的脚本语言”。

在JavaScript语言中，函数是一种独立的数据类型，以及采用基于原型对象（prototype）的继承链。这是它与Java语法最大的两点区别。JavaScript语法要比Java自由得多。

另外，Java语言需要编译，而JavaScript语言则是运行时由解释器直接执行。

总之，JavaScript的原始设计目标是一种小型的、简单的动态语言，与Java有足够的相似性，使得使用者（尤其是Java程序员）可以快速上手。

## JavaScript的版本

1997年7月，ECMAScript 1.0发布。

1998年6月，ECMAScript 2.0版发布。

1999年12月，ECMAScript 3.0版发布，成为JavaScript的通行标准，得到了广泛支持。

2007年10月，ECMAScript 4.0版草案发布，对3.0版做了大幅升级，预计次年8月发布正式版本。草案发布后，由于4.0版的目标过于激进，各方对于是否通过这个标准，发生了严重分歧。以Yahoo、Microsoft、Google为首的大公司，反对JavaScript的大幅升级，主张小幅改动；以JavaScript创造者Brendan Eich为首的Mozilla公司，则坚持当前的草案。

2008年7月，由于对于下一个版本应该包括哪些功能，各方分歧太大，争论过于激进，ECMA开会决定，中止ECMAScript 4.0的开发（即废除了这个版本），将其中涉及现有功能改善的一小部分，发布为ECMAScript 3.1，而将其他激进的设想扩大范围，放入以后的版本，由于会议的气氛，该版本的项目代号起名为Harmony（和谐）。会后不久，ECMAScript 3.1就改名为ECMAScript 5。

2009年12月，ECMAScript 5.0版正式发布。Harmony项目则一分为二，一些较为可行的设想定名为JavaScript.next继续开发，后来演变成ECMAScript 6；一些不是很成熟的设想，则被视为JavaScript.next.next，在更远的将来再考虑推出。TC39的总体考虑是，ECMAScript 5与ECMAScript 3基本保持兼容，较大的语法修正和新功能加入，将由JavaScript.next完成。当时，JavaScript.next指的是ECMAScript 6。第六版发布以后，将指ECMAScript 7。TC39预计，ECMAScript 5会在2013年的年中成为JavaScript开发的主流标准，并在此后五年中一直保持这个位置。

2011年6月，ECMAscript 5.1版发布，并且成为ISO国际标准（ISO/IEC 16262:2011）。到了2012年底，所有主要浏览器都支持ECMAScript 5.1版的全部功能。

2013年3月，ECMAScript 6草案冻结，不再添加新功能。新的功能设想将被放到ECMAScript 7。

2013年12月，ECMAScript 6草案发布。然后是12个月的讨论期，听取各方反馈。

2015年6月，ECMAScript 6正式发布，并且更名为“ECMAScript 2015”。这是因为TC39委员会计划，以后每年发布一个ECMAScirpt的版本，下一个版本在2016年发布，称为“ECMAScript 2016”。

除了ECMAScript的版本，很长一段时间中，Netscape公司（以及继承它的Mozilla基金会）在内部依然使用自己的版本号。这导致了JavaScript有自己不同于ECMAScript的版本号。1996年3月，Navigator 2.0内置了JavaScript 1.0。JavaScript 1.1版对应ECMAScript 1.0，但是直到JavaScript 1.4版才完全兼容ECMAScript 1.0。JavaScript 1.5版完全兼容ECMAScript 3.0。目前的JavaScript 1.8版完全兼容ECMAScript 5。

## 周边大事记

JavaScript伴随着互联网的发展一起发展。互联网周边技术的快速发展，刺激和推动了JavaScript语言的发展。

1996年，样式表标准CSS第一版发布。

1997年，DHTML（Dynamic HTML，动态HTML）发布，允许动态改变网页内容。这标志着DOM模式（Document Object Model，文档对象模型）正式应用。

1998年，Netscape公司开源了浏览器套件，这导致了Mozilla项目的诞生。几个月后，美国在线（AOL）宣布并购Netscape。

1999年，IE 5部署了XMLHttpRequest接口，允许JavaScript发出HTTP请求，为后来大行其道的Ajax应用创造了条件。

2000年，KDE项目重写了浏览器引擎KHTML，为后来的WebKit和Blink引擎打下基础。这一年的10月23日，KDE 2.0发布，第一次将KHTML浏览器包括其中。

2001年，微软公司时隔5年之后，发布了IE浏览器的下一个版本Internet Explorer 6。这是当时最先进的浏览器，它后来统治了浏览器市场多年。

2001年，Douglas Crockford提出了JSON格式，用于取代XML格式，进行服务器和网页之间的数据交换。JavaScript可以原生支持这种格式，不需要额外部署代码。

2002年，Mozilla项目发布了它的浏览器的第一版，后来起名为Firefox。

2003年，苹果公司发布了Safari浏览器的第一版。

2004年，Google公司发布了Gmail，促成了互联网应用程序（Web Application）这个概念的诞生。由于Gmail是在4月1日发布的，很多人起初以为这只是一个玩笑。

2004年，Dojo框架诞生，为不同浏览器提供了同一接口，并为主要功能提供了便利的调用方法。这标志着JavaScript编程框架的时代开始来临。

2004年，WHATWG组织成立，致力于加速HTML语言的标准化进程。

2005年，苹果公司在KHTML引擎基础上，建立了WebKit引擎。

2005年，Ajax方法（Asynchronous JavaScript and XML）正式诞生，Jesse James Garrett发明了这个词汇。它开始流行的标志是，2月份发布的Google Maps项目大量采用该方法。它几乎成了新一代网站的标准做法，促成了Web 2.0时代的来临。

2005年，Apache基金会发布了CouchDB数据库。这是一个基于JSON格式的数据库，可以用JavaScript函数定义视图和索引。它在本质上有别于传统的关系型数据库，标识着NoSQL类型的数据库诞生。

2006年，jQuery函数库诞生，作者为John Resig。jQuery为操作网页DOM结构提供了非常强大易用的接口，成为了使用最广泛的函数库，并且让JavaScript语言的应用难度大大降低，推动了这种语言的流行。

2006年，微软公司发布IE 7，标志重新开始启动浏览器的开发。

2006年，Google推出 Google Web Toolkit 项目（缩写为GWT），提供Java编译成JavaScript的功能，开创了将其他语言转为JavaScript的先河。

2007年，Webkit引擎在iPhone手机中得到部署。它最初基于KDE项目，2003年苹果公司首先采用，2005年开源。这标志着JavaScript语言开始能在手机中使用了，意味着有可能写出在桌面电脑和手机中都能使用的程序。

2007年，Douglas Crockford发表了名为《JavaScript: The good parts》的演讲，次年由O'Reilly出版社出版。这标志着软件行业开始严肃对待JavaScript语言，对它的语法开始重新认识，

2008年，V8编译器诞生。这是Google公司为Chrome浏览器而开发的，它的特点是让JavaScript的运行变得非常快。它提高了JavaScript的性能，推动了语法的改进和标准化，改变外界对JavaScript的不佳印象。同时，V8是开源的，任何人想要一种快速的嵌入式脚本语言，都可以采用V8，这拓展了JavaScript的应用领域。

2009年，Node.js项目诞生，创始人为Ryan Dahl，它标志着JavaScript可以用于服务器端编程，从此网站的前端和后端可以使用同一种语言开发。并且，Node.js可以承受很大的并发流量，使得开发某些互联网大规模的实时应用变得容易。

2009年，Jeremy Ashkenas发布了CoffeeScript的最初版本。CoffeeScript可以被转化为JavaScript运行，但是语法要比JavaScript简洁。这开启了其他语言转为JavaScript的风潮。

2009年，PhoneGap项目诞生，它将HTML5和JavaScript引入移动设备的应用程序开发，主要针对iOS和Android平台，使得JavaScript可以用于跨平台的应用程序开发。

2009，Google发布Chrome OS，号称是以浏览器为基础发展成的操作系统，允许直接使用JavaScript编写应用程序。类似的项目还有Mozilla的Firefox OS。

2010年，三个重要的项目诞生，分别是NPM、BackboneJS和RequireJS，标志着JavaScript进入模块化开发的时代。

2011年，微软公司发布Windows 8操作系统，将JavaScript作为应用程序的开发语言之一，直接提供系统支持。

2011年，Google发布了Dart语言，目的是为了结束JavaScript语言在浏览器中的垄断，提供更合理、更强大的语法和功能。Chromium浏览器有内置的Dart虚拟机，可以运行Dart程序，但Dart程序也可以被编译成JavaScript程序运行。

2011年，微软工程师[Scott Hanselman](http://www.hanselman.com/blog/JavaScriptIsAssemblyLanguageForTheWebSematicMarkupIsDeadCleanVsMachinecodedHTML.aspx)提出，JavaScript将是互联网的汇编语言。因为它无所不在，而且正在变得越来越快。其他语言的程序可以被转成JavaScript语言，然后在浏览器中运行。

2012年，单页面应用程序框架（single-page app framework）开始崛起，AngularJS项目和Ember项目都发布了1.0版本。

2012年，微软发布TypeScript语言。该语言被设计成JavaScript的超集，这意味着所有JavaScipt程序，都可以不经修改地在TypeScript中运行。同时，TypeScript添加了很多新的语法特性，主要目的是为了开发大型程序，然后还可以被编译成JavaScript运行。

2012年，Mozilla基金会提出[asm.js](http://asmjs.org/)规格。asm.js是JavaScript的一个子集，所有符合asm.js的程序都可以在浏览器中运行，它的特殊之处在于语法有严格限定，可以被快速编译成性能良好的机器码。这样做的目的，是为了给其他语言提供一个编译规范，使其可以被编译成高效的JavaScript代码。同时，Mozilla基金会还发起了[Emscripten](https://github.com/kripken/emscripten/wiki)项目，目标就是提供一个跨语言的编译器，能够将LLVM的位代码（bitcode）转为JavaScript代码，在浏览器中运行。因为大部分LLVM位代码都是从C / C++语言生成的，这意味着C / C++将可以在浏览器中运行。此外，Mozilla旗下还有[LLJS](http://mbebenita.github.io/LLJS/)（将JavaScript转为C代码）项目和[River Trail](https://github.com/RiverTrail/RiverTrail/wiki)（一个用于多核心处理器的ECMAScript扩展）项目。目前，在可以被编译成JavaScript的[语言列表](https://github.com/jashkenas/coffee-script/wiki/List-of-languages-that-compile-to-JS)上，共有将近40种语言。

2013年，Mozilla基金会发布手机操作系统Firefox OS，该操作系统的整个用户界面都使用JavaScript。

2013年，ECMA正式推出JSON的[国际标准](http://www.ecma-international.org/publications/standards/Ecma-404.htm)，这意味着JSON格式已经变得与XML格式一样重要和正式了。

2013年5月，Facebook发布UI框架库React，引入了新的JSX语法，使得UI层可以用组件开发。

2014年，微软推出JavaScript的Windows库WinJS，标志微软公司全面支持JavaScript与Windows操作系统的融合。

2014年11月，由于对Joyent公司垄断Node项目、以及该项目进展缓慢的不满，一部分核心开发者离开了Node.js，创造了io.js项目，这是一个更开放、更新更频繁的Node.js版本，很短时间内就发布到了2.0版。三个月后，Joyent公司宣布放弃对Node项目的控制，将其转交给新成立的开放性质的Node基金会。随后，io.js项目宣布回归Node，两个版本将合并。

2015年3月，Facebook公司发布了React Native项目，将React框架移植到了手机端，可以用来开发手机App。它会将JavaScript代码转为iOS平台的Objective-C代码，或者Android平台的Java代码，从而为JavaScript语言开发高性能的原生App打开了一条道路。

2015年4月，Angular框架宣布，2.0版将基于微软公司的TypeScript语言开发，这等于为JavaScript语言引入了强类型。

2015年5月，Node模块管理器npm超越CPAN，标志着JavaScript成为世界上软件模块最多的语言。

2015年5月，Google公司的Polymer框架发布1.0版。该项目的目标是生产环境可以使用WebComponent组件，如果能够达到目标，Web开发将进入一个全新的以组件为开发基础的阶段。

2015年6月，ECMA标准化组织正式批准了ECMAScript 6语言标准，定名为《ECMAScript 2015 标准》。JavaScript语言正式进入了下一个阶段，成为一种企业级的、开发大规模应用的语言。这个标准从提出到批准，历时10年，而JavaScript语言从诞生至今也已经20年了。

2015年6月，Mozilla 在 asm.js 的基础上发布 WebAssembly 项目。这是一种JavaScript语言编译后的二进制格式，类似于Java的字节码，有利于移动设备加载JavaScript脚本，解析速度提高了20+倍。这意味着将来的软件，会发布JavaScript二进制包。

2016年6月，《ECMAScript 2016 标准》发布。与前一年发布的版本相比，它只增加了两个较小的特性。

2017年6月，《ECMAScript 2017 标准》发布，正式引入了 async 函数，使得异步操作的写法出现了根本的变化。

2017年11月，所有主流浏览器全部支持 WebAssembly，这意味着任何语言都可以编译成 JavaScript，在浏览器运行。

## 参考链接

- Axel Rauschmayer, [The Past, Present, and Future of JavaScript](http://oreilly.com/javascript/radarreports/past-present-future-javascript.csp)
- John Dalziel, [The race for speed part 4: The future for JavaScript](http://creativejs.com/2013/06/the-race-for-speed-part-4-the-future-for-javascript/)
- Axel Rauschmayer, [Basic JavaScript for the impatient programmer](http://www.2ality.com/2013/06/basic-javascript.html)
- resin.io, [Happy 18th Birthday JavaScript! A look at an unlikely past and bright future](http://resin.io/happy-18th-birthday-javascript/)
