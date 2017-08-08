![Logo](https://github.com/posidron/posidron.github.io/raw/master/static/images/octo.png)

[![Build Status](https://api.travis-ci.org/MozillaSecurity/octo.svg?branch=master)](https://travis-ci.org/MozillaSecurity/octo) [![Coverage Status](https://coveralls.io/repos/github/MozillaSecurity/octo/badge.svg?branch=master)](https://coveralls.io/github/MozillaSecurity/octo?branch=master) [![JavaScript Style
Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![IRC](https://img.shields.io/badge/IRC-%23fuzzing-1e72ff.svg?style=flat)](https://www.irccloud.com/invite?channel=%23fuzzing&amp;hostname=irc.mozilla.org&amp;port=6697&amp;ssl=1)
[![Current Release](https://img.shields.io/github/release/mozillasecurity/octo.svg)](https://img.shields.io/github/release/mozillasecurity/octo.svg)
[![Downloads](https://img.shields.io/github/downloads/mozillasecurity/octo/total.svg)](https://img.shields.io/github/downloads/mozillasecurity/octo/total.svg)


Octo.js is a unified shared library which aids in building fuzzers for browsers or as complement for an already existing fuzzing framework. 

It bundles core functions and generic boilerplate code commonly used in most frameworks for fuzzing browsers. It is designed for the sharing of improvements between our individual fuzzers, and with the purpose of reducing the maintainability of those core features with minimal effort.

Octo's future is a stable, well-tested and well-documented standard library for fuzzing in a JavaScript environment.


## Usage

```html
<!-- Latest -->
https://mozillasecurity.github.io/octo/octo.js

```

```html
<!-- Release -->
https://github.com/mozillasecurity/octo/releases/download/0.1/octo.js
```

## Development

```bash
./build.py -l lib -d deploy
```

## Testing

Tests live in the `tests/` subdirectory, and are written for [QUnit](https://qunitjs.com/).
To run tests locally, open `tests/index.html` in a browser.
The automated tests are run in Firefox or Chrome using [Karma](https://karma-runner.github.io/).
To run the automated tests:

```bash
npm install
CHROME_BIN=chromium npm test
```
When adding new files, add them in `index.html` and `karma.conf.js` so they can be tested and included in coverage reports.
