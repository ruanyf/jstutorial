---
title: Gulp：任务自动管理工具
category: tool
layout: page
date: 2014-07-04
modifiedOn: 2014-07-04
---

Gulp与Grunt一样，也是一个自动任务运行器。它充分借鉴了Unix操作系统的管道（pipe）思想，很多人认为，在操作上，它要比Grunt简单。

## 安装

Gulp需要全局安装，然后再在项目的开发目录中安装为本地模块。先进入项目目录，运行下面的命令。

```bash

npm install -g gulp

npm install --save-dev gulp

```

除了安装gulp以外，不同的任务还需要安装不同的gulp插件模块。举例来说，下面代码安装了gulp-uglify模块。

```bash
$ npm install --save-dev gulp-uglify
```

## gulpfile.js

项目根目录中的gulpfile.js，是Gulp的配置文件。下面就是一个典型的gulpfile.js文件。

```javascript

var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('minify', function () {
  gulp.src('js/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('build'))
});

```

上面代码中，gulpfile.js加载gulp和gulp-uglify模块之后，使用gulp模块的task方法指定任务minify。task方法有两个参数，第一个是任务名，第二个是任务函数。在任务函数中，使用gulp模块的src方法，指定所要处理的文件，然后使用pipe方法，将上一步的输出转为当前的输入，进行链式处理。

task方法的回调函数使用了两次pipe方法，也就是说做了两种处理。第一种处理是使用gulp-uglify模块，压缩源码；第二种处理是使用gulp模块的dest方法，将上一步的输出写入本地文件，这里是build.js（代码中省略了后缀名js）。

执行minify任务时，就在项目目录中执行下面命令就可以了。

```bash
$ gulp minify
```

从上面的例子中可以看到，gulp充分使用了“管道”思想，就是一个数据流（stream）：src方法读入文件产生数据流，dest方法将数据流写入文件，中间是一些中间步骤，每一步都对数据流进行一些处理。

下面是另一个数据流的例子。

```javascript

gulp.task('js', function () {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build'));
});

```

上面代码使用pipe命令，分别进行jshint、uglify、concat三步处理。

## gulp模块的方法

### src()

gulp模块的src方法，用于产生数据流。它的参数表示所要处理的文件，这些指定的文件会转换成数据流。参数的写法一般有以下几种形式。

- js/app.js：指定确切的文件名。
- js/*.js：某个目录所有后缀名为js的文件。
- js/\*\*/*.js：某个目录及其所有子目录中的所有后缀名为js的文件。
- !js/app.js：除了js/app.js以外的所有文件。
- *.+(js|css)：匹配项目根目录下，所有后缀名为js或css的文件。

src方法的参数还可以是一个数组，用来指定多个成员。

```javascript

gulp.src(['js/**/*.js', '!js/**/*.min.js'])

```

### dest()

dest方法将管道的输出写入文件，同时将这些输出继续输出，所以可以依次调用多次dest方法，将输出写入多个目录。如果有目录不存在，将会被新建。

```javascript
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

dest方法还可以接受第二个参数，表示配置对象。

```javascript
gulp.dest('build', {
  cwd: './app',
  mode: '0644'
})
```

配置对象有两个字段。cwd字段指定写入路径的基准目录，默认是当前目录；mode字段指定写入文件的权限，默认是0777。

### task()

task方法用于定义具体的任务。它的第一个参数是任务名，第二个参数是任务函数。下面是一个非常简单的任务函数。

```javascript

gulp.task('greet', function () {
   console.log('Hello world!');
});

```

task方法还可以指定按顺序运行的一组任务。

```javascript

gulp.task('build', ['css', 'js', 'imgs']);

```

上面代码先指定build任务，它由css、js、imgs三个任务所组成，task方法会并发执行这三个任务。注意，由于每个任务都是异步调用，所以没有办法保证js任务的开始运行的时间，正是css任务运行结束。

如果希望各个任务严格按次序运行，可以把前一个任务写成后一个任务的依赖模块。

```javascript

gulp.task('css', ['greet'], function () {
   // Deal with CSS here
});

```

上面代码表明，css任务依赖greet任务，所以css一定会在greet运行完成后再运行。

task方法的回调函数，还可以接受一个函数作为参数，这对执行异步任务非常有用。

```javascript
// 执行shell命令
var exec = require('child_process').exec;
gulp.task('jekyll', function(cb) {
  // build Jekyll
  exec('jekyll build', function(err) {
    if (err) return cb(err); // return error
    cb(); // finished task
  });
});
```

如果一个任务的名字为default，就表明它是“默认任务”，在命令行直接输入gulp命令，就会运行该任务。

```javascript

gulp.task('default', function () {
  // Your default task
});

// 或者

gulp.task('default', ['styles', 'jshint', 'watch']);

```

执行的时候，直接使用gulp，就会运行styles、jshint、watch三个任务。

### watch()

watch方法用于指定需要监视的文件。一旦这些文件发生变动，就运行指定任务。

```javascript

gulp.task('watch', function () {
   gulp.watch('templates/*.tmpl.html', ['build']);
});

```

上面代码指定，一旦templates目录中的模板文件发生变化，就运行build任务。

watch方法也可以用回调函数，代替指定的任务。

```javascript

gulp.watch('templates/*.tmpl.html', function (event) {
   console.log('Event type: ' + event.type);
   console.log('Event path: ' + event.path);
});

```

另一种写法是watch方法所监控的文件发生变化时（修改、增加、删除文件），会触发change事件。可以对change事件指定回调函数。

```javascript

var watcher = gulp.watch('templates/*.tmpl.html', ['build']);

watcher.on('change', function (event) {
   console.log('Event type: ' + event.type);
   console.log('Event path: ' + event.path);
});

```

除了change事件，watch方法还可能触发以下事件。

- end：回调函数运行完毕时触发。
- error：发生错误时触发。
- ready：当开始监听文件时触发。
- nomatch：没有匹配的监听文件时触发。

watcher对象还包含其他一些方法。

- watcher.end()：停止watcher对象，不会再调用任务或回调函数。
- watcher.files()：返回watcher对象监视的文件。
- watcher.add(glob)：增加所要监视的文件，它还可以附件第二个参数，表示回调函数。
- watcher.remove(filepath)：从watcher对象中移走一个监视的文件。

## gulp-load-plugins模块

一般情况下，gulpfile.js中的模块需要一个个加载。

```javascript

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('js', function () {
   return gulp.src('js/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('build'));
});

```

上面代码中，除了gulp模块以外，还加载另外三个模块。

这种一一加载的写法，比较麻烦。使用gulp-load-plugins模块，可以加载package.json文件中所有的gulp模块。上面的代码用gulp-load-plugins模块改写，就是下面这样。

```javascript

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

gulp.task('js', function () {
   return gulp.src('js/*.js')
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('default'))
      .pipe(plugins.uglify())
      .pipe(plugins.concat('app.js'))
      .pipe(gulp.dest('build'));
});

```

上面代码假设package.json文件包含以下内容。

```javascript

{
   "devDependencies": {
      "gulp-concat": "~2.2.0",
      "gulp-uglify": "~0.2.1",
      "gulp-jshint": "~1.5.1",
      "gulp": "~3.5.6"
   }
}

```

## gulp-livereload模块

gulp-livereload模块用于自动刷新浏览器，反映出源码的最新变化。它除了模块以外，还需要在浏览器中安装插件，用来配合源码变化。

```javascript

var gulp = require('gulp'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch');

gulp.task('less', function() {
   gulp.src('less/*.less')
      .pipe(watch())
      .pipe(less())
      .pipe(gulp.dest('css'))
      .pipe(livereload());
});

```

上面代码监视less文件，一旦编译完成，就自动刷新浏览器。

## 参考链接

- Callum Macrae, [Building With Gulp](http://www.smashingmagazine.com/2014/06/11/building-with-gulp/)
