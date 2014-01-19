module.exports = function(grunt) {
    grunt.initConfig({
		watch: {
		},
        uglify: {
			target : {
				expand: true,
				cwd: 'js/origin',
				src : '*.js',
				dest : 'js/'
			}
		},
    });

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default',['uglify:target']);
};
