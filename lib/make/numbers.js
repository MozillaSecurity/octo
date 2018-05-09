/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class number extends make {
  static bool () {
    return random.bool()
  }

  static float () {
    let n
    if (random.chance(32)) {
      switch (random.number(4)) {
        case 0:
          n = random.range(Number.MIN_VALUE, Number.MAX_VALUE)
          break
        case 1:
          n = Math.pow(10, 1) / Math.pow(10, random.number(307))
          break
        case 2:
          n = Math.pow(2, random.float() * random.float() * 64)
          break
        case 3:
          n = Math.pow(10, random.range(1, 9)) / Math.pow(10, random.range(1, 9))
          break
      }
      return n
    }
    switch (random.number(6)) {
      default:
        n = random.float()
    }
    return n
  }

  static range () {
    return random.pick([1, 2, 3, 4, 6, 8, 16, 32, 64, number.tiny])
  }

  static frange (min, max, precision) {
    let x = Math.random() * (min - max) + max
    if (precision) {
      let power = Math.pow(10, precision || 0)
      x = Math.round(x * power) / power
    }
    return x
  }

  static tiny () {
    return Math.pow(2, random.number(12))
  }

  static unsigned () {
    if (random.chance(2)) {
      return Math.abs(number.any())
    }
    return Math.pow(2, random.number(random.number(65))) + random.number(3) - 1
  }

  static even (number) {
    return number % 2 === 1 ? ++number : number
  }

  static interesting () {
    return random.choose([
      [10, [-128, -1, 0, 1, 16, 32, 64, 100, 127]],
      [7, [-32768, -129, 128, 255, 256, 512, 1000, 1024, 4096, 32767]],
      [1, [-2147483648, -100663046, -32769, 32768, 65535, 65536, 100663045, 2147483647]]
    ])
  }

  static any () {
    let value = random.choose([
      [1, number.float],
      [1, number.unsigned],
      [1, [number.range, number.tiny]]
    ])
    return random.chance(10) ? -value : value
  }
}

module.exports = number
