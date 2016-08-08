module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        watch: {
            reload: {
                files: ['views/*.jade', '*.html', 'public/stylesheets/*.css', 'public/javascripts/*.js'],
                options: {
                    livereload: true,
                    host: 'localhost',
                    port: 35729
                }
            },
            watch_js_files: {
                files: ['js/*.js', 'js/app/**/*.js'],
                tasks: ['concat', 'minified']
            },
            watch_style_files: {
                files: ['stylus/*.styl'],
                tasks: ['stylus']
            }
        },
        stylus: {
            compile: {
                files: {
                    'public/stylesheets/compiled.css': 'stylus/main.styl'
                }
            }
        },
        concat: {
            dist: {
                src: ['js/app.js', 'js/app/**/*.js'],
                dest: 'js/min/concat.js'
            }
        },
        minified: {
            files: {
                src: ['js/min/concat.js'],
                dest: 'public/javascripts/minified.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-minified');
    grunt.loadNpmTasks('grunt-contrib-stylus');
};