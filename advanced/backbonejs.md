---
title: MVC框架与Backbone.js
layout: page
category: advanced
date: 2014-01-15
modifiedOn: 2014-02-09
---

## MVC框架

随着JavaScript程序变得越来越复杂，往往需要一个团队协作开发，这时代码的模块化和组织规范就变得异常重要了。MVC模式就是代码组织的经典模式。

（……MVC介绍。）

**（1）Model**

Model表示数据层，也就是程序需要的数据源，通常使用JSON格式表示。

**（2）View**

View表示表现层，也就是用户界面，对于网页来说，就是用户看到的网页HTML代码。

**（3）Controller**

Controller表示控制层，用来对原始数据（Model）进行加工，传送到View。

由于网页编程不同于客户端编程，在MVC的基础上，JavaScript社区产生了各种变体框架MVP（Model-View-Presenter）、MVVM（Model-View-ViewModel）等等，有人就把所有这一类框架的各种模式统称为MV*。

## Backbone.View

Backbone.View用于定义视图类。

{% highlight javascript %}

var AppView = Backbone.View.extend({
  render: function(){
    $('main').append('<h1>Browserify is a great tool.</h1>');
  }
});

{% endhighlight %}

上面代码通过Backbone.View的extend方法，定义了一个视图类AppView。该类内部有一个render方法，用于将视图放置在网页上。

使用的时候，需要先新建视图类的实例，然后通过实例，调用render方法，从而让视图在网页上显示。

{% highlight javascript %}

var appView = new AppView();
appView.render();

{% endhighlight %}

上面代码新建视图类AppView的实例appView，然后调用appView.render，网页上就会显示指定的内容。

## 模板

模板用来按照变量生成网页内容。一般将模板放在script标签中，为了防止浏览器按照JavaScript代码解析，type属性设为text/template。

{% highlight html %}

<script type="text/template" data-name="templateName">
    <!-- template contents goes here -->
</script>

{% endhighlight %}

可以使用下面的代码编译模板。

{% highlight html %}

window.templates = {};
  var $sources = $('script[type="text/template"]');
  $sources.each(function(index, el) {
    var $el = $(el);
    templates[$el.data('name')] = _.template($el.html());
  });

{% endhighlight %}
