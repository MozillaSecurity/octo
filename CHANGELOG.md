# [3.0.0-next.8](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.7...v3.0.0-next.8) (2021-11-09)


### Bug Fixes

* **make.numbers:** pass bypass parameter to generators ([c3411c9](https://github.com/MozillaSecurity/octo/commit/c3411c9f293c137cd839e608587d6b089fd2a554))

# [3.0.0-next.7](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.6...v3.0.0-next.7) (2021-11-09)


### Features

* **make.numbers:** add interestingUnsigned and rebalance weights ([08df7ac](https://github.com/MozillaSecurity/octo/commit/08df7ac3dbe255616fbbae8985d64f0d318b0db0))
* **make.numbers:** include interesting numbers in signed and unsigned ([a06e380](https://github.com/MozillaSecurity/octo/commit/a06e380ff8ec5bc4dacbf898468eb43d4691bc0c))

# [3.0.0-next.6](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.5...v3.0.0-next.6) (2021-11-09)


### Features

* **make:** adjust weights in numbers.signed and numbers.unsigned ([458c82e](https://github.com/MozillaSecurity/octo/commit/458c82ee643d5e5a34ab300d7e576ab0a8f55a70))
* **make:** allow bypassing limits in numbers.signed and numbers.unsigned ([3218eeb](https://github.com/MozillaSecurity/octo/commit/3218eeb87de8b2aa1a0010d0d543c50cc22a0dc6))
* **make:** numbers._exceed should generate numbers just beyond the limit ([ada6724](https://github.com/MozillaSecurity/octo/commit/ada6724a335741342ec1233b6693a7629a68bce8))

# [3.0.0-next.5](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.4...v3.0.0-next.5) (2021-08-19)


### chore

* trigger release ([837255b](https://github.com/MozillaSecurity/octo/commit/837255b411238abce1224d8d6715a010db6565bc))


### BREAKING CHANGES

* These build changes prevent bundling dependencies when
used as a node module.  This caused issues when checking instanceof of
types that were imported in both the consumer and the bundle.

# [3.0.0-next.4](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.3...v3.0.0-next.4) (2021-05-06)


### Bug Fixes

* resolution does not support calc or negative numbers ([d3ce53c](https://github.com/MozillaSecurity/octo/commit/d3ce53c4011563aa4b49bfca6e5ce8678f2d604c))

# [3.0.0-next.3](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.2...v3.0.0-next.3) (2021-05-05)


### Bug Fixes

* use cssesc to escape css string values ([c9e1c8d](https://github.com/MozillaSecurity/octo/commit/c9e1c8d348e76c27587c483ab047301e92b9744a))

# [3.0.0-next.2](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.1...v3.0.0-next.2) (2021-04-02)


### Bug Fixes

* include numbers.double when calculating numbers.any ([9bfbf4d](https://github.com/MozillaSecurity/octo/commit/9bfbf4d892e7ff4fd115fddb42d57619c28d5a58))
* numbers.double should use Number.[MIN|MAX]_VALUE ([8f02fa0](https://github.com/MozillaSecurity/octo/commit/8f02fa0cfb3d47cb5e1ca54e115c71dbc690470d))

# [3.0.0-next.1](https://github.com/MozillaSecurity/octo/compare/v2.0.0...v3.0.0-next.1) (2021-03-22)


### Bug Fixes

* remove unnecessary type guard to window.console.log ([f0e4892](https://github.com/MozillaSecurity/octo/commit/f0e489230c5e158d5234c9d21ec7e5cc7c074ca8))


### Build System

* bump to version 3 ([410abfc](https://github.com/MozillaSecurity/octo/commit/410abfc4d45e26242894df4df02c5cf7079a0073))


### Reverts

* Revert "Use static number method instead of mersenne directly" ([844dc56](https://github.com/MozillaSecurity/octo/commit/844dc56c9051ef73d89a43ba5a0b6829b249e420))


### BREAKING CHANGES

* Since semantic-release was only recently introduced,
we will mark this change as a breaking change to trigger the next
release.
