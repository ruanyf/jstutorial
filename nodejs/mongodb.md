---
title: MongoDB的应用
layout: page
category: nodejs
date: 2014-01-19
modifiedOn: 2014-01-19
---

MongoDB是目前最流行的noSQL数据库之一，它是专为node.js而开发的。

## 安装

安装完成后，使用mongod命令启动MongoDB。

{% highlight bash %}

mongod

# 或者指定配置文件
mongod --config /etc/mongodb.conf

{% endhighlight %}

## Mongoose

多种中间件可以用于连接node.js与MongoDB，目前比较常用的Mongoose。

首先，在项目目录将Mongoose安装为本地模块。

{% highlight bash %}

npm install mongoose --save

{% endhighlight %}

然后，就可以在node.js脚本中连接MongoDB数据库了。

{% highlight javascript %}

var mongoose = require('mongoose');

// 连接字符串格式为mongodb://主机/数据库名
mongoose.connect('mongodb://localhost/mydatabase');

{% endhighlight %}

注意，运行上面这个脚本时，必须确保MongoDB处于运行中。

数据库连接后，可以对open和error事件指定监听函数。

{% highlight javascript %}

var db = mongoose.connection;

db.on('error', function callback () {
  console.log("Connection error");
});

db.once('open', function callback () {
  console.log("Mongo working!");
});

{% endhighlight %}

## 参考链接

- Christopher Buecheler, [Creating a Simple RESTful Web App with Node.js, Express, and MongoDB](http://cwbuecheler.com/web/tutorials/2014/restful-web-app-node-express-mongodb/)
