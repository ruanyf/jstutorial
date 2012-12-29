---
title: Geolocation
layout: page
category: bom
date: 2012-12-29
modifiedOn: 2012-12-29
---

## 概述

这个API用于获取用户的地理位置，基于GPS或者其他机制（比如IP地址、Wifi热点等）。

使用它需要得到用户的授权，浏览器会跳出一个对话框，询问用户是否许可当前页面获取你的地理位置。如果用户拒绝授权，对话框会返回一个错误，调用错误事件的回调函数。

## 基本用法

首先，检查浏览器是否支持这个API。

{% highlight javascript %}

if(navigator.geolocation) { 
   return true;
} else {
   return false;
}

{% endhighlight %}

然后，使用getCurrentPosition方法，获取用户的地理位置。由于返回结果取决于用户的授权，所以必须指定两种情况——一种是同意授权，另一种是拒绝授权——的回调函数。

{% highlight javascript %}

navigator.geolocation.getCurrentPosition(onGeoSuccess,onGeoError);

{% endhighlight %}

## 用户同意授权

这时，就会调用getCurrentPosition方法指定的第一个回调函数。

{% highlight javascript %}

function onGeoSuccess(event) {       
   alert(event.coords.latitude + ', ' + event.coords.longitude);
}

{% endhighlight %}

这个回调函数的参数是一个event对象。它有一个coords属性，包含了用户的位置信息，主要是以下几个值：

- coords.latitude 纬度
- coords.longitude 经度
- coords.accuracy 精度
- coords.altitude 海拔

## 用户拒绝授权或无法获得位置

这时，就会调用getCurrentPosition方法指定的第二个回调函数。

{% highlight javascript %}

function onGeoError(event) { 
   alert("Error code " + event.code + ". " + event.message);
}

{% endhighlight %}

这个回调函数的参数event对象，有一个code属性，用来表示错误的属性。它有四个值：

- 0 未知错误，浏览器没有提示出错的原因。
- 1 用户拒绝授权。
- 2 没有得到位置，GPS或其他定位机制无法定位。
- 3 超时，GPS没有在指定时间内返回结果。

## 监听位置的变化

除了获取用户的位置，geolocation对象的watchPosition方法可以用来监听用户位置的改变。

{% highlight javascript %}

var watchID = navigator.geolocation.watchPosition(onGeoSuccess,onGeoError);   

{% endhighlight %}

一旦用户位置发生变化，就会调用回调函数onGeoSuccess。

如果要取消监听，则使用clearWatch方法。

{% highlight javascript %}

navigator.geolocation.clearWatch(watchID);

{% endhighlight %}

## 参考链接

- Ryan Stewart, [Using the Geolocation API](http://www.adobe.com/devnet/html5/articles/using-geolocation-api.html)
