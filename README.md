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
<a href="https://coveralls.io/github/MozillaSecurity/octo?branch=master"><img src="https://coveralls.io/repos/github/MozillaSecurity/octo/badge.svg?branch=master" alt="Coverage Status"></a> <a href="https://david-dm.org/mozillasecurity/octo"><img src="https://img.shields.io/david/mozillasecurity/electron-genesis.svg?style=flat-square" alt="Dependencies Status"></a> <a href="https://david-dm.org/mozillasecurity/octo.svg?style=flat-square?type=dev"><img src="https://img.shields.io/david/dev/mozillasecurity/octo.svg?style=flat-square.svg?style=flat-square" alt="Dev Dependencies Status"></a> <a href="https://www.irccloud.com/invite?channel=%23fuzzing&amp;hostname=irc.mozilla.org&amp;port=6697&amp;ssl=1"><img src="https://img.shields.io/badge/IRC-%23fuzzing-1e72ff.svg?style=flat" alt="IRC"></a>
</p>

Octo.js bundles core functions and generic boilerplate code commonly used in most frameworks for fuzzing browsers. It is designed for the sharing of improvements between our individual fuzzers, and with the purpose of reducing the maintainability of those core features with minimal effort.

Octo's future aims to be a stable, well-tested and well-documented standard library for fuzzing in a JavaScript environment.

## Table of Contents

- [Table of Contents](#table-of-contents)
  - [Playbook](#playbook)
  - [Usage in Node](#usage-in-node)
  - [Usage in Browser](#usage-in-browser)
  - [Development](#development)
  - [Testing](#testing)
  - [API Documentation](#api-documentation)
  - [What do the developers say?](#what-do-the-developers-say)

### Playbook

https://npm.runkit.com/@mozillasecurity/octo

### Usage in Node

```
yarn add @mozillasecurity/octo
```

```js
const { random, make } = require("@mozillasecurity/octo");
random.init();

// Common Operations
make.number.any();
make.text.any();

// WebCrypto
make.crypto.randomAlgorithm();

// WebGL
make.webgl.randomSamplerParameter();
```

Take a look into the API documentation for further use cases.

### Usage in the Browser

```
yarn install
yarn build
```

A bundled production build (`octo.js`) is placed into the local `dist` directory.

### Development

```
yarn lint
yarn test
yarn build
```

### Testing

Octo.js uses Jest for testing. Each directory should contain a `__tests__` folder containing the tests.

```
yarn test
```

### API Documentation

- https://mozillasecurity.github.io/octo

or

```
yarn docs
```

### What do the developers say?

- [Divide-by-zero in [@webrtc::I420Buffer::CropAndScaleFrom]](https://bugzilla.mozilla.org/show_bug.cgi?id=1490700#c1)

  > Impressive that the fuzzer found such a high multiple of 65536. I'd expect it to start with common edge cases like -1, 0, 1, etc.
