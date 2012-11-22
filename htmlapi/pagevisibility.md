---
title: Page Visibility API
layout: page
date: 2012-11-20
category: htmlapi
---

这个API用于判断页面是否处于浏览器的当前窗口，即是否可见。

## 属性

### hidden

如果当面不可见，该属性（document.hidden）返回true。

### visibilityState

document.visibilityState属性表示页面当前的状态，它可以取三个值。

* visibile： 页面可见。
* hidden： 页面不可见。
* prerender： 页面正处于渲染之中，不可见。

## 参考链接

* W3草案：[http://www.w3.org/TR/page-visibility/](http://www.w3.org/TR/page-visibility/)
* David Walsh, [Page Visibility API](http://davidwalsh.name/page-visibility) 
