# [3.0.0-next.13](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.12...v3.0.0-next.13) (2022-03-18)


### Bug Fixes

* **make.numbers:** double should use a min/max of SAFE_INTEGER ([5dbfdd8](https://github.com/MozillaSecurity/octo/commit/5dbfdd8a057fd7d81f4b8f0f68dd62647e1287b8))
* **make.numbers:** remove signed value from uint32 ([b700780](https://github.com/MozillaSecurity/octo/commit/b700780bc8dd32bdaa5e723891054970039dd307))
* **make.shaders:** shader ifdef is not required ([3db1e4b](https://github.com/MozillaSecurity/octo/commit/3db1e4b6db30c5cac9f3653857c96f37caa3fdd6))
* randomTexParameterValue can return string or number params ([3f3ff20](https://github.com/MozillaSecurity/octo/commit/3f3ff206b15748b68a5c0623e641f0c8d7080333))

# [3.0.0-next.12](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.11...v3.0.0-next.12) (2021-12-03)


### Features

* improve support for webgl pixel data types and formats ([#44](https://github.com/MozillaSecurity/octo/issues/44)) ([0897758](https://github.com/MozillaSecurity/octo/commit/08977586a1e2e17e454b4a454389fa653c49e7d7))

# [3.0.0-next.11](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.10...v3.0.0-next.11) (2021-12-03)


### Features

* improve number generation ([#43](https://github.com/MozillaSecurity/octo/issues/43)) ([ed81c2c](https://github.com/MozillaSecurity/octo/commit/ed81c2caa8115c06e31824dc4e914f1b17732d4e))

# [3.0.0-next.10](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.9...v3.0.0-next.10) (2021-12-01)


### Bug Fixes

* parseInt as base-2 ([736ae94](https://github.com/MozillaSecurity/octo/commit/736ae94b34d8d6c96c651143a3007728d0bdb02d))

# [3.0.0-next.9](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.8...v3.0.0-next.9) (2021-11-30)


### Features

* add function for generating array of texture attachments ([ae8c5b8](https://github.com/MozillaSecurity/octo/commit/ae8c5b8c54198d687c8f558b8a99aa5ce50b5e72))

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
