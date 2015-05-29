module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss', 'bower_components/foundation-icon-fonts']
      },
      dist: {
        options: {
          outputStyle: 'compressed',
          sourceMap: true,
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }
      }
    },

    concat_css: {
      options: {
        // Task-specific options go here. 
      },
      all: {
        src: [
          "css/app.css", 
          "bower_components/foundation-datepicker/stylesheets/foundation-datepicker.css"
          ],
        dest: "css/app.css"
      },
    },

    concat: {
      options: {
        //separator: grunt.util.linefeed + ';' + grunt.util.linefeed,
      },
      dist: {
        src: [
          "bower_components/jquery/dist/jquery.min.js",
          "bower_components/foundation/js/foundation.min.js",
          "bower_components/foundation-datepicker/js/foundation-datepicker.js",
          "bower_components/angular/angular.min.js",
          "bower_components/angular-resource/angular-resource.min.js",
          "bower_components/highcharts/highcharts.js",
          "bower_components/highcharts/modules/exporting.js"
        ],
        dest: 'js/raceberry-pi.js',
      },
    },

    copy: {
      main: {
        src: 'bower_components/modernizr/modernizr.js',
        dest: 'js/modernizr.js',
      },
    },

    watch: {
      grunt: {
        options: {
          reload: true
        },
        files: ['Gruntfile.js']
      },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', ['sass', 'concat_css', 'concat', 'copy']);
  grunt.registerTask('default', ['build','watch']);
}
