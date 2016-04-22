---
title: MongoDB的应用
layout: page
category: nodejs
date: 2014-01-19
modifiedOn: 2014-01-19
---

MongoDB是目前最流行的noSQL数据库之一，它是专为Node开发的。

MongoDB的一条记录叫做文档（document），它是一个包含多个字段的数据结构，很类似于JSON格式。

下面是文档的一个例子。

```javascript
{
   "_id" : ObjectId("54c955492b7c8eb21818bd09"),
   "address" : {
      "street" : "2 Avenue",
      "zipcode" : "10075",
      "building" : "1480",
      "coord" : [ -73.9557413, 40.7720266 ]
   },
   "borough" : "Manhattan",
   "cuisine" : "Italian",
   "grades" : [
      {
         "date" : ISODate("2014-10-01T00:00:00Z"),
         "grade" : "A",
         "score" : 11
      },
      {
         "date" : ISODate("2014-01-16T00:00:00Z"),
         "grade" : "B",
         "score" : 17
      }
   ],
   "name" : "Vella",
   "restaurant_id" : "41704620"
}
```

文档储存在集合（collection）之中，类似于关系型数据库的表。在一个集合之中，记录的格式并不需要相同。每个集合之中的每个文档，必须有一个`_id`字段作为主键。

## 基本用法

安装完MongoDB数据库以后，使用`mongod`命令启动MongoDB。

```bash
$ mongod

# 或者指定配置文件
$ mongod --config /etc/mongodb.conf
```

然后，安装Node驱动库。

```bash
$ npm install mongodb
```

脚本里引用MongoDB客户端的代码如下。

```bash
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log('Connected correctly to server.');
  db.close();
});
```

### 插入数据

```javascript
var insertDocument = function(db, callback) {
   db.collection('restaurants').insertOne( {
      "address" : {
         "street" : "2 Avenue",
         "zipcode" : "10075",
         "building" : "1480",
         "coord" : [ -73.9557413, 40.7720266 ]
      },
      "borough" : "Manhattan",
      "cuisine" : "Italian",
      "grades" : [
         {
            "date" : new Date("2014-10-01T00:00:00Z"),
            "grade" : "A",
            "score" : 11
         },
         {
            "date" : new Date("2014-01-16T00:00:00Z"),
            "grade" : "B",
            "score" : 17
         }
      ],
      "name" : "Vella",
      "restaurant_id" : "41704620"
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  });
};
```

执行这个操作。

```javascript
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  insertDocument(db, function() {
    db.close();
  });
});
```

### 查询操作

取出一个collection里面的所有文档。

```javascript
var findRestaurants = function(db, callback) {
   var cursor =db.collection('restaurants').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc !== null) {
        console.dir(doc);
      } else {
        callback();
      }
   });
};
```

执行上面的函数。

```javascript
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findRestaurants(db, function() {
      db.close();
  });
});
```

查询语句的写法如下。

```bash
{ <field1>: <value1>, <field2>: <value2>, ... }
```

下面是一个指定查询条件的例子。

```javascript
var findRestaurants = function(db, callback) {
   var cursor =db.collection('restaurants').find( { "borough": "Manhattan" } );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};
```

执行上面的函数。

```javascript
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findRestaurants(db, function() {
      db.close();
  });
});
```

查询的时候，可以指定嵌套属性。

```javascript
var cursor =db.collection('restaurants').find( { "address.zipcode": "10075" } );
```

查询条件还可以指定数组的一个值。

```javascript
var cursor =db.collection('restaurants').find( { "grades.grade": "B" } );
```

查询条件可以指定运算符。

```javascript
// 大于
var cursor =db.collection('restaurants').find( { "grades.score": { $gt: 30 } } );

// 小于
var cursor =db.collection('restaurants').find( { "grades.score": { $lt: 10 } } );
```

查询条件可以指定逻辑运算符。

```javascript
// AND 运算
var cursor =db.collection('restaurants').find(
  { "cuisine": "Italian", "address.zipcode": "10075" }
);

// OR 运算
var cursor =db.collection('restaurants').find(
  { $or: [ { "cuisine": "Italian" }, { "address.zipcode": "10075" } ] }
);
```

`sort`方法用于排序，1代表升序，-1代表降序。

```javascript
var cursor =db.collection('restaurants').find().sort( { "borough": 1, "address.zipcode": 1 } );
```

### 更新数据

更新指定文档。`updateOne`方法返回更新的文档的数目。

```javascript
var updateRestaurants = function(db, callback) {
   db.collection('restaurants').updateOne(
      { "name" : "Juni" },
      {
        $set: { "cuisine": "American (New)" },
        $currentDate: { "lastModified": true }
      }, function(err, results) {
      console.log(results);
      callback();
   });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  updateRestaurants(db, function() {
    db.close();
  });
});
```

更新嵌入的字段。

```javascript
db.collection('restaurants').updateOne(
  { "restaurant_id" : "41156888" },
  { $set: { "address.street": "East 31st Street" } },
  function(err, results) {
    console.log(results);
    callback();
  }
);
```

更新多个字段。

```javascript
   db.collection('restaurants').updateMany(
      { "address.zipcode": "10016", cuisine: "Other" },
      {
        $set: { cuisine: "Category To Be Determined" },
        $currentDate: { "lastModified": true }
      }
      ,
      function(err, results) {
        console.log(results);
        callback();
   });
```

替换整个文档，除了`_id`字段。

```javascript
db.collection('restaurants').replaceOne(
      { "restaurant_id" : "41704620" },
      {
        "name" : "Vella 2",
        "address" : {
           "coord" : [ -73.9557413, 40.7720266 ],
           "building" : "1480",
           "street" : "2 Avenue",
           "zipcode" : "10075"
        }
      },
      function(err, results) {
        console.log(results);
        callback();
   });
```

`_id`字段不能更新。

### 删除数据

删除符合条件的所有文档。

```javascript
var removeRestaurants = function(db, callback) {
   db.collection('restaurants').deleteMany(
      { "borough": "Manhattan" },
      function(err, results) {
         console.log(results);
         callback();
      }
   );
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);

  removeRestaurants(db, function() {
      db.close();
  });
});
```

删除单一文档。

```javascript
db.collection('restaurants').deleteOne(
      { "borough": "Queens" },
      function(err, results) {
         console.log(results);
         callback();
      }
   );
```

删除所有文档。

```javascript
db.collection('restaurants').deleteMany( {}, function(err, results) {
      console.log(results);
      callback();
   });
```

删除整个集合。

```javascript
db.collection('restaurants').drop( function(err, response) {
      console.log(response)
      callback();
   });
```

### 聚合操作

```javascript
var aggregateRestaurants = function(db, callback) {
   db.collection('restaurants').aggregate(
     [
       { $group: { "_id": "$borough", "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
     assert.equal(err, null);
     console.log(result);
     callback(result);
   });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  aggregateRestaurants(db, function() {
      db.close();
  });
});
```

上面的代码产生下面的结果。

```javascript
[ { _id: 'Missing', count: 51 },
  { _id: 'Staten Island', count: 969 },
  { _id: 'Manhattan', count: 10259 },
  { _id: 'Brooklyn', count: 6086 },
  { _id: 'Queens', count: 5656 },
  { _id: 'Bronx', count: 2338 } ]
```

带有过滤条件的聚合。

```javascript
db.collection('restaurants').aggregate(
     [
       { $match: { "borough": "Queens", "cuisine": "Brazilian" } },
       { $group: { "_id": "$address.zipcode" , "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
       assert.equal(err, null);
       console.log(result);
       callback(result);
     });
```

### 索引

生成一个单字段的索引，`1`表示升序，`-1`表示降序。

```javascript
var indexRestaurants = function(db, callback) {
   db.collection('restaurants').createIndex(
      { "cuisine": 1 },
      null,
      function(err, results) {
         console.log(results);
         callback();
      }
   );
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  indexRestaurants(db, function() {
      db.close();
  });
});
```

生成多个字段的索引。

```javascript
db.collection('restaurants').createIndex(
      { "cuisine": 1, "address.zipcode": -1 },
      null,
      function(err, results) {
         console.log(results);
         callback();
      }
   );
```

## 命令行操作

输入数据。

```bash
$ mongoimport --db test --collection restaurants --drop --file primer-dataset.json
```

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

mongoose.Schema方法用来定义数据集的格式（schema），mongoose.model方法将格式分配给指定的数据集。

```javascript

var Schema = mongoose.Schema;
var userSchema = new Schema({
  name : String,
  age : Number,
  DOB : Date,
  isAlive : Boolean
});

var User = mongoose.model('User', userSchema);

var arvind = new User({
  name : 'Arvind',
  age : 99,
  DOB : '01/01/1915',
  isAlive : true
});

arvind.save(function (err, data) {
  if (err){
    console.log(err);
  } else {
    console.log('Saved : ', data );
  }
});

```

## 参考链接

- Christopher Buecheler, [Creating a Simple RESTful Web App with Node.js, Express, and MongoDB](http://cwbuecheler.com/web/tutorials/2014/restful-web-app-node-express-mongodb/)
- arvindr21, [Getting started with MongoDB and Mongoose](http://blog.mongodirector.com/getting-started-with-mongodb-and-mongoose/)
