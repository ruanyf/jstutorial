---
title: IndexedDB：浏览器端数据库
layout: page
category: bom
date: 2013-10-07
modifiedOn: 2013-11-09
---

## 概述

随着浏览器的处理能力不断增强，越来越多的网站开始考虑，将大量数据储存在客户端，这样可以减少用户等待从服务器获取数据的时间。

现有的浏览器端数据储存方案，都不适合储存大量数据：cookie不超过4KB，且每次请求都会发送回服务器端；Window.name属性缺乏安全性，且没有统一的标准；localStorage在2.5MB到10MB之间（各家浏览器不同）。所以，需要一种新的解决方案，这就是IndexedDB诞生的背景。

通俗地说，IndexedDB就是浏览器端数据库，可以被网页脚本程序创建和操作。它允许储存大量数据，提供查找接口，还能建立索引。这些都是localStorage所不具备的。就数据库类型而言，IndexedDB不属于关系型数据库（不支持SQL查询语句），更接近NoSQL数据库。

IndexedDB具有以下特点。

**（1）键值对储存。** IndexedDB内部采用对象仓库（object store）存放数据。所有类型的数据都可以直接存入，包括JavaScript对象。在对象仓库中，数据以“键值对”的形式保存，每一个数据都有对应的键名，键名是独一无二的，不能有重复，否则会抛出一个错误。

**（2）异步。**  IndexedDB操作时不会锁死浏览器，用户依然可以进行其他操作，这与localStorage形成对比，后者的操作是同步的。异步设计是为了防止大量数据的读写，拖慢网页的表现。

**（3）支持事务。** IndexedDB支持事务（transaction），这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回到事务发生之前的状态，不存在只改写一部分数据的情况。

**（4）同域限制** IndexedDB也受到同域限制，每一个数据库对应创建该数据库的域名。来自不同域名的网页，只能访问自身域名下的数据库，而不能访问其他域名下的数据库。

**（5）储存空间大** IndexedDB的储存空间比localStorage大得多，一般来说不少于250MB。IE的储存上限是250MB，Chrome和Opera是剩余空间的某个百分比，Firefox则没有上限。

**（6）支持二进制储存。** IndexedDB不仅可以储存字符串，还可以储存二进制数据。

目前，Chrome 27+、Firefox 21+、Opera 15+和IE 10+支持这个API，但是Safari完全不支持。

下面的代码用来检查浏览器是否支持这个API。

{% highlight javascript %}

if("indexedDB" in window) {
    // 支持
} else {
    // 不支持
}

{% endhighlight %}

## indexedDB.open方法

浏览器原生提供indexedDB对象，作为开发者的操作接口。indexedDB.open方法用于打开数据库。

{% highlight javascript %}

var openRequest = indexedDB.open("test",1);

{% endhighlight %}

open方法的第一个参数是数据库名称，格式为字符串，不可省略；第二个参数是数据库版本，是一个大于0的正整数（0将报错）。上面代码表示，打开一个名为test、版本为1的数据库。如果该数据库不存在，则会新建该数据库。如果省略第二个参数，则会自动创建版本为1的该数据库。

打开数据库的结果是，有可能触发4种事件。

- **success**：打开成功。
- **error**：打开失败。
- **upgradeneeded**：第一次打开该数据库，或者数据库版本发生变化。
- **blocked**：上一次的数据库连接还未关闭。

第一次打开数据库时，会先触发upgradeneeded事件，然后触发success事件。

根据不同的需要，对上面4种事件设立回调函数。

{% highlight javascript %}

var openRequest = indexedDB.open("test",1);
var db;

openRequest.onupgradeneeded = function(e) {
    console.log("Upgrading...");
}
 
openRequest.onsuccess = function(e) {
    console.log("Success!");
    db = e.target.result;
}
 
openRequest.onerror = function(e) {
    console.log("Error");
    console.dir(e);
}

{% endhighlight %}

上面代码有两个地方需要注意。首先，open方法返回的是一个对象（IDBOpenDBRequest），回调函数定义在这个对象上面。其次，回调函数接受一个事件对象event作为参数，它的target.result属性就指向打开的IndexedDB数据库。

## indexedDB实例对象的方法

获得数据库实例以后，就可以用实例对象的方法操作数据库。

### createObjectStore方法

createObjectStore方法用于创建存放数据的“对象仓库”（object store），类似于传统关系型数据库的表格。

{% highlight javascript %}

db.createObjectStore("firstOS");

{% endhighlight %}

上面代码创建了一个名为firstOS的对象仓库，如果该对象仓库已经存在，就会抛出一个错误。为了避免出错，需要用到下文的objectStoreNames属性，检查已有哪些对象仓库。

createObjectStore方法还可以接受第二个对象参数，用来设置“对象仓库”的属性。

{% highlight javascript %}

db.createObjectStore("test", { keyPath: "email" }); 
db.createObjectStore("test2", { autoIncrement: true });

{% endhighlight %}

上面代码中的keyPath属性表示，所存入对象的email属性用作每条记录的键名（由于键名不能重复，所以存入之前必须保证数据的email属性值都是不一样的），默认值为null；autoIncrement属性表示，是否使用自动递增的整数作为键名（第一个数据为1，第二个数据为2，以此类推），默认为false。一般来说，keyPath和autoIncrement属性只要使用一个就够了，如果两个同时使用，表示键名为递增的整数，且对象不得缺少指定属性。

### objectStoreNames属性

objectStoreNames属性返回一个DOMStringList对象，里面包含了当前数据库所有“对象仓库”的名称。可以使用DOMStringList对象的contains方法，检查数据库是否包含某个“对象仓库”。

{% highlight javascript %}

if(!db.objectStoreNames.contains("firstOS")) {
     db.createObjectStore("firstOS");
}

{% endhighlight %}

上面代码先判断某个“对象仓库”是否存在，如果不存在就创建该对象仓库。

### transaction方法

transaction方法用于创建一个数据库事务。向数据库添加数据之前，必须先创建数据库事务。

{% highlight javascript %}

var t = db.transaction(["firstOS"],"readwrite");

{% endhighlight %}

transaction方法接受两个参数：第一个参数是一个数组，里面是所涉及的对象仓库，通常是只有一个；第二个参数是一个表示操作类型的字符串。目前，操作类型只有两种：readonly（只读）和readwrite（读写）。添加数据使用readwrite，读取数据使用readonly。

transaction方法返回一个事务对象，该对象的objectStore方法用于获取指定的对象仓库。

{% highlight javascript %}

var t = db.transaction(["firstOS"],"readwrite");

var store = t.objectStore("firstOS");

{% endhighlight %}

transaction方法有三个事件，可以用来定义回调函数。

- **abort**：事务中断。
- **complete**：事务完成。
- **error**：事务出错。

{% highlight javascript %}

var transaction = db.transaction(["note"], "readonly");  

transaction.oncomplete = function(event) {
      // some code
};

{% endhighlight %}

事务对象有以下方法，用于操作数据。

**（1）添加数据：add方法**

获取对象仓库以后，就可以用add方法往里面添加数据了。

{% highlight javascript %}

var store = t.objectStore("firstOS");

var o = {p: 123};

var request = store.add(o,1);

{% endhighlight %}

add方法的第一个参数是所要添加的数据，第二个参数是这条数据对应的键名（key），上面代码将对象o的键名设为1。如果在创建数据仓库时，对键名做了设置，这里也可以不指定键名。

add方法是异步的，有自己的success和error事件，可以对这两个事件指定回调函数。

{% highlight javascript %}

var request = store.add(o,1);

request.onerror = function(e) {
     console.log("Error",e.target.error.name);
    // error handler
}

request.onsuccess = function(e) {
    console.log("数据添加成功！");
}

{% endhighlight %}

**（2）读取数据：get方法**

读取数据使用get方法，它的参数是数据的键名。

{% highlight javascript %}

var t = db.transaction(["test"], "readonly");
var store = t.objectStore("test");

var ob = store.get(x);

{% endhighlight %}

get方法也是异步的，会触发自己的success和error事件，可以对它们指定回调函数。

{% highlight javascript %}

var ob = store.get(x);
 
ob.onsuccess = function(e) {
	// ...
}

{% endhighlight %}

从创建事务到读取数据，所有操作方法也可以写成下面这样链式形式。

{% highlight javascript %}

db.transaction(["test"], "readonly")
  .objectStore("test")
  .get(X)
  .onsuccess = function(e){}

{% endhighlight %}

**（3）更新记录：put方法**

put方法的用法与add方法相近。

{% highlight javascript %}

var o = { p:456 };
var request = store.put(o, 1);

{% endhighlight %}

**（4）删除记录：delete方法**

删除记录使用delete方法。

{% highlight javascript %}

var t = db.transaction(["people"], "readwrite");
var request = t.objectStore("people").delete(thisId);

{% endhighlight %}

delete方法的参数是数据的键名。另外，delete也是一个异步操作，可以为它指定回调函数。

**（5）遍历数据：openCursor方法**

如果想要遍历数据，就要openCursor方法，它在当前对象仓库里面建立一个读取光标（cursor）。

{% highlight javascript %}

var t = db.transaction(["test"], "readonly");
var store = t.objectStore("test");

var cursor = store.openCursor();

{% endhighlight %}

openCursor方法也是异步的，有自己的success和error事件，可以对它们指定回调函数。

{% highlight javascript %}

cursor.onsuccess = function(e) {
    var res = e.target.result;
    if(res) {
        console.log("Key", res.key);
        console.dir("Data", res.value);
        res.continue();
    }
}

{% endhighlight %}

回调函数接受一个事件对象作为参数，该对象的target.result属性指向当前数据对象。当前数据对象的key和value分别返回键名和键值（即实际存入的数据）。continue方法将光标移到下一个数据对象，如果当前数据对象已经是最后一个数据了，则光标指向null。

openCursor方法还可以接受第二个参数，表示遍历方向，默认值为next，其他可能的值为prev、nextunique和prevunique。后两个值表示如果遇到重复值，会自动跳过。

### createIndex方法

createIndex方法用于创建索引。

假定对象仓库中的数据对象都是下面person类型的。

{% highlight javascript %}

var person = {
    name:name,
    email:email,
    created:new Date()
}

{% endhighlight %}

可以指定这个数据对象的某个属性来建立索引。

{% highlight javascript %}

var store = db.createObjectStore("people", { autoIncrement:true });

store.createIndex("name","name", {unique:false});
store.createIndex("email","email", {unique:true});

{% endhighlight %}

createIndex方法接受三个参数，第一个是索引名称，第二个是建立索引的属性名，第三个是参数对象，用来设置索引特性。unique表示索引所在的属性是否有唯一值，上面代码表示name属性不是唯一值，email属性是唯一值。

### index方法

有了索引以后，就可以针对索引所在的属性读取数据。index方法用于从对象仓库返回指定的索引。

```javascript

var t = db.transaction(["people"],"readonly");
var store = t.objectStore("people");
var index = store.index("name");

var request = index.get(name);

```

上面代码打开对象仓库以后，先用index方法指定索引在name属性上面，然后用get方法读取某个name属性所在的数据。如果没有指定索引的那一行代码，get方法只能按照键名读取数据，而不能按照name属性读取数据。需要注意的是，这时get方法有可能取回多个数据对象，因为name属性没有唯一值。

另外，get是异步方法，读取成功以后，只能在success事件的回调函数中处理数据。

## IDBKeyRange对象

索引的有用之处，还在于可以指定读取数据的范围。这需要用到浏览器原生的IDBKeyRange对象。

IDBKeyRange对象的作用是生成一个表示范围的Range对象。生成方法有四种：

- **lowerBound方法**：指定范围的下限。
- **upperBound方法**：指定范围的上限。
- **bound方法**：指定范围的上下限。
- **only方法**：指定范围中只有一个值。

下面是一些代码实例：

{% highlight javascript %}

// All keys ≤ x	
var r1 = IDBKeyRange.upperBound(x);

// All keys < x	
var r2 = IDBKeyRange.upperBound(x, true);

// All keys ≥ y	
var r3 = IDBKeyRange.lowerBound(y);

// All keys > y	
var r4 = IDBKeyRange.lowerBound(y, true);

// All keys ≥ x && ≤ y	
var r5 = IDBKeyRange.bound(x, y);

// All keys > x &&< y	
var r6 = IDBKeyRange.bound(x, y, true, true);

// All keys > x && ≤ y	
var r7 = IDBKeyRange.bound(x, y, true, false);

// All keys ≥ x &&< y	
var r8 = IDBKeyRange.bound(x, y, false, true);

// The key = z	
var r9 = IDBKeyRange.only(z);

{% endhighlight %}

前三个方法（lowerBound、upperBound和bound）默认包括端点值，可以传入一个布尔值，修改这个属性。

生成Range对象以后，将它作为参数输入openCursor方法，就可以在所设定的范围内读取数据。

{% highlight javascript %}

var t = db.transaction(["people"],"readonly");
var store = t.objectStore("people");
var index = store.index("name");

var range = IDBKeyRange.bound('B', 'D');

index.openCursor(range).onsuccess = function(e) {
        var cursor = e.target.result;
        if(cursor) {
            console.log(cursor.key + ":");
            for(var field in cursor.value) {
                console.log(cursor.value[field]);
            }
            cursor.continue();
        }
}

{% endhighlight %}

## 参考链接

- Raymond Camden, [Working With IndexedDB – Part 1](http://net.tutsplus.com/tutorials/javascript-ajax/working-with-indexeddb/)
- Raymond Camden, [Working With IndexedDB – Part 2](http://net.tutsplus.com/tutorials/javascript-ajax/working-with-indexeddb-part-2/)
- Tiffany Brown, [An Introduction to IndexedDB](http://dev.opera.com/articles/introduction-to-indexeddb/)
- David Fahlander, [Breaking the Borders of IndexedDB](https://hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb/)
