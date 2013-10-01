---
title: 任务管理工具Grunt
category: tool
layout: page
date: 2013-04-21
modifiedOn: 2013-09-30
---

在Javascript的开发过程中，经常会遇到一些重复性的任务，比如合并文件、压缩代码、检查语法错误、将Sass代码转成CSS代码等等。通常，我们需要使用不同的工具，来完成不同的任务，既重复劳动又非常耗时。Grunt就是为了解决这个问题而发明的工具，可以帮助我们自动管理和运行各种任务。

简单说，Grunt是一个自动任务运行器，会按照预先设定的顺序自动运行一系列的任务。这可以简化工作流程，减轻重复性工作带来的负担。

## 安装

Grunt基于Node.js，安装之前要先安装Node.js，然后运行下面的命令。

{% highlight bash %}

sudo npm install grunt-cli -g

{% endhighlight %}

grunt-cli表示安装的是grunt的命令行界面，参数g表示全局安装。

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

- **grunt.initConfig**：定义了执行各种任务所需的参数，每一项就对应一个同名模块。

- **grunt.loadNpmTasks**：加载完成任务所需的插件。

- **grunt.registerTask**：定义了具体的任务，上面代码的default任务，表示如果直接输入grunt命令，后面不跟任何参数，这时所需要完成的任务（jshint，concat和uglify）；check任务则表示使用jshint插件对代码进行语法检查。

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

## Gruntfile.js实例：grunt-contrib-cssmin模块

cssmin模块用于最小化CSS文件。

首先，在项目的根目录下安装该模块。

{% highlight bash %}

npm install grunt-contrib-cssmin --save-dev

{% endhighlight %}

然后，新建文件Gruntfile.js。

{% highlight javascript %}

module.exports = function(grunt) {

  grunt.initConfig({
    cssmin: {
      minify: {
        expand: true,
		cwd: 'css/',
		src: ['*.css', '!*.min.css'],
		dest: 'css/',
		ext: '.min.css'
	  },
      combine: {
	    files: {
		  'css/out.min.css': ['css/part1.min.css', 'css/part2.min.css']
		}
	  }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['cssmin:minify','cssmin:combine']);

};

{% endhighlight %}

下面详细解释上面代码中的三个方法。

**（1）grunt.initConfig**

grunt.initConfig方法中的代码是模块配置。一个模块可以完成多种任务，每一种任务就叫做一个目标（target）。上面代码里面，cssmin模块共有两个目标，一个是“minify”，用于压缩css文件；另一个是“combine”，用于将多个css文件合并一个文件。

每个目标的具体设置，需要参考该模板的文档。就cssmin来讲，minify目标的参数具体含义如下：

- **expand**：如果设为true，就表示下面文件名的占位符都要扩展成具体的文件名。

- **cwd**：需要处理的文件（input）所在的目录。

- **src**：表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。比如['*.css']就表示所有后缀名为css的文件；!*.min.css表示所有后缀名不为“.min.css”的文件。

- **dest**：表示处理后的文件名或所在目录。

- **ext**：表示处理后的文件后缀名。

这些参数是grunt所有模块通用的。

下面再举一些src属性设置格式的例子。

{% highlight javascript %}

// 单个文件
{src: 'foo/this.js'}
// 文件数组
{src: ['foo/this.js', 'foo/that.js', 'foo/the-other.js']}
// 通配符
{src: 'foo/th*.js'}
{src: 'foo/{a,b}*.js'}
{src: ['foo/a*.js', 'foo/b*.js']}

{% endhighlight %}

至于combine目标，就只有一个files参数，表示输出文件是css子目录下的out.min.css，输入文件则是css子目录下的part1.min.css和part2.min.css。

**（2）grunt.loadNpmTasks**

grunt.loadNpmTasks方法载入模块文件。

**（3）grunt.registerTask**

grunt.registerTask方法定义调用具体任务的命令。“default”命令表示如果不提供参数，直接输入grunt命令，则先运行“cssmin:minify”，后运行“cssmin:combine”，即先压缩再合并。如果只执行压缩，或者只执行合并，则需要在grunt命令后面指明“模块名:目标名”。

{% highlight bash %}

# 默认情况下，先压缩后合并
grunt

# 只压缩不合并
grunt cssmin:minify

# 只合并不压缩
grunt css:combine

{% endhighlight %}

如果不指明目标，只是调用模块名，就表示将所有目标依次运行一遍。

{% highlight bash %}

grunt cssmin

{% endhighlight %}

## 常用模块设置

以下选几个常用模块，看看它们配置参数的写法，也就是说如何在grunt.initConfig方法中配置各个模块。

- grunt-contrib-jshint：检查JavaScript语法。
- grunt-contrib-concat：合并文件。
- grunt-contrib-uglify：合并文件，然后将其最小化。
- grunt-contrib-copy ：复制文件。
- grunt-contrib-watch：监视文件变动，做出相应动作。

模块的前缀如果是grunt-contrib，就表示该模块由grunt开发团队维护；如果前缀是grunt（比如grunt-pakmanager），就表示由第三方开发者维护。目前，Grunt项目主页上的[模块总数](http://gruntjs.com/plugins)，已经达到了几百个。

### grunt-contrib-jshint

jshint用来检查语法错误，比如分号的使用是否正确、有没有忘记写括号等等。它在grunt.initConfig方法里面的配置代码如下。

{% highlight javascript %}

jshint: {
	options: {
		eqeqeq: true,
		trailing: true
	},
	files: ['Gruntfile.js', 'lib/**/*.js']
},

{% endhighlight %}

上面代码先指定jshint的[检查项目](http://www.jshint.com/docs/options/)，eqeqeq表示要用严格相等运算符取代相等运算符，trailing表示行尾不得有多余的空格。然后，指定files属性，表示检查目标是Gruntfile.js文件，以及lib目录的所有子目录下面的JavaScript文件。

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

js目标用于合并JavaScript文件，css目标用语合并CSS文件。两者的src属性指定需要合并的文件（input），dest属性指定输出的目标文件（output）。

### grunt-contrib-uglify

uglify模块用来压缩代码，减小文件体积。

{% highlight javascript %}

uglify: {
  options: {
    banner: bannerContent,
    sourceMapRoot: '../',
    sourceMap: 'distrib/'+name+'.min.js.map',
    sourceMapUrl: name+'.min.js.map'
  },
  target : {
    src : ['src/**/*.js'],
    dest : 'distrib/' + name + '.min.js'
  }
},

{% endhighlight %}

options属性指定压缩后文件的文件头，以及sourceMap设置；target目标指定输入和输出文件。

### grunt-contrib-copy

[copy模块](https://github.com/gruntjs/grunt-contrib-copy)用于复制文件与目录。

{% highlight javascript %}

copy: {
  main: {
    src: 'src/*',
    dest: 'dest/',
  },
},

{% endhighlight %}

上面代码将src子目录（只包含它下面的第一层文件和子目录），拷贝到dest子目录下面（即dest/src目录）。

{% highlight javascript %}

copy: {
  main: {
    expand: true,
    cwd: 'src/',
    src: '**',
    dest: 'dest/',
    flatten: true,
    filter: 'isFile',
  },
},

{% endhighlight %}

上面代码将src目录及它的子目录下面的所有文件（不含子目录），拷贝到dest子目录下面。

### grunt-contrib-watch

[watch模块](https://github.com/gruntjs/grunt-contrib-watch)用来在后台运行，监听指定事件，然后自动运行指定的任务。

{% highlight javascript %}

watch: {
    files: ['**/*'],
    tasks: ['jshint'],
  },

{% endhighlight %}

上面代码设置，任何的代码变动，就会导致运行jshint。

## 参考链接

- Frederic Hemberger, [A build tool for front-end projects](http://frederic-hemberger.de/artikel/grunt-buildtool-for-frontend-projects/)
- Mária Jurčovičová, [Building a JavaScript Library with Grunt.js](http://flippinawesome.org/2013/07/01/building-a-javascript-library-with-grunt-js/)
- Ben Briggs，[Speed Up Your Web Development Workflow with Grunt](http://sixrevisions.com/javascript/grunt-tutorial-01/)
- [Optimizing Images With Grunt](http://blog.grayghostvisuals.com/grunt/image-optimization/)
- Swapnil Mishra, [Simplifying Chores with Grunt](http://howtonode.org/c4e0f8565942d5e6df45fb78b12d19435543c236/simplifying-chores-with-grunt)
- AJ ONeal, [Moving to GruntJS](http://blog.coolaj86.com/articles/moving-to-grunt.html)
