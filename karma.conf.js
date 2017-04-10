module.exports = function(config) {
    var configuration = {
        basePath: './tests',

        frameworks: ['qunit'],

        files: [
          '../random/*.js',
          '**/*.js'
        ],

        exclude: [
        ],

        preprocessors: {
          '../!(tests)/*.js': ['coverage']
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
            { type: "lcov", dir: "coverage/" },
            { type: 'text-summary' }
          ]
        },
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci', 'Firefox'];
    }

    config.set(configuration);
};
