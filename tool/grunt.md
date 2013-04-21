---
title: 任务管理工具Grunt
category: tool
layout: page
date: 2013-04-21
modifiedOn: 2013-04-21
---

在Javascript的开发过程中，经常会遇到一些重复性的任务，比如合并文件、压缩代码、检查语法错误、将Sass代码转成CSS代码等等。通常，我们需要使用不同的工具，来完成不同的任务，既重复劳动又非常耗时。Grunt就是为了解决这个问题，而发明的工具。它可以帮助我们自动管理和运行各种任务。

## 安装

Grunt基于Node.js，所以安装之前要先安装Node.js，然后运行下面的命令。

{% highlight bash %}

npm install grunt-cli -g

{% endhighlight %}

Grunt使用模块结构，除了安装核心文件以外，还可以根据需要安装所需的模块。我们要在项目的根目录下，创建一个文本文件package.json，指定所需的模块，下面就是例子。

{% highlight javascript %}

{
  "name": "my-project-name",
  "version": "0.1.0",
  "devDependencies": {
    "grunt": "~0.4.0",
    "grunt-contrib-jshint": "~0.1.0",
    "grunt-contrib-concat": "~0.1.1",
    "grunt-contrib-uglify": "~0.1.0",
    "grunt-contrib-watch": "~0.1.4"
  }
}

{% endhighlight %}

上面这个package.json文件中，除了注明项目的名称和版本以外，还在devDependencies属性中指定了项目依赖的grunt模块和版本：核心文件0.4.0版，jshint插件0.1.0版，concat插件0.1.1版，uglify插件0.1.0，watch插件0.1.4版。

然后，在项目的根目录下运行下面的命令，这些插件就会被自动安装。

{% highlight bash %}

npm install

{% endhighlight %}

## 命令文件

在项目的根目录下，新建命令文件Gruntfile.js，由它来执行各种任务。

Gruntfile.js就是一般的Node.js模块的写法。

{% highlight javascript %}

module.exports = function(grunt) {

  // Initializes the Grunt tasks with the following settings
  grunt.initConfig({

    // A list of files, which will be syntax-checked by JSHint
    jshint: { … },

    // Files to be concatenated … (source and destination files)
    concat: { … },

    // … and minified (source and destination files)
    uglify: { … },

    // Tasks being executed with 'grunt watch'
    watch: { … }
  });

  // Load the plugins that provide the tasks we specified in package.json.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // This is the default task being executed if Grunt
  // is called without any further parameter.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};

{% endhighlight %}

上面的代码用到了grunt代码的三个方法：

- grunt.initConfig：定义了执行各种任务所需的参数。
- grunt.loadNpmTasks：加载完成任务所需的插件。
- grunt.registerTask：定义了默认模式，即如果直接输入grunt命令，后面不跟任何参数，这时所需要完成的任务。

上面的代码一共定义了四个任务：jshint（检查语法错误）、concat（合并文件）、uglify（压缩代码）和watch（自动执行）。要执行某个任务，只需在grunt后面加上这个任务即可，比如grunt jshint。

## 任务实例

### 检查语法错误

jshint用来检查语法错误，比如分号的使用是否正确、有没有忘记写括号等等。

{% highlight javascript %}

jshint: {
  files: ['Gruntfile.js', 'lib/**/*.js']
},

{% endhighlight %}

上面代码指定，先检查Gruntfile.js的语法错误，再检查lib目录的所有子目录下面的JavaScript文件的语法错误。

### 合并文件

concat用来合并同类文件，它不仅可以合并JavaScript文件，还可以合并CSS文件。

{% highlight javascript %}

concat: {
  js: {
    src: ['lib/module1.js', 'lib/module2.js', 'lib/plugin.js'],
    dest: 'dist/script.js'
  }
  css: {
    src: ['style/normalize.css', 'style/base.css', 'style/theme.css'],
    dest: 'dist/screen.css'
  }
},

{% endhighlight %}

js属性指定合并的JavaScript文件，它的src属性指定需要合并的多个文件，dest属性指定输出的目标文件。

### 压缩代码

uglify用来压缩代码，减小文件体积。「

{% highlight javascript %}

uglify: {
  dist: {
    src: ['dist/script.js'],
    dest: 'dist/script.min.js'
  }
},

{% endhighlight %}

### 自动执行任务

watch用来在后台运行，监听指定事件，然后自动运行指定的任务。

{% highlight javascript %}

watch: {
  files: '<%= jshint.files %>',
  tasks: 'jshint'
},

{% endhighlight %}

运行grunt watch以后，grunt命令就在后台监听jslint对象的files属性中所指定的那些文件。一旦任一个文件发生变化，就自动运行jshint任务。

## 参考链接

- Frederic Hemberger, [A build tool for front-end projects](http://frederic-hemberger.de/artikel/grunt-buildtool-for-frontend-projects/)
