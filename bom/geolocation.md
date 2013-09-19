---
title: Geolocation
layout: page
category: bom
date: 2012-12-29
modifiedOn: 2013-09-19
---

## 概述

Geolocation接口用于获取用户的地理位置。它使用的方法基于GPS或者其他机制（比如IP地址、Wifi热点等）。

使用它需要得到用户的授权，浏览器会跳出一个对话框，询问用户是否许可当前页面获取他的地理位置。如果用户拒绝授权，会抛出一个错误。

下面的方法，可以检查浏览器是否支持这个接口。

{% highlight javascript %}

if(navigator.geolocation) { 
   // 支持
} else {
   // 不支持
}

{% endhighlight %}

## getCurrentPosition方法

getCurrentPosition方法，用来获取用户的地理位置。由于这需要用户的授权，所以必须考虑两种情况的回调函数：一种是同意授权，另一种是拒绝授权。

{% highlight javascript %}

navigator.geolocation.getCurrentPosition(geoSuccess,geoError);

{% endhighlight %}

上面代码指定了处理当前地理位置的两个回调函数。

**（1）同意授权**

如果用户同意授权，就会调用geoSuccess。

{% highlight javascript %}

function geoSuccess(event) {       
   alert(event.coords.latitude + ', ' + event.coords.longitude);
}

{% endhighlight %}

geoSuccess的参数是一个event对象。event.coords属性指向一个对象，包含了用户的位置信息，主要是以下几个值：

- **coords.latitude**：纬度
- **coords.longitude**：经度
- **coords.accuracy**：精度
- **coords.altitude**：海拔
- **coords.altitudeAccuracy**：海拔精度（单位：米）
- **coords.heading**：以360度表示的方向
- **coords.speed**：每秒的速度（单位：米）

**（2）拒绝授权**

如果用户拒绝授权，就会调用getCurrentPosition方法指定的第二个回调函数geoError。

{% highlight javascript %}

function geoError(event) { 
   console.log("Error code " + event.code + ". " + event.message);
}

{% endhighlight %}

geoError的参数也是一个event对象。event.code属性表示错误类型，有四个值：

- **0**：未知错误，浏览器没有提示出错的原因，相当于常量event.UNKNOWN_ERROR。
- **1**：用户拒绝授权，相当于常量event.PERMISSION_DENIED。
- **2**：没有得到位置，GPS或其他定位机制无法定位，相当于常量event.POSITION_UNAVAILABLE。
- **3**：超时，GPS没有在指定时间内返回结果，相当于常量event.TIMEOUT。

**(3)设置定位行为**

getCurrentPosition方法还可以接受一个对象作为第三个参数，用来设置定位行为。

{% highlight javascript %}

var option = {
            enableHighAccuracy : true,
            timeout : Infinity,
            maximumAge : 0
        };

navigator.geolocation.getCurrentPosition(geoSuccess, geoError, option);

{% endhighlight %}

这个参数对象有三个成员：

- **enableHighAccuracy**：如果设为true，就要求客户端提供更精确的位置信息，这会导致更长的定位时间和更大的耗电，默认设为false。

- **Timeout**：等待客户端做出回应的最大毫秒数，默认值为Infinity（无限）。

- **maximumAge**：客户端可以使用缓存数据的最大毫秒数。如果设为0，客户端不读取缓存；如果设为infinity，客户端只读取缓存。

## watchPosition方法和clearWatch方法

watchPosition方法可以用来监听用户位置的持续改变，使用方法与getCurrentPosition方法一样。

{% highlight javascript %}

var watchID = navigator.geolocation.watchPosition(geoSuccess,geoError);   

{% endhighlight %}

一旦用户位置发生变化，就会调用回调函数geoSuccess。

如果要取消监听，则使用clearWatch方法。

{% highlight javascript %}

navigator.geolocation.clearWatch(watchID);

{% endhighlight %}

## 参考链接

- Ryan Stewart, [Using the Geolocation API](http://www.adobe.com/devnet/html5/articles/using-geolocation-api.html)
- Rathnakanya K. Srinivasan, [HTML5 Geolocation](http://www.sitepoint.com/html5-geolocation/)
