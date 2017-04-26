module.exports = function(grunt) {
  let pkg = grunt.file.readJSON('package.json')

  grunt.initConfig({
    pkg: pkg,

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    coveralls: {
      options: {
        coverageDir: 'tests/coverage/',
        force: true
      }
    },
    standard: {
      options: pkg.standard,
      lib: {
        src: ['lib/**/*.js']
      }
    }
  })

  grunt.loadNpmTasks('grunt-karma')
  grunt.loadNpmTasks('grunt-karma-coveralls')
  grunt.loadNpmTasks('grunt-standard')

  grunt.registerTask('test', ['standard', 'karma', 'coveralls'])
}
