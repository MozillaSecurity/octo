module.exports = function (config) {
  let configuration = {
    basePath: './tests',

    frameworks: ['qunit'],

    files: [
      '../lib/utils/init.js',
      '../lib/utils/*.js',
      '../lib/logging/*.js',
      '../lib/make/init.js',
      '../lib/make/*.js',
      '../lib/random/*.js',
      '**/*.js'
    ],

    exclude: [
    ],

    preprocessors: {
      '../lib/**/*.js': ['coverage']
    },

    reporters: ['progress', 'coverage'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome', 'Firefox'],

    singleRun: true,

    browserNoActivityTimeout: 30000,

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: 'coverage/' },
        { type: 'text-summary' }
      ]
    }
  }

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci', 'Firefox']
  }

  config.set(configuration)
}
