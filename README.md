<p align="center">
  <img src="https://github.com/posidron/posidron.github.io/raw/master/static/images/octo.png" alt="Logo" />
</p>

<p align="center">
A unified shared library which aids in building fuzzers for browsers or as complement for an already existing fuzzing framework.
</p>

<p align="center">
<a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide"></a>
<a href="https://travis-ci.org/MozillaSecurity/octo"><img src="https://api.travis-ci.org/MozillaSecurity/octo.svg?branch=master" alt="Build Status"></a>
<a href="https://img.shields.io/github/release/mozillasecurity/octo.svg"><img src="https://img.shields.io/github/release/mozillasecurity/octo.svg" alt="Current Release"></a>
<a href="https://coveralls.io/github/MozillaSecurity/octo?branch=master"><img src="https://coveralls.io/repos/github/MozillaSecurity/octo/badge.svg?branch=master" alt="Coverage Status"></a>
<a href="https://www.irccloud.com/invite?channel=%23fuzzing&amp;hostname=irc.mozilla.org&amp;port=6697&amp;ssl=1"><img src="https://img.shields.io/badge/IRC-%23fuzzing-1e72ff.svg?style=flat" alt="IRC"></a>
</p>

Octo.js bundles core functions and generic boilerplate code commonly used in most frameworks for fuzzing browsers. It is designed for the sharing of improvements between our individual fuzzers, and with the purpose of reducing the maintainability of those core features with minimal effort.

Octo's future aims to be a stable, well-tested and well-documented standard library for fuzzing in a JavaScript environment.


## Usage

```html
<!-- Latest -->
https://mozillasecurity.github.io/octo/octo.js

```

```html
<!-- Release -->
https://github.com/mozillasecurity/octo/releases/download/0.0.3/octo.js
```

```html
<!-- Release -->
https://cdn.jsdelivr.net/gh/MozillaSecurity/octo@0.0.3/deploy/octo.js
```

## Development

```bash
npm install
npm run build
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
