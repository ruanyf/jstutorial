---
title: Express框架
category: nodejs
layout: page
date: 2013-09-13
modifiedOn: 2013-10-04
---

## 概述

Express是目前最流行的基于Node.js的Web开发框架，提供各种模块，可以快速地搭建一个具有完整功能的网站。

Express的上手非常简单，首先新建一个项目目录，假定叫做hello-world。

{% highlight bash %}

$ mkdir hello-world

{% endhighlight %}

进入该目录，新建一个package.json文件，内容如下。

```javascript

{
  "name": "hello-world",
  "description": "hello world test app",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "express": "4.x"
  }
}

```

上面代码定义了项目的名称、描述、版本等，并且指定需要4.0版本以上的Express。

然后，就可以安装了。

```bash

$ npm install

```

安装了Express及其依赖的模块以后，在项目根目录下，新建一个启动文件，假定叫做index.js。

```javascript

var express = require('express');
var app = express();
 
app.use(express.static(__dirname + '/public'));
 
app.listen(8080);

```

上面代码运行之后，访问`http://localhost:8080`，就会在浏览器中打开当前目录的public子目录。如果public目录之中有一个图片文件my_image.png，那么可以用`http://localhost:8080/my_image.png`访问该文件。

你也可以在index.js之中，生成动态网页。

```javascript

// index.js

var express = require('express');
var app = express();
app.get('/', function (req, res) {  
    res.send('Hello world!');
});
app.listen(3000);  

```

然后，在命令行下运行下面的命令，就可以在浏览器中访问项目网站了。

{% highlight bash %}

node index

{% endhighlight %}

默认情况下，网站运行在本机的3000端口，网页显示Hello World。

index.js中的`app.get`用于指定不同的访问路径所对应的回调函数，这叫做“路由”（routing）。上面代码只指定了根目录的回调函数，因此只有一个路由记录，实际应用中，可能有多个路由记录。这时，最好就把路由放到一个单独的文件中，比如新建一个routes子目录。

```javascript

// routes/index.js

module.exports = function (app) {  
    app.get('/', function (req, res) {  
	    res.send('Hello world');
	});
};

```

然后，原来的index.js就变成下面这样。

```javascript

// index.js

var express = require('express');  
var app = express();  
var routes = require('./routes')(app);  
app.listen(3000);  

```

## 运行原理

### 底层：http模块

Express框架建立在node.js内置的http模块上。 http模块生成服务器的原始代码如下。

{% highlight javascript %}

var http = require("http");

var app = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello world!");
});

app.listen(3000, "localhost");

{% endhighlight %}

上面代码的关键是http模块的createServer方法，表示生成一个HTTP服务器实例。该方法接受一个回调函数，该回调函数的参数，分别为代表HTTP请求和HTTP回应的request对象和response对象。

### 对http模块的再包装

Express框架的核心是对http模块的再包装。上面的代码用Express改写如下。

{% highlight javascript %}

var express = require('express');
var app = express();
app.get('/', function (req, res) {  
    res.send('Hello world!');
});
app.listen(3000);  

var express = require("express");
var http = require("http");

var app = express();

app.use(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello world!\n");
});

http.createServer(app).listen(1337);

{% endhighlight %}

比较两段代码，可以看到它们非常接近，唯一的差别是createServer方法的参数，从一个回调函数变成了一个Epress对象的实例。而这个实例使用了use方法，加载了与上一段代码相同的回调函数。

Express框架等于在http模块之上，加了一个中间层，而use方法则相当于调用中间件。

### 什么是中间件

简单说，中间件（middleware）就是处理HTTP请求的函数，用来完成各种特定的任务，比如检查用户是否登录、分析数据、以及其他在需要最终将数据发送给用户之前完成的任务。它最大的特点就是，一个中间件处理完，再传递给下一个中间件。

node.js的内置模块http的createServer方法，可以生成一个服务器实例，该实例允许在运行过程中，调用一系列函数（也就是中间件）。当一个HTTP请求进入服务器，服务器实例会调用第一个中间件，完成后根据设置，决定是否再调用下一个中间件。中间件内部可以使用服务器实例的response对象（ServerResponse，即回调函数的第二个参数），以及一个next回调函数（即第三个参数）。每个中间件都可以对HTTP请求（request对象）做出回应，并且决定是否调用next方法，将request对象再传给下一个中间件。

一个不进行任何操作、只传递request对象的中间件，大概是下面这样：

{% highlight javascript %}

function uselessMiddleware(req, res, next) { 
	next();
}

{% endhighlight %}

上面代码的next为中间件的回调函数。如果它带有参数，则代表抛出一个错误，参数为错误文本。

{% highlight javascript %}

function uselessMiddleware(req, res, next) { 
	next('出错了！');
}

{% endhighlight %}

抛出错误以后，后面的中间件将不再执行，直到发现一个错误处理函数为止。

### use方法

use是express调用中间件的方法，它返回一个函数。下面是一个连续调用两个中间件的例子。

{% highlight javascript %}

var express = require("express");
var http = require("http");

var app = express();

app.use(function(request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
  next();
});

app.use(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello world!\n");
});

http.createServer(app).listen(1337);

{% endhighlight %}

上面代码先调用第一个中间件，在控制台输出一行信息，然后通过next方法，调用第二个中间件，输出HTTP回应。由于第二个中间件没有调用next方法，所以不再request对象就不再向后传递了。

使用use方法，可以根据请求的网址，返回不同的网页内容。

{% highlight javascript %}

var express = require("express");
var http = require("http");

var app = express();

app.use(function(request, response, next) {
  if (request.url == "/") {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Welcome to the homepage!\n");
  } else {
    next();
  }
});

app.use(function(request, response, next) {
  if (request.url == "/about") {
    response.writeHead(200, { "Content-Type": "text/plain" });
  } else {
    next();
  }
});

app.use(function(request, response) {
  response.writeHead(404, { "Content-Type": "text/plain" });
  response.end("404 error!\n");
});

http.createServer(app).listen(1337);

{% endhighlight %}

上面代码通过request.url属性，判断请求的网址，从而返回不同的内容。

除了在回调函数内部，判断请求的网址，Express也允许将请求的网址写在use方法的第一个参数。

{% highlight javascript %}

app.use('/', someMiddleware);

{% endhighlight %}

上面代码表示，只对根目录的请求，调用某个中间件。

因此，上面的代码可以写成下面的样子。

{% highlight javascript %}

var express = require("express");
var http = require("http");

var app = express();

app.use("/", function(request, response, next) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Welcome to the homepage!\n");
});

app.use("/about", function(request, response, next) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Welcome to the about page!\n");
});

app.use(function(request, response) {
  response.writeHead(404, { "Content-Type": "text/plain" });
  response.end("404 error!\n");
});

http.createServer(app).listen(1337);

{% endhighlight %}

## Express的方法

### all方法和HTTP动词方法

针对不同的请求，Express提供了use方法的一些别名。比如，上面代码也可以用别名的形式来写。

{% highlight javascript %}

var express = require("express");
var http = require("http");
var app = express();

app.all("*", function(request, response, next) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  next();
});

app.get("/", function(request, response) {
  response.end("Welcome to the homepage!");
});

app.get("/about", function(request, response) {
  response.end("Welcome to the about page!");
});

app.get("*", function(request, response) {
  response.end("404!");
});

http.createServer(app).listen(1337);

{% endhighlight %}

上面代码的all方法表示，所有请求都必须通过该中间件，参数中的“*”表示对所有路径有效。get方法则是只有GET动词的HTTP请求通过该中间件，它的第一个参数是请求的路径。由于get方法的回调函数没有调用next方法，所以只要有一个中间件被调用了，后面的中间件就不会再被调用了。

除了get方法以外，Express还提供post、put、delete方法，即HTTP动词都是Express的方法。

这些方法的第一个参数，都是请求的路径。除了绝对匹配以外，Express允许模式匹配。

{% highlight javascript %}

app.get("/hello/:who", function(req, res) {
  res.end("Hello, " + req.params.who + ".");
});

{% endhighlight %}

上面代码将匹配“/hello/alice”网址，网址中的alice将被捕获，作为req.params.who属性的值。需要注意的是，捕获后需要对网址进行检查，过滤不安全字符，上面的写法只是为了演示，生产中不应这样直接使用用户提供的值。

如果在模式参数后面加上问号，表示该参数可选。

{% highlight javascript %}

app.get('/hello/:who?',function(req,res) {
	if(req.params.id) {
    	res.end("Hello, " + req.params.who + ".");
	}
    else {
    	res.send("Hello, Guest.");
	}
});

{% endhighlight %}

下面是一些更复杂的模式匹配的例子。

{% highlight javascript %}

app.get('/forum/:fid/thread/:tid', middleware)

// 匹配/commits/71dbb9c
// 或/commits/71dbb9c..4c084f9这样的git格式的网址
app.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/, function(req, res){
  var from = req.params[0];
  var to = req.params[1] || 'HEAD';
  res.send('commit range ' + from + '..' + to);
});

{% endhighlight %}

### set方法

set方法用于指定变量的值。

{% highlight javascript %}

app.set("views", __dirname + "/views");

app.set("view engine", "jade");

{% endhighlight %}

上面代码使用set方法，为系统变量“views”和“view engine”指定值。

### response对象

**（1）response.redirect方法**

response.redirect方法允许网址的重定向。

{% highlight javascript %}

response.redirect("/hello/anime");
response.redirect("http://www.example.com");
response.redirect(301, "http://www.example.com"); 

{% endhighlight %}

**（2）response.sendFile方法**

response.sendFile方法用于发送文件。

{% highlight javascript %}

response.sendFile("/path/to/anime.mp4");

{% endhighlight %}

**（3）response.render方法**

response.render方法用于渲染网页模板。

{% highlight javascript %}

app.get("/", function(request, response) {
  response.render("index", { message: "Hello World" });
});

{% endhighlight %}

上面代码使用render方法，将message变量传入index模板，渲染成HTML网页。

### requst对象

**（1）request.ip**

request.ip属性用于获得HTTP请求的IP地址。

**（2）request.files**

request.files用于获取上传的文件。

## 项目开发实例

### 编写启动脚本

上一节使用express命令自动建立项目，也可以不使用这个命令，手动新建所有文件。

先建立一个项目目录（假定这个目录叫做demo）。进入该目录，新建一个package.json文件，写入项目的配置信息。

{% highlight javascript %}

{
   "name": "demo",
   "description": "My First Express App",
   "version": "0.0.1",
   "dependencies": {
      "express": "3.x"
   }
}

{% endhighlight %}

在项目目录中，新建文件app.js。项目的代码就放在这个文件里面。

{% highlight javascript %}

var express = require('express');
var app = express();

{% endhighlight %}

上面代码首先加载express模块，赋给变量express。然后，生成express实例，赋给变量app。

接着，设定express实例的参数。

{% highlight javascript %}

// 设定port变量，意为访问端口
app.set('port', process.env.PORT || 3000);

// 设定views变量，意为视图存放的目录
app.set('views', path.join(__dirname, 'views'));

// 设定view engine变量，意为网页模板引擎
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// 设定静态文件目录，比如本地文件
// 目录为demo/public/images，访问
// 网址则显示为http://localhost:3000/images
app.use(express.static(path.join(__dirname, 'public')));

{% endhighlight %}

上面代码中的set方法用于设定内部变量，use方法用于调用express的中间件。

最后，调用实例方法listen，让其监听事先设定的端口（3000）。

{% highlight javascript %}

app.listen(app.get('port'));

{% endhighlight %}

这时，运行下面的命令，就可以在浏览器访问http://127.0.0.1:3000。

{% highlight bash %}

node app.js

{% endhighlight %}

网页提示“Cannot GET /”，表示没有为网站的根路径指定可以显示的内容。所以，下一步就是配置路由。

### 配置路由

所谓“路由”，就是指为不同的访问路径，指定不同的处理方法。

**（1）指定根路径**

在app.js之中，先指定根路径的处理方法。

{% highlight javascript %}

app.get('/', function(req, res) {
   res.send('Hello World');
});

{% endhighlight %}

上面代码的get方法，表示处理客户端发出的GET请求。相应的，还有app.post、app.put、app.del（delete是JavaScript保留字，所以改叫del）方法。

get方法的第一个参数是访问路径，正斜杠（/）就代表根路径；第二个参数是回调函数，它的req参数表示客户端发来的HTTP请求，res参数代表发向客户端的HTTP回应，这两个参数都是对象。在回调函数内部，使用HTTP回应的send方法，表示向浏览器发送一个字符串。然后，运行下面的命令。

{% highlight bash %}

node app.js

{% endhighlight %}

此时，在浏览器中访问http://127.0.0.1:3000，网页就会显示“Hello World”。

如果需要指定HTTP头信息，回调函数就必须换一种写法，要使用setHeader方法与end方法。

{% highlight javascript %}

app.get('/', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

{% endhighlight %}

**（2）指定特定路径**

上面是处理根目录的情况，下面再举一个例子。假定用户访问/api路径，希望返回一个JSON字符串。这时，get可以这样写。

{% highlight javascript %}

app.get('/api', function(request, response) {
   response.send({name:"张三",age:40});
});

{% endhighlight %}

上面代码表示，除了发送字符串，send方法还可以直接发送对象。重新启动node以后，再访问路径/api，浏览器就会显示一个JSON对象。

{% highlight javascript %}

{
  "name": "张三",
  "age": 40
}

{% endhighlight %}

我们也可以把app.get的回调函数，封装成模块。先在routes目录下面建立一个api.js文件。

{% highlight javascript %}

// routes/api.js

exports.index = function (req, res){
  res.json(200, {name:"张三",age:40});
}

{% endhighlight %}

然后，在app.js中加载这个模块。

{% highlight javascript %}

// app.js

var api = require('./routes/api');
app.get('/api', api.index);

{% endhighlight %}

现在访问时，就会显示与上一次同样的结果。

如果只向浏览器发送简单的文本信息，上面的方法已经够用；但是如果要向浏览器发送复杂的内容，还是应该使用网页模板。

### 静态网页模板

在项目目录之中，建立一个子目录views，用于存放网页模板。

假定这个项目有三个路径：根路径（/）、自我介绍（/about）和文章（/article）。那么，app.js可以这样写：

{% highlight javascript %}

var express = require('express');
var app = express();
 
app.get('/', function(req, res) {
   res.sendfile('./views/index.html');
});
 
app.get('/about', function(req, res) {
   res.sendfile('./views/about.html');
});
 
app.get('/article', function(req, res) {
   res.sendfile('./views/article.html');
});
 
app.listen(3000);

{% endhighlight %}

上面代码表示，三个路径分别对应views目录中的三个模板：index.html、about.html和article.html。另外，向服务器发送信息的方法，从send变成了sendfile，后者专门用于发送文件。

假定index.html的内容如下：

{% highlight html %}

<html>
<head>
   <title>首页</title>
</head>
 
<body>
<h1>Express Demo</h1>
 
<footer>
<p>
   <a href="/">首页</a> - <a href="/about">自我介绍</a> - <a href="/article">文章</a>
</p>
</footer>
 
</body>
</html>

{% endhighlight %}

上面代码是一个静态网页。如果想要展示动态内容，就必须使用动态网页模板。

## 动态网页模板

网站真正的魅力在于动态网页，下面我们来看看，如何制作一个动态网页的网站。

### 安装模板引擎

Express支持多种模板引擎，这里采用Handlebars模板引擎的服务器端版本[hbs](https://github.com/donpark/hbs)模板引擎。

先安装hbs。

{% highlight html %}

npm install hbs --save-dev

{% endhighlight %}

上面代码将hbs模块，安装在项目目录的子目录node_modules之中。save-dev参数表示，将依赖关系写入package.json文件。安装以后的package.json文件变成下面这样：

{% highlight javascript %}

// package.json文件

{
  "name": "demo",
  "description": "My First Express App",
  "version": "0.0.1",
  "dependencies": {
    "express": "3.x"
  },
  "devDependencies": {
    "hbs": "~2.3.1"
  }
}

{% endhighlight %}

安装模板引擎之后，就要改写app.js。

{% highlight javascript %}

// app.js文件

var express = require('express');
var app = express();

// 加载hbs模块
var hbs = require('hbs');

// 指定模板文件的后缀名为html
app.set('view engine', 'html');

// 运行hbs模块
app.engine('html', hbs.__express);

app.get('/', function (req, res){
	res.render('index');
});

app.get('/about', function(req, res) {
	res.render('about');
});

app.get('/article', function(req, res) {
	res.render('article');
});

{% endhighlight %}

上面代码改用render方法，对网页模板进行渲染。render方法的参数就是模板的文件名，默认放在子目录views之中，后缀名已经在前面指定为html，这里可以省略。所以，res.render('index') 就是指，把子目录views下面的index.html文件，交给模板引擎hbs渲染。

### 新建数据脚本

渲染是指将数据代入模板的过程。实际运用中，数据都是保存在数据库之中的，这里为了简化问题，假定数据保存在一个脚本文件中。

在项目目录中，新建一个文件blog.js，用于存放数据。blog.js的写法符合CommonJS规范，使得它可以被require语句加载。

{% highlight javascript %}

// blog.js文件

var entries = [
	{"id":1, "title":"第一篇", "body":"正文", "published":"6/2/2013"},
	{"id":2, "title":"第二篇", "body":"正文", "published":"6/3/2013"},
	{"id":3, "title":"第三篇", "body":"正文", "published":"6/4/2013"},
	{"id":4, "title":"第四篇", "body":"正文", "published":"6/5/2013"},
	{"id":5, "title":"第五篇", "body":"正文", "published":"6/10/2013"},
	{"id":6, "title":"第六篇", "body":"正文", "published":"6/12/2013"}
];

exports.getBlogEntries = function (){
   return entries;
}
 
exports.getBlogEntry = function (id){
   for(var i=0; i < entries.length; i++){
      if(entries[i].id == id) return entries[i];
   }
}

{% endhighlight %}

### 新建网页模板

接着，新建模板文件index.html。

{% highlight html %}

<!-- views/index.html文件 -->

<h1>文章列表</h1>
 
{{"{{"}}#each entries}}
   <p>
      <a href="/article/{{"{{"}}id}}">{{"{{"}}title}}</a><br/>
      Published: {{"{{"}}published}}
   </p>
{{"{{"}}/each}}

{% endhighlight %}

模板文件about.html。

{% highlight html %}

<!-- views/about.html文件 -->

<h1>自我介绍</h1>
 
<p>正文</p>

{% endhighlight %}

模板文件article.html。

{% highlight html %}

<!-- views/article.html文件 -->

<h1>{{"{{"}}blog.title}}</h1>
Published: {{"{{"}}blog.published}}
 
<p/>
 
{{"{{"}}blog.body}}

{% endhighlight %}

可以看到，上面三个模板文件都只有网页主体。因为网页布局是共享的，所以布局的部分可以单独新建一个文件layout.html。

{% highlight html %}

<!-- views/layout.html文件 -->

<html>
 
<head>
   <title>{{"{{"}}title}}</title>
</head>
 
<body>
 
	{{"{{{"}}body}}}
 
   <footer>
      <p>
         <a href="/">首页</a> - <a href="/about">自我介绍</a>
      </p>
   </footer>
    
</body>
</html>

{% endhighlight %}

### 渲染模板

最后，改写app.js文件。

{% highlight javascript %}

// app.js文件

var express = require('express');
var app = express();
 
var hbs = require('hbs');

// 加载数据模块
var blogEngine = require('./blog');
 
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
 
app.get('/', function(req, res) {
   res.render('index',{title:"最近文章", entries:blogEngine.getBlogEntries()});
});
 
app.get('/about', function(req, res) {
   res.render('about', {title:"自我介绍"});
});
 
app.get('/article/:id', function(req, res) {
   var entry = blogEngine.getBlogEntry(req.params.id);
   res.render('article',{title:entry.title, blog:entry});
});
 
app.listen(3000);

{% endhighlight %}

上面代码中的render方法，现在加入了第二个参数，表示模板变量绑定的数据。

现在重启node服务器，然后访问http://127.0.0.1:3000。

{% highlight bash %}

node app.js

{% endhighlight %}

可以看得，模板已经使用加载的数据渲染成功了。

### 指定静态文件目录

模板文件默认存放在views子目录。这时，如果要在网页中加载静态文件（比如样式表、图片等），就需要另外指定一个存放静态文件的目录。

{% highlight javascript %}

app.use(express.static('public'));

{% endhighlight %}

上面代码在文件app.js之中，指定静态文件存放的目录是public。于是，当浏览器发出非HTML文件请求时，服务器端就到public目录寻找这个文件。比如，浏览器发出如下的样式表请求：

{% highlight javascript %}

<link href="/bootstrap/css/bootstrap.css" rel="stylesheet">

{% endhighlight %}

服务器端就到public/bootstrap/css/目录中寻找bootstrap.css文件。

## ExpressJS 4.0的Router用法

Express 4.0的Router用法，做了大幅改变，增加了很多新的功能。Router成了一个单独的组件，好像小型的express应用程序一样，有自己的use、get、param和route方法。

### 基本用法

Express 4.0的router对象，需要单独新建。然后，使用该对象的HTTP动词方法，为不同的访问路径，指定回调函数；最后，挂载到某个路径

{% highlight javascript %}

var router = express.Router();

router.get('/', function(req, res) {
	res.send('首页');	
});

router.get('/about', function(req, res) {
	res.send('关于');	
});

app.use('/', router);

{% endhighlight %}

上面代码先定义了两个访问路径，然后将它们挂载到根目录。如果最后一行改为app.use('/app', router)，则相当于/app和/app/about这两个路径，指定了回调函数。

这种挂载路径和router对象分离的做法，为程序带来了更大的灵活性，既可以定义多个router对象，也可以为将同一个router对象挂载到多个路径。

### router.route方法

router实例对象的route方法，可以接受访问路径作为参数。

{% highlight javascript %}

var router = express.Router();

router.route('/api')
	.post(function(req, res) {
		// ...
	})
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err) res.send(err);
			res.json(bears);
		});
	});

app.use('/', router);

{% endhighlight %}

### router中间件

use方法为router对象指定中间件，即在数据正式发给用户之前，对数据进行处理。下面就是一个中间件的例子。

{% highlight javascript %}

router.use(function(req, res, next) {
	console.log(req.method, req.url);
	next();	
});

{% endhighlight %}

上面代码中，回调函数的next参数，表示接受其他中间件的调用。函数体中的next()，表示将数据传递给下一个中间件。

注意，中间件的放置顺序很重要，等同于执行顺序。而且，中间件必须放在HTTP动词方法之前，否则不会执行。

### 对路径参数的处理

router对象的param方法用于路径参数的处理，可以

{% highlight javascript %}

router.param('name', function(req, res, next, name) {
	// 对name进行验证或其他处理……
	console.log(name);
	req.name = name;
	next();	
});

router.get('/hello/:name', function(req, res) {
	res.send('hello ' + req.name + '!');
});

{% endhighlight %}

上面代码中，get方法为访问路径指定了name参数，param方法则是对name参数进行处理。注意，param方法必须放在HTTP动词方法之前。

### app.route

假定app是Express的实例对象，Express 4.0为该对象提供了一个route属性。app.route实际上是express.Router()的缩写形式，除了直接挂载到根路径。因此，对同一个路径指定get和post方法的回调函数，可以写成链式形式。

{% highlight javascript %}

app.route('/login')
	.get(function(req, res) {
		res.send('this is the login form');
	})
	.post(function(req, res) {
		console.log('processing');
		res.send('processing the login form!');
	});

{% endhighlight %}

上面代码的这种写法，显然非常简洁清晰。

## 参考链接

- Raymond Camden, [Introduction to Express](http://net.tutsplus.com/tutorials/javascript-ajax/introduction-to-express/)
- Christopher Buecheler, [Getting Started With Node.js, Express, MongoDB](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/)
- Stephen Sugden, [A short guide to Connect Middleware](http://stephensugden.com/middleware_guide/)
- Evan Hahn, [Understanding Express.js](http://evanhahn.com/understanding-express/)
- Chris Sevilleja, [Learn to Use the New Router in ExpressJS 4.0](http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4)
