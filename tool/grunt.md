---
title: Grunt：任务自动管理工具
category: tool
layout: page
date: 2013-04-21
modifiedOn: 2014-02-14
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
    "grunt": "0.x.x",
    "grunt-contrib-jshint": "*",
    "grunt-contrib-concat": "~0.1.1",
    "grunt-contrib-uglify": "~0.1.0",
    "grunt-contrib-watch": "~0.1.4"
  }
}

{% endhighlight %}

上面这个package.json文件中，除了注明项目的名称和版本以外，还在devDependencies属性中指定了项目依赖的grunt模块和版本：grunt核心模块为最新的0.x.x版，jshint插件为最新版本，concat插件不低于0.1.1版，uglify插件不低于0.1.0版，watch插件不低于0.1.4版。

然后，在项目的根目录下运行下面的命令，这些插件就会被自动安装在node_modules子目录。

{% highlight bash %}

npm install

{% endhighlight %}

上面这种方法是针对已有package.json的情况。如果想要自动生成package.json文件，可以使用npm init命令，按照屏幕提示回答所需模块的名称和版本即可。

{% highlight bash %}

npm init

{% endhighlight %}

如果已有的package.json文件不包括Grunt模块，可以在直接安装Grunt模块的时候，加上--save-dev参数，该模块就会自动被加入package.json文件。

{% highlight bash %}

npm install <module> --save-dev

{% endhighlight %}

比如，对应上面package.json文件指定的模块，需要运行以下npm命令。

{% highlight bash %}

npm install grunt --save-dev
npm install grunt-contrib-jshint --save-dev
npm install grunt-contrib-concat --save-dev
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-watch --save-dev

{% endhighlight %}

## 命令脚本文件Gruntfile.js 

模块安装完以后，下一步在项目的根目录下，新建脚本文件Gruntfile.js。它是grunt的配置文件，就好像package.json是npm的配置文件一样。Gruntfile.js就是一般的Node.js模块的写法。

{% highlight javascript %}

module.exports = function(grunt) {

  // 配置Grunt各种模块的参数
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

  // 每行registerTask定义一个任务
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('check', ['jshint']);

};

{% endhighlight %}

上面的代码用到了grunt代码的三个方法：

- **grunt.initConfig**：定义各种模块的参数，每一个成员项对应一个同名模块。

- **grunt.loadNpmTasks**：加载完成任务所需的模块。

- **grunt.registerTask**：定义具体的任务。第一个参数为任务名，第二个参数是一个数组，表示该任务需要依次使用的模块。default任务名表示，如果直接输入grunt命令，后面不跟任何参数，这时所调用的模块（该例为jshint，concat和uglify）；该例的check任务则表示使用jshint插件对代码进行语法检查。

上面的代码一共加载了四个模块：jshint（检查语法错误）、concat（合并文件）、uglify（压缩代码）和watch（自动执行）。接下来，有两种使用方法。

（1）命令行执行某个模块，比如

{% highlight bash %}

grunt jshint

{% endhighlight %}

上面代码表示运行jshint模块。

（2）命令行执行某个任务。比如

{% highlight bash %}

grunt check

{% endhighlight %}

上面代码表示运行check任务。如果运行成功，就会显示“Done, without errors.”。

如果没有给出任务名，只键入grunt，就表示执行默认的default任务。

## Gruntfile.js实例：grunt-contrib-cssmin模块

下面通过cssmin模块，演示如何编写Gruntfile.js文件。cssmin模块的作用是最小化CSS文件。

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

下面详细解释上面代码中的三个方法，下面一个个来看。

**（1）grunt.loadNpmTasks**

grunt.loadNpmTasks方法载入模块文件。

{% highlight javascript %}

  grunt.loadNpmTasks('grunt-contrib-cssmin');

{% endhighlight %}

你需要使用几个模块，这里就要写几条grunt.loadNpmTasks语句，将各个模块一一加载。

如果加载模块很多，这部分会非常冗长。而且，还存在一个问题，就是凡是在这里加载的模块，也同时出现在package.json文件中。如果使用npm命令卸载模块以后，模块会自动从package.json文件中消失，但是必须手动从Gruntfile.js文件中清除，这样很不方便，一旦忘记，还会出现运行错误。这里有一个解决办法，就是安装load-grunt-tasks模块，然后在Gruntfile.js文件中，用下面的语句替代所有的grunt.loadNpmTasks语句。

{% highlight javascript %}

require('load-grunt-tasks')(grunt);

{% endhighlight %}

这条语句的作用是自动分析package.json文件，自动加载所找到的grunt模块。

**（2）grunt.initConfig**

grunt.initConfig方法用于模块配置，它接受一个对象作为参数。该对象的成员与使用的同名模块一一对应。由于我们要配置的是cssmin模块，所以里面有一个cssmin成员（属性）。

cssmin（属性）指向一个对象，该对象又包含多个成员。除了一些系统设定的成员（比如options），其他自定义的成员称为目标（target）。一个模块可以有多个目标（target），上面代码里面，cssmin模块共有两个目标，一个是“minify”，用于压缩css文件；另一个是“combine”，用于将多个css文件合并一个文件。

每个目标的具体设置，需要参考该模板的文档。就cssmin来讲，minify目标的参数具体含义如下：

- **expand**：如果设为true，就表示下面文件名的占位符（即\*号）都要扩展成具体的文件名。

- **cwd**：需要处理的文件（input）所在的目录。

- **src**：表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。

- **dest**：表示处理后的文件名或所在目录。

- **ext**：表示处理后的文件后缀名。

除了上面这些参数，还有一些参数也是grunt所有模块通用的。

- **filter**：一个返回布尔值的函数，用于过滤文件名。只有返回值为true的文件，才会被grunt处理。

- **dot**：是否匹配以点号（.）开头的系统文件。

- **makeBase**：如果设置为true，就只匹配文件路径的最后一部分。比如，a?b可以匹配/xyz/123/acb，而不匹配/xyz/acb/123。

关于通配符，含义如下：

- \*：匹配任意数量的字符，不包括/。
- ?：匹配单个字符，不包括/。
- \*\*：匹配任意数量的字符，包括/。
- {}：允许使用逗号分隔的列表，表示“or”（或）关系。
- !：用于模式的开头，表示只返回不匹配的情况。

比如，foo/\*.js匹配foo目录下面的文件名以.js结尾的文件，foo/\*\*/\*.js匹配foo目录和它的所有子目录下面的文件名以.js结尾的文件，!\*.css表示匹配所有后缀名不为“.css”的文件。

使用通配符设置src属性的更多例子：

{% highlight javascript %}

{src: 'foo/th*.js'}grunt-contrib-uglify

{src: 'foo/{a,b}*.js'}

{src: ['foo/a*.js', 'foo/b*.js']}

{% endhighlight %}

至于combine目标，就只有一个files参数，表示输出文件是css子目录下的out.min.css，输入文件则是css子目录下的part1.min.css和part2.min.css。

files参数的格式可以是一个对象，也可以是一个数组。

{% highlight javascript %}

files: {
        'dest/b.js': ['src/bb.js', 'src/bbb.js'],
        'dest/b1.js': ['src/bb1.js', 'src/bbb1.js'],
},

// or

files: [
        {src: ['src/aa.js', 'src/aaa.js'], dest: 'dest/a.js'},
        {src: ['src/aa1.js', 'src/aaa1.js'], dest: 'dest/a1.js'},
],

{% endhighlight %}

如果minify目标和combine目标的属性设置有重合的部分，可以另行定义一个与minify和combine平行的options属性。

{% highlight javascript %}

 grunt.initConfig({
    cssmin: {
	  options: { /* ... */ },
      minify: { /* ... */ },
      combine: { /* ... */ }
    }
  });

{% endhighlight %}

**（3）grunt.registerTask**

grunt.registerTask方法定义如何调用具体的任务。“default”任务表示如果不提供参数，直接输入grunt命令，则先运行“cssmin:minify”，后运行“cssmin:combine”，即先压缩再合并。如果只执行压缩，或者只执行合并，则需要在grunt命令后面指明“模块名:目标名”。

{% highlight bash %}

grunt # 默认情况下，先压缩后合并

grunt cssmin:minify # 只压缩不合并

grunt css:combine # 只合并不压缩

{% endhighlight %}

如果不指明目标，只是指明模块，就表示将所有目标依次运行一遍。

{% highlight bash %}

grunt cssmin

{% endhighlight %}

## 常用模块设置

grunt的[模块](http://gruntjs.com/plugins)已经超过了2000个，且还在快速增加。下面是一些常用的模块（按字母排序）。

- **grunt-contrib-clean**：删除文件。
- **grunt-contrib-compass**：使用compass编译sass文件。
- **grunt-contrib-concat**：合并文件。
- **grunt-contrib-copy**：复制文件。
- **grunt-contrib-cssmin**：压缩以及合并CSS文件。
- **grunt-contrib-imagemin**：图像压缩模块。
- **grunt-contrib-jshint**：检查JavaScript语法。
- **grunt-contrib-uglify**：压缩以及合并JavaScript文件。
- **grunt-contrib-watch**：监视文件变动，做出相应动作。

模块的前缀如果是grunt-contrib，就表示该模块由grunt开发团队维护；如果前缀是grunt（比如grunt-pakmanager），就表示由第三方开发者维护。

以下选几个模块，看看它们配置参数的写法，也就是说如何在grunt.initConfig方法中配置各个模块。

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
	expand: true,
	cwd: 'js/origin',
	src : '*.js',
	dest : 'js/'
  }
},

{% endhighlight %}

上面代码中的options属性指定压缩后文件的文件头，以及sourceMap设置；target目标指定输入和输出文件。

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

上面代码将src子目录（只包含它下面的第一层文件和子目录），拷贝到dest子目录下面（即dest/src目录）。如果要更准确控制拷贝行为，比如只拷贝文件、不拷贝目录、不保持目录结构，可以写成下面这样：

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

### grunt-contrib-watch

[watch模块](https://github.com/gruntjs/grunt-contrib-watch)用来在后台运行，监听指定事件，然后自动运行指定的任务。

{% highlight javascript %}

watch: {
   scripts: {
    files: '**/*.js',
    tasks: 'jshint',
	options: {
      livereload: true,
    },
   },
   css: {
    files: '**/*.sass',
    tasks: ['sass'],
    options: {
      livereload: true,
    },
   },
},

{% endhighlight %}

设置好上面的代码，打开另一个进程，运行grunt watch。此后，任何的js代码变动，文件保存后就会自动运行jshint任务；任何sass文件变动，文件保存后就会自动运行sass任务。

需要注意的是，这两个任务的options参数之中，都设置了livereload，表示任务运行结束后，自动在浏览器中重载（reload）。这需要在浏览器中安装[livereload插件](http://livereload.com/)。安装后，livereload的默认端口为localhost:35729，但是也可以用livereload: 1337的形式重设端口（localhost:1337）。

### 其他模块

下面是另外一些有用的模块。

**（1）grunt-contrib-clean**

该模块用于删除文件或目录。

{% highlight javascript %}

clean: {
  build: {
    src: ["path/to/dir/one", "path/to/dir/two"]
  }
}

{% endhighlight %}

**（2）grunt-autoprefixer**

该模块用于为CSS语句加上浏览器前缀。

{% highlight javascript %}

autoprefixer: {
  build: {
    expand: true,
    cwd: 'build',
    src: [ '**/*.css' ],
    dest: 'build'
  }
},

{% endhighlight %}

**（3）grunt-contrib-connect**

该模块用于在本机运行一个Web Server。

{% highlight javascript %}

connect: {
  server: {
    options: {
      port: 4000,
      base: 'build',
      hostname: '*'
    }
  }
}

{% endhighlight %}

connect模块会随着grunt运行结束而结束，为了使它一直处于运行状态，可以把它放在watch模块之前运行。因为watch模块需要手动中止，所以connect模块也就会一直运行。

**（4）grunt-htmlhint**

该模块用于检查HTML语法。

{% highlight javascript %}

htmlhint: {
    build: {
        options: {
            'tag-pair': true,
            'tagname-lowercase': true,
            'attr-lowercase': true,
            'attr-value-double-quotes': true,
            'spec-char-escape': true,
            'id-unique': true,
            'head-script-disabled': true,
        },
        src: ['index.html']
    }
}

{% endhighlight %}

上面代码用于检查index.html文件：HTML标记是否配对、标记名和属性名是否小写、属性值是否包括在双引号之中、特殊字符是否转义、HTML元素的id属性是否为唯一值、head部分是否没有script标记。

**（5）grunt-contrib-sass模块**

该模块用于将SASS文件转为CSS文件。

{% highlight javascript %}

sass: {
    build: {
		options: {
            style: 'compressed'
        },
        files: {
            'build/css/master.css': 'assets/sass/master.scss'
        }
    }
}

{% endhighlight %}

上面代码指定输出文件为build/css/master.css，输入文件为assets/sass/master.scss。

**（6）grunt-markdown**

该模块用于将markdown文档转为HTML文档。

{% highlight javascript %}

markdown: {
    all: {
      files: [
        {
          expand: true,
          src: '*.md',
          dest: 'docs/html/',
          ext: '.html'
        }
      ],
      options: {
        template: 'templates/index.html',
      }
    }
},

{% endhighlight %}

上面代码指定将md后缀名的文件，转为docs/html/目录下的html文件。template属性指定转换时采用的模板，模板样式如下。

{% highlight html %}

<!DOCTYPE html>
<html>
<head>
    <title>Document</title>
</head>
<body>
 
    <div id="main" class="container">
        <%=content%>
    </div>
 
</body>
</html>

{% endhighlight %}

## 参考链接

- Frederic Hemberger, [A build tool for front-end projects](http://frederic-hemberger.de/artikel/grunt-buildtool-for-frontend-projects/)
- Mária Jurčovičová, [Building a JavaScript Library with Grunt.js](http://flippinawesome.org/2013/07/01/building-a-javascript-library-with-grunt-js/)
- Ben Briggs，[Speed Up Your Web Development Workflow with Grunt](http://sixrevisions.com/javascript/grunt-tutorial-01/)
- [Optimizing Images With Grunt](http://blog.grayghostvisuals.com/grunt/image-optimization/)
- Swapnil Mishra, [Simplifying Chores with Grunt](http://howtonode.org/c4e0f8565942d5e6df45fb78b12d19435543c236/simplifying-chores-with-grunt)
- AJ ONeal, [Moving to GruntJS](http://blog.coolaj86.com/articles/moving-to-grunt.html)
- Grunt Documentation, [Configuring tasks](http://gruntjs.com/configuring-tasks)
- Landon Schropp, [Writing an Awesome Build Script with Grunt](http://www.sitepoint.com/writing-awesome-build-script-grunt/)
- Mike Cunsolo, [Get Up And Running With Grunt](http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/)
- Matt Bailey, [A Beginner’s Guide to Using Grunt With Magento](http://www.gpmd.co.uk/blog/a-beginners-guide-to-using-grunt-with-magento/)
- Paul Bakaus, [Supercharging your Gruntfile](http://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/)
