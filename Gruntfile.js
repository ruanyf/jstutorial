module.exports = function(grunt) {
    grunt.initConfig({
		watch: {
			js: {
				files: 'js/origin/*.js',
				tasks: ['uglify:target']
			},
			css: {
			    files: 'css/origin/*.css',
			    tasks: ['cssmin:minify'],
			}
		},
        uglify: {
			target : {
				expand: true,
				cwd: 'js/origin',
				src : '*.js',
				dest : 'js/'
			}
		},
		cssmin: {
      		minify: {
        		expand: true,
				cwd: 'css/origin/',
				src: ['*.css', '!*.min.css'],
				dest: 'css/',
				ext: '.css'
			},
		}
    });

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default',['uglify:target', 'cssmin:minify']);
};
