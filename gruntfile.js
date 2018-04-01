module.exports = function(grunt) {

    // init
    grunt.initConfig({
      watch: {
        jade: {
          files: ["views/**"],
          //tasks: ['jade'],
          options: {
            livereload: true // 文件更改时重启
          }
        },
        js: {
          files: ["piblic/js/**", "models/**/*.js", "schemas/**/*.js"],
          // tasks: ['jshint'],
          options: {
            livereload: true // 文件更改时重启
          }
        }
      },

      nodemon: {
        dev: {
          script: "app.js",
          options: {
            args: ["dev"],
            callback: function(nodemon) {
              nodemon.on("log", function(event) {
                console.log(event.colour);
              });
            },
            env: {
              PORT: "3000"
            },
            cwd: __dirname,
            ignore: ["node_modules/**"],
            ext: "js,coffee",
            watch: ["server"],
            delay: 1000,
            legacyWatch: true
          }
        },
        exec: {
          options: {
            exec: "less"
          }
        }
      },

      concurrent: {
        tasks: ["nodemon", "watch"],
        options: {
          logConcurrentOutput: true
        }
      },

      mochaTest: {
        test: {
          options: {
            reporter: "spec",
            captureFile: "results.txt", // Optionally capture the reporter output to a file
            quiet: false, // Optionally suppress output to standard out (defaults to false)
            clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
            clearCacheFilter: key => true, // Optionally defines which files should keep in cache
            noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
          },
          src: ["test/**/*.js"]
        }
      }
    });

    // 加载
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent'); // 集合任务
    grunt.loadNpmTasks("grunt-mocha-test");



    grunt.option('force', true);
    // 默认被执行的任务列表
    grunt.registerTask('default', ['concurrent']);

    grunt.registerTask("test", ["mochaTest"]);
};