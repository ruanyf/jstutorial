---
title: 移动设备API
layout: page
category: bom
date: 2012-12-29
modifiedOn: 2013-12-20
---

为了更好地为移动设备服务，HTML 5推出了一系列针对移动设备的API。

## Viewport

Viewport指的是网页的显示区域，也就是不借助滚动条的情况下，用户可以看到的部分网页大小，中文译为“视口”。正常情况下，viewport和浏览器的显示窗口是一样大小的。但是，在移动设备上，两者可能不是一样大小。

比如，手机浏览器的窗口宽度可能是640像素，这时viewport宽度就是640像素，但是网页宽度有950像素，正常情况下，浏览器会提供横向滚动条，让用户查看窗口容纳不下的310个像素。另一种方法则是，将viewport设成950像素，也就是说，浏览器的显示宽度还是640像素，但是网页的显示区域达到950像素，整个网页缩小了，在浏览器中可以看清楚全貌。这样一来，手机浏览器就可以看到网页在桌面浏览器上的显示效果。

viewport缩放规则，需要在HTML网页的head部分指定。

```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
</head>
```

上面代码指定，viewport的缩放规则是，缩放到当前设备的屏幕宽度（device-width），初始缩放比例（initial-scale）为1倍，禁止用户缩放（user-scalable）。

viewport 全部属性如下。

- width: viewport宽度
- height: viewport高度
- initial-scale: 初始缩放比例
- maximum-scale: 最大缩放比例
- minimum-scale: 最小缩放比例
- user-scalable: 是否允许用户缩放

其他的例子如下。

```html
<meta name = "viewport" content = "width = 320,
  initial-scale = 2.3, user-scalable = no">
```

## Geolocation API

Geolocation接口用于获取用户的地理位置。它使用的方法基于GPS或者其他机制（比如IP地址、Wifi热点、手机基站等）。

下面的方法，可以检查浏览器是否支持这个接口。

{% highlight javascript %}

if(navigator.geolocation) { 
   // 支持
} else {
   // 不支持
}

{% endhighlight %}

这个API的支持情况非常好，所有浏览器都支持（包括IE 9+），所以上面的代码不是很必要。

### getCurrentPosition方法

getCurrentPosition方法，用来获取用户的地理位置。使用它需要得到用户的授权，浏览器会跳出一个对话框，询问用户是否许可当前页面获取他的地理位置。必须考虑两种情况的回调函数：一种是同意授权，另一种是拒绝授权。如果用户拒绝授权，会抛出一个错误。

{% highlight javascript %}

navigator.geolocation.getCurrentPosition(geoSuccess,geoError);

{% endhighlight %}

上面代码指定了处理当前地理位置的两个回调函数。

**（1）同意授权**

如果用户同意授权，就会调用geoSuccess。

{% highlight javascript %}

function geoSuccess(event) {
   console.log(event.coords.latitude + ', ' + event.coords.longitude);
}

{% endhighlight %}

geoSuccess的参数是一个event对象。event有两个属性：timestamp和coords。timestamp属性是一个时间戳，返回获得位置信息的具体时间。coords属性指向一个对象，包含了用户的位置信息，主要是以下几个值：

- **coords.latitude**：纬度
- **coords.longitude**：经度
- **coords.accuracy**：精度
- **coords.altitude**：海拔
- **coords.altitudeAccuracy**：海拔精度（单位：米）
- **coords.heading**：以360度表示的方向
- **coords.speed**：每秒的速度（单位：米）

大多数桌面浏览器不提供上面列表的后四个值。

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

### watchPosition方法和clearWatch方法

watchPosition方法可以用来监听用户位置的持续改变，使用方法与getCurrentPosition方法一样。

{% highlight javascript %}

var watchID = navigator.geolocation.watchPosition(geoSuccess,geoError, option);

{% endhighlight %}

一旦用户位置发生变化，就会调用回调函数geoSuccess。这个回调函数的事件对象，也包含timestamp和coords属性。

watchPosition和getCurrentPosition方法的不同之处在于，前者返回一个表示符，后者什么都不返回。watchPosition方法返回的标识符，用于供clearWatch方法取消监听。

{% highlight javascript %}

navigator.geolocation.clearWatch(watchID);

{% endhighlight %}

## Vibration API

Vibration接口用于在浏览器中发出命令，使得设备振动。显然，这个API主要针对手机，适用场合是向用户发出提示或警告，游戏中尤其会大量使用。由于振动操作很耗电，在低电量时最好取消该操作。

使用下面的代码检查该接口是否可用。目前，只有Chrome和Firefox的Android平台最新版本支持它。

```javascript
navigator.vibrate = navigator.vibrate
  || navigator.webkitVibrate
  || navigator.mozVibrate
  || navigator.msVibrate;

if (navigator.vibrate) {
  // 支持
}
```

vibrate方法可以使得设备振动，它的参数就是振动持续的毫秒数。

```javascript
navigator.vibrate(1000);
```

上面的代码使得设备振动1秒钟。

vibrate方法还可以接受一个数组作为参数，表示振动的模式。偶数位置的数组成员表示振动的毫秒数，奇数位置的数组成员表示等待的毫秒数。

```javascript
navigator.vibrate([500, 300, 100]);
```

上面代码表示，设备先振动500毫秒，然后等待300毫秒，再接着振动100毫秒。

vibrate是一个非阻塞式的操作，即手机振动的同时，JavaScript代码继续向下运行。要停止振动，只有将0毫秒或者一个空数组传入vibrate方法。

```javascript
navigator.vibrate(0);
navigator.vibrate([]);
```

如果要让振动一直持续，可以使用setInterval不断调用vibrate。

```javascript
var vibrateInterval;

function startVibrate(duration) {
	navigator.vibrate(duration);
}

function stopVibrate() {
	if(vibrateInterval) clearInterval(vibrateInterval);
	navigator.vibrate(0);
}

function startPeristentVibrate(duration, interval) {
	vibrateInterval = setInterval(function() {
		startVibrate(duration);
	}, interval);
}
```

## Luminosity API

Luminosity API用于屏幕亮度调节，当移动设备的亮度传感器感知外部亮度发生显著变化时，会触发devicelight事件。目前，只有Firefox部署了这个API。

{% highlight javascript %}

window.addEventListener('devicelight', function(event) {
  console.log(event.value + 'lux');
});

{% endhighlight %}

上面代码表示，devicelight事件的回调函数，接受一个事件对象作为参数。该对象的value属性就是亮度的流明值。

这个API的一种应用是，如果亮度变强，网页可以显示黑底白字，如果亮度变弱，网页可以显示白底黑字。

{% highlight javascript %}

window.addEventListener('devicelight', function(e) {
  var lux = e.value;

  if(lux < 50) {
    document.body.className = 'dim';
  }
  if(lux >= 50 && lux <= 1000) {
    document.body.className = 'normal';
  }
  if(lux > 1000)  {
    document.body.className = 'bright';
  } 
});

{% endhighlight %}

CSS下一个版本的Media Query可以单独设置亮度，一旦浏览器支持，就可以用来取代Luminosity API。

```css

@media (light-level: dim) {
  /* 暗光环境 */
}

@media (light-level: normal) {
  /* 正常光环境 */
}

@media (light-level: washed) {
  /* 明亮环境 */
}

```

## Orientation API

Orientation API用于检测手机的摆放方向（竖放或横放）。

使用下面的代码检测浏览器是否支持该API。

```javascript

if (window.DeviceOrientationEvent) {
  // 支持
} else {
  // 不支持
}

```

一旦设备的方向发生变化，会触发deviceorientation事件，可以对该事件指定回调函数。

```javascript

window.addEventListener("deviceorientation", callback);

```

回调函数接受一个event对象作为参数。

```javascript

function callback(event){
	console.log(event.alpha);
	console.log(event.beta);
	console.log(event.gamma);
}

```

上面代码中，event事件对象有alpha、beta和gamma三个属性，它们分别对应手机摆放的三维倾角变化。要理解它们，就要理解手机的方向模型。当手机水平摆放时，使用三个轴标示它的空间位置：x轴代表横轴、y轴代表竖轴、z轴代表垂直轴。event对象的三个属性就对应这三根轴的旋转角度。

- alpha：表示围绕z轴的旋转，从0到360度。当设备水平摆放时，顶部指向地球的北极，alpha此时为0。
- beta：表示围绕x轴的旋转，从-180度到180度。当设备水平摆放时，beta此时为0。
- gramma：表示围绕y轴的选择，从-90到90度。当设备水平摆放时，gramma此时为0。

## 参考链接

- Ryan Stewart, [Using the Geolocation API](http://www.adobe.com/devnet/html5/articles/using-geolocation-api.html)
- Rathnakanya K. Srinivasan, [HTML5 Geolocation](http://www.sitepoint.com/html5-geolocation/)
- Craig Buckler, [How to Use the HTML5 Vibration API](http://www.sitepoint.com/use-html5-vibration-api/)
- Tomomi Imura, [Responsive UI with Luminosity Level](http://girliemac.com/blog/2014/01/12/luminosity/)
- Aurelio De Rosa, [An Introduction to the Geolocation API](http://code.tutsplus.com/tutorials/an-introduction-to-the-geolocation-api--cms-20071)
- David Walsh, [Vibration API](http://davidwalsh.name/vibration-api)
- Ahmet Mermerkaya, [Using Device Orientation in HTML5](http://www.sitepoint.com/using-device-orientation-html5/)
