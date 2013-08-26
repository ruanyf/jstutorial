---
title: 任务管理工具Grunt
category: tool
layout: page
date: 2013-04-21
modifiedOn: 2013-08-26
---

在Javascript的开发过程中，经常会遇到一些重复性的任务，比如合并文件、压缩代码、检查语法错误、将Sass代码转成CSS代码等等。通常，我们需要使用不同的工具，来完成不同的任务，既重复劳动又非常耗时。Grunt就是为了解决这个问题而发明的工具，可以帮助我们自动管理和运行各种任务。

简单说，Grunt是一个自动任务运行器，会按照预先设定的顺序自动运行一系列的任务。这可以简化工作流程，减轻重复性工作带来的负担。

## 安装

Grunt基于Node.js，安装之前要先安装Node.js，然后运行下面的命令。

{% highlight bash %}

npm install grunt-cli -g

{% endhighlight %}

grunt-cli表示安装的grunt的命令行界面，参数g表示全局安装。

Grunt使用模块结构，除了安装命令行界面以外，还要根据需要安装相应的模块。这些模块应该采用局部安装，因为不同项目可能需要同一个模块的不同版本。

首先，在项目的根目录下，创建一个文本文件package.json，指定当前项目所需的模块。下面就是一个例子。

{% highlight javascript %}

{
  "name": "my-project-name",
  "version": "0.1.0",
  "author": "Your Name",
  "devDependencies": {
    "grunt": "~0.4.0",
    "grunt-contrib-jshint": "~0.1.0",
    "grunt-contrib-concat": "~0.1.1",
    "grunt-contrib-uglify": "~0.1.0",
    "grunt-contrib-watch": "~0.1.4"
  }
}

{% endhighlight %}

上面这个package.json文件中，除了注明项目的名称和版本以外，还在devDependencies属性中指定了项目依赖的grunt模块和版本：核心文件不低于0.4.0版，jshint插件不低于0.1.0版，concat插件不低于0.1.1版，uglify插件不低于0.1.0，watch插件不低于0.1.4版。

然后，在项目的根目录下运行下面的命令，这些插件就会被自动安装在node_modules子目录。

{% highlight bash %}

npm install

{% endhighlight %}

如果使用npm init命令，可以互动地生成package.json文件，只需回答所需模块的名称和版本即可。

{% highlight bash %}

npm init

{% endhighlight %}

如果要在现有的项目中使用Grunt，可以在安装的时候加上--save-dev参数，逐一安装所需模块，该模块就会自动被加入package.json文件。

{% highlight bash %}

npm install grunt --save-dev

npm install <module> --save-dev

{% endhighlight %}

## Gruntfile.js 命令脚本文件 

在项目的根目录下，新建脚本文件Gruntfile.js。它是grunt的配置文件，就好像package.json是npm的配置文件一样。Gruntfile.js就是一般的Node.js模块的写法。

{% highlight javascript %}

module.exports = function(grunt) {

  // 配置Grunt的各种任务的参数
  grunt.initConfig({

    jshint: { /* jshint的参数 */ },
    concat: { /* concat的参数 */ },
    uglify: { /* uglify的参数 */ },
    watch:  { /* watch的参数 */ }

	});

  // 从node_modules目录加载模块文件
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // registerTask 方法用来定义任务的别名，下面就定义了名为default的任务别名。
  // default表示默认情况下，需要完成的任务。
  // 具体的任务用数组表示。如果不需要采取任何动作，就使用空数组（[]）。
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('check', ['jshint']);

};

{% endhighlight %}

上面的代码用到了grunt代码的三个方法：

- grunt.initConfig：定义了执行各种任务所需的参数，每一项就对应一个同名模块。
- grunt.loadNpmTasks：加载完成任务所需的插件。
- grunt.registerTask：定义了具体的任务，上面代码的default任务，表示如果直接输入grunt命令，后面不跟任何参数，这时所需要完成的任务（jshint，concat和uglify）；check任务则表示使用jshint插件对代码进行语法检查。

上面的代码一共加载了四个插件：jshint（检查语法错误）、concat（合并文件）、uglify（压缩代码）和watch（自动执行）。要执行某个任务，只需在grunt后面加上这个任务即可，比如grunt jshint。

定义Gruntfile.js以后，在项目的根目录下面，直接运行grunt命令就表示执行默认的default任务。

{% highlight bash %}

grunt

{% endhighlight %}

如果运行成功，就会显示“Done, without errors.”。

如果要运行check任务，就在grunt命令后面加上任务名。

{% highlight bash %}

grunt check

{% endhighlight %}

## 常用模块

以下我们选几个常用模块，看看它们配置参数的写法，也就是说如何在grunt.initConfig方法中配置各个模块。

- grunt-contrib-cssmin：最小化css文件。
- grunt-contrib-jshint：检查JavaScript语法。
- grunt-contrib-concat：合并文件。
- grunt-contrib-uglify：合并文件，然后将其最小化。
- grunt-contrib-copy ：复制文件。

目前，Grunt项目主页上的[模块总数](http://gruntjs.com/plugins)，已经达到了300多个。

### grunt-contrib-cssmin

cssmin模块用于最小化CSS文件。

{% highlight javascript %}

cssmin: {
      production: {
        expand: true,
        cwd: 'css',
        src: ['*.css'],
        dest: 'css'
      }
    }

{% endhighlight %}

首先，一个模块可以有多种配置，每一个配置就叫做一个目标（target），在上面代码里面“production”就是一个目标。由于多种配置的存在，执行的时候，要指明目标。

{% highlight bash %}

grunt cssmin:production

{% endhighlight %}

如果不指明目标，只是调用模块名。

{% highlight bash %}

grunt cssmin

{% endhighlight %}

那么，就代表所有配置将依次运行一遍。

在每一个配置里面，需要设置具体的配置选项。有一些配置选项是各个模块通用的：

- expand：如果设为true就表示读取下面的扩展设置。
- cwd：需要处理的文件所在的目录。
- src：表示文件的来源。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。比如['*.css']就表示所有后缀名为css的文件。
- dest：表示处理后的文件名或所在目录。

下面是一些src和dest的设置格式举例。

{% highlight javascript %}

// 单个文件
{src: 'foo/this.js', dest: ...}
// 文件数组
{src: ['foo/this.js', 'foo/that.js', 'foo/the-other.js'], dest: ...}
// 通配符
{src: 'foo/th*.js', dest: ...}
{src: 'foo/{a,b}*.js', dest: ...}
{src: ['foo/a*.js', 'foo/b*.js'], dest: ...}

{% endhighlight %}

### grunt-contrib-jshint

jshint用来检查语法错误，比如分号的使用是否正确、有没有忘记写括号等等。它的配置代码要放在grunt.initConfig方法里面。

{% highlight javascript %}

jshint: {
  files: ['Gruntfile.js', 'lib/**/*.js']
},

{% endhighlight %}

上面代码指定，先检查Gruntfile.js的语法错误，再检查lib目录的所有子目录下面的JavaScript文件的语法错误。

### grunt-contrib-concat

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

### grunt-contrib-uglify

uglify用来压缩代码，减小文件体积。

{% highlight javascript %}

uglify: {
  dist: {
    src: ['dist/script.js'],
    dest: 'dist/script.min.js'
  }
},

{% endhighlight %}

### grunt-contrib-watch

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
- Mária Jurčovičová, [Building a JavaScript Library with Grunt.js](http://flippinawesome.org/2013/07/01/building-a-javascript-library-with-grunt-js/)
- Ben Briggs，[Speed Up Your Web Development Workflow with Grunt](http://sixrevisions.com/javascript/grunt-tutorial-01/)
- [Optimizing Images With Grunt](http://blog.grayghostvisuals.com/grunt/image-optimization/)
- Swapnil Mishra, [Simplifying Chores with Grunt](http://howtonode.org/c4e0f8565942d5e6df45fb78b12d19435543c236/simplifying-chores-with-grunt)
