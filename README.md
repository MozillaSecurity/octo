<p align="center">
  <img src="https://github.com/posidron/posidron.github.io/raw/master/static/images/octo.png" alt="Logo" />
</p>

<p align="center">
A unified shared library which aids in building fuzzers for browsers or as complement for an already existing fuzzing framework.
</p>

<p align="center">
<a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide"></a>
<!--<a href="https://travis-ci.org/MozillaSecurity/octo"><img src="https://api.travis-ci.org/MozillaSecurity/octo.svg?branch=es6" alt="Build Status"></a>-->
<!--<a href="https://img.shields.io/github/release/mozillasecurity/octo.svg"><img src="https://img.shields.io/github/release/mozillasecurity/octo.svg" alt="Current Release"></a>-->
<!--<a href="https://coveralls.io/github/MozillaSecurity/octo?branch=es6"><img src="https://coveralls.io/repos/github/MozillaSecurity/octo/badge.svg?branch=es6" alt="Coverage Status"></a>-->
<a href="https://www.irccloud.com/invite?channel=%23fuzzing&amp;hostname=irc.mozilla.org&amp;port=6697&amp;ssl=1"><img src="https://img.shields.io/badge/IRC-%23fuzzing-1e72ff.svg?style=flat" alt="IRC"></a>
</p>

Octo.js bundles core functions and generic boilerplate code commonly used in most frameworks for fuzzing browsers. It is designed for the sharing of improvements between our individual fuzzers, and with the purpose of reducing the maintainability of those core features with minimal effort.

Octo's future aims to be a stable, well-tested and well-documented standard library for fuzzing in a JavaScript environment.

## Note
The ES6 branch is under active development while we are incorporating it with our existing fuzzers.


## Playbook

https://runkit.com/posidron/octo-js-playbook


## Node

```
npm i @mozillasecurity/octo
```

```
const {random} = require('@mozillasecurity/octo')
random.init()
```


## Browser

We have not yet merged ES6 to master, hence the browser version which was released on master is not up-to-date.
Use the `dist/octo.js` version of this branch by running the following command.

```
npm run build
```


## Development

```bash
npm install
npm run build
npm run watch
npm run test:lint
```

## Testing

Tests live in the `tests/` subdirectory, and are written for [QUnit](https://qunitjs.com/).
To run tests locally, open `tests/index.html` in a browser.
The automated tests are run in Firefox or Chrome using [Karma](https://karma-runner.github.io/).
To run the automated tests:

```bash
npm test
```
