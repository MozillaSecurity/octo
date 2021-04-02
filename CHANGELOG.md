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
