/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const make = require('../make')
const random = require('../random')

class number extends make {
  /**
   * generate a number that exceeds the supplied boundary by +- 3
   * @param start
   * @param end
   * @private
   */
  static _exceed (start, end) {
    const value = random.item([start, end])
    const offset = random.range(-3, 3)
    return value + offset
  }

  /**
   * Generate a int8 [-128, 127]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {number}
   */
  static int8 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(-128, 127)
    }

    return random.range(-128, 127)
  }

  /**
   * Generate a uint8 [0, 255]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {number}
   */
  static uint8 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(0, 255)
    }

    return random.range(0, 255)
  }

  /**
   * Generate a int16 [-32768, 32767]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {number}
   */
  static int16 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(-32768, 32767)
    }

    return random.range(-32768, 32767)
  }

  /**
   * Generate a uint16 [0, 65535]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {*}
   */
  static uint16 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(0, 65535)
    }

    return random.range(-0, 65535)
  }

  /**
   * Generate a int32 [-2147483648, 2147483647]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {number}
   */
  static int32 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(-2147483648, 2147483647)
    }

    return random.range(-2147483648, 2147483647)
  }

  /**
   * Generate a uint32 [0, 4294967295]
   * @param bypass {boolean} - Determines if the range should be exceeded
   * @returns {number}
   */
  static uint32 (bypass = false) {
    if (bypass || random.chance(50)) {
      return number._exceed(0, 4294967295)
    }

    return random.range(0, 4294967295)
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
      [1, number.interesting],
      [1, number.float],
      [1, number.unsigned],
      [1, [number.range, number.tiny]]
    ])
    return random.chance(10) ? -value : value
  }
}

module.exports = number
