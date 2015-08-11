module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      build: {
        src: 'client/dist/main.js',
        dest: 'client/dist/main.js'
      }
    },

    concat: {
      options: {
        separator: '\n'
      },
      clientscss: {
        src: [
          './client/assets/styles/reset.scss',
          './client/assets/styles/mixins.scss',
          './client/assets/styles/main.scss',
        ],
        dest: './client/assets/styles/combined.scss'
      },
      clientjs: {
        src: [
          './client/app/app.js',
          './client/app/route.js',
          './client/app/controllers/**/*.js',
          './client/app/services/**/*.js',
          './client/app/directives/**/*.js'
        ],
        dest: './client/dist/main.js'
      }
    },

    sass: {
      dist: {
        options: {
          sourceMap: true,
        },
        files: {
          './client/dist/main.css':'./client/assets/styles/combined.scss',
        }
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          './client/dist/main.css': ['./client/dist/main.css']
        }
      }
    },

    watch: {
      serverjs: {
        files: ['server/**/*.js'],
        tasks: ['jshint']
      },
      clientjs: {
        files: ['client/**/*.js', '!client/dist/**/*.*'],
        tasks: ['jshint', 'build']
      },
      clientcss: {
        files: ['client/assets/styles/**/*.scss'],
        tasks: ['concat:clientscss', 'sass']
      }
    },

    jshint: {
      files: [
        'client/**/*.js',
        'server/**/*.js',
      ],
      options: {
        force: 'true',
        ignores: [
          'client/lib/**/*.js',
          'client/dist/**/*.js'
        ]
      }
    },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-nodemon');

  // Dev Env //////////////////////////////////////////////////////////////
  grunt.registerTask('server-dev', function(target) {
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });

    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run(['watch']);
  })

  // Helper Tasks /////////////////////////////////////////////////////////
  grunt.registerTask('default', ['concat', 'sass', 'watch']);
  grunt.registerTask('build', [ 
    'concat', 
    'sass',
    'uglify',
    'cssmin'
  ]);
  grunt.registerTask('start', ['nodemon']);

  grunt.registerTask('test', [
    'jshint'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // Do production server upload/deployment tasks
    }
    else {
      grunt.task.run(['build']);
      grunt.task.run(['server-dev']);
    }
  })

  // Grunt Tasks ///////////////////////////////////////////////////////////////
  grunt.registerTask('deploy', [
    'test',
    'upload'
  ]);
};
