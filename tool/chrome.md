---
title: Chrome Developer Tools
layout: page
category: tool
date: 2013-02-06
modifiedOn: 2013-05-28
---

## 打开方法

打开“开发者工具”的方法有三种：

1. 按F12或者Control+Shift+i。
2. 在菜单中选择Tools/Developer Tools。
3. 在一个页面元素上，打开右键菜单，选择其中的“Inspect Element”。

## Elements面板

这个面板用来列出HTML网友的源码。网页结构的任何变化，都会在这个面板反映出来。

它的左面半边是HTML代码，用来选择网页元素。用中任何一个元素，网页上该元素周围会出现彩色边框，打开右键菜单，可以进行编辑源码，也可以选择滚动到视口（viewport）。按ctrl+f可以打开搜索框。

它的右面半边用来查看样式，分成“Computed Style”（总体样式）、“Styles”（CSS源码）、Metrics（度量）等几个部分。

## Resources面板

这个面板列出：

1. 网页加载的各种外部资源，比如CSS文件、JavaScript文件、图片、字体等等。
2. 网页创建的各种内容，比如本地缓存、Cookie、Local Storage等等。

## Sources面板

该面板主要用来调试JavaScript源码。

它分成左右两部分。左面显示源码文件本身，右面显示各种调试信息，分成8个部分。

（1）Watch Expressions：查看各种表达式的值。它的右上角有一个加号（+），用来添加表达式。

（2）Call Stack：显示函数的调用栈。

（3）Scope Variables：显示各个作用域中的变量。

（4）Breakpoints

（5）DOM Breakpoints

（6）XHR Breakpoints

（7）Event Listener Breakpoints

（8）Workers

