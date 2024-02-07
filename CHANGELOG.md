# [3.0.0-next.35](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.34...v3.0.0-next.35) (2024-02-07)


### Bug Fixes

* bind calls to random functions when used with random.choose ([798b722](https://github.com/MozillaSecurity/octo/commit/798b7220ec967cef5e01b7aec955a81fe9435045))

# [3.0.0-next.34](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.33...v3.0.0-next.34) (2024-02-06)


### Bug Fixes

* let random.pick evaluate functions ([0dfaf13](https://github.com/MozillaSecurity/octo/commit/0dfaf13fa00845150b12512ada52590506622917))
* remove unnecessary dynamic type checks ([b4c3858](https://github.com/MozillaSecurity/octo/commit/b4c385844e9168f24105bc52d44abf66e01d486e))
* set minimum node version to 20.0.0 ([b4c095f](https://github.com/MozillaSecurity/octo/commit/b4c095f0efd8707a9cc04134ec821aa8c36c85e0))
* simplify limit check ([ac49b2f](https://github.com/MozillaSecurity/octo/commit/ac49b2fce7ac5f1fb4cbc21043b4c96b1eb3f377))


### Features

* export ranged type options ([8da31fb](https://github.com/MozillaSecurity/octo/commit/8da31fb28d9b956c384499d15c34efc488a91034))
* modify random to use singleton pattern ([ad06485](https://github.com/MozillaSecurity/octo/commit/ad064851d5ee242e7708e8b3ee656bf55595a50c))

# [3.0.0-next.33](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.32...v3.0.0-next.33) (2023-11-06)


### Build System

* set minimum node version to 18.17.0 ([eef92e4](https://github.com/MozillaSecurity/octo/commit/eef92e416f65203a05e9ba1bb34ef386577178f3))


### BREAKING CHANGES

* Updates minimum node version.

# [3.0.0-next.32](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.31...v3.0.0-next.32) (2023-11-03)


### Features

* mass update of package dependencies ([df0d184](https://github.com/MozillaSecurity/octo/commit/df0d184c43cb6cef63aee4e1080f019e744e1f12))
* strongly type the return value of filledArray ([6ad0fa1](https://github.com/MozillaSecurity/octo/commit/6ad0fa111581dad4702c4e3230536ba4d64a74e9))
* to ensure array methods are strongly typed, throw if list is empty ([9ed4342](https://github.com/MozillaSecurity/octo/commit/9ed434209c1e2783b69bb4647774daed9da4b119))

# [3.0.0-next.31](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.30...v3.0.0-next.31) (2023-03-23)


### Reverts

* Revert "feat(utils.script): increase loop iteration count to 8000" ([ad8c46d](https://github.com/MozillaSecurity/octo/commit/ad8c46d34269f46dfead90e796aff875b482e69b))

# [3.0.0-next.30](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.29...v3.0.0-next.30) (2023-03-13)


### Features

* **utils.script:** increase loop iteration count to 8000 ([18a2998](https://github.com/MozillaSecurity/octo/commit/18a299867d5a6d44e735ec171fe906a5cbc00d48))

# [3.0.0-next.29](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.28...v3.0.0-next.29) (2023-01-12)


### Features

* escape double quotes ([5e4ec7e](https://github.com/MozillaSecurity/octo/commit/5e4ec7e28a55c5180e01f1339b668fe7882e5340))


### BREAKING CHANGES

* This commit doesn't modify the API.  It does however,
modify how strings are quoted and may impact users who are manually
wrapping values with quotes.

# [3.0.0-next.28](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.27...v3.0.0-next.28) (2022-11-18)


### Features

* treat flex types as ranged data types ([2eee378](https://github.com/MozillaSecurity/octo/commit/2eee378c6010c011895627d6b8c325c45506959e))

# [3.0.0-next.27](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.26...v3.0.0-next.27) (2022-09-26)


### Bug Fixes

* only update suffix if min does not contain a unit ([c27f3ce](https://github.com/MozillaSecurity/octo/commit/c27f3ce098d8828a8ee1c839f6518ef5535bb473))

# [3.0.0-next.26](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.25...v3.0.0-next.26) (2022-09-07)


### Features

* **make.css:** add generator for the <an-plus-b> datatype ([f5d835b](https://github.com/MozillaSecurity/octo/commit/f5d835b4546867108ee3c13bc0ee48e17551203d))

# [3.0.0-next.25](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.24...v3.0.0-next.25) (2022-09-01)


### Bug Fixes

* update typescript to 4.8.2 ([3ef5ea2](https://github.com/MozillaSecurity/octo/commit/3ef5ea2f290371bfcb95dc442f51a3743c7bddde))

# [3.0.0-next.24](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.23...v3.0.0-next.24) (2022-09-01)


### Features

* add unit conversions for relative viewport percentages ([#52](https://github.com/MozillaSecurity/octo/issues/52)) ([b42cefe](https://github.com/MozillaSecurity/octo/commit/b42cefe8d236d583fa8189779b38bc228bb46d50))

# [3.0.0-next.23](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.22...v3.0.0-next.23) (2022-09-01)


### Features

* add support for datatype ranged values containing units ([#48](https://github.com/MozillaSecurity/octo/issues/48)) ([b55817c](https://github.com/MozillaSecurity/octo/commit/b55817ca3d9a54545bfa2100caeeb1ed6e7e2a95))

# [3.0.0-next.22](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.21...v3.0.0-next.22) (2022-07-06)


### Bug Fixes

* **make.numbers:** set correct uint32 max ([4bb1090](https://github.com/MozillaSecurity/octo/commit/4bb10908dd61c9757aa68ff4da75d3daab40d0c6))

# [3.0.0-next.21](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.20...v3.0.0-next.21) (2022-05-16)


### Bug Fixes

* fix typo in pname generated by randomTexParameterValue ([f6b6cec](https://github.com/MozillaSecurity/octo/commit/f6b6cec329ebecdcad77e9ba0b29c45a53d8fe16))

# [3.0.0-next.20](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.19...v3.0.0-next.20) (2022-05-16)


### Features

* add attribute to webgl shaders ([236c5d1](https://github.com/MozillaSecurity/octo/commit/236c5d1382837a72e064d7171b13efb9f7e0a9aa))

# [3.0.0-next.19](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.18...v3.0.0-next.19) (2022-05-05)


### Bug Fixes

* remove duplicate entries in husky config ([f81d885](https://github.com/MozillaSecurity/octo/commit/f81d885b4f4ace2783d749061c422a2ffc368ae3))
* remove webpack bundling and add prepublish script ([c1878a8](https://github.com/MozillaSecurity/octo/commit/c1878a8f587865fea76c6af528f5b3cc5dcd9edf))

# [3.0.0-next.18](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.17...v3.0.0-next.18) (2022-05-05)


### Bug Fixes

* update html-entities usage to match installed version ([e06b25b](https://github.com/MozillaSecurity/octo/commit/e06b25b54aaafb96d71d407b4563288e700b7201))

# [3.0.0-next.17](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.16...v3.0.0-next.17) (2022-05-05)


### Features

* replace shaders with more complete samples ([7b95bb0](https://github.com/MozillaSecurity/octo/commit/7b95bb0a538c03fa3d457e6bc4598c6c7dd78f4e))


### BREAKING CHANGES

* Modifies the public shader.fragment and shader.vertex
method output.

# [3.0.0-next.16](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.15...v3.0.0-next.16) (2022-04-06)


### Bug Fixes

* **make.webgl:** webgl2 pixelStorei params must be non-negative ([461cf15](https://github.com/MozillaSecurity/octo/commit/461cf15e4608ed00d5614d14d69b34389656afcb))


### Reverts

* Revert "fix(utils.script): return 0 if offset generates NaN" ([e1d2d88](https://github.com/MozillaSecurity/octo/commit/e1d2d88d783047baf4ec26afe52a0f9258f0b91b))

# [3.0.0-next.15](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.14...v3.0.0-next.15) (2022-03-21)


### Bug Fixes

* **make.numbers:** return int32 values within boundary ([4bc66c3](https://github.com/MozillaSecurity/octo/commit/4bc66c3f10cbff04f44b5e751ac047c1567b5b8a))

# [3.0.0-next.14](https://github.com/MozillaSecurity/octo/compare/v3.0.0-next.13...v3.0.0-next.14) (2022-03-18)


### Bug Fixes

* **utils.script:** return 0 if offset generates NaN ([7d525b1](https://github.com/MozillaSecurity/octo/commit/7d525b109f79ba033d51904bec907d5d62ff857d))

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
