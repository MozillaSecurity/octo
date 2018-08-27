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

## Table of Contents
- [Table of Contents](#table-of-contents)
  - [Playbook](#playbook)
  - [Usage in Node](#usage-in-node)
  - [Usage in Browser](#usage-in-browser)
  - [Develop](#develop)
  - [Testing](#testing)
  - [API Documentation](#api-documentation)

### Playbook

https://runkit.com/posidron/octo-js-playbook


### Usage in Node

```
yarn add @mozillasecurity/octo
```

```
const {random} = require('@mozillasecurity/octo')
random.init()
```

### Usage in Browser

```
yarn build
```

### Develop

```bash
yarn install
yarn lint
yarn test
yarn build
```

### Testing

Octo.js uses Jest for testing. Each directory should contain a `__tests__` folder containing the tests.

```bash
yarn test
```

### API Documentation

* https://

or

```
yarn docs
```
