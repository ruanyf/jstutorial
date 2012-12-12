---
title: Javascript 性能测试
date: 2012-12-09
layout: page
category: tool
modifiedOn: 2012-12-09
---

## 第一种做法

最常见的测试性能的做法，就是同一操作重复n次，然后计算每次操作的平均时间。

{% highlight javascript %}

var totalTime,
    start = new Date,
    iterations = 6;

while (iterations--) {
  // Code snippet goes here
}

// totalTime → the number of milliseconds it took to execute
// the code snippet 6 times
totalTime = new Date - start;

{% endhighlight %}

上面代码的问题在于，由于计算机的性能不断提高，如果只重复6次，很可能得到0毫秒的结果，即不到1毫秒，Javascript引擎无法测量。

## 第二种做法

另一种思路是，测试单位时间内完成了多少次操作。

{% highlight javascript %}

var hz,
    period,
    startTime = new Date,
    runs = 0;

do {
  // Code snippet goes here
  runs++;
  totalTime = new Date - startTime;
} while (totalTime < 1000);

// convert ms to seconds
totalTime /= 1000;

// period → how long per operation
period = totalTime / runs;

// hz → the number of operations per second
hz = 1 / period;

// can be shortened to
// hz = (runs * 1000) / totalTime;

{% endhighlight %}

这种做法的注意之处在于，测试结构受外界环境影响很大，为了得到正确结构，必须重复多次。

## 测试工具

- [jsPerf](http://jsperf.com/)，一个比较不同代码片段的性能的网站。
- [benchmark.js](https://github.com/bestiejs/benchmark.js)，一个用于测试性能的Javascript库。
- <a href="https://github.com/kamicane/slickspeed/">SlickSpeed</a>
- <a href="https://github.com/phiggins42/taskspeed">Taskspeed</a>
- <a href="http://www2.webkit.org/perf/sunspider/sunspider.html">SunSpider</a>
- <a href="http://krakenbenchmark.mozilla.org/">Kraken</a>
- <a href="http://dromaeo.com/">Dromaeo</a>
- <a href="http://code.google.com/apis/v8/benchmarks.html">V8 Benchmark Suite</a>
- <a href="http://www.broofa.com/Tools/JSLitmus/">JSLitmus</a>

## 参考链接

- [Bulletproof JavaScript benchmarks](http://calendar.perfplanet.com/2010/bulletproof-javascript-benchmarks/)
