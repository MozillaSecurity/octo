![](http://people.mozilla.com/~cdiehl/img/octo.png)

[![Build Status](https://api.travis-ci.org/MozillaSecurity/octo.svg?branch=master)](https://travis-ci.org/MozillaSecurity/octo) [![Coverage Status](https://coveralls.io/repos/github/MozillaSecurity/octo/badge.svg?branch=master)](https://coveralls.io/github/MozillaSecurity/octo?branch=master)

A fuzzing framework for JavaScript

This is WIP.

## Testing

Tests live in the `tests/` subdirectory, and are written for [QUnit](https://qunitjs.com/).
To run tests locally, open `tests/index.html` in a browser.
The automated tests are run in Firefox/Chrome using [Karma](https://karma-runner.github.io/).
To run the automated tests:

    npm install
    CHROME_BIN=chromium npm test

When adding new files, add them in `index.html` and `karma.conf.js` so they can be tested and included in coverage reports.
